# Timeweb Production Deploy Report

**Status: DEPLOY SUCCESS**

Date: 2026-10-09  
Host: Timeweb `spb-3-vm-tm5d` (`188.225.26.192`)  
Release SHA: `795f6ad404fd2910ec0eacb2e926b7fda810adb5`  
Access path: GHA → OLD `165.227.171.143` → `/root/.ssh/timeweb_migration` → Timeweb  

Workflow (cutover): https://github.com/alex1c/first-calc/actions/runs/37983231065

No merge / PR performed. Backup and rollback image retained.

---

## Cutover

| Item | Value |
|---|---|
| Cutover start (UTC) | `2026-10-09T19:53:08Z` |
| Healthy after | `2026-10-09T19:53:19Z` |
| Method | `docker compose --project-name first-calc up -d --no-deps --no-build --force-recreate first-calc` after retagging `first-calc-first-calc` → new image |
| Previous image | `sha256:acf3ea9db8fc8a6e9646a2aade753b2888568fadaae994ec10bbeac511b1748b` |
| **Running image ID** | `sha256:a4fe584a979931edbd37c92d631098c04403f6b76cc8d70b5ac87da8f0e362e1` |
| Running image name | `first-calc-first-calc` (points at release) |
| New container ID | `23d72a9fc59685f8020f7b9a9f0746e6c96c97833ff20f18c1e3ed5b109613fb` |
| Ports | `127.0.0.1:3003→3000` (unchanged) |
| Apache / DNS / TLS | Unchanged |
| Future restart | Uses retagged `first-calc-first-calc` → release image |

---

## Rollback retained

| Item | Value |
|---|---|
| Rollback tag | `first-calc:rollback-20261009T194524Z` (`acf3ea9d…`) |
| Backup dir | `/var/backups/first-calc/20261009T194524Z` |
| Rollback command | `bash /var/backups/first-calc/20261009T194524Z/ROLLBACK.sh` |
| Auto-rollback | Not triggered (smoke_fail_count=0) |

---

## HTTP / Chromium smoke

| Check | Result |
|---|---|
| `127.0.0.1:3003` | 200 |
| Home EN / RU | 200 / 200 |
| `/calculators`, `/tools` | 200 / 200 |
| `/chislo-propisyu`, `/ru/chislo-propisyu` | 200; no `legacy/ui.form` keys |
| `/chislo-propisyu/123` | 200; words present (`сто двадцать три` in Chromium); Convert button OK |
| Investment / Savings RU pages | 200 / 200 |
| Container logs | Next.js Ready; no FATAL / module / listen errors |

RU `₽` / `5,73%` formatting is covered by release unit tests and shipped in this image; page shells for finance RU return 200 on production.

---

## SEO checks

| Check | Result |
|---|---|
| `/sitemap.xml` | 200; **324** `<url>` |
| `/robots.txt` | 200; Sitemap present; not `Disallow: /` |
| ES/TR/HI `/chislo-propisyu`, `/learn`, `/standards` | `noindex, follow` + EN canonical; no es/tr/hi hreflang |
| EN `/about` `/privacy` `/terms` `/disclaimer` `/contact` | self-canonical; not noindex |
| Legacy landings | numbers-to-words, roman, root, add-subtract, percentage-of-a-number → 200 |

---

## Peer sites

| Site | Result |
|---|---|
| `calc1-app` | running/healthy `:3001` |
| `https://calc1.ru` | 308 → followed 200 |
| `pipetkaonline-app` | running/healthy `:3002` |
| `https://pipetkaonline.ru` | 307 (expected redirect class) |

---

## Errors / warnings

- First cutover attempt (run `37983129307`) **STOP** before switch: overly strict ROLLBACK.sh comment grep. Fixed; no production change on that run.
- Successful cutover: run `37983231065`.
- No critical production errors after switch.

---

## Final status

**DEPLOY SUCCESS**
