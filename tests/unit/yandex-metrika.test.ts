import { describe, expect, it } from 'vitest'
import {
	GOOGLE_SITE_VERIFICATION,
	getYandexMetrikaBootstrap,
	YANDEX_METRIKA_COUNTER_ID,
	YANDEX_WEBMASTER_VERIFICATION,
} from '@/lib/analytics/yandex-metrika'

describe('Yandex integration', () => {
	it('keeps the approved Webmaster verification tokens', () => {
		expect(YANDEX_WEBMASTER_VERIFICATION).toBe('f30c8f5646bc778c')
		expect(GOOGLE_SITE_VERIFICATION).toBe(
			'rB_ti1z-IpbQfE0HD2zpdqvV9gFwjOy167-U9BUwX7E',
		)
	})

	it('initializes one deferred counter and records one explicit initial hit', () => {
		const bootstrap = getYandexMetrikaBootstrap()

		expect(YANDEX_METRIKA_COUNTER_ID).toBe(48325316)
		expect(bootstrap.match(/48325316, 'init'/g)).toHaveLength(1)
		expect(bootstrap.match(/48325316, 'hit'/g)).toHaveLength(1)
		expect(bootstrap.match(/mc\.yandex\.ru\/metrika\/tag\.js/g)).toHaveLength(1)
		expect(bootstrap).toContain('webvisor: true')
		expect(bootstrap).toContain('clickmap: true')
		expect(bootstrap).toContain('accurateTrackBounce: true')
		expect(bootstrap).toContain('trackLinks: true')
		expect(bootstrap).toContain('defer: true')
	})
})
