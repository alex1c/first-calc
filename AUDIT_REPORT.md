# Executive summary

Audit date: 2026-08-12. Scope: current local working tree of `first-calc.com`; no production crawl or deployment was performed. The repository is a working Next.js App Router application with a substantial schema-driven calculator catalog, test coverage around core paths, and useful internal-link/content machinery. Unit/component/API tests pass (43/43), and ESLint has warnings only.

The project is **not ready for reliable production indexing in its current checked-out configuration**. Both robots implementations block every crawler, Docker Compose still identifies the deployment as test, sitemap contains only five home URLs, and locale alternates are emitted for translations that generally do not exist. Localization fallback makes most non-English calculator pages English while retaining localized URLs. Typecheck is failing, build is externally network-dependent, metadata behavior is inconsistent, and several public page families are absent from sitemap.

No mass refactor, translation rewrite, design change, dependency upgrade, calculator deletion, push, or deployment was made. The only created files are this report and `AGENTS.md`.

## Confirmed project inventory

| Area | Confirmed implementation |
|---|---|
| Framework | Next.js 14.2.33 (lockfile), React/React DOM 18.3.1 |
| Router | App Router only; `app/[locale]` plus route groups `(main)`, `(legacy)`, `(marketing)`; middleware hides `/en` |
| Language/style | TypeScript with `strict: true`, `allowJs: true`; Tailwind CSS 3.4.x; small JS config surface |
| Package manager | npm, lockfile v3; existing `node_modules`; local runtime used Node 24.14.0 while Docker uses Node 18 and CI Node 20 |
| Main libraries | Next/React, Heroicons; Vitest, Testing Library, Happy DOM, MSW, Playwright; Jest config is stale/unwired |
| Data | `data/calculators.ts`, 84 calculator JSON files, 83 calculation modules, standards/articles TS data, locale JSON |
| Calculator architecture | JSON schema -> loader/validator -> localized item content -> registered function or formula engine -> shared client form/results; hardcoded TS definitions take precedence |
| APIs | `GET /api/calculators`, `GET /api/calculators/[id]`, `POST /api/calculators/[id]/calculate`, `GET /api/search` |
| Environment | `NEXT_PUBLIC_DATA_SOURCE`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_ENV`, Telegram contact/bot variables, `NODE_ENV`, `CI` |
| Build/deploy | `output: standalone`; three-stage Node 18 Alpine Dockerfile; Compose maps 3003->3000; GitHub Actions CI then SSH/Docker deployment |
| Tests/lint | Vitest is active; Playwright E2E; Next ESLint Core Web Vitals; no working package typecheck script |
| Analytics/external | No GA4/GTM, Search Console verification, Yandex Metrica, or other analytics found. Telegram sharing/contact and social share URLs exist. Google Fonts is fetched at build time. |

# Critical issues

1. **Production crawling is blocked twice.** `app/robots.ts` returns `Disallow: /`; `public/robots.txt` also contains `Disallow: /`. The duplicate ownership is itself ambiguous. Priority Critical, effort XS, risk Low, impact: restores crawlability.
2. **Deployment configuration still forces test mode.** `docker-compose.yml` sets `NEXT_PUBLIC_BASE_URL=https://test.first-calc.com` and `NEXT_PUBLIC_ENV=test`. Root metadata consequently sets `noindex,nofollow`, and sitemap returns empty. Priority Critical, effort XS/S, risk Medium, impact: allows indexing on the production container.
3. **Sitemap is materially incomplete.** It emits only five locale homepages, omitting calculators, categories, learn, standards, tools, legacy utilities, and legal/marketing routes. Priority Critical, effort M, risk Medium, impact: discovery/index coverage.
4. **hreflang asserts non-existent translations.** Calculator pages emit all five alternates even when item content falls back to English. This produces localized URLs with substantially identical English content and misleading language signals. Priority Critical, effort M/L, risk Medium, impact: avoids duplicate/incorrect international targeting.
5. **Locale HTML and switching are wrong.** Root `<html lang="en">` never reflects locale. From an English unprefixed page such as `/calculators/math/x`, the language switch removes `calculators` as if it were a locale; navigation also generates `/en/...` then relies on a redirect. Priority Critical, effort S, risk Medium, impact: accessibility, crawl consistency, and retention.

# High priority

- Production build cannot be reproduced offline because `next/font/google` downloads Inter. The observed build failure was `EACCES` fetching Google Fonts; self-host or bundle the font.
- `npx tsc --noEmit` fails: Vitest globals are not included for tests under `lib/**/__tests__`, and three fixtures/imports are stale (`calculate`, example `outputs`, `CalculatorSchema` import). CI has no explicit typecheck; Next build would typecheck only after compilation.
- English URL normalization is inconsistent across metadata: many legacy canonicals are `/${locale}/...`, including `/en/...`, while middleware permanently redirects `/en` away. Relative canonicals are used without `metadataBase`.
- `lib/hreflang.ts` falls back to obsolete `https://calculator-portal.com`; site URL ownership is split among environment reads and hardcoded `https://first-calc.com` strings.
- There is no evidence of origin-level redirects/headers for HTTP->HTTPS, www->non-www, old test host->production, or security headers in Next config. Apache test-host configuration remains in the repository; server behavior must be verified separately.
- Formula execution uses `eval` in `lib/calculators/schema.ts` and `lib/content/autogen.ts`. Current formulas appear repository-controlled, but future API/CMS configuration would turn this into code execution risk.
- Article HTML is rendered with unsanitized `dangerouslySetInnerHTML`. Current articles are local trusted TS data; any future CMS/admin write path requires sanitization and schema constraints.
- `/admin/calculators` is a public client route with no authentication. It currently logs a schema rather than persisting, but exposes internal catalog tooling and should be protected or excluded from production/indexing.
- The CI lint step is `npm run lint || true`, so regressions cannot fail CI. Node versions differ among local/Docker/CI and `package.json` has no `engines` contract.

# Medium priority

- Shared result and hero components are extreme hotspots: `calculator-results.tsx` is 4,553 lines and `calculator-hero.tsx` 3,308 lines; calculator-specific conditions impair maintainability and bundle review.
- Registry code repeatedly scans/parses every JSON file per request and swallows load failures. There are two sources of calculator truth (hardcoded TS and JSON) with precedence rules that can hide divergence.
- Twenty-five client components were found. Global Header and SearchProvider hydrate on every page; this may be justified for search/navigation but should be measured and narrowed after bundle data exists.
- Footer copy and links are entirely English and links drop the active locale. Calculator submit and select fallback text are hardcoded English. Many large standards pages contain hardcoded English/Russian prose.
- Metadata coverage is uneven: root metadata is generic, some static pages export non-locale-aware metadata, Twitter cards are missing from newer calculator pages, OG locale values use short codes rather than OG locale notation, and no `metadataBase` is defined.
- Search results/API accept an asserted locale without validating membership; search limit lacks clear bounds. Public calculation APIs have no throttling or body-size controls.
- No explicit cache/revalidation strategy or `generateStaticParams` was found. Dynamic filesystem scans may prevent predictable SSG at catalog scale.
- README contains mojibake and says Jest although package scripts use Vitest. Locale display names also appeared mojibaked in terminal output and should be verified as file encoding, not blindly rewritten.

# Low priority

- ESLint reports 13 unescaped-apostrophe warnings.
- Vitest reports React `act(...)` warnings; tests pass but can mask timing problems.
- Client example components contain production `console.log` statements.
- Only one graphic asset exists (`app/icon.svg`); no raster bloat was found. Social preview images and richer empty-state graphics are absent, but should follow SEO/UX fixes.
- Docker Compose `version: '3.8'` is obsolete in newer Compose implementations; harmless.

# Architecture

The config-driven calculator direction is appropriate and should be preserved. Adding a calculator is reasonably systematic: schema, calculation function/registry, localized content, tests, and navigation tags. The main scalability risks are duplicate sources (`data/calculators.ts` versus JSON), filesystem scans in request paths, silent catches, and giant conditional UI renderers.

| Proposal | Importance | Risk | Effort | Expected benefit |
|---|---|---|---|---|
| Establish one generated catalog manifest from enabled schemas | High | Medium | M | One source for routes, sitemap, metadata, search, related links |
| Keep function registry but validate every schema/function ID in CI | High | Low | S/M | Finds broken calculators before deploy |
| Split result/hero branches by output/display strategy incrementally | Medium | Medium | L | Smaller review surface and safer additions |
| Cache/load catalog once per server build/process | Medium | Low | S/M | Avoid repeated directory scans and improve predictable rendering |
| Replace silent loader catches with structured build validation | High | Low | S | Prevents hidden missing/broken content |
| Retire hardcoded definitions only after parity tests | Medium | Medium | L | Removes dual truth without risky rewrite |

No architectural rewrite is recommended before Phase 1 and localization policy decisions.

# Localization

Supported locales confirmed in `lib/i18n.ts`: `en`, `ru`, `es`, `tr`, `hi`; default `en`. Namespace loading and item loading explicitly fall back to English. Coverage below compares every leaf key plus array element at the same relative JSON file/key path against English. This strict content coverage is more useful than the current validator, which checks only `common`, `navigation`, and `errors` and exits successfully even with warnings.

| Language | English baseline keys | Present | Missing | Extra | Filled |
|---|---:|---:|---:|---:|---:|
| English (`en`) | 11,243 | 11,243 | 0 | 0 | 100.00% |
| Russian (`ru`) | 11,243 | 781 | 10,462 | 296 | 6.95% |
| Spanish (`es`) | 11,243 | 137 | 11,106 | 0 | 1.22% |
| Turkish (`tr`) | 11,243 | 137 | 11,106 | 0 | 1.22% |
| Hindi (`hi`) | 11,243 | 137 | 11,106 | 0 | 1.22% |

Interpretation: `es/tr/hi` contain only seven JSON files each and lack 82 of 87 English JSON files; Russian has 24 files and lacks 73. Arrays in rich calculator content increase the strict key total, but file absence alone confirms the gap. Russian's 296 extras require reconciliation rather than deletion.

Additional findings:

- Fallback is disclosed on calculator pages, but metadata/hreflang still claims the requested language.
- `html lang`, OG locale, locale-aware canonical policy, and language switch need one shared locale URL helper.
- Footer, form actions/errors, legal copy, standards pages, and several navigation labels are hardcoded.
- Number fields parse browser input with `parseFloat` and calculation formatting is mostly generic; there is no systematic `Intl.NumberFormat(locale)` contract, localized decimal-comma paste handling, currency/date/unit localization, or plural-rule layer.
- All supported scripts are LTR, so RTL is not currently required.
- Automated detection of machine-quality prose cannot prove semantic quality. Manual native-speaker review is required, starting with Russian extras and all translated SEO titles/descriptions. Obvious contextual issue: non-English pages intentionally show complete English item content, which is more severe than stylistic translation quality.

# SEO

## Technical and metadata

- The blocking robots/test-mode combination is the primary indexation failure.
- Middleware establishes no-prefix English URLs, but numerous legacy canonical/language links include `/en`, creating redirecting canonicals.
- `metadataBase` is absent. Relative canonical URLs therefore lack a reliable global resolution base.
- Root title/description (`Calculator Portal`, generic description) are weak. Several legal pages use static metadata inside `[locale]`, so localization is not derived from params.
- Dynamic calculators have title/description/canonical/OG but no Twitter card and OG uses fallback calculator copy rather than consistently localized SEO copy.
- Alternates are generated by route template, not content availability. `x-default` is absent; adding it is reasonable only after English/no-prefix policy is centralized.
- Duplicate and length analysis cannot be considered complete until every resolved page metadata object is materialized. A CI manifest should report empty, duplicate, title >~60, and description outside ~70–160 characters as review signals, not hard search-engine rules.
- No online HTTP status, redirect-chain, soft-404, or header validation was possible from this local-only audit. These require a production crawl in Phase 1.

## Structured data

Calculator, FAQ, Article, Standard, and some WebSite/WebPage-like JSON-LD already exist. JSON serialization from trusted objects is generally appropriate; escape `<` in serialized JSON-LD as defense in depth. `FAQPage` should only remain where the visible FAQ is identical and genuinely useful; do not expect FAQ rich results for a general calculator site. Add a shared `BreadcrumbList` because visible breadcrumbs exist. `Organization` is optional and should wait for real organization/contact identity. `WebApplication` is reasonable for calculator pages only if its fields accurately describe the page.

## Content and internal linking

Calculator pages have strong building blocks: H1 hero, form, explanations, examples, FAQs, related calculators/articles, category navigation, and breadcrumbs. Quality varies by schema and locale. Primary risks are fallback-English duplicate pages, auto-generated/template-like sections, giant hardcoded display branches, and thin untranslated locales. Category, cluster, tag, legacy discovery, related-calculator, and breadcrumb systems provide a good basis.

Recommended linking model: home -> category hubs -> calculator; calculator -> parent category + 3–6 intent-adjacent calculators + at most 1–3 genuinely relevant articles/standards; article/standard -> calculators that operationalize the concept. Generate an orphan/depth report from the enabled manifest and rendered links. Keep important pages within three clicks; do not create indiscriminate sitewide link blocks.

# Sitemap / Robots / Canonical / Hreflang

Production-grade design:

1. One `siteUrl` config validates an absolute HTTPS origin and defaults to `https://first-calc.com` only in production-safe code.
2. One enabled-content route manifest drives navigation, search, metadata alternates, and sitemap.
3. Emit only canonical, 200, indexable URLs. Exclude `/admin`, `/api`, search-result URLs, test/disabled content, arbitrary numeric generated routes, and pages whose locale is only fallback unless product deliberately indexes them.
4. Include home, hubs, categories, enabled calculators, curated legacy landing pages, learn, standards, and public legal/marketing pages. Use real content modification dates; omit `lastModified` rather than emitting build time for every URL.
5. A sitemap index is unnecessary below 50,000 URLs/50 MB, but design segmented sitemap functions (`pages`, `calculators`, `content`) now because numeric legacy routes can explode cardinality. Never enumerate unbounded number/range permutations.
6. Each hreflang cluster must be reciprocal, self-referential, canonical, and limited to existing translated content. Use `en`, `ru`, `es`, `tr`, `hi`; add `x-default` pointing to the English canonical after policy confirmation.
7. Maintain exactly one robots implementation. Production recommendation: allow `/`, disallow only non-content areas such as `/admin/` and optionally API endpoints, and declare `Sitemap: https://first-calc.com/sitemap.xml`. Test deployments should block via authenticated access and `X-Robots-Tag: noindex`, not a production-committed static collision.

# Performance

Measured bundle sizes were unavailable because build stopped on Google Fonts. Real concerns:

- Build-time network dependency for Inter is confirmed.
- Global Header/SearchProvider hydration and 25 client modules add baseline JS; measure before changing.
- Two 3k–4.5k-line shared calculator components likely bundle many calculator-specific branches into clients; inspect route chunks after build.
- Registry filesystem scanning/parsing should be cached/generated.
- There are no content images beyond the SVG icon, so `next/image`, image LCP, and lazy-loading are not current bottlenecks.
- Next font handling would normally prevent layout shift once made local. Reserve dimensions for any future images/social widgets.
- Prioritize LCP server-rendered hero, stable result/form layout for CLS, and low-cost input handlers for INP. Obtain Lighthouse/Web Vitals field data before speculative dynamic imports.

# UX / Mobile

- Header has no mobile navigation: primary nav is `hidden md:flex`; mobile exposes only search and language selector.
- Language selector lacks an accessible label and has broken path preservation for no-prefix English routes.
- Form controls are full-width with reasonable 44px-ish submit target, but checkbox is only 16x16 and needs a larger clickable label area.
- Very large result tables/branches need representative viewport testing; results table components are an overflow risk, although Tailwind responsive utilities exist in places.
- Long translated labels are untested because most locales fall back to English.
- Footer is responsive but always English and drops locale, causing language resets.
- No image-induced layout shifts were found. Date defaults based on local current time can cause SSR/client differences if ever computed across the boundary; current form is client-only.

# Accessibility

Critical/high:

- Correct page language dynamically; current `lang="en"` harms screen-reader pronunciation on Russian/Hindi pages.
- Label the language selector; expose validation errors with `aria-invalid`, `aria-describedby`, and an announced error summary/live region.
- Provide keyboard-operable mobile primary navigation.

Medium/low:

- Inputs generally have `<label htmlFor>` and visible focus styles, which is good.
- Increase checkbox/touch target; ensure accordion states expose `aria-expanded`/relationships across duplicate FAQ implementations.
- Review heading hierarchy and table captions/headers across large standards/results components.
- SVG logo/icon should have a clear accessible-name strategy; decorative inline SVGs should be hidden.
- Automated contrast tooling was not run; slate/gray combinations need browser-based WCAG verification.

# Calculator correctness risks

- Shared validation rejects non-finite numeric input and checks configured min/max. Formula execution also rejects non-finite final results: good baseline safeguards.
- Browser numeric input uses `parseFloat`, so comma decimals and pasted localized numbers are not supported consistently.
- `eval` formulas are trusted-code only and schema validation does not constitute a safe parser.
- Bounds are only effective when each schema specifies them; a catalog-wide invariant test is needed for required, negative, zero divisor, extreme magnitude, and empty cases.
- Floating-point/rounding policy is distributed among calculation and formatting code; finance calculators need focused decimal/rounding review.
- The API catches calculation failures but returns raw error messages, which may expose implementation detail.
- 43 passing tests do not cover 84 schemas/83 calculation modules. Add table-driven smoke/property cases for every enabled calculator and compare examples to actual results.
- Do not alter any formula until source references and boundary tests are recorded. Flag engineering, health, finance, date/timezone, and unit-conversion calculators for domain review first.

# Security

- `npm audit --omit=dev --offline` reported 0 known production vulnerabilities from available local advisory data; this is not equivalent to a fresh online audit.
- No tracked `.env` file or obvious private key/API token pattern was found. `GITHUB_SECRETS_SETUP.md` matched the word `secret` as documentation only; no value is reported here.
- `eval`, unsanitized article HTML, public admin route, absent rate limiting/body limits, and lack of explicit security headers are the main risks.
- Add CSP only after inventorying inline JSON-LD and Next scripts; use nonces/hashes rather than a breaking blanket policy. Add HSTS at the HTTPS reverse proxy, `X-Content-Type-Options`, suitable `Referrer-Policy`, frame protection, and restrictive permissions policy.
- External Telegram/social links use expected HTTPS patterns; visible Telegram link uses `noopener noreferrer`.

# Graphics / visual quality

| Page/component | Problem | Recommendation |
|---|---|---|
| `app/icon.svg` / favicon | Only confirmed branded asset; favicon quality at multiple sizes not verified | Test 16/32/180/192/512 contexts; add generated manifest icons only after brand approval |
| `components/logo.tsx` | Inline logo must remain consistent with favicon and accessible naming | Define one small tokenized SVG mark/wordmark system; preserve CSS/SVG implementation |
| Calculator/category cards | Visual system exists but giant special-case hero/result components risk drift | Document spacing, icon size, result emphasis, and state tokens; refactor incrementally |
| Search/empty/error states | Mostly text/UI, little visual differentiation | Prefer lightweight Heroicons/CSS status marks; avoid decorative illustrations |
| Social sharing metadata | No dedicated OG image system found | Create a template-generated 1200x630 card per locale/category after metadata fixes |
| Mobile header | Missing navigation is a functional visual gap | Add compact menu with clear focus/touch states |

Graphics would add real value for category recognition, formula diagrams in geometry/engineering, and OG cards. Generic stock imagery would be decorative noise. No mass asset replacement is recommended.

# Analytics

No GA4/GTM, Search Console verification, Yandex Metrica, or duplicate counters were found. Before implementation, choose a privacy/consent policy and one analytics owner. Proposed events (without values containing personal/free-form input): `calculator_started`, `calculator_result`, `language_changed`, `related_calculator_clicked`, `site_search` (prefer query category/length, not raw query). Include calculator id/category/locale, validation outcome, and source placement. Search Console verification should use a deployment-managed method.

# Technical debt

- Dual calculator sources and duplicate UI/content components (`faq-block`, `examples-block`, `how-to-block` variants).
- Giant conditional components and hardcoded page families.
- Stale Jest configuration/docs versus Vitest reality.
- Passing i18n validation that hides severe item coverage gaps.
- CI lint is non-blocking and typecheck is absent.
- Hardcoded origins, locale lists, metadata patterns, and route builders.
- Mojibake in documentation/comments/output suggests an encoding hygiene issue.
- Deployment workflow uses root SSH and destructive `git reset --hard` on server; functional but high operational blast radius.

# Recommended roadmap

## Phase 1 — Production/SEO blockers

| Task | Priority | Effort | Risk | Expected impact |
|---|---|---|---|---|
| Fix single production robots owner and remove global block | Critical | XS | Low | Enables crawling |
| Remove test domain/env from production Compose; validate deployment env | Critical | S | Medium | Removes noindex/empty sitemap behavior |
| Centralize site URL and English no-prefix route helper | Critical | S | Medium | Correct canonicals and redirects |
| Generate complete manifest-driven sitemap | Critical | M | Medium | Discovers all indexable content |
| Make hreflang content-aware and reciprocal | Critical | M | Medium | Correct international signals |
| Fix dynamic `<html lang>` and locale switch | Critical | S | Medium | UX/accessibility/SEO |
| Add production crawl for status/canonical/redirect/robots | High | M | Low | Verifies actual server behavior |
| Make font local and restore reproducible build | High | S | Low | Reliable CI/deploy and LCP |
| Add explicit typecheck and make lint blocking | High | S | Low | Prevents regression |

## Phase 2 — Localization

| Task | Priority | Effort | Risk | Expected impact |
|---|---|---|---|---|
| Define index/fallback policy per locale | Critical | S | Medium | Avoids English duplicates under localized URLs |
| Upgrade validator to full key/file/content report | High | M | Low | Measurable translation quality |
| Localize global header/footer/forms/errors first | High | M | Low | Removes mixed-language chrome |
| Translate calculators by traffic/topic batches with review | High | XL | Medium | International organic growth |
| Add Intl number/date/currency/unit/plural helpers | High | L | Medium | Correct locale behavior |

## Phase 3 — Architecture/refactoring

| Task | Priority | Effort | Risk | Expected impact |
|---|---|---|---|---|
| Generate unified enabled-content manifest | High | M | Medium | One source for routes/SEO/search |
| Add schema/calculation invariant test for all calculators | High | M | Low | Correctness and safer growth |
| Cache catalog loading and surface parse failures | Medium | M | Low | Performance/reliability |
| Incrementally split hero/result strategies | Medium | L | Medium | Maintainability/bundle control |
| Plan hardcoded-source retirement with parity tests | Medium | L | Medium | Removes duplicate truth |

## Phase 4 — UX/performance

| Task | Priority | Effort | Risk | Expected impact |
|---|---|---|---|---|
| Add accessible mobile navigation and locale control | High | M | Low | Mobile usability |
| Add form error announcements and touch-target fixes | High | S | Low | Accessibility/conversion |
| Obtain bundle/Lighthouse/Web Vitals baselines | High | S/M | Low | Evidence-based optimization |
| Audit large result tables at representative breakpoints | Medium | M | Low | Prevents mobile overflow |
| Reduce global/client JS based on route chunk data | Medium | M/L | Medium | LCP/INP |

## Phase 5 — Content and growth

| Task | Priority | Effort | Risk | Expected impact |
|---|---|---|---|---|
| Build metadata uniqueness/length/content audit in CI | High | M | Low | Better snippets and QA |
| Generate orphan/depth/internal-link graph | High | M | Low | Crawlability and topical clusters |
| Domain-review high-stakes formulas/content | High | L | Low | Trust/correctness |
| Improve thin pages with useful examples/formulas, not filler | Medium | XL | Medium | Search usefulness |
| Implement privacy-aware analytics events | Medium | M | Low | Product/growth feedback |

## Phase 6 — Graphics/polish

| Task | Priority | Effort | Risk | Expected impact |
|---|---|---|---|---|
| Verify/extend favicon and app icon set | Medium | S | Low | Brand consistency |
| Create reusable localized OG card template | Medium | M | Low | Better social previews |
| Standardize card/icon/result visual tokens | Medium | M | Low | UI consistency |
| Add only instructional diagrams with clear UX value | Low | L | Low | Comprehension |

## Top 20 recommended actions

1. Remove the production `Disallow: /` collision and verify served `/robots.txt`.
2. Change production Docker environment away from `test.first-calc.com` and `NEXT_PUBLIC_ENV=test`.
3. Verify production response has no meta/header `noindex`.
4. Generate a complete sitemap from enabled content.
5. Centralize `siteUrl` and locale route construction.
6. Fix `/en` canonical/hreflang URLs to the no-prefix English canonical.
7. Emit hreflang only for genuinely available localized content.
8. Make document language locale-aware.
9. Repair locale switching and locale-preserving global links.
10. Run an authenticated production crawl covering statuses, redirects, canonicals, robots, hreflang, and orphan pages.
11. Self-host Inter so production builds do not require Google Fonts network access.
12. Fix current TypeScript errors and add a blocking `typecheck` CI step.
13. Make ESLint blocking in CI.
14. Replace/strictly sandbox `eval` before accepting remote/CMS schemas.
15. Define the non-English fallback/indexing policy before further translation work.
16. Localize global chrome and validation messages.
17. Add a full catalog schema/function/boundary smoke test.
18. Generate one catalog manifest for sitemap/search/navigation/metadata.
19. Protect or remove the production admin route and add baseline security headers/rate limits.
20. Measure bundles/Core Web Vitals, then split the 4,553/3,308-line client hotspots based on evidence.

## Verification record

Commands executed (PowerShell script-policy equivalents used where needed):

- `git status --short --branch`, directory/file inventory with `Get-ChildItem` and `rg --files`.
- Read-only configuration/source searches with `Get-Content`, `rg`, Node scripts, and file/line counts.
- `npm.cmd run i18n:validate` — exited 0, but its output was affected once by a Node 24 `uv_os_get_passwd ENOMEM` after completion; strict independent coverage is reported above.
- `npm.cmd run lint` — exited 0 with 13 warnings.
- `npx.cmd tsc --noEmit` — failed with test-global and stale test-type errors.
- `npm.cmd test -- --run` — 9 files, 43 tests passed; React `act` warnings and Vite CJS deprecation warning.
- `npm.cmd run build` — failed during Google Inter fetch (`EACCES` in restricted network), before application compile/typecheck completion.
- `npm.cmd audit --omit=dev --offline` — 0 known production vulnerabilities in local/offline advisory data.

Not run: `npm ci` (lockfile and populated `node_modules` already existed; reinstall was unnecessary), E2E (its web server requires the failed production build), Docker build, production HTTP crawl, Lighthouse, visual browser/accessibility automation, push/deploy.

Files created: `AGENTS.md`, `AUDIT_REPORT.md`. No existing source/config file was intentionally changed by this audit. The repository was already dirty before work; those user changes were preserved.
