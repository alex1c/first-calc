# Phase 4B report

## Working tree and validation environment

Phase 3/4A/4B files were committed only on the temporary `ci/phase4-validation` branch to permit authoritative CI. `report.zip` and `debug.log` are absent. No screenshots, videos, traces, `.next`, coverage output, Playwright report output or other runtime artifacts were included in the validation commit. `test-results/.last-run.json` has the same semantic content as HEAD; the remaining local newline-only diff is not meaningful and must not be included in a final commit.

Local Node is 24.14.0. GitHub Actions uses `ubuntu-latest` with `actions/setup-node` configured for Node 20. Run 34 passed lint, typecheck, i18n, metadata audit, calculator audit, Vitest coverage (16 files, 62 tests), production build and Chromium installation. Its E2E step failed: 17 passed and 5 failed in 10.5 minutes, so the full pipeline is not green.

The initial run 33 exposed a separate coverage-reporting defect after all 62 tests passed: Istanbul's HTML reporter attempted to create a path containing Vite's virtual-module NUL byte. Removing only the HTML reporter (retaining text and JSON/Codecov coverage) fixed the job; run 34 confirms the coverage step passes.

## Playwright root cause and browser coverage

Two independent infrastructure faults were established: local Chromium was absent, and bare standalone startup omitted `.next/static`/`public`, producing unstyled/unhydrated HTML. Chromium was installed locally and `scripts/start-standalone-test.mjs` now prepares standalone assets cross-platform. The original 14-test suite then passed 14/14 against a correctly prepared server.

The new suite covers homepage, hub, category, basic/construction/mortgage calculators, standard, legacy utility, search and limited-locale behavior at 320, 390, 768 and 1440. Browser evidence found and fixed 320px breadcrumb overflow and 768px header overflow. All four viewport route-matrix tests pass after fixes.

Linux reproduced the Windows interaction failure. Playwright resolves the form control as visible, enabled and editable, but `locator.fill()` does not complete before the 30-second test timeout. The same class of failure affects decimal input and search interaction. Local diagnostics confirmed the page is hydrated, JS chunks return 200, the element is focusable and the standalone server contains `.next/static` and `public`. Replacing pointer interaction with keyboard/CDP input and blocking speculative RSC prefetch did not resolve the transport/action hang; those diagnostic test changes were reverted rather than weakening assertions.

## Decimal input, search and availability

Real Chromium renders the three pilot forms with `type=text` and `inputMode=decimal`. After the root-cause fix, authoritative CI passes the RU decimal pilot, EN decimal editability, search focus behavior, limited-locale interactive search and the older search-flow case. Assertions remain real browser interactions and were not converted to request-only checks.

## i18n and risk coverage

Added EN/RU `results` and `footer` namespaces. Migrated reusable result labels, related-block headings, footer share heading/action/copy state. Domain scenario explanations remain untouched.

Eight direct risk tests cover mortgage, auto loan, BMI, body fat, electrical load, rebar, cement and date calculation using examples, boundaries, units, invalid values and rounding. The audit's unowned-test count moves from 65 to 59. Domain questions are recorded in `DOMAIN_REVIEW_QUEUE.md`; no formulas changed.

React `act(...)` warnings originate from asynchronous client translation state and user-event updates in component tests. Explicit mocks remove translation loading as a test dependency; partial explicit `act` wrapping was added, but a final clean full Vitest run is still required.

## Performance

Build baseline is calculator detail 44.6 kB / 143 kB first load and shared 89.4 kB. Versus Phase 4A (44.5/143 and 89.3), delta is approximately +0.1 kB route and +0.1 kB shared. This is small and attributable to bounded client result/footer i18n; audit scripts remain server/tooling-only.

## Decision

**READY FOR REVIEW/COMMIT.** The interaction root cause is fixed and authoritative Node 20/Linux run 35 is fully green. The three domain-review items remain explicitly unchanged as non-blocking follow-up work.

## Node 20/Linux CI verification

- Workflow: `CI`, run 34, SHA `51eec99624d836248fa8d281118216baf6f0dc4a`.
- URL: https://github.com/alex1c/first-calc/actions/runs/31708367627
- Runner: `ubuntu-latest`; project runtime configured by `actions/setup-node` as Node 20. GitHub additionally warns that JavaScript actions themselves are forced onto the runner's Node 24 action runtime; this does not change the configured project Node used by npm commands.
- Passed steps: install, lint, typecheck, i18n validation, metadata audit, calculator quality audit, Vitest coverage, production build, Chromium install, coverage upload.
- Vitest: 16/16 files, 62/62 tests.
- Playwright: 17 passed, 5 failed (22 total), 10.5 minutes.
- Failed cases: RU decimal-comma pilot; EN decimal input; search focus/inert/restore test; limited-locale search availability test; legacy search-flow E2E.
- Responsive matrix at 320, 390, 768 and 1440 passed. The Windows interaction hang does reproduce on Linux.

## Phase 4B.2 interaction root cause

The five interaction timeouts shared one root cause in `useClientT`. Its effect depended on both a stable serialized namespace key and the caller-provided `namespaces` array. Components such as result, footer and legacy UI legitimately pass inline arrays, creating a new reference on every render. Each effect completion called `setDict`, which triggered another render and another namespace load. Chromium remained visually responsive between updates, but controlled input actions that caused their own React update could not settle; extended diagnostics ended with a renderer V8 OOM.

Bounded evidence:

- A vanilla DOM input on the same page accepted keyboard input immediately.
- A minimal React-controlled input under the same application layout reproduced the hang.
- `inert` was false on body, document and all input ancestors; body overflow was empty.
- The element stayed visible, enabled, editable, focused and was not remounted.
- Dev and standalone builds both reproduced the issue.
- Playwright 1.57/Chromium 143, Playwright 1.56.1/Chromium 141 and stable Chrome 151 reproduced it, excluding a browser-revision-specific regression.
- Temporarily removing search inert/focus/scroll behavior did not change it.
- After making the namespace effect depend only on `locale` and `namespacesKey`, the same real keyboard action completed and value readback returned immediately.

The dependency/browser A/B, diagnostic route, instrumentation and generated logs were removed. A regression component test covers inline namespace arrays. The RU browser test now uses an exact submit-button name; mortgage continues to verify real comma entry but does not demand results because its separately documented schema/calculation ownership mismatch is intentionally outside this phase.

## Final Node 20/Linux rerun

- Workflow: `CI`, run 35, SHA `b383ec5a8f07fd4589853af02daf7f5505ed4d42`.
- URL: https://github.com/alex1c/first-calc/actions/runs/31718974677
- Runner: `ubuntu-latest`; project commands use Node 20 from `actions/setup-node`.
- All workflow steps passed: install, lint, typecheck, i18n, metadata audit, calculator audit, Vitest coverage, production build, matching Chromium install, full Playwright and coverage upload.
- Vitest: 17/17 files, 63/63 tests.
- Playwright: 22/22 passed in 15.6 seconds.
- The previous Windows/Linux interaction hang no longer reproduces after stabilizing namespace effect dependencies.
