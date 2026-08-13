# Phase 2 audit

Audit date: 2026-08-13. Scope: local repository after commit `e3cae3f`; no deployment, production mutation, server, DNS, Apache, SSL, or external crawl was performed. Phase 1 fixes (robots, sitemap, canonical URL policy, content-aware hreflang, fallback noindex, HTML language, and local fonts) were verified conceptually and are not repeated below as open defects.

## Executive summary

The English product has a broad, useful calculator catalog and good page primitives, but the international product is much smaller than the locale selector suggests. English has 75 calculator item files, Russian 13, and Spanish, Turkish, and Hindi have no calculator item files. Those locales have translated shell namespaces but use English calculator content. Phase 1 correctly keeps fallback detail pages out of locale sitemaps and marks them `noindex,follow`; Phase 2 must now align hubs, search, shared UI, metadata, and visible content with that availability model.

The safest near-term strategy is to improve English quality, finish a deliberately selected Russian set, keep ES/TR/HI available as non-indexable fallback experiences where necessary, and index only market-specific pages that pass a content checklist. Do not expand languages until a keyword and localization-capacity decision is made.

## Inventory and localization coverage

Supported locales are exactly `en`, `ru`, `es`, `tr`, `hi`. Counts below use checked-in locale files and the Phase 1 production sitemap build (229 URLs). “Fully localized” is conservative: a calculator detail requires its own item JSON; a translated shell around English item content is partial/fallback.

| Language | Total pages available in UI | Fully localized calculator pages | Partial | Fallback | Indexable (Phase 1 sitemap) | Noindex / excluded | Major issues | Recommendation |
|---|---:|---:|---:|---:|---:|---:|---|---|
| English | Full catalog | 75 item files | Some legacy/standards content is template-like | 0 | 192 URLs | Dynamic numeric legacy variants | Generic metadata, uneven content depth, giant client renderer | Primary quality baseline; audit calculator-by-calculator |
| Russian | Full catalog via fallback | 13 item files | UI, homepage, legacy and some standards | Most calculator details | 28 URLs | Most fallback calculator URLs | Mixed English/Russian shared UI; terminology and rich content need native review | Develop a curated RU set around proven math/construction/legacy intent |
| Spanish | Full catalog via fallback | 0 | Shell namespaces/home metadata | All calculator details and most content | 3 URLs | All calculator details/content | English category heroes, footer, search, forms; no market content | Keep limited; do not market as a full Spanish catalog |
| Turkish | Full catalog via fallback | 0 | Shell namespaces/home metadata | All calculator details and most content | 3 URLs | All calculator details/content | Same as ES; locale-specific number/unit behavior absent | Keep limited pending demand and native capacity |
| Hindi | Full catalog via fallback | 0 | Shell namespaces/home metadata | All calculator details and most content | 3 URLs | All calculator details/content | No Hindi calculator items; English tools/content; Devanagari uses system font | Keep, but limit indexing; validate demand before developing a small curated set |

Notes: the sitemap counts include pages, categories, articles, standards, and curated legacy landings, not only calculators. “Total pages available in UI” is not presented as a precise number because fallback routing exposes the registry dynamically; treating that as localized inventory would be misleading.

## CRITICAL

No new crawl/indexation blocker equivalent to the Phase 1 robots/sitemap defects was found.

1. **International product promise and actual content availability diverge.** The global language selector exposes five languages on every route, while ES/TR/HI have zero localized calculator item pages. Phase 1 prevents duplicate indexing, but users still land on mostly English experiences. This is critical to international product quality, not a reason to remove languages automatically.
2. **Indexable locale hubs can represent content that is not actually available in that language.** `/`, `/calculators`, and `/tools` are in every locale sitemap. Homepage logic explicitly displays English fallback material for ES/TR/HI, while hub metadata can imply a complete localized product. Availability policy must extend from details to hub claims.

## HIGH

1. **Shared calculator UX is English-only.** `Calculator`, `How to Calculate`, medical disclaimer, migration notice, validation fallbacks, API errors, and several results explanations are hardcoded in client components. A translated item page can therefore still be mixed-language.
2. **Category pages contain large English-only branches.** Auto, health, everyday, construction, finance, and much standards-related prose bypass namespaces. Several links manually construct `/${locale}/...`, creating `/en/...` redirects and weakening the Phase 1 URL policy.
3. **Hub/category metadata is generic and inconsistent with locale.** `/calculators` always uses “Online Calculators”; category titles are generated from the raw slug. Titles/descriptions do not consistently reflect the visible H1 or locale and are prone to duplication.
4. **Search indexes fallback calculators as locale documents.** Search documents are built from `calculatorRegistry.getAll(locale)` and can return English fallback under localized URLs. The UI labels fallback, but it may send users to thin locale experiences and uses English modal controls/messages.
5. **Structured data lacks a shared graph/policy.** Calculator pages emit `SoftwareApplication` plus optional `FAQPage`, but no `BreadcrumbList`; JSON-LD is serialized without escaping `<`. `canonicalUrl` is unused in `FaqSchema`. Schema types and `applicationSubCategory` values need validation against actual Schema.org vocabulary and visible content.
6. **Articles are English-only.** The repository contains 56 English article entries and no localized article entries. Learn detail UI also contains hardcoded English related-content labels. Do not expose language alternates for absent articles (Phase 1 already avoids this).
7. **Standards content is uneven and market-sensitive.** Standard data includes 9 EN and 6 RU entries, while large national pages are hardcoded. Technical statements need authoritative source review; locale and jurisdiction must remain explicit.
8. **No automated metadata inventory.** There is no CI report for missing/duplicate/generic titles and descriptions across materialized routes. Static metadata inside `[locale]` legal/about pages remains English and is correctly only in the English sitemap, but localized fallback routes can still be opened.

## MEDIUM

1. Homepage hierarchy is good (search, categories, popular calculators, tools, learn, standards), but “popular” is registry-curated rather than evidence-based and fallback locales can show English cards. Emoji/category glyphs are inconsistent and some source text shows encoding artifacts in the Windows console; verify UTF-8 in rendered output before rewriting data.
2. Category pages are useful hubs, yet bespoke branches create inconsistent tone, layout, localization, and link construction. Category introductions should be data-driven and locale-available.
3. Calculator pages contain H1, short explanation, calculator, examples, FAQ, related calculators, and navigation. “How results are calculated” appears only after interaction, formula/method quality varies, related articles/standards are not consistently present, and health disclaimers are not localized.
4. Intent tags exist, but URL/H1/title alignment is inconsistent. Legacy numbers-to-words, Russian number words, Roman numerals, percentages, factors, and roots should be preserved and linked from modern equivalents; dynamic numeric variants should remain noindex.
5. Footer is entirely English. Header navigation is translated, but client-side dynamic namespace loading causes a flash of keys/English fallback and hydrates globally.
6. Number handling uses `Number(...)`; display formatting and parsing are not governed by locale. Decimal-comma input, currencies, dates, plural rules, localized units, and `Intl.NumberFormat(locale)` require a deliberate contract and tests.
7. Accessibility: forms have labels and visible focus rings, and search supports arrows/Escape. The search dialog has no accessible name, no focus trap/restore, no combobox/listbox semantics, and background scroll is not locked. Inline SVGs often lack `aria-hidden`.
8. Mobile: core forms use full width and most result tables are scroll-wrapped. Risks remain at 320px from `p-6/md:p-8`, long formulas/unbroken values, select controls, large H1 (`text-5xl` home, `text-4xl` categories), and a statistics table without an overflow wrapper near the end of the 4,553-line renderer.
9. Performance: only ~67 KB of local Inter WOFF2 is present, so Phase 1 fonts are not a weight concern. The larger risk is the 4,553-line client results component plus a 3,308-line hero component, global Header/Search hydration, per-locale dynamic JSON import, and full search documents cached in memory. No bundle analyzer evidence exists, so bundle claims should be measured before refactoring.
10. Internal linking is generally strong but not centrally validated. Related calculators use several parallel cluster/tag systems; article/standard backlinks are uneven. Generate a route graph from the enabled manifest and rendered link definitions to detect orphans and depth >3.

## LOW

1. Visual identity is functional but generic: one favicon/logo asset, mixed emoji and inline Heroicons/custom SVG, repeated gradient category heroes, and no social preview image system.
2. `FAQPage` may be valid where visible FAQs match exactly, but rich-result eligibility is limited; retain it for semantic accuracy rather than expected SERP decoration.
3. Open Graph locale uses short locale codes instead of conventional regional forms; Twitter metadata is uneven.
4. Existing lint and React `act(...)` warnings reduce signal quality.
5. “Calculator Portal” and “First-Calc” branding coexist in titles and copy.

## Content architecture and discovery

Current intended graph is sound: homepage → category → calculator, with calculators linking to related calculators and some articles/standards. Important calculators are normally reachable in two clicks. Weaknesses are fallback cards on localized hubs, parallel relation engines, and no automated orphan/depth report.

Recommended rules:

- Build hub cards from the same locale content-availability manifest used by sitemap/hreflang.
- Calculator → parent category + 3–6 intent-adjacent calculators + up to 1–3 genuinely relevant articles/standards.
- Article/standard → calculators that implement the explained method.
- Preserve legacy landing URLs and connect each to its modern equivalent without sitewide link blocks.
- Keep filtered/tag/search URLs non-canonical and out of sitemap unless a curated landing is created.

## Calculator-page content checklist

Before a page becomes indexable in a locale, require: unique localized H1/title/description; purpose statement; working calculator and result explanation; method/formula where useful; realistic example; localized labels/units; visible FAQ only when useful; breadcrumbs; relevant related content; canonical and reciprocal availability-aware hreflang; matching JSON-LD; finite/input boundary tests. Word count is not a criterion.

## Metadata recommendations

- Prefer a reviewed pattern such as `[primary task] – [useful qualifier] | First Calc`, but allow converters, estimators, and legacy queries to use intent-specific wording.
- Derive category metadata from localized category content, never raw slugs.
- Add a testable metadata manifest reporting missing, exact duplicates, locale mismatch, and review flags (roughly >60-character titles or descriptions outside roughly 70–160 characters; these are review ranges, not ranking rules).
- Keep fallback detail canonical/noindex behavior from Phase 1 unchanged.

## Structured-data recommendations

- Add `BreadcrumbList` where visible breadcrumbs exist.
- Keep `SoftwareApplication` only for functional calculator pages and ensure name/description/URL match the visible localized page.
- Add `WebSite` once at the home/root level; include SearchAction only if its URL template and search page behavior are stable.
- Use `Article` only on actual articles and `FAQPage` only for the identical visible FAQ.
- Never add ratings/reviews. Escape `<` in serialized JSON-LD and add snapshot/shape tests.

## Performance and accessibility verification gaps

No Lighthouse/CrUX or production RUM data was available, so no LCP/INP/CLS values are claimed. A Phase 3 measurement run should cover 320/360/390/430 px representative calculator pages in every content-bearing locale, keyboard-only search/form use, and production bundle analysis. Local fonts are small and eliminate the former network build dependency.

## Safe Phase 2 actions

Safe now: shared JSON-LD serialization and breadcrumbs, localized hub/category metadata from existing namespaces, URL-helper cleanup, accessible search dialog naming, mobile overflow fixes, tests, and reporting. Not safe without approval: new locales, mass translations/content, URL changes, legacy deletion, formula changes, branding or large design changes.
