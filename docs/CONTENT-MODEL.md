# Content Model

## Calculator schema
- **Location**: `data/calculators/*.json` (schema) + `locales/<locale>/calculators/items/<slug>.json` (content).
- **Fields (schema)**: `id`, `category`, `slug`, `engine` (`formula` or `function`), `calculationId` (for functions), `inputs`, `outputs`, `formula`, `variables`, `defaults`, `tags`, `relatedIds`, `standardIds`, `isEnabled`.
- **Fields (content)**: `title`, `shortDescription`, `longDescription`, `howTo`, `examples` (>=3), `faq` (>=10), `seo.keywords`, optional labels/units for inputs/outputs.
- **Execution**: `validateCalculatorSchema` guards required fields; `schemaToDefinition` merges schema, localized content, defaults, and chooses the calculation engine; `executeFormula` evaluates formula strings in a safe context.
- **contentLocale**: Returned by `loadCalculatorContent`; if the requested locale is missing, English content is used and `contentLocale` is set to `en` for UI badges.

## Definition types
- **CalculatorDefinition**: Runtime shape consumed by UI components (inputs, outputs, examples, FAQ, tags, meta, calculate function, related/standard IDs, enable flag).
- **StandardDefinition**: Context hubs that group related calculators, learn articles, and metadata without compliance guarantees.
- **ArticleDefinition**: Learn content with `title`, `shortDescription`, `contentHtml`, and metadata.

## Registry and loaders
- **Registry**: `lib/registry/loader.ts` exposes `calculatorRegistry`, `standardRegistry`, and `articleRegistry` to fetch items by id/slug, category/country, or locale.
- **Sources**: Local TypeScript exports in `data/*.ts`, JSON schemas in `data/calculators/*.json`, and future API/CMS hooks. Disabled items (`isEnabled: false`) are filtered out.
- **Autogen defaults**: `getDefaultCalculatorContent` supplies placeholders when item files are missing to keep UI stable.

## Legacy tools
- **Location**: `data/tools.ts` and `components/legacy`. Tools are not part of calculator schemas; they keep historical SEO traffic with minimal maintenance.
- **Engagement**: Legacy pages should include engagement blocks linking to newer calculators from the same category to encourage migration.

## Content relationships
- **Related calculators**: `relatedIds` drive "Related calculators" blocks and navigation clusters.
- **Standards linkage**: `standardIds` connect calculators to standards hubs (see `lib/standards/linking.ts`).
- **Tags and categories**: Used for clustering, navigation, and search scoring. Use consistent tag casing.

## Fallback behavior
- **Locale fallback**: Missing namespaces or item files fall back to English. Surfaces a "Content in English" badge when `contentLocale !== locale`.
- **Disabled items**: `isEnabled: false` prevents listing and execution without deleting data; useful for staged migrations.
