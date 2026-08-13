# CI validation report

Temporary branch: `ci/phase4-validation`

Authoritative run: [GitHub Actions CI run 34](https://github.com/alex1c/first-calc/actions/runs/31708367627), SHA `51eec99624d836248fa8d281118216baf6f0dc4a`, `ubuntu-latest`, project Node 20.

## Result

The run is **failed**, so the accumulated tree is not commit-ready.

- Passed: lint, typecheck, i18n validation, metadata audit, calculator quality audit, Vitest coverage, production build, Chromium install, coverage upload.
- Vitest: 16 files and 62 tests passed.
- Playwright: 17 passed, 5 failed out of 22 in 10.5 minutes.
- The 320/390/768/1440 responsive route matrix passed.
- Failed interactive cases: RU decimal-comma input, EN decimal input, search accessibility, limited-locale search availability, and the pre-existing search-flow test.

The failing action resolves each target input as visible, enabled and editable, then times out during Playwright input dispatch. This reproduces on both Windows/Node 24 and Linux with the project commands running under Node 20. Hydration, JS asset delivery, standalone static assets and element focus were independently confirmed. Tests were not skipped, converted to request-only checks or granted arbitrary longer timeouts.

Run 33 previously failed after 62 passing tests because Istanbul's HTML coverage reporter could not represent Vite's NUL-prefixed virtual-module path. The validation-only fix retains text and JSON coverage and is confirmed passing in run 34.

Generated Playwright output, coverage, build output, logs, `report.zip`, `debug.log`, and semantic changes to `test-results/.last-run.json` are excluded from the intended commit scope.

## Phase 4B.2 remediation

The interaction failure was traced to repeated namespace loading in `useClientT`: inline namespace arrays changed identity on each render, so the effect repeatedly called `setDict`. Controlled input updates then failed to settle and the Chromium renderer eventually recorded a V8 OOM. The hook now derives its load list from the stable `namespacesKey` and depends only on that key plus locale.

Local focused verification after the fix:

- real controlled keyboard input completes with preserved element identity and focus;
- original Playwright `fill()` completes for EN/RU decimal and search fields;
- lint and typecheck pass;
- Vitest passes 17 files / 63 tests, including a new inline-namespace regression test;
- production build passes.

Final authoritative rerun: [GitHub Actions CI run 35](https://github.com/alex1c/first-calc/actions/runs/31718974677), SHA `b383ec5a8f07fd4589853af02daf7f5505ed4d42`, passed every workflow step on `ubuntu-latest` with project Node 20. Vitest passed 17 files / 63 tests and Playwright passed 22/22 tests in 15.6 seconds. The accumulated tree is ready for review and a final squashed commit after excluding the temporary validation-branch trigger and generated artifacts.
