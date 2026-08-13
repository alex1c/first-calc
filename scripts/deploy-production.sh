#!/usr/bin/env bash

set -Eeuo pipefail

readonly CONTAINER_NAME="first-calc"
readonly WAIT_TIMEOUT_SECONDS=90
readonly POLL_INTERVAL_SECONDS=3

if docker compose version >/dev/null 2>&1; then
	COMPOSE=(docker compose --project-name first-calc)
elif command -v docker-compose >/dev/null 2>&1 && docker-compose version >/dev/null 2>&1; then
	COMPOSE=(docker-compose -p first-calc)
else
	echo "ERROR: Docker Compose v2 or docker-compose v1 is required." >&2
	exit 1
fi

diagnostics() {
	echo "Container diagnostics:"
	docker ps -a --filter "name=^/${CONTAINER_NAME}$" || true
	docker inspect "${CONTAINER_NAME}" || true
	docker logs --tail 100 "${CONTAINER_NAME}" || true
	"${COMPOSE[@]}" ps -a || true
	"${COMPOSE[@]}" logs --tail 100 || true
}

echo "Building the new image while the current container remains available..."
"${COMPOSE[@]}" build --no-cache

echo "Replacing the existing first-calc container..."
if ! "${COMPOSE[@]}" down --remove-orphans; then
	echo "WARNING: Compose could not remove the previous project; continuing with the exact container-name safeguard." >&2
fi

# A container created by an older Compose project or manually is not necessarily
# owned by the current Compose project, so `compose down` may leave it behind.
if docker container inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
	docker rm -f "${CONTAINER_NAME}"
fi

if ! "${COMPOSE[@]}" up -d --no-build; then
	echo "ERROR: Failed to start the new container." >&2
	diagnostics
	exit 1
fi

echo "Waiting up to ${WAIT_TIMEOUT_SECONDS}s for the application healthcheck..."
deadline=$((SECONDS + WAIT_TIMEOUT_SECONDS))
while (( SECONDS < deadline )); do
	state="$(docker inspect --format '{{.State.Status}}' "${CONTAINER_NAME}" 2>/dev/null || echo missing)"
	health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "${CONTAINER_NAME}" 2>/dev/null || echo missing)"

	case "${state}:${health}" in
		running:healthy)
			echo "Deployment successful: ${CONTAINER_NAME} is healthy."
			docker ps --filter "name=^/${CONTAINER_NAME}$"
			docker logs --tail 20 "${CONTAINER_NAME}"
			docker image prune -f
			exit 0
			;;
		exited:*|dead:*|removing:*|missing:*)
			echo "ERROR: Container entered state '${state}' (health: '${health}')." >&2
			diagnostics
			exit 1
			;;
		running:unhealthy)
			echo "ERROR: Container healthcheck reported unhealthy." >&2
			diagnostics
			exit 1
			;;
	esac

	sleep "${POLL_INTERVAL_SECONDS}"
done

echo "ERROR: Timed out waiting for a healthy container." >&2
diagnostics
exit 1
