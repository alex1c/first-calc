# Executive summary

Phase 3 establishes a product-quality foundation without changing formulas, URLs, supported locales, legacy pages, deployment, or infrastructure. The public brand is unified as **First Calc**; calculator availability now drives sitemap, homepage/hubs, search and related calculators; metadata auditing is available in CI; locale-aware number parsing/formatting has a tested foundation. No mass localization or redesign was performed.

# Product state

English remains the reference catalog. Russian remains the second full-product direction with 13 existing item-backed calculators and strong legacy utility coverage. ES/TR/HI remain supported limited modes: their shell/direct fallback experience remains usable, but localized hubs and search no longer imply a translated calculator inventory.

# Brand cleanup

`Calculator Portal` and `First-Calc` were replaced in public UI, metadata, authorship fallbacks and structured-data identity. The domain and technical identifiers remain `first-calc.com`/`first-calc`. See `BRAND_CLEANUP_REPORT.md`.

# Availability architecture

`lib/i18n/content-availability.ts` is the single calculator availability layer. Sitemap no longer duplicates filesystem logic. Homepage cards/categories, calculator hubs/category pages, search documents and related calculators consume it. Detail pages retain Phase 1 fallback canonical/noindex behavior.

# Russian localization

No unreviewed item content was generated. The existing 13 RU calculator pages remain the complete item-backed inventory. Priority A/B/C sequencing and review gates are in `RU_LOCALIZATION_ROADMAP.md`.

# ES/TR/HI state

All three locales remain enabled. With zero calculator item files, localized catalog cards/categories and locale search documents are suppressed. English fallback appears only through explicit fallback search/direct navigation and remains clearly marked/noindex where Phase 1 defined it.

# Search

Search indexes only real locale calculator items. When a non-English query has no local result, the existing explicit English fallback remains available and labelled. Canonical English result/view-all URLs omit `/en/`. Search focus is restored when the modal closes.

# Metadata

`npm run seo:metadata-check` is included in CI. Current inventory result: 0 errors and 15 non-blocking length-review warnings. Category metadata uses localized category data instead of raw slugs. See `METADATA_AUDIT_REPORT.md`.

# Internal linking

Availability-filtered hubs preserve the home → hub → category → calculator depth of three. Related calculator links are locale-available and canonical. Legacy connections remain intact. See `INTERNAL_LINK_REPORT.md`.

# Legacy SEO preservation

Numbers-to-words/chislo-propisyu, roman numerals, percentage, roots, factors, ranges and number-format URLs were not removed, redirected or restructured. Brand text changed only. Existing canonical policy and modern-equivalent relationships were preserved; three stale schema relationship IDs are reported for review rather than automatically rewritten.

# Calculator quality

The 69 enabled schema inventory is documented with domain-review queues. No formula or domain claim changed. See `CALCULATOR_QUALITY_REPORT.md`.

# Performance

Baseline remains 41.2 kB calculator route / 139 kB first load and 89.3 kB shared JS pending the final Phase 3 build. No dependency or speculative renderer split was added. See `PERFORMANCE_REPORT.md`.

# Mobile/accessibility

Search focus restoration and canonical navigation were improved. Full responsive/browser verification and focus trapping remain follow-ups. See `MOBILE_A11Y_REPORT.md`.

# Visual system

The existing logo was retained and its wordmark/accessibility label was normalized. No icons, AI art, raster bulk, or redesign was introduced. Recommended next step is approval of shared card/icon/result tokens before visual replacement. A reusable 1200×630 locale-aware OG system remains a proposal, not an unmeasured production addition.

# DE/FR/PL pilot research

No locale was launched. German is the conditional first recommendation, followed by French and Polish, based on repository fit rather than invented market metrics. See `LANGUAGE_PILOT_RESEARCH.md`.

# Tests/build

Availability, locale search, decimal comma/point parsing and number formatting have focused tests. Metadata audit is a CI check. Results: lint passes with 13 pre-existing warnings; typecheck passes; 50/50 Vitest tests pass; production build passes; two targeted rendered-HTML Playwright checks pass (RU JSON-LD and limited ES hub). The local Node 24/Windows `tsx` cleanup intermittently raises `uv_os_get_passwd ENOMEM` after i18n execution; CI uses Node 20 and remains the authoritative clean-process check.

# Remaining risks

Shared UI still contains legacy hardcoded English in large calculator/result/category branches; migrating all of it safely needs namespace ownership and representative visual tests. Full input migration requires careful `input[type=number]` UX work. Rendered metadata/link crawling, complete focus trap/inert behavior, native RU review, bundle attribution and OG implementation remain open.

# Phase 4 recommendations

Approve a native-reviewed RU Priority A cluster; approve visual token/icon direction; choose whether to fund German keyword/SERP/native research; then migrate shared UI and decimal input incrementally with browser tests.

## Do not automate without approval

DE/FR/PL launch; ES/TR/HI removal; mass RU translation; URL changes; legacy redirects/deletion; formula, standards, medical or finance claims; full redesign/logo replacement; bulk graphics generation.
