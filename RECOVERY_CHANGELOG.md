# Russian catalog recovery changelog (Stage B)

**Branch:** `fix/ru-catalog-seo-recovery`  
**Baseline SHA:** `0320ad1c3c34424088526774ad6ac28875bebe71`  
**Date:** 2026-10-08  
**Deploy / PR:** not performed (Stage B checkpoint only)

## Summary

Restored a full Russian catalog for all enabled calculator schemas, revived eight orphaned calculators deleted in `caad87e`, fixed content-availability semantics, and added regression tests. Historical tools (`/chislo-propisyu`, `/tools`, legacy registry paths) were preserved.

## Metrics

| Metric | Before | After |
|---|---:|---:|
| Active (enabled) calculators | 69 | **77** (+8 restored orphans) |
| In Russian catalog | 5 | **77** |
| Hidden due to localization gate | 64 | **0** |
| Orphan RU translations | 8 | **0** |
| RU pages with English fallback (enabled schemas) | 64 | **0** |
| 404 on restored orphan URLs (code-level) | 8 | **0** (schemas + engines restored) |

Additional TS-only calculators (`compound-interest`, `retirement-calculator`, etc.) still lack JSON schemas and therefore still 404 on `/ru/calculators/...` unless a matching TS `locale: 'ru'` definition exists. `percentage-of-a-number` and `loan-payment` remain available via TypeScript RU definitions **and** new RU item files.

## Architecture fixes

- `lib/i18n/content-availability.ts`
  - Recognizes item files and explicit TypeScript RU slugs
  - Adds `diagnoseCalculatorContentAvailability()`
  - Continues to refuse EN fallback as “localized”
- `lib/registry/loader.ts`
  - Logs schema load failures instead of silent empty `catch`
  - Logs duplicate id/slug collisions while scanning schemas
- `lib/navigation/categories.ts`
  - Restores `geometry` category for historical area URLs
- `lib/calculators/schema.ts`
  - Registers restored calculation engines (`gcd`, `lcm`, `area-circle`, `inflation-adjustment`)

## Restored orphan calculators

Base schemas rewritten for the current DSL (IIFE formulas were incompatible with `executeFormula`):

| Slug | Category | Engine |
|---|---|---|
| `gcd` | math | `calculateGcd` |
| `lcm` | math | `calculateLcm` |
| `logarithm` | math | formula |
| `exponent` | math | formula |
| `cube-root` | math | formula |
| `area-circle` | geometry | `calculateAreaCircle` |
| `area-rectangle` | geometry | formula |
| `inflation-adjustment` | finance | `calculateInflationAdjustment` |

Also created EN item files for these slugs and polished existing RU items.

## Localization

- RU item coverage for all **77** enabled schema slugs under `locales/ru/calculators/items/`
- Reused / polished existing RU content (cement/sand/concrete/ROI/square-root + orphan RU files)
- Extracted RU items for `percentage-of-a-number` and `loan-payment` from `data/calculators.ts`
- Generated remaining RU items with native titles/descriptions/labels; polished residual English labels

## Tests added

- `tests/unit/restored-orphan-calculations.test.ts`
- `tests/unit/ru-catalog-recovery.test.ts`
- Updated `tests/unit/content-availability.test.ts`

## Scripts / reports

- `scripts/ru-catalog-inventory.mjs` (Stage A, regenerated)
- `scripts/stage-b-restore-orphan-items.mjs`
- `scripts/stage-b-missing-ru.mjs`
- `scripts/stage-b-write-remaining-ru.mjs`
- `scripts/stage-b-polish-ru-labels.mjs`
- `reports/ru-catalog-inventory.json` / `.csv`

## Verification run (local)

| Check | Result |
|---|---|
| ESLint | Pass (pre-existing warnings only) |
| `tsc --noEmit` | Pass |
| `npm run i18n:validate` | Pass with 66 pre-existing warnings (es/tr/hi shell gaps) |
| Unit tests | **76 passed** |
| Production build | Pass |
| E2E | Not run in this checkpoint (no dedicated Stage B browser suite executed) |

## Remaining limitations (not Stage B PASS claims)

1. Some RU long-form FAQ/example bodies are shorter than EN originals for newly filled pages; titles/labels/descriptions are Russian, but native editorial deepening can continue.
2. TS-only EN calculators without RU TS rows still 404 on `/ru/...` direct routes.
3. Unused `*.ru.json` overlays remain on disk (not loaded); safe to clean later after confirming no tooling depends on them.
4. Production spot-check after deploy is still required before claiming live SEO recovery.
5. Stage C SEO audit not started.

## Changed file groups

- `lib/i18n/content-availability.ts`, `lib/registry/loader.ts`, `lib/calculators/schema.ts`, `lib/navigation/categories.ts`
- `lib/calculations/{gcd,lcm,area-circle,inflation-adjustment}.ts`
- `data/calculators/{gcd,lcm,logarithm,exponent,cube-root,area-circle,area-rectangle,inflation-adjustment,square-root}.json`
- `locales/en/calculators/items/` (8 restored orphans)
- `locales/ru/calculators/items/` (full enabled catalog)
- `tests/unit/*recovery*`, `tests/unit/content-availability.test.ts`
- Docs/reports/scripts listed above
