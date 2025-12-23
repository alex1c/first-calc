#!/usr/bin/env tsx

/**
 * Smoke test checklist for legacy routes
 * Prints a list of test URLs to manually verify after deployment
 */

const legacyRoutes = [
	'chislo-propisyu',
	'numbers-to-words',
	'roman-numerals-converter',
	'percentage-of-a-number',
	'add-subtract-percentage',
	'factors',
	'number-format/in',
]

/**
 * Generate test URLs for a legacy route
 */
function generateTestUrls(route: string): string[] {
	const urls: string[] = []

	// Base route
	urls.push(`/${route}`)

	// Route with number (for routes that accept numbers)
	if (route === 'factors' || route === 'number-format/in') {
		// Generate sample numbers
		for (let i = 10000; i <= 19999; i += 1000) {
			if (route === 'factors') {
				urls.push(`/${route}/${i}`)
			} else if (route === 'number-format/in') {
				urls.push(`/${route}/${i}`)
			}
		}
	} else {
		// For catch-all routes, add some sample slugs
		const sampleSlugs = ['123', '456', 'test', 'example']
		sampleSlugs.forEach((slug) => {
			urls.push(`/${route}/${slug}`)
		})
	}

	return urls
}

/**
 * Main function
 */
function main() {
	console.log('='.repeat(60))
	console.log('LEGACY ROUTES SMOKE TEST CHECKLIST')
	console.log('='.repeat(60))
	console.log('')
	console.log('Test these URLs manually after deployment:')
	console.log('')

	let totalUrls = 0

	for (const route of legacyRoutes) {
		console.log(`\n📍 ${route.toUpperCase()}`)
		const urls = generateTestUrls(route)
		urls.forEach((url) => {
			console.log(`   ✓ ${url}`)
			totalUrls++
		})
	}

	console.log('')
	console.log('='.repeat(60))
	console.log(`Total test URLs: ${totalUrls}`)
	console.log('='.repeat(60))
	console.log('')
	console.log('Instructions:')
	console.log('1. Deploy the application')
	console.log('2. Open each URL in a browser')
	console.log('3. Verify that pages load correctly (not 404)')
	console.log('4. Check that legacy pages display content properly')
	console.log('')
}

main()






