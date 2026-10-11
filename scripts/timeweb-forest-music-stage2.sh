#!/usr/bin/env bash
# Stage 2: place ForestMusic static landing on Timeweb.
# Rules:
# - DocumentRoot /var/www/forest-music.ru/public
# - Do NOT modify peer Apache vhosts / Docker
# - Do NOT change DNS
# - Do NOT run certbot HTTP-01 while DNS still points at CDN
# - Temporary self-signed SSL vhost only to fix SNI catch-all routing
set -euo pipefail

TARGET_IP="${TARGET_IP:-188.225.26.192}"
DOMAIN="forest-music.ru"
DOCROOT="/var/www/${DOMAIN}/public"
SITE_ROOT="/var/www/${DOMAIN}"
HTTP_CONF="/etc/apache2/sites-available/${DOMAIN}.conf"
SSL_CONF="/etc/apache2/sites-available/${DOMAIN}-ssl.conf"
MIME_CONF="/etc/apache2/conf-available/forest-music-mime.conf"
DIST_TGZ="${DIST_TGZ:-/tmp/forest-music-dist.tgz}"
RELEASE_SHA="${RELEASE_SHA:-unknown}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
REPORT="/tmp/forest-music-stage2-${STAMP}.txt"
SSL_DIR="/etc/ssl/forest-music.ru"

log() { echo "$@" | tee -a "${REPORT}"; }

log "=== FOREST-MUSIC STAGE 2 SETUP ==="
log "stamp=${STAMP}"
log "hostname=$(hostname)"
log "target_ip=${TARGET_IP}"
log "release_sha=${RELEASE_SHA}"
log "dist_tgz=${DIST_TGZ}"

if [ ! -f "${DIST_TGZ}" ]; then
	log "ERROR: dist archive missing: ${DIST_TGZ}"
	exit 1
fi

log ""
log "=== 1) MIME TYPES ==="
cat > "${MIME_CONF}" <<'EOF'
# ForestMusic static asset MIME (safe additive fragment)
AddType image/webp .webp
AddType font/woff2 .woff2
AddType application/javascript .js .mjs
AddType text/css .css
EOF
a2enconf forest-music-mime >/dev/null
log "mime_conf=${MIME_CONF} enabled"

log ""
log "=== 2) DOCUMENTROOT + DIST ==="
mkdir -p "${DOCROOT}"
find "${DOCROOT}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
tar -xzf "${DIST_TGZ}" -C "${DOCROOT}"
if [ ! -f "${DOCROOT}/index.html" ] && [ -f "${DOCROOT}/dist/index.html" ]; then
	shopt -s dotglob
	mv "${DOCROOT}/dist/"* "${DOCROOT}/"
	rmdir "${DOCROOT}/dist" 2>/dev/null || rm -rf "${DOCROOT}/dist"
	shopt -u dotglob
fi
if [ ! -f "${DOCROOT}/index.html" ]; then
	log "ERROR: index.html missing after unpack"
	ls -la "${DOCROOT}" | tee -a "${REPORT}" || true
	exit 1
fi
printf '%s\n' "${RELEASE_SHA}" > "${SITE_ROOT}/RELEASE_SHA.txt"
chown -R www-data:www-data "${SITE_ROOT}"
find "${SITE_ROOT}" -type d -exec chmod 755 {} \;
find "${SITE_ROOT}" -type f -exec chmod 644 {} \;
log "docroot=${DOCROOT}"
log "index_bytes=$(wc -c < "${DOCROOT}/index.html" | tr -d ' ')"
log "has_metrika=$(grep -c '42579109' "${DOCROOT}/index.html" || true)"
if [ -f "${DOCROOT}/robots.txt" ]; then log "has_robots=yes"; else log "has_robots=no"; fi
if [ -f "${DOCROOT}/sitemap.xml" ]; then log "has_sitemap=yes"; else log "has_sitemap=no"; fi
log "js_entry=$(ls "${DOCROOT}/assets"/index-*.js 2>/dev/null | head -n 1 || echo missing)"

log ""
log "=== 3) HTTP VIRTUALHOST ==="
a2enmod headers >/dev/null || true
cat > "${HTTP_CONF}" <<EOF
# ForestMusic static landing (HTTP). Peer site configs must not be edited.
<VirtualHost *:80>
	ServerName ${DOMAIN}
	ServerAlias www.${DOMAIN}
	DocumentRoot ${DOCROOT}

	<Directory ${DOCROOT}>
		Options -Indexes +FollowSymLinks
		AllowOverride None
		Require all granted
	</Directory>

	AddDefaultCharset utf-8

	ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}_error.log
	CustomLog \${APACHE_LOG_DIR}/${DOMAIN}_access.log combined
</VirtualHost>
EOF
a2ensite "${DOMAIN}.conf" >/dev/null
log "http_conf=${HTTP_CONF} enabled"

log ""
log "=== 4) TEMP SELF-SIGNED SSL VHOST (SNI FIX) ==="
a2enmod ssl >/dev/null || true
mkdir -p "${SSL_DIR}"
if [ ! -f "${SSL_DIR}/fullchain.pem" ] || [ ! -f "${SSL_DIR}/privkey.pem" ]; then
	if openssl req -x509 -nodes -newkey rsa:2048 -days 30 \
		-keyout "${SSL_DIR}/privkey.pem" \
		-out "${SSL_DIR}/fullchain.pem" \
		-subj "/CN=${DOMAIN}" \
		-addext "subjectAltName=DNS:${DOMAIN},DNS:www.${DOMAIN}" 2>/dev/null; then
		log "self_signed_cert=created_with_san"
	else
		openssl req -x509 -nodes -newkey rsa:2048 -days 30 \
			-keyout "${SSL_DIR}/privkey.pem" \
			-out "${SSL_DIR}/fullchain.pem" \
			-subj "/CN=${DOMAIN}"
		log "self_signed_cert=created_cn_only"
	fi
	chmod 600 "${SSL_DIR}/privkey.pem"
	chmod 644 "${SSL_DIR}/fullchain.pem"
else
	log "self_signed_cert=reused"
fi

cat > "${SSL_CONF}" <<EOF
# TEMPORARY self-signed SSL for forest-music.ru SNI routing only.
# Replace with Let's Encrypt after DNS cutover (Stage 3). NOT production-trusted.
<IfModule mod_ssl.c>
<VirtualHost *:443>
	ServerName ${DOMAIN}
	ServerAlias www.${DOMAIN}
	DocumentRoot ${DOCROOT}

	<Directory ${DOCROOT}>
		Options -Indexes +FollowSymLinks
		AllowOverride None
		Require all granted
	</Directory>

	AddDefaultCharset utf-8

	SSLEngine on
	SSLCertificateFile ${SSL_DIR}/fullchain.pem
	SSLCertificateKeyFile ${SSL_DIR}/privkey.pem

	Header always set X-ForestMusic-TLS "self-signed-temporary"

	ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}_ssl_error.log
	CustomLog \${APACHE_LOG_DIR}/${DOMAIN}_ssl_access.log combined
</VirtualHost>
</IfModule>
EOF
a2ensite "${DOMAIN}-ssl.conf" >/dev/null
log "ssl_conf=${SSL_CONF} enabled"
log "HTTPS_STATUS=TEMPORARY_SELF_SIGNED_SNI_ONLY"
log "NOTE: Do not run certbot HTTP-01 while DNS points at Yandex CDN."

log ""
log "=== 5) APACHE CONFIGTEST + RELOAD ==="
set +e
CONFIGTEST_OUT="$(apachectl configtest 2>&1)"
CONFIGTEST_RC=$?
set -e
printf '%s\n' "${CONFIGTEST_OUT}" | tee -a "${REPORT}"
log "configtest_rc=${CONFIGTEST_RC}"
if [ "${CONFIGTEST_RC}" -ne 0 ]; then
	log "ERROR: apachectl configtest failed; disabling forest-music sites"
	a2dissite "${DOMAIN}.conf" >/dev/null 2>&1 || true
	a2dissite "${DOMAIN}-ssl.conf" >/dev/null 2>&1 || true
	apachectl configtest 2>&1 | tee -a "${REPORT}" || true
	exit 1
fi
systemctl reload apache2
log "apache2 reload=OK"
sleep 1

log ""
log "=== 6) APACHE -S (SNI / vhost map) ==="
apache2ctl -S 2>&1 | tee -a "${REPORT}" || true

log ""
log "=== 7) CURL --RESOLVE HTTP CHECKS ==="
for host in "${DOMAIN}" "www.${DOMAIN}"; do
	tmp="$(mktemp)"
	hdr="$(mktemp)"
	set +e
	code="$(curl -sS -D "${hdr}" -o "${tmp}" -w '%{http_code}' --resolve "${host}:80:${TARGET_IP}" "http://${host}/")"
	rc=$?
	set -e
	ctype="$(awk 'BEGIN{IGNORECASE=1} /^Content-Type:/{sub(/\r$/,""); print; exit}' "${hdr}")"
	title="$(tr '\n' ' ' < "${tmp}" | sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p')"
	metrika="$(grep -c '42579109' "${tmp}" || true)"
	log "http host=${host} rc=${rc} status=${code} ${ctype:-Content-Type:MISSING} metrika=${metrika} title=${title:-MISSING}"
	rm -f "${tmp}" "${hdr}"
done

log ""
log "=== 8) ASSET MIME CHECKS ==="
JS="$(basename "$(ls "${DOCROOT}/assets"/index-*.js | head -n 1)")"
CSS="$(basename "$(ls "${DOCROOT}/assets"/index-*.css | head -n 1)")"
for path in \
	"/" \
	"/assets/${JS}" \
	"/assets/${CSS}" \
	"/apps/auto-journal/screen-1.webp" \
	"/apps/study/icon.webp" \
	"/logo-header.png" \
	"/favicon.ico" \
	"/robots.txt" \
	"/sitemap.xml"
do
	for host in "${DOMAIN}" "www.${DOMAIN}"; do
		set +e
		out="$(curl -sS -D - -o /dev/null --resolve "${host}:80:${TARGET_IP}" "http://${host}${path}")"
		rc=$?
		set -e
		code="$(printf '%s' "${out}" | awk 'NR==1{print $2}')"
		ctype="$(printf '%s' "${out}" | awk 'BEGIN{IGNORECASE=1} /^Content-Type:/{sub(/\r$/,""); print $0; exit}')"
		log "asset host=${host} path=${path} rc=${rc} status=${code} ${ctype:-Content-Type:MISSING}"
	done
done

log ""
log "=== 9) HTTPS SNI ROUTING (self-signed expected) ==="
for host in "${DOMAIN}" "www.${DOMAIN}"; do
	tmp="$(mktemp)"
	hdr="$(mktemp)"
	set +e
	code="$(curl -skS -D "${hdr}" -o "${tmp}" -w '%{http_code}' --resolve "${host}:443:${TARGET_IP}" "https://${host}/")"
	rc=$?
	set -e
	marker="$(awk 'BEGIN{IGNORECASE=1} /^X-ForestMusic-TLS:/{sub(/\r$/,""); print; exit}' "${hdr}")"
	next_locale="$(awk 'BEGIN{IGNORECASE=1} /^set-cookie:.*NEXT_LOCALE/{print "NEXT_LOCALE_LEAK"; exit}' "${hdr}")"
	metrika="$(grep -c '42579109' "${tmp}" || true)"
	log "https host=${host} rc=${rc} status=${code} ${marker:-X-ForestMusic-TLS:MISSING} ${next_locale:-no_next_locale} metrika=${metrika}"
	rm -f "${tmp}" "${hdr}"
done

log ""
log "=== 10) PEER SITE SMOKE ==="
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
done

log ""
log "DocumentRoot=${DOCROOT}"
log "HTTP_CONF=${HTTP_CONF}"
log "SSL_CONF=${SSL_CONF}"
log "REPORT_FILE=${REPORT}"
log "FOREST_MUSIC_STAGE2_DONE"
exit 0
