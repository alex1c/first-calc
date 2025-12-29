# Testing Guide

This document describes the testing setup, how to run tests, and best practices for writing tests.

## Overview

This project uses a modern testing stack:

- **Vitest**: Unit and integration tests
- **Playwright**: End-to-end (E2E) tests
- **MSW (Mock Service Worker)**: API mocking for component tests
- **Testing Library**: React component testing utilities

## Test Structure

```
tests/
├── unit/              # Unit tests for pure functions
├── components/        # Component integration tests
├── api/              # API route tests
├── factories/        # Test data factories
└── utils/            # Test utilities and helpers

e2e/                  # Playwright E2E tests
├── *.spec.ts
```

## Running Tests

### Unit and Integration Tests (Vitest)

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Run All Tests

```bash
npm run test:all
```

This runs coverage tests followed by E2E tests.

## Writing Tests

### Unit Tests

Unit tests should test pure functions and helpers in isolation.

**Location**: `tests/unit/`

**Example**:
```typescript
import { describe, it, expect } from 'vitest'
import { executeFormula } from '@/lib/calculators/schema'

describe('executeFormula', () => {
  it('should execute simple addition', () => {
    const result = executeFormula('a + b', { a: 5, b: 3 })
    expect(result).toBe(8)
  })
})
```

### Component Tests

Component tests verify React component behavior using Testing Library.

**Location**: `tests/components/`

**Example**:
```typescript
import { render, screen } from '@testing-library/react'
import { CalculatorPage } from '@/components/calculator-page'

describe('CalculatorPage', () => {
  it('should render calculator inputs', () => {
    const calculator = createTestCalculator()
    render(<CalculatorPage calculator={calculator} locale="en" />)
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument()
  })
})
```

### API Route Tests

API route tests verify Next.js API route handlers.

**Location**: `tests/api/`

**Example**:
```typescript
import { GET } from '@/app/api/calculators/route'

describe('GET /api/calculators', () => {
  it('should return list of calculators', async () => {
    const request = new Request('http://localhost:3000/api/calculators')
    const response = await GET(request)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.calculators).toBeDefined()
  })
})
```

### E2E Tests

E2E tests verify full user flows in a real browser.

**Location**: `e2e/`

**Example**:
```typescript
import { test, expect } from '@playwright/test'

test('should load home page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/first-calc/i)
})
```

## Test Utilities

### Factories

Use factories to create test data consistently:

```typescript
import { createTestCalculator } from '../factories/calculator'

const calculator = createTestCalculator({
  id: 'my-calc',
  title: 'My Calculator',
})
```

### MSW Handlers

MSW is configured to mock API endpoints in component tests. Handlers are defined in `tests/utils/msw-handlers.ts`.

## Best Practices

### When to Write Unit vs Component vs E2E Tests

1. **Unit Tests**: Pure functions, utilities, helpers
   - Formula execution
   - Schema validation
   - Data transformations
   - i18n helpers

2. **Component Tests**: React component behavior
   - User interactions
   - Form validation
   - Conditional rendering
   - Props handling

3. **E2E Tests**: Critical user flows
   - Page navigation
   - Complete workflows
   - Cross-page interactions
   - SEO metadata

### Common Pitfalls

1. **Don't test implementation details**
   - ✅ Test: "User can calculate result"
   - ❌ Test: "calculate function is called with correct parameters"

2. **Keep tests deterministic**
   - Use `vi.setSystemTime()` for date-dependent tests
   - Mock external APIs
   - Avoid random data

3. **Don't over-mock**
   - Mock external dependencies (APIs, file system)
   - Don't mock internal functions unless necessary

4. **Use appropriate test types**
   - Don't use E2E for simple unit tests
   - Don't use unit tests for complex user flows

5. **Keep tests fast**
   - Unit tests should be < 10ms each
   - Component tests should be < 100ms each
   - E2E tests should be < 5s each

## CI/CD

Tests run automatically in CI:

1. Lint checks
2. i18n validation
3. Unit test coverage
4. Build
5. E2E tests

See `.github/workflows/ci.yml` for details.

## Debugging Tests

### Vitest

```bash
# Run specific test file
npm run test tests/unit/execute-formula.test.ts

# Run tests matching pattern
npm run test -- -t "should execute"
```

### Playwright

```bash
# Run in headed mode
npx playwright test --headed

# Run with debugger
npx playwright test --debug

# Show trace
npx playwright show-trace trace.zip
```

## Coverage

Coverage reports are generated with:

```bash
npm run test:coverage
```

Reports are available in `coverage/` directory. Aim for:
- Unit tests: > 80% coverage
- Critical paths: 100% coverage

## Troubleshooting

### Tests fail in CI but pass locally

- Check for timezone differences
- Verify all dependencies are installed
- Check for flaky tests (add retries)

### MSW not working

- Ensure MSW server is started in `tests/setup.ts`
- Check that handlers are defined correctly
- Verify request URLs match handler patterns

### Playwright tests timeout

- Increase timeout in `playwright.config.ts`
- Check that dev server is running
- Verify baseURL is correct

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)



