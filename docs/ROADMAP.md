# Roadmap

## Near term
- **Calculator coverage**: Add high-demand everyday/finance/health calculators using the JSON schema + examples/FAQ depth.
- **Localization**: Complete translations for existing calculators in ru/es/tr/hi; enable new locales only after namespace + items coverage.
- **Navigation**: Expand clusters in `lib/navigation` to surface standards-aware groups and light legacy-to-calculator handoffs.
- **Search relevance**: Tune synonyms and ranking weights for non-English locales; add more category badges in results.

## Mid term
- **Standards hubs**: Publish Eurocode/ISO/national context pages with strong linking to calculators and learn articles; keep disclaimers against compliance.
- **Learn expansion**: Grow article library with deep explanations, step-by-step walkthroughs, and calculator embeds.
- **Analytics-driven ordering**: Replace static popular lists with telemetry-backed ranking while preserving curated fallbacks.

## Long term
- **CMS/API source**: Plug in a headless CMS or API-backed loader using the registry abstractions (calculators, standards, learn).
- **Component library**: Extract calculator blocks (form/results/how-to/examples/faq/related) into a shared design system package.
- **Accessibility and performance**: Continue ARIA coverage, keyboard navigation, and Core Web Vitals improvements across locales.
