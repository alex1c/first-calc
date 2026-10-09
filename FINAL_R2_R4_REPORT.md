# Final R2/R4 Remediation Report

**Status: READY FOR R2/R4 RECHECK**

Date: 2026-10-09  
Branch: `fix/ru-catalog-seo-recovery`  
Repository: `alex1c/first-calc`

## SHAs

| | SHA |
|---|---|
| Starting tip | `8e9640fbf41aa82504e77d25342d8ce4a9c94232` |
| Fix commit | `a116c1c97372100614ae7224b7ca451879ade97f` |

Verify tip with `git rev-parse HEAD` and `git ls-remote origin refs/heads/fix/ru-catalog-seo-recovery` (must match; working tree clean).

## Scope

Only R2 (RU finance localization) and R4 (investment/savings compounding & contributions). R1, R3, and interest-only left intact. No merge, PR, or deploy.

---

## R4 — Compounding / contributions regression

### Cause

The prior High fix forced `finalValue` / year-table from a **monthly-only** simulator after computing a closed-form FV. That:

1. Erased annual/quarterly compounding (always returned the monthly FV).
2. Smeared yearly contributions as `amount/12` every month.

### Unified model

Both `investment.ts` and `savings.ts` now use one **month-calendar** projection:

- Interest applies only on months matching `compoundingFrequency` (12 / 3,6,9,12 / all months).
- Contributions apply only on months matching `contributionFrequency` (month 12 vs every month).
- Within a month: interest → contribution → withdrawal (ordinary annuity).
- Headline totals and `yearlyBreakdown` always come from this simulation (no last-row overwrite).

### Control values (after)

Principal 10000, 12%, 1 year, contributions 0:

| Compounding | Investment | Savings |
|---|---:|---:|
| Annually | **11200.00** | **11200.00** |
| Quarterly | **11255.09** | **11255.09** |
| Monthly | **11268.25** | **11268.25** |

Yearly contribution scenario (Codex): 10000, 12%, monthly compound, **1200 yearly** × 2 years → **15249.54** (independent calendar: `×1.01` each month, `+1200` on months 12 and 24). Year-table contribution column shows **1200** per year (not 100/mo smear).

Prior monthly path preserved: 10k + 500/mo @ 5% × 10y → **94111.23** = last year ending value.

---

## R2 — RU finance localization

### Fixes

- Expanded `results.labels.*` (EN/RU); specialized renderers use `L()` for retirement, mortgage comparison, loan comparison, year tables, calculation headings.
- Engine `formulaExplanation` on retirement / loan-comparison / mortgage-comparison: currency-agnostic numbers (no `$`); long English prose shown only when `locale === 'en'`.
- Money display continues via `formatMoney(locale)` (RUB on RU, USD on EN) — no global `$→₽` swap.
- Investment/savings machine summaries remain short numeric strings; “How the Calculation Works” body gated for non-en.

### Chromium (RU pages checked)

| Page | Result |
|---|---|
| `/ru/.../retirement-calculator` | No EN “INFLATION-ADJUSTED…” / “Monthly Income (4%…)”; RUB; no `$digit` |
| `/ru/.../mortgage-comparison-calculator` | No “Best Mortgage by” |
| `/ru/.../loan-comparison-calculator` | No `$digit` in results |
| `/ru/.../investment-calculator` | RUB; annual compound shows **11200**; EN how-works body gated |
| EN mortgage | Still USD / English labels |

---

## Tests

| Check | Result |
|---|---|
| `tests/unit/r4-compounding-contributions.test.ts` | 9/9 PASS (independent FV + calendar) |
| `tests/unit/high-blockers-r1-r4.test.ts` | 10/10 PASS (R1/R3/interest-only + monthly R4) |
| Full unit/integration | **207/207 PASS** |
| API investment compounding / yearly contrib | Matches controls above |
| Chromium `verify-r2-r4-browser.mjs` | ok true |
| Playwright e2e | **31/31 PASS** |
| ESLint / tsc / i18n:validate | exit 0 (pre-existing warnings) |
| Production build | exit 0 |

---

## Remaining limitations

- Long English engine explanations are hidden on non-en locales rather than fully translated.
- es/tr/hi still lack `results.json` (fall back toward English labels via client loader).
- Non-finance English chrome (math shapes, etc.) out of scope.
- Advanced tax/withdrawal fields remain off public TS schemas.
- Medium SEO debt unchanged.

---

## Publish

Pushed only to `fix/ru-catalog-seo-recovery`. No merge, PR, or deploy.
