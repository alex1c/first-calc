import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { server } from './utils/msw-handlers'

// Freeze time for deterministic tests
beforeAll(() => {
	vi.setSystemTime(new Date('2024-01-15T10:00:00Z'))
})

// Reset time after each test
afterEach(() => {
	vi.useRealTimers()
	vi.setSystemTime(new Date('2024-01-15T10:00:00Z'))
})

// Setup MSW server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock Next.js router
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		refresh: vi.fn(),
	}),
	usePathname: () => '/',
	useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js Image component
vi.mock('next/image', () => {
	const React = require('react')
	return {
		default: (props: any) => React.createElement('img', props),
	}
})

// Suppress console errors in tests unless needed
const originalError = console.error
beforeAll(() => {
	console.error = (...args: any[]) => {
		if (
			typeof args[0] === 'string' &&
			(args[0].includes('Warning: ReactDOM.render') ||
				args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
		) {
			return
		}
		originalError.call(console, ...args)
	}
})

afterAll(() => {
	console.error = originalError
})

