# How to Add a New Calculator

## Prerequisites
- Ensure the feature fits an existing category (`everyday`, `finance`, `health`, `construction`, etc.).
- Plan at least **3 examples** and **10 FAQ items** to meet EEAT goals.

## Steps
1. **Generate schema**: Run `npm run generate:calc` and follow prompts, or copy an existing file in `data/calculators/` as a template.
2. **Fill schema fields**:
   - `id`, `category`, `slug` (URL-safe, stable), `engine` (`formula` by default or `function` with `calculationId`).
   - Define `inputs` (name, type, unit/step/min/max/options/defaultValue/visibleIf) and `outputs`.
   - Provide `formula` or ensure the `calculationId` is registered in `lib/calculations/registry.ts`.
   - Add `tags`, `relatedIds`, and `standardIds` for navigation.
3. **Add content**: Create `locales/en/calculators/items/<slug>.json` with:
   - `title`, `shortDescription`, `longDescription`
   - `howTo` steps
   - `examples` (>=3) with steps/results
   - `faq` (>=10) with question/answer
   - `seo.keywords` and optional input/output labels/units
4. **Localize**: Copy the English item file into `locales/<locale>/calculators/items/` for ru/es/tr/hi and translate values. Keep keys identical.
5. **Validate**: Run `npm run i18n:validate` to check namespace/item parity, then `npm run lint` and `npm run build`.
6. **Wire navigation**: Add the calculator to relevant clusters in `lib/navigation/*` and related blocks if needed. Avoid modifying route structures.
7. **Review content**: Ensure wording avoids compliance/legal claims; use "Content in English" badge when `contentLocale` is `en` for non-English locales.

## Tips
- Prefer formulas for simple math; use function engines for complex logic already present in `lib/calculations/*`.
- Use `defaults` and `visibleIf` to simplify forms while keeping inputs explicit.
- Keep slugs stable; if renaming is unavoidable, add redirects at the routing layer before deployment.
