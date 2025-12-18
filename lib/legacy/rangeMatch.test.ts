/**
 * Unit tests for range matching regex
 * Tests that only numeric ranges match the pattern
 */

/**
 * Check if pathname matches numeric range pattern
 * Matches patterns like: /10000-19999 or /210000-219999/213500-213549
 * 
 * @param pathname - The request pathname
 * @returns true if pathname matches numeric range pattern
 */
export function isNumericRange(pathname: string): boolean {
	// Remove leading slash and trailing slash if present
	const cleanPath = pathname.replace(/^\/|\/$/g, '')
	// Match pattern: digits-digits optionally followed by /digits-digits (repeated)
	const rangePattern = /^\d+-\d+(\/\d+-\d+)*$/
	return rangePattern.test(cleanPath)
}

// Test cases
if (require.main === module) {
	const testCases = [
		// Should match
		{ path: '/10000-19999', expected: true },
		{ path: '/10000-19999/', expected: true },
		{ path: '/210000-219999/213500-213549', expected: true },
		{ path: '/1-100/50-75/60-65', expected: true },
		{ path: '/0-999', expected: true },
		
		// Should NOT match
		{ path: '/numbers-to-words', expected: false },
		{ path: '/chislo-propisyu', expected: false },
		{ path: '/root-calculator', expected: false },
		{ path: '/percentage-of-a-number', expected: false },
		{ path: '/add-subtract-percentage', expected: false },
		{ path: '/roman-numerals-converter', expected: false },
		{ path: '/calculators', expected: false },
		{ path: '/10000-19999-extra', expected: false },
		{ path: '/abc-123', expected: false },
		{ path: '/123-abc', expected: false },
		{ path: '/10000', expected: false },
		{ path: '/10000-', expected: false },
		{ path: '/-19999', expected: false },
		{ path: '/10000-19999/extra', expected: false },
	]

	console.log('Testing range matching regex...\n')
	
	let passed = 0
	let failed = 0
	
	for (const testCase of testCases) {
		const result = isNumericRange(testCase.path)
		const status = result === testCase.expected ? '✓' : '✗'
		
		if (result === testCase.expected) {
			passed++
			console.log(`${status} ${testCase.path} → ${result} (expected ${testCase.expected})`)
		} else {
			failed++
			console.error(`${status} ${testCase.path} → ${result} (expected ${testCase.expected})`)
		}
	}
	
	console.log(`\nResults: ${passed} passed, ${failed} failed`)
	
	if (failed > 0) {
		process.exit(1)
	}
}

