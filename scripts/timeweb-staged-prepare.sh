#!/usr/bin/env bash
# Stages 1–3 for Timeweb First Calc deploy. No production cutover.
# Required env: RELEASE_SHA, PHASE=diagnose|prepare
set -euo pipefail

RELEASE_SHA="${RELEASE_SHA:?RELEASE_SHA required}"
PHASE="${PHASE:-prepare}"
PROJECT_DIR="/var/www/first-calc"
BACKUP_ROOT="/var/backups/first-calc"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="${BACKUP_ROOT}/${STAMP}"
REPORT="/tmp/first-calc-staged-${STAMP}.txt"
BUILD_DIR="/var/www/first-calc-build-${RELEASE_SHA}"
IMAGE_TAG="first-calc:${RELEASE_SHA}"

log() { echo "$@" | tee -a "${REPORT}"; }

: > "${REPORT}"
log "=== FIRST CALC STAGED PREPARE ==="
log "UTC: ${STAMP}"
log "PHASE: ${PHASE}"
log "TARGET_SHA: ${RELEASE_SHA}"
log "HOSTNAME: $(hostname)"

log ""
log "=== STAGE 1: DIAGNOSTICS ==="

if [ ! -d "${PROJECT_DIR}/.git" ]; then
	log "ERROR: ${PROJECT_DIR} is not a git checkout. STOP."
	exit 1
fi

cd "${PROJECT_DIR}"
CURRENT_SHA="$(git rev-parse HEAD 2>/dev/null || echo unknown)"
CURRENT_DIRTY="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
log "current_production_sha=${CURRENT_SHA}"
log "working_tree_dirty_lines=${CURRENT_DIRTY}"

log ""
log "-- docker ps (all) --"
docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}' | tee -a "${REPORT}"

log ""
log "-- compose / project dirs (other sites isolation check) --"
ls -la /var/www 2>/dev/null | tee -a "${REPORT}" || true
docker ps --format '{{.Names}}' | tee -a "${REPORT}"

log ""
log "-- first-calc inspect --"
if docker inspect first-calc >/dev/null 2>&1; then
	docker inspect first-calc --format 'id={{.Id}} image={{.Config.Image}} status={{.State.Status}} health={{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}} started={{.State.StartedAt}}' | tee -a "${REPORT}"
	log "first_calc_image_id=$(docker inspect first-calc --format '{{.Image}}')"
else
	log "WARNING: container named first-calc not found"
fi

log ""
log "-- docker-compose.yml --"
if [ -f docker-compose.yml ]; then
	sed -E 's/(PASSWORD|SECRET|TOKEN|KEY|PRIVATE)=.*/\1=***REDACTED***/I' docker-compose.yml | tee -a "${REPORT}"
else
	log "ERROR: docker-compose.yml missing"
	exit 1
fi

log ""
log "-- Apache proxy for first-calc / :3003 --"
grep -RIn -E 'first-calc|3003' /etc/apache2/sites-enabled/ 2>/dev/null | head -n 80 | tee -a "${REPORT}" || true

log ""
log "-- listen :3003 --"
ss -lnt | grep -E ':3003\b' | tee -a "${REPORT}" || log "ss: nothing on 3003"

log ""
log "-- HTTPS checks --"
curl -sS -o /dev/null -w 'https_first_calc status=%{http_code} time=%{time_total}\n' https://first-calc.com/ | tee -a "${REPORT}" || log "curl first-calc.com failed"
curl -sS -o /dev/null -w 'calc1.ru status=%{http_code}\n' -L --max-redirs 5 https://calc1.ru/ | tee -a "${REPORT}" || log "calc1 check failed"
curl -sS -o /dev/null -w 'pipetkaonline.ru status=%{http_code}\n' https://pipetkaonline.ru/ | tee -a "${REPORT}" || log "pipetka check failed"

log ""
log "-- disk / memory --"
df -h / /var/www 2>/dev/null | tee -a "${REPORT}" || df -h | head -n 20 | tee -a "${REPORT}"
free -h | tee -a "${REPORT}" || true

log ""
log "-- env keys present (values redacted) --"
if [ -f .env ]; then
	awk -F= '/^[A-Za-z_][A-Za-z0-9_]*=/{print $1"=***"}' .env | tee -a "${REPORT}"
else
	log "no .env file in project dir"
fi
if docker inspect first-calc >/dev/null 2>&1; then
	docker inspect first-calc --format '{{range .Config.Env}}{{println .}}{{end}}' \
		| sed -E 's/^([^=]+)=.*/\1=***/' | tee -a "${REPORT}"
fi

if [ "${CURRENT_DIRTY}" != "0" ] && [ "${CURRENT_DIRTY}" -gt 20 ]; then
	log "ERROR: production working tree has ${CURRENT_DIRTY} dirty paths. STOP."
	exit 1
fi

if [ "${PHASE}" = "diagnose" ]; then
	log "PHASE=diagnose complete. No backup/build."
	cat "${REPORT}"
	exit 0
fi

log ""
log "=== STAGE 2: BACKUP ==="
mkdir -p "${BACKUP_DIR}/apache"
echo "${CURRENT_SHA}" > "${BACKUP_DIR}/previous_sha.txt"
if docker inspect first-calc >/dev/null 2>&1; then
	docker inspect first-calc > "${BACKUP_DIR}/first-calc.inspect.json"
	docker inspect first-calc --format '{{.Id}}' > "${BACKUP_DIR}/container_id.txt"
	docker inspect first-calc --format '{{.Config.Image}}' > "${BACKUP_DIR}/image_name.txt"
	docker inspect first-calc --format '{{.Image}}' > "${BACKUP_DIR}/image_id.txt"
	IMG_NAME="$(cat "${BACKUP_DIR}/image_name.txt")"
	docker tag "${IMG_NAME}" "first-calc:rollback-${STAMP}" || true
	echo "first-calc:rollback-${STAMP}" > "${BACKUP_DIR}/rollback_image_tag.txt"
fi
cp -a docker-compose.yml "${BACKUP_DIR}/docker-compose.yml"
[ -f .env ] && cp -a .env "${BACKUP_DIR}/.env" || true
[ -f Dockerfile ] && cp -a Dockerfile "${BACKUP_DIR}/Dockerfile" || true
for f in /etc/apache2/sites-enabled/*first-calc* /etc/apache2/sites-available/*first-calc*; do
	[ -e "$f" ] || continue
	cp -a "$f" "${BACKUP_DIR}/apache/" || true
done
grep -RIl '3003' /etc/apache2/sites-enabled/ 2>/dev/null | while read -r vf; do
	cp -a "$vf" "${BACKUP_DIR}/apache/" || true
done

cat > "${BACKUP_DIR}/ROLLBACK.sh" <<'EOS'
#!/usr/bin/env bash
set -euo pipefail
BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="/var/www/first-calc"
PREV_SHA="$(cat "${BACKUP_DIR}/previous_sha.txt")"
ROLLBACK_TAG="$(cat "${BACKUP_DIR}/rollback_image_tag.txt" 2>/dev/null || true)"
cd "${PROJECT_DIR}"
git fetch origin || true
git checkout -f "${PREV_SHA}"
cp -a "${BACKUP_DIR}/docker-compose.yml" "${PROJECT_DIR}/docker-compose.yml"
if [ -f "${BACKUP_DIR}/.env" ]; then cp -a "${BACKUP_DIR}/.env" "${PROJECT_DIR}/.env"; fi
docker rm -f first-calc
if [ -n "${ROLLBACK_TAG}" ] && docker image inspect "${ROLLBACK_TAG}" >/dev/null 2>&1; then
	# Recreate only the first-calc service from the tagged rollback image
	docker compose --project-name first-calc up -d --no-deps --no-build first-calc || \
		docker run -d --name first-calc --restart unless-stopped -p 127.0.0.1:3003:3000 \
			-e NODE_ENV=production \
			-e NEXT_PUBLIC_BASE_URL=https://first-calc.com \
			-e NEXT_PUBLIC_ENV=production \
			-e NEXT_PUBLIC_DATA_SOURCE=local \
			"${ROLLBACK_TAG}"
else
	docker compose --project-name first-calc up -d --no-deps first-calc
fi
sleep 5
curl -fsS -o /dev/null -w 'local:%{http_code}\n' http://127.0.0.1:3003/
curl -fsS -o /dev/null -w 'https:%{http_code}\n' https://first-calc.com/
EOS
chmod +x "${BACKUP_DIR}/ROLLBACK.sh"

test -r "${BACKUP_DIR}/previous_sha.txt"
test -x "${BACKUP_DIR}/ROLLBACK.sh"
log "backup_dir=${BACKUP_DIR}"
log "backup_previous_sha=$(cat "${BACKUP_DIR}/previous_sha.txt")"
log "backup_readable=yes"

log ""
log "=== STAGE 3: PREPARE / BUILD (no cutover) ==="
git fetch --all --tags origin 2>&1 | tee -a "${REPORT}" || true
git fetch origin fix/ru-catalog-seo-recovery:refs/remotes/origin/fix/ru-catalog-seo-recovery 2>&1 | tee -a "${REPORT}" || true
git fetch origin "${RELEASE_SHA}" 2>&1 | tee -a "${REPORT}" || true

if ! git cat-file -e "${RELEASE_SHA}^{commit}" 2>/dev/null; then
	log "ERROR: release SHA ${RELEASE_SHA} not available after fetch. STOP."
	exit 1
fi
RESOLVED="$(git rev-parse "${RELEASE_SHA}")"
if [ "${RESOLVED}" != "${RELEASE_SHA}" ]; then
	log "ERROR: RELEASE_SHA must be the full exact hash. resolved=${RESOLVED}"
	exit 1
fi
log "release_sha_verified=${RESOLVED}"

rm -rf "${BUILD_DIR}"
git worktree add --detach "${BUILD_DIR}" "${RELEASE_SHA}"
cd "${BUILD_DIR}"

export NEXT_PUBLIC_BASE_URL=https://first-calc.com
export NEXT_PUBLIC_ENV=production
cat > .env <<'ENV'
NEXT_PUBLIC_BASE_URL=https://first-calc.com
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_DATA_SOURCE=local
ENV

if grep -Eq 'NEXT_PUBLIC_ENV=(test|staging)' .env; then
	log "ERROR: staging/test env in build .env"
	exit 1
fi
log "build_env NEXT_PUBLIC_BASE_URL=https://first-calc.com NEXT_PUBLIC_ENV=production"

log "Building image ${IMAGE_TAG} (running container untouched)..."
# No compose down, no prune, no recreate of running container
docker build -t "${IMAGE_TAG}" -t first-calc:release-candidate .

docker image inspect "${IMAGE_TAG}" --format 'image_id={{.Id}} created={{.Created}} size={{.Size}}' | tee -a "${REPORT}"
log "new_image_ready=${IMAGE_TAG}"
log "running_container_still=$(docker inspect first-calc --format '{{.State.Status}}' 2>/dev/null || echo missing)"

echo "${RELEASE_SHA}" > "${BACKUP_DIR}/target_sha.txt"
echo "${IMAGE_TAG}" > "${BACKUP_DIR}/new_image_tag.txt"
mkdir -p "${BACKUP_ROOT}"
echo "${BACKUP_DIR}" > "${BACKUP_ROOT}/LATEST_BACKUP_DIR"
echo "${IMAGE_TAG}" > "${BACKUP_ROOT}/LATEST_NEW_IMAGE"
echo "${RELEASE_SHA}" > "${BACKUP_ROOT}/LATEST_TARGET_SHA"

cd "${PROJECT_DIR}"
git worktree remove --force "${BUILD_DIR}" || rm -rf "${BUILD_DIR}"

log ""
log "=== STAGE 4 PRE-SWITCH SUMMARY ==="
log "current_production_sha=${CURRENT_SHA}"
log "target_sha=${RELEASE_SHA}"
log "backup_dir=${BACKUP_DIR}"
log "rollback_script=${BACKUP_DIR}/ROLLBACK.sh"
log "new_image=${IMAGE_TAG}"
log "docker_first_calc_status=$(docker inspect first-calc --format '{{.State.Status}}/{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' 2>/dev/null || echo missing)"
log "CUTOVER=NOT_PERFORMED"
log "STOP: awaiting explicit user confirmation before Stage 5 switch."
echo "----- REPORT BEGIN -----"
cat "${REPORT}"
echo "----- REPORT END -----"
