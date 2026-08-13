# Phase 4A report

## Executive summary

Phase 4A hardens infrastructure without publishing content, changing URLs, formulas, locale strategy or deployment. It removes unsafe related references, adds generated quality checks, localizes a bounded shared-UI slice, pilots decimal-comma entry on three calculators, centralizes card/result tokens and strengthens search-dialog keyboard behavior.

## Phase 3 state

Work began on `phase3/product-quality` at `7463c9c` with uncommitted Phase 3 changes. The material tree matched the Phase 3 report. `test-results/.last-run.json` has no content diff despite its Windows stat/line-ending status. Untracked `report.zip` is not a documented Phase 3 artifact and must not be committed without confirming its owner.

## Related IDs and quality manifest

`cube-root`, `exponent` and `area-rectangle` came from both square-root schemas, but only corresponded to excluded RU/legacy schema identifiers; no exact enabled canonical targets existed. They were removed. Unit and generated-audit checks now prevent recurrence. The content audit covers 69 enabled calculators and classifies domain risk; the dominant gap is calculator-owned test coverage (65 without a direct test file), not missing prose fields.

## Shared UI and decimal input

Search and shared calculator controls/cards now use owned namespaces. EN/RU search resources were added; ES/TR/HI deliberately use existing fallback. Remaining hardcoded shared result/footer strings are inventoried, while domain copy remains untouched. Decimal-comma parsing is wired only to square root, cement and mortgage forms using text + decimal input mode and submit-time parsing.

## Product UI, accessibility and OG

Card/icon/title/description/badge/focus classes and result-card classes have centralized tokens while retaining current appearance. Search now traps focus, locks background scrolling, makes the background inert, closes on Escape and restores focus. OG is architecture-only for now: a future `next/og` 1200×630 route can render First Calc, localized title and category with local fonts; implementation was deferred to avoid unmeasured runtime/metadata complexity.

## Metadata, RU and DE

All 15 length warnings were reviewed and accepted for readability/search intent; no character-count rewrite was made. A seven-page RU Priority A proposal is documented but unpublished. German remains a research candidate pending DE/AT/CH demand, SERP, terminology, reviewer and monetization evidence; no locale code or hreflang was added.

## Validation and remaining risks

Local runtime is Node 24.14.0; Node 20 is unavailable locally, while CI explicitly uses Node 20. Node 24 validation results and the known intermittent Windows `uv_os_get_passwd ENOMEM` must remain separately documented; it is an environment/runtime symptom, not suppressed repository output. Authoritative Node 20 confirmation therefore requires CI. Remaining risks are broad numeric-form migration, direct calculator test ownership, full mobile visual regression, remaining shared result/footer strings, and native/domain review for future localized content.

Local results: lint completed with 13 pre-existing apostrophe warnings; typecheck passed; i18n validation passed; metadata audit passed at 0 errors/15 accepted warnings; calculator audit passed; Vitest passed 54/54; production build completed. After the successful build, Node 24 emitted the known tsx cleanup ENOMEM error while the command retained exit 0. Playwright exposed and fixed an invalid `next start` webServer command for standalone output, but its browser workers still failed immediately and the runner timed out in this Windows environment; two request/HTML SEO cases passed. The connected browser service also reported no available backend, so a visual matrix is not claimed.

No deployment, push, merge, server change, locale launch, mass translation, formula change or legacy URL change was performed.
