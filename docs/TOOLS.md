# Legacy Tools Philosophy

## Purpose
Legacy tools are maintained for SEO continuity and user familiarity. They are separate from the schema-based calculators and should gently funnel users toward newer experiences without breaking inbound links.

## URL stability
- Keep existing `/tools/<slug>` URLs intact; avoid renaming slugs.
- If functionality is replaced by a calculator, keep the tool page live with an engagement block linking to the modern calculator.

## Content expectations
- Keep copy concise and neutral—no compliance or legal claims.
- Provide a short description plus links to related calculators, learn articles, or standards hubs to guide discovery.

## Engagement blocks
- Use `legacy-tools-block` and related calculator/cluster components to surface modern equivalents.
- Prefer links to light/fast calculators in the same topical area.

## Maintenance tips
- Tools are not part of `data/calculators`. When deprecating, add clear calls-to-action to preferred calculators rather than removing the tool.
- Reuse localization namespaces in `locales/<locale>/legacy/` for shared UI strings; fall back to English when translations are missing.
