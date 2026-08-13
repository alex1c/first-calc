# Mobile and accessibility report

Phase 4A adds bounded Tab/Shift+Tab trapping, Escape close, body scroll locking, background inertness/`aria-hidden`, focus restoration, and locale-owned search labels/states. Code review covered shared layouts at the requested breakpoints without a broad CSS rewrite. A complete device/browser matrix for long tables, formulas, standards and arbitrary legacy variants remains Phase 4B work; no WCAG conformance claim is made.

Phase 4B browser checks found breadcrumb overflow at 320px and header navigation overflow at 768px. Breadcrumbs now scroll within their container and desktop navigation starts at `lg`; the representative route matrix passes at 320/390/768/1440. Interactive search assertions remain blocked by the local Windows Playwright action hang.

Code-level review retained the Phase 2 narrow-padding fixes and added search focus restoration. The dialog already has `role=dialog`, `aria-modal`, an accessible title/input label, Escape handling and arrow/Enter result navigation. Search “view all” now uses the canonical locale URL helper and avoids `/en/` redirects.

Remaining browser-verified work: complete Tab focus trapping, background inertness, 320–430 px long-title/table/formula overflow, touch targets, and representative article/standard/legacy pages at 768/1440. No claim of visual conformance is made without the browser matrix.
