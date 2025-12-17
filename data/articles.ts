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
	// How to calculate compound interest (EN)
	{
		id: 'how-to-calculate-compound-interest',
		slug: 'how-to-calculate-compound-interest',
		locale: 'en',
		title: 'How to Calculate Compound Interest',
		shortDescription:
			'Learn how to calculate compound interest step by step. Understand the power of compounding and how it grows your investments over time.',
		contentHtml: `
			<h2>Understanding Compound Interest</h2>
			<p>Compound interest is one of the most powerful concepts in finance. Unlike simple interest, which is calculated only on the principal amount, compound interest is calculated on both the principal and the accumulated interest from previous periods. This creates exponential growth over time.</p>
			
			<p>Albert Einstein is often credited with calling compound interest "the eighth wonder of the world." Whether he said it or not, the concept is indeed powerful and can significantly impact your savings and investments.</p>
			
			<h3>The Compound Interest Formula</h3>
			<p>The formula for calculating compound interest is:</p>
			<pre><code>A = P(1 + r/n)^(nt)</code></pre>
			<p>Where:</p>
			<ul>
				<li><strong>A</strong> = Final amount (principal + interest)</li>
				<li><strong>P</strong> = Principal (initial amount)</li>
				<li><strong>r</strong> = Annual interest rate (as a decimal)</li>
				<li><strong>n</strong> = Number of times interest is compounded per year</li>
				<li><strong>t</strong> = Time in years</li>
			</ul>
			
			<h3>Step-by-Step Calculation</h3>
			<p>Let's calculate compound interest for $1,000 invested at 5% annual interest, compounded monthly, for 10 years:</p>
			<ol>
				<li>Principal (P) = $1,000</li>
				<li>Annual rate (r) = 5% = 0.05</li>
				<li>Compounding frequency (n) = 12 (monthly)</li>
				<li>Time (t) = 10 years</li>
				<li>Calculation: A = 1000(1 + 0.05/12)^(12×10)</li>
				<li>Result: A = $1,647.01</li>
			</ol>
			
			<h3>Key Factors Affecting Compound Interest</h3>
			<p>Several factors influence how much your money grows with compound interest:</p>
			<ul>
				<li><strong>Principal Amount:</strong> The more you invest initially, the more you'll earn</li>
				<li><strong>Interest Rate:</strong> Higher rates mean faster growth</li>
				<li><strong>Compounding Frequency:</strong> More frequent compounding (daily vs. annually) increases returns</li>
				<li><strong>Time:</strong> The longer you invest, the more compound interest works in your favor</li>
			</ul>
			
			<h3>Compound Interest vs. Simple Interest</h3>
			<p>Simple interest is calculated only on the principal: I = P × r × t. With the same $1,000 at 5% for 10 years, simple interest would give you $500 in interest, for a total of $1,500. Compound interest gives you $647.01 in interest, for a total of $1,647.01 - that's 29% more!</p>
			
			<h3>Practical Applications</h3>
			<p>Compound interest is used in:</p>
			<ul>
				<li>Savings accounts with monthly or daily compounding</li>
				<li>Investment accounts and retirement funds</li>
				<li>Loan calculations (where you pay compound interest)</li>
				<li>Long-term financial planning</li>
			</ul>
		`,
		relatedCalculatorIds: ['compound-interest', 'roi-calculator'],
		relatedStandardIds: [],
		meta: {
			keywords: ['compound interest', 'investment', 'savings', 'finance', 'calculation'],
			author: 'FirstCalc',
			publishedDate: '2024-01-15',
		},
	},
	// What is annuity formula (EN)
	{
		id: 'what-is-annuity-formula',
		slug: 'what-is-annuity-formula',
		locale: 'en',
		title: 'What is Annuity Formula?',
		shortDescription:
			'Learn about the annuity formula used to calculate loan payments, mortgage payments, and regular investment contributions.',
		contentHtml: `
			<h2>Understanding the Annuity Formula</h2>
			<p>The annuity formula is a fundamental equation in finance used to calculate the periodic payment amount for loans, mortgages, and annuities. It's also known as the loan payment formula or the present value of annuity formula.</p>
			
			<p>An annuity is a series of equal payments made at regular intervals. The annuity formula helps determine how much each payment should be, given the principal amount, interest rate, and number of payments.</p>
			
			<h3>The Annuity Formula</h3>
			<p>The formula for calculating the periodic payment (PMT) is:</p>
			<pre><code>PMT = P × [r(1+r)^n] / [(1+r)^n - 1]</code></pre>
			<p>Where:</p>
			<ul>
				<li><strong>PMT</strong> = Periodic payment amount</li>
				<li><strong>P</strong> = Principal (loan amount or present value)</li>
				<li><strong>r</strong> = Periodic interest rate (annual rate / number of periods per year)</li>
				<li><strong>n</strong> = Total number of payments</li>
			</ul>
			
			<h3>How It Works</h3>
			<p>The annuity formula calculates the fixed payment needed to pay off a loan over a specified period, including both principal and interest. Each payment includes:</p>
			<ul>
				<li>A portion that goes toward paying interest</li>
				<li>A portion that goes toward reducing the principal</li>
			</ul>
			
			<h3>Example Calculation</h3>
			<p>Calculate the monthly payment for a $200,000 mortgage at 4% annual interest for 30 years:</p>
			<ol>
				<li>Principal (P) = $200,000</li>
				<li>Monthly rate (r) = 4% / 12 = 0.003333</li>
				<li>Number of payments (n) = 30 × 12 = 360</li>
				<li>PMT = 200,000 × [0.003333(1.003333)^360] / [(1.003333)^360 - 1]</li>
				<li>Result: PMT = $954.83 per month</li>
			</ol>
			
			<h3>Key Characteristics</h3>
			<ul>
				<li><strong>Fixed Payments:</strong> Each payment is the same amount</li>
				<li><strong>Amortization:</strong> Early payments are mostly interest; later payments are mostly principal</li>
				<li><strong>Total Cost:</strong> The total amount paid exceeds the principal due to interest</li>
			</ul>
			
			<h3>Applications</h3>
			<p>The annuity formula is used for:</p>
			<ul>
				<li>Mortgage payments</li>
				<li>Auto loans</li>
				<li>Personal loans</li>
				<li>Retirement annuity calculations</li>
				<li>Lease payments</li>
			</ul>
		`,
		relatedCalculatorIds: ['loan-payment', 'compound-interest'],
		relatedStandardIds: [],
		meta: {
			keywords: ['annuity', 'loan payment', 'mortgage', 'formula', 'finance'],
			author: 'FirstCalc',
			publishedDate: '2024-01-20',
		},
	},
	// How to calculate ROI (EN)
	{
		id: 'how-to-calculate-roi',
		slug: 'how-to-calculate-roi',
		locale: 'en',
		title: 'How to Calculate ROI',
		shortDescription:
			'Learn how to calculate Return on Investment (ROI) to measure the profitability and efficiency of your investments.',
		contentHtml: `
			<h2>Understanding ROI</h2>
			<p>Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment. It measures how much profit or loss you've made relative to your initial investment, expressed as a percentage.</p>
			
			<p>ROI is one of the most commonly used metrics in finance because it's simple to calculate and easy to understand. It helps investors compare different investment opportunities and make informed decisions.</p>
			
			<h3>The ROI Formula</h3>
			<p>The basic ROI formula is:</p>
			<pre><code>ROI = [(Final Value - Initial Investment) / Initial Investment] × 100%</code></pre>
			<p>Or more simply:</p>
			<pre><code>ROI = (Profit / Initial Investment) × 100%</code></pre>
			<p>Where:</p>
			<ul>
				<li><strong>Final Value</strong> = Current or final value of the investment</li>
				<li><strong>Initial Investment</strong> = Amount originally invested</li>
				<li><strong>Profit</strong> = Final Value - Initial Investment</li>
			</ul>
			
			<h3>Step-by-Step Calculation</h3>
			<p>Let's calculate ROI for an investment:</p>
			<ol>
				<li>You invested $10,000 in a stock</li>
				<li>The stock is now worth $15,000</li>
				<li>Profit = $15,000 - $10,000 = $5,000</li>
				<li>ROI = ($5,000 / $10,000) × 100% = 50%</li>
			</ol>
			
			<h3>Interpreting ROI Results</h3>
			<ul>
				<li><strong>Positive ROI:</strong> Indicates a profit. Higher values mean better returns.</li>
				<li><strong>Negative ROI:</strong> Indicates a loss. The investment decreased in value.</li>
				<li><strong>Zero ROI:</strong> Break-even point. No profit or loss.</li>
			</ul>
			
			<h3>What is a Good ROI?</h3>
			<p>A "good" ROI depends on several factors:</p>
			<ul>
				<li><strong>Investment Type:</strong> Stocks might aim for 7-10% annually, while real estate could target 8-12%</li>
				<li><strong>Risk Level:</strong> Higher risk investments typically require higher ROI to justify the risk</li>
				<li><strong>Time Period:</strong> ROI should be considered relative to the investment duration</li>
				<li><strong>Market Conditions:</strong> ROI expectations vary with economic conditions</li>
			</ul>
			
			<h3>Limitations of ROI</h3>
			<p>While ROI is useful, it has limitations:</p>
			<ul>
				<li><strong>No Time Consideration:</strong> Basic ROI doesn't account for how long the investment took</li>
				<li><strong>No Risk Adjustment:</strong> Doesn't consider the risk level of the investment</li>
				<li><strong>Cash Flows:</strong> Doesn't account for intermediate cash flows or dividends</li>
			</ul>
			
			<h3>Annualized ROI</h3>
			<p>To compare investments over different time periods, use annualized ROI:</p>
			<pre><code>Annualized ROI = [(1 + ROI)^(1/years) - 1] × 100%</code></pre>
			<p>This gives you the equivalent annual return rate.</p>
		`,
		relatedCalculatorIds: ['roi-calculator', 'compound-interest', 'inflation-adjustment'],
		relatedStandardIds: [],
		meta: {
			keywords: ['roi', 'return on investment', 'profit', 'finance', 'investment'],
			author: 'FirstCalc',
			publishedDate: '2024-01-25',
		},
	},
	// How to calculate area of a circle (EN)
	{
		id: 'how-to-calculate-area-of-a-circle',
		slug: 'how-to-calculate-area-of-a-circle',
		locale: 'en',
		title: 'How to Calculate Area of a Circle',
		shortDescription:
			'Learn how to calculate the area of a circle using the radius or diameter. Step-by-step guide with examples.',
		contentHtml: `
			<h2>Understanding Circle Area</h2>
			<p>The area of a circle is the amount of space enclosed within its boundary. Calculating the area of a circle is a fundamental skill in geometry and is used in many real-world applications, from calculating the area of a pizza to determining the size of circular fields or pools.</p>
			
			<p>The formula for calculating the area of a circle has been known for thousands of years and is one of the most important formulas in mathematics.</p>
			
			<h3>The Circle Area Formula</h3>
			<p>The formula for calculating the area of a circle is:</p>
			<pre><code>A = π × r²</code></pre>
			<p>Where:</p>
			<ul>
				<li><strong>A</strong> = Area of the circle</li>
				<li><strong>π</strong> (pi) = Approximately 3.14159 (a mathematical constant)</li>
				<li><strong>r</strong> = Radius of the circle (distance from center to edge)</li>
			</ul>
			
			<h3>Using the Radius</h3>
			<p>If you know the radius, simply plug it into the formula:</p>
			<ol>
				<li>Square the radius (multiply it by itself)</li>
				<li>Multiply the result by π (pi)</li>
				<li>The answer is the area in square units</li>
			</ol>
			<p><strong>Example:</strong> For a circle with radius 5 meters:</p>
			<ul>
				<li>r² = 5 × 5 = 25</li>
				<li>A = π × 25 ≈ 3.14159 × 25 ≈ 78.54 m²</li>
			</ul>
			
			<h3>Using the Diameter</h3>
			<p>If you only know the diameter (the distance across the circle through the center), you can still calculate the area:</p>
			<ol>
				<li>Divide the diameter by 2 to get the radius</li>
				<li>Use the standard formula: A = π × r²</li>
			</ol>
			<p>Or use the diameter directly:</p>
			<pre><code>A = π × (d/2)² = π × d²/4</code></pre>
			<p><strong>Example:</strong> For a circle with diameter 10 meters:</p>
			<ul>
				<li>Radius = 10 / 2 = 5 meters</li>
				<li>A = π × 5² ≈ 78.54 m²</li>
			</ul>
			
			<h3>Understanding π (Pi)</h3>
			<p>Pi (π) is a mathematical constant representing the ratio of a circle's circumference to its diameter. It's approximately 3.14159, but it's an irrational number with infinite decimal places. For most calculations, using 3.14 or 3.14159 is sufficient.</p>
			
			<h3>Real-World Applications</h3>
			<p>Calculating circle area is used in:</p>
			<ul>
				<li><strong>Construction:</strong> Calculating material needed for circular structures</li>
				<li><strong>Landscaping:</strong> Determining area of circular gardens or pools</li>
				<li><strong>Manufacturing:</strong> Calculating material usage for circular products</li>
				<li><strong>Science:</strong> Various calculations in physics and engineering</li>
			</ul>
			
			<h3>Common Mistakes to Avoid</h3>
			<ul>
				<li>Don't forget to square the radius (multiply by itself)</li>
				<li>Make sure to use the radius, not the diameter, in the formula</li>
				<li>Remember to include the correct units (square units for area)</li>
				<li>Use a consistent value for π throughout your calculation</li>
			</ul>
		`,
		relatedCalculatorIds: ['area-circle', 'area-rectangle', 'square-root'],
		relatedStandardIds: ['iso-80000'],
		meta: {
			keywords: ['circle', 'area', 'geometry', 'pi', 'radius', 'diameter'],
			author: 'FirstCalc',
			publishedDate: '2024-02-01',
		},
	},
	// Guide: percentage calculations for beginners (EN)
	{
		id: 'guide-percentage-calculations-for-beginners',
		slug: 'guide-percentage-calculations-for-beginners',
		locale: 'en',
		title: 'Guide: Percentage Calculations for Beginners',
		shortDescription:
			'A comprehensive beginner-friendly guide to understanding and calculating percentages. Learn the basics and common applications.',
		contentHtml: `
			<h2>Introduction to Percentages</h2>
			<p>Percentages are everywhere in daily life - from discounts at stores to tips at restaurants, from test scores to interest rates. Understanding how to work with percentages is an essential skill that will help you make better financial decisions and solve everyday problems.</p>
			
			<p>A percentage is simply a way of expressing a number as a fraction of 100. The word "percent" comes from the Latin "per centum," meaning "by the hundred." When you see 50%, it means 50 out of 100, or 50/100, which equals 0.5 or 1/2.</p>
			
			<h3>Basic Percentage Concepts</h3>
			<p>Before diving into calculations, let's understand the key concepts:</p>
			<ul>
				<li><strong>Percent (%):</strong> A symbol meaning "out of 100"</li>
				<li><strong>Base:</strong> The whole amount you're calculating a percentage of</li>
				<li><strong>Percentage:</strong> The part or portion of the base</li>
				<li><strong>Rate:</strong> The percentage value itself (e.g., 20% means rate is 20)</li>
			</ul>
			
			<h3>Three Main Types of Percentage Problems</h3>
			<p>There are three main types of percentage calculations you'll encounter:</p>
			
			<h4>1. Finding a Percentage of a Number</h4>
			<p>This is the most common type: "What is 20% of 100?"</p>
			<p><strong>Formula:</strong> Percentage = (Number × Rate) / 100</p>
			<p><strong>Example:</strong> What is 20% of 100?</p>
			<ul>
				<li>Percentage = (100 × 20) / 100 = 20</li>
			</ul>
			
			<h4>2. Finding What Percentage One Number Is of Another</h4>
			<p>This type asks: "What percentage is 25 of 100?"</p>
			<p><strong>Formula:</strong> Rate = (Part / Whole) × 100</p>
			<p><strong>Example:</strong> What percentage is 25 of 100?</p>
			<ul>
				<li>Rate = (25 / 100) × 100 = 25%</li>
			</ul>
			
			<h4>3. Finding a Number When a Percentage Is Known</h4>
			<p>This type asks: "25 is 20% of what number?"</p>
			<p><strong>Formula:</strong> Number = (Part / Rate) × 100</p>
			<p><strong>Example:</strong> 25 is 20% of what number?</p>
			<ul>
				<li>Number = (25 / 20) × 100 = 125</li>
			</ul>
			
			<h3>Quick Percentage Tricks</h3>
			<p>Here are some shortcuts that can make percentage calculations easier:</p>
			<ul>
				<li><strong>10%:</strong> Move the decimal point one place to the left (10% of 250 = 25)</li>
				<li><strong>50%:</strong> Divide by 2 (50% of 200 = 100)</li>
				<li><strong>25%:</strong> Divide by 4 (25% of 100 = 25)</li>
				<li><strong>5%:</strong> Find 10% and divide by 2 (5% of 200 = 10)</li>
				<li><strong>1%:</strong> Move the decimal point two places to the left (1% of 500 = 5)</li>
			</ul>
			
			<h3>Common Real-World Applications</h3>
			<p>Percentages are used in many everyday situations:</p>
			<ul>
				<li><strong>Discounts:</strong> Calculating sale prices (20% off means you pay 80% of original price)</li>
				<li><strong>Tips:</strong> Calculating gratuity (15-20% of the bill)</li>
				<li><strong>Taxes:</strong> Calculating tax amounts (sales tax, income tax)</li>
				<li><strong>Interest:</strong> Understanding interest rates on loans and savings</li>
				<li><strong>Grades:</strong> Calculating test scores and final grades</li>
				<li><strong>Statistics:</strong> Understanding data and survey results</li>
			</ul>
			
			<h3>Percentage Increase and Decrease</h3>
			<p>To calculate percentage increase or decrease:</p>
			<p><strong>Formula:</strong> Percentage Change = [(New Value - Old Value) / Old Value] × 100</p>
			<p><strong>Example:</strong> A price increased from $100 to $120. What's the percentage increase?</p>
			<ul>
				<li>Change = [(120 - 100) / 100] × 100 = 20%</li>
			</ul>
			
			<h3>Practice Tips</h3>
			<ul>
				<li>Always convert percentages to decimals when doing calculations (20% = 0.20)</li>
				<li>Remember that 100% represents the whole</li>
				<li>Percentages can be greater than 100% for increases</li>
				<li>Use calculators for complex percentage problems</li>
				<li>Double-check your work by estimating the answer first</li>
			</ul>
		`,
		relatedCalculatorIds: ['percentage-of-a-number', 'add-subtract-percentage'],
		relatedStandardIds: [],
		meta: {
			keywords: ['percentage', 'calculation', 'math', 'beginner', 'guide', 'tutorial'],
			author: 'FirstCalc',
			publishedDate: '2024-02-05',
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




