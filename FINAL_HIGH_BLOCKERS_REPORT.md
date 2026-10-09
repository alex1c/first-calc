# Final High Blockers Report

**Status: READY FOR HIGH BLOCKER RECHECK**

Date: 2026-10-09  
Branch: `fix/ru-catalog-seo-recovery`  
Repository: `alex1c/first-calc`

## SHAs

| | SHA |
|---|---|
| Starting tip (Release Recheck FAIL) | `c00c80b60a7dafe6386a0249688eecb152895cc3` |
| Ending tip (this fix) | `68a487472308e84ec1ecbfa6495edb95e827931b` |

## Scope

Fixed only Release Recheck High blockers R1–R4 plus related interest-only rounding and advanced-field visibility. No merge, PR, deploy, or broad SEO expansion.

---

## R1 — Retirement false HTTP 200 / all-null results

### Before
`POST …/retirement-calculator/calculate` with `currentAge: 65`, `retirementAge: 60` returned **HTTP 200** with every result `null` (and `formattedResults` “—”). Unknown `calculationMode` behaved the same.

### Root cause
Engine returned null payloads on validation failure instead of throwing `CalculationDomainError`. Combined with the relaxed “≥1 required output” guard (optional retirement outputs), the API treated empty success as valid.

### Fix
`lib/calculations/retirement.ts`: invalid age window, invalid numeric ranges, and unknown modes throw `CalculationDomainError` (HTTP 400). Valid scenarios still return numeric results.

### After
Invalid ages → **400**. Valid future_balance (age 30→65) → **200** with `finalBalance` number (e.g. 285502.41 for seeded inputs).

---

## R2 — RU currency and English finance chrome

### Before
Specialized `calculator-results.tsx` renderers hard-coded `$` + `en-US` and English labels (“Monthly Payment”, “Year”, “Return Earned”, etc.) even on RU pages.

### Fix
- `formatMoney` / `formatLocaleDate` in `lib/calculators/format.ts` (locale → USD/RUB/EUR/TRY/INR).
- Replaced ~155 `$`+`en-US` money formats in `calculator-results.tsx`.
- Localized finance chrome via `results.labels.*` (EN + RU).

### After (Chromium)
Mortgage RU: “Ежемесячный платёж”, amounts with ₽ — no `$` in result cards.  
Investment RU: year table headers in Russian; RUB formatting; no conflicting `$94111` dollars.

---

## R3 — Mortgage property tax % labeled ₽/год

### Before
Selecting `propertyTaxType=percentage` still showed unit `₽/год`; entering `1` correctly computed 250/month for a 300000 home, but the form promised currency.

### Fix
`calculator-form.tsx` dynamically switches `propertyTax` chrome: percentage → `%` + percent help; amount → schema/item `₽/год` or `$/year`. RU item help clarifies both modes. TS schema unit default `$/year` for amount mode.

### After
API: `propertyTax=1`, `propertyTaxType=percentage`, home 300000 → `paymentBreakdown.taxes = 250`, total monthly 1860.46.  
Chromium: label shows `(%)` after selecting percentage.

---

## R4 — Investment/savings final ≠ last year-table row

### Before
| Calculator | Headline | Year-10 table |
|---|---|---|
| Investment | 94111.23 | 94434.74 |
| Savings | 39291.50 | 39420.91 |

Month simulation used contribution-before-interest (annuity-due); closed form used ordinary annuity. Headline and table came from different models.

### Fix
`investment.ts` / `savings.ts`: ordinary annuity month order (interest → contribution → withdrawal). Closed-form path sets headline totals from the same simulation that builds the year table.

### After
Investment: `finalValue = 94111.23 = last endingValue`.  
Savings: `finalSavings = 39291.50 = last endingBalance`.  
Chromium: page shows 94111; 94434 absent.

---

## Related extras

### Interest-only ±0.04
`loan.ts`: lifetime interest = `principal × rate × years` (not sum of rounded periodals).  
10000 @ 10% × 1y monthly → payment 83.33, interest **1000**, totalPayment **11000**.

### Advanced fields
Public TS schemas for investment/savings omit `taxRate`, `monthlyWithdrawal`, `interestType`. JSON schema remnants are not shown when TS wins. Regression asserts they stay off public inputs.

---

## Tests and verification

| Check | Result |
|---|---|
| `tests/unit/high-blockers-r1-r4.test.ts` | 10/10 PASS |
| Full unit/integration | **198/198 PASS** |
| `b32-all-calculators-smoke` (EN+RU with seeds) | PASS |
| ESLint | exit 0 (pre-existing warnings) |
| `tsc --noEmit` | exit 0 |
| `i18n:validate` | exit 0 (pre-existing warnings; es/tr/hi still lack `results.json`) |
| Production `npm run build` | exit 0 |
| Playwright e2e | **31/31 PASS** |
| `scripts/verify-high-blockers.mjs` (API R1–R4) | allOk true |
| `scripts/verify-high-blockers-browser.mjs` (Chromium R2/R3/R4) | ok true |

---

## Remaining limitations (out of High scope)

- Medium SEO: ~22 broken internal targets (es/tr/hi category hubs, related `/factors`, `/number-format/in`).
- Legacy decimal RU URLs still 404 in sampled checks.
- Non-financial English fragments on some RU pages (shape names, math placeholders).
- Advanced tax/withdrawal UI not exposed (engine supports via API inputs only when schema allows).
- Interest-only **display** payment remains rounded to cents; lifetime total is exact.
- es/tr/hi `results.json` namespace still missing (labels fall back to English for those locales).

---

## Publish

Changes pushed only to `fix/ru-catalog-seo-recovery`. No merge, PR, or deploy.
