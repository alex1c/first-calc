# i18n Usage Guide

## Quick Start

### In Server Components

```typescript
import { loadNamespaces, createT } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

// Declare required namespaces
const namespaces = ['common', 'navigation', 'calculators/ui'] as const

export default async function MyPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  
  // Load translations
  const dict = await loadNamespaces(locale, namespaces)
  const t = createT(dict)
  
  // Use translations
  return <h1>{t('calculators/ui.page.title')}</h1>
}
```

### In Client Components

For client components, use a context provider or pass translations as props:

```typescript
'use client'

import { useEffect, useState } from 'react'

function useClientTranslations(locale: string) {
  const [dict, setDict] = useState({})
  
  useEffect(() => {
    import(`@/locales/${locale}/common.json`)
      .then(m => setDict(m.default || m))
      .catch(() => {
        // Fallback to English
        import('@/locales/en/common.json')
          .then(m => setDict(m.default || m))
      })
  }, [locale])
  
  return (key: string) => {
    const keys = key.split('.')
    let value: any = dict
    for (const k of keys) {
      value = value?.[k]
    }
    return typeof value === 'string' ? value : key
  }
}
```

## Namespace Declaration

Each page should declare its required namespaces at the top:

```typescript
const namespaces = ['common', 'navigation', 'calculators/ui'] as const
```

Common namespace combinations:
- **Pages**: `['common', 'navigation', 'calculators/ui']`
- **Calculator pages**: `['common', 'errors']`
- **Search**: `['common', 'calculators/ui']`

## Translation Keys

### Key Path Format

Use dot notation for nested keys:
- `common.button.calculate`
- `navigation.menu.calculators`
- `errors.validation.required`

### Template Parameters

Use `{param}` syntax for dynamic values:

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

## Loading Item Content

For calculator/standard/article content:

```typescript
import { loadCalculatorContent } from '@/lib/i18n/loadItemContent'

const content = await loadCalculatorContent(locale, 'square-root')
if (content) {
  // Use content.title, content.howTo, etc.
}
```

## Best Practices

1. **Always declare namespaces** at the page level
2. **Use key paths** instead of flat keys
3. **Provide fallbacks** for missing translations
4. **Run validation** before committing: `npm run i18n:validate`
5. **Keep namespaces small** - split large files
6. **Use items files** for entity-specific content

## Validation

Run validation before committing:

```bash
npm run i18n:validate
```

This checks:
- ✅ Namespace consistency
- ✅ Key structure match
- ✅ Items file existence
- ✅ File size limits

## Troubleshooting

### Missing Translation

If a key is missing, the function returns the key itself. Check:
1. Namespace is loaded
2. Key path is correct
3. Translation exists in locale file

### Fallback Behavior

- Missing locale → falls back to `en`
- Missing namespace → returns empty dict
- Missing key → returns key string

## Examples

See:
- `app/[locale]/(main)/calculators/page.tsx` - Page with namespaces
- `app/[locale]/(main)/search/page.tsx` - Search page
- `components/header.tsx` - Client component with translations





