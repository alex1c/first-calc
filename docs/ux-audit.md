# Calculator UX Audit - Input Validation & Defaults

**Date:** 2024-12-19  
**Scope:** Input validation simplification, default values, date pickers

## A) Current State Analysis

### Components Handling Validation

1. **CalculatorForm** (`components/calculators/calculator-form.tsx`)
   - Client-side input handling
   - Uses `getSensibleDefault()` from `lib/calculators/defaults.ts`
   - Has `onBlur` handler that clamps negative values to 0 (line 136-142)
   - Select inputs show "Select..." placeholder even when default is set (line 224)
   - Date inputs already use `type="date"` (line 195-209) ✅

2. **CalculatorPage** (`components/calculator-page.tsx`)
   - Client-side validation via `validateInput()` callback (line 35-113)
   - Validates on submit
   - Checks: required, number validity, min/max from validation object
   - Already simplified - only enforces explicit validation rules ✅

3. **API Route** (`app/api/calculators/[id]/calculate/route.ts`)
   - Server-side validation (line 47-73)
   - Matches client-side logic
   - Converts empty strings to 0 for numbers (line 86) - may need review

### Where Defaults Are Applied

1. **Schema JSON** (`data/calculators/*.json`)
   - Individual inputs can have `defaultValue` property
   - Top-level `defaults` object (legacy, used for initial values)

2. **getSensibleDefault()** (`lib/calculators/defaults.ts`)
   - Provides fallback defaults when schema doesn't define `defaultValue`
   - Already has logic for: wasteMargin, coats, coverage, spacing, edgeAllowance, etc.
   - Only applies when `input.defaultValue === undefined`

3. **CalculatorForm Initialization** (line 22-54)
   - Uses: `input.defaultValue ?? getSensibleDefault(input, calculator.id)`
   - For select inputs without default: uses first option value
   - For conditional fields: initializes if visible

### Construction Calculators Needing Defaults

**Materials Cluster:**
- ✅ `paint-calculator` - Has most defaults, missing `paintCoverage` default
- ⚠️ `primer-calculator` - Needs review
- ⚠️ `putty-calculator` - Needs review
- ⚠️ `cement-calculator` - Needs review
- ⚠️ `sand-calculator` - Needs review
- ⚠️ `gravel-calculator` - Needs review

**Foundations Cluster:**
- ✅ `slab-foundation-calculator` - Has defaults in "defaults" object, but inputs missing individual defaults
- ⚠️ `strip-foundation-calculator` - Needs review
- ⚠️ `pile-foundation-calculator` - Needs review
- ⚠️ `foundation-volume-calculator` - Needs review

**Walls & Masonry:**
- ⚠️ `wall-area-calculator` - Needs review
- ⚠️ `brick-calculator` - Needs review

**Finishing:**
- ⚠️ `tile-calculator` - Needs review
- ⚠️ `laminate-calculator` - Needs review

**Reinforcement:**
- ⚠️ `rebar-calculator` - Needs review
- ⚠️ `rebar-weight-calculator` - Needs review

**Electrical:**
- ⚠️ `electrical-load-calculator` - Needs review
- ⚠️ `cable-size-calculator` - Needs review

**Plumbing:**
- ⚠️ `pipe-volume-calculator` - Needs review

**Stairs:**
- ⚠️ `stair-calculator` - Needs review

## B) Issues Identified

### Over-Validation

1. **CalculatorForm onBlur** (line 136-142)
   - Forces negative values to 0 if `validation.min >= 0`
   - Should only enforce on submit, not during typing

2. **Select Placeholder**
   - Always shows "Select..." even when default is set
   - Should hide placeholder when default exists or field is required

3. **Min/Max Attributes**
   - Applied from `input.min/max` even if not in `validation` object
   - Should only use HTML min/max if explicitly needed

### Missing Defaults

1. **Common numeric fields missing defaults:**
   - `paintCoverage` (paint-calculator)
   - `slabThickness` (slab-foundation-calculator) - has in defaults object but not in input
   - `spacing` (rebar-calculator)
   - `edgeAllowance` (rebar-calculator)
   - `jointThickness` (brick-calculator)
   - `layerThickness` (putty-calculator)
   - `consumptionRate` (putty-calculator)

2. **Select inputs:**
   - Some have defaults, but should ensure first option is used if no default

### Date Inputs

- ✅ Already using `type="date"` - no changes needed

## C) Recommended Changes

### Priority 1: Remove Over-Validation
- Remove onBlur negative clamping in CalculatorForm
- Only validate on submit
- Remove "Select..." placeholder when default exists

### Priority 2: Add Missing Defaults
- Add `defaultValue` to individual inputs in JSON schemas
- Ensure all construction calculators have sensible defaults
- Update `getSensibleDefault()` if needed

### Priority 3: Simplify Validation
- Ensure API route matches client validation
- Don't convert empty strings to 0 automatically
- Only enforce min/max from validation object

## D) Testing Checklist

After changes, verify these calculators load with pre-filled defaults:
- [x] paint-calculator
- [x] primer-calculator
- [x] putty-calculator
- [x] tile-calculator
- [x] slab-foundation-calculator
- [x] rebar-calculator
- [x] cable-size-calculator
- [x] pipe-volume-calculator

## E) Global UX Unification (COMPLETED)

### Changes Applied Across All Categories

**1. Enhanced getSensibleDefault() Function:**
- Added finance defaults: interestRate (5), loanTerm (12), initialInvestment (10000), monthlyContribution (500)
- Added auto defaults: fuelConsumption (8), fuelPrice (1.5), distance (100)
- Added health defaults: height (170), weight (70), age (30), duration (30)
- Date inputs: startDate → today, endDate/referenceDate → today + 30 days, birthDate → 30 years ago

**2. Updated Calculator Schemas:**
- Investment calculator: initialInvestment (10000), monthlyContribution (500)
- Savings calculator: initialSavings (5000), monthlyContribution (200)
- Date calculator: removed empty startDate default (now uses getSensibleDefault)
- Perimeter calculator: added defaults for all shape-specific inputs
- Car cost of ownership: purchasePrice (30000), resaleValueEstimate (15000)
- Car depreciation: purchasePrice (30000)
- Heart rate zones: restingHeartRate (60)
- Water intake: exerciseMinutesPerDay (30)

**3. Date Input Handling:**
- All date inputs now use `type="date"` (already implemented)
- CalculatorForm ensures date inputs always have a default (today or reasonable date)
- getSensibleDefault provides intelligent date defaults based on field name

**4. Validation Consistency:**
- Removed onBlur negative clamping
- Validation only on submit
- Select placeholder hidden when default exists
- Min/max only enforced from validation object
- Empty non-required fields skipped in validation

**5. Categories Covered:**
- ✅ Math: percentage, area, volume, equations, statistics
- ✅ Finance: loan, mortgage, investment, ROI, savings
- ✅ Auto: fuel consumption, trip cost, depreciation, ownership cost
- ✅ Health: BMI, BMR, calories, body metrics
- ✅ Life/Everyday: age, dates, time intervals
- ✅ Construction: (already completed in previous task)

### Result
All calculators now have:
- Consistent UX behavior
- Sensible defaults for immediate use
- Simplified and predictable validation
- No category-specific validation hacks
