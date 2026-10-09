#!/usr/bin/env bash
# Stages 2–3 on Timeweb: backup + build only. NO cutover. NO container recreate.
# Runs ON Timeweb as root (invoked via OLD jump).
set -euo pipefail

RELEASE_SHA="${RELEASE_SHA:?RELEASE_SHA required}"
PROJECT_DIR="/var/www/first-calc"
BACKUP_ROOT="/var/backups/first-calc"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="${BACKUP_ROOT}/${STAMP}"
BUILD_DIR="/var/www/first-calc-build-${RELEASE_SHA}"
IMAGE_TAG="first-calc:${RELEASE_SHA}"
ROLLBACK_TAG="first-calc:rollback-${STAMP}"
REPO_URL="https://github.com/alex1c/first-calc.git"
REPORT="/tmp/first-calc-stage23-${STAMP}.txt"

log() { echo "$@" | tee -a "${REPORT}"; }

: > "${REPORT}"
log "=== FIRST CALC STAGES 2-3 (backup + build, no cutover) ==="
log "UTC=${STAMP}"
log "TARGET_SHA=${RELEASE_SHA}"
log "hostname=$(hostname)"

# --- preflight: do not touch peers / running first-calc ---
log ""
log "=== PREFLIGHT ==="
if ! docker inspect first-calc >/dev/null 2>&1; then
	log "ERROR: first-calc container missing. STOP."
	exit 1
fi
FC_STATUS="$(docker inspect first-calc --format '{{.State.Status}}')"
FC_HEALTH="$(docker inspect first-calc --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}')"
log "first-calc status=${FC_STATUS} health=${FC_HEALTH}"
if [ "${FC_STATUS}" != "running" ]; then
	log "ERROR: first-calc is not running. STOP (no repair in this stage)."
	exit 1
fi

for peer in calc1-app pipetkaonline-app; do
	if docker inspect "${peer}" >/dev/null 2>&1; then
		log "peer ${peer}=$(docker inspect "${peer}" --format '{{.State.Status}}/{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}')"
	else
		log "peer ${peer}=not_found_by_exact_name"
	fi
done

df -h / /var/www 2>/dev/null | tee -a "${REPORT}" || df -h | head -n 10 | tee -a "${REPORT}"
AVAIL_KB="$(df -Pk /var/www 2>/dev/null | awk 'NR==2{print $4}')"
# Require ~4Gi free for build (Next standalone image ~276Mi final; build needs more)
if [ -n "${AVAIL_KB}" ] && [ "${AVAIL_KB}" -lt 4000000 ]; then
	log "ERROR: less than ~4Gi free on /var/www (${AVAIL_KB} KiB). STOP."
	exit 1
fi
log "disk_ok avail_kib=${AVAIL_KB:-unknown}"

# --- Stage 2: backup ---
log ""
log "=== STAGE 2: BACKUP ==="
mkdir -p "${BACKUP_DIR}/apache"

CONTAINER_ID="$(docker inspect first-calc --format '{{.Id}}')"
IMAGE_NAME="$(docker inspect first-calc --format '{{.Config.Image}}')"
IMAGE_ID="$(docker inspect first-calc --format '{{.Image}}')"
STARTED="$(docker inspect first-calc --format '{{.State.StartedAt}}')"
BUILD_ID="$(docker exec first-calc sh -c 'cat /app/.next/BUILD_ID 2>/dev/null || echo none' || echo none)"

printf '%s\n' "${CONTAINER_ID}" > "${BACKUP_DIR}/container_id.txt"
printf '%s\n' "${IMAGE_NAME}" > "${BACKUP_DIR}/image_name.txt"
printf '%s\n' "${IMAGE_ID}" > "${BACKUP_DIR}/image_id.txt"
printf '%s\n' "${STARTED}" > "${BACKUP_DIR}/started_at.txt"
printf '%s\n' "${BUILD_ID}" > "${BACKUP_DIR}/build_id.txt"
printf '%s\n' "${ROLLBACK_TAG}" > "${BACKUP_DIR}/rollback_image_tag.txt"
printf '%s\n' "${RELEASE_SHA}" > "${BACKUP_DIR}/target_sha.txt"
printf '%s\n' "unknown-no-git-checkout" > "${BACKUP_DIR}/previous_sha.txt"

docker inspect first-calc > "${BACKUP_DIR}/first-calc.inspect.json"
docker image inspect "${IMAGE_ID}" > "${BACKUP_DIR}/image.inspect.json" || true

if [ -f "${PROJECT_DIR}/docker-compose.yml" ]; then
	cp -a "${PROJECT_DIR}/docker-compose.yml" "${BACKUP_DIR}/docker-compose.yml"
else
	log "ERROR: docker-compose.yml missing in ${PROJECT_DIR}"
	exit 1
fi
[ -f "${PROJECT_DIR}/Dockerfile" ] && cp -a "${PROJECT_DIR}/Dockerfile" "${BACKUP_DIR}/Dockerfile" || true
[ -f "${PROJECT_DIR}/.env" ] && cp -a "${PROJECT_DIR}/.env" "${BACKUP_DIR}/.env" || true

# Apache first-calc configs only (no secrets printed)
for f in /etc/apache2/sites-enabled/first-calc.com.conf \
	/etc/apache2/sites-enabled/first-calc.com-ssl.conf \
	/etc/apache2/sites-available/first-calc.com.conf \
	/etc/apache2/sites-available/first-calc.com-ssl.conf; do
	[ -e "$f" ] || continue
	cp -a "$f" "${BACKUP_DIR}/apache/" || true
done

# Tag live image for rollback WITHOUT touching the running container
docker tag "${IMAGE_ID}" "${ROLLBACK_TAG}"
docker image inspect "${ROLLBACK_TAG}" --format 'rollback_ok id={{.Id}} tag={{.RepoTags}}' | tee -a "${REPORT}"

# Tar app tree excluding heavy/build junk (no secrets echoed)
# Persistent volumes: compose has none mounted for first-calc; tree copy is the app backup.
log "Creating app tree archive (excludes node_modules/.next/.git)..."
tar -C /var/www -czf "${BACKUP_DIR}/first-calc-tree.tgz" \
	--exclude='first-calc/node_modules' \
	--exclude='first-calc/.next' \
	--exclude='first-calc/.git' \
	first-calc

cat > "${BACKUP_DIR}/ROLLBACK.sh" <<'EOS'
#!/usr/bin/env bash
# Rollback FIRST-CALC ONLY. Do not touch calc1 / pipetka.
set -euo pipefail
BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="/var/www/first-calc"
ROLLBACK_TAG="$(cat "${BACKUP_DIR}/rollback_image_tag.txt")"
cd "${PROJECT_DIR}"
cp -a "${BACKUP_DIR}/docker-compose.yml" "${PROJECT_DIR}/docker-compose.yml"
if [ -f "${BACKUP_DIR}/.env" ]; then cp -a "${BACKUP_DIR}/.env" "${PROJECT_DIR}/.env"; fi
if ! docker image inspect "${ROLLBACK_TAG}" >/dev/null 2>&1; then
	echo "ERROR: rollback image ${ROLLBACK_TAG} missing"
	exit 1
fi
# Retag so compose build/image name resolves to rollback bits if needed
docker tag "${ROLLBACK_TAG}" first-calc-first-calc:latest || true
docker tag "${ROLLBACK_TAG}" first-calc-first-calc || true
# Recreate only first-calc from the tagged image (explicit run fallback)
docker rm -f first-calc
docker run -d --name first-calc --restart unless-stopped \
	-p 127.0.0.1:3003:3000 \
	-e NODE_ENV=production \
	-e NEXT_TELEMETRY_DISABLED=1 \
	-e NEXT_PUBLIC_DATA_SOURCE=local \
	-e NEXT_PUBLIC_BASE_URL=https://first-calc.com \
	-e NEXT_PUBLIC_ENV=production \
	"${ROLLBACK_TAG}"
sleep 8
curl -fsS -o /dev/null -w 'local:%{http_code}\n' http://127.0.0.1:3003/
curl -fsS -o /dev/null -w 'https:%{http_code}\n' https://first-calc.com/
EOS
chmod +x "${BACKUP_DIR}/ROLLBACK.sh"

# Verify backup usability
test -r "${BACKUP_DIR}/image_id.txt"
test -r "${BACKUP_DIR}/container_id.txt"
test -r "${BACKUP_DIR}/docker-compose.yml"
test -x "${BACKUP_DIR}/ROLLBACK.sh"
test -s "${BACKUP_DIR}/first-calc-tree.tgz"
docker image inspect "${ROLLBACK_TAG}" >/dev/null

mkdir -p "${BACKUP_ROOT}"
printf '%s\n' "${BACKUP_DIR}" > "${BACKUP_ROOT}/LATEST_BACKUP_DIR"
printf '%s\n' "${ROLLBACK_TAG}" > "${BACKUP_ROOT}/LATEST_ROLLBACK_TAG"
printf '%s\n' "${IMAGE_ID}" > "${BACKUP_ROOT}/LATEST_PREV_IMAGE_ID"

log "backup_dir=${BACKUP_DIR}"
log "backup_container_id=${CONTAINER_ID}"
log "backup_image_id=${IMAGE_ID}"
log "backup_image_name=${IMAGE_NAME}"
log "backup_build_id=${BUILD_ID}"
log "rollback_tag=${ROLLBACK_TAG}"
log "backup_archive_bytes=$(wc -c < "${BACKUP_DIR}/first-calc-tree.tgz" | tr -d ' ')"
log "backup_verified=yes"

# Confirm running container still same id / still running (we must not have replaced it)
NOW_ID="$(docker inspect first-calc --format '{{.Id}}')"
NOW_STATUS="$(docker inspect first-calc --format '{{.State.Status}}')"
if [ "${NOW_ID}" != "${CONTAINER_ID}" ] || [ "${NOW_STATUS}" != "running" ]; then
	log "ERROR: first-calc container identity/status changed during backup. STOP."
	exit 1
fi
log "running_container_unchanged=yes"

# --- Stage 3: build ---
log ""
log "=== STAGE 3: BUILD (no cutover) ==="
if [ "${#RELEASE_SHA}" -ne 40 ]; then
	log "ERROR: RELEASE_SHA must be full 40-char hash"
	exit 1
fi

rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"
# Fresh clone of exact SHA into isolated directory (live tree has no .git)
git clone --no-checkout "${REPO_URL}" "${BUILD_DIR}"
cd "${BUILD_DIR}"
git fetch --depth 1 origin "${RELEASE_SHA}"
git checkout --detach "${RELEASE_SHA}"
RESOLVED="$(git rev-parse HEAD)"
if [ "${RESOLVED}" != "${RELEASE_SHA}" ]; then
	log "ERROR: checked out ${RESOLVED}, expected ${RELEASE_SHA}"
	exit 1
fi
log "source_sha_verified=${RESOLVED}"

# Production public env for Next build-time inlining
export NEXT_PUBLIC_BASE_URL=https://first-calc.com
export NEXT_PUBLIC_ENV=production
export NEXT_PUBLIC_DATA_SOURCE=local
cat > .env <<'ENV'
NEXT_PUBLIC_BASE_URL=https://first-calc.com
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_DATA_SOURCE=local
ENV
if grep -Eq 'NEXT_PUBLIC_ENV=(test|staging)' .env; then
	log "ERROR: staging/test in build env"
	exit 1
fi
log "build_env NEXT_PUBLIC_BASE_URL=https://first-calc.com NEXT_PUBLIC_ENV=production"

# Ensure rollback tag still exists before building (must not overwrite without rollback)
if ! docker image inspect "${ROLLBACK_TAG}" >/dev/null 2>&1; then
	log "ERROR: rollback tag disappeared before build. STOP."
	exit 1
fi

log "Building ${IMAGE_TAG} (running container untouched)..."
# Do NOT tag as first-calc-first-calc / latest — that would risk confusing the live name.
# Only explicit release tags.
DOCKER_BUILDKIT=1 docker build \
	-t "${IMAGE_TAG}" \
	-t "first-calc:release-candidate" \
	.

NEW_IMAGE_ID="$(docker image inspect "${IMAGE_TAG}" --format '{{.Id}}')"
log "new_image_tag=${IMAGE_TAG}"
log "new_image_id=${NEW_IMAGE_ID}"
docker image inspect "${IMAGE_TAG}" --format 'created={{.Created}} size={{.Size}}' | tee -a "${REPORT}"

# Critical: live compose image name must still resolve to OLD bits via rollback tag safety
# Do not retag first-calc-first-calc to the new image.
LIVE_IMAGE_NOW="$(docker inspect first-calc --format '{{.Image}}')"
if [ "${LIVE_IMAGE_NOW}" != "${IMAGE_ID}" ]; then
	log "ERROR: live container image id changed during build. STOP."
	exit 1
fi
log "live_image_unchanged=${LIVE_IMAGE_NOW}"

printf '%s\n' "${IMAGE_TAG}" > "${BACKUP_DIR}/new_image_tag.txt"
printf '%s\n' "${NEW_IMAGE_ID}" > "${BACKUP_DIR}/new_image_id.txt"
printf '%s\n' "${IMAGE_TAG}" > "${BACKUP_ROOT}/LATEST_NEW_IMAGE"
printf '%s\n' "${RELEASE_SHA}" > "${BACKUP_ROOT}/LATEST_TARGET_SHA"
printf '%s\n' "${NEW_IMAGE_ID}" > "${BACKUP_ROOT}/LATEST_NEW_IMAGE_ID"

# Cleanup build worktree only (keep images)
cd /
rm -rf "${BUILD_DIR}"
log "build_dir_removed=${BUILD_DIR}"

# --- post checks ---
log ""
log "=== POST CHECKS ==="
log "-- images --"
docker images --format 'table {{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.Size}}' | grep -E 'first-calc|REPOSITORY' | tee -a "${REPORT}" || true
docker image inspect "${ROLLBACK_TAG}" --format 'rollback_present id={{.Id}}' | tee -a "${REPORT}"
docker image inspect "${IMAGE_TAG}" --format 'new_present id={{.Id}}' | tee -a "${REPORT}"

log "-- container still running (same id) --"
docker inspect first-calc --format 'id={{.Id}} status={{.State.Status}} health={{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' | tee -a "${REPORT}"
test "$(docker inspect first-calc --format '{{.Id}}')" = "${CONTAINER_ID}"

log "-- three sites --"
curl -sS -o /dev/null -w 'local_3003=%{http_code}\n' http://127.0.0.1:3003/ | tee -a "${REPORT}"
curl -sS -o /dev/null -w 'first_calc_https=%{http_code}\n' https://first-calc.com/ | tee -a "${REPORT}"
curl -sS -o /dev/null -w 'calc1_https=%{http_code}\n' -L --max-redirs 5 https://calc1.ru/ | tee -a "${REPORT}"
curl -sS -o /dev/null -w 'pipetka_https=%{http_code}\n' https://pipetkaonline.ru/ | tee -a "${REPORT}"
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | tee -a "${REPORT}"

log "-- disk after build --"
df -h / /var/www 2>/dev/null | tee -a "${REPORT}" || df -h | head -n 10 | tee -a "${REPORT}"

log ""
log "=== CUTOVER PROCEDURE (DO NOT RUN YET) ==="
log "1) Confirm approval."
log "2) On Timeweb: docker tag ${IMAGE_TAG} first-calc-first-calc:latest  # or pin compose image:"
log "   Prefer: docker rm -f first-calc && docker run -d --name first-calc --restart unless-stopped -p 127.0.0.1:3003:3000 -e NODE_ENV=production -e NEXT_TELEMETRY_DISABLED=1 -e NEXT_PUBLIC_DATA_SOURCE=local -e NEXT_PUBLIC_BASE_URL=https://first-calc.com -e NEXT_PUBLIC_ENV=production ${IMAGE_TAG}"
log "3) Verify: curl http://127.0.0.1:3003/ and https://first-calc.com/"
log "4) Smoke SEO/UI checks."
log ""
log "=== ROLLBACK PROCEDURE ==="
log "bash ${BACKUP_DIR}/ROLLBACK.sh"
log "Uses image ${ROLLBACK_TAG} and restores compose from backup."
log ""
log "CUTOVER=NOT_PERFORMED"
log "STATUS=READY_FOR_CUTOVER_APPROVAL"
log "REPORT=${REPORT}"
echo "----- REPORT BEGIN -----"
cat "${REPORT}"
echo "----- REPORT END -----"
