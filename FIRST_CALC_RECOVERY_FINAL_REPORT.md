# First Calc Recovery — Final Report (B3.2 + B3.3 + Stage C)

**Branch:** `fix/ru-catalog-seo-recovery`  
**Starting tip (user brief):** `eed0e64aeb05bac45710aebec8b2f0edf027999e`  
**Final tip SHA:** `a6605ea95afcb0d0678a9a6210aaffa5a66019c9`  
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

Verification commands at tip: `npm run lint` (warnings only), `npm run typecheck`, `npm run i18n:validate` (known es/tr/hi warnings), `npm test -- --run` (**161 passed**), `npm run build`, `npm run test:e2e` (**31 passed**).

---

## 2. Active calculator counts

| Metric | Count | Notes |
|--------|------:|-------|
| Enabled JSON schemas (`data/calculators/*.json`) | 82 | Language-neutral schemas |
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

Each has a working EN TS engine + `locales/ru/calculators/items/<slug>.json` + entry in `TYPESCRIPT_LOCALIZED_SLUGS.ru`.

---

## 4. Remaining EN-only / limited locales

| Locale | Calculators | Reason |
|--------|-------------|--------|
| **es / tr / hi** | Catalog empty by design | No item corpora; hubs must not advertise EN fallback as localized |
| **en** | Full catalog | Baseline |
| **ru** | Parity with EN for restored overlays | Some calculator-specific result blocks in `calculator-results.tsx` still contain English prose (shared path localized) |

EN-only *item* gaps for TS-only tools (loan-payment, compound-interest, …) are intentional: content lives in `data/calculators.ts` for EN and RU items for RU.

---

## 5. Functional and browser tests

| Suite | Result |
|-------|--------|
| Unit + API (`vitest --run`) | **161 passed** |
| All-calculator API smoke EN+RU | Pass (no 5xx; no 200/null required outputs) |
| B3.1 finance engines | Pass |
| B3.1 computation bounds + isolated memory probe | Pass |
| B3.3 SEO hreflang / sitemap | Pass |
| Playwright Chromium | **31 passed** (finance forms, RU UI, chislo-propisyu, SEO, mobile) |

Independent expected values used in finance unit tests (not copied from engine under test).

---

## 6. SEO verification

Fixed / verified:

- Sitemap skips slug-less historical examples (`/range/1-100`, `/factors/360`, `/number-format/in/...`) that are noindex-only.
- Calculators enter sitemap only when `hasLocalizedCalculatorContent(locale, slug)`.
- Incomplete locale pages stay `noindex` with canonical to EN when content is missing.
- Legacy dynamic routes (`chislo-propisyu`, `roman-numerals-converter`, `numbers-to-words`, percentage/root landings): hreflang limited to **en/ru** + absolute `localeUrl` canonicals (no empty es/tr/hi).
- Production origin remains `https://first-calc.com`; robots allow `/` outside test/staging.
- Historical routes **kept** (`/chislo-propisyu`, `/tools`, numeric legacy URLs) with landing indexable and dynamic examples noindex.

---

## 7. Remaining issues (severity)

| Severity | Issue |
|----------|--------|
| **Medium** | Large `calculator-results.tsx` still has calculator-specific English copy for some IDs; shared explanation path is localized. |
| **Medium** | EN mortgage TS definition (`homePrice` / `interestRateAPR`) diverges from JSON schema field names; engines accept both. |
| **Low** | EN loan-payment has no item JSON (TS-only) → console i18n warning. |
| **Low** | es/tr/hi missing namespaces (errors/search/footer) → i18n validate warnings. |
| **Low** | Some RU finance overlays have generic howTo/FAQ; labels/options are Russian and engines are real. |
| **Info** | Core Web Vitals not lab-measured beyond mobile overflow E2E; recommend Lighthouse on staging. |

---

## 8. URLs that must not be indexed / published as primary

- Any page with `robots: noindex` (incomplete locale fallbacks; dynamic legacy numeric/range examples).
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
| Mass EN UI on RU | Improved (items, validation, how-to); residual result-block EN noted |

---

## 10. Safe Timeweb deploy recommendations

1. Deploy **this branch only after FINAL CODEX AUDIT pass** — do not merge prematurely.
2. Set production env: `NEXT_PUBLIC_BASE_URL=https://first-calc.com`, `NEXT_PUBLIC_ENV=production` (never `test`/`staging` on the public host).
3. Build with standalone output; run `node .next/standalone/server.js` (not `next start` alone).
4. Smoke after deploy: `/`, `/ru`, `/ru/calculators/finance/compound-interest`, `/chislo-propisyu`, `/sitemap.xml`, `/robots.txt`.
5. Confirm robots allow `/` and sitemap lists RU finance URLs.
6. Keep rollback artifact of previous standalone build.
7. Do not flip DNS or purge CDN until smoke + spot Lighthouse on 2–3 calculator pages.

---

## Handoff

**READY FOR FINAL CODEX AUDIT**

No merge, PR, or production deploy without explicit approval after Codex confirmation.
