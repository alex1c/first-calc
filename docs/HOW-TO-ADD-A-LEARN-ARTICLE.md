# How to Add a Learn Article

## Principles
Learn articles explain concepts that support calculators and standards hubs. They should be educational and neutral, avoiding compliance or legal claims.

## Structure
- **Title and shortDescription**: Concise summary for listings and SEO.
- **contentHtml**: Rich HTML body with headings, lists, and links to calculators/standards.
- **FAQ** (optional): If included, ensure answers align with calculator behavior.
- **Metadata**: Keywords and canonical URL if needed.

## Steps
1. **Create definition**: Add an article entry to `data/learn.ts` (or relevant data source) with `id`, `slug`, `title`, `shortDescription`, `contentHtml`, `meta`, and locale.
2. **Add content file**: Create `locales/en/learn/items/<slug>.json` with the fields above. Include links to calculators and standards where relevant.
3. **Localize**: Copy the English item file to `locales/<locale>/learn/items/` and translate values. Preserve HTML structure.
4. **SEO schema**: Use `Article` or `TechArticle` JSON-LD; avoid claims of compliance or legal authority.
5. **Validate and test**: Run `npm run i18n:validate`, `npm run lint`, and `npm run build`.

## Writing guidance
- Introduce the problem, explain formulas, and show how calculators can be applied.
- Add at least one link to a related calculator and one to a standards hub when applicable.
- Keep tone instructional; avoid promising official or certified outputs.
