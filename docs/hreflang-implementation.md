# Hreflang Implementation Guide

## Overview

Hreflang tags help search engines understand which language version of a page to show to users. This document outlines the implementation strategy for hreflang in the Calculator Portal.

## Implementation Strategy

### 1. Using Next.js Metadata API (Recommended)

The best approach for Next.js App Router is to use the `generateMetadata` function with `alternates.languages`. This is already implemented in:

- `app/[locale]/page.tsx` - Home page
- `app/[locale]/(main)/calculators/[category]/[slug]/page.tsx` - Calculator pages
- Legacy pages (chislo-propisyu, numbers-to-words, roman-numerals-converter)

### 2. Helper Functions

Created utility functions in `lib/hreflang.ts`:

- `generateHreflangLinks(path)` - Generates array of hreflang links
- `generateHreflangMetadata(path)` - Generates metadata object for Next.js Metadata API

### 3. Implementation Pattern

For each page that needs hreflang:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, ...otherParams } = params
  
  return {
    title: 'Page Title',
    description: 'Page description',
    alternates: {
      languages: {
        en: `/en/path`,
        ru: `/ru/path`,
        es: `/es/path`,
        tr: `/tr/path`,
        hi: `/hi/path`,
      },
    },
  }
}
```

### 4. Dynamic Paths

For dynamic paths (like calculators with category/slug), construct the path:

```typescript
alternates: {
  languages: {
    en: `/en/calculators/${category}/${slug}`,
    ru: `/ru/calculators/${category}/${slug}`,
    // ... other locales
  },
}
```

### 5. Legacy Routes

For legacy routes with catch-all slugs:

```typescript
alternates: {
  languages: {
    en: `/en/legacy-route/${slug.join('/')}`,
    ru: `/ru/legacy-route/${slug.join('/')}`,
    // ... other locales
  },
}
```

## Current Implementation Status

✅ **Implemented:**
- Home page (`/`)
- Calculator pages (`/calculators/[category]/[slug]`)
- Legacy pages:
  - `/chislo-propisyu/[...slug]`
  - `/numbers-to-words/[...slug]`
  - `/roman-numerals-converter/[...slug]`

⏳ **To be implemented:**
- Standards pages (`/standards/[country]/[standardSlug]`)
- Learn pages (`/learn/[slug]`)
- Other legacy routes

## Best Practices

1. **Always include x-default**: Points to the default locale (English)
2. **Self-referential link**: Each page should include a link to itself
3. **Consistent URLs**: Ensure all locale versions have the same structure
4. **Canonical URLs**: Consider adding canonical tags alongside hreflang

## Testing

To verify hreflang implementation:

1. View page source and check `<head>` section
2. Look for `<link rel="alternate" hreflang="..." href="...">` tags
3. Verify all locale versions are present
4. Check that x-default is included

## Example Output

```html
<link rel="alternate" hreflang="en" href="https://calculator-portal.com/en/calculators/math/percentage-of-a-number" />
<link rel="alternate" hreflang="ru" href="https://calculator-portal.com/ru/calculators/math/percentage-of-a-number" />
<link rel="alternate" hreflang="es" href="https://calculator-portal.com/es/calculators/math/percentage-of-a-number" />
<link rel="alternate" hreflang="tr" href="https://calculator-portal.com/tr/calculators/math/percentage-of-a-number" />
<link rel="alternate" hreflang="hi" href="https://calculator-portal.com/hi/calculators/math/percentage-of-a-number" />
<link rel="alternate" hreflang="x-default" href="https://calculator-portal.com/en/calculators/math/percentage-of-a-number" />
```

## Future Enhancements

1. **Regional variants**: Add region-specific variants (e.g., en-US, en-GB)
2. **Auto-detection**: Automatically detect user's preferred language
3. **Fallback logic**: Implement fallback for missing translations
4. **Sitemap integration**: Include hreflang in sitemap.xml








