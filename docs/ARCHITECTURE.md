# Architecture

## Overview
First-Calc is a Next.js 14 app that renders locale-aware calculator, standard, learn, and legacy tool experiences. Content is defined as structured data (JSON schemas and TypeScript definitions) and rendered through reusable page blocks. Server components handle data loading while client components render calculator interactions.

## Application layers
- **Routing**: The `app/` directory uses locale-prefixed routes (middleware-driven) for calculators (`/calculators/[category]/[slug]`), standards (`/standards/[country]/[slug]`), learn articles (`/learn/[slug]`), and legacy tools (`/tools/[slug]`).
- **Data layer**: Registries in `lib/registry/loader.ts` resolve calculators, standards, and learn articles from local TypeScript definitions, JSON schemas, or future API/CMS sources. Calculator schemas in `data/calculators/*.json` become runtime definitions via `lib/calculators/schema.ts`.
- **Content localization**: Textual content lives under `locales/<locale>/...` with namespace JSON files plus per-item files (e.g., `locales/en/calculators/items/<slug>.json`). `lib/i18n/loadNamespaces.ts` merges dictionaries with an English fallback.
- **UI composition**: Page building blocks in `components/` render calculator forms, results, how-to guides, examples, FAQ, related links, navigation, and metadata widgets (hreflang, headers, footers). Shared layout lives under `components/layout`.
- **Calculation engines**: The calculator DSL supports formula-based execution (`executeFormula`) or function-based execution registered in `lib/calculations/registry`.

## Data flow
1. **Route match**: Next.js route parameters include the locale from middleware. Pages call registry helpers to fetch the requested entity (calculator, standard, article, or tool).
2. **Definition loading**: Registries load the definition by locale; calculator schemas are converted to `CalculatorDefinition` via `schemaToDefinition`, pulling translated content via `loadItemContent` with English fallback and noting the `contentLocale` for badges.
3. **Rendering**: Server components pass definitions to client components (forms, results, content blocks). Reusable blocks consume props only; no global state is required.
4. **SEO/meta**: Metadata factories attach canonical URLs, hreflang tags, and schema.org JSON-LD per page type (see `docs/SEO.md`).

## Key modules
- `lib/registry/loader.ts`: Unified loaders for calculators, standards, and learn articles with pluggable data sources.
- `lib/calculators/schema.ts`: Schema definition, validation, execution, and conversion to runtime calculator objects.
- `lib/standards/linking.ts`: Connects calculators and standards by IDs for cross-linking.
- `lib/navigation/*`: Clustering utilities that return related calculators for navigation widgets.
- `lib/search/*`: In-memory search engine that normalizes text, expands synonyms, and scores matches across calculators, standards, and learn content.
- `lib/i18n/*`: Locale utilities, namespace loader, item-content loader, translation function factory, and validation scripts.
