# Final Release Blockers Report

**Status: READY FOR FINAL RELEASE GATE**

Date: 2026-10-09  
Branch: `fix/ru-catalog-seo-recovery`  
Repository: `alex1c/first-calc`

## SHAs

| | SHA |
|---|---|
| Starting tip (Codex RELEASE NO-GO) | `18a65d50882a600adc292159027df174cf74ee1d` |
| Final tip (this gate) | `fa34138bf571357d20b24c8ffc7a94ccbf2697a3` |

Verify tip with:

```bash
git rev-parse HEAD
git ls-remote origin refs/heads/fix/ru-catalog-seo-recovery
git status
```

Working tree must be clean; local HEAD must equal origin HEAD. No merge, PR, or deploy performed.

---

## Scope

Fixed confirmed SEO/UI release blockers only: ES/TR/HI indexation containment, chislo-propisyu i18n keys, RU percentage decimal formatting, five EN informational self-canonicals, regression tests, smoke, and verification. No broad refactor, math audit, merge, PR, or deploy.

---

## 1. HIGH — ES/TR/HI indexation containment

### Before
15 locale-prefixed pages (es/tr/hi × five route groups) returned HTTP 200 without `noindex` and with incorrect self-canonicals; `/learn` and `/standards` advertised es/tr/hi in hreflang.

### Fix
- Central helper `lib/seo/limited-locale-metadata.ts` → `primaryLocalePageMetadata()` wrapping `localizedContentMetadata` with `PRIMARY_CONTENT_LOCALES` (`en`, `ru`).
- Applied on landings: chislo-propisyu, percentage-of-a-number, add-subtract-percentage, numbers-to-words, roman-numerals-converter, root-calculator, learn, standards.
- EN informational pages (about/privacy/terms/disclaimer/contact) use the same helper with `['en']` content locales.
- `PRIMARY_CONTENT_LOCALES` exported from `lib/i18n/content-availability.ts`.
- Limited locales: `robots: { index: false, follow: true }`, canonical → EN equivalent, hreflang only `en` / `ru` / `x-default`.

### 15 URL results (standalone smoke + Playwright)

| URL | Status | robots | canonical | es/tr/hi hreflang |
|---|---|---|---|---|
| `/es/chislo-propisyu` | 200 | noindex, follow | `https://first-calc.com/chislo-propisyu` | absent |
| `/es/percentage-of-a-number` | 200 | noindex, follow | `https://first-calc.com/percentage-of-a-number` | absent |
| `/es/add-subtract-percentage` | 200 | noindex, follow | `https://first-calc.com/add-subtract-percentage` | absent |
| `/es/learn` | 200 | noindex, follow | `https://first-calc.com/learn` | absent |
| `/es/standards` | 200 | noindex, follow | `https://first-calc.com/standards` | absent |
| `/tr/chislo-propisyu` | 200 | noindex, follow | `https://first-calc.com/chislo-propisyu` | absent |
| `/tr/percentage-of-a-number` | 200 | noindex, follow | `https://first-calc.com/percentage-of-a-number` | absent |
| `/tr/add-subtract-percentage` | 200 | noindex, follow | `https://first-calc.com/add-subtract-percentage` | absent |
| `/tr/learn` | 200 | noindex, follow | `https://first-calc.com/learn` | absent |
| `/tr/standards` | 200 | noindex, follow | `https://first-calc.com/standards` | absent |
| `/hi/chislo-propisyu` | 200 | noindex, follow | `https://first-calc.com/chislo-propisyu` | absent |
| `/hi/percentage-of-a-number` | 200 | noindex, follow | `https://first-calc.com/percentage-of-a-number` | absent |
| `/hi/add-subtract-percentage` | 200 | noindex, follow | `https://first-calc.com/add-subtract-percentage` | absent |
| `/hi/learn` | 200 | noindex, follow | `https://first-calc.com/learn` | absent |
| `/hi/standards` | 200 | noindex, follow | `https://first-calc.com/standards` | absent |

EN/RU equivalents remain indexable with self-canonical and hreflang `en,ru,x-default` only (no es/tr/hi).

### Regression tests
- Unit: `tests/unit/final-release-blockers.test.ts` — 5 routes × 3 limited locales + EN/RU primary + EN informational.
- E2E: `e2e/final-release-blockers.spec.ts` — same 15 URLs via Chromium request assertions.

---

## 2. HIGH USER-FACING — «Число прописью» i18n keys

### Before
Chromium showed raw keys such as `legacy/ui.form…` because `useClientT` started with an empty dictionary on SSR/first paint.

### Fix
- `useClientT(locale, namespaces, initialDict?)` seeds state from server-loaded dict.
- `NumberToWordsForm` / `PercentageForm` accept `initialDict`.
- Landing and slug pages for chislo-propisyu load `legacy/ui` + `errors` via `loadNamespaces` and pass `initialDict`.

### After
- `/chislo-propisyu`, `/ru/chislo-propisyu`: no raw keys; submit labels Convert / Конвертировать.
- `/chislo-propisyu/123`: conversion text present; no `legacy/ui.form` keys.
- Number conversion logic unchanged.

---

## 3. LOW — Russian percentage formatting

### Before
RU results could show `5.73%` (ASCII decimal point).

### Fix
- `formatOutputValue(..., 'percentage', …, locale)` uses `Intl.NumberFormat` for locale digits → RU `5,73%`, EN `5.73%`.
- `percentageChange` main value in `calculator-results.tsx` uses locale-aware `Intl` (up to 6 fraction digits) instead of `toFixed`.

### After (unit)
`formatOutputValue(5.73, 'percentage', undefined, 'ru')` → `5,73%`  
`formatOutputValue(5.73, 'percentage', undefined, 'en')` → `5.73%`  
Math results unchanged.

---

## 4. SEO — Five EN informational self-canonicals

### Pages
`/about`, `/privacy`, `/terms`, `/disclaimer`, `/contact`

### Fix
Each `generateMetadata` spreads `primaryLocalePageMetadata(locale, path, ['en'])`.

### After (smoke)
All five return HTTP 200, self-canonical `https://first-calc.com{path}`, no `noindex`.

---

## 5. Release smoke (additional)

| Check | Result |
|---|---|
| Sitemap | 200; no `/(es\|tr\|hi)/` production URLs |
| Robots | `Allow: /`; `Disallow: /admin`, `/api/`; Sitemap → `https://first-calc.com/sitemap.xml`; not `Disallow: /` |
| Legacy landings | numbers-to-words, roman, root, add-subtract (+ RU) 200 + canonical |
| Home internal links | `/calculators`, `/learn` present |

---

## 6. Automated verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `npm run lint` | pass (existing apostrophe warnings only) |
| `npm test -- --run` | 40 files / 245 tests pass |
| `npm run build` | pass (`BUILD_EXIT:0`) |
| Playwright `e2e/final-release-blockers.spec.ts` | 18/18 pass |
| HTTP smoke (15 limited + primary + EN canon + chislo + sitemap/robots + legacy) | FAILS=0 |

---

## Remaining blocking issues

**None identified for this gate.**

Out of scope / known non-blockers:
- Dynamic legacy slug URLs remain `noindex` by design (infinite URL space).
- Full ES/TR/HI localization still deferred; those locales stay reachable with containment policy.
- Pre-existing ESLint `react/no-unescaped-entities` warnings in unrelated files.

---

## Publish

Branch pushed to GitHub: `fix/ru-catalog-seo-recovery`.  
No merge, PR, or Timeweb deploy from this workstream.

**READY FOR FINAL RELEASE GATE**
