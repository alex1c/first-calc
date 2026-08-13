# Shared UI i18n audit

## A. Global UI

Migrated: search button, dialog title/input/close, keyboard hint, loading/empty states, groups, fallback labels and view-all action. The `search` namespace has EN/RU ownership and deliberate project fallback for ES/TR/HI. Remaining: footer share/copy feedback, some footer/navigation labels and migration notices.

## B. Calculator UI

Migrated: shared Calculate/Select controls and calculator-card badges/category/how-to labels through `calculators/ui`. Remaining: generic result headings, example-result labels, related-block headings and shared “How to Calculate”. These belong in a later bounded `calculator`/`results` batch.

Phase 4B adds EN/RU `results` ownership for generic result/formula/date/conversion labels and related/legacy/standards headings. Footer share/copy actions now use the bounded `footer` namespace. Calculator-specific scenario reasons and methodology remain domain content.

## C. Content/domain text

Descriptions, methodologies, scenario explanations, standards, finance/medical/engineering claims and legacy editorial copy are deliberately excluded. They require item-level native/domain review.

`npm run i18n:validate` now checks key parity for `calculators/ui` and `search`. Missing non-EN search namespaces are visible warnings using deliberate UI fallback and do not create indexable content.
