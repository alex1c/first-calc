# Timeweb Production Deploy Report

**Status: STOP — Stage 1 complete; awaiting confirmation for Stages 2–4 (no cutover)**

Date: 2026-10-09 (UTC)  
Repository: `alex1c/first-calc`  
Target release SHA: `795f6ad404fd2910ec0eacb2e926b7fda810adb5`  
Target: Timeweb `188.225.26.192` `/var/www/first-calc` → `https://first-calc.com`

Production was **not** switched. Peer sites were **not** modified. Migration private key was **not** copied to the laptop or GitHub Secrets.

---

## Access restoration result

| Step | Result |
|---|---|
| GHA `SSH_PRIVATE_KEY` → OLD `165.227.171.143` | OK (`ubuntu-frankfurt` / `root`) |
| `/root/.ssh/timeweb_migration` on OLD | Exists (`mode=600`, size=411) + `.pub` |
| Fingerprint (pub only) | `SHA256:KtgXnbRgKqqbGW9sNOkfAnP6mO7fLJ22jdE5ATHVtvc` (`temporary-migration`, ED25519) |
| OLD → NEW via migration key (`StrictHostKeyChecking=yes`) | **OK** (`spb-3-vm-tm5d` / `root` / `NEW_OK`) |
| Host-key auto-accept | Not used (seeded known_hosts only) |

Workflow: https://github.com/alex1c/first-calc/actions/runs/37957888152

**Working access path (do not change without approval):**  
GitHub Actions → OLD DigitalOcean (`SSH_PRIVATE_KEY`) → Timeweb (`/root/.ssh/timeweb_migration` on OLD).

---

## Stage 1 — Timeweb diagnostics

| Check | Finding |
|---|---|
| Host | `spb-3-vm-tm5d` |
| `/var/www/first-calc` | Present; **not a git checkout** (no `.git`) — tree looks like an exported/copied release (Dockerfile, app/, components/, …) |
| Current git SHA | **Unknown** (no `.git`). Live image built `2026-10-08T18:51:25Z`; container started `2026-10-08T18:52:00Z`; in-container `BUILD_ID=Q9HH-8cMmy_mQdbejqwrA` |
| Container `first-calc` | `running` / `healthy`; image `first-calc-first-calc`; ports `127.0.0.1:3003->3000` |
| Compose | Project `first-calc`; maps `127.0.0.1:3003:3000`; `NEXT_PUBLIC_BASE_URL` default `https://first-calc.com`; `NEXT_PUBLIC_ENV` default `production` |
| `.env` | None in project dir |
| Apache | `first-calc.com-ssl.conf` → `ProxyPass / http://127.0.0.1:3003/` |
| Listen | `127.0.0.1:3003` |
| Disk / RAM | 48G disk, ~37G free (23% used); ~3.8Gi RAM, ~2.4Gi available |
| local `:3003` | HTTP 200 |
| `https://first-calc.com` | HTTP 200 |
| Peer `calc1-app` | Up healthy on `127.0.0.1:3001` |
| Peer `pipetkaonline-app` | Up healthy on `127.0.0.1:3002` |
| `https://calc1.ru` | 200 |
| `https://pipetkaonline.ru` | 307 |

**Isolation OK:** three separate containers/ports; Apache first-calc only proxies `:3003`.

---

## Plan for Stages 2–4 (not executed)

Access method for all remote ops: **jump via OLD + `timeweb_migration`**. Do not copy that private key to local disk or GitHub Secrets unless separately approved.

### Stage 2 — Backup (first-calc only)

1. Record metadata: container id `371214862fa4…`, image id `sha256:acf3ea9d…`, compose file, Apache `first-calc.com*.conf`, `BUILD_ID`.
2. `docker tag first-calc-first-calc first-calc:rollback-<UTC_stamp>`.
3. Copy compose + Apache snippets to `/var/backups/first-calc/<stamp>/` (on Timeweb).
4. Write `ROLLBACK.sh` that recreates **only** `first-calc` from the rollback tag / prior tree — never `compose down` on other projects, never prune.
5. Verify backup files are readable before continuing.

### Stage 3 — Build release image (no cutover)

1. Because `/var/www/first-calc` has **no git**, clone or `git fetch` exact SHA `795f6ad404fd2910ec0eacb2e926b7fda810adb5` into a **separate** build dir (e.g. `/var/www/first-calc-build-795f6ad`), not into the live tree mid-flight.
2. Confirm build env: `NEXT_PUBLIC_BASE_URL=https://first-calc.com`, `NEXT_PUBLIC_ENV=production` (not test/staging).
3. `docker build -t first-calc:795f6ad… -t first-calc:release-candidate <build_dir>`.
4. Leave running container untouched. No global `compose down`, no `docker system prune`, no Apache edits, no changes under `calc1.ru` / `pipetkaonline.ru`.

### Stage 4 — Pre-switch gate

Report then **STOP** for explicit cutover approval:

- current live image/container ids + `BUILD_ID`
- target SHA `795f6ad…`
- backup path + rollback tag
- new image id/tag ready
- rollback procedure one-liner
- risks (esp. non-git deploy tree; peer-site isolation)

### Stage 5 (later, only after your confirmation)

Update **only** the `first-calc` service to the new image (e.g. `docker compose --project-name first-calc up -d --no-deps --no-build` after retag/compose pin), verify `:3003` + HTTPS, smoke. Auto-rollback on critical failure.

---

## Risks / notes

1. Live tree is **not** git-backed — prepare/cutover scripts must not assume `git rev-parse` in `/var/www/first-calc`.
2. Exact production commit SHA is currently unknown; rollback relies on **Docker image tag**, not git SHA alone.
3. Stock `scripts/deploy-production.sh` (`compose down` + prune) must **not** be used on this shared host.
4. Migration key remains only on OLD; intentional.

---

## Secrets

No passwords, tokens, or private key material included.

---

**Final status for this gate: STOP (access restored; Stage 1 done; Stages 2–5 not started)**

Confirm to proceed with **Stages 2–3 (backup + build only)** via the OLD→Timeweb jump path.
