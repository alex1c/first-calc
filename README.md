# First Calc - Calculator Portal

A comprehensive, multi-language calculator portal built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🧮 Calculators
- **DSL/JSON Schema** - Create calculators without modifying React components
- **Multi-language support** - English, Russian, Spanish, Turkish, Hindi
- **Categories** - Finance, Math, Everyday, Engineering, Business
- **Auto-generated content** - How-to guides, FAQ, examples
- **Related calculators** - Smart cross-linking

### 📚 Standards
- International and national standards
- Formulas and reference tables
- Links to related calculators

### 📖 Learn
- Educational articles
- Step-by-step guides
- Related calculators and standards

### 🔧 Legacy Tools
- Number to words (RU/EN)
- Roman numerals converter
- Percentage calculators
- Factors calculator
- Indian number format
- Range calculations

### 🚀 Advanced Features
- **DSL/JSON Schema** for calculator definitions
- **CMS-ready architecture** - Easy integration with Headless CMS
- **REST API** - `/api/calculators` endpoints
- **Admin interface** - `/admin/calculators` for management
- **SEO optimized** - Metadata, sitemap, hreflang, Schema.org
- **Auto-content generation** - How-to, FAQ, examples

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest
- **Architecture**: Server Components, API Routes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Generate Calculator

```bash
# Generate calculator from JSON schema
npm run generate:calc <path-to-schema.json>
```

## Project Structure

```
app/
├── [locale]/              # Localized routes
│   ├── (main)/           # Main sections (calculators, standards, learn)
│   ├── (legacy)/         # Legacy tools
│   └── (marketing)/      # Marketing pages
├── api/                  # API routes
└── admin/                # Admin interface

lib/
├── calculators/          # Calculator engine (DSL, schema, loader)
├── registry/            # Universal data loader (CMS-ready)
├── content/             # Auto-content generator
├── navigation/          # Navigation and recommendations
├── legacy/              # Legacy tools logic
└── standards/           # Standards logic

data/
├── calculators.ts       # Calculator definitions
├── calculators/        # JSON schemas
├── standards.ts         # Standards definitions
└── articles.ts          # Articles definitions

components/
├── calculators/         # Calculator components
├── legacy/              # Legacy page components
└── schema/              # Schema.org components
```

## API Endpoints

- `GET /api/calculators` - List all calculators
- `GET /api/calculators/[id]` - Get calculator by ID
- `POST /api/calculators/[id]/calculate` - Perform calculation

## Calculator DSL

Calculators can be defined using JSON Schema:

```json
{
  "id": "calculator-id",
  "locale": "en",
  "category": "math",
  "slug": "calculator-slug",
  "title": "Calculator Title",
  "description": "Description",
  "inputs": [...],
  "outputs": [...],
  "formula": "value * percent / 100",
  "howTo": [...],
  "examples": [...],
  "faq": [...]
}
```

## Environment Variables

- `NEXT_PUBLIC_DATA_SOURCE` - Data source: `local` (default), `api`, `cms`
- `NEXT_PUBLIC_API_URL` - API URL for external data source

## SEO Features

- Dynamic metadata generation
- Sitemap with hreflang
- Schema.org structured data
- robots.txt configuration

## License

MIT

## Repository

https://github.com/alex1c/first-calc

