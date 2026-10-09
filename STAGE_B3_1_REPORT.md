# Stage B3.1 Report — Calculation safety & finance correctness

**Branch:** `fix/ru-catalog-seo-recovery`  
**Base (pre–B3.1 tip):** `9d39845bc6327f3da418a78c478a83db2e4a4dd6`  
**Final tip SHA:** `734f9a09347f2f3b32e77a0db53fd904d7ad8b7c`  
**Status:** `READY FOR CODEX B3.1 AUDIT`  
**Out of scope (not done):** Stage B3.2, deploy, merge, mass i18n/SEO/redesign

---

## Summary

Stage B3.1 fixes Codex FAIL findings on unbounded computation, finance engine correctness, API contracts (no 200/null), server-side defaults, and loan-payment HTML `stepMismatch`. Finance engines were corrected in commits `04c39fa`…`b087d7e`; this tip adds C1 hard caps, API wiring, HTML step alignment, and regression coverage.

---

## Fixed calculation engines

| Engine | Changes |
|--------|---------|
| `mortgage.ts` | `loanAmount` = principal (no double down-payment subtract); PMI/LTV; payment frequency/type; differentiated payments; domain errors |
| `investment.ts` | Simple vs compound; tax/withdrawals; `afterTaxValue`; `realValue` never null when inflation=0; horizon bounds |
| `savings.ts` | Simple vs compound; tax; `realValue`/`growthPercentage` finite; horizon bounds |
| `roi.ts` | Real `cagr` / `annualizedROI` / `paybackPeriod` (no fictitious fillers) |
| `auto-loan.ts` | Differentiated payments; field names; bounds |
| `personal-loan.ts` | Differentiated payments; `effectiveAPR` always finite |
| `loan-overpayment.ts` | Extra-payment impact; zero savings when no extra payment |
| `loan.ts` (loan-payment) | Domain errors; horizon hard cap; RU aliases |
| `car-depreciation.ts` | `MAX_OWNERSHIP_YEARS` hard cap; domain errors |
| `car-resale-value.ts` | Same ownership hard cap; domain errors |
| `compound-interest.ts` | Horizon hard cap; domain errors instead of null bags |
| `investment-vs-savings.ts` | Horizon hard cap; domain errors |
| `random-number.ts` | `MAX_RANDOM_QUANTITY` hard cap; domain errors |
| `logarithm.ts` | Domain errors → HTTP 400 (not sanitized 500) |

---

## Findings table (C1, H1–H4)

| ID | Finding | Resolution |
|----|---------|------------|
| **C1** | `car-depreciation` (and similar) could allocate year tables / arrays from unbounded user input | Hard caps in `computation-bounds.ts`; enforced inside engines; schema `max`; isolated low-heap probe `scripts/b3-memory-bound-probe.mjs` |
| **H1** | Mortgage: `loanAmount` vs down payment, PMI, payment types, annual tax units | Engine + Codex finance unit tests (`b3-finance-engines.test.ts`) |
| **H2** | Investment/savings: simple/compound, tax, withdrawals, `afterTaxValue`, term mismatch | Engines honor form options; null real-value fixed to nominal when inflation=0 |
| **H3** | Auto/personal/overpayment: differentiated payments, field names, claimed outputs | Payment-type helpers + engine returns |
| **H4** | ROI claimed `cagr` / `annualizedROI` / `paybackPeriod` missing or fake | Implemented or returned only when applicable (no dummy numbers) |
| **API** | HTTP 200 with null required results; client-only defaults; internal errors leaked | `mergeCalculatorInputDefaults` + `assertRequiredOutputsPresent`; `assertFiniteResults` → domain 400; public 500 message sanitized |
| **HTML** | loan-payment `min=0.01` + default `step=1` → `stepMismatch` | Explicit `step: 0.01` on principal/rate; form heuristic for fractional mins |

---

## Computational complexity limits

| Constant | Value | Applies to |
|----------|------:|------------|
| `MAX_OWNERSHIP_YEARS` | 50 | Car depreciation / resale year tables |
| `MAX_HORIZON_YEARS` | 50 | Loans, investment, savings, compound interest |
| `MAX_SCHEDULE_ROWS` | 360 | Amortization schedule payload rows |
| `MAX_SIMULATION_MONTHS` | 1200 | Extra-payment / target-search loops |
| `MAX_RANDOM_QUANTITY` | 10_000 | Random number generator array size |

Limits are enforced **inside** calculation functions via `assertBoundedIterations` (throws `CalculationDomainError`), independent of form validation. API schema `min`/`max` is an additional layer.

---

## API / schema contract changes

1. **Defaults:** Server merges `defaultValue` for visible inputs (and select seeds for `visibleIf`) before validate/calculate.
2. **Required outputs:** Declared numeric/primary outputs must not be `null`/`undefined`; narrative/schedule fields remain optional (see `OPTIONAL_OUTPUT_NAMES`).
3. **Non-finite numbers:** Rejected as domain 400 before JSON serialization (which would coerce to `null`).
4. **Domain vs server errors:** `CalculationDomainError` → 400 with message; unexpected → 500 `"An unexpected error occurred"` (no stack/internal leak).
5. **loan-payment (EN/RU):** `step: 0.01` on amount/rate; `max` on principal; years `step: 1`, `max: 50`.
6. **car-depreciation / car-resale / random-number schemas:** `max` aligned with engine caps.

---

## Test results

| Check | Result |
|-------|--------|
| ESLint (`npm run lint`) | Pass (pre-existing unescaped-entity warnings only) |
| TypeScript (`npm run typecheck`) | Pass |
| i18n (`npm run i18n:validate`) | Pass with pre-existing non-blocking warnings (es/tr/hi) |
| Unit (`npm test -- --run`) | **152 passed** |
| Production build (`npm run build`) | Pass |
| E2E Chromium (`npm run test:e2e`) | **28 passed** (includes `e2e/b3-finance-forms.spec.ts`) |

### New / extended tests

- `tests/unit/b3-finance-engines.test.ts` — Codex finance scenarios (mortgage/investment/savings/ROI/loans)
- `tests/unit/b3-computation-bounds.test.ts` — C1 fast-fail + isolated `--max-old-space-size=64` probe
- `tests/unit/b3-api-contracts.test.ts` — no 200/null; defaults; hostile years/quantity → 400
- `e2e/b3-finance-forms.spec.ts` — RU/EN loan-payment step validity; mortgage submit

Expected values in finance tests are computed independently of the engines under test.

---

## Remaining issues (not blocking B3.1 audit)

1. **EN mortgage TS vs JSON schema divergence:** TS definition (`homePrice`, `interestRateAPR`, term select) still takes registry precedence over `mortgage-calculator.json` (`loanAmount`, …). Engines accept both shapes; unifying schemas is a later cleanup.
2. **EN loan-payment missing item locale file:** Console warning `[i18n] Calculator content not found for slug "loan-payment" in locale "en"` — EN copy lives in TS only (pre-existing).
3. **Other engines still returning null bags:** Some non-finance calculators may still return null maps on invalid input; API `assertRequiredOutputsPresent` now converts that to 400 when outputs are declared required — gradual engine cleanup remains.
4. **i18n warnings** for es/tr/hi namespaces — out of B3.1 scope.
5. **No Stage B3.2 / deploy / merge** until independent Codex confirmation.

---

## Commits in this stage (finance + safety)

| SHA | Message |
|-----|---------|
| `04c39fa` | fix(finance): mortgage principal/PMI/frequency/differentiated |
| `0ed949f` | fix(finance): investment savings roi options |
| `1743b13` | fix(finance): auto personal overpayment payment types |
| `b087d7e` | test(finance): B3.1 Codex finance scenarios |
| `734f9a0` | fix(b3.1): harden computation bounds, API contracts, and loan-payment HTML |

---

## Handoff

**READY FOR CODEX B3.1 AUDIT**

Do not start Stage B3.2 without independent Codex confirmation.
