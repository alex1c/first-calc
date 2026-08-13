# Metadata audit

`npm run seo:metadata-check` materializes enabled calculator item metadata for every actually available locale. It checks missing and raw-slug titles/descriptions, duplicate titles, `/en/` leakage, and reports length/duplicate-description signals as warnings.

Current result: **0 errors, 15 review warnings**. Warnings are length-review candidates, mainly long construction/automotive titles and short legacy-style names. Category metadata now uses localized category names/descriptions rather than raw slugs. Full rendered-route canonical and locale mismatch crawling remains an E2E follow-up; Phase 1 canonical/fallback rules were not changed.

## Manual review of all 15 warnings

- Acceptable descriptive titles: age, car resale value, concrete mix ratio, daily calorie needs, foundation volume, lease versus buy, monthly car expenses, room area and strip foundation. Each is readable and disambiguates intent.
- Acceptable concise exact-intent titles: area, equation solver, mortgage, ROI, savings and volume.
- Duplicate/near-duplicate issues: none. Intentional legacy-title warnings: none in this set.

No metadata was rewritten solely to hit a character-count heuristic. Result remains **0 errors / 15 accepted review warnings**.
