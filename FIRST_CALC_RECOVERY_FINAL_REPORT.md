# First Calc Recovery — Final Report (B3.2 + B3.3 + Stage C)

**Branch:** `fix/ru-catalog-seo-recovery`  
**Starting tip (user brief):** `eed0e64aeb05bac45710aebec8b2f0edf027999e`  
**Final tip SHA:** `36289c7d73c720fa5b7153fbb1074631524f05ad` (P0 closeout; docs pins may trail)  
**Status:** `READY FOR FINAL CODEX AUDIT`

**Not done (by design):** merge to `main`, PR without approval, production deploy, Timeweb infra changes.

---

## 1. Final SHA and commit list (B3.1 → tip)

| SHA | Summary |
|-----|---------|
| `04c39fa`…`b087d7e` | B3.1 finance engines + Codex finance unit tests |
| `734f9a0` | B3.1 memory bounds, API contracts, loan-payment HTML |
| `eed0e64` | B3.1 report tip docs |
| `1032f78` | **B3.2** eight RU finance overlays + RU numbers-to-words + chislo hreflang |
| `893cd28` | **B3.2** validation i18n, domain Error→400, all-calculator smoke |
| `19e0a9a` | **B3.3** legacy hreflang en/ru-only, sitemap noindex exclusion, RU UI E2E |
| `3c1fc7d` | docs: recovery final report tip SHA |
| *(follow-up)* | **P0 closeout:** TS loader precedence, RU select options, empty-locale sitemap hubs |

Verification at tip: `npm run lint`, `npx tsc --noEmit`, `npm run i18n:validate`, `npm test -- --run` (**165 passed**). Re-run `npm run build` + `npm run test:e2e` before deploy.

---

## 2. Active calculator counts

| Metric | Count | Notes |
|--------|------:|-------|
| Enabled JSON schemas (`data/calculators/*.json`) | 82 | Language-neutral schemas; TS-owned orphans skipped at runtime |
| EN item files | 82 | `locales/en/calculators/items` |
| RU item files | **95** | Includes TS-only overlays |
| Unique active EN catalog (registry) | **~95** | JSON + TS-only finance/math/compatibility |
| RU with native content (item and/or TS allowlist) | **95** | Formerly ~87; +8 finance overlays |

Methodology: registry `getAll(locale)` + `hasLocalizedCalculatorContent`; all localized EN/RU IDs pass API smoke (`tests/unit/b32-all-calculators-smoke.test.ts`).

---

## 3. Working RU calculators

All **95** RU item-backed calculators resolve with `locale=ru`, Cyrillic titles where overlays exist, and shared calculation engines.

Restored in B3.2 (the eight EN-only finance tools from Stage B2):

1. `compound-interest`
2. `loan-comparison-calculator`
3. `mortgage-comparison-calculator`
4. `retirement-calculator`
5. `investment-vs-savings-calculator`
6. `take-home-pay-calculator`
7. `emergency-fund-calculator`
8. `net-worth-calculator`

Plus TS-owned finance overlays with RU select options aligned to live engines: mortgage, auto/personal/overpayment loan, savings, investment, ROI, numbers-to-words.

---

## 4. Remaining EN-only / limited locales

| Locale | Calculators | Reason |
|--------|-------------|--------|
| **es / tr / hi** | Catalog empty by design | No item corpora; hubs must not advertise EN fallback as localized |
| **en** | Full catalog | Baseline |
| **ru** | Parity with EN for restored overlays | Some calculator-specific result blocks in `calculator-results.tsx` still contain English prose |

---

## 5. Functional and browser tests

| Suite | Result |
|-------|--------|
| Unit + API + components (`vitest --run`) | **165 passed** |
| All-calculator API smoke EN+RU | Pass |
| B3.1 finance engines / bounds / API contracts | Pass |
| B3.3 SEO hreflang / sitemap / RU select options | Pass |
| Playwright Chromium (prior tip) | **31 passed** — re-run after this follow-up before deploy |

Independent expected values used in finance unit/API tests (not copied from engine under test).

---

## 6. SEO verification

Fixed / verified:

- Sitemap skips slug-less historical examples (`/range/1-100`, `/factors/360`, `/number-format/in/...`) that are noindex-only.
- Sitemap **omits** `/es/calculators`, `/tr/calculators`, `/hi/calculators` (empty noindex hubs); keeps en/ru.
- Calculators enter sitemap only when `hasLocalizedCalculatorContent(locale, slug)`.
- Incomplete locale pages stay `noindex` with canonical to EN when content is missing.
- Legacy dynamic routes: hreflang limited to **en/ru** + absolute `localeUrl` canonicals.
- Production origin remains `https://first-calc.com`.
- Historical routes **kept** (`/chislo-propisyu`, `/tools`, numeric legacy URLs).

---

## 7. Remaining issues (severity)

| Severity | Issue |
|----------|--------|
| **Medium** | Large `calculator-results.tsx` still has calculator-specific English copy for some IDs; shared explanation path is localized. |
| **Low** | Orphan JSON schemas still on disk for TS-owned finance slugs (ignored at runtime; do not delete without inventory). |
| **Low** | EN loan-payment has no item JSON (TS-only) → console i18n warning. |
| **Low** | es/tr/hi missing namespaces → i18n validate warnings. |
| **Info** | Core Web Vitals not lab-measured beyond mobile overflow E2E; recommend Lighthouse on staging. |

---

## 8. URLs that must not be indexed / published as primary

- Any page with `robots: noindex` (incomplete locale fallbacks; dynamic legacy numeric/range examples).
- Empty calculator hubs for es/tr/hi (noindex; now also absent from sitemap).
- `/admin`, `/api/*` (robots disallow).
- Test/staging with `NEXT_PUBLIC_ENV=test|staging` → sitemap empty + `Disallow: /`.
- Do not promote `test.first-calc.com` or localhost in production metadata.

Safe to index (when production env): EN/RU calculator pages with native content, category hubs for locales that have calculators, `/chislo-propisyu` and `/tools` landings, learn/standards where content exists.

---

## 9. Changes vs original Codex audit

| Original FAIL / gap | Status |
|---------------------|--------|
| Unbounded car-depreciation memory | Fixed (hard caps + engine asserts) |
| Finance engines wrong (mortgage/ROI/loans/…) | Fixed in B3.1 |
| API 200/null, missing defaults | Fixed |
| loan-payment stepMismatch | Fixed |
| 10 TS-only RU + 8 finance RU missing | Restored |
| numbers-to-words English on RU | Fixed (locale-aware engine) |
| Broken/non-reciprocal hreflang on legacy | Fixed en/ru-only |
| Sitemap risk for noindex examples | Fixed |
| Sitemap empty-locale `/calculators` hubs | Fixed (follow-up) |
| RU finance select options still English | Fixed (name-matched overlays + TS precedence) |
| EN/RU mortgage dual engines (JSON vs TS) | Fixed: TS owns slug for all locales |

---

## 10. Safe Timeweb deploy recommendations

1. Deploy **this branch only after FINAL CODEX AUDIT pass** — do not merge prematurely.
2. Set production env: `NEXT_PUBLIC_BASE_URL=https://first-calc.com`, `NEXT_PUBLIC_ENV=production` (never `test`/`staging` on the public host).
3. Build with standalone output; run `node .next/standalone/server.js` (not `next start` alone).
4. Smoke after deploy: `/`, `/ru`, `/ru/calculators/finance/mortgage-calculator`, `/ru/calculators/finance/compound-interest`, `/chislo-propisyu`, `/sitemap.xml`, `/robots.txt`.
5. Confirm robots allow `/`, sitemap lists RU finance URLs, and **does not** list `/es/calculators`.
6. Keep rollback artifact of previous standalone build.
7. Do not flip DNS or purge CDN until smoke + spot Lighthouse on 2–3 calculator pages.

---

## Handoff

**READY FOR FINAL CODEX AUDIT**

No merge, PR, or production deploy without explicit approval after Codex confirmation.
