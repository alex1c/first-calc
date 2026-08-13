# Calculator content audit

`npm run quality:calculators` produces one merged JSON-capable record per enabled canonical calculator, joining schema/calculation ownership, category/risk, EN/RU item presence, metadata/content sections, relations and test ownership without inventing content.

Current inventory: 69 enabled; 69 EN items; 5 strict ID/slug RU matches; 0 invalid schemas; 0 missing method/example/FAQ fields; 17 without relations; 65 without a calculator-owned test file; 0 stale related IDs.

Phase 4B adds direct behavior ownership for eight risk-prioritized implementations (mortgage, auto loan, BMI, body fat, electrical load, rebar, cement and date), reducing the generated unowned count from 65 to 59. Domain questions are queued separately rather than changing formulas.
