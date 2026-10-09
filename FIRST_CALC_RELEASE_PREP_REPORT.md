# First Calc — Release Prep Report (Final UI + SEO Recovery)

**Branch:** `fix/ru-catalog-seo-recovery`  
**Starting tip (user brief):** `617a5b4b81a2617283ca661676fb078a8132a192`  
**Final tip SHA:** *(filled after push — see §1)*  
**Status:** `READY FOR RELEASE DECISION`

**Not done (by design):** merge to `main`, PR, production deploy, Timeweb infra changes.

---

## 1. Source and final SHA

| Item | SHA |
|------|-----|
| Brief starting tip | `617a5b4b81a2617283ca661676fb078a8132a192` |
| Final tip | See git tip of `fix/ru-catalog-seo-recovery` after the release-prep commits (updated in §1 pin below when available) |

Investment/Savings calculation engines were **not** modified in this pass.

---

## 2. UI fixes

### 2.1 RU currency (`$` → `₽`)

**Root cause:** `formatOutputValue(...)` in `calculator-results.tsx` omitted the `locale` argument on the main result path (and two secondary paths), so formatting defaulted to `en` → USD.

**Fix:** Pass `locale` into all `formatOutputValue` call sites in `calculator-results.tsx`. Existing `formatMoney` / `LOCALE_CURRENCY` map (`lib/calculators/format.ts`) already selects RUB for `ru`.

### 2.2 Fractional percentage rates (HTML `stepMismatch`)

**Root cause:** Rate fields with integer `min: 0` and no fractional default inferred `step=1`, so values like `12.5` failed browser constraint validation before submit.

**Fix:** In `calculator-form.tsx`, when `unitLabel` contains `%` or the input name looks rate-like (`rate|return|interest|…`), default `step` to `0.01`.

### 2.3 Finance model note scoping

**Root cause:** Localized `results.explanations.finance.modelNote` (end-of-month contribution wording) was shown for any calculator that rendered the shared explanation block, including Retirement and percentage tools.

**Fix:** Compute/show `financeModelNote` only for `investment-calculator` and `savings-calculator`. Retirement keeps its own result UI without that copy. Engines unchanged.

---

## 3. SEO crawl — before / after

| Metric | Before (prior audit / this pass diagnosis) | After |
|--------|--------------------------------------------|-------|
| Broken internal targets (approx.) | ~22 (bare `/factors`, `/number-format/in`; es/tr/hi category + discovery 404s) | **0** (crawl of 450 pages, all link targets resolve to HTTP &lt; 400 after redirects) |
| Crawl tool | `scripts/crawl-internal-links.mjs` | Same; report artifact local-only |

### Classes fixed

| Source pattern | Destination | Was | Fix |
|----------------|-------------|-----|-----|
| Legacy related links | `/factors`, `/number-format/in` | 404 | Point to `/factors/12`, `/number-format/in/1234567`; 308 redirects for bare hubs |
| Footer category links on es/tr/hi | `/es/calculators/math` etc. | 404 / empty | Link to EN category hubs when locale has no catalog |
| Legacy discovery tiles on es/tr/hi | `/es/calculators/compatibility/...` | 404 | Link to EN calculator URLs when locale lacks content |
| Empty es/tr/hi category hubs | `/es/calculators/{category}` | 404 | `permanentRedirect` → EN `/calculators/{category}` |
| Related-link locale prefix | `/en/...` | Extra 301 | Use `localePath` (no `/en` prefix) |

---

## 4. Broken internal links count

| Stage | Count |
|-------|------:|
| Prior high-blocker note | ~22 |
| After this recovery (full crawl, follow redirects) | **0** |

---

## 5. Historical routes checked

| URL | Result |
|-----|--------|
| `/chislo-propisyu` | 200 |
| `/ru/chislo-propisyu` | 200 |
| `/tools` | 200 |
| `/ru/tools` | 200 |
| `/factors` | 308 → `/factors/12` (200) |
| `/ru/factors` | 308 → `/ru/factors/12` (200) |
| `/number-format/in` | 308 → `/number-format/in/1234567` (200) |
| `/10000-19999` | 200 (middleware rewrite to range) |
| `/ru/10000-19999` | 200 |
| `/add-subtract-percentage/45.2/2.3-add` | 200 |
| `/ru/add-subtract-percentage/45.2/2.3-add` | 200 |
| `/percentage-of-a-number/55.2/2.6` | 200 |
| `/ru/percentage-of-a-number/55.2/2.6` | 200 |

No redirect cycles observed on the clean standalone server. (A transient infinite-redirect symptom appeared only when the process was started with `HOSTNAME=127.0.0.1` / process conflict; not reproducible with the normal `npm run start:standalone:test` / Playwright webServer path.)

---

## 6. Sitemap / canonical / hreflang / robots

| Check | Result |
|-------|--------|
| Sitemap | 330 URLs; production origin `https://first-calc.com` |
| Empty es/tr/hi calculator hubs in sitemap | Omitted |
| `robots.txt` | `Allow: /`; disallows `/admin`, `/api/`; Sitemap line present; no `Disallow: /` |
| Canonical on home, catalog, chislo, investment (EN/RU) | Present, self-canonical to `first-calc.com` |
| Calculator hub hreflang | `en`, `ru`, `x-default` (not es/tr/hi) |
| Investment calculator hreflang | `en`, `ru`, `x-default` |
| Home/tools hreflang | Includes shell locales es/tr/hi + x-default (hub shells remain; catalog not advertised) |

Smoke script: `scripts/smoke-seo-meta.mjs`.

---

## 7. Automated test results

| Check | Result |
|-------|--------|
| ESLint | Exit 0 (pre-existing `react/no-unescaped-entities` warnings) |
| `tsc --noEmit` | Exit 0 |
| `i18n:validate` | Exit 0 (66 pre-existing es/tr/hi warnings) |
| Vitest (`npm test -- --run`) | **222 passed** |
| Production `npm run build` | Exit 0 |
| Playwright Chromium (`npm run test:e2e`) | **36 passed** (includes new `e2e/ui-recovery.spec.ts`) |
| Internal link crawl | **0 broken** (450 pages crawled) |
| SEO meta smoke | Pass |

New regression coverage:

- `tests/unit/ui-seo-recovery.test.tsx` — fractional step, locale currency, related-link paths  
- `e2e/ui-recovery.spec.ts` — RU ₽, 12.5% step validity, modelNote scoping, `/factors` 308  

---

## 8. Remaining issues (by severity)

| Severity | Issue |
|----------|--------|
| Low | Residual English prose in specialized `calculator-results.tsx` blocks on some RU pages |
| Low | es/tr/hi missing `results.json` / `footer.json` / `search.json` (i18n warnings; hubs noindex / not in calculator sitemap) |
| Low | Tools hub still advertises hreflang for es/tr/hi shell locales |
| Info | Advanced tax/withdrawal UI still not exposed on Investment/Savings public forms (engine supports via API when schema allows) |
| Info | Do not start standalone with `HOSTNAME=127.0.0.1` — prefer default Playwright/`start:standalone:test` bind |

None of the above block a release decision for the UI/SEO scope of this brief.

---

## 9. Known limitations

- No new 1000+ financial scenario matrix was run (out of scope; prior Investment/Savings matrix stands).  
- Crawl covers sitemap seeds + discovered internal `href`s up to the crawl cap (450 pages); it is not a claim over every dynamic legacy number variant on the open web.  
- es/tr/hi remain intentionally thin; incomplete catalog content must stay out of the sitemap and must not masquerade as full localization.

---

## 10. Recommendations for Timeweb publish

1. Deploy **only** from tip of `fix/ru-catalog-seo-recovery` after this report’s final SHA.  
2. Set production `NEXT_PUBLIC_BASE_URL=https://first-calc.com` (never `test.first-calc.com` / localhost).  
3. Confirm `NEXT_PUBLIC_ENV` is not `test`/`staging` (indexing must stay enabled).  
4. Post-deploy smoke: `/`, `/ru`, `/chislo-propisyu`, `/ru/chislo-propisyu`, `/tools`, RU Investment/Savings (₽ + `12.5` rate), `/sitemap.xml`, `/robots.txt`.  
5. Spot-check `/factors` → 308 → example page; no redirect loops on EN unprefixed URLs.  
6. Do **not** merge/PR/deploy from this agent pass — human release decision required.

---

## Status

**READY FOR RELEASE DECISION**
