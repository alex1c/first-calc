# Timeweb Production Deploy Report

**Status: READY FOR CUTOVER APPROVAL**

Date: 2026-10-09  
UTC stamp: `20261009T194524Z`  
Target SHA: `795f6ad404fd2910ec0eacb2e926b7fda810adb5`  
Host: Timeweb `spb-3-vm-tm5d` (`188.225.26.192`)  
Access: GHA → OLD `165.227.171.143` → `/root/.ssh/timeweb_migration` → Timeweb  

**Cutover was NOT performed.** Apache / DNS / TLS / peer sites unchanged. Migration private key was not copied off OLD.

Workflow: https://github.com/alex1c/first-calc/actions/runs/37982353167

---

## 1. Current production image + rollback tag

| Item | Value |
|---|---|
| Live container ID | `371214862fa45b9da5d1efe3417c18d099749d9a149abfadbc4a633e567d5814` |
| Live image name | `first-calc-first-calc` |
| Live / previous image ID | `sha256:acf3ea9db8fc8a6e9646a2aade753b2888568fadaae994ec10bbeac511b1748b` |
| Live BUILD_ID | `Q9HH-8cMmy_mQdbejqwrA` |
| Rollback tag | `first-calc:rollback-20261009T194524Z` (= same image id `acf3ea9d…`) |
| Live status after Stages 2–3 | `running` / `healthy` (same container id) |

---

## 2. Backup location

| Item | Value |
|---|---|
| Backup dir | `/var/backups/first-calc/20261009T194524Z` |
| Contents | `docker-compose.yml`, Dockerfile, Apache first-calc vhosts, inspect JSON, `first-calc-tree.tgz` (~1.3 MiB), `ROLLBACK.sh` |
| Pointers | `/var/backups/first-calc/LATEST_BACKUP_DIR`, `LATEST_ROLLBACK_TAG` |
| Verified | readable archive, rollback image inspect OK, `ROLLBACK.sh` executable |
| Persistent volumes | none configured for first-calc in compose |

Secrets: `.env` was absent; no secret values written to GitHub reports.

---

## 3. New image + source SHA

| Item | Value |
|---|---|
| Source SHA | `795f6ad404fd2910ec0eacb2e926b7fda810adb5` (verified after detached checkout) |
| New image tag | `first-calc:795f6ad404fd2910ec0eacb2e926b7fda810adb5` |
| Alias | `first-calc:release-candidate` |
| New image ID | `sha256:a4fe584a979931edbd37c92d631098c04403f6b76cc8d70b5ac87da8f0e362e1` |
| Size | ~293 MB |
| Built | `2026-10-09T19:47:41Z` |
| Build env | `NEXT_PUBLIC_BASE_URL=https://first-calc.com`, `NEXT_PUBLIC_ENV=production` |
| Build dir | `/var/www/first-calc-build-<sha>` (removed after build) |

Live compose tag `first-calc-first-calc:latest` was **not** retagged to the new image.

---

## 4. Build result

**SUCCESS.** Floating HEAD not used. Running container image id unchanged through the build.

---

## 5. Disk after build

| Filesystem | Size | Used | Avail | Use% |
|---|---|---|---|---|
| `/` (`/var/www`) | 48G | 11G | **37G** | 24% |

---

## 6. Three sites (post Stages 2–3)

| Target | Result |
|---|---|
| `http://127.0.0.1:3003/` | 200 |
| `https://first-calc.com/` | 200 |
| `https://calc1.ru/` | 200 (`calc1-app` healthy `:3001`) |
| `https://pipetkaonline.ru/` | 307 (`pipetkaonline-app` healthy `:3002`) |

---

## 7. Cutover / rollback procedures (DO NOT RUN without approval)

### Cutover (Stage 5 — awaiting separate approval)

Via OLD → Timeweb jump only; first-calc only:

```bash
# On Timeweb — replace ONLY first-calc; do not touch calc1 / pipetka
NEW=first-calc:795f6ad404fd2910ec0eacb2e926b7fda810adb5
docker rm -f first-calc
docker run -d --name first-calc --restart unless-stopped \
  -p 127.0.0.1:3003:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  -e NEXT_PUBLIC_DATA_SOURCE=local \
  -e NEXT_PUBLIC_BASE_URL=https://first-calc.com \
  -e NEXT_PUBLIC_ENV=production \
  "$NEW"
# verify
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3003/
curl -fsS -o /dev/null -w '%{http_code}\n' https://first-calc.com/
```

Then run post-publish smoke (EN/RU, chislo, tools, sitemap, robots, limited-locale noindex, etc.).

### Rollback

```bash
bash /var/backups/first-calc/20261009T194524Z/ROLLBACK.sh
```

Restores container from `first-calc:rollback-20261009T194524Z` and prior compose file.

---

## Stages status

| Stage | Status |
|---|---|
| 1 Diagnostics | Done (prior) |
| 2 Backup | **Done** |
| 3 Build | **Done** |
| 4 Pre-switch report | **This document — STOP** |
| 5 Cutover | **Not started — waiting for explicit approval** |

---

**READY FOR CUTOVER APPROVAL**

Awaiting separate authorization for Stage 5 only.
