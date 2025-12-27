/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['./tests/setup.ts'],
		include: ['tests/**/*.{test,spec}.{ts,tsx}'],
		exclude: ['node_modules', '.next', 'e2e'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'tests/',
				'e2e/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/mockData',
				'**/__tests__',
			],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './'),
		},
	},
	esbuild: {
		jsx: 'automatic',
	},
})

