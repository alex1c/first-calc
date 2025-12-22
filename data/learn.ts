import type { LearnArticle } from '@/lib/content-types'

/**
 * Mock data for learn articles
 * In production, this would come from a CMS or database
 */
export const learnArticles: LearnArticle[] = [
	{
		id: 'understanding-percentages',
		slug: 'understanding-percentages',
		title: 'Understanding Percentages: A Complete Guide',
		description:
			'Learn how percentages work, how to calculate them, and how to use them in everyday life. This comprehensive guide covers everything from basic calculations to advanced applications.',
		content: `
# Understanding Percentages

Percentages are one of the most commonly used mathematical concepts in everyday life. From calculating discounts to understanding statistics, percentages help us make sense of numbers in relation to a whole.

## What is a Percentage?

A percentage is a way of expressing a number as a fraction of 100. The word "percent" comes from the Latin "per centum," meaning "by the hundred."

## Basic Percentage Calculations

### Calculating a Percentage of a Number

To find what percentage a number represents of another number, use the formula:

\`\`\`
Percentage = (Part / Whole) × 100
\`\`\`

### Finding a Percentage of a Number

To find a certain percentage of a number:

\`\`\`
Result = (Number × Percentage) / 100
\`\`\`

## Common Applications

- **Discounts**: Calculate sale prices and savings
- **Tips**: Determine appropriate tip amounts
- **Taxes**: Calculate tax amounts and totals
- **Statistics**: Understand data and trends
- **Growth**: Measure increases and decreases

## Tips for Working with Percentages

1. Always convert percentages to decimals when doing calculations
2. Remember that 100% represents the whole
3. Percentages can be greater than 100% for increases
4. Use calculators for complex percentage problems
		`,
		category: 'math',
		relatedCalculatorIds: ['percentage-of-a-number'],
		meta: {
			author: 'Calculator Portal Team',
			publishedDate: '2024-01-15',
			keywords: ['percentage', 'math', 'calculation', 'guide'],
		},
	},
	{
		id: 'loan-basics',
		slug: 'loan-basics',
		title: 'Loan Basics: Understanding Interest and Payments',
		description:
			'Everything you need to know about loans, interest rates, and payment calculations. Learn how loans work and how to calculate your payments.',
		content: `
# Loan Basics: Understanding Interest and Payments

Loans are a fundamental part of personal and business finance. Understanding how loans work can help you make better financial decisions.

## What is a Loan?

A loan is money borrowed from a lender that must be repaid with interest over a specified period. The amount borrowed is called the principal.

## Key Loan Terms

- **Principal**: The original amount borrowed
- **Interest Rate**: The cost of borrowing, expressed as a percentage
- **Term**: The length of time to repay the loan
- **Monthly Payment**: The amount paid each month

## How Loan Payments are Calculated

Loan payments are calculated using the standard loan formula, which accounts for:
- The principal amount
- The interest rate
- The loan term
- Compounding frequency

## Types of Loans

- **Fixed-Rate Loans**: Interest rate stays the same
- **Variable-Rate Loans**: Interest rate can change
- **Amortizing Loans**: Payments include both principal and interest
- **Interest-Only Loans**: Payments cover only interest initially

## Tips for Borrowers

1. Compare interest rates from multiple lenders
2. Understand the total cost of the loan
3. Consider the loan term carefully
4. Read all terms and conditions
5. Use loan calculators to estimate payments
		`,
		category: 'finance',
		relatedCalculatorIds: ['loan-payment', 'compound-interest'],
		meta: {
			author: 'Calculator Portal Team',
			publishedDate: '2024-02-01',
			keywords: ['loan', 'finance', 'interest', 'payment'],
		},
	},
	{
		id: 'compound-interest-explained',
		slug: 'compound-interest-explained',
		title: 'Compound Interest: The Eighth Wonder of the World',
		description:
			'Discover how compound interest works and why it\'s called the eighth wonder of the world. Learn how to maximize your investment returns.',
		content: `
# Compound Interest: The Eighth Wonder of the World

Albert Einstein is often credited with calling compound interest "the eighth wonder of the world." Whether he said it or not, the concept is powerful.

## What is Compound Interest?

Compound interest is interest calculated on the initial principal and also on the accumulated interest from previous periods. This means your money grows faster over time.

## How Compound Interest Works

Unlike simple interest, which is calculated only on the principal, compound interest is calculated on:
- The principal amount
- Previously earned interest

This creates a snowball effect where your investment grows exponentially.

## The Formula

\`\`\`
A = P(1 + r/n)^(nt)
\`\`\`

Where:
- A = Final amount
- P = Principal
- r = Annual interest rate (as decimal)
- n = Compounding frequency per year
- t = Time in years

## Key Factors

1. **Time**: The longer you invest, the more compound interest works in your favor
2. **Rate**: Higher interest rates mean faster growth
3. **Frequency**: More frequent compounding increases returns
4. **Principal**: Starting with more money accelerates growth

## Real-World Examples

- Savings accounts with monthly compounding
- Investment accounts with daily compounding
- Retirement accounts with long-term growth
		`,
		category: 'finance',
		relatedCalculatorIds: ['compound-interest', 'loan-payment'],
		meta: {
			author: 'Calculator Portal Team',
			publishedDate: '2024-02-15',
			keywords: ['compound interest', 'investment', 'savings', 'growth'],
		},
	},
]

/**
 * Get article by slug
 */
export function getArticleBySlug(slug: string): LearnArticle | undefined {
	return learnArticles.find((article) => article.slug === slug)
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): LearnArticle[] {
	return learnArticles.filter((article) => article.category === category)
}

/**
 * Get all articles
 */
export function getAllArticles(): LearnArticle[] {
	return learnArticles
}








