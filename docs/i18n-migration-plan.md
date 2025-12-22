# i18n Migration Plan

## Current State Analysis

### 1. Current i18n Infrastructure

**Location**: `lib/i18n.ts`
- Basic locale configuration (en, ru, es, tr, hi)
- Locale names mapping
- No translation loading mechanism
- No dictionary/translation functions

### 2. Current Translation Storage

#### A. Legacy Pages (`lib/legacy/content.ts`)
- **Size**: ~585 lines
- **Structure**: Hardcoded TypeScript object with nested locale objects
- **Content Types**:
  - SEO: `title`, `description`, `ogTitle`, `ogDescription`, `keywords`
  - Content: `text[]` (paragraphs), `useCases[]`
- **Locales**: EN, RU only
- **Tools Covered**: 7 legacy tools
  - `chislo-propisyu`
  - `numbers-to-words`
  - `roman-numerals-converter`
  - `factors`
  - `number-format-in`
  - `percentage-of-a-number`
  - `add-subtract-percentage`

#### B. Calculators (`data/calculators.ts` + JSON schemas)
- **TypeScript file**: ~950 lines with hardcoded calculator definitions
- **JSON schemas**: 21 files in `data/calculators/*.json`
  - 10 calculators × 2 locales (en, ru) = 20 files
  - 1 additional file (`percentage-of-a-number.json`)
- **Content Types**:
  - UI: `title`, `shortDescription`, `longDescription`
  - Form: `inputs[].label`, `inputs[].placeholder`, `inputs[].helpText`, `outputs[].label`
  - Content: `howToBullets[]`, `examples[]`, `faq[]`
  - SEO: `meta.keywords`
- **Locales**: EN, RU (partial)

#### C. Standards (`data/standards.ts`)
- **Size**: ~560 lines
- **Content Types**:
  - UI: `title`, `shortDescription`, `longDescription`
  - Content: `formulas[]`, `tables[]`
  - SEO: `meta.keywords`
- **Locales**: EN, RU (partial)
- **Standards**: 7 standards (Eurocode 1, 2, 3, ISO 8601, ISO 80000, SP 20.13330, TSE 500)

#### D. Articles (`data/articles.ts`)
- **Size**: ~514 lines
- **Content Types**:
  - UI: `title`, `shortDescription`
  - Content: `contentHtml` (large HTML blocks)
  - SEO: `meta.keywords`
- **Locales**: EN only (5 articles)
- **Articles**: 5 articles

#### E. Hardcoded UI Text
- **Components**:
  - `components/header.tsx`: Navigation menu labels (hardcoded English)
  - `components/calculator-page.tsx`: Validation messages, button labels
  - `components/calculators/calculator-results.tsx`: "Results" heading
  - `components/calculators/related-calculators-block.tsx`: Section headings
  - `app/[locale]/(main)/calculators/page.tsx`: Page titles, category labels
  - `app/[locale]/(main)/search/page.tsx`: Search page text

### 3. Current Translation Usage Patterns

#### Pattern 1: Direct Property Access
```typescript
// In components
{calculator.title}
{calculator.shortDescription}
{calculator.howToBullets.map(...)}
```

#### Pattern 2: Function-based (Legacy)
```typescript
// lib/legacy/content.ts
const content = getLegacyContent(toolType, locale)
const title = getLegacyTitle(toolType, locale, dynamicValue)
```

#### Pattern 3: Hardcoded Strings
```typescript
// Components with English-only text
<h2>Results</h2>
<button>Calculate</button>
```

### 4. Large Content Blocks Identified

#### SEO Content
- **Legacy pages**: Titles, descriptions, OG tags (7 tools × 2 locales = 14 sets)
- **Calculators**: Titles, descriptions (20+ calculators × 2 locales)
- **Standards**: Titles, descriptions (7 standards × 2 locales)
- **Articles**: Titles, descriptions (5 articles × 1 locale)

#### How-to Content
- **Calculators**: `howToBullets[]` arrays (3-8 items each)
- **Legacy**: Not applicable (using text paragraphs)

#### FAQ Content
- **Calculators**: `faq[]` arrays (3-6 items each)
- **Legacy**: Not applicable

#### Examples Content
- **Calculators**: `examples[]` arrays (2-4 items each)
- **Legacy**: Not applicable

#### Long Descriptions
- **Calculators**: `longDescription` (1-3 paragraphs)
- **Standards**: `longDescription` (1-2 paragraphs)
- **Articles**: `contentHtml` (large HTML blocks, 3-8 paragraphs)

## Migration Plan

### Phase 1: Create New i18n Infrastructure (T2)

#### 1.1 Directory Structure
```
/locales/
  /en/
    common.json
    navigation.json
    errors.json
    /seo/
      templates.json
    /calculators/
      ui.json
      /items/
        square-root.json
        cube-root.json
        ...
    /standards/
      /items/
        eurocode-1.json
        ...
    /learn/
      /items/
        how-to-calculate-loan-payment.json
        ...
  /ru/
    (same structure)
  /es/
    (same structure)
  /tr/
    (same structure)
  /hi/
    (same structure)
```

#### 1.2 Core Files to Create

**`lib/i18n/types.ts`**
- `Locale` type
- `Namespace` type (string literals)
- Dictionary types

**`lib/i18n/loadNamespaces.ts`**
- `loadNamespaces(locale, namespaces[])` function
- Dynamic imports
- Server-side caching

**`lib/i18n/t.ts`**
- `createT(dict)` function
- Key path support (`"common.button.calculate"`)
- Template support (`{value}`)

#### 1.3 Initial Namespace Files

**`locales/en/common.json`**
```json
{
  "button": {
    "calculate": "Calculate",
    "search": "Search",
    "submit": "Submit"
  },
  "label": {
    "results": "Results",
    "examples": "Examples",
    "faq": "Frequently Asked Questions"
  }
}
```

**`locales/en/navigation.json`**
```json
{
  "menu": {
    "calculators": "Calculators",
    "standards": "Standards",
    "tools": "Tools",
    "learn": "Learn",
    "api": "API",
    "about": "About",
    "contact": "Contact"
  }
}
```

**`locales/en/errors.json`**
```json
{
  "validation": {
    "required": "{field} is required",
    "invalidNumber": "{field} must be a valid number",
    "min": "{field} must be at least {min}",
    "max": "{field} must be at most {max}",
    "negative": "{field} cannot be negative"
  },
  "calculation": {
    "failed": "Calculation failed",
    "invalidInput": "Invalid number for {field}"
  },
  "notFound": {
    "title": "Page Not Found",
    "description": "The page you are looking for does not exist."
  }
}
```

**`locales/en/calculators/ui.json`**
```json
{
  "page": {
    "title": "Calculators",
    "description": "Browse our collection of free online calculators"
  },
  "sections": {
    "popular": "Popular Calculators",
    "new": "New Calculators",
    "recommended": "Recommended for You",
    "categories": "Browse by Category",
    "toc": "Table of Contents"
  },
  "tags": {
    "popular": "Popular",
    "new": "New",
    "basedOnStandard": "Based on Standard"
  }
}
```

### Phase 2: Extract Large Content to Items (T3)

#### 2.1 Calculator Items Structure

**`locales/en/calculators/items/square-root.json`**
```json
{
  "title": "Square Root Calculator",
  "shortDescription": "Calculate the square root of any number...",
  "longDescription": "This calculator helps you...",
  "howTo": [
    "Enter a positive number...",
    "Click Calculate..."
  ],
  "examples": [
    {
      "title": "Example 1: Square root of 16",
      "description": "Calculate the square root of 16",
      "steps": ["Number: 16", "Result: 4"]
    }
  ],
  "faq": [
    {
      "question": "What is a square root?",
      "answer": "A square root of a number..."
    }
  ],
  "seo": {
    "title": "Square Root Calculator - Free Online Tool",
    "description": "Calculate square roots instantly...",
    "keywords": ["square root", "sqrt", "math"]
  }
}
```

#### 2.2 Standard Items Structure

**`locales/en/standards/items/eurocode-1.json`**
```json
{
  "title": "Eurocode 1: Actions on structures",
  "shortDescription": "European standard for determining actions...",
  "longDescription": "Eurocode 1 provides design values...",
  "seo": {
    "title": "Eurocode 1 Standard - Calculator Portal",
    "description": "Learn about Eurocode 1...",
    "keywords": ["eurocode", "structural engineering"]
  }
}
```

#### 2.3 Article Items Structure

**`locales/en/learn/items/how-to-calculate-loan-payment.json`**
```json
{
  "title": "How to Calculate Loan Payment",
  "shortDescription": "Learn how to calculate your monthly loan payment...",
  "contentHtml": "<h2>Understanding Loan Payments</h2>...",
  "seo": {
    "title": "How to Calculate Loan Payment - Guide",
    "description": "Step-by-step guide to calculating loan payments...",
    "keywords": ["loan", "payment", "mortgage"]
  }
}
```

#### 2.4 Loader Functions

**`lib/i18n/loadItemContent.ts`**
- `loadCalculatorContent(locale, slug)`
- `loadStandardContent(locale, country, slug)`
- `loadArticleContent(locale, slug)`
- Fallback to EN, then to defaults

### Phase 3: Refactor JSON Schemas (T4)

#### 3.1 Updated Schema Format

**`data/calculators/square-root.json`** (structure only)
```json
{
  "id": "square-root",
  "category": "math",
  "slug": "square-root",
  "inputs": [
    {
      "name": "number",
      "type": "number",
      "min": 0
    }
  ],
  "outputs": [
    {
      "name": "result"
    }
  ],
  "formula": "Math.sqrt(number)",
  "variables": {
    "number": "The number to find the square root of"
  }
}
```

**Removed from schema**:
- `title`, `description`
- `howTo`, `examples`, `faq`
- `meta.keywords` (moved to items)

#### 3.2 Updated Loader Logic

**`lib/calculators/schema.ts`** - `schemaToDefinition()`
1. Load structure from JSON schema
2. Load content from `loadCalculatorContent(locale, slug)`
3. Merge structure + content
4. If content missing, use autogen as fallback (log warning)

#### 3.3 Updated Generator

**`scripts/generate-calculator.ts`**
1. Create schema in `data/calculators/`
2. Create items file in `locales/en/calculators/items/`
3. Optionally create items for other locales
4. Do NOT write large texts to schema file

### Phase 4: Component Refactoring (T6)

#### 4.1 Page-Level Namespace Declaration

**Example: `app/[locale]/(main)/calculators/page.tsx`**
```typescript
const namespaces = ['common', 'navigation', 'calculators/ui'] as const
const dict = await loadNamespaces(locale, namespaces)
const t = createT(dict)
```

#### 4.2 Component Updates

**Priority 1 (High Impact)**:
1. `app/[locale]/(main)/calculators/page.tsx`
2. `app/[locale]/(main)/calculators/[category]/[slug]/page.tsx`
3. `app/[locale]/(main)/learn/[slug]/page.tsx`
4. `components/header.tsx`
5. `components/calculator-page.tsx`

**Priority 2 (Medium Impact)**:
6. `app/[locale]/(main)/standards/[country]/[slug]/page.tsx`
7. `app/[locale]/(main)/search/page.tsx`
8. `components/calculators/calculator-results.tsx`
9. `components/calculators/related-calculators-block.tsx`

**Priority 3 (Low Impact)**:
10. Legacy pages (can use existing `lib/legacy/content.ts` initially)

### Phase 5: Validation & Quality (T5)

#### 5.1 Validation Script

**`scripts/i18n-validate.ts`**
- Check namespace consistency across locales
- Check key structure match
- Check items file existence
- Check for missing translations
- Check file size limits

#### 5.2 Package.json Commands

```json
{
  "scripts": {
    "i18n:validate": "tsx scripts/i18n-validate.ts",
    "i18n:check": "npm run i18n:validate"
  }
}
```

#### 5.3 Documentation

**`docs/i18n-rules.md`**
- Rules for translation structure
- File size limits
- Naming conventions
- Best practices

## Migration Order

### Step 1: Infrastructure (T2)
1. Create `/locales` directory structure
2. Create `lib/i18n/types.ts`
3. Create `lib/i18n/loadNamespaces.ts`
4. Create `lib/i18n/t.ts`
5. Create minimal namespace files (common, navigation, errors, calculators/ui)

### Step 2: Extract Calculator Content (T3)
1. Create `lib/i18n/loadItemContent.ts`
2. Extract calculator content to items files
3. Update calculator loader to use items
4. Test with 2-3 calculators

### Step 3: Refactor JSON Schemas (T4)
1. Update schema format (remove texts)
2. Update `schemaToDefinition()` to load from items
3. Update generator script
4. Migrate existing JSON schemas

### Step 4: Extract Standards & Articles (T3)
1. Extract standard content to items
2. Extract article content to items
3. Update loaders

### Step 5: Component Refactoring (T6)
1. Refactor header component
2. Refactor calculator pages
3. Refactor search page
4. Refactor other pages incrementally

### Step 6: Validation (T5)
1. Create validation script
2. Add CI checks
3. Document rules

## File Mapping

### Current → New Location

| Current Location | New Location | Type |
|-----------------|--------------|------|
| `lib/legacy/content.ts` | `locales/{locale}/legacy/{tool}.json` | Items |
| `data/calculators.ts` (texts) | `locales/{locale}/calculators/items/{slug}.json` | Items |
| `data/calculators/*.json` (texts) | `locales/{locale}/calculators/items/{slug}.json` | Items |
| `data/standards.ts` (texts) | `locales/{locale}/standards/items/{slug}.json` | Items |
| `data/articles.ts` (texts) | `locales/{locale}/learn/items/{slug}.json` | Items |
| Hardcoded UI text | `locales/{locale}/common.json` | Namespace |
| Hardcoded navigation | `locales/{locale}/navigation.json` | Namespace |
| Hardcoded errors | `locales/{locale}/errors.json` | Namespace |

## Estimated File Counts

### Namespace Files (per locale)
- `common.json` - ~50 keys
- `navigation.json` - ~10 keys
- `errors.json` - ~20 keys
- `calculators/ui.json` - ~30 keys
- `seo/templates.json` - ~10 keys

### Items Files (per locale)
- Calculators: ~20 files
- Standards: ~7 files
- Articles: ~5 files
- Legacy: ~7 files

**Total per locale**: ~79 files
**Total across 5 locales**: ~395 files

## Risks & Considerations

1. **Breaking Changes**: Schema format change will break existing JSON files
2. **Migration Effort**: Large amount of content to migrate
3. **Testing**: Need comprehensive testing across all locales
4. **Performance**: Dynamic imports should be efficient
5. **Fallbacks**: Need robust fallback mechanism

## Success Criteria

1. ✅ All UI text uses i18n system
2. ✅ All large content blocks in items files
3. ✅ JSON schemas contain only structure
4. ✅ Validation script passes
5. ✅ All 5 locales supported
6. ✅ No hardcoded English text in components
7. ✅ Page-level namespace declarations
8. ✅ Graceful fallbacks working

## Timeline Estimate

- **T1 (Audit)**: 1 day ✅
- **T2 (Infrastructure)**: 2-3 days
- **T3 (Extract Content)**: 3-4 days
- **T4 (Refactor Schemas)**: 2-3 days
- **T5 (Validation)**: 1-2 days
- **T6 (Components)**: 3-4 days

**Total**: ~12-17 days





