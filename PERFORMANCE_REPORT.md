# Performance report

Phase 3 production build confirms the baseline is unchanged: calculator detail 41.2 kB route code / 139 kB first-load JS; shared first-load JS 89.3 kB. Homepage is 645 B / 104 kB and calculator hubs are 4.33 kB / 102 kB. The large result and hero components remain known review hotspots, but line count alone is not evidence of user cost.

Phase 3 changes add no runtime dependency and no heavy visual asset. Availability filtering is server-side filesystem presence checking already used by SEO; search documents remain cached by locale. No speculative component split or architectural rewrite was made. A future analyzer run should attribute route chunks, hydration time, rare calculator-specific branches and duplicated dependencies before any dynamic import or renderer split.

Phase 4A likewise adds no runtime dependency. Locale parsing is restricted to three pilot forms, translation resources are small JSON namespaces, and visual tokens compile to existing utility classes. No bundle split or ImageResponse OG runtime was introduced without a measured benefit.

Phase 4B build: calculator detail 44.6 kB / 143 kB first load; shared 89.4 kB. Delta from Phase 4A is about +0.1 kB route and +0.1 kB shared. Audit/test scripts do not enter runtime bundles.
