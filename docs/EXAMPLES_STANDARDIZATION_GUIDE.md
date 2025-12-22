# Examples Standardization Guide

## Overview
This guide outlines the standardized format for calculator examples across Math, Finance, and Auto categories.

## Example Structure (Mandatory Format)

Each example MUST follow this structure in the JSON locale file:

```json
{
  "title": "Example 1: Short Descriptive Title",
  "description": "Brief scenario description (1-2 sentences)",
  "inputs": {
    "fieldName1": value1,
    "fieldName2": value2,
    "optionalField": 0  // Optional fields can be 0 or omitted
  },
  "steps": [
    "Step 1: Explanation",
    "Step 2: Calculation detail",
    "Step 3: Final computation"
  ],
  "result": "Optional: Detailed text explanation if needed"
}
```

## Requirements

### 1. Minimum Examples
- **Math calculators**: At least 3 examples
- **Finance calculators**: 4-5 examples (complex scenarios)
- **Auto calculators**: 4-5 examples (different use cases)

### 2. Example Quality
- Use realistic, human-scale numbers
- Each example should be different (not trivial variations)
- Reflect common real-life use cases
- Show both with and without optional inputs

### 3. Input Values
- All required inputs MUST have values
- Optional inputs can be:
  - Set to 0 (shown as optional)
  - Omitted entirely
- Use realistic numbers (not 1, 2, 3)

### 4. Calculation Steps
- Explain HOW values are combined
- Mention key formula or logic in words
- Show intermediate calculations when helpful
- Keep steps clear and concise

### 5. Results
- Results are calculated automatically using the calculator's function
- No hardcoded results
- Results appear below example inputs
- Formatted with proper units and separators

## Implementation

The ExamplesBlock component automatically:
1. Executes the calculator's calculation function with example inputs
2. Displays calculated results
3. Formats numbers appropriately
4. Shows optional vs required inputs

## Example Template

```json
{
  "examples": [
    {
      "title": "Example 1: Standard Scenario",
      "description": "Calculate X for typical Y situation",
      "inputs": {
        "requiredField1": 1000,
        "requiredField2": 5.5,
        "optionalField": 0
      },
      "steps": [
        "Start with base value: $1,000",
        "Apply rate: 5.5%",
        "Calculate result: $1,000 × 1.055 = $1,055"
      ]
    },
    {
      "title": "Example 2: Alternative Scenario",
      "description": "Different use case with optional field",
      "inputs": {
        "requiredField1": 2000,
        "requiredField2": 7.0,
        "optionalField": 100
      },
      "steps": [
        "Base value: $2,000",
        "Rate: 7.0%",
        "Optional adjustment: +$100",
        "Final: ($2,000 × 1.07) + $100 = $2,240"
      ]
    }
  ]
}
```

## Calculator-Specific Guidelines

### Math Calculators
- Focus on formula demonstration
- Show step-by-step mathematical operations
- Include edge cases (zero, negative where applicable)

### Finance Calculators
- Use realistic financial amounts
- Show different time periods
- Demonstrate impact of rates/terms
- Include scenarios with and without fees

### Auto Calculators
- Use realistic vehicle prices and terms
- Show different ownership periods
- Demonstrate various financing options
- Include mileage and usage variations

## Validation Rules

Input validation is simplified:
- ✅ Check if value is a valid number
- ✅ Prevent negative only if explicitly required (min >= 0)
- ✅ Check min/max only if explicitly set
- ❌ NO complex edge-case checks
- ❌ NO artificial limits
- ❌ NO business-rule validation

## Results Display

- Results appear immediately below input form
- No scrolling required
- Clearly separated Results block
- Example results appear below example description
- Same formatting as main results (smaller size allowed)

