import type { ArticleDefinition } from '@/lib/learn/types'

/**
 * Registry of all article definitions
 * Add new articles here to make them available
 * Each article can have multiple locale versions with the same id
 */
export const articles: ArticleDefinition[] = [
	// How to calculate loan payment (EN)
	{
		id: 'how-to-calculate-loan-payment',
		slug: 'how-to-calculate-loan-payment',
		locale: 'en',
		title: 'How to Calculate Loan Payment',
		shortDescription:
			'Learn how to calculate your monthly loan payment using the standard loan formula.',
		contentHtml: `
			<h2>Understanding Loan Payments</h2>
			<p>Loan payments are calculated using the standard loan formula, also known as the annuity formula. This formula takes into account the principal amount, interest rate, and loan term.</p>
			
			<h3>The Formula</h3>
			<p>The monthly payment (M) is calculated as:</p>
			<pre><code>M = P × [r(1+r)^n] / [(1+r)^n - 1]</code></pre>
			<p>Where:</p>
			<ul>
				<li><strong>P</strong> = Principal (loan amount)</li>
				<li><strong>r</strong> = Monthly interest rate (annual rate / 12)</li>
				<li><strong>n</strong> = Number of payments (years × 12)</li>
			</ul>
			
			<h3>Example Calculation</h3>
			<p>For a $100,000 loan at 5% annual interest for 30 years:</p>
			<ul>
				<li>Principal: $100,000</li>
				<li>Monthly rate: 5% / 12 = 0.4167%</li>
				<li>Number of payments: 30 × 12 = 360</li>
				<li>Monthly payment: $536.82</li>
			</ul>
			
			<h3>Key Points</h3>
			<ul>
				<li>Higher interest rates increase monthly payments</li>
				<li>Longer loan terms reduce monthly payments but increase total interest</li>
				<li>Early payments go mostly toward interest</li>
			</ul>
		`,
		relatedCalculatorIds: ['loan-payment'],
		relatedStandardIds: ['eurocode-1'],
		meta: {
			keywords: ['loan', 'payment', 'mortgage', 'calculation', 'finance'],
			author: 'FirstCalc',
			publishedDate: '2024-01-01',
		},
	},
	// What is percentage of a number (EN)
	{
		id: 'what-is-percentage-of-a-number',
		slug: 'what-is-percentage-of-a-number',
		locale: 'en',
		title: 'What is Percentage of a Number',
		shortDescription:
			'Learn what percentage means and how to calculate a percentage of any number.',
		contentHtml: `
			<h2>Understanding Percentages</h2>
			<p>A percentage is a way of expressing a number as a fraction of 100. The word "percent" means "per hundred."</p>
			
			<h3>Basic Calculation</h3>
			<p>To calculate a percentage of a number, use the formula:</p>
			<pre><code>Percentage = (Number × Percent) / 100</code></pre>
			
			<h3>Examples</h3>
			<ul>
				<li><strong>20% of 100:</strong> (100 × 20) / 100 = 20</li>
				<li><strong>15% of 250:</strong> (250 × 15) / 100 = 37.5</li>
				<li><strong>7.5% of 1000:</strong> (1000 × 7.5) / 100 = 75</li>
			</ul>
			
			<h3>Common Uses</h3>
			<ul>
				<li><strong>Discounts:</strong> Calculate sale prices</li>
				<li><strong>Tips:</strong> Calculate gratuity amounts</li>
				<li><strong>Taxes:</strong> Calculate tax amounts</li>
				<li><strong>Commissions:</strong> Calculate earnings</li>
			</ul>
			
			<h3>Tips</h3>
			<ul>
				<li>To find 10%, simply move the decimal point one place to the left</li>
				<li>To find 50%, divide the number by 2</li>
				<li>To find 25%, divide the number by 4</li>
			</ul>
		`,
		relatedCalculatorIds: ['percentage-of-a-number', 'add-percentage', 'subtract-percentage'],
		meta: {
			keywords: ['percentage', 'calculation', 'math', 'discount', 'tip'],
			author: 'FirstCalc',
			publishedDate: '2024-01-02',
		},
	},
]

/**
 * Get article by ID and locale
 */
export function getArticleById(
	id: string,
	locale: string = 'en',
): ArticleDefinition | undefined {
	return articles.find((article) => article.id === id && article.locale === locale)
}

/**
 * Get article by slug and locale
 */
export function getArticleBySlug(
	slug: string,
	locale: string = 'en',
): ArticleDefinition | undefined {
	return articles.find(
		(article) => article.slug === slug && article.locale === locale,
	)
}

/**
 * Get all articles for a specific locale
 */
export function getArticlesByLocale(locale: string = 'en'): ArticleDefinition[] {
	return articles.filter((article) => article.locale === locale)
}

