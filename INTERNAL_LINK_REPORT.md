# Internal link audit

The primary indexable calculator path remains home → calculators hub → category → calculator, so catalog depth is at most three links when hubs expose only available inventory. Sitemap, hubs, search and related calculators now share the same calculator availability decision.

Findings:

- ES/TR/HI have zero calculator item files; their localized hubs/search no longer advertise English fallback entries as localized inventory. Direct fallback URLs remain usable and noindex.
- RU exposes 13 item-backed calculators. English exposes the enabled item-backed catalog.
- Related calculator cards are availability-filtered and English URLs no longer pass through `/en/`.
- The three stale `square-root` relations (`cube-root`, `exponent`, `area-rectangle`) originated in both the base and `.ru.json` schema. They named legacy/RU-only schema IDs excluded from the enabled canonical registry. No enabled exact targets exist for `cube-root` or `exponent`; `area` is not a safe semantic alias for `area-rectangle`. The broken relations were removed rather than guessed.
- `tests/unit/related-calculator-ids.test.ts` and the generated content audit now fail when an enabled base schema points at a non-enabled canonical calculator ID.
- Legacy utilities remain linked from tools, calculator relationships and discovery blocks. No legacy redirect or deletion was introduced.

A future rendered-HTML crawler should verify exact inbound counts and arbitrary dynamic legacy variants; a static manifest cannot prove every runtime link.
