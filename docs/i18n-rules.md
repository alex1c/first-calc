# i18n Rules and Guidelines

## Overview

This document outlines the rules and best practices for managing translations in the Calculator Portal project.

## Core Principles

### 1. One Entity = One File

Each calculator, standard, or article should have its own items file:
- `locales/{locale}/calculators/items/{slug}.json`
- `locales/{locale}/standards/items/{slug}.json`
- `locales/{locale}/learn/items/{slug}.json`

**Do NOT**:
- Put multiple calculators in one file
- Mix calculators, standards, and articles in the same file
- Create "giant" JSON files with all content

### 2. SEO and Long Texts Only in Items

Large content blocks should live in items files:
- ✅ `title`, `shortDescription`, `longDescription`
- ✅ `howTo[]`, `faq[]`, `examples[]`
- ✅ `contentHtml` (for articles)
- ✅ `seo` metadata

**Do NOT** put these in:
- ❌ JSON schemas (structure only)
- ❌ Namespace files (UI only)
- ❌ TypeScript data files

### 3. UI Only in Namespaces

Common UI elements should be in namespace files:
- ✅ Button labels (`common.button.calculate`)
- ✅ Navigation items (`navigation.menu.calculators`)
- ✅ Error messages (`errors.validation.required`)
- ✅ Page titles (`calculators/ui.page.title`)

**Do NOT** put entity-specific content in namespaces.

### 4. File Size Limits

**Recommended limits**:
- Namespace files: < 10 KB
- Items files: < 50 KB
- Total per locale: < 500 KB

If a file exceeds these limits:
1. Split large items into smaller pieces
2. Move rarely-used content to lazy-loaded modules
3. Consider content optimization

## File Structure

### Namespace Files

```
locales/{locale}/
  common.json          # Buttons, labels, messages
  navigation.json      # Menu items, breadcrumbs
  errors.json          # Validation, error messages
  calculators/ui.json  # Calculator page UI
  seo/templates.json   # SEO templates
```

### Items Files

```
locales/{locale}/
  calculators/items/
    {slug}.json        # Calculator content
  standards/items/
    {slug}.json        # Standard content
  learn/items/
    {slug}.json        # Article content
  legacy/
    {tool}.json        # Legacy tool content
```

## JSON Schema Format

### Calculator Schema (Structure Only)

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
  },
  "relatedIds": ["cube-root"],
  "standardIds": []
}
```

**Removed fields** (moved to items):
- `title`, `description`
- `howTo`, `examples`, `faq`
- `meta.keywords` (moved to `seo.keywords` in items)

### Items File Format

```json
{
  "title": "Square Root Calculator",
  "shortDescription": "Calculate the square root...",
  "longDescription": "This calculator helps...",
  "howTo": ["Step 1", "Step 2"],
  "examples": [...],
  "faq": [...],
  "seo": {
    "title": "Square Root Calculator - Calculator Portal",
    "description": "...",
    "keywords": ["square root", "math"]
  },
  "inputs": [
    {
      "label": "Number",
      "placeholder": "Enter a number",
      "helpText": "Help text here"
    }
  ],
  "outputs": [
    {
      "label": "Square Root",
      "unitLabel": ""
    }
  ]
}
```

## Naming Conventions

### File Names
- Use kebab-case: `square-root.json`, `eurocode-1.json`
- Match the slug exactly
- No spaces or special characters

### Keys
- Use camelCase for object keys: `shortDescription`, `howTo`
- Use dot notation for nested paths: `common.button.calculate`
- Be descriptive: `page.title` not `pt`

## Translation Workflow

### Adding a New Calculator

1. Create schema file: `data/calculators/{slug}.json` (structure only)
2. Create items file: `locales/en/calculators/items/{slug}.json` (content)
3. Run validation: `npm run i18n:validate`
4. Add translations for other locales as needed

### Updating Content

1. Edit items file: `locales/{locale}/calculators/items/{slug}.json`
2. Do NOT edit schema file for text changes
3. Run validation to check consistency

### Adding a New Locale

1. Copy namespace files from default locale
2. Translate all namespace files
3. Create items files for all entities
4. Run validation to check completeness

## Validation

Run validation before committing:

```bash
npm run i18n:validate
```

The validation script checks:
- ✅ Namespace consistency across locales
- ✅ Key structure match
- ✅ Items file existence
- ✅ File size limits

## Best Practices

### 1. Use Templates

Use template parameters for dynamic content:

```json
{
  "validation": {
    "required": "{field} is required"
  }
}
```

```typescript
t('validation.required', { field: 'Number' })
// → "Number is required"
```

### 2. Avoid Duplication

Don't repeat the same text in multiple places:
- ❌ Hardcode "Calculate" in every component
- ✅ Use `t('common.button.calculate')`

### 3. Fallback Gracefully

Always provide fallbacks:
- Default locale (en) as fallback
- Default values in code
- Log missing translations in development

### 4. Keep It Simple

- One translation per concept
- Avoid nested translations
- Use clear, descriptive keys

## Common Mistakes

### ❌ Don't Do This

```json
// In schema file
{
  "title": "Square Root Calculator",
  "description": "Long description here...",
  "howTo": ["Step 1", "Step 2"]
}
```

```typescript
// Hardcoded text
<button>Calculate</button>
```

### ✅ Do This Instead

```json
// In schema file (structure only)
{
  "id": "square-root",
  "slug": "square-root"
}

// In items file
{
  "title": "Square Root Calculator",
  "description": "Long description here...",
  "howTo": ["Step 1", "Step 2"]
}
```

```typescript
// Using translations
const t = createT(dict)
<button>{t('common.button.calculate')}</button>
```

## Migration Checklist

When migrating existing content:

- [ ] Extract texts from schemas to items files
- [ ] Update schema files to structure-only
- [ ] Update loaders to use items files
- [ ] Update components to use namespaces
- [ ] Run validation script
- [ ] Test all locales
- [ ] Update documentation

## Resources

- [Migration Plan](./i18n-migration-plan.md)
- [Validation Script](../scripts/i18n-validate.ts)
- [Type Definitions](../lib/i18n/types.ts)






