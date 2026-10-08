# Russian catalog recovery audit (Stage A)

**Status:** Stage A inventory complete; **Stage B recovery implemented locally** (see `RECOVERY_CHANGELOG.md`). Stages C–D not started.  
**Branch:** `fix/ru-catalog-seo-recovery`  
**Baseline SHA (`origin/main`):** `0320ad1c3c34424088526774ad6ac28875bebe71`  
**Date:** 2026-10-08  
**Machine report:** `reports/ru-catalog-inventory.json`, `reports/ru-catalog-inventory.csv`  
**Regenerate:** `node scripts/ru-catalog-inventory.mjs`

No production deploy was performed. Restored orphan engines preserve historical calculation semantics; no unrelated formula changes.

---

## 1. Executive verdict

The Russian calculator catalog is thin for **three independent reasons**, not one:

1. **Availability gate** — `filterLocalizedCalculators()` / `hasLocalizedCalculatorContent()` admit a locale only when `locales/<locale>/calculators/items/<slug>.json` exists. Catalog hubs, search, related links, and sitemap all use this gate.
2. **Orphaned RU content** — 8 of 13 RU item files (and 10 `*.ru.json` overlays) belong to calculators whose **base schemas were deleted** in commit `caad87e` (2025-12-18). Those pages 404; the RU files are dead weight.
3. **Ignored alternate RU sources** — full Russian `CalculatorDefinition`s in `data/calculators.ts` (`percentage-of-a-number`, `loan-payment`) and unused `*.ru.json` overlays are **not** treated as localized content by the availability gate.

Production spot-check matches the code model: `/ru/calculators` lists **exactly five** calculators; sitemap RU calculator URLs = **5**.

---

## 2. Counts (baseline)

| Metric | Count |
|---|---|
| JSON files in `data/calculators/` | **84** (74 base + 10 `*.ru.json`) — matches Docker observation |
| Enabled base schemas | **69** |
| Disabled base schemas | **5** (`basic`, `converter`, `power-root`, `statistics`, `volume`) |
| English item files | **75** |
| Russian item files | **13** |
| RU items matching a live schema slug | **5** |
| Orphan RU item files (no live schema) | **8** |
| RU catalog / search / sitemap visible | **5** |
| Enabled schemas missing RU item | **64** |
| TypeScript-only calculators (no JSON schema) | **12** |
| TypeScript full RU definitions | **2** (`percentage-of-a-number`, `loan-payment`) |
| `es` / `tr` / `hi` calculator items | **0** |

### Locale catalog table (before recovery)

| Locale | Enabled calculators (engine) | Item files | Visible in locale catalog | Notes |
|---|---|---|---|---|
| `en` | 69 JSON + 12 TS-only ≈ broad catalog | 75 | All enabled with EN items | Baseline |
| `ru` | same engines available via fallback | 13 (5 live + 8 orphan) | **5** | Filter + orphans |
| `es` | engines exist | 0 | 0 | Shell only |
| `tr` | engines exist | 0 | 0 | Shell only |
| `hi` | engines exist | 0 | 0 | Shell only |

---

## 3. Confirmed root causes

### RC1 — Item-file-only availability filter (primary catalog shrinker)

File: `lib/i18n/content-availability.ts`

```ts
// locale === 'en' OR existsSync(locales/<locale>/calculators/items/<slug>.json)
```

Consumers:

| Consumer | Effect when RU item missing |
|---|---|
| `app/[locale]/(main)/calculators/page.tsx` | Hidden from `/ru/calculators` |
| `app/[locale]/(main)/calculators/[category]/page.tsx` | Hidden from category hubs |
| `app/[locale]/page.tsx` | Hidden from homepage popular/all |
| `lib/search/documents.ts` | Absent from RU search index |
| `components/calculators/related-calculators-block.tsx` | Dropped from related lists |
| `app/sitemap.ts` | Omitted from sitemap |
| Calculator page metadata | `noindex,follow` + canonical forced to EN |

Introduced in commit `9786e1a` (Phase 3–4B localization infrastructure). Intentional anti-fallback indexing — but it also hides calculators that already have non-item RU content.

### RC2 — Base schemas deleted; RU leftovers orphaned

Commit `caad87e` («выправили легаси на английском», 2025-12-18) **deleted** base schemas including:

`area-circle`, `area-rectangle`, `cube-root`, `exponent`, `gcd`, `lcm`, `logarithm`, `inflation-adjustment`, `percentage-of-a-number` (JSON), and temporarily `roi-calculator`.

RU item files and `*.ru.json` overlays for several of these were **kept**. Registry never loads `*.ru.json` (see RC3). Result:

| Orphan RU slug | Direct URL today | Possible modern analog (not proven equivalent) |
|---|---|---|
| `area-circle` | 404 | `area` (multi-shape) |
| `area-rectangle` | 404 | `area` |
| `cube-root` | 404 | `square-root` / disabled `power-root` |
| `exponent` | 404 | disabled `power-root` |
| `gcd` | **404 on production** | none live |
| `lcm` | 404 | none live |
| `logarithm` | 404 | none live |
| `inflation-adjustment` | 404 | finance cluster (ROI etc.) — not equivalent |

### RC3 — `*.ru.json` overlays never loaded

`lib/registry/loader.ts` filters:

```ts
f.endsWith('.json') && !f.includes('.ru.json')
```

The 10 overlays exist on disk (and in Docker) but do not register calculators, do not supply field labels, and do not satisfy the availability gate.

### RC4 — TypeScript RU definitions ignored by the gate

`data/calculators.ts` still contains complete Russian definitions for:

- `percentage-of-a-number` (math)
- `loan-payment` (finance)

Production evidence for `/ru/calculators/math/percentage-of-a-number`:

- HTTP **200**
- H1 / title in Russian («Процент от числа»)
- Still **`noindex, follow`**
- Canonical forced to English URL
- **Absent** from `/ru/calculators` and sitemap

So the filter is stricter than “has Russian UI copy”.

### RC5 — Silent `catch` in registry loader

`LocalCalculatorLoader.getAll` / `getByCategory` swallow per-file and directory errors. Broken JSON can disappear from the catalog without a build failure. Related empty `catch` also in `lib/calculators/loader.ts` for missing schemas.

### RC6 — Dual behavior for missing RU items

| Case | HTTP | Indexing | Content |
|---|---|---|---|
| Live schema, no RU item (e.g. mortgage) | **200** | `noindex` | English item fallback; English H1/title |
| Orphan RU item, no base schema (e.g. gcd) | **404** | n/a | Dead |
| TS RU definition, no RU item (percentage) | **200** | `noindex` | Russian from TS, still treated as “unavailable” |

---

## 4. Live RU catalog (the only five)

These have matching enabled schema **and** `locales/ru/calculators/items/<slug>.json`:

| ID / slug | Category | In sitemap | Production catalog |
|---|---|---|---|
| `cement-calculator` | construction | yes | yes |
| `concrete-volume-calculator` | construction | yes | yes |
| `sand-calculator` | construction | yes | yes |
| `roi-calculator` | finance | yes | yes |
| `square-root` | math | yes | yes |

Quality note (not a hide reason): some RU items still contain English fragments in examples (e.g. `"Result:"` in `area-circle` orphan content). Stage B must not treat file presence alone as “full localization”.

---

## 5. Historical tools / SEO URLs (preserve)

Registry: `lib/tools/registry.ts`. Routes under `app/[locale]/(legacy)/` and `/tools`.

| Path | Production HEAD | Notes |
|---|---|---|
| `/chislo-propisyu` | 200 (middleware rewrite → `/en/...` internally; public URL preserved) | Core historical RU tool |
| `/ru/chislo-propisyu` | 200 | Locale-prefixed variant |
| `/numbers-to-words` | (legacy registry) | EN counterpart |
| `/roman-numerals-converter` | legacy | |
| `/percentage-of-a-number` | legacy tool path + calculator TS route | Do not break either |
| `/add-subtract-percentage` | legacy | |
| `/root-calculator` | legacy | |
| `/range/1-100`, `/factors/360`, `/number-format/...` | example utility paths | |
| `/tools` | 200 | Tools hub |

Sitemap includes legacy tools for `en` and `ru` only (`app/sitemap.ts`). **Do not delete or redirect these away without proven necessity.**

There is also a modern calculator schema `numbers-to-words` / id `numbers-to-words-calculator` — related to, but not a drop-in replacement for, legacy `/chislo-propisyu`. Treat as linked equivalents only after content/SEO review.

---

## 6. calc1.ru comparison (names ≠ equivalence)

Fetched category listings from `https://calc1.ru/ru/{category}` (2026-10-08). calc1.ru is a separate Next.js product with a larger Russian surface (finance, math, construction, health, converter, auto, time, life).

**Rules applied:**

- Same or similar title/slug is **not** proof of formula, inputs, units, or SEO URL equivalence.
- first-calc.com must restore **its own** supported calculators with verified engines/schemas; calc1.ru is a coverage **hint list**, not a migration checklist.

Illustrative name-overlap candidates (require engine/schema diff before claiming recovery):

| calc1.ru path | first-calc candidate | Equivalence |
|---|---|---|
| `/ru/finance/mortgage` | `mortgage-calculator` | Unproven — different slug/IA |
| `/ru/math/area` | `area` | Plausible family; first-calc `area` is multi-shape EN-only item |
| `/ru/math/power-root` | `power-root` (**disabled**) + `square-root` | Partial at best |
| `/ru/math/percent` | `percentage-of-a-number` / legacy percentage tools | Related cluster |
| `/ru/construction/paint` | `paint-calculator` | Unproven |
| `/ru/construction/rebar-calculator` | `rebar-calculator` | Unproven |
| `/ru/health/bmihealth` | `bmi-calculator` | Unproven |

calc1.ru also has many tools first-calc does **not** ship (customs, OSAGO, wallpaper, ovulation, etc.). Those are out of scope unless separately productized.

---

## 7. Missing English content warnings

Inventory found **0** enabled schemas with missing EN item files at baseline. Runtime `[i18n] Calculator content not found…` warnings remain possible for:

- Orphan / deleted slugs still referenced from standards/articles (`relatedCalculatorIds` still mention `area-circle`, `area-rectangle`, `exponent`, `inflation-adjustment`, etc. in `data/standards.ts` / `data/articles.ts`).
- Slug mismatches such as `numbers-to-words` vs `numbers-to-words-calculator`.

Stage B should clear or document each warning source.

---

## 8. Per-calculator inventory location

Full per-row fields are in:

- `reports/ru-catalog-inventory.json` — `liveSchemas`, `orphanRuItems`, `tsOnlyCalculators`
- `reports/ru-catalog-inventory.csv` — flat table for spreadsheets

Each live row includes: id, slug, category, definition source, enabled, engine presence, locale item presence, RU content field checklist, catalog/search/sitemap flags, absence reasons.

---

## 9. Stage B implications (not executed yet)

Recommended recovery order (does **not** authorize mass machine-translated SEO text):

1. **Fix availability semantics** — recognize real RU sources (item files **and** verified TS locale definitions); never claim EN fallback as localized; keep noindex for true EN-only pages.
2. **Unblock high-value TS RU pages** — emit proper `locales/ru/...` items (or teach the gate about TS) for `percentage-of-a-number` and `loan-payment` so they become catalog/sitemap indexable.
3. **Decide orphan fate per slug** — restore base schema from git history + tests, **or** map redirects to a proven modern calculator, **or** document intentional retirement (prefer restore/redirect over silent 404 for historically linked IDs).
4. **Localize remaining enabled schemas** in quality batches (math/converters → construction → finance), with field labels, errors, examples, FAQ, SEO — not titles alone.
5. **Stop swallowing loader errors** — log/fail CI on invalid schemas.
6. **Preserve `/tools` and legacy URLs** throughout.

---

## 10. Checkpoint A sign-off

| Question | Answer |
|---|---|
| Why did most RU calculators disappear from the catalog? | **RC1** item-file filter after Phase 3–4B |
| Why are there 13 RU files but only 5 in the catalog? | **RC2** — 8 orphans after schema deletion |
| Why does Docker show 84 JSON files? | 74 base + 10 unused `*.ru.json` overlays (**RC3**) |
| Why is Russian still visible on some `/ru/...` URLs? | EN fallback pages (noindex) or TS RU defs still served (**RC4/RC6**) |
| Are historical tools broken? | Spot-check: `/chislo-propisyu`, `/tools` return 200; must stay preserved |
| Ready for Stage B? | **Yes** — causes confirmed; fixes not started |

**PASS for Stage A inventory only.** Overall recovery / SEO / test PASS is **not** claimed.

---

## 11. Stage B checkpoint (local recovery)

Implemented on this branch; details in `RECOVERY_CHANGELOG.md`.

| Metric | Before | After (local) |
|---|---:|---:|
| Active enabled schemas | 69 | **77** |
| In Russian catalog | 5 | **77** |
| Hidden by localization gate | 64 | **0** |
| Orphan schema-less RU items | 8 | **0** (schemas restored) |
| Enabled schemas with EN fallback as only copy | 64 | **0** |

Root-cause remediation:

| ID | Status |
|---|---|
| RC1 | Mitigated — RU items exist for all enabled schemas; TS RU slugs also recognized |
| RC2 | Fixed — 8 orphans restored with engines/tests |
| RC3 | Documented — overlays still unused; not required after item restoration |
| RC4 | Fixed — percentage/loan have RU items + TS recognition |
| RC5 | Fixed — loader logs errors + id/slug collisions |
| RC6 | Mitigated for enabled catalog — RU items remove noindex path for those pages |

**Stage B is ready for independent review.** Not claiming production PASS, SEO PASS, or complete editorial depth for every FAQ. No deploy / no PR until approved.
