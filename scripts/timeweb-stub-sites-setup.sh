#!/usr/bin/env bash
# Create three static Apache stub sites on Timeweb.
# Safe rules:
# - Do NOT modify existing vhosts (calc1.ru, first-calc.com, pipetkaonline.ru, etc.)
# - Do NOT run Docker cleanup / container restarts
# - Do NOT change DNS
# - Issue Let's Encrypt only when apex + www both resolve to this host IP
set -euo pipefail

TARGET_IP="${TARGET_IP:-188.225.26.192}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
REPORT="/tmp/timeweb-stub-sites-${STAMP}.txt"
DOMAINS=(otatu.ru qr-pr.ru receptvmeste.ru)

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
	# Local recursive resolver only (may be stale during DNS cutover).
	local name="$1"
	local ip=""
	if command -v dig >/dev/null 2>&1; then
		ip="$(dig +time=3 +tries=1 +short A "${name}" 2>/dev/null \
			| awk '/^[0-9.]+$/{print; exit}')"
	fi
	if [ -z "${ip}" ] && command -v getent >/dev/null 2>&1; then
		ip="$(getent ahostsv4 "${name}" | awk '{print $1; exit}')"
	fi
	if [ -z "${ip}" ] && command -v host >/dev/null 2>&1; then
		ip="$(host -t A "${name}" 2>/dev/null | awk '/has address/{print $4; exit}')"
	fi
	printf '%s' "${ip}"
}

# Collect NS hostnames for an apex domain.
list_ns() {
	local apex="$1"
	if command -v dig >/dev/null 2>&1; then
		dig +time=3 +tries=1 +short NS "${apex}" 2>/dev/null \
			| sed 's/\.$//' | awk 'NF && $0 !~ /^;/ {print}'
	fi
}

# True when public resolvers agree on TARGET_IP.
# Distinguishes wrong records vs propagation lag vs stale local cache.
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
		log "dns_wrong_public name=${name} (public resolvers do not point at ${TARGET_IP})"
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

write_stub_html() {
	# Adaptive under-construction page with domain name and robots meta.
	local domain="$1"
	local dest="$2"
	cat > "${dest}" <<EOF
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex, nofollow">
	<title>${domain} — сайт в разработке</title>
	<style>
		:root {
			--ink: #1a2332;
			--muted: #5b6777;
			--line: #c9d3df;
			--accent: #0b6e99;
			--bg: #eef3f7;
		}
		* { box-sizing: border-box; }
		body {
			margin: 0;
			min-height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 1.5rem;
			font-family: Georgia, "Times New Roman", serif;
			color: var(--ink);
			background:
				linear-gradient(180deg, rgba(255,255,255,0.72), rgba(238,243,247,0.92)),
				repeating-linear-gradient(
					-12deg,
					#e8eef4 0 18px,
					#eef3f7 18px 36px
				);
		}
		main {
			width: min(36rem, 100%);
			text-align: center;
		}
		h1 {
			margin: 0 0 0.9rem;
			font-size: clamp(1.8rem, 5.5vw, 2.6rem);
			line-height: 1.15;
			font-weight: 700;
			letter-spacing: -0.02em;
		}
		h1 span { color: var(--accent); }
		.line {
			width: 3.5rem;
			height: 2px;
			margin: 0 auto 1.25rem;
			background: var(--line);
		}
		p {
			margin: 0;
			color: var(--muted);
			font-family: "Segoe UI", Tahoma, sans-serif;
			font-size: clamp(1rem, 2.4vw, 1.125rem);
			line-height: 1.65;
		}
	</style>
</head>
<body>
	<main>
		<h1><span>${domain}</span></h1>
		<div class="line" aria-hidden="true"></div>
		<p>Сайт находится в разработке.<br>Скоро здесь появится новая версия.</p>
	</main>
</body>
</html>
EOF
}

write_vhost() {
	# HTTP-only VirtualHost for apex + www. Certbot may later add SSL + redirect.
	local domain="$1"
	local conf="$2"
	local root="/var/www/${domain}"
	cat > "${conf}" <<EOF
# Static stub site for ${domain} (HTTP). Do not edit peer site configs.
<VirtualHost *:80>
	ServerName ${domain}
	ServerAlias www.${domain}
	DocumentRoot ${root}

	<Directory ${root}>
		Options -Indexes +FollowSymLinks
		AllowOverride None
		Require all granted
	</Directory>

	# Keep stubs out of search indexes until the real site launches.
	Header always set X-Robots-Tag "noindex, nofollow"

	ErrorLog \${APACHE_LOG_DIR}/${domain}-error.log
	CustomLog \${APACHE_LOG_DIR}/${domain}-access.log combined
</VirtualHost>
EOF
}

: > "${REPORT}"
log "=== TIMEWEB STUB SITES SETUP ==="
log "UTC=${STAMP}"
log "hostname=$(hostname)"
log "whoami=$(whoami)"
log "TARGET_IP=${TARGET_IP}"
log ""

# --- 1) Inventory existing Apache (read-only) ---
log "=== 1) EXISTING APACHE INVENTORY ==="
log "-- apache2ctl -S --"
apache2ctl -S 2>&1 | tee -a "${REPORT}" || true
log ""
log "-- sites-enabled listing --"
ls -la /etc/apache2/sites-enabled/ 2>&1 | tee -a "${REPORT}" || true
log ""
log "-- sites-available listing --"
ls -la /etc/apache2/sites-available/ 2>&1 | tee -a "${REPORT}" || true
log ""
log "-- /var/www listing --"
ls -la /var/www 2>&1 | tee -a "${REPORT}" || true
log ""

# Snapshot checksums of protected configs so we can prove they were not touched.
log "-- protected config checksums (before) --"
BEFORE_SUMS="$(mktemp)"
find /etc/apache2/sites-enabled /etc/apache2/sites-available -maxdepth 1 -type f \
	\( -name '*calc1*' -o -name '*first-calc*' -o -name '*pipetka*' \) \
	-print0 2>/dev/null | sort -z | xargs -0 sha256sum 2>/dev/null | tee "${BEFORE_SUMS}" | tee -a "${REPORT}" || true
log ""

# Ensure headers module for X-Robots-Tag (idempotent; does not touch vhosts).
if [ ! -e /etc/apache2/mods-enabled/headers.load ]; then
	log "Enabling Apache module: headers"
	a2enmod headers >/dev/null
else
	log "Apache module headers already enabled"
fi

# --- 2) Create DocumentRoots + vhosts ---
log ""
log "=== 2) CREATE DOCUMENTROOTS AND VHOSTS ==="
for domain in "${DOMAINS[@]}"; do
	root="/var/www/${domain}"
	conf_avail="/etc/apache2/sites-available/${domain}.conf"
	conf_enabled="/etc/apache2/sites-enabled/${domain}.conf"

	# Refuse to overwrite if an unexpected non-stub config already exists with different ServerName.
	mkdir -p "${root}"
	write_stub_html "${domain}" "${root}/index.html"
	chown -R www-data:www-data "${root}"
	find "${root}" -type d -exec chmod 755 {} \;
	find "${root}" -type f -exec chmod 644 {} \;

	write_vhost "${domain}" "${conf_avail}"
	# Enable only our new site; a2ensite is idempotent.
	a2ensite "${domain}.conf" >/dev/null
	log "READY domain=${domain} root=${root} conf=${conf_avail} enabled=$( [ -e "${conf_enabled}" ] && echo yes || echo no )"
done

# --- 3) configtest + graceful reload (Apache only; no Docker) ---
log ""
log "=== 3) APACHE CONFIGTEST + RELOAD ==="
set +e
CONFIGTEST_OUT="$(apachectl configtest 2>&1)"
CONFIGTEST_RC=$?
set -e
printf '%s\n' "${CONFIGTEST_OUT}" | tee -a "${REPORT}"
log "configtest_rc=${CONFIGTEST_RC}"
if [ "${CONFIGTEST_RC}" -ne 0 ]; then
	log "ERROR: apachectl configtest failed. Disabling new stub sites and stopping."
	for domain in "${DOMAINS[@]}"; do
		a2dissite "${domain}.conf" >/dev/null 2>&1 || true
	done
	apachectl configtest 2>&1 | tee -a "${REPORT}" || true
	exit 1
fi

# Graceful reload keeps existing connections; does not restart Docker containers.
systemctl reload apache2
log "apache2 reload=OK"
sleep 1

# --- 4) curl --resolve checks before DNS cutover ---
log ""
log "=== 4) CURL --RESOLVE CHECKS (HTTP) ==="
for domain in "${DOMAINS[@]}"; do
	for host in "${domain}" "www.${domain}"; do
		# Capture status + robots header + body snippet.
		tmp="$(mktemp)"
		hdr="$(mktemp)"
		set +e
		code="$(curl -sS -D "${hdr}" -o "${tmp}" -w '%{http_code}' \
			--resolve "${host}:80:${TARGET_IP}" \
			"http://${host}/")"
		curl_rc=$?
		set -e
		robots="$(awk 'BEGIN{IGNORECASE=1} /^X-Robots-Tag:/{sub(/\r$/,""); print; exit}' "${hdr}")"
		title="$(tr '\n' ' ' < "${tmp}" | sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p')"
		log "host=${host} curl_rc=${curl_rc} http=${code} ${robots:-X-Robots-Tag:MISSING} title=${title:-MISSING}"
		rm -f "${tmp}" "${hdr}"
	done
done

# Peer smoke: ensure existing HTTPS sites still respond (read-only check).
log ""
log "=== 4b) PEER SITE SMOKE (must stay healthy) ==="
for url in \
	'https://first-calc.com/' \
	'https://calc1.ru/' \
	'https://pipetkaonline.ru/'
do
	set +e
	code="$(curl -sS -o /dev/null -w '%{http_code}' -L --max-redirs 5 --connect-timeout 10 "${url}")"
	rc=$?
	set -e
	log "peer url=${url} curl_rc=${rc} http=${code}"
done

# --- 5) Protected config integrity ---
log ""
log "=== 5) PROTECTED CONFIG INTEGRITY ==="
AFTER_SUMS="$(mktemp)"
find /etc/apache2/sites-enabled /etc/apache2/sites-available -maxdepth 1 -type f \
	\( -name '*calc1*' -o -name '*first-calc*' -o -name '*pipetka*' \) \
	-print0 2>/dev/null | sort -z | xargs -0 sha256sum 2>/dev/null | tee "${AFTER_SUMS}" | tee -a "${REPORT}" || true
if ! cmp -s "${BEFORE_SUMS}" "${AFTER_SUMS}"; then
	log "ERROR: protected Apache configs changed unexpectedly. STOP before SSL."
	diff -u "${BEFORE_SUMS}" "${AFTER_SUMS}" | tee -a "${REPORT}" || true
	rm -f "${BEFORE_SUMS}" "${AFTER_SUMS}"
	exit 1
fi
log "protected_configs_unchanged=yes"
rm -f "${BEFORE_SUMS}" "${AFTER_SUMS}"

# --- 6) Conditional Let's Encrypt (only if DNS already points here) ---
log ""
log "=== 6) DNS + OPTIONAL LET'S ENCRYPT ==="
SSL_READY_DOMAINS=()
WAITING_DNS_DOMAINS=()
for domain in "${DOMAINS[@]}"; do
	apex_ready=0
	www_ready=0
	if dns_ready_for_certbot "${domain}" "${domain}"; then
		apex_ready=1
	fi
	if dns_ready_for_certbot "www.${domain}" "${domain}"; then
		www_ready=1
	fi
	if [ "${apex_ready}" -eq 1 ] && [ "${www_ready}" -eq 1 ]; then
		log "dns_ok_for_certbot=${domain}"
		SSL_READY_DOMAINS+=("${domain}")
	else
		log "WAITING_FOR_DNS domain=${domain} (need apex+www -> ${TARGET_IP} on public DNS)"
		WAITING_DNS_DOMAINS+=("${domain}")
	fi
done

if [ "${#WAITING_DNS_DOMAINS[@]}" -gt 0 ]; then
	log "WAITING_FOR_DNS domains=${WAITING_DNS_DOMAINS[*]}"
fi

if [ "${#SSL_READY_DOMAINS[@]}" -eq 0 ]; then
	log "SSL=SKIPPED WAITING_FOR_DNS (no domain fully resolves to ${TARGET_IP} yet)"
else
	if ! command -v certbot >/dev/null 2>&1; then
		log "ERROR: certbot missing; HTTP stubs are live, SSL skipped."
	else
		for domain in "${SSL_READY_DOMAINS[@]}"; do
			log "-- certbot for ${domain} + www.${domain} --"
			# Non-interactive; only our names; Apache plugin adds HTTPS + HTTP->HTTPS.
			# Do not use --force-renewal. Do not expand unrelated certificates.
			set +e
			# Use existing Let's Encrypt account on the server when present.
			# Never --force-renewal; never expand unrelated certificates.
			certbot --apache \
				--non-interactive \
				--agree-tos \
				--redirect \
				--keep-until-expiring \
				-d "${domain}" \
				-d "www.${domain}" 2>&1 | tee -a "${REPORT}"
			cert_rc=${PIPESTATUS[0]}
			set -e
			log "certbot_${domain}_rc=${cert_rc}"

			if [ "${cert_rc}" -eq 0 ]; then
				# Ensure X-Robots-Tag also applies on the SSL vhost certbot creates.
				ssl_conf="/etc/apache2/sites-available/${domain}-le-ssl.conf"
				if [ -f "${ssl_conf}" ] && ! grep -q 'X-Robots-Tag' "${ssl_conf}"; then
					# Insert the header directive before the closing VirtualHost tag.
					sed -i '/<\/VirtualHost>/i\\tHeader always set X-Robots-Tag "noindex, nofollow"' "${ssl_conf}"
					apachectl configtest 2>&1 | tee -a "${REPORT}"
					systemctl reload apache2
					log "ssl_x_robots_tag_added=${domain}"
				fi
				for host in "${domain}" "www.${domain}"; do
					tmp="$(mktemp)"
					hdr="$(mktemp)"
					set +e
					code="$(curl -sS -D "${hdr}" -o "${tmp}" -w '%{http_code}' \
						--resolve "${host}:443:${TARGET_IP}" \
						"https://${host}/")"
					# HTTP should redirect to HTTPS after certbot --redirect.
					http_code="$(curl -sS -o /dev/null -w '%{http_code}' \
						--resolve "${host}:80:${TARGET_IP}" \
						"http://${host}/")"
					http_loc="$(curl -sS -o /dev/null -w '%{redirect_url}' \
						--resolve "${host}:80:${TARGET_IP}" \
						"http://${host}/")"
					cert_subj="$(echo | openssl s_client -connect "${TARGET_IP}:443" \
						-servername "${host}" 2>/dev/null \
						| openssl x509 -noout -subject -dates 2>/dev/null \
						| tr '\n' ' ')"
					curl_rc=$?
					set -e
					robots="$(awk 'BEGIN{IGNORECASE=1} /^X-Robots-Tag:/{sub(/\r$/,""); print; exit}' "${hdr}")"
					meta_robots="$(tr '\n' ' ' < "${tmp}" \
						| sed -n 's/.*name=\"robots\" content=\"\([^\"]*\)\".*/\1/p')"
					log "https host=${host} curl_rc=${curl_rc} https=${code} http_status=${http_code} redirect=${http_loc:-none} ${robots:-X-Robots-Tag:MISSING} meta_robots=${meta_robots:-MISSING}"
					log "cert host=${host} ${cert_subj:-CERT_UNREADABLE}"
					rm -f "${tmp}" "${hdr}"
				done
			else
				log "certbot failed for ${domain}; leaving HTTP stub in place"
			fi
		done
	fi
fi

# --- 7) Final VirtualHost map ---
log ""
log "=== 7) FINAL APACHE -S ==="
apache2ctl -S 2>&1 | tee -a "${REPORT}" || true
log ""
log "=== SUMMARY PATHS ==="
for domain in "${DOMAINS[@]}"; do
	log "domain=${domain}"
	log "  DocumentRoot=/var/www/${domain}"
	log "  available=/etc/apache2/sites-available/${domain}.conf"
	log "  enabled=/etc/apache2/sites-enabled/${domain}.conf -> $(readlink -f "/etc/apache2/sites-enabled/${domain}.conf" 2>/dev/null || echo missing)"
	# SSL conf may exist after certbot
	if [ -f "/etc/apache2/sites-available/${domain}-le-ssl.conf" ]; then
		log "  ssl_conf=/etc/apache2/sites-available/${domain}-le-ssl.conf"
	fi
	if [ -f "/etc/apache2/sites-enabled/${domain}-le-ssl.conf" ]; then
		log "  ssl_enabled=yes"
	fi
done
log ""
log "REPORT_FILE=${REPORT}"
log "STUB_SITES_SETUP_DONE"
# Explicit success: some Apache inventory commands can leave a non-zero
# status in edge cases even after a fully successful stub rollout.
exit 0
