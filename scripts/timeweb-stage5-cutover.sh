#!/usr/bin/env bash
# Stage 5: cut over ONLY first-calc to the prepared release image.
# Auto-rollback on critical failure. Never touch calc1 / pipetka / Apache.
set -euo pipefail

RELEASE_SHA="${RELEASE_SHA:-795f6ad404fd2910ec0eacb2e926b7fda810adb5}"
NEW_TAG="first-calc:${RELEASE_SHA}"
ROLLBACK_TAG="first-calc:rollback-20261009T194524Z"
BACKUP_DIR="/var/backups/first-calc/20261009T194524Z"
PROJECT_DIR="/var/www/first-calc"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
REPORT="/tmp/first-calc-stage5-${STAMP}.txt"
COMPOSE_PROJECT="first-calc"

log() { echo "$@" | tee -a "${REPORT}"; }

rollback_now() {
	local reason="$1"
	log "CRITICAL: ${reason}"
	log "=== AUTO ROLLBACK ==="
	if [ -x "${BACKUP_DIR}/ROLLBACK.sh" ]; then
		bash "${BACKUP_DIR}/ROLLBACK.sh" 2>&1 | tee -a "${REPORT}" || true
	else
		log "ERROR: ROLLBACK.sh missing; attempting emergency docker run from ${ROLLBACK_TAG}"
		docker rm -f first-calc 2>/dev/null || true
		docker run -d --name first-calc --restart unless-stopped \
			-p 127.0.0.1:3003:3000 \
			-e NODE_ENV=production \
			-e NEXT_TELEMETRY_DISABLED=1 \
			-e NEXT_PUBLIC_DATA_SOURCE=local \
			-e NEXT_PUBLIC_BASE_URL=https://first-calc.com \
			-e NEXT_PUBLIC_ENV=production \
			"${ROLLBACK_TAG}" || true
	fi
	sleep 8
	log "post-rollback first-calc=$(docker inspect first-calc --format '{{.State.Status}}/{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}/image={{.Config.Image}}/id={{.Image}}' 2>/dev/null || echo missing)"
	curl -sS -o /dev/null -w 'local_3003=%{http_code}\n' http://127.0.0.1:3003/ | tee -a "${REPORT}" || true
	curl -sS -o /dev/null -w 'first_calc_https=%{http_code}\n' https://first-calc.com/ | tee -a "${REPORT}" || true
	curl -sS -o /dev/null -w 'calc1=%{http_code}\n' -L --max-redirs 5 https://calc1.ru/ | tee -a "${REPORT}" || true
	curl -sS -o /dev/null -w 'pipetka=%{http_code}\n' https://pipetkaonline.ru/ | tee -a "${REPORT}" || true
	docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | tee -a "${REPORT}" || true
	log "STATUS=ROLLED_BACK"
	echo "----- REPORT BEGIN -----"
	cat "${REPORT}"
	echo "----- REPORT END -----"
	exit 1
}

: > "${REPORT}"
log "=== FIRST CALC STAGE 5 CUTOVER ==="
log "UTC=${STAMP}"
log "NEW_TAG=${NEW_TAG}"
log "hostname=$(hostname)"

# ---------- 1. Preflight ----------
log ""
log "=== 1) PREFLIGHT ==="

if ! docker inspect first-calc >/dev/null 2>&1; then
	log "ERROR: first-calc container missing before cutover. STOP."
	exit 2
fi
FC_STATUS="$(docker inspect first-calc --format '{{.State.Status}}')"
FC_HEALTH="$(docker inspect first-calc --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}')"
PREV_IMAGE_ID="$(docker inspect first-calc --format '{{.Image}}')"
PREV_CONTAINER_ID="$(docker inspect first-calc --format '{{.Id}}')"
log "first-calc status=${FC_STATUS} health=${FC_HEALTH}"
log "prev_container_id=${PREV_CONTAINER_ID}"
log "prev_image_id=${PREV_IMAGE_ID}"
[ "${FC_STATUS}" = "running" ] && [ "${FC_HEALTH}" = "healthy" ] || {
	log "ERROR: first-calc not healthy. STOP without cutover."
	exit 2
}

docker image inspect "${NEW_TAG}" >/dev/null 2>&1 || {
	log "ERROR: new image ${NEW_TAG} missing. STOP."
	exit 2
}
NEW_IMAGE_ID="$(docker image inspect "${NEW_TAG}" --format '{{.Id}}')"
log "new_image_id=${NEW_IMAGE_ID}"
[ "${NEW_IMAGE_ID}" != "${PREV_IMAGE_ID}" ] || log "WARNING: new image id equals previous (unexpected)"

docker image inspect "${ROLLBACK_TAG}" >/dev/null 2>&1 || {
	log "ERROR: rollback image ${ROLLBACK_TAG} missing. STOP."
	exit 2
}
ROLLBACK_ID="$(docker image inspect "${ROLLBACK_TAG}" --format '{{.Id}}')"
log "rollback_image_id=${ROLLBACK_ID}"

[ -d "${BACKUP_DIR}" ] || {
	log "ERROR: backup dir missing ${BACKUP_DIR}. STOP."
	exit 2
}
[ -x "${BACKUP_DIR}/ROLLBACK.sh" ] || {
	log "ERROR: ROLLBACK.sh not executable. STOP."
	exit 2
}
# Sanity: ROLLBACK.sh must only act on first-calc (ignore comments)
if grep -Eiv '^[[:space:]]*#' "${BACKUP_DIR}/ROLLBACK.sh" | grep -Eiq \
	'(docker[[:space:]]+(rm|stop|kill|restart|compose).*calc1|docker[[:space:]]+(rm|stop|kill|restart|compose).*pipetka|calc1-app|pipetkaonline)'; then
	log "ERROR: ROLLBACK.sh contains peer-site docker actions. STOP."
	exit 2
fi
if ! grep -Eq 'first-calc|ROLLBACK_TAG' "${BACKUP_DIR}/ROLLBACK.sh"; then
	log "ERROR: ROLLBACK.sh does not clearly target first-calc. STOP."
	exit 2
fi
log "backup_dir_ok=${BACKUP_DIR}"
log "rollback_script_ok=yes (first-calc only)"

# Peer sites before cutover
calc1_code="$(curl -sS -o /dev/null -w '%{http_code}' -L --max-redirs 5 https://calc1.ru/ || echo fail)"
pipetka_code="$(curl -sS -o /dev/null -w '%{http_code}' https://pipetkaonline.ru/ || echo fail)"
log "pre_calc1_https=${calc1_code}"
log "pre_pipetka_https=${pipetka_code}"
docker inspect calc1-app --format 'calc1-app={{.State.Status}}/{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' 2>/dev/null | tee -a "${REPORT}" || true
docker inspect pipetkaonline-app --format 'pipetkaonline-app={{.State.Status}}/{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' 2>/dev/null | tee -a "${REPORT}" || true

# Capture live env/ports for verification after
docker inspect first-calc --format '{{range .Config.Env}}{{println .}}{{end}}' \
	| sed -E 's/^([^=]+)=.*/\1=***/' | tee -a "${REPORT}"
PORTS_BEFORE="$(docker inspect first-calc --format '{{json .HostConfig.PortBindings}}')"
log "ports_before=${PORTS_BEFORE}"

# ---------- 2. Cutover ----------
log ""
log "=== 2) CUTOVER ==="
CUTOVER_START="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
log "cutover_start_utc=${CUTOVER_START}"

cd "${PROJECT_DIR}"

# Point the compose image name at the new release WITHOUT deleting rollback tag.
# Compose project currently uses image name first-calc-first-calc.
docker tag "${NEW_TAG}" first-calc-first-calc:latest
docker tag "${NEW_TAG}" first-calc-first-calc
log "retagged compose image name to ${NEW_IMAGE_ID}"

# Ensure compose file still binds 127.0.0.1:3003 (read-only check)
grep -q "127.0.0.1:3003:3000" docker-compose.yml || grep -q "'127.0.0.1:3003:3000'" docker-compose.yml || {
	# also accept quoted form already in file
	if ! grep -E "127\.0\.0\.1:3003:3000" docker-compose.yml >/dev/null; then
		log "ERROR: compose port binding unexpected. STOP."
		exit 2
	fi
}

if docker compose version >/dev/null 2>&1; then
	COMPOSE=(docker compose --project-name "${COMPOSE_PROJECT}")
elif command -v docker-compose >/dev/null 2>&1; then
	COMPOSE=(docker-compose -p "${COMPOSE_PROJECT}")
else
	log "ERROR: docker compose unavailable"
	exit 2
fi

# Recreate ONLY first-calc service from existing image (no build, no global down)
"${COMPOSE[@]}" up -d --no-deps --no-build --force-recreate first-calc 2>&1 | tee -a "${REPORT}"

# Wait for health
log "Waiting for healthcheck..."
deadline=$((SECONDS + 120))
healthy=0
while (( SECONDS < deadline )); do
	st="$(docker inspect first-calc --format '{{.State.Status}}' 2>/dev/null || echo missing)"
	hl="$(docker inspect first-calc --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' 2>/dev/null || echo missing)"
	log "wait status=${st} health=${hl}"
	if [ "${st}" = "running" ] && [ "${hl}" = "healthy" ]; then
		healthy=1
		break
	fi
	if [ "${st}" = "exited" ] || [ "${st}" = "dead" ] || [ "${st}" = "missing" ]; then
		rollback_now "container entered state ${st}"
	fi
	sleep 3
done
[ "${healthy}" = "1" ] || rollback_now "healthcheck timeout"

NEW_CONTAINER_ID="$(docker inspect first-calc --format '{{.Id}}')"
RUNNING_IMAGE_ID="$(docker inspect first-calc --format '{{.Image}}')"
RUNNING_IMAGE_NAME="$(docker inspect first-calc --format '{{.Config.Image}}')"
PORTS_AFTER="$(docker inspect first-calc --format '{{json .HostConfig.PortBindings}}')"
log "cutover_done_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
log "new_container_id=${NEW_CONTAINER_ID}"
log "running_image_id=${RUNNING_IMAGE_ID}"
log "running_image_name=${RUNNING_IMAGE_NAME}"
log "ports_after=${PORTS_AFTER}"

[ "${RUNNING_IMAGE_ID}" = "${NEW_IMAGE_ID}" ] || rollback_now "running image id ${RUNNING_IMAGE_ID} != expected ${NEW_IMAGE_ID}"

# ---------- 3. Smoke ----------
log ""
log "=== 3) SMOKE / SEO ==="

fail=0
check() {
	local name="$1" ok="$2" detail="$3"
	if [ "${ok}" = "1" ]; then
		log "PASS ${name} ${detail}"
	else
		log "FAIL ${name} ${detail}"
		fail=1
	fi
}

code_of() { curl -sS -o /tmp/fc_body -w '%{http_code}' "$1" || echo 000; }
html_of() { cat /tmp/fc_body; }

# Local + public basics
c="$(code_of http://127.0.0.1:3003/)"; check local_3003 "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
c="$(code_of https://first-calc.com/)"; check home_en "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
c="$(code_of https://first-calc.com/ru)"; check home_ru "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
c="$(code_of https://first-calc.com/calculators)"; check calculators "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
c="$(code_of https://first-calc.com/tools)"; check tools "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
c="$(code_of https://first-calc.com/chislo-propisyu)"; check chislo_en "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
html="$(html_of)"
check chislo_en_no_i18n_keys "$([ "$(echo "$html" | grep -c 'legacy/ui.form' || true)" = "0" ] && echo 1 || echo 0)" "raw_keys"
c="$(code_of https://first-calc.com/ru/chislo-propisyu)"; check chislo_ru "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
html="$(html_of)"
check chislo_ru_no_i18n_keys "$([ "$(echo "$html" | grep -c 'legacy/ui.form' || true)" = "0" ] && echo 1 || echo 0)" "raw_keys"
c="$(code_of https://first-calc.com/chislo-propisyu/123)"; check chislo_123 "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
html="$(html_of)"
check chislo_123_words "$(echo "$html" | grep -Eiq 'hundred|сто|123' && echo 1 || echo 0)" "words"
check chislo_123_no_keys "$([ "$(echo "$html" | grep -c 'legacy/ui.form' || true)" = "0" ] && echo 1 || echo 0)" "raw_keys"

# Finance pages
c="$(code_of https://first-calc.com/ru/calculators/finance/investment-calculator)"; check investment_ru "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
c="$(code_of https://first-calc.com/ru/calculators/finance/savings-calculator)"; check savings_ru "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"

# Sitemap / robots
c="$(code_of https://first-calc.com/sitemap.xml)"; html="$(html_of)"
url_count="$(echo "$html" | grep -c '<url>' || true)"
check sitemap_status "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
check sitemap_url_count "$([ "$url_count" = "324" ] && echo 1 || echo 0)" "count=$url_count"
c="$(code_of https://first-calc.com/robots.txt)"; html="$(html_of)"
check robots "$([ "$c" = "200" ] && echo "$html" | grep -q 'Sitemap:' && ! echo "$html" | grep -Eq 'Disallow:[[:space:]]*/[[:space:]]*$' && echo 1 || echo 0)" "status=$c"

# Limited locale containment sample (3 locales x key routes)
pick_canon() {
	echo "$1" | tr '\n' ' ' | sed -n 's/.*rel=["'"'"']canonical["'"'"'][^>]*href=["'"'"']\([^"'"'"']*\)["'"'"'].*/\1/p; t; s/.*href=["'"'"']\([^"'"'"']*\)["'"'"'][^>]*rel=["'"'"']canonical["'"'"'].*/\1/p'
}
pick_robots() {
	echo "$1" | tr '\n' ' ' | sed -n 's/.*name=["'"'"']robots["'"'"'][^>]*content=["'"'"']\([^"'"'"']*\)["'"'"'].*/\1/p; t; s/.*content=["'"'"']\([^"'"'"']*\)["'"'"'][^>]*name=["'"'"']robots["'"'"'].*/\1/p'
}
for loc in es tr hi; do
	for route in /chislo-propisyu /learn /standards; do
		c="$(code_of "https://first-calc.com/${loc}${route}")"
		html="$(html_of)"
		canon="$(pick_canon "$html")"
		robots="$(pick_robots "$html")"
		ok=1
		echo "$robots" | grep -qi noindex || ok=0
		echo "$canon" | grep -q "first-calc.com${route}" || ok=0
		echo "$canon" | grep -q "/${loc}/" && ok=0
		echo "$html" | grep -Eiq 'hreflang=["'"'"'](es|tr|hi)["'"'"']' && ok=0
		check "limited_${loc}${route}" "$ok" "status=$c robots=$robots canon=$canon"
	done
done

# EN informational canonicals
for path in /about /privacy /terms /disclaimer /contact; do
	c="$(code_of "https://first-calc.com${path}")"
	html="$(html_of)"
	canon="$(pick_canon "$html")"
	robots="$(pick_robots "$html")"
	ok=1
	[ "$c" = "200" ] || ok=0
	echo "$canon" | grep -q "first-calc.com${path}" || ok=0
	echo "$robots" | grep -qi noindex && ok=0
	check "encanon_${path}" "$ok" "status=$c canon=$canon"
done

# Historical / legacy landings
for path in /numbers-to-words /roman-numerals-converter /root-calculator /add-subtract-percentage /percentage-of-a-number; do
	c="$(code_of "https://first-calc.com${path}")"
	check "legacy_${path}" "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
done

# Peer sites after
c="$(code_of https://calc1.ru/)"; check peer_calc1 "$([ "$c" = "200" ] || [ "$c" = "301" ] || [ "$c" = "308" ] || [ "$c" = "307" ] && echo 1 || echo 0)" "status=$c"
# follow redirects for calc1 functional check
c="$(curl -sS -o /dev/null -w '%{http_code}' -L --max-redirs 5 https://calc1.ru/ || echo 000)"
check peer_calc1_followed "$([ "$c" = "200" ] && echo 1 || echo 0)" "status=$c"
c="$(code_of https://pipetkaonline.ru/)"; check peer_pipetka "$([ "$c" = "200" ] || [ "$c" = "301" ] || [ "$c" = "302" ] || [ "$c" = "307" ] || [ "$c" = "308" ] && echo 1 || echo 0)" "status=$c"

# Logs — critical errors in last 80 lines
log "-- first-calc logs (tail) --"
docker logs --tail 80 first-calc 2>&1 | tee -a "${REPORT}" || true
if docker logs --tail 80 first-calc 2>&1 | grep -Eiq 'FATAL|Cannot find module|EADDRINUSE|Error: listen'; then
	fail=1
	log "FAIL critical_log_pattern"
else
	log "PASS critical_log_pattern"
fi

# Peer containers still same / healthy
for peer in calc1-app pipetkaonline-app; do
	st="$(docker inspect "${peer}" --format '{{.State.Status}}/{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' 2>/dev/null || echo missing)"
	check "peer_container_${peer}" "$(echo "$st" | grep -q 'running/healthy' && echo 1 || echo 0)" "$st"
done

log "smoke_fail_count=${fail}"
if [ "${fail}" -ne 0 ]; then
	rollback_now "smoke/SEO failures (${fail})"
fi

# Persist cutover markers
printf '%s\n' "${STAMP}" > /var/backups/first-calc/LAST_CUTOVER_UTC
printf '%s\n' "${RUNNING_IMAGE_ID}" > /var/backups/first-calc/LAST_CUTOVER_IMAGE_ID
printf '%s\n' "${RELEASE_SHA}" > /var/backups/first-calc/LAST_CUTOVER_SHA

log ""
log "STATUS=DEPLOY_SUCCESS"
log "cutover_start_utc=${CUTOVER_START}"
log "running_image_id=${RUNNING_IMAGE_ID}"
log "rollback_available=${ROLLBACK_TAG} @ ${BACKUP_DIR}"
echo "----- REPORT BEGIN -----"
cat "${REPORT}"
echo "----- REPORT END -----"
