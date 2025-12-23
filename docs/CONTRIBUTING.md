# Contributing

## Getting started
1. Install dependencies: `npm install`.
2. Skim `docs/README.md` to see where deeper docs live.
3. Run the dev server: `npm run dev` (Next.js at http://localhost:3000).
4. Use `npm test` for Jest suites when needed.

## Development workflow
- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **i18n validation**: `npm run i18n:validate`
- **Generator**: `npm run generate:calc` scaffolds a calculator schema.
- **Commit style**: Keep commits focused; documentation-only changes should not alter runtime behavior.

## Pull requests
- Base branch: main.
- Include a summary of changes plus testing commands/results.
- Do not change existing i18n keys; add new ones only when necessary and update all locales.
- Avoid claims about standards compliance or legal guarantees.

## Adding content
- Follow guides:
  - `docs/HOW-TO-ADD-A-CALCULATOR.md`
  - `docs/HOW-TO-ADD-A-STANDARD.md`
  - `docs/HOW-TO-ADD-A-LEARN-ARTICLE.md`

## Coding guidelines
- Prefer TypeScript types and narrow props for shared components.
- Keep calculation logic unchanged unless explicitly requested.
- Use TSDoc/JSDoc for loaders, schema helpers, and shared UI blocks to clarify intent without duplicating code.
