import { useState } from 'react'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { useClientT } from '@/lib/i18n/useClientT'

afterEach(() => {
	cleanup()
})

function InlineNamespaceConsumer() {
	const [count, setCount] = useState(0)
	const t = useClientT('en', ['footer'])

	return (
		<button type="button" onClick={() => setCount(value => value + 1)}>
			{t('footer.copyLink')} {count}
		</button>
	)
}

describe('useClientT', () => {
	it('does not reload namespaces indefinitely when callers pass an inline array', async () => {
		const user = userEvent.setup()
		render(<InlineNamespaceConsumer />)

		const button = await waitFor(() =>
			screen.getByRole('button', { name: /Copy link/i }),
		)
		expect(button).toHaveTextContent('Copy link 0')
		await act(async () => user.click(button))
		expect(button).toHaveTextContent('Copy link 1')
	})
})
