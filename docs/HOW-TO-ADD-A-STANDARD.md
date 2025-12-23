# How to Add a Standard Hub

## Principles
Standards pages are conceptual hubs, not compliance attestations. They should explain the context and link to calculators and learn articles without claiming certification or legal validity.

## Required sections
- **Title and overview**: What the standard covers and where it applies.
- **Short and long description**: Clear, plain-language summaries.
- **Key topics**: Bullet points for main themes or sub-standards.
- **Related calculators**: IDs for calculators that implement related concepts (not compliance).
- **Related learn articles**: Optional contextual reading.
- **Disclaimers**: Explicitly note that pages are informational only and not a substitute for official documents.

## Steps
1. **Create definition**: Add a standard entry to `data/standards.ts` with `id`, `country` (`EU`, `ISO`, or national code), `slug`, `title`, descriptions, `relatedCalculatorIds`, `relatedArticleIds`, and metadata. Avoid language implying conformity.
2. **Add content**: Create `locales/en/standards/items/<slug>.json` with the sections above plus `seo.keywords`.
3. **Localize**: Copy the item file into `locales/<locale>/standards/items/` for ru/es/tr/hi and translate values.
4. **Linking**: Use `standardIds` on calculators to connect them to the hub. `lib/standards/linking.ts` resolves cross-links for UI blocks.
5. **Schema**: When adding metadata, prefer `TechArticle` JSON-LD; avoid "certified"/"compliant" phrases.
6. **Validate**: Run `npm run i18n:validate`, `npm run lint`, and `npm run build` before merging.

## Writing guidance
- Use neutral wording like "based on concepts from" rather than "calculated per".
- Keep URLs stable; if a hub is renamed, add redirects instead of deleting the old slug.
- Include calls-to-action pointing to calculators and learn articles to encourage exploration.
