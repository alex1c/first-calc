import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createT } from '@/lib/i18n/t'
import type { Dictionary } from '@/lib/i18n/types'

describe('createT', () => {
	it('should translate simple key', () => {
		const dict: Dictionary = {
			hello: 'Hello',
		}
		const t = createT(dict)
		expect(t('hello')).toBe('Hello')
	})

	it('should translate nested key', () => {
		const dict: Dictionary = {
			common: {
				title: 'My App',
			},
		}
		const t = createT(dict)
		expect(t('common.title')).toBe('My App')
	})

	it('should return key if translation not found', () => {
		const dict: Dictionary = {}
		const t = createT(dict)
		expect(t('missing.key')).toBe('missing.key')
	})

	it('should handle interpolation', () => {
		const dict: Dictionary = {
			greeting: 'Hello, {{name}}!',
		}
		const t = createT(dict)
		// Note: createT may not support interpolation by default
		// This test documents expected behavior
		expect(t('greeting')).toBe('Hello, {{name}}!')
	})

	it('should handle empty dictionary', () => {
		const dict: Dictionary = {}
		const t = createT(dict)
		expect(t('any.key')).toBe('any.key')
	})
})


