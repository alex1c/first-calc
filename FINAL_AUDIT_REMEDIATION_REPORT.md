# Final Audit Remediation Report

**Branch:** `fix/ru-catalog-seo-recovery`  
**Base audit SHA:** `8fe74cf6618e2ae8500f07d534ca8d26cb87e04f`  
**Remediation tip SHA:** de7a1a61b11d6f0d91a4b9e506b4162ab8d9a1cf  
**Status:** `READY FOR RELEASE RECHECK`

No merge, PR, or production deploy performed.

---

## 1. Codex blockers H1–H8

| ID | Issue | Fix |
|----|-------|-----|
| **H1** | Required-output guard blocked valid multi-mode results | `assertRequiredOutputsPresent` now requires ≥1 non-nullish required output; expanded conditional optional names; engines that returned all-null now throw domain errors |
| **H2** | ROI `timePeriod` default 0 → API 400 | ROI treats `timePeriod≤0` as “omit CAGR”; basic ROI still computed |
| **H3** | Percent outputs ×100 again | Fixed rounding in `compound-interest`, `loan-comparison`, `mortgage-comparison` |
| **H4** | Mortgage tax unit vs default | `propertyTaxType` default → `amount` (matches ₽/год / $/year labels) |
| **H5** | numbers-to-words zero / negative currency | Nullish input for `0`; currency words keep `минус`; breakdown uses `trunc` |
| **H6** | Investment/savings withdrawals & tax | Profit = end + withdrawals − contributions; tax on economic gain |
| **H7** | Interest-only `totalPayment` | Includes principal repayment at term end |
| **H8** | `inflationRate=2.5` stepMismatch | `step: 0.1` on retirement & investment-vs-savings; form uses fractional default precision |

Regression suite: `tests/unit/final-audit-h1-h8.test.ts` (20 independent expectations).

---

## 2. Calculator census (95)

- All-calculator smoke EN+RU: pass (seeds for retirement / tire / car-affordability; no 5xx; no empty required-output set).
- Directed API scenarios for the six previously blocked calculators: covered in H1 tests + smoke.
- Full independent Chromium census of all 95 RU pages was done in the Codex audit; remediation re-verified blockers and production build. Recommend release recheck re-runs the external census harness against the new tip.

---

## 3. RU English UI

Addressed systemic chrome:

- Category badges / finance hero caption (RU)
- FAQ headings (RU)
- Examples headings (RU)
- Currency formatting respects locale / unitLabel (`format.ts` + API)
- Category cards skip empty categories; RU plural labels
- Percentage-change RU example/FAQ aligned with formula (−50%)

**Remaining:** Large `calculator-results.tsx` English narratives; some option labels (kg, MPG); shared EN how-to in TS defs. Estimate: **dozens of residual English strings** on specialized result blocks — not zero, but hero/FAQ/examples/currency blockers reduced.

---

## 4. SEO

| Item | Action |
|------|--------|
| Learn links on standards → `/ru/learn/...` 404 | `learnArticlePath(article)` uses article content locale |
| ISO soil link from RU pages | Points to EN `/standards/ISO/soil-and-foundations` |
| `x-default` → missing EN | `languageAlternates` picks first available locale |
| `/ru/10000-19999` range 404 | Middleware rewrites locale-prefixed numeric ranges |
| Legacy `/factors` breadcrumb 404 | Points at `/tools` hub |
| Empty es/tr/hi category cards | Filtered when `count === 0` |

Historical landings (`/chislo-propisyu`, `/tools`, noindex examples) preserved. Sitemap still excludes empty calculator hubs and noindex-only examples.

**Broken internal targets:** Previously 30; remediation removes the learn/ISO/range/breadcrumb classes listed above. Remaining risk: es/tr/hi nav to category paths if any caller still lists empty categories; RU decimal legacy URLs (`/ru/45.2/2.3-add`) not fully restored (no fake pages).

---

## 5. Verification commands

| Check | Result |
|-------|--------|
| ESLint | Exit 0 (existing warnings) |
| `tsc --noEmit` | Exit 0 |
| `i18n:validate` | Exit 0 (66 es/tr/hi warnings) |
| `vitest run` (single fork) | **186/186 PASS** |
| `npm run build` | Exit 0 |
| Playwright e2e | Run after remediation tip (see CI/local) |

---

## 6. Remaining limitations

- M1: Orphan JSON advanced finance fields remain non-public under TS ownership (by design / AGENTS.md).
- Specialized EN result-renderer copy.
- Some es/tr/hi category menu surfaces if wired with static category lists.
- Decimal legacy RU numeric operators may still 404.
- External audit census harness should be re-run on the remediation tip for formal 95/95 confirmation.

---

## 7. GitHub sync

Push only `fix/ru-catalog-seo-recovery`. Local and remote HEAD must match; working tree clean.

**READY FOR RELEASE RECHECK**
