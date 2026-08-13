# Domain review queue

| Calculator | Current behavior | Review reason | Domain / risk | Source needed |
| --- | --- | --- | --- | --- |
| `cement-calculator` | Treats concrete volume as the sum-volume basis and returns 205.71 kg for 1 m³ at 1:2:4 | Many field methods apply a dry-volume factor before ratio allocation; the intended estimator convention is not documented as a sourced choice | Construction / high | Yes; construction estimating reference and product-owner decision |
| `electrical-load-calculator` | Infers W versus kW from whether the aggregate exceeds 1000 | Mixed appliance inputs can be ambiguous and threshold inference is unsuitable for design decisions | Engineering / high | Yes; explicit unit-model and electrical-domain review |
| `mortgage-calculator` | Schema exposes `loanAmount`/`monthlyPayment`, while implementation primarily consumes `homePrice` and returns `monthlyMortgagePayment` | Legacy TS definition currently masks the JSON mismatch, but schema/function ownership should be reconciled before registry precedence changes | Finance / high | Methodology review plus schema ownership decision |

No formula or assumption was modified in Phase 4B.
