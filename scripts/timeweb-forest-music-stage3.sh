#!/usr/bin/env bash
# Stage 3: ForestMusic DNS cutover completion on Timeweb.
# - Do NOT change DNS / CDN / DigitalOcean / MX / NS / TXT
# - Do NOT run global Docker commands
# - Do NOT touch peer Apache vhosts
# - Certbot HTTP-01 only when apex + www publicly resolve to TARGET_IP
# - Replace temporary self-signed SSL with Let's Encrypt
# - HTTP -> HTTPS and www -> apex without redirect loops
set -euo pipefail

TARGET_IP="${TARGET_IP:-188.225.26.192}"
DOMAIN="forest-music.ru"
WWW="www.${DOMAIN}"
DOCROOT="/var/www/${DOMAIN}/public"
SITE_ROOT="/var/www/${DOMAIN}"
HTTP_CONF="/etc/apache2/sites-available/${DOMAIN}.conf"
SSL_CONF="/etc/apache2/sites-available/${DOMAIN}-ssl.conf"
EXPECTED_SHA="${RELEASE_SHA:-1168191f3c7c59ea1a8d226b874b6668ad0dc5e9}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
REPORT="/tmp/forest-music-stage3-${STAMP}.txt"
LE_LIVE="/etc/letsencrypt/live/${DOMAIN}"
ACME_DIR="${DOCROOT}/.well-known/acme-challenge"

log() { echo "$@" | tee -a "${REPORT}"; }

resolve_ipv4_via() {
	# Resolve A via an explicit DNS server (dig @server). Empty on failure.
	local name="$1"
	local server="$2"
	local ip=""
	if command -v dig >/dev/null 2>&1; then
		ip="$(dig +time=3 +tries=1 +short A "${name}" "@${server}" 2>/dev/null \
			| awk '/^[0-9.]+$/{print; exit}')"
	fi
	printf '%s' "${ip}"
}

resolve_ipv4_local() {
	local name="$1"
	local ip=""
	if command -v dig >/dev/null 2>&1; then
		ip="$(dig +time=3 +tries=1 +short A "${name}" 2>/dev/null \
			| awk '/^[0-9.]+$/{print; exit}')"
	fi
	if [ -z "${ip}" ] && command -v getent >/dev/null 2>&1; then
		ip="$(getent ahostsv4 "${name}" | awk '{print $1; exit}')"
	fi
	printf '%s' "${ip}"
}

list_ns() {
	local apex="$1"
	if command -v dig >/dev/null 2>&1; then
		dig +time=3 +tries=1 +short NS "${apex}" 2>/dev/null \
			| sed 's/\.$//' | awk 'NF && $0 !~ /^;/ {print}'
	fi
}

# True when Cloudflare + Google both return TARGET_IP for name.
dns_ready_for_certbot() {
	local name="$1"
	local apex="$2"
	local pub_ok=0
	local auth_ok=0
	local auth_seen=0
	local local_ip pub1 pub2 n aip

	local_ip="$(resolve_ipv4_local "${name}")"
	pub1="$(resolve_ipv4_via "${name}" 1.1.1.1)"
	pub2="$(resolve_ipv4_via "${name}" 8.8.8.8)"
	log "dns_probe name=${name} local=${local_ip:-UNRESOLVED} cf=${pub1:-UNRESOLVED} google=${pub2:-UNRESOLVED}"

	if [ "${pub1}" = "${TARGET_IP}" ] && [ "${pub2}" = "${TARGET_IP}" ]; then
		pub_ok=1
	elif [ "${pub1}" = "${TARGET_IP}" ] || [ "${pub2}" = "${TARGET_IP}" ]; then
		log "dns_partial_public name=${name} (propagation lag between public resolvers)"
	elif [ -n "${pub1}${pub2}" ]; then
		log "dns_wrong_public name=${name} (still CDN or other IP; need ${TARGET_IP})"
	else
		log "dns_public_unresolved name=${name}"
	fi

	while read -r n; do
		[ -z "${n}" ] && continue
		aip="$(resolve_ipv4_via "${name}" "${n}")"
		log "dns_auth name=${name} ns=${n} ip=${aip:-UNRESOLVED_OR_TIMEOUT}"
		auth_seen=1
		if [ "${aip}" = "${TARGET_IP}" ]; then
			auth_ok=1
		elif [ -n "${aip}" ] && [ "${aip}" != "${TARGET_IP}" ]; then
			log "dns_wrong_auth name=${name} ns=${n} ip=${aip}"
		fi
	done < <(list_ns "${apex}")

	if [ "${pub_ok}" -eq 1 ]; then
		if [ "${auth_seen}" -eq 1 ] && [ "${auth_ok}" -eq 0 ]; then
			log "dns_auth_inconclusive name=${name} (public OK; auth timeout or lag)"
		fi
		if [ -n "${local_ip}" ] && [ "${local_ip}" != "${TARGET_IP}" ]; then
			log "dns_local_stale name=${name} local=${local_ip} (ignoring local cache; public OK)"
		fi
		return 0
	fi
	return 1
}

tls_is_letsencrypt() {
	# Return 0 when the live TLS cert for ServerName is issued by Let's Encrypt.
	local host="$1"
	local issuer
	issuer="$(echo | openssl s_client -connect "${TARGET_IP}:443" \
		-servername "${host}" 2>/dev/null \
		| openssl x509 -noout -issuer 2>/dev/null || true)"
	log "tls_issuer host=${host} ${issuer:-UNREADABLE}"
	printf '%s' "${issuer}" | grep -qi "Let's Encrypt"
}

write_http_vhost() {
	# HTTP serves ACME challenges; everything else redirects to HTTPS apex.
	cat > "${HTTP_CONF}" <<EOF
# ForestMusic Stage 3 HTTP: ACME + redirect to https://${DOMAIN}
# Peer site configs must not be edited.
<VirtualHost *:80>
	ServerName ${DOMAIN}
	ServerAlias ${WWW}
	DocumentRoot ${DOCROOT}

	<Directory ${DOCROOT}>
		Options -Indexes +FollowSymLinks
		AllowOverride None
		Require all granted
	</Directory>

	# Keep HTTP-01 challenges on plain HTTP (no redirect loop / hijack).
	Alias /.well-known/acme-challenge/ ${ACME_DIR}/
	<Directory ${ACME_DIR}>
		Options None
		AllowOverride None
		Require all granted
	</Directory>

	RewriteEngine On
	RewriteCond %{REQUEST_URI} !^/\.well-known/acme-challenge/
	RewriteRule ^(.*)$ https://${DOMAIN}\$1 [R=301,L]

	ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}_error.log
	CustomLog \${APACHE_LOG_DIR}/${DOMAIN}_access.log combined
</VirtualHost>
EOF
}

write_ssl_vhost() {
	# Apex serves content; www redirects to apex. Shared LE certificate.
	local fullchain="$1"
	local privkey="$2"
	cat > "${SSL_CONF}" <<EOF
# ForestMusic Stage 3 HTTPS (Let's Encrypt). Replaces temporary self-signed.
<IfModule mod_ssl.c>
<VirtualHost *:443>
	ServerName ${DOMAIN}
	DocumentRoot ${DOCROOT}

	<Directory ${DOCROOT}>
		Options -Indexes +FollowSymLinks
		AllowOverride None
		Require all granted
	</Directory>

	AddDefaultCharset utf-8

	SSLEngine on
	SSLCertificateFile ${fullchain}
	SSLCertificateKeyFile ${privkey}

	ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}_ssl_error.log
	CustomLog \${APACHE_LOG_DIR}/${DOMAIN}_ssl_access.log combined
</VirtualHost>

<VirtualHost *:443>
	ServerName ${WWW}

	SSLEngine on
	SSLCertificateFile ${fullchain}
	SSLCertificateKeyFile ${privkey}

	# www -> apex on HTTPS (single hop; no loop with HTTP rules).
	RewriteEngine On
	RewriteRule ^(.*)$ https://${DOMAIN}\$1 [R=301,L]

	ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}_ssl_www_error.log
	CustomLog \${APACHE_LOG_DIR}/${DOMAIN}_ssl_www_access.log combined
</VirtualHost>
</IfModule>
EOF
}

log "=== FOREST-MUSIC STAGE 3 CUTOVER ==="
log "stamp=${STAMP}"
log "hostname=$(hostname)"
log "target_ip=${TARGET_IP}"
log "expected_sha=${EXPECTED_SHA}"

# --- 0) Preconditions from Stage 2 ---
log ""
log "=== 0) STAGE 2 PRECONDITIONS ==="
if [ ! -f "${DOCROOT}/index.html" ]; then
	log "ERROR: DocumentRoot missing index.html (${DOCROOT})"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi
if [ ! -f "${SITE_ROOT}/RELEASE_SHA.txt" ]; then
	log "ERROR: RELEASE_SHA.txt missing (Stage 2 incomplete?)"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi
ACTUAL_SHA="$(tr -d '[:space:]' < "${SITE_ROOT}/RELEASE_SHA.txt")"
log "deployed_sha=${ACTUAL_SHA}"
if [ "${ACTUAL_SHA}" != "${EXPECTED_SHA}" ]; then
	log "ERROR: deployed SHA mismatch (expected ${EXPECTED_SHA})"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi
if ! grep -q '42579109' "${DOCROOT}/index.html"; then
	log "ERROR: Yandex Metrika id missing in index.html"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi
for f in robots.txt sitemap.xml; do
	if [ ! -f "${DOCROOT}/${f}" ]; then
		log "ERROR: missing ${f}"
		log "FOREST_MUSIC_STAGE3_FAILED"
		exit 1
	fi
done
log "preconditions=OK"

# Snapshot peer Apache configs (must remain unchanged).
BEFORE_SUMS="$(mktemp)"
AFTER_SUMS="$(mktemp)"
find /etc/apache2/sites-enabled /etc/apache2/sites-available -maxdepth 1 -type f \
	\( -name '*calc1*' -o -name '*first-calc*' -o -name '*pipetka*' \
	   -o -name '*otatu*' -o -name '*qr-pr*' -o -name '*receptvmeste*' \) \
	-print0 2>/dev/null | sort -z | xargs -0 sha256sum 2>/dev/null \
	| tee "${BEFORE_SUMS}" | tee -a "${REPORT}" || true

a2enmod rewrite ssl headers >/dev/null || true
a2ensite "${DOMAIN}.conf" >/dev/null 2>&1 || true
a2ensite "${DOMAIN}-ssl.conf" >/dev/null 2>&1 || true
# Prefer our SSL conf name; disable a stale certbot-generated twin if present.
if [ -f "/etc/apache2/sites-enabled/${DOMAIN}-le-ssl.conf" ]; then
	log "note: disabling leftover ${DOMAIN}-le-ssl.conf to avoid duplicate SNI"
	a2dissite "${DOMAIN}-le-ssl.conf" >/dev/null 2>&1 || true
fi

# --- 1) DNS gate (authoritative NS + public resolvers) ---
log ""
log "=== 1) DNS GATE ==="
apex_ready=0
www_ready=0
if dns_ready_for_certbot "${DOMAIN}" "${DOMAIN}"; then
	apex_ready=1
fi
if dns_ready_for_certbot "${WWW}" "${DOMAIN}"; then
	www_ready=1
fi
log "dns_apex_ready=${apex_ready} dns_www_ready=${www_ready}"

if [ "${apex_ready}" -ne 1 ] || [ "${www_ready}" -ne 1 ]; then
	log "WAITING_FOR_DNS need apex+www A -> ${TARGET_IP} on 1.1.1.1 and 8.8.8.8"
	log "SSL=SKIPPED (Certbot HTTP-01 not started)"
	log "NOTE: Switch DNS at p-dns.com, wait for propagation, re-run this workflow."
	log "FOREST_MUSIC_STAGE3_WAITING"
	log "REPORT_FILE=${REPORT}"
	exit 0
fi
log "dns_ok_for_certbot=yes"

# --- 2) Ensure HTTP vhost can serve ACME without foreign hijack ---
log ""
log "=== 2) ACME HTTP-01 PREFLIGHT ==="
# Keep a minimal HTTP vhost that serves challenges before/while certbot runs.
# If LE is already installed we still rewrite redirects after issuance.
mkdir -p "${ACME_DIR}"
# Temporarily serve DocumentRoot on :80 without force-redirect for challenge test.
cat > "${HTTP_CONF}" <<EOF
# Temporary preflight HTTP vhost for ACME path ownership check.
<VirtualHost *:80>
	ServerName ${DOMAIN}
	ServerAlias ${WWW}
	DocumentRoot ${DOCROOT}
	<Directory ${DOCROOT}>
		Options -Indexes +FollowSymLinks
		AllowOverride None
		Require all granted
	</Directory>
	Alias /.well-known/acme-challenge/ ${ACME_DIR}/
	<Directory ${ACME_DIR}>
		Options None
		AllowOverride None
		Require all granted
	</Directory>
	ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}_error.log
	CustomLog \${APACHE_LOG_DIR}/${DOMAIN}_access.log combined
</VirtualHost>
EOF
a2ensite "${DOMAIN}.conf" >/dev/null
set +e
PRE_CT="$(apachectl configtest 2>&1)"
PRE_RC=$?
set -e
printf '%s\n' "${PRE_CT}" | tee -a "${REPORT}"
if [ "${PRE_RC}" -ne 0 ]; then
	log "ERROR: apache configtest failed during ACME preflight"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi
systemctl reload apache2

TOKEN="stage3-preflight-${STAMP}"
printf '%s\n' "${TOKEN}" > "${ACME_DIR}/${TOKEN}"
chown -R www-data:www-data "${DOCROOT}/.well-known"
chmod 644 "${ACME_DIR}/${TOKEN}"

acme_ok=1
for host in "${DOMAIN}" "${WWW}"; do
	set +e
	body="$(curl -sS --resolve "${host}:80:${TARGET_IP}" \
		"http://${host}/.well-known/acme-challenge/${TOKEN}")"
	code="$(curl -sS -o /dev/null -w '%{http_code}' --resolve "${host}:80:${TARGET_IP}" \
		"http://${host}/.well-known/acme-challenge/${TOKEN}")"
	set -e
	log "acme_preflight host=${host} status=${code} body_match=$(
		if [ "${body}" = "${TOKEN}" ]; then echo yes; else echo no; fi
	)"
	if [ "${code}" != "200" ] || [ "${body}" != "${TOKEN}" ]; then
		acme_ok=0
	fi
done
rm -f "${ACME_DIR}/${TOKEN}"

if [ "${acme_ok}" -ne 1 ]; then
	log "ERROR: ACME challenge path not served by forest-music vhost"
	log "FOREST_MUSIC_STAGE3_CERT_FAILED"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi
log "acme_preflight=OK"

# --- 3) Issue or reuse Let's Encrypt (webroot HTTP-01) ---
log ""
log "=== 3) LET'S ENCRYPT ==="
if [ -f "${LE_LIVE}/fullchain.pem" ] && [ -f "${LE_LIVE}/privkey.pem" ]; then
	if tls_is_letsencrypt "${DOMAIN}" && tls_is_letsencrypt "${WWW}"; then
		log "letsencrypt_already_active=yes (idempotent keep-until-expiring)"
	fi
fi

if ! command -v certbot >/dev/null 2>&1; then
	log "ERROR: certbot missing on Timeweb host"
	log "FOREST_MUSIC_STAGE3_CERT_FAILED"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi

set +e
# Existing LE account on server is reused. Never --force-renewal.
# Never expand unrelated certificates. Never edit DNS / _acme-challenge TXT.
certbot certonly --webroot \
	--webroot-path "${DOCROOT}" \
	--non-interactive \
	--agree-tos \
	--keep-until-expiring \
	--cert-name "${DOMAIN}" \
	-d "${DOMAIN}" \
	-d "${WWW}" 2>&1 | tee -a "${REPORT}"
CERT_RC=${PIPESTATUS[0]}
set -e
log "certbot_${DOMAIN}_rc=${CERT_RC}"

if [ "${CERT_RC}" -ne 0 ]; then
	log "ERROR: Certbot HTTP-01 failed; leaving previous TLS config in place"
	log "FOREST_MUSIC_STAGE3_CERT_FAILED"
	log "FOREST_MUSIC_STAGE3_FAILED"
	log "REPORT_FILE=${REPORT}"
	exit 1
fi

if [ ! -f "${LE_LIVE}/fullchain.pem" ] || [ ! -f "${LE_LIVE}/privkey.pem" ]; then
	log "ERROR: LE files missing under ${LE_LIVE} after certbot rc=0"
	log "FOREST_MUSIC_STAGE3_CERT_FAILED"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi
log "le_fullchain=${LE_LIVE}/fullchain.pem"
log "le_privkey=${LE_LIVE}/privkey.pem"

# --- 4) Install LE into Apache + redirects ---
log ""
log "=== 4) APACHE LE VHOSTS + REDIRECTS ==="
write_http_vhost
write_ssl_vhost "${LE_LIVE}/fullchain.pem" "${LE_LIVE}/privkey.pem"
a2ensite "${DOMAIN}.conf" >/dev/null
a2ensite "${DOMAIN}-ssl.conf" >/dev/null
if [ -f "/etc/apache2/sites-enabled/${DOMAIN}-le-ssl.conf" ]; then
	a2dissite "${DOMAIN}-le-ssl.conf" >/dev/null 2>&1 || true
fi

set +e
CT_OUT="$(apachectl configtest 2>&1)"
CT_RC=$?
set -e
printf '%s\n' "${CT_OUT}" | tee -a "${REPORT}"
log "configtest_rc=${CT_RC}"
if [ "${CT_RC}" -ne 0 ]; then
	log "ERROR: apachectl configtest failed after LE vhost write"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi
systemctl reload apache2
log "apache2 reload=OK"
sleep 1

log ""
log "=== 5) APACHE -S ==="
apache2ctl -S 2>&1 | tee -a "${REPORT}" || true

# Peer config integrity
find /etc/apache2/sites-enabled /etc/apache2/sites-available -maxdepth 1 -type f \
	\( -name '*calc1*' -o -name '*first-calc*' -o -name '*pipetka*' \
	   -o -name '*otatu*' -o -name '*qr-pr*' -o -name '*receptvmeste*' \) \
	-print0 2>/dev/null | sort -z | xargs -0 sha256sum 2>/dev/null \
	| tee "${AFTER_SUMS}" | tee -a "${REPORT}" || true
if ! cmp -s "${BEFORE_SUMS}" "${AFTER_SUMS}"; then
	log "ERROR: protected Apache configs changed unexpectedly"
	diff -u "${BEFORE_SUMS}" "${AFTER_SUMS}" | tee -a "${REPORT}" || true
	rm -f "${BEFORE_SUMS}" "${AFTER_SUMS}"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi
log "protected_configs_unchanged=yes"
rm -f "${BEFORE_SUMS}" "${AFTER_SUMS}"

# --- 6) Public / resolve verification (trusted TLS, no -k) ---
log ""
log "=== 6) HTTPS + REDIRECT CHECKS (no -k) ==="
VERIFY_FAIL=0

# HTTP apex/www must 301 to https://forest-music.ru/
for host in "${DOMAIN}" "${WWW}"; do
	set +e
	http_code="$(curl -sS -o /dev/null -w '%{http_code}' \
		--resolve "${host}:80:${TARGET_IP}" "http://${host}/")"
	http_loc="$(curl -sS -o /dev/null -w '%{redirect_url}' \
		--resolve "${host}:80:${TARGET_IP}" "http://${host}/")"
	set -e
	log "http_redirect host=${host} status=${http_code} location=${http_loc:-none}"
	if [ "${http_code}" != "301" ] && [ "${http_code}" != "302" ]; then
		VERIFY_FAIL=1
	fi
	case "${http_loc}" in
		https://${DOMAIN}/|https://${DOMAIN}) ;;
		*) log "ERROR: unexpected HTTP redirect target for ${host}"; VERIFY_FAIL=1 ;;
	esac
done

# HTTPS www -> apex
set +e
www_code="$(curl -sS -o /dev/null -w '%{http_code}' \
	--resolve "${WWW}:443:${TARGET_IP}" "https://${WWW}/")"
www_loc="$(curl -sS -o /dev/null -w '%{redirect_url}' \
	--resolve "${WWW}:443:${TARGET_IP}" "https://${WWW}/")"
set -e
log "https_www_redirect status=${www_code} location=${www_loc:-none}"
if [ "${www_code}" != "301" ] && [ "${www_code}" != "302" ]; then
	VERIFY_FAIL=1
fi
case "${www_loc}" in
	https://${DOMAIN}/|https://${DOMAIN}) ;;
	*) log "ERROR: www HTTPS redirect not to apex"; VERIFY_FAIL=1 ;;
esac

# HTTPS apex content (trusted verify, pinned resolve)
tmp="$(mktemp)"
hdr="$(mktemp)"
set +e
https_code="$(curl -sS -D "${hdr}" -o "${tmp}" -w '%{http_code}' \
	--resolve "${DOMAIN}:443:${TARGET_IP}" "https://${DOMAIN}/")"
curl_rc=$?
set -e
ctype="$(awk 'BEGIN{IGNORECASE=1} /^Content-Type:/{sub(/\r$/,""); print; exit}' "${hdr}")"
canonical="$(tr '\n' ' ' < "${tmp}" | sed -n 's/.*rel="canonical" href="\([^"]*\)".*/\1/p')"
metrika="$(grep -c '42579109' "${tmp}" || true)"
charset_meta="$(grep -c 'charset=\"UTF-8\"\|charset=\"utf-8\"' "${tmp}" || true)"
log "https_apex rc=${curl_rc} status=${https_code} ${ctype:-Content-Type:MISSING} metrika=${metrika} charset_meta=${charset_meta} canonical=${canonical:-MISSING}"
if [ "${curl_rc}" -ne 0 ] || [ "${https_code}" != "200" ]; then
	log "ERROR: trusted HTTPS apex check failed (cert/SNI/connectivity)"
	VERIFY_FAIL=1
fi
if [ "${metrika}" -lt 1 ]; then
	log "ERROR: Metrika missing on HTTPS apex"
	VERIFY_FAIL=1
fi
if [ "${canonical}" != "https://${DOMAIN}/" ]; then
	log "ERROR: canonical mismatch"
	VERIFY_FAIL=1
fi
if ! tls_is_letsencrypt "${DOMAIN}"; then
	log "ERROR: apex certificate is not Let's Encrypt"
	VERIFY_FAIL=1
fi
if ! tls_is_letsencrypt "${WWW}"; then
	log "ERROR: www certificate is not Let's Encrypt"
	VERIFY_FAIL=1
fi
rm -f "${tmp}" "${hdr}"

# Asset MIME / status via HTTPS apex
JS="$(basename "$(ls "${DOCROOT}/assets"/index-*.js | head -n 1)")"
CSS="$(basename "$(ls "${DOCROOT}/assets"/index-*.css | head -n 1)")"
WOFF="$(basename "$(ls "${DOCROOT}/assets"/manrope-latin-400-normal-*.woff2 | head -n 1)")"
for path in \
	"/" \
	"/assets/${JS}" \
	"/assets/${CSS}" \
	"/assets/${WOFF}" \
	"/apps/auto-journal/screen-1.webp" \
	"/apps/study/icon.webp" \
	"/logo-header.png" \
	"/favicon.ico" \
	"/robots.txt" \
	"/sitemap.xml"
do
	set +e
	out="$(curl -sS -D - -o /dev/null --resolve "${DOMAIN}:443:${TARGET_IP}" \
		"https://${DOMAIN}${path}")"
	rc=$?
	set -e
	code="$(printf '%s' "${out}" | awk 'NR==1{print $2}')"
	ctype="$(printf '%s' "${out}" | awk 'BEGIN{IGNORECASE=1} /^Content-Type:/{sub(/\r$/,""); print $0; exit}')"
	log "asset path=${path} rc=${rc} status=${code} ${ctype:-Content-Type:MISSING}"
	if [ "${rc}" -ne 0 ] || [ "${code}" != "200" ]; then
		VERIFY_FAIL=1
	fi
done

log ""
log "=== 7) PEER SITE SMOKE ==="
for url in \
	"https://first-calc.com/" \
	"https://calc1.ru/" \
	"https://pipetkaonline.ru/" \
	"https://otatu.ru/" \
	"https://qr-pr.ru/" \
	"https://receptvmeste.ru/"
do
	set +e
	code="$(curl -sS -o /dev/null -w '%{http_code}' -L --max-redirs 5 --connect-timeout 10 "${url}")"
	rc=$?
	set -e
	log "peer url=${url} rc=${rc} http=${code}"
	if [ "${rc}" -ne 0 ] || [ "${code}" != "200" ]; then
		VERIFY_FAIL=1
	fi
done

log ""
log "DocumentRoot=${DOCROOT}"
log "HTTP_CONF=${HTTP_CONF}"
log "SSL_CONF=${SSL_CONF}"
log "LE_LIVE=${LE_LIVE}"
log "REPORT_FILE=${REPORT}"

if [ "${VERIFY_FAIL}" -ne 0 ]; then
	log "ERROR: post-cert verification failed"
	log "FOREST_MUSIC_STAGE3_VERIFY_FAILED"
	log "FOREST_MUSIC_STAGE3_FAILED"
	exit 1
fi

log "HTTPS_STATUS=LETS_ENCRYPT_ACTIVE"
log "FOREST_MUSIC_STAGE3_SUCCESS"
log "FOREST_MUSIC_STAGE3_DONE"
exit 0
