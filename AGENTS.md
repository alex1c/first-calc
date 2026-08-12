# First Calc project guide

## Stack and commands

- Next.js 14.2.33 App Router, React/React DOM 18.3.1, TypeScript (`strict`, `noEmit`), Tailwind CSS 3; npm with `package-lock.json`.
- Install reproducibly: `npm ci`. Development: `npm run dev`. Production: `npm run build`, then `npm start`.
- Checks: `npm run lint`, `npx tsc --noEmit`, `npm run i18n:validate`, `npm test -- --run`, and `npm run test:e2e` after a successful build.
- On Windows PowerShell with restricted script execution, use `npm.cmd`/`npx.cmd`.

## Architecture

- Routes live in `app/`; localized public routes are under `app/[locale]`, with `(main)`, `(legacy)`, and `(marketing)` route groups. English public URLs omit `/en`; `middleware.ts` rewrites them internally.
- Calculator schemas live in `data/calculators/*.json`, calculation functions in `lib/calculations`, loaders/validation in `lib/calculators`, and the aggregate registry in `lib/registry/loader.ts`. Older TypeScript definitions in `data/calculators.ts` have precedence.
- API handlers are under `app/api`; shared UI is under `components`; standards/articles are in `data` plus their respective `lib` modules.
- Keep UI, calculation logic, localized content, and registry data separate. Do not add calculator-specific branches to large shared renderers when a schema/registry extension is sufficient.

## Localization and URLs

- Supported locales are exactly `en`, `ru`, `es`, `tr`, `hi`; English is the default.
- Namespace JSON is in `locales/<locale>/`; calculator copy is in `locales/<locale>/calculators/items/<slug>.json`. English fallback is intentional but should be visible and must not masquerade as translated content.
- New or changed user-facing text must use the existing namespace/item system. Validate key parity with `npm run i18n:validate` and check long translations on mobile.
- Production origin is `https://first-calc.com`. Never use `test.first-calc.com`, localhost, or placeholder domains in production metadata, canonical, hreflang, sitemap, robots, or deployment environment.
- English canonical URLs have no `/en`; other locales use `/<locale>`. Locale switching and internal links must preserve this rule.

## SEO and calculator requirements

- Every indexable route needs a unique localized title/description, self-canonical, valid reciprocal language alternates only for pages that exist in that language, one H1, meaningful content, and useful internal links.
- Sitemap and robots must be generated from the same enabled content registries and environment-aware site URL. Never ship production with `Disallow: /` or `noindex`.
- A new calculator needs a unique id/category/slug, enabled schema, registered/tested calculation engine, localized English item content, validation bounds, finite-number handling, examples, useful explanation, metadata, and related links/tags.
- Guard empty, invalid, negative (where invalid), zero-divisor, overflow, `NaN`, and `Infinity` inputs. Do not change formulas without a cited source or focused tests.

## Change discipline

- Preserve unrelated working-tree changes. Do not mass-refactor, mass-translate, update major dependencies, delete calculators, push, or deploy without explicit approval.
- Before handoff, run the checks proportional to the change and report failures separately from environment/network limitations.
- Treat schema formula strings and HTML content as trusted-only inputs until `eval` and unsanitized HTML paths are replaced or constrained.
