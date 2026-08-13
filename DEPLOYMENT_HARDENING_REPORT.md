# Phase 2.1 — Deployment Hardening

## Root causes

1. **Container-name conflict.** The service has the fixed name `first-calc`, but `compose down` only removes containers that belong to the current Compose project (as identified by Compose labels/project name). A legacy, manually created, orphaned, or differently named Compose-project container can therefore retain `/first-calc` and block `compose up`. Repository history cannot distinguish which of those created the production container, but the observed fact that `compose down` left it while `docker rm first-calc` fixed the deployment confirms that it was outside the current project's removable set.
2. **Unhealthy status.** The healthcheck invoked `wget` inside the final `node:18-alpine` image. The Dockerfile does not install or copy `wget` into that stage, so the check could fail even while the Node server on internal port 3000 was serving traffic.

## Changes

- Compose schema `version` was removed because modern Compose Specification ignores it.
- The healthcheck now uses the Node runtime already present in the image and requests `http://127.0.0.1:3000/`. It accepts HTTP 200 only, has a 30-second startup grace period, and does not depend on Apache, public DNS, or the external port 3003.
- Deployment detects Compose v2 first and safely falls back to legacy `docker-compose`. It pins the project name to `first-calc` for predictable ownership.
- The new image is built before the running container is touched. After a successful build, Compose removes its project containers/orphans and an exact-name safeguard removes only `first-calc` if it still exists.
- Startup uses the already built image. Deployment polls container state/health for at most 90 seconds, succeeds only on `running:healthy`, and fails immediately on unhealthy/exited/dead states.
- Failed startup or timeout prints filtered container status, inspect output, container logs, Compose status, and Compose logs.
- The SSH test no longer pipes verbose output through `tail`, so its exit status is preserved. Temporary key-header/fingerprint/host debug output was removed.
- SSH uses the populated `known_hosts` file with normal strict verification. The workflow has explicit read-only repository permissions and uses quoted environment variables.

## Failure and downtime behavior

- **Failed build:** deployment stops before container replacement, so the existing site remains running.
- **Failed startup/health:** deployment fails with diagnostics. The previous container has already been replaced; automatic rollback is intentionally out of scope.
- **Expected downtime:** limited to Compose shutdown, exact-name removal, new-container creation, and Next.js startup/health confirmation. Docker build time no longer contributes to downtime.

## Security and cleanup observations

- The private key is written with mode 600 and validated without printing its contents or fingerprint. No secret values or server address are intentionally logged.
- `ssh-keyscan` avoids disabling host verification, but first-use key acquisition is not cryptographically pinned. A separately managed/pinned host-key secret is a future hardening option.
- Root SSH is unchanged to avoid expanding this bugfix into server access redesign; a dedicated deployment user remains recommended for later work.
- `docker image prune -f` removes dangling images only, not tagged images or images used by containers. It remains non-aggressive, although it is host-wide. Project-scoped retention/rollback images can be considered later.
- Automatic rollback and blue-green deployment are intentionally left for a future deployment architecture phase.
