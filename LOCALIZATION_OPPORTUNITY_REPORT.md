# Localization opportunity report

Date: 2026-08-13. This is a qualitative product/SEO assessment based on the repository and general market characteristics. No Google Ads, Search Console, Ahrefs, Semrush, or market-specific keyword-volume/CPC dataset was available. Therefore no search volume, CPC, traffic, or revenue numbers are asserted. Validate the shortlist with real query clusters and native-speaker SERP review before investment.

## Current languages

| Locale | Current state | Decision |
|---|---|---|
| EN | 75 calculator item files, 56 articles, 9 standards entries; broadest reusable catalog | Develop as the canonical quality baseline |
| RU | 13 calculator item files, localized legacy value, 6 standards entries, partial shell/content | Develop selectively: math/number words, construction, finance pages only after native review |
| ES | UI shell only; zero localized calculator item files | Limit indexing; validate a small calculator/converter cluster before expansion |
| TR | UI shell only; zero localized calculator item files | Limit indexing; expand only with native capacity and demonstrated query opportunity |
| HI | UI shell only; zero localized calculator item files | Keep, do not delete; limit indexing and run a small demand/quality pilot before deciding |

### Hindi conclusion

Hindi is not currently a real calculator catalog: there are no Hindi calculator item files, articles, or standards, and most useful pages fall back to English. The translated shell and homepage metadata alone do not justify broad Hindi indexation. However automatic removal would discard product optionality and could break existing URLs. Recommendation: **keep but limit**. Keep `hi` supported and fallback pages usable/noindex; do not add Hindi pages to sitemap/hreflang until each page has reviewed Hindi content, terminology, units, examples, metadata, and input/result formatting. A pilot around a small set of high-utility math/finance/converter queries should be evaluated with Indian SERPs and native review. Continue only if quality and demand are demonstrated.

## Candidate evaluation

Scores are relative qualitative judgments, not traffic forecasts.

| Locale | Calculator demand | Construction fit | Competition/value | Localization complexity | Local units/standards | Reuse potential | Recommendation |
|---|---|---|---|---|---|---|---|
| German (`de`) | High for calculators, converters, finance and technical queries | Strong | High-value traffic, strong competition | Medium-high; precise compound terminology | Metric; DIN/Eurocodes and German finance/legal context matter | High for math/geometry/construction core | Priority 1 |
| French (`fr`) | High broad calculator/converter demand | Strong across France and Francophone markets | Valuable, competitive | Medium; regional phrasing and finance differences | Metric; Eurocodes/French references; multi-country currency/tax differences | High | Priority 1 |
| Polish (`pl`) | Strong practical calculator/converter demand | Strong DIY/construction opportunity | Often less saturated than DE/FR; verify | Medium; inflection/plurals require native QA | Metric; Polish standards/practice context | High | Priority 1 |
| Portuguese Brazil (`pt-BR`) | Large broad utility/finance demand | Strong household/construction potential | Attractive scale, competition varies | Medium; use pt-BR, not generic PT | Metric; BRL, Brazilian finance and ABNT context | High | Priority 2 |
| Italian (`it`) | Solid calculator/converter demand | Good home/construction fit | Moderate-to-high competition | Medium | Metric; Italian/Eurocode context | High | Priority 2 |
| Dutch (`nl`) | Smaller audience but digitally mature | Good | Commercial value can be high; limited total ceiling | Medium-low | Metric; Dutch construction context | High | Priority 2 |
| Indonesian (`id`) | Large utility audience | Potentially strong | Monetization and query mix need validation | Medium | Metric; IDR/local construction context | High for basic tools | Priority 2/3 |
| Japanese (`ja`) | Strong digital demand | Market-specific | Valuable but mature competition | High; native UX/content expectations | Metric plus Japanese standards and conventions | Medium | Priority 3 |
| Korean (`ko`) | Strong digital demand | Market-specific | Competitive; validate SERPs | High | Metric and Korean standards/context | Medium | Priority 3 |
| European Portuguese (`pt-PT`) | Useful but much smaller than pt-BR | Moderate | Separate localization cost | Medium | Metric/Eurocodes | High technically, lower scale | Priority 3 |

## Final ranking

### Priority 1

1. German (`de`) — best combination of technical/construction fit and commercial search value, subject to native terminology and DIN/Eurocode review.
2. French (`fr`) — broad calculator demand and large reusable catalog; scope country-sensitive finance content carefully.
3. Polish (`pl`) — attractive construction/practical-calculator fit and a plausible competition opportunity that must be validated with keyword tools.

### Priority 2

`pt-BR`, `it`, `nl`. Start with 15–30 high-confidence pages, not the whole catalog.

### Priority 3

`id`, `ja`, `ko`, `pt-PT`. Each needs either demand validation, higher localization investment, or more market-specific standards/UX work.

### Not recommended now

No additional locale should be launched now. Generic `pt`, automatic country variants, or languages selected only by population are not recommended. Existing ES/TR/HI should be brought to an explicit product state before the locale matrix grows.

## Recommended launch model

Each locale owns an explicit availability manifest. A page becomes available only after content, functionality, metadata, units, examples, FAQ, links, and native review pass. Sitemap and hreflang consume that manifest. Different locales may legitimately have different catalog sizes. Initial candidate research should group queries by intent (`calculator`, `converter`, `estimator`, `construction`, `finance`, `math`, `date/time`, `health`) and compare actual SERPs, keyword demand, and content-production cost.
