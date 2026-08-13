import { useState } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useClientT } from '@/lib/i18n/useClientT'

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

		await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Copy link 0'))
		await act(async () => user.click(screen.getByRole('button')))
		expect(screen.getByRole('button')).toHaveTextContent('Copy link 1')
	})
})
