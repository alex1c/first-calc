# Calculator quality report

Inventory contains 69 enabled base schemas, 75 English item files, and 13 Russian item files. Schema and item content are deliberately separate, so quality must be evaluated on their merged definition rather than requiring prose inside the schema.

Automated checks currently cover schema validation, calculation registry execution, finite-number behavior in focused tests, metadata availability, locale item availability, and related IDs. Follow-up automation should emit one merged row per calculator for title, description/H1, examples, FAQ, method, related content, category and calculation test ownership.

Domain review queues:

- Finance: assumptions, currency, jurisdiction and claims.
- Health: medical disclaimer, units and clinical interpretation.
- Construction/engineering: standards, material assumptions and safety margins.
- Date/time: timezone, locale date conventions and leap-edge cases.

No formula, standard, medical or finance claim was changed. Three stale related IDs are documented in `INTERNAL_LINK_REPORT.md`.
