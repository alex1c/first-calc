# Stage B2 — Codex audit blocker fixes

**Status:** `READY FOR CODEX RE-AUDIT`  
**Branch:** `fix/ru-catalog-seo-recovery`  
**Final SHA:** `5fa1f5ec979a21f1fcc07c8b811ad47207eee0c9`  
**Codex audited SHA (baseline of this stage):** `d5ffd0036385989f2cd8c9f0c7e4892358551093`  
**Base:** `0320ad1c3c34424088526774ad6ac28875bebe71`  

No production deploy. No merge to `main`. Stage C not started.

---

## 1. Commits (B2)

| SHA | Summary |
|---|---|
| `ce0daa8` | fix(api): resolve calculate locale from body and query |
| `11faf14` | fix(finance): register engines and align RU/EN field contracts |
| `7ad87df` | test(finance): cover RU finance calculate API forms |
| `4b4b0ce` | fix(math): reject non-finite results and domain errors |
| `4cac422` | fix(registry): align numbers-to-words id, slug, and filename |
| `cfd2a5c` | fix(i18n): restore ten TS-only RU calculators via shared engines |
| `6530167` | fix(seo): limit category hub hreflang to available locales |
| `deafc16` | fix(i18n): hide EN badge when native RU content is available |
| `a402f84` | fix(i18n): match schema fields by name and localize selects |
| `a7e6ee2` | fix(ru): correct GCD/LCM (НОД/НОК) copy and form labels |
| `bf56f48` | fix(seo): range hreflang and localized result explanations |
| `20b59de` | test(b2): regression suite, production smoke, and Stage B2 report |
| `656cf97` | docs(b2): record final Stage B2 verification SHA |
| `5fa1f5e` | docs(b2): rewrite Stage B2 report with final SHA and clean encoding |

---

## 2. Fixes vs 12 Codex findings

| # | Severity | Finding | Fix |
|---|---|---|---|
| 1 | High | API locale ignored (`ru` → silent `en`) | Body+query locale contract; invalid locale → 400; UI sends both |
| 2 | High | 7 finance JSON engines unregistered | `registerCalculation` + input/output aliases on shared engines |
| 3 | High | Formula error → first-input fallback | Fallback removed; throws clear errors |
| 4 | High | Overflow `Infinity` → JSON `null` on 200 | `assertFiniteResults` before serialize; domain throws |
| 5 | High | `numbers-to-words` file/slug 404 | File/id/slug aligned to `numbers-to-words` |
| 6 | Medium | 10 TS-only RU 404 / unavailable | 6 compatibility + add/subtract + percentage/loan via registry + items |
| 7 | Medium | Category hreflang for missing locales | `categoryContentLocales` / hub helpers → en+ru only |
| 8 | Medium | EN form/results on RU | Badge gate, name-keyed labels, selects, result explanations |
| 9 | Medium | Output labels by array index | Match by stable `name` in schema + localize-definition |
| 10 | Medium | Empty/fractional + loan-payment step | loan-payment years min/step fixed; GCD/LCM reject fractions |
| 11 | Low | RU copy (НОД/НОК etc.) | gcd/lcm FAQ + examples corrected |
| 12 | Low | Wrong EN badge on RU TS pages | Badge uses `hasLocalizedCalculatorContent`; `contentLocale: 'ru'` |

---

## 3. Census

| Metric | Count |
|---|---|
| Unique calculators (EN registry) | **95** |
| Working RU calculators (catalog-visible, localized) | **87** |
| Sitemap sample checked (smoke) | **131** |
| Sitemap 404s (smoke) | **0** |
| Unexpected RU calculator noindex (smoke) | **0** |
| False calculation fallbacks (math-safety + smoke) | **0** |

---

## 4. Test results (mandatory)

| Check | Result |
|---|---|
| ESLint (`npm run lint`) | Pass (pre-existing unescaped-entity warnings only) |
| TypeScript (`npm run typecheck`) | Pass |
| i18n validate | Pass with **66 warnings** (es/tr/hi shell gaps — pre-existing) |
| Unit/integration (`npm test -- --run`) | **133 passed** / 27 files |
| Production build | Pass |
| Playwright E2E | **25 passed** |
| Local production smoke (`scripts/b2-production-smoke.cjs`) | Pass — API values asserted; sitemap 0×404 |

Regression suite: `tests/unit/b2-regression-suite.test.ts`  
Smoke: `node scripts/b2-production-smoke.cjs` (against `npm start`)

---

## 5. Remaining warnings / limitations

- Category hero copy for some hubs still English.
- Many calculator-specific blocks in `calculator-results.tsx` remain EN-only; shared explanation path is localized.
- Not every RU item file has `name`/`options` on every field (index fallback remains for those).
- Homepage/`/tools` may still advertise broader locale alternates than calculator hubs.
- es/tr/hi calculator catalogs intentionally empty → i18n warnings expected.
- 95 EN vs 87 RU: remaining gap is EN-only TS finance tools without RU items (compound-interest, comparisons, retirement, etc.) — not in the Codex “ten TS-only” list.

---

## 6. Mapping table (Codex → evidence)

| Codex finding | Evidence |
|---|---|
| API locale | `lib/i18n.ts` `resolveRequestLocale`; `tests/api/calculator-calculate.test.ts`; `tests/api/ru-finance-calculate.test.ts` |
| Finance engines | `lib/calculations/{mortgage,roi,…}.ts` registrations; RU finance API tests |
| Formula fallback | `lib/calculators/schema.ts`; `tests/unit/math-safety.test.ts` |
| Infinity/null | `lib/calculations/result-safety.ts`; calculate route assert |
| numbers-to-words 404 | `data/calculators/numbers-to-words.json`; schema-identity test |
| 10 TS-only RU | `tests/unit/ts-only-ru-restore.test.ts` |
| Category hreflang | `tests/unit/category-hreflang.test.ts` |
| EN badge / forms | `deafc16`, `a402f84`, content-availability |
| Output by name | `schema-output-localization.test.ts` |
| loan-payment step / fractions | `data/calculators.ts` years min/step; gcd/lcm throws |
| НОД/НОК | `a7e6ee2` |
| Range `/ru/10000-19999` | `bf56f48` — rewrite preserved, noindex, en/ru alternates |

---

## 7. Stop conditions honored

- No deploy  
- No merge to `main`  
- No Stage C  
- Status **READY FOR CODEX RE-AUDIT** only after checks above actually passed  
