import { render, type RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import type { Locale } from '@/lib/i18n'

/**
 * Custom render function with providers
 * 
 * Wraps components with necessary providers for testing:
 * - i18n context
 * - Router mocks
 */
export function renderWithProviders(
	ui: ReactElement,
	options?: RenderOptions & { locale?: Locale },
) {
	const { locale = 'en', ...renderOptions } = options || {}

	// Mock i18n if needed
	const Wrapper = ({ children }: { children: React.ReactNode }) => {
		return <>{children}</>
	}

	return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'



