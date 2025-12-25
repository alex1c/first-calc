# SEO Strategy

## Metadata patterns
- **Calculators**: Provide `title`, `shortDescription`, and `seo.keywords` in item files. Pages should include structured data with calculator context and avoid compliance claims.
- **Standards hubs**: Describe the concept and related calculators without implying certification. Include `TechArticle` schema where appropriate to explain methods, not compliance.
- **Learn articles**: Supply `title`, `shortDescription`, `contentHtml`, and keywords. Articles support `Article`/`TechArticle` schema markup.
- **Legacy tools**: Keep titles/descriptions stable for inbound traffic; add engagement links to modern calculators.

## Hreflang and canonical
- Use locale-prefixed routes (`/es/...`, `/ru/...`) with `hreflang` tags from `components/hreflang-links.tsx` and helpers in `lib/hreflang.ts`.
- Canonical URLs should point to the locale-specific path; avoid duplicate content by ensuring fallback English content still references the localized URL with `contentLocale` badge.

## schema.org usage
- **Calculators**: Output JSON-LD summarizing purpose, inputs, and outputs when available. Avoid claims of compliance or certification.
- **Articles/standards**: Use `Article` or `TechArticle` schemas with author/site metadata. Standards hubs are explanatory context, not legal documents.

## Content quality (EEAT)
- Provide at least three worked examples and ten FAQ entries per calculator to demonstrate expertise.
- Use `howTo` steps for clarity; link to related calculators, standards hubs, and learn articles for authority.
- Avoid wording such as "certified" or "compliant"; describe standards as references or context hubs only.

## URL stability
- Preserve existing calculator and tool slugs; when retiring content, redirect rather than delete to maintain search equity.
- Legacy tool URLs should remain stable even if new calculator alternatives are promoted in-page.
