# Timeweb Production Deploy Report

**Status: BLOCKED**

Date: 2026-10-09  
Repository: `alex1c/first-calc`  
Target release SHA: `795f6ad404fd2910ec0eacb2e926b7fda810adb5`  
Target server: Timeweb `188.225.26.192` (`/var/www/first-calc`)  
Domain: `https://first-calc.com`

## Summary

**STOP before Stage 5.** Stages 1–3 could not run on Timeweb because SSH public-key auth to `root@188.225.26.192` fails for both local keys and the GitHub Actions deploy key.

No production container was switched. Other sites were not modified. Cutover was not attempted.

---

## Access attempts

| Method | Result |
|---|---|
| DNS `first-calc.com` / `calc1.ru` | Both resolve to `188.225.26.192` |
| Local `~/.ssh/id_ed25519` → `root@188.225.26.192` | Permission denied (publickey) |
| Local `pipetkaonline_github_actions` → several users | Permission denied (publickey) |
| GHA run 37956194881 | Failed: `SERVER_HOST` secret was not Timeweb IP |
| GHA run 37956393399 | Host gate passed after secret update; **scp/ssh Permission denied (publickey)** |

---

## Actions already taken (safe)

1. Added staged tooling: `scripts/timeweb-staged-prepare.sh`, `.github/workflows/timeweb-staged-prepare.yml` (on `main` + release branch).
2. Updated GitHub secret `SERVER_HOST` → `188.225.26.192` (was outdated; DNS confirms this IP).
3. Confirmed public HTTPS: `first-calc.com` 200, `pipetkaonline.ru` 200, `calc1.ru` reachable.

---

## Public read-only checks (no SSH)

| Check | Result |
|---|---|
| `https://first-calc.com` | HTTP 200 |
| `https://pipetkaonline.ru` | HTTP 200 |
| `https://calc1.ru` | Reachable (308 from this client) |
| Current production git SHA | **Unknown** (requires SSH) |
| Docker / Apache / disk / backup | **Not inspected** (requires SSH) |

---

## Release artifact readiness (repo)

| Item | Status |
|---|---|
| Release SHA on `origin/fix/ru-catalog-seo-recovery` | Present (`795f6ad…`) |
| Release SHA on `origin/main` | Not merged (branch-only release; pin SHA on cutover) |
| Staged prepare tooling | Ready once SSH works |

---

## Required unblocking actions (human)

Authorize SSH for the deploy key on Timeweb, then re-run prepare:

1. On `188.225.26.192`, add the public key matching GitHub secret `SSH_PRIVATE_KEY` to `root` `authorized_keys`  
   **or** replace `SSH_PRIVATE_KEY` with a key already authorized on Timeweb  
   **or** authorize local `~/.ssh/id_ed25519.pub` (`alex1@alex-home`) and provide interactive SSH.
2. Re-run:

```bash
gh workflow run timeweb-staged-prepare.yml -R alex1c/first-calc --ref main \
  -f release_sha=795f6ad404fd2910ec0eacb2e926b7fda810adb5 \
  -f phase=prepare
```

3. Review Stage 4 pre-switch report (current SHA, backup path, new image tag, rollback script).
4. Explicitly confirm Stage 5 cutover (only first-calc service).

---

## Stages

| Stage | Status |
|---|---|
| 1. Pre-check | **BLOCKED** — SSH denied on Timeweb |
| 2. Backup | Not started |
| 3. Build new image | Not started |
| 4. Pre-switch gate | **STOP** — awaiting access + confirmation |
| 5. Cutover | Not started |
| 6. Post smoke | Not started |
| 7. Report | This file |

---

## Risks noted

- GitHub deploy key is not in Timeweb `authorized_keys` (shared host with calc1.ru / pipetkaonline.ru).
- Release SHA is not on `main`; cutover must pin `795f6ad…`.
- Do not use `scripts/deploy-production.sh` on this host (`compose down` + image prune).

---

## Secrets

No passwords, tokens, or private keys are included in this report.

---

**Final status: BLOCKED**
