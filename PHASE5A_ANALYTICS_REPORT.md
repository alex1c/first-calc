# Phase 5A Analytics Report

## Audit before changes

- The global document and root metadata are owned by `app/layout.tsx`; localized route metadata inherits from this root.
- No Yandex Webmaster, Google Search Console, Yandex Metrika, Google Analytics, Tag Manager, or other analytics integration existed in application source.
- No repository-managed Content-Security-Policy or analytics/cookie consent mechanism exists.
- A privacy policy exists, but its analytics wording is generic and does not explicitly describe Yandex Metrika, Webvisor, retention, or a consent/legal basis.
- `app/layout.tsx` is the correct stable App Router location: it is shared by every locale and does not remount during ordinary client navigation.

## Files changed

- `app/layout.tsx`
- `components/analytics/yandex-metrika.tsx`
- `lib/analytics/yandex-metrika.ts`
- `tests/unit/yandex-metrika.test.ts`
- `e2e/analytics.spec.ts`
- `e2e/seo.spec.ts`
- `PHASE5A_ANALYTICS_REPORT.md`

The pre-existing untracked `PHASE4_RELEASE_REPORT.md` and tracked `playwright-report/index.html` were not modified as part of Phase 5A.

## Webmaster verification

Root metadata now uses the Next.js Metadata API for both required values:

- Yandex Webmaster: `f30c8f5646bc778c` through `verification.other`.
- Google Search Console: `rB_ti1z-IpbQfE0HD2zpdqvV9gFwjOy167-U9BUwX7E` through `verification.google`.

Both tags are rendered by the server in the inherited root head, require no client JavaScript, and have SSR regression assertions for value and uniqueness.

## Yandex Metrika installation

- Counter ID is centralized as `48325316`.
- A single Next.js `Script` with the stable ID `yandex-metrika` uses `afterInteractive`, so the remote tag does not block initial rendering.
- The initialization retains `webvisor`, `clickmap`, `referrer`, `url`, `accurateTrackBounce`, and `trackLinks` exactly as requested.
- The tag loader guards against an already-present matching remote script, while the stable Next.js Script ID prevents duplicate installation from React rendering.
- A valid body-level `noscript` image points to `https://mc.yandex.ru/watch/48325316`.

## App Router navigation tracking

Yandex's SPA guidance recommends disabling the automatic initial view with `defer: true` and sending explicit `hit` calls. The bootstrap therefore performs exactly one deferred `init` and one explicit initial `hit`. A small client tracker observes the App Router pathname and query string, deliberately skips its initial effect, and sends one `hit` only when the full browser URL actually changes. The previous URL is supplied as `referer`.

This avoids both failure modes: no duplicate initial pageview and no missing client-side pageviews. It does not introduce a general analytics abstraction or custom calculator events.

Reference: [Yandex Metrika SPA setup](https://yandex.com/support/metrica/en/code/counter-spa-setup?lang=en).

## CSP and privacy findings

- No application CSP currently blocks Yandex, so no CSP change was made. If Apache adds a CSP outside this repository, production verification must confirm that the script, watch image, and Metrika network requests are allowed before acceptance.
- Metrika with Webvisor loads before consent because the project has no consent infrastructure. This is a material privacy/legal-review finding, especially for users in jurisdictions requiring prior analytics consent.
- The current privacy text is too generic for a confident disclosure of Webvisor behavior. Phase 5A intentionally does not rewrite policy/content or build consent architecture. A focused follow-up should determine the applicable legal basis and, if required, gate both initialization and tracking until consent while updating the privacy disclosure. The `noscript` fallback must also be reconsidered if prior consent is required.

## Regression coverage

- Unit coverage locks both verification tokens, counter ID, single `init`, single bootstrap `hit`, remote script URL, required options, and SPA `defer` mode.
- SSR E2E coverage checks both unique verification tags, one Metrika bootstrap, and one noscript watch URL.
- Browser E2E stubs only the external Metrika transport and verifies one initialization, one initial pageview, and exactly one additional pageview after a real App Router navigation.

## Validation results

- Local Windows npm ci remains non-authoritative due to reproducible environment-specific hang. Node 20/Linux CI is the release gate.
- `git diff --check`: passed.
- Source audit: one Metrika component/bootstrap and no pre-existing analytics integration found.
- System Node 24 `npm ci`: timed out in the existing Windows install/process environment before checks could start.
- Portable official Node `v20.20.2` was verified, but `npm ci` also timed out in the same filesystem/process environment. A bounded direct dependency recovery attempt was stopped after archive extraction stalled.
- Reboot retry on 2026-08-14: official portable Node `v20.20.2` with npm `10.8.2` was verified from the workspace. `npm ci --no-audit --no-fund` again stalled without output. During observation, the dependency tree remained fixed at 488 top-level entries and the `node_modules` directory timestamp remained fixed at 17:44:36 while the npm Node process made only negligible CPU progress. The stalled process was terminated under the release STOP ON FAILURE rule.
- No commit, push, CI run, deployment, or production verification was performed after this failed install gate.
- Consequently lint, typecheck, i18n validation, metadata audit, calculator audit, Vitest, production build, and Playwright did not produce valid local pass/fail results in this session. They must run in the existing Node 20/Linux CI before merge or deployment. No failure is being suppressed or reported as a pass.

## Risks

- Primary release gate: the complete Node 20/Linux CI suite must be green on the exact Phase 5A commit.
- Privacy/legal review is required for pre-consent Webvisor use and policy disclosure.
- Production Apache headers are outside repository scope; an external CSP could still block Metrika even though no application CSP does.
- Ad blockers and browser tracking protection may intentionally block the counter and should not be treated as application failures.

## Post-deploy checklist

1. Fetch `https://first-calc.com/` as raw SSR HTML and confirm exactly one of each:
   - `<meta name="yandex-verification" content="f30c8f5646bc778c">`
   - `<meta name="google-site-verification" content="rB_ti1z-IpbQfE0HD2zpdqvV9gFwjOy167-U9BUwX7E">`
2. Confirm one request for `https://mc.yandex.ru/metrika/tag.js`, an available `window.ym`, counter `48325316`, and no duplicate `init`.
3. Confirm the noscript URL is present once in SSR HTML.
4. With tracking protection disabled for the verification session, inspect initial and App Router navigation requests: exactly one initial pageview and one hit per URL change, with correct URL/title/referer.
5. Check console and network for CSP violations, JavaScript errors, hydration warnings, repeated requests, and render loops.
6. Exercise search and a representative calculator on desktop and mobile; verify normal navigation and interaction.
7. Confirm representative EN/RU canonical, hreflang, robots, and sitemap behavior remains unchanged.
8. Complete ownership verification in Yandex Webmaster and Google Search Console.
9. Submit `https://first-calc.com/sitemap.xml` in both webmaster services.
