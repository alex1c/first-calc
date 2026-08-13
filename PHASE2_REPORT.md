# Phase 2 report

Date: 2026-08-13. Work was local only. No deployment, push, server, DNS, Apache, or SSL change was performed.

## 1. What was found

- Phase 1 technical SEO architecture remains intact: production build emits 229 sitemap URLs; fallback calculator pages retain availability-aware canonical/hreflang/noindex behavior.
- Actual calculator localization is EN 75 item files, RU 13, ES 0, TR 0, HI 0. ES/TR/HI are translated shells with English calculator fallback, not full localized catalogs.
- Shared calculator labels/errors/disclaimers, category hero branches, footer, and search UI contain substantial English text in non-English routes.
- Calculator pages have strong core blocks, but structured data lacked breadcrumbs and JSON-LD serialization did not escape `<`.
- Hub/category metadata is generic and sometimes English/raw-slug based. Articles are English-only; standards are EN/RU and large national pages require jurisdiction/content review.
- The 4,553-line client result renderer makes calculator detail the heaviest route: 41.2 kB route code and 139 kB first-load JS versus 89.3 kB shared JS. Local fonts total only about 67 kB and are not the main performance concern.
- Mobile structure is mostly responsive, but narrow-screen padding, long results/tables, large headings, and the final unwrapped statistics table require representative browser testing.

Full findings and priorities are in `PHASE2_AUDIT.md`; language-market analysis is in `LOCALIZATION_OPPORTUNITY_REPORT.md`; asset recommendations are in `VISUAL_AUDIT.md`.

## 2. What was fixed

- Added matching `BreadcrumbList` JSON-LD to calculator pages using their visible breadcrumb data and absolute production URLs.
- Added a shared JSON-LD serializer that escapes `<`, and applied it to calculator, FAQ, and breadcrumb schema.
- Removed the unused FAQ schema canonical prop.
- Added an accessible name to the search dialog and search input.
- Reduced calculator container padding at 320–360 px and added `min-w-0` protection for nested content.
- Added a focused unit test for structured-data serialization.

No mass translations, URL changes, formula changes, content generation, or design replacement were made.

## 3. Files changed

- Reports: `PHASE2_AUDIT.md`, `LOCALIZATION_OPPORTUNITY_REPORT.md`, `VISUAL_AUDIT.md`, `PHASE2_REPORT.md`.
- Structured data: `lib/structured-data.ts`, `components/schema/breadcrumb-schema.tsx`, `components/schema/calculator-schema.tsx`, `components/schema/faq-schema.tsx`, calculator route page.
- UX/accessibility: `components/search/search-modal.tsx`, `components/calculator-page.tsx`.
- Tests: `tests/unit/structured-data.test.ts`.

## 4. SEO improvements

- Calculator structured data now includes the same breadcrumb hierarchy users see.
- Structured-data output is safer against a closing-script sequence in repository content.
- The sitemap remained at 229 URLs after changes; Phase 1 canonical/hreflang and fallback policy were not broadened or weakened.

## 5. Localization improvements

This phase intentionally did not invent translations. The primary improvement is an evidence-based inventory and an explicit selective-availability strategy. Existing fallback behavior was preserved. Mixed-language shared UI is documented as a high-priority follow-up requiring translation ownership and native review.

## 6. Remaining problems

- Translate shared calculator UI/footer/search and replace category hardcoding through existing namespaces.
- Decide whether locale hubs with almost no localized inventory should remain indexable and how they should describe availability.
- Create a metadata inventory/test and localized category metadata.
- Make search consume the content-availability manifest rather than treating fallback documents as locale content.
- Add locale-aware number/date/currency/unit formatting and decimal-comma input policy.
- Complete keyboard focus trap/restore and browser-based accessibility/mobile checks.
- Measure and then split calculator results/hero client bundles by display strategy.
- Generate an internal-link graph/orphan/depth report.
- Perform native-speaker and standards-source review; repository inspection cannot certify translation or engineering-content quality.

## 7. Recommended next languages

Priority 1 research: German, French, Polish. Priority 2: pt-BR, Italian, Dutch. This is qualitative; no search volume/CPC dataset was available, so launch decisions require keyword-tool and native SERP evidence.

## 8. Language conclusions

- **German:** strongest technical/construction and commercial fit; localization must include precise terminology and DIN/Eurocode context. Priority 1.
- **French:** broad calculator/converter opportunity with high reuse; finance and standards must be country-aware. Priority 1.
- **Polish:** promising practical/construction fit and potentially favorable competition; validate with real query data. Priority 1.
- **Hindi:** keep but limit. It currently has zero localized calculator item files. Do not remove automatically; keep fallback usable/noindex and test a small native-reviewed query cluster before development.

## 9. Proposed Phase 3

1. Approve an explicit product state for ES/TR/HI hubs and a curated RU roadmap.
2. Add an availability manifest consumed by sitemap, hreflang, hubs, search, and related links.
3. Localize shared UI through namespaces, starting with EN/RU and only approved pages.
4. Add metadata and link-graph CI audits.
5. Measure representative mobile/a11y/bundle performance; split the result renderer incrementally based on evidence.
6. Research DE/FR/PL with real keyword/SERP data and native localization capacity before creating locale code.

## 10. Decisions requiring owner approval

- Whether ES/TR/HI home/calculator/tools hubs should remain indexable with minimal inventory.
- Which 15–30 Russian calculators form the next quality cluster.
- Whether DE, FR, or PL receives a research/pilot budget first.
- Whether “First-Calc” or “Calculator Portal” is the final metadata/visual brand.
- Whether a new icon/social-card system is approved before asset production.

## Verification

- `npm.cmd run lint`: PASS with 13 pre-existing `react/no-unescaped-entities` warnings.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd run i18n:validate`: PASS.
- `npm.cmd test -- --run`: 10 files, 44 tests PASS. Existing React `act(...)` warnings remain. After the successful summary, Node 24 emitted an environment `ENOMEM` from `tsx` temporary-directory cleanup; tests themselves passed.
- `npm.cmd run build`: PASS in 108.3 seconds. Calculator detail: 41.2 kB route / 139 kB first load; shared first-load JS 89.3 kB. Existing lint and outdated Browserslist warnings remain.
- Built sitemap: 229 URLs.
- `git diff --check`: no patch errors; Windows line-ending conversion warnings only.

## DO NOT AUTOMATE WITHOUT APPROVAL

- Adding new languages.
- Removing existing languages, including Hindi.
- Mass content or translation generation.
- Changing URL structure or canonical locale policy.
- Removing or redirecting legacy pages.
- Large design changes or bulk image generation.
- Changing branding/logo/name.
- Formula or technical-standard changes without cited sources and focused tests.
