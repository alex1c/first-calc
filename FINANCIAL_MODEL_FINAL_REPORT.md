# Financial Model Final Report

**Status: READY FOR FINANCIAL MODEL RECHECK**

Date: 2026-10-09  
Branch: `fix/ru-catalog-seo-recovery`  
Repository: `alex1c/first-calc`

## SHAs

| | SHA |
|---|---|
| Starting tip | `905a7447926811e69e66224608371212d7d9a012` |
| Fix commit | *(recorded after push)* |

Verify tip: `git rev-parse HEAD` ≡ `git ls-remote origin refs/heads/fix/ru-catalog-seo-recovery`. Working tree clean.

---

## 1. Chosen financial model

Shared by **investment** and **savings** in `lib/calculations/finance-cashflow.ts`.

### Nominal annual rate
Input `r` is a **nominal annual rate**. The month share is always `r/12`, applied to **principal only**.

### Accrual vs capitalization
| Step | Rule |
|---|---|
| Accrual | Each calendar month: `accrued += principal × (r/12)` |
| Capitalization | Only on compounding-boundary months: `principal += accrued; accrued = 0` |
| Uncapitalized interest | Does **not** earn further interest until capitalized |

Compounding boundaries:
- Monthly → every month  
- Quarterly → months 3, 6, 9, 12  
- Annually → month 12  

This is **not** a hidden switch to monthly compounding when the user selects annual: under annual mode, accrued interest sits idle until December.

### Contributions
Ordinary / end-of-month order within each month:

1. Accrue on current principal  
2. Capitalize if boundary month  
3. Add contribution  
4. Apply optional monthly withdrawal (principal first, then accrued)

A deposit therefore earns starting the **next** month — never for time before it arrived.

### Why not “×(1+r) once on year-end balance”?
That credited full-year interest to mid-year deposits → **1332** for 12×100 @ 12% annual. Rejected.

### Why not `(1+r)^(t)` per deposit (1264.65)?
That embeds continuous intra-year compounding. We chose linear month-shares of the **nominal** rate with discrete capitalization dates — consistent with “annual capitalization” without inventing continuous compounding.

### Withdrawals / tax
Public TS schemas omit withdrawal/tax fields; engine still supports them for advanced/API use with the same month order. Tax applied after the cash-flow projection on economic gain.

### Table vs headline
`yearlyBreakdown` and `finalValue` / `finalSavings` are produced by the **same** simulation. Last row ending balance ≡ headline.

---

## 2. Independent controls

### No contributions — preserved
| Compounding | Result |
|---|---:|
| Annual | **11200.00** = 10000×(1.12) |
| Quarterly | **11255.09** = 10000×(1.03)⁴ |
| Monthly | **11268.25** = 10000×(1.01)¹² |

### Mixed: 0 start, 100/mo, 12%, annual compound, 1 year
Independent sum of month-shares on growing principal after each prior deposit:

`interest = Σ_{k=0}^{11} 100 × (0.12/12) × k = 66`  
`final = 1200 + 66 = **1266.00**`

| | Value |
|---|---:|
| Before (bug) | 1332.00 |
| After | **1266.00** |
| Continuous-fraction alternative (not used) | 1264.65 |

### Other mixes (independent simulator in tests)
| Scenario | Result |
|---|---:|
| Monthly compound + 1200 yearly × 2y from 10000 | **15249.54** |
| Annual compound + 1200 yearly × 2y from 10000 | **15088.00** |
| Monthly 10k+500/mo @5% ×10y | **94111.23** (preserved) |
| Zero rate, 1000 + 100/mo ×1y | **2200.00** |

Investment and savings match on identical inputs.

---

## 3. RU polish

- `formatMoney` / currency formatting: ignore bare `₽`/`$` unitLabels; use Intl locale currency → `1 266,00 ₽`, `94 111,23 ₽`.
- `formatYearsCount`: `1 год` / `2 года` / `5 лет` / `30 лет`.
- Loan/mortgage comparison term columns use declined years; months localized.
- Restored RU `results.explanations.finance.modelNote` describing the actual accrual model (not merely hiding EN prose).
- Investment schema `expectedAnnualReturn` min **0** (0% what-if allowed).

EN chrome and USD currency style preserved.

---

## 4. Tests

| Check | Result |
|---|---|
| `tests/unit/finance-model-mixed-frequency.test.ts` | PASS (independent expectations) |
| R1/R3/interest-only + prior R4 monthly | PASS via high-blockers / final-audit |
| Full unit/integration | **218/218 PASS** |
| API mixed → 1266; annual 11200; 0% → 10000 | PASS |
| Chromium `verify-finance-model-browser.mjs` | ok true |
| Playwright e2e | **31/31 PASS** |
| lint / tsc / i18n / production build | exit 0 |

---

## 5. Remaining limitations

- Some non-result English strings may remain in non-finance specialized renderers.
- es/tr/hi still lack `results.json` (model note falls back).
- Advanced withdrawal/tax UI still not on public TS forms.
- Medium SEO debt unchanged.

---

## Publish

Pushed only to `fix/ru-catalog-seo-recovery`. No merge, PR, or deploy.
