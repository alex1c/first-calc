import Link from 'next/link'
import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { calculatorRegistry, standardRegistry } from '@/lib/registry/loader'
import { getLegacyToolsForCalculator } from '@/lib/links/legacyToCalculators'
import { getStandardsForCalculator } from '@/lib/standards/linking'
import { getRelatedByTags } from '@/lib/navigation/related-by-tags'
import { getRelatedByCluster } from '@/lib/navigation/related-by-cluster'
import { getClusterForCalculator } from '@/lib/navigation/math-clusters'
import { getRelatedByFinanceCluster } from '@/lib/navigation/related-by-finance-cluster'
import { getRelatedByHealthCluster } from '@/lib/navigation/related-by-health-cluster'
import { getRelatedByEverydayCluster } from '@/lib/navigation/related-by-everyday-cluster'

interface RelatedCalculatorsBlockProps {
	calculator: CalculatorDefinitionClient
	locale: string
}

/**
 * Get scenario-based links for a calculator
 * Returns 1-2 contextual recommendations with explanations
 */
async function getScenarioBasedLinks(
	calculator: CalculatorDefinitionClient,
	locale: string,
): Promise<Array<{ calculator: Awaited<ReturnType<typeof calculatorRegistry.getById>>, reason: string }>> {
	const scenarios: Array<{ calculator: Awaited<ReturnType<typeof calculatorRegistry.getById>>, reason: string }> = []

	// Health calculators
	if (calculator.category === 'health') {
		if (calculator.id === 'bmi-calculator') {
			const tdeeCalc = await calculatorRegistry.getById('daily-calorie-needs-calculator', locale)
			if (tdeeCalc) {
				scenarios.push({
					calculator: tdeeCalc,
					reason: 'If you want to know how many calories you need per day, use the Daily Calorie Needs Calculator.',
				})
			}
			const bodyFatCalc = await calculatorRegistry.getById('body-fat-percentage-calculator', locale)
			if (bodyFatCalc) {
				scenarios.push({
					calculator: bodyFatCalc,
					reason: 'BMI doesn\'t distinguish between fat and muscle. For a more detailed body composition analysis, try the Body Fat Percentage Calculator.',
				})
			}
		}
		if (calculator.id === 'bmr-calculator') {
			const tdeeCalc = await calculatorRegistry.getById('daily-calorie-needs-calculator', locale)
			if (tdeeCalc) {
				scenarios.push({
					calculator: tdeeCalc,
					reason: 'BMR is only a baseline. To estimate real daily needs, see the Daily Calorie Needs Calculator.',
				})
			}
		}
		if (calculator.id === 'daily-calorie-needs-calculator') {
			const macroCalc = await calculatorRegistry.getById('macronutrient-calculator', locale)
			if (macroCalc) {
				scenarios.push({
					calculator: macroCalc,
					reason: 'To turn calories into meals, use the Macronutrient Calculator.',
				})
			}
			const caloriesBurnedCalc = await calculatorRegistry.getById('calories-burned-calculator', locale)
			if (caloriesBurnedCalc) {
				scenarios.push({
					calculator: caloriesBurnedCalc,
					reason: 'Compare burned calories with your intake using the Daily Calorie Needs Calculator.',
				})
			}
		}
		if (calculator.id === 'ideal-weight-calculator') {
			const bmiCalc = await calculatorRegistry.getById('bmi-calculator', locale)
			if (bmiCalc) {
				scenarios.push({
					calculator: bmiCalc,
					reason: 'Ideal weight formulas only use height and sex. For a more comprehensive assessment that uses your actual weight, try the BMI Calculator.',
				})
			}
			const tdeeCalc = await calculatorRegistry.getById('daily-calorie-needs-calculator', locale)
			if (tdeeCalc) {
				scenarios.push({
					calculator: tdeeCalc,
					reason: 'Once you know your ideal weight range, use the Daily Calorie Needs Calculator to find out how many calories you need to reach or maintain that weight.',
				})
			}
		}
		if (calculator.id === 'body-fat-percentage-calculator') {
			const bmiCalc = await calculatorRegistry.getById('bmi-calculator', locale)
			if (bmiCalc) {
				scenarios.push({
					calculator: bmiCalc,
					reason: 'Body fat percentage provides more detailed body composition information than BMI alone. Use the BMI Calculator to see your weight category based on height and weight.',
				})
			}
			const idealWeightCalc = await calculatorRegistry.getById('ideal-weight-calculator', locale)
			if (idealWeightCalc) {
				scenarios.push({
					calculator: idealWeightCalc,
					reason: 'Understanding your body fat percentage helps you set realistic weight goals. Use the Ideal Weight Calculator to see healthy weight ranges for your height.',
				})
			}
		}
		if (calculator.id === 'macronutrient-calculator') {
			const tdeeCalc = await calculatorRegistry.getById('daily-calorie-needs-calculator', locale)
			if (tdeeCalc) {
				scenarios.push({
					calculator: tdeeCalc,
					reason: 'Need to know your daily calorie target first? Use the Daily Calorie Needs Calculator to find out how many calories you should eat per day, then use those calories here.',
				})
			}
		}
		if (calculator.id === 'water-intake-calculator') {
			const tdeeCalc = await calculatorRegistry.getById('daily-calorie-needs-calculator', locale)
			if (tdeeCalc) {
				scenarios.push({
					calculator: tdeeCalc,
					reason: 'Proper nutrition includes both hydration and calories. Use the Daily Calorie Needs Calculator to find out how many calories you need per day.',
				})
			}
		}
		if (calculator.id === 'calories-burned-calculator') {
			const tdeeCalc = await calculatorRegistry.getById('daily-calorie-needs-calculator', locale)
			if (tdeeCalc) {
				scenarios.push({
					calculator: tdeeCalc,
					reason: 'Compare burned calories with your intake using the Daily Calorie Needs Calculator.',
				})
			}
		}
		if (calculator.id === 'heart-rate-zones-calculator') {
			const caloriesBurnedCalc = await calculatorRegistry.getById('calories-burned-calculator', locale)
			if (caloriesBurnedCalc) {
				scenarios.push({
					calculator: caloriesBurnedCalc,
					reason: 'Heart rate zones help you train at the right intensity. Use the Calories Burned Calculator to see how many calories you burn during different activities.',
				})
			}
		}
		if (calculator.id === 'steps-to-calories-calculator') {
			const caloriesBurnedCalc = await calculatorRegistry.getById('calories-burned-calculator', locale)
			if (caloriesBurnedCalc) {
				scenarios.push({
					calculator: caloriesBurnedCalc,
					reason: 'Want to calculate calories burned for other activities? Use the Calories Burned Calculator to estimate calories for running, cycling, swimming, and more.',
				})
			}
		}
	}

	// Finance calculators
	if (calculator.category === 'finance') {
		if (calculator.id === 'mortgage-calculator') {
			const overpaymentCalc = await calculatorRegistry.getById('loan-overpayment-calculator', locale)
			if (overpaymentCalc) {
				scenarios.push({
					calculator: overpaymentCalc,
					reason: 'If you want to reduce total interest and pay off your mortgage faster, try the Loan Overpayment Calculator to see how extra payments can save you thousands.',
				})
			}
		}
		if (calculator.id === 'auto-loan-calculator') {
			const affordabilityCalc = await calculatorRegistry.getById('car-affordability-calculator', locale)
			if (affordabilityCalc) {
				scenarios.push({
					calculator: affordabilityCalc,
					reason: 'Not sure if you can afford this car? Use the Car Affordability Calculator to determine the maximum car price based on your monthly budget.',
				})
			}
			const ownershipCalc = await calculatorRegistry.getById('car-cost-of-ownership-calculator', locale)
			if (ownershipCalc && scenarios.length < 2) {
				scenarios.push({
					calculator: ownershipCalc,
					reason: 'Want to see the true cost of owning this car? The Car Cost of Ownership Calculator includes fuel, insurance, maintenance, and depreciation.',
				})
			}
		}
		if (calculator.id === 'loan-overpayment-calculator') {
			const mortgageCalc = await calculatorRegistry.getById('mortgage-calculator', locale)
			if (mortgageCalc) {
				scenarios.push({
					calculator: mortgageCalc,
					reason: 'Calculate your base mortgage payment first, then come back here to see how extra payments can reduce your total interest.',
				})
			}
		}
		if (calculator.id === 'investment-calculator') {
			const savingsCalc = await calculatorRegistry.getById('savings-calculator', locale)
			if (savingsCalc) {
				scenarios.push({
					calculator: savingsCalc,
					reason: 'Building an emergency fund? Use the Savings Calculator to see how regular deposits can grow over time with compound interest.',
				})
			}
		}
	}

	// Auto calculators
	if (calculator.category === 'auto') {
		if (calculator.id === 'car-affordability-calculator') {
			const loanCalc = await calculatorRegistry.getById('auto-loan-calculator', locale)
			if (loanCalc) {
				scenarios.push({
					calculator: loanCalc,
					reason: 'Once you know what you can afford, use the Auto Loan Calculator to see your monthly payment and total interest for specific vehicles.',
				})
			}
		}
		if (calculator.id === 'fuel-consumption-calculator') {
			const costCalc = await calculatorRegistry.getById('fuel-cost-calculator', locale)
			if (costCalc) {
				scenarios.push({
					calculator: costCalc,
					reason: 'Know your fuel consumption? Calculate the actual cost of your trips with the Fuel Cost Calculator.',
				})
			}
		}
		if (calculator.id === 'car-cost-of-ownership-calculator') {
			const leaseCalc = await calculatorRegistry.getById('lease-vs-buy-calculator', locale)
			if (leaseCalc) {
				scenarios.push({
					calculator: leaseCalc,
					reason: 'Considering leasing instead? Compare the total cost of leasing vs buying with the Lease vs Buy Calculator.',
				})
			}
		}
	}

	// Everyday calculators
	if (calculator.category === 'everyday') {
		if (calculator.id === 'age-calculator') {
			const daysBetweenCalc = await calculatorRegistry.getById('days-between-dates-calculator', locale)
			if (daysBetweenCalc) {
				scenarios.push({
					calculator: daysBetweenCalc,
					reason: 'If you want to know how many days you\'ve lived, use the Days Between Dates Calculator.',
				})
			}
		}
		if (calculator.id === 'days-between-dates-calculator') {
			const ageCalc = await calculatorRegistry.getById('age-calculator', locale)
			if (ageCalc) {
				scenarios.push({
					calculator: ageCalc,
					reason: 'To calculate age precisely from a birth date, try the Age Calculator.',
				})
			}
		}
		if (calculator.id === 'date-calculator') {
			const daysBetweenCalc = await calculatorRegistry.getById('days-between-dates-calculator', locale)
			if (daysBetweenCalc) {
				scenarios.push({
					calculator: daysBetweenCalc,
					reason: 'To find the number of days between two dates, use the Days Between Dates Calculator.',
				})
			}
		}
		if (calculator.id === 'room-area-calculator') {
			const paintCalc = await calculatorRegistry.getById('paint-calculator', locale)
			if (paintCalc) {
				scenarios.push({
					calculator: paintCalc,
					reason: 'Once you know the room area, estimate paint usage with the Paint Calculator.',
				})
			}
		}
		if (calculator.id === 'paint-calculator') {
			const roomAreaCalc = await calculatorRegistry.getById('room-area-calculator', locale)
			if (roomAreaCalc) {
				scenarios.push({
					calculator: roomAreaCalc,
					reason: 'To calculate the room area first, use the Room Area Calculator.',
				})
			}
		}
		if (calculator.id === 'numbers-to-words-calculator') {
			const romanCalc = await calculatorRegistry.getById('roman-numerals-converter', locale)
			if (romanCalc) {
				scenarios.push({
					calculator: romanCalc,
					reason: 'If you also need Roman numerals, try the Roman Numerals Converter.',
				})
			}
		}
		if (calculator.id === 'roman-numerals-converter') {
			const numbersToWordsCalc = await calculatorRegistry.getById('numbers-to-words-calculator', locale)
			if (numbersToWordsCalc) {
				scenarios.push({
					calculator: numbersToWordsCalc,
					reason: 'To convert numbers to words instead, use the Numbers to Words Converter.',
				})
			}
		}
		if (calculator.id === 'cooking-measurement-converter') {
			const roomAreaCalc = await calculatorRegistry.getById('room-area-calculator', locale)
			if (roomAreaCalc) {
				scenarios.push({
					calculator: roomAreaCalc,
					reason: 'For home improvement projects, calculate room area with the Room Area Calculator.',
				})
			}
		}
		if (calculator.id === 'random-number-generator') {
			const numbersToWordsCalc = await calculatorRegistry.getById('numbers-to-words-calculator', locale)
			if (numbersToWordsCalc) {
				scenarios.push({
					calculator: numbersToWordsCalc,
					reason: 'To convert generated numbers to words, use the Numbers to Words Converter.',
				})
			}
		}
	}

	// Math calculators
	if (calculator.category === 'math') {
		if (calculator.id === 'percentage-change-calculator') {
			// No specific scenario links for percentage change
		}
	}

	return scenarios.slice(0, 2) // Limit to 2 scenario-based links
}

/**
 * Related calculators block component
 * Shows links to related calculators and legacy tools
 * This is now a server component that fetches data
 */
export async function RelatedCalculatorsBlock({
	calculator,
	locale,
}: RelatedCalculatorsBlockProps) {
	// Get scenario-based links first
	const scenarioLinks = await getScenarioBasedLinks(calculator, locale)
	// Get related calculators with priority: tags > cluster > manual > category
	let relatedCalculators: Awaited<ReturnType<typeof calculatorRegistry.getById>>[] = []
	
	// Priority 1: Tag-based related calculators (for math and finance categories)
	if ((calculator.category === 'math' || calculator.category === 'finance') && calculator.tags && calculator.tags.length > 0) {
		const tagRelated = await getRelatedByTags(calculator.id, locale, 6)
		relatedCalculators = tagRelated
	}
	
	// Priority 2: Cluster-based related calculators
	if (calculator.category === 'math' && relatedCalculators.length < 6) {
		const clusterRelated = await getRelatedByCluster(calculator.id, locale, 6)
		// Merge with tag-based, avoiding duplicates
		const existingIds = new Set(relatedCalculators.map((c) => c.id))
		const newFromCluster = clusterRelated.filter((c) => !existingIds.has(c.id))
		relatedCalculators = [...relatedCalculators, ...newFromCluster].slice(0, 8)
	}
	
	// Priority 2b: Finance cluster-based related calculators
	if (calculator.category === 'finance' && relatedCalculators.length < 6) {
		const financeClusterRelated = await getRelatedByFinanceCluster(calculator.id, locale)
		// Merge with tag-based, avoiding duplicates
		const existingIds = new Set(relatedCalculators.map((c) => c.id))
		const newFromCluster = financeClusterRelated.filter((c) => !existingIds.has(c.id))
		relatedCalculators = [...relatedCalculators, ...newFromCluster].slice(0, 8)
	}
	
	// Priority 2c: Health cluster-based related calculators
	if (calculator.category === 'health' && relatedCalculators.length < 6) {
		const healthClusterRelated = await getRelatedByHealthCluster(calculator.id, locale)
		// Merge with existing, avoiding duplicates
		const existingIds = new Set(relatedCalculators.map((c) => c.id))
		const newFromCluster = healthClusterRelated.filter((c) => !existingIds.has(c.id))
		// For health, prioritize same cluster (2-3 items), then add logical next-step (1-2 items)
		relatedCalculators = [...relatedCalculators, ...newFromCluster].slice(0, 6)
	}
	
	// Priority 2d: Everyday cluster-based related calculators
	if (calculator.category === 'everyday' && relatedCalculators.length < 6) {
		const everydayClusterRelated = await getRelatedByEverydayCluster(calculator.id, locale, 6)
		// Merge with existing, avoiding duplicates
		const existingIds = new Set(relatedCalculators.map((c) => c.id))
		const newFromCluster = everydayClusterRelated.filter((c) => !existingIds.has(c.id))
		// For everyday, prioritize same cluster (2-3 items), then add logical next-step (1-2 items)
		relatedCalculators = [...relatedCalculators, ...newFromCluster].slice(0, 6)
	}
	
	// Priority 3: Manual relatedIds
	if (relatedCalculators.length < 6 && calculator.relatedIds && calculator.relatedIds.length > 0) {
		const manualRelated = await Promise.all(
			calculator.relatedIds.map((id) =>
				calculatorRegistry.getById(id, locale),
			),
		).then((calcs) => calcs.filter((c): c is NonNullable<typeof c> => c !== undefined))
		const existingIds = new Set(relatedCalculators.map((c) => c.id))
		const newFromManual = manualRelated.filter((c) => !existingIds.has(c.id))
		relatedCalculators = [...relatedCalculators, ...newFromManual].slice(0, 8)
	}
	
	// Priority 4: Same category fallback
	if (relatedCalculators.length < 6) {
		const categoryCalcs = await calculatorRegistry.getByCategory(
			calculator.category,
			locale,
		)
		const existingIds = new Set(relatedCalculators.map((c) => c.id))
		const newFromCategory = categoryCalcs
			.filter((calc) => calc.id !== calculator.id && !existingIds.has(calc.id))
			.slice(0, 8 - relatedCalculators.length)
		relatedCalculators = [...relatedCalculators, ...newFromCategory]
	}
	
	const legacyTools = getLegacyToolsForCalculator(calculator.id)
	const standardIds = await getStandardsForCalculator(calculator.id, locale)
	const standards = standardIds.length > 0
		? await Promise.all(
				standardIds.map((id) => standardRegistry.getById(id, locale)),
			).then((stds) => stds.filter((s): s is NonNullable<typeof s> => s !== undefined))
		: []

	if (
		relatedCalculators.length === 0 &&
		legacyTools.length === 0 &&
		standards.length === 0
	) {
		return null
	}

	// Note: Translation should be passed from parent or loaded via context
	// For now, using hardcoded English (will be replaced with i18n)
	const isMathCategory = calculator.category === 'math'
	const cluster = isMathCategory ? getClusterForCalculator(calculator.id) : null
	
	return (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				{isMathCategory ? 'Related Math Calculators' : 'Related Calculators'}
			</h2>

			{/* Scenario-based links */}
			{scenarioLinks.length > 0 && (
				<div className="mb-6 pb-6 border-b border-blue-300">
					<h3 className="text-lg font-medium text-gray-800 mb-3">
						You Might Also Need
					</h3>
					<div className="space-y-3">
						{scenarioLinks.map(({ calculator: calc, reason }) => (
							<div key={calc.id} className="bg-white rounded-lg p-4 border border-blue-200">
								<Link
									href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
									className="text-blue-600 hover:text-blue-800 underline font-medium text-base block mb-2"
								>
									{calc.title}
								</Link>
								<p className="text-sm text-gray-700 leading-relaxed">
									{reason}
								</p>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Related calculators */}
			{relatedCalculators.length > 0 && (
				<div className="mb-4">
					<ul className="space-y-2">
						{relatedCalculators.map((calc) => (
							<li key={calc.id}>
								<Link
									href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
									className="text-blue-600 hover:text-blue-800 underline"
								>
									{calc.title}
								</Link>
								{calc.shortDescription && (
									<p className="text-sm text-gray-600 ml-4">
										{calc.shortDescription}
									</p>
								)}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Legacy tools */}
			{legacyTools.length > 0 && (
				<div className="mb-4">
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						Legacy Tools
					</h3>
					<ul className="space-y-2">
						{legacyTools.map((tool) => (
							<li key={tool}>
								<Link
									href={`/${locale}/${tool}`}
									className="text-blue-600 hover:text-blue-800 underline"
								>
									{tool.replace(/-/g, ' ').replace(/\b\w/g, (l) =>
										l.toUpperCase(),
									)}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Standards */}
			{standards.length > 0 && (
				<div>
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						This calculator is based on:
					</h3>
					<ul className="space-y-2">
						{standards.map((std) => (
							<li key={std.id}>
								<Link
									href={`/${locale}/standards/${std.country}/${std.slug}`}
									className="text-blue-600 hover:text-blue-800 underline"
								>
									{std.title}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
