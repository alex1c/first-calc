# Locale-aware decimal input

The pilot allowlist contains `square-root`, `cement-calculator` and `mortgage-calculator`, covering basic math, construction and practical finance. Numeric controls use text input with `inputMode="decimal"`, keep the raw edit string, then normalize through `parseLocalizedNumber` on submit. Other calculators retain `input[type=number]`.

This avoids browsers rejecting commas in number inputs while preserving English decimal-point input. Tests cover `12.5`, `12,5`, EN/RU grouping, negative values, empty input and invalid mixed separators. Output remains `Intl.NumberFormat`-based.

Grouping is locale-specific and ambiguous mixed formats are rejected. Broad migration requires device/browser and calculator validation review; no global replacement was made.

Chromium confirmed rendered text inputs with `inputMode=decimal`; RU square-root accepted `12,5` and produced 3.54. The complete three-form action matrix is not yet authoritative because local Windows Playwright later hangs during editable-element actions; Node 20/Linux CI must pass before expansion.
