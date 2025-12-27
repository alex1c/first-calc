import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { formatOutputValue } from '@/lib/calculators/format'
import Link from 'next/link'

interface CalculatorResultsProps {
	calculator: CalculatorDefinitionClient
	outputs: Record<string, number | string | null>
}

/**
 * Get explanatory text for calculator results
 * Provides context about what the result means and how to use it
 */
function getResultExplanation(
	calculator: CalculatorDefinitionClient,
	outputName: string,
	value: number | string | null,
): string | null {
	if (value === null || value === undefined) {
		return null
	}

	// Finance calculators
	if (calculator.category === 'finance') {
		if (outputName === 'monthlyPayment' || outputName === 'payment') {
			return 'This is your monthly payment amount. Use this to budget your monthly expenses and ensure you can afford the loan. Consider that this amount will be due every month for the duration of the loan term.'
		}
		if (outputName === 'totalInterest') {
			return 'This is the total amount of interest you will pay over the life of the loan. This represents the cost of borrowing money. You can reduce this by making a larger down payment, choosing a shorter term, or making extra payments.'
		}
		if (outputName === 'totalPayment') {
			return 'This is the total amount you will pay over the life of the loan, including both principal and interest. This helps you understand the true cost of the loan beyond just the monthly payment.'
		}
		if (outputName === 'roiPercentage' || outputName === 'roi') {
			return 'This is your return on investment as a percentage. A positive ROI means you made money, while a negative ROI means you lost money. Compare this to your target ROI to evaluate if the investment was worthwhile.'
		}
		if (outputName === 'finalBalance' || outputName === 'futureValue') {
			return 'This is the total amount you will have at the end of the investment period. This includes your initial investment, contributions, and all earned interest or returns.'
		}
	}

	// Auto calculators
	if (calculator.category === 'auto') {
		if (outputName === 'monthlyPayment') {
			return 'This is your monthly car payment. Use this to determine if the car fits your budget. Remember to also budget for insurance, fuel, maintenance, and registration costs.'
		}
		if (outputName === 'totalCost' || outputName === 'totalCostOfOwnership') {
			return 'This is the total cost of owning the vehicle, including purchase price, financing costs, and operating expenses. Use this to compare different vehicles and make an informed decision.'
		}
		if (outputName === 'depreciation' || outputName === 'resaleValue') {
			return 'This shows how much value your car will lose over time or what it will be worth when you sell it. Understanding depreciation helps you make better decisions about when to buy or sell.'
		}
		if (outputName === 'fuelCost' || outputName === 'tripCost') {
			return 'This is the cost of fuel for your trip or monthly driving. Use this to budget for transportation costs and compare the efficiency of different vehicles.'
		}
	}

	// Math calculators
	if (calculator.category === 'math') {
		if (outputName === 'percentageChange') {
			return 'This shows the percentage increase or decrease between two values. A positive percentage means an increase, while a negative percentage means a decrease. Use this to track changes over time.'
		}
		if (outputName === 'result' || outputName === 'answer') {
			return 'This is the calculated result. Use this value in your calculations or to verify your work. Check the formula and steps above to understand how this result was obtained.'
		}
		if (outputName === 'roots' || outputName === 'solution') {
			return 'These are the solutions to the equation. Substitute these values back into the original equation to verify they are correct.'
		}
		if (outputName === 'area' || outputName === 'volume' || outputName === 'perimeter') {
			return 'This is the calculated geometric measurement. Use this value for planning, construction, or other applications that require this measurement.'
		}
	}

	// Health calculators
	if (calculator.category === 'health') {
		if (outputName === 'bmi') {
			return 'This is your Body Mass Index (BMI), a screening tool that estimates body fat based on height and weight. BMI categories are: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), and Obese (≥30). Note that BMI doesn\'t directly measure body fat and may not be accurate for athletes or individuals with high muscle mass.'
		}
		if (outputName === 'bmr') {
			return 'This is your Basal Metabolic Rate (BMR) — the number of calories your body burns at complete rest. BMR represents your baseline metabolism and accounts for 60-70% of your total daily energy expenditure. To maintain weight, you need to consume calories equal to your TDEE (BMR × activity factor), not just your BMR.'
		}
		if (outputName === 'tdee') {
			return 'This is your Total Daily Energy Expenditure (TDEE) — the total calories you burn per day including all activities. TDEE = BMR × Activity Level. To maintain weight, consume calories equal to your TDEE. To lose weight, consume fewer calories than your TDEE (create a deficit). To gain weight, consume more calories than your TDEE (create a surplus).'
		}
		if (outputName === 'idealRangeKg') {
			return 'This is your suggested ideal weight range calculated using multiple formulas (Devine, Robinson, and Miller). The range accounts for variations between formulas and provides a more realistic target than a single number. Remember that ideal weight formulas are estimates based on height and sex only and don\'t account for body composition, bone structure, or individual variations.'
		}
		if (outputName === 'bodyFatPercentage') {
			return 'This is your estimated body fat percentage — the proportion of your total body weight that consists of fat tissue. Unlike BMI, which only considers height and weight, body fat percentage directly estimates fat mass. This provides more insight into body composition, especially useful for athletes and fitness enthusiasts.'
		}
		if (outputName === 'proteinGrams') {
			return 'These are your daily macronutrient targets in grams. Protein provides 4 calories per gram and is essential for muscle repair and growth. Carbohydrates provide 4 calories per gram and are your primary energy source. Fat provides 9 calories per gram and is essential for hormone production and vitamin absorption. Aim to hit these targets on average over the week rather than exactly every day.'
		}
		if (outputName === 'dailyWaterIntakeLiters') {
			return 'This is your recommended daily water intake based on your body weight, activity level, climate, and exercise routine. Proper hydration is essential for temperature regulation, nutrient transport, waste removal, and overall health. Remember that about 20% of daily water intake comes from food, and individual needs can vary.'
		}
		if (outputName === 'caloriesBurned') {
			return 'This is your estimated calories burned during the activity, calculated using the MET (Metabolic Equivalent of Task) formula. MET values are standardized measures of energy expenditure. Actual calories burned can vary based on individual factors like fitness level, body composition, and efficiency of movement.'
		}
		if (outputName === 'maxHeartRate') {
			return 'This is your estimated maximum heart rate, calculated as 220 - age. Heart rate training zones are calculated as percentages of this maximum. Zone 1 (50-60%) is for recovery, Zone 2 (60-70%) is the fat-burning zone, Zone 3 (70-80%) improves cardiovascular fitness, Zone 4 (80-90%) is the anaerobic threshold, and Zone 5 (90-100%) is maximum effort. These are estimates and can vary by ±10-15 bpm.'
		}
		if (outputName === 'caloriesBurned' && calculator.id === 'steps-to-calories-calculator') {
			return 'This is your estimated calories burned from walking, calculated based on steps, weight, stride length, and walking speed. The calculation uses MET values for walking to estimate energy expenditure. Actual calories burned can vary based on terrain, fitness level, and individual factors.'
		}
		if (outputName === 'bodyFatPercentage') {
			return 'This is your estimated body fat percentage — the proportion of your total body weight that consists of fat tissue. This is calculated using the U.S. Navy Method, a formula-based estimation. Body fat percentage provides insight into body composition beyond what BMI can tell you, as it accounts for the ratio of fat to lean mass. Remember that this is an estimation and actual body fat may vary based on hydration, measurement technique, and other factors.'
		}
		if (outputName === 'bodyFatPercentage') {
			return 'This is your estimated body fat percentage using the U.S. Navy Method, a formula-based estimation approach. Body fat percentage indicates the proportion of your total weight that is fat tissue. This provides insight into body composition beyond what BMI alone can tell you, as it distinguishes between fat mass and lean mass (muscle, bone, organs).'
		}
	}

	return null
}

/**
 * Calculator results component
 * Displays calculation results in a clean format
 */
export function CalculatorResults({
	calculator,
	outputs,
}: CalculatorResultsProps) {
	if (!outputs || Object.keys(outputs).length === 0) {
		return null
	}

	// Special handling for retirement calculator
	if (calculator.id === 'retirement-calculator') {
		const calculationMode = outputs.calculationMode as string || 'future_balance'
		
		if (calculationMode === 'future_balance') {
			const finalBalance = outputs.finalBalance as number
			const totalContributed = outputs.totalContributed as number
			const totalEarnings = outputs.totalEarnings as number
			const inflationAdjustedBalance = outputs.inflationAdjustedBalance as number | null
			const monthlyRetirementIncome = outputs.monthlyRetirementIncome as number | null
			const yearlyBreakdown = (outputs.yearlyBreakdown as any) || []
			const formulaExplanation = outputs.formulaExplanation as string

			if (finalBalance === null || finalBalance === undefined) {
				return null
			}

			return (
				<div className="w-full max-w-full space-y-6">
					{/* Key Numbers Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
							<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Retirement Balance</div>
							<div className="text-2xl font-bold text-blue-900">
								${finalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
						<div className="bg-green-50 rounded-lg p-4 border border-green-200">
							<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Total Contributed</div>
							<div className="text-2xl font-bold text-green-900">
								${totalContributed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
						<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
							<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Total Earnings</div>
							<div className="text-2xl font-bold text-purple-900">
								${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
						{inflationAdjustedBalance && (
							<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
								<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Inflation-Adjusted Balance</div>
								<div className="text-2xl font-bold text-orange-900">
									${inflationAdjustedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</div>
							</div>
						)}
						{monthlyRetirementIncome && (
							<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
								<div className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Monthly Income (4% withdrawal)</div>
								<div className="text-2xl font-bold text-indigo-900">
									${monthlyRetirementIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</div>
							</div>
						)}
					</div>

					{/* Formula Explanation */}
					{formulaExplanation && (
						<div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 w-full max-w-full overflow-hidden">
							<h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Calculation Details</h4>
							<div className="overflow-x-auto">
								<p className="text-xs md:text-sm text-gray-700 whitespace-pre-line break-words max-w-full">{formulaExplanation}</p>
							</div>
						</div>
					)}
				</div>
			)
		} else {
			// MODE B: Required Savings
			const requiredRetirementFund = outputs.requiredRetirementFund as number
			const monthlyIncomeAchievable = outputs.monthlyIncomeAchievable as number | null
			const savingsGap = outputs.savingsGap as number | null
			const requiredMonthlyContribution = outputs.requiredMonthlyContribution as number | null
			const formulaExplanation = outputs.formulaExplanation as string

			if (requiredRetirementFund === null || requiredRetirementFund === undefined) {
				return null
			}

			return (
				<div className="w-full max-w-full space-y-6">
					{/* Key Numbers Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
							<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Required Retirement Fund</div>
							<div className="text-2xl font-bold text-blue-900">
								${requiredRetirementFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
						{savingsGap !== null && savingsGap !== undefined && (
							<div className={`rounded-lg p-4 border ${savingsGap > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
								<div className={`text-xs font-medium uppercase tracking-wide mb-1 ${savingsGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
									Savings Gap
								</div>
								<div className={`text-2xl font-bold ${savingsGap > 0 ? 'text-red-900' : 'text-green-900'}`}>
									${Math.abs(savingsGap).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									{savingsGap <= 0 && ' (You have enough!)'}
								</div>
							</div>
						)}
						{requiredMonthlyContribution !== null && requiredMonthlyContribution !== undefined && requiredMonthlyContribution > 0 && (
							<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
								<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Required Monthly Contribution</div>
								<div className="text-2xl font-bold text-purple-900">
									${requiredMonthlyContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</div>
							</div>
						)}
						{monthlyIncomeAchievable !== null && monthlyIncomeAchievable !== undefined && (
							<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
								<div className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Monthly Income Achievable</div>
								<div className="text-2xl font-bold text-indigo-900">
									${monthlyIncomeAchievable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</div>
							</div>
						)}
					</div>

					{/* Formula Explanation */}
					{formulaExplanation && (
						<div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 w-full max-w-full overflow-hidden">
							<h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Calculation Details</h4>
							<div className="overflow-x-auto">
								<p className="text-xs md:text-sm text-gray-700 whitespace-pre-line break-words max-w-full">{formulaExplanation}</p>
							</div>
						</div>
					)}
				</div>
			)
		}
	}

	// Special handling for mortgage calculator
	if (calculator.id === 'mortgage-calculator') {
		const monthlyMortgagePayment = outputs.monthlyMortgagePayment as number
		const totalMonthlyPayment = outputs.totalMonthlyPayment as number
		const loanAmount = outputs.loanAmount as number
		const totalInterest = outputs.totalInterest as number
		const totalCost = outputs.totalCost as number
		const payoffDate = outputs.payoffDate as string
		const paymentBreakdown = outputs.paymentBreakdown as any
		const extraPaymentImpact = outputs.extraPaymentImpact as any
		const amortizationSchedule = (outputs.amortizationSchedule as any) || []
		const formulaExplanation = outputs.formulaExplanation as string

		if (monthlyMortgagePayment === null || monthlyMortgagePayment === undefined) {
			return null
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Key Numbers Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Monthly Payment</div>
						<div className="text-2xl font-bold text-blue-900">
							${totalMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
						<div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Loan Amount</div>
						<div className="text-2xl font-bold text-gray-900">
							${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-red-50 rounded-lg p-4 border border-red-200">
						<div className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Total Interest</div>
						<div className="text-2xl font-bold text-red-900">
							${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
						<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Total Cost</div>
						<div className="text-2xl font-bold text-purple-900">
							${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					{payoffDate && (
						<div className="bg-green-50 rounded-lg p-4 border border-green-200">
							<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Payoff Date</div>
							<div className="text-lg font-bold text-green-900">
								{new Date(payoffDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
							</div>
						</div>
					)}
				</div>

				{/* Payment Breakdown */}
				{paymentBreakdown && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Breakdown</h3>
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-gray-600">Principal & Interest</span>
								<span className="font-semibold text-gray-900">
									${paymentBreakdown.principal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
								</span>
							</div>
							{paymentBreakdown.taxes > 0 && (
								<div className="flex justify-between items-center">
									<span className="text-gray-600">Property Taxes</span>
									<span className="font-semibold text-gray-900">
										${paymentBreakdown.taxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							)}
							{paymentBreakdown.insurance > 0 && (
								<div className="flex justify-between items-center">
									<span className="text-gray-600">Insurance</span>
									<span className="font-semibold text-gray-900">
										${paymentBreakdown.insurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							)}
							{paymentBreakdown.hoa > 0 && (
								<div className="flex justify-between items-center">
									<span className="text-gray-600">HOA Fees</span>
									<span className="font-semibold text-gray-900">
										${paymentBreakdown.hoa.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							)}
							<div className="border-t border-gray-200 pt-3 mt-3">
								<div className="flex justify-between items-center">
									<span className="text-lg font-semibold text-gray-900">Total Monthly Payment</span>
									<span className="text-lg font-bold text-blue-600">
										${paymentBreakdown.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Extra Payment Impact */}
				{extraPaymentImpact && (
					<div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
						<h3 className="text-lg font-semibold text-green-800 mb-3">Extra Payment Impact</h3>
						<div className="space-y-2">
							<div className="text-base text-green-700">
								<strong>Interest Saved:</strong> ${extraPaymentImpact.interestSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
							<div className="text-base text-green-700">
								<strong>Loan Term Reduced:</strong> {extraPaymentImpact.monthsReduced} months ({extraPaymentImpact.yearsReduced} years)
							</div>
							<div className="text-sm text-green-600 mt-3">
								You save ${extraPaymentImpact.interestSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} and finish {extraPaymentImpact.yearsReduced} years earlier!
							</div>
						</div>
					</div>
				)}

				{/* Formula Explanation */}
				{formulaExplanation && (
					<div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 w-full max-w-full overflow-hidden">
						<h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Calculation Details</h4>
						<div className="overflow-x-auto">
							<p className="text-xs md:text-sm text-gray-700 whitespace-pre-line break-words max-w-full">{formulaExplanation}</p>
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for net worth calculator
	if (calculator.id === 'net-worth-calculator') {
		const totalAssets = outputs.totalAssets as number
		const totalLiabilities = outputs.totalLiabilities as number
		const netWorth = outputs.netWorth as number
		const debtToAssetRatio = outputs.debtToAssetRatio as number
		const netWorthStatus = outputs.netWorthStatus as 'negative' | 'neutral' | 'positive'
		const formulaExplanation = outputs.formulaExplanation as string

		if (netWorth === null || netWorth === undefined) {
			return null
		}

		// Determine color scheme based on net worth status
		const statusColors = {
			negative: {
				bg: 'bg-red-50',
				border: 'border-red-200',
				text: 'text-red-900',
				label: 'text-red-600',
			},
			neutral: {
				bg: 'bg-gray-50',
				border: 'border-gray-200',
				text: 'text-gray-900',
				label: 'text-gray-600',
			},
			positive: {
				bg: 'bg-green-50',
				border: 'border-green-200',
				text: 'text-green-900',
				label: 'text-green-600',
			},
		}

		const colors = statusColors[netWorthStatus]

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Key Numbers Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className={`${colors.bg} rounded-lg p-4 border-2 ${colors.border}`}>
						<div className={`text-xs font-medium ${colors.label} uppercase tracking-wide mb-1`}>Net Worth</div>
						<div className={`text-3xl font-bold ${colors.text}`}>
							${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
						<div className="text-sm text-gray-600 mt-1">
							{netWorthStatus === 'negative' && 'Liabilities exceed assets'}
							{netWorthStatus === 'neutral' && 'Assets equal liabilities'}
							{netWorthStatus === 'positive' && 'Assets exceed liabilities'}
						</div>
					</div>
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Total Assets</div>
						<div className="text-2xl font-bold text-blue-900">
							${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
						<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Total Liabilities</div>
						<div className="text-2xl font-bold text-orange-900">
							${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
						<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Debt-to-Asset Ratio</div>
						<div className="text-2xl font-bold text-purple-900">
							{debtToAssetRatio >= 999 ? 'N/A' : `${debtToAssetRatio.toFixed(1)}%`}
						</div>
						<div className="text-xs text-purple-700 mt-1">
							{debtToAssetRatio >= 999
								? 'No assets'
								: debtToAssetRatio < 50
									? 'Healthy'
									: debtToAssetRatio < 100
										? 'Moderate'
										: 'High'}
						</div>
					</div>
				</div>

				{/* Assets vs Liabilities Visualization */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h4 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Assets vs Liabilities</h4>
					<div className="space-y-4">
						{/* Assets Bar */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-gray-700">Assets</span>
								<span className="text-sm font-semibold text-blue-600">
									${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
								<div
									className="h-4 bg-blue-500 rounded-full transition-all duration-300"
									style={{ width: '100%' }}
								/>
							</div>
						</div>
						{/* Liabilities Bar */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-gray-700">Liabilities</span>
								<span className="text-sm font-semibold text-orange-600">
									${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
								<div
									className="h-4 bg-orange-500 rounded-full transition-all duration-300"
									style={{
										width: totalAssets > 0
											? `${Math.min(100, (totalLiabilities / totalAssets) * 100)}%`
											: totalLiabilities > 0
												? '100%'
												: '0%',
									}}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Interpretation Block */}
				<div className={`${colors.bg} border ${colors.border} rounded-lg p-4 md:p-6`}>
					<h4 className={`text-base md:text-lg font-semibold ${colors.text} mb-3`}>What This Means</h4>
					<div className={`space-y-2 text-sm ${colors.text}`}>
						{netWorthStatus === 'negative' ? (
							<>
								<p>
									Your net worth is <strong>negative</strong>, meaning your liabilities exceed your assets. This is common for young adults, recent graduates, or those with significant debt (like student loans or mortgages).
								</p>
								<p>
									<strong>This is a starting point, not a permanent condition.</strong> With consistent income, debt repayment, and asset building, your net worth can improve over time.
								</p>
								<p>
									<strong>Focus on:</strong> Reducing high-interest debt first, then building assets through savings and investments.
								</p>
							</>
						) : netWorthStatus === 'neutral' ? (
							<>
								<p>
									Your net worth is <strong>neutral (zero)</strong>, meaning your assets equal your liabilities. This is a milestone - you've reached a balance point.
								</p>
								<p>
									<strong>Next steps:</strong> Focus on increasing assets (save more, invest) and reducing liabilities (pay off debt) to achieve positive net worth.
								</p>
								<p>
									<strong>Focus on:</strong> Building assets through consistent savings and investments while managing debt responsibly.
								</p>
							</>
						) : (
							<>
								<p>
									Your net worth is <strong>positive</strong>, meaning your assets exceed your liabilities. This indicates a healthy financial position.
								</p>
								<p>
									<strong>Continue building:</strong> Keep increasing assets through savings, investments, and retirement accounts while managing debt responsibly.
								</p>
								<p>
									<strong>Focus on:</strong> Growing your net worth over time through consistent saving, investing, and debt management.
								</p>
							</>
						)}
						<div className="mt-4 pt-4 border-t border-gray-300">
							<p className="text-xs text-gray-600">
								<strong>Remember:</strong> Net worth is a snapshot at a point in time. It can change as asset values fluctuate, debts are paid off, or new assets are acquired. Regularly tracking your net worth helps you understand your financial progress.
							</p>
						</div>
					</div>
				</div>

				{/* Formula Explanation */}
				{formulaExplanation && (
					<div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 w-full max-w-full overflow-hidden">
						<h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Calculation Details</h4>
						<div className="overflow-x-auto">
							<p className="text-xs md:text-sm text-gray-700 whitespace-pre-line break-words max-w-full">{formulaExplanation}</p>
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for emergency fund calculator
	if (calculator.id === 'emergency-fund-calculator') {
		const targetEmergencyFund = outputs.targetEmergencyFund as number
		const remainingAmount = outputs.remainingAmount as number
		const monthsToGoal = outputs.monthsToGoal as number | null
		const progressPercentage = outputs.progressPercentage as number
		const formulaExplanation = outputs.formulaExplanation as string

		if (targetEmergencyFund === null || targetEmergencyFund === undefined) {
			return null
		}

		const hasReachedGoal = remainingAmount <= 0
		const currentSavingsValue = targetEmergencyFund - remainingAmount

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Key Numbers Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Target Emergency Fund</div>
						<div className="text-2xl font-bold text-blue-900">
							${targetEmergencyFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Current Savings</div>
						<div className="text-2xl font-bold text-green-900">
							${currentSavingsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					{hasReachedGoal ? (
						<div className="bg-green-50 rounded-lg p-4 border-2 border-green-500">
							<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Goal Status</div>
							<div className="text-2xl font-bold text-green-700">
								🎉 Goal Reached!
							</div>
						</div>
					) : (
						<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
							<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Remaining Amount</div>
							<div className="text-2xl font-bold text-orange-900">
								${remainingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
					<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
						<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Progress</div>
						<div className="text-2xl font-bold text-purple-900">
							{progressPercentage.toFixed(1)}%
						</div>
					</div>
					{monthsToGoal !== null && monthsToGoal > 0 && (
						<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
							<div className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Time to Reach Goal</div>
							<div className="text-2xl font-bold text-indigo-900">
								{monthsToGoal} months
							</div>
							<div className="text-sm text-indigo-700 mt-1">
								({(monthsToGoal / 12).toFixed(1)} years)
							</div>
						</div>
					)}
				</div>

				{/* Progress Bar */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-700">Progress to Goal</span>
						<span className="text-sm font-semibold text-gray-900">{progressPercentage.toFixed(1)}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
						<div
							className={`h-4 rounded-full transition-all duration-300 ${
								hasReachedGoal ? 'bg-green-500' : 'bg-blue-500'
							}`}
							style={{ width: `${Math.min(100, progressPercentage)}%` }}
						/>
					</div>
					<div className="mt-3 text-sm text-gray-600">
						{hasReachedGoal ? (
							<span className="text-green-700 font-medium">✓ You have reached your emergency fund goal!</span>
						) : (
							<span>You are {progressPercentage.toFixed(1)}% of the way to your emergency fund goal.</span>
						)}
					</div>
				</div>

				{/* Insights Block */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
					<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
					<ul className="space-y-2 text-sm text-blue-700">
						{hasReachedGoal ? (
							<>
								<li>• Congratulations! You have reached your emergency fund goal.</li>
								<li>• Keep your emergency fund in a high-yield savings account for easy access and some growth.</li>
								<li>• Consider increasing your target if your expenses or income situation changes.</li>
							</>
						) : (
							<>
								<li>• Your target emergency fund is ${targetEmergencyFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({progressPercentage.toFixed(1)}% complete)</li>
								{monthsToGoal !== null && monthsToGoal > 0 && (
									<li>• At your current savings rate, you will reach your goal in {monthsToGoal} months ({(monthsToGoal / 12).toFixed(1)} years)</li>
								)}
								{monthsToGoal === null && (
									<li>• Enter a monthly contribution amount to see how long it will take to reach your goal</li>
								)}
								<li>• An emergency fund provides financial security for unexpected situations</li>
								<li>• Keep your emergency fund in a savings account, not investments, for easy access</li>
							</>
						)}
					</ul>
				</div>

				{/* Formula Explanation */}
				{formulaExplanation && (
					<div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 w-full max-w-full overflow-hidden">
						<h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Calculation Details</h4>
						<div className="overflow-x-auto">
							<p className="text-xs md:text-sm text-gray-700 whitespace-pre-line break-words max-w-full">{formulaExplanation}</p>
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for take-home pay calculator
	if (calculator.id === 'take-home-pay-calculator') {
		const grossIncome = outputs.grossIncome as number
		const totalTaxes = outputs.totalTaxes as number
		const totalDeductions = outputs.totalDeductions as number
		const netIncome = outputs.netIncome as number
		const netIncomePerMonth = outputs.netIncomePerMonth as number | null
		const effectiveNetRate = outputs.effectiveNetRate as number
		const formulaExplanation = outputs.formulaExplanation as string

		if (netIncome === null || netIncome === undefined) {
			return null
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Key Numbers Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Take-Home Pay</div>
						<div className="text-2xl font-bold text-green-900">
							${netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
						{netIncomePerMonth && (
							<div className="text-sm text-green-700 mt-1">
								${netIncomePerMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month
							</div>
						)}
					</div>
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Gross Income</div>
						<div className="text-2xl font-bold text-blue-900">
							${grossIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-red-50 rounded-lg p-4 border border-red-200">
						<div className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Total Taxes</div>
						<div className="text-2xl font-bold text-red-900">
							${totalTaxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
						<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Total Deductions</div>
						<div className="text-2xl font-bold text-orange-900">
							${totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
						<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Effective Net Rate</div>
						<div className="text-2xl font-bold text-purple-900">
							{effectiveNetRate.toFixed(2)}%
						</div>
						<div className="text-xs text-purple-700 mt-1">of gross income you keep</div>
					</div>
				</div>

				{/* Breakdown Visualization */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Income Breakdown</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-gray-600">Gross Income</span>
							<span className="font-semibold text-gray-900">
								${grossIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</span>
						</div>
						<div className="flex items-center justify-between text-red-600">
							<span>− Taxes</span>
							<span className="font-semibold">
								${totalTaxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</span>
						</div>
						{totalDeductions > 0 && (
							<div className="flex items-center justify-between text-orange-600">
								<span>− Deductions</span>
								<span className="font-semibold">
									${totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</span>
							</div>
						)}
						<div className="border-t border-gray-200 pt-3 mt-3">
							<div className="flex items-center justify-between">
								<span className="text-lg font-semibold text-green-600">= Take-Home Pay (Net Income)</span>
								<span className="text-lg font-bold text-green-700">
									${netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Disclaimer */}
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<div className="flex items-start">
						<svg className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
						</svg>
						<div className="text-sm text-yellow-800">
							<strong>Note:</strong> This is an estimation tool. Actual take-home pay varies significantly by country, state/province, local tax laws, specific deductions, filing status, and individual circumstances. Tax rates and calculations differ between jurisdictions. Always consult with a tax professional or use official tax calculators for your specific location for accurate calculations.
						</div>
					</div>
				</div>

				{/* Formula Explanation */}
				{formulaExplanation && (
					<div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 w-full max-w-full overflow-hidden">
						<h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Calculation Details</h4>
						<div className="overflow-x-auto">
							<p className="text-xs md:text-sm text-gray-700 whitespace-pre-line break-words max-w-full">{formulaExplanation}</p>
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for investment vs savings calculator
	if (calculator.id === 'investment-vs-savings-calculator') {
		const savingsFinalBalance = outputs.savingsFinalBalance as number
		const savingsTotalContributions = outputs.savingsTotalContributions as number
		const savingsTotalEarnings = outputs.savingsTotalEarnings as number
		const savingsInflationAdjustedBalance = outputs.savingsInflationAdjustedBalance as number | null
		const investmentFinalBalance = outputs.investmentFinalBalance as number
		const investmentTotalContributions = outputs.investmentTotalContributions as number
		const investmentTotalEarnings = outputs.investmentTotalEarnings as number
		const investmentInflationAdjustedBalance = outputs.investmentInflationAdjustedBalance as number | null
		const differenceInFinalBalance = outputs.differenceInFinalBalance as number
		const percentageAdvantage = outputs.percentageAdvantage as number
		const breakevenYear = outputs.breakevenYear as number | null
		const formulaExplanation = outputs.formulaExplanation as string

		if (savingsFinalBalance === null || savingsFinalBalance === undefined || investmentFinalBalance === null || investmentFinalBalance === undefined) {
			return null
		}

		const investmentWins = differenceInFinalBalance > 0

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Comparison Summary Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Savings Final Balance</div>
						<div className="text-2xl font-bold text-blue-900">
							${savingsFinalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Investment Final Balance</div>
						<div className="text-2xl font-bold text-green-900">
							${investmentFinalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className={`rounded-lg p-4 border ${investmentWins ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
						<div className={`text-xs font-medium uppercase tracking-wide mb-1 ${investmentWins ? 'text-green-600' : 'text-blue-600'}`}>
							Difference
						</div>
						<div className={`text-2xl font-bold ${investmentWins ? 'text-green-900' : 'text-blue-900'}`}>
							${Math.abs(differenceInFinalBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							<div className="text-sm mt-1">
								{investmentWins ? '(Investment advantage)' : '(Savings advantage)'}
							</div>
						</div>
					</div>
					{breakevenYear && (
						<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
							<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Breakeven Year</div>
							<div className="text-2xl font-bold text-purple-900">
								Year {breakevenYear}
							</div>
							<div className="text-xs text-purple-600 mt-1">When investment surpasses savings</div>
						</div>
					)}
					<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
						<div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Percentage Advantage</div>
						<div className={`text-2xl font-bold ${investmentWins ? 'text-green-900' : 'text-blue-900'}`}>
							{Math.abs(percentageAdvantage).toFixed(2)}%
						</div>
						<div className="text-xs text-gray-600 mt-1">
							{investmentWins ? 'Investment advantage' : 'Savings advantage'}
						</div>
					</div>
				</div>

				{/* Side-by-Side Comparison Table */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-full">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Metric</th>
									<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Savings</th>
									<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Investment</th>
									<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Difference</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								<tr>
									<td className="px-4 py-3 font-medium text-gray-900">Final Balance</td>
									<td className="px-4 py-3 text-right text-gray-700">${savingsFinalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
									<td className="px-4 py-3 text-right text-gray-700">${investmentFinalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
									<td className={`px-4 py-3 text-right font-medium ${investmentWins ? 'text-green-600' : 'text-blue-600'}`}>
										${Math.abs(differenceInFinalBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</td>
								</tr>
								<tr>
									<td className="px-4 py-3 font-medium text-gray-900">Total Contributions</td>
									<td className="px-4 py-3 text-right text-gray-700">${savingsTotalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
									<td className="px-4 py-3 text-right text-gray-700">${investmentTotalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
									<td className="px-4 py-3 text-right text-gray-500">—</td>
								</tr>
								<tr>
									<td className="px-4 py-3 font-medium text-gray-900">Total Earnings</td>
									<td className="px-4 py-3 text-right text-gray-700">${savingsTotalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
									<td className="px-4 py-3 text-right text-gray-700">${investmentTotalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
									<td className={`px-4 py-3 text-right font-medium ${investmentWins ? 'text-green-600' : 'text-blue-600'}`}>
										${(investmentTotalEarnings - savingsTotalEarnings).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</td>
								</tr>
								{(savingsInflationAdjustedBalance || investmentInflationAdjustedBalance) && (
									<tr>
										<td className="px-4 py-3 font-medium text-gray-900">Real Value (Inflation-Adjusted)</td>
										<td className="px-4 py-3 text-right text-gray-700">
											{savingsInflationAdjustedBalance ? `$${savingsInflationAdjustedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
										</td>
										<td className="px-4 py-3 text-right text-gray-700">
											{investmentInflationAdjustedBalance ? `$${investmentInflationAdjustedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
										</td>
										<td className={`px-4 py-3 text-right font-medium ${investmentInflationAdjustedBalance && savingsInflationAdjustedBalance && (investmentInflationAdjustedBalance > savingsInflationAdjustedBalance) ? 'text-green-600' : 'text-blue-600'}`}>
											{savingsInflationAdjustedBalance && investmentInflationAdjustedBalance
												? `$${Math.abs(investmentInflationAdjustedBalance - savingsInflationAdjustedBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
												: '—'}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Insights Block */}
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-6">
					<h4 className="text-base md:text-lg font-semibold text-yellow-800 mb-3">Key Insights</h4>
					<ul className="space-y-2 text-sm text-yellow-700">
						{investmentWins ? (
							<>
								<li>• Investment strategy yields ${Math.abs(differenceInFinalBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} more over the time horizon</li>
								<li>• Investment provides a {Math.abs(percentageAdvantage).toFixed(2)}% advantage over savings</li>
								{breakevenYear && <li>• Investment strategy surpasses savings after {breakevenYear} years</li>}
								<li>• Higher returns come with higher risk and volatility</li>
								<li>• Investments are better suited for long-term goals (5+ years)</li>
							</>
						) : (
							<>
								<li>• Savings strategy yields ${Math.abs(differenceInFinalBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} more over the time horizon</li>
								<li>• Savings provide stability and lower risk</li>
								<li>• Savings are better suited for short-term goals and emergency funds</li>
								<li>• Savings accounts are FDIC-insured and provide guaranteed returns</li>
							</>
						)}
					</ul>
				</div>

				{/* Formula Explanation */}
				{formulaExplanation && (
					<div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 w-full max-w-full overflow-hidden">
						<h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Calculation Details</h4>
						<div className="overflow-x-auto">
							<p className="text-xs md:text-sm text-gray-700 whitespace-pre-line break-words max-w-full">{formulaExplanation}</p>
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for mortgage comparison calculator
	if (calculator.id === 'mortgage-comparison-calculator') {
		const comparisonTable = outputs.comparisonTable as any
		const winner = outputs.winner as any
		const bestScenarioByMetric = outputs.bestScenarioByMetric as any
		const formulaExplanation = outputs.formulaExplanation as string

		if (!comparisonTable || !Array.isArray(comparisonTable) || comparisonTable.length === 0) {
			return null
		}

		const metricLabel = bestScenarioByMetric?.metric === 'lowest-total-monthly-payment' ? 'Lowest Total Monthly Payment' :
			bestScenarioByMetric?.metric === 'lowest-total-interest' ? 'Lowest Total Interest' :
			bestScenarioByMetric?.metric === 'lowest-total-cost' ? 'Lowest Total Cost' :
			'Fastest Payoff'

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Winner Banner */}
				{winner && bestScenarioByMetric && (
					<div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 md:p-6 mb-6 w-full">
						<div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
							<span className="text-xl md:text-2xl">🏆</span>
							<h3 className="text-lg md:text-xl font-bold text-green-800 break-words">Best Mortgage by: {metricLabel}</h3>
						</div>
						<div className="text-2xl md:text-3xl font-bold text-green-700 mb-2 break-words">{winner.scenarioName}</div>
						<div className="text-base md:text-lg text-green-600 break-words">
							{bestScenarioByMetric.metric === 'lowest-total-monthly-payment' && (
								<>Total Monthly Payment: ${winner.totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
							)}
							{bestScenarioByMetric.metric === 'lowest-total-interest' && (
								<>Total Interest: ${winner.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
							)}
							{bestScenarioByMetric.metric === 'lowest-total-cost' && (
								<>Total Cost: ${winner.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
							)}
							{bestScenarioByMetric.metric === 'fastest-payoff' && (
								<>Payoff Time: {winner.payoffMonths ? `${winner.payoffMonths} months` : `${winner.loanTermYears * 12} months`}</>
							)}
						</div>
					</div>
				)}

				{/* Comparison Table */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-full">
					<div className="overflow-x-auto -mx-4 md:mx-0">
						<div className="inline-block min-w-full align-middle">
							<table className="min-w-full text-sm divide-y divide-gray-200">
								<thead className="bg-gray-100">
									<tr>
										<th className="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Mortgage</th>
										<th className="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Loan Amount</th>
										<th className="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">P&I Monthly</th>
										<th className={`px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${bestScenarioByMetric?.metric === 'lowest-total-monthly-payment' ? 'bg-yellow-100' : ''}`}>Total Monthly</th>
										<th className={`px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${bestScenarioByMetric?.metric === 'lowest-total-interest' ? 'bg-yellow-100' : ''}`}>Total Interest</th>
										<th className={`px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${bestScenarioByMetric?.metric === 'lowest-total-cost' ? 'bg-yellow-100' : ''}`}>Total Cost</th>
										<th className="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Term</th>
										<th className="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">APR</th>
										{(comparisonTable.some((mortgage: any) => mortgage.payoffMonths) || bestScenarioByMetric?.metric === 'fastest-payoff') && (
											<th className={`px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${bestScenarioByMetric?.metric === 'fastest-payoff' ? 'bg-yellow-100' : ''}`}>Payoff Date</th>
										)}
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{comparisonTable.map((mortgage: any, index: number) => {
										const isWinner = winner && winner.scenarioName === mortgage.scenarioName
										return (
											<tr key={index} className={isWinner ? 'bg-green-50' : ''}>
												<td className={`px-2 md:px-4 py-3 font-medium whitespace-nowrap ${isWinner ? 'text-green-800 font-bold' : 'text-gray-900'}`}>
													{mortgage.scenarioName}
													{isWinner && <span className="ml-2">🏆</span>}
												</td>
												<td className="px-2 md:px-4 py-3 text-right text-gray-700 whitespace-nowrap">
													${mortgage.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className="px-2 md:px-4 py-3 text-right text-gray-700 whitespace-nowrap">
													${mortgage.monthlyPandI.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className={`px-2 md:px-4 py-3 text-right font-medium whitespace-nowrap ${bestScenarioByMetric?.metric === 'lowest-total-monthly-payment' && isWinner ? 'bg-yellow-200 font-bold' : ''}`}>
													${mortgage.totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className={`px-2 md:px-4 py-3 text-right font-medium whitespace-nowrap ${bestScenarioByMetric?.metric === 'lowest-total-interest' && isWinner ? 'bg-yellow-200 font-bold' : ''}`}>
													${mortgage.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className={`px-2 md:px-4 py-3 text-right font-medium whitespace-nowrap ${bestScenarioByMetric?.metric === 'lowest-total-cost' && isWinner ? 'bg-yellow-200 font-bold' : ''}`}>
													${mortgage.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className="px-2 md:px-4 py-3 text-right text-gray-700 whitespace-nowrap">
													{mortgage.loanTermYears} years
												</td>
												<td className="px-2 md:px-4 py-3 text-right text-gray-700 whitespace-nowrap">
													{mortgage.interestRateAPR}%
												</td>
												{(comparisonTable.some((m: any) => m.payoffMonths) || bestScenarioByMetric?.metric === 'fastest-payoff') && (
													<td className={`px-2 md:px-4 py-3 text-right font-medium whitespace-nowrap ${bestScenarioByMetric?.metric === 'fastest-payoff' && isWinner ? 'bg-yellow-200 font-bold' : ''}`}>
														{mortgage.payoffDate ? new Date(mortgage.payoffDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : `${mortgage.loanTermYears * 12} months`}
													</td>
												)}
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				{/* Formula Explanation */}
				{formulaExplanation && (
					<div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 w-full max-w-full overflow-hidden">
						<h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Calculation Details</h4>
						<div className="overflow-x-auto">
							<p className="text-xs md:text-sm text-gray-700 whitespace-pre-line break-words max-w-full">{formulaExplanation}</p>
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for loan comparison calculator
	if (calculator.id === 'loan-comparison-calculator') {
		const comparisonTable = outputs.comparisonTable as any
		const winner = outputs.winner as any
		const bestLoanByMetric = outputs.bestLoanByMetric as any
		const formulaExplanation = outputs.formulaExplanation as string

		if (!comparisonTable || !Array.isArray(comparisonTable) || comparisonTable.length === 0) {
			return null
		}

		const metricLabel = bestLoanByMetric?.metric === 'lowest-monthly-payment' ? 'Lowest Monthly Payment' :
			bestLoanByMetric?.metric === 'lowest-total-interest' ? 'Lowest Total Interest' :
			'Lowest Total Cost'

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Winner Banner */}
				{winner && bestLoanByMetric && (
					<div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 md:p-6 mb-6 w-full">
						<div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
							<span className="text-xl md:text-2xl">🏆</span>
							<h3 className="text-lg md:text-xl font-bold text-green-800 break-words">Best Choice by: {metricLabel}</h3>
						</div>
						<div className="text-2xl md:text-3xl font-bold text-green-700 mb-2 break-words">{winner.loanName}</div>
						<div className="text-base md:text-lg text-green-600 break-words">
							{bestLoanByMetric.metric === 'lowest-monthly-payment' && (
								<>Monthly Payment: ${winner.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
							)}
							{bestLoanByMetric.metric === 'lowest-total-interest' && (
								<>Total Interest: ${winner.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
							)}
							{bestLoanByMetric.metric === 'lowest-total-cost' && (
								<>Total Cost: ${winner.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
							)}
						</div>
					</div>
				)}

				{/* Comparison Table */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-full">
					<div className="overflow-x-auto -mx-4 md:mx-0">
						<div className="inline-block min-w-full align-middle">
							<table className="min-w-full text-sm divide-y divide-gray-200">
								<thead className="bg-gray-100">
									<tr>
										<th className="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Loan</th>
										<th className="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Amount</th>
										<th className="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">APR</th>
										<th className="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Term</th>
										<th className={`px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${bestLoanByMetric?.metric === 'lowest-monthly-payment' ? 'bg-yellow-100' : ''}`}>Monthly Payment</th>
										<th className={`px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${bestLoanByMetric?.metric === 'lowest-total-interest' ? 'bg-yellow-100' : ''}`}>Total Interest</th>
										<th className={`px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${bestLoanByMetric?.metric === 'lowest-total-cost' ? 'bg-yellow-100' : ''}`}>Total Cost</th>
										{comparisonTable.some((loan: any) => loan.payoffMonths) && (
											<th className="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Payoff Time</th>
										)}
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{comparisonTable.map((loan: any, index: number) => {
										const isWinner = winner && winner.loanName === loan.loanName
										return (
											<tr key={index} className={isWinner ? 'bg-green-50' : ''}>
												<td className={`px-2 md:px-4 py-3 font-medium whitespace-nowrap ${isWinner ? 'text-green-800 font-bold' : 'text-gray-900'}`}>
													{loan.loanName}
													{isWinner && <span className="ml-2">🏆</span>}
												</td>
												<td className="px-2 md:px-4 py-3 text-right text-gray-700 whitespace-nowrap">
													${loan.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className="px-2 md:px-4 py-3 text-right text-gray-700 whitespace-nowrap">
													{loan.annualInterestRate}%
												</td>
												<td className="px-2 md:px-4 py-3 text-right text-gray-700 whitespace-nowrap">
													{loan.loanTermYears} years
												</td>
												<td className={`px-2 md:px-4 py-3 text-right font-medium whitespace-nowrap ${bestLoanByMetric?.metric === 'lowest-monthly-payment' && isWinner ? 'bg-yellow-200 font-bold' : ''}`}>
													${loan.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className={`px-2 md:px-4 py-3 text-right font-medium whitespace-nowrap ${bestLoanByMetric?.metric === 'lowest-total-interest' && isWinner ? 'bg-yellow-200 font-bold' : ''}`}>
													${loan.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className={`px-2 md:px-4 py-3 text-right font-medium whitespace-nowrap ${bestLoanByMetric?.metric === 'lowest-total-cost' && isWinner ? 'bg-yellow-200 font-bold' : ''}`}>
													${loan.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												{comparisonTable.some((l: any) => l.payoffMonths) && (
													<td className="px-2 md:px-4 py-3 text-right text-gray-700 whitespace-nowrap">
														{loan.payoffMonths ? `${loan.payoffMonths} months` : `${loan.loanTermYears * 12} months`}
													</td>
												)}
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				{/* Formula Explanation */}
				{formulaExplanation && (
					<div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200 w-full max-w-full overflow-hidden">
						<h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Calculation Details</h4>
						<div className="overflow-x-auto">
							<p className="text-xs md:text-sm text-gray-700 whitespace-pre-line break-words max-w-full">{formulaExplanation}</p>
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for fuel cost calculator
	if (calculator.id === 'fuel-cost-calculator') {
		const fuelUsed = outputs.fuelUsed as number
		const fuelCost = outputs.fuelCost as number
		const costPerDistance = outputs.costPerDistance as number
		const totalFuelCost = outputs.totalFuelCost as number
		const insights = outputs.insights as string

		if (fuelCost === null || fuelCost === undefined) {
			return null
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Main Cost Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Fuel Cost</div>
						<div className="text-2xl font-bold text-blue-900">
							${fuelCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					{fuelUsed !== null && fuelUsed !== undefined && fuelUsed > 0 && (
						<div className="bg-green-50 rounded-lg p-4 border border-green-200">
							<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Fuel Used</div>
							<div className="text-2xl font-bold text-green-900">
								{fuelUsed.toFixed(2)} {fuelUsed < 10 ? 'gallons' : 'liters'}
							</div>
						</div>
					)}
					{costPerDistance !== null && costPerDistance !== undefined && costPerDistance > 0 && (
						<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
							<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Cost Per Distance</div>
							<div className="text-2xl font-bold text-purple-900">
								${costPerDistance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
					{totalFuelCost !== null && totalFuelCost !== undefined && totalFuelCost !== fuelCost && (
						<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
							<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Total Fuel Cost</div>
							<div className="text-2xl font-bold text-orange-900">
								${totalFuelCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
				</div>

				{/* Insights */}
				{insights && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
						<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
						<div className="space-y-2 text-sm text-blue-700 leading-relaxed">
							{insights.split('.').filter(s => s.trim()).map((insight, index) => (
								<div key={index} className="flex items-start">
									<span className="mr-2">•</span>
									<span>{insight.trim()}.</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for car affordability calculator
	if (calculator.id === 'car-affordability-calculator') {
		const affordablePrice = outputs.affordablePrice as number
		const recommendedBudgetRange = outputs.recommendedBudgetRange as string
		const insights = outputs.insights as string

		if (affordablePrice === null || affordablePrice === undefined) {
			return null
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Main Result Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Affordable Price</div>
						<div className="text-2xl font-bold text-blue-900">
							${affordablePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					{recommendedBudgetRange && (
						<div className="bg-green-50 rounded-lg p-4 border border-green-200">
							<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Recommended Budget Range</div>
							<div className="text-lg font-bold text-green-900">
								{recommendedBudgetRange}
							</div>
						</div>
					)}
				</div>

				{/* Insights */}
				{insights && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
						<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
						<div className="space-y-2 text-sm text-blue-700 leading-relaxed">
							{insights.split('.').filter(s => s.trim()).map((insight, index) => (
								<div key={index} className="flex items-start">
									<span className="mr-2">•</span>
									<span>{insight.trim()}.</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for trip cost calculator
	if (calculator.id === 'trip-cost-calculator') {
		const totalTripCost = outputs.totalTripCost as number
		const fuelCost = outputs.fuelCost as number
		const fuelUsed = outputs.fuelUsed as number
		const tollsCost = outputs.tollsCost as number
		const parkingCost = outputs.parkingCost as number
		const mealsCost = outputs.mealsCost as number
		const accommodationCost = outputs.accommodationCost as number
		const costPerPerson = outputs.costPerPerson as number | null
		const costPerDistance = outputs.costPerDistance as number
		const effectiveDistance = outputs.effectiveDistance as number
		const insights = outputs.insights as string

		if (totalTripCost === null || totalTripCost === undefined) {
			return null
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Main Cost Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Total Trip Cost</div>
						<div className="text-2xl font-bold text-blue-900">
							${totalTripCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Fuel Cost</div>
						<div className="text-2xl font-bold text-green-900">
							${fuelCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
						<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Cost Per Distance</div>
						<div className="text-2xl font-bold text-purple-900">
							${costPerDistance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					{costPerPerson !== null && costPerPerson !== undefined && (
						<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
							<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Cost Per Person</div>
							<div className="text-2xl font-bold text-orange-900">
								${costPerPerson.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
					{fuelUsed !== null && fuelUsed !== undefined && fuelUsed > 0 && (
						<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
							<div className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Fuel Used</div>
							<div className="text-2xl font-bold text-indigo-900">
								{fuelUsed.toFixed(2)} {effectiveDistance > 0 ? 'gallons' : 'liters'}
							</div>
						</div>
					)}
					{effectiveDistance !== null && effectiveDistance !== undefined && effectiveDistance > 0 && (
						<div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
							<div className="text-xs font-medium text-yellow-600 uppercase tracking-wide mb-1">Effective Distance</div>
							<div className="text-2xl font-bold text-yellow-900">
								{effectiveDistance.toLocaleString('en-US', { maximumFractionDigits: 0 })} miles
							</div>
						</div>
					)}
				</div>

				{/* Cost Breakdown */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
					<h3 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 border-b border-gray-200">
						Cost Breakdown
					</h3>
					<div className="p-4">
						<div className="space-y-2">
							{fuelCost > 0 && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="text-sm text-gray-600">Fuel</span>
									<span className="text-sm font-semibold text-gray-900">
										${fuelCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							)}
							{tollsCost > 0 && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="text-sm text-gray-600">Tolls</span>
									<span className="text-sm font-semibold text-gray-900">
										${tollsCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							)}
							{parkingCost > 0 && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="text-sm text-gray-600">Parking</span>
									<span className="text-sm font-semibold text-gray-900">
										${parkingCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							)}
							{mealsCost > 0 && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="text-sm text-gray-600">Meals</span>
									<span className="text-sm font-semibold text-gray-900">
										${mealsCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							)}
							{accommodationCost > 0 && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="text-sm text-gray-600">Accommodation</span>
									<span className="text-sm font-semibold text-gray-900">
										${accommodationCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							)}
							<div className="flex justify-between items-center py-2 pt-3 border-t border-gray-200 mt-2">
								<span className="text-sm font-semibold text-gray-900">Total</span>
								<span className="text-base font-bold text-blue-900">
									${totalTripCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Insights */}
				{insights && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
						<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
						<div className="space-y-2 text-sm text-blue-700 leading-relaxed">
							{insights.split('.').filter(s => s.trim()).map((insight, index) => (
								<div key={index} className="flex items-start">
									<span className="mr-2">•</span>
									<span>{insight.trim()}.</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for tire cost calculator
	if (calculator.id === 'tire-cost-calculator') {
		const totalTireSetCost = outputs.totalTireSetCost as number
		const yearsPerSet = outputs.yearsPerSet as number
		const annualTireCost = outputs.annualTireCost as number
		const costPerMile = outputs.costPerMile as number
		const tireSetCost = outputs.tireSetCost as number
		const seasonalTotalCost = outputs.seasonalTotalCost as number | null
		const insights = outputs.insights as string

		if (totalTireSetCost === null || totalTireSetCost === undefined) {
			return null
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Main Cost Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Total Tire Set Cost</div>
						<div className="text-2xl font-bold text-blue-900">
							${totalTireSetCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Years Per Set</div>
						<div className="text-2xl font-bold text-green-900">
							{yearsPerSet.toFixed(2)}
						</div>
					</div>
					<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
						<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Annual Tire Cost</div>
						<div className="text-2xl font-bold text-purple-900">
							${annualTireCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
						<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Cost Per Mile</div>
						<div className="text-2xl font-bold text-orange-900">
							${costPerMile.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
						</div>
					</div>
					{tireSetCost !== null && tireSetCost !== undefined && (
						<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
							<div className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Tire Set Cost (Tires Only)</div>
							<div className="text-2xl font-bold text-indigo-900">
								${tireSetCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
					{seasonalTotalCost !== null && seasonalTotalCost !== undefined && (
						<div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
							<div className="text-xs font-medium text-yellow-600 uppercase tracking-wide mb-1">Seasonal Total Cost</div>
							<div className="text-2xl font-bold text-yellow-900">
								${seasonalTotalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
				</div>

				{/* Insights */}
				{insights && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
						<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
						<div className="space-y-2 text-sm text-blue-700 leading-relaxed">
							{insights.split('.').filter(s => s.trim()).map((insight, index) => (
								<div key={index} className="flex items-start">
									<span className="mr-2">•</span>
									<span>{insight.trim()}.</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for car resale value calculator
	if (calculator.id === 'car-resale-value-calculator') {
		const estimatedResaleValue = outputs.estimatedResaleValue as number
		const valueLossAmount = outputs.valueLossAmount as number
		const valueLossPercent = outputs.valueLossPercent as number
		const averageLossPerYear = outputs.averageLossPerYear as number
		const yearByYearTableStr = outputs.yearByYearTable as string
		const insights = outputs.insights as string

		if (estimatedResaleValue === null || estimatedResaleValue === undefined) {
			return null
		}

		let yearByYearTable: any[] = []
		if (yearByYearTableStr) {
			try {
				yearByYearTable = JSON.parse(yearByYearTableStr)
			} catch (e) {
				// Ignore parse errors
			}
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Main Result Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Estimated Resale Value</div>
						<div className="text-2xl font-bold text-blue-900">
							${estimatedResaleValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-red-50 rounded-lg p-4 border border-red-200">
						<div className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Total Value Loss</div>
						<div className="text-2xl font-bold text-red-900">
							${valueLossAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
						<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Value Loss %</div>
						<div className="text-2xl font-bold text-orange-900">
							{valueLossPercent.toFixed(1)}%
						</div>
					</div>
					{averageLossPerYear !== null && averageLossPerYear !== undefined && (
						<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
							<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Average Loss Per Year</div>
							<div className="text-2xl font-bold text-purple-900">
								${averageLossPerYear.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
				</div>

				{/* Year-by-Year Table */}
				{yearByYearTable && yearByYearTable.length > 0 && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
						<h3 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 border-b border-gray-200">
							Year-by-Year Value Breakdown
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="bg-gray-100">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Year</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Car Value</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Value Loss</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{yearByYearTable.map((entry: any, index: number) => (
										<tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
											<td className="px-4 py-3 font-medium text-gray-900">{entry.year}</td>
											<td className="px-4 py-3 text-right text-gray-700">
												${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
											<td className="px-4 py-3 text-right text-red-600 font-semibold">
												${entry.loss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Insights */}
				{insights && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
						<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
						<div className="space-y-2 text-sm text-blue-700 leading-relaxed">
							{insights.split('.').filter(s => s.trim()).map((insight, index) => (
								<div key={index} className="flex items-start">
									<span className="mr-2">•</span>
									<span>{insight.trim()}.</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for car depreciation calculator
	if (calculator.id === 'car-depreciation-calculator') {
		const estimatedResaleValue = outputs.estimatedResaleValue as number
		const totalDepreciationAmount = outputs.totalDepreciationAmount as number
		const depreciationPerYearAvg = outputs.depreciationPerYearAvg as number
		const depreciationPercentTotal = outputs.depreciationPercentTotal as number
		const yearByYearTableStr = outputs.yearByYearTable as string
		const insights = outputs.insights as string

		if (estimatedResaleValue === null || estimatedResaleValue === undefined) {
			return null
		}

		let yearByYearTable: any[] = []
		if (yearByYearTableStr) {
			try {
				yearByYearTable = JSON.parse(yearByYearTableStr)
			} catch (e) {
				// Ignore parse errors
			}
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Main Result Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Estimated Resale Value</div>
						<div className="text-2xl font-bold text-blue-900">
							${estimatedResaleValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-red-50 rounded-lg p-4 border border-red-200">
						<div className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Total Depreciation</div>
						<div className="text-2xl font-bold text-red-900">
							${totalDepreciationAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
						<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Avg Per Year</div>
						<div className="text-2xl font-bold text-purple-900">
							${depreciationPerYearAvg.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
						<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Depreciation %</div>
						<div className="text-2xl font-bold text-orange-900">
							{depreciationPercentTotal.toFixed(1)}%
						</div>
					</div>
				</div>

				{/* Year-by-Year Table */}
				{yearByYearTable && yearByYearTable.length > 0 && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
						<h3 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 border-b border-gray-200">
							Year-by-Year Depreciation
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="bg-gray-100">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Year</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Car Value</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Depreciation</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{yearByYearTable.map((entry: any, index: number) => (
										<tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
											<td className="px-4 py-3 font-medium text-gray-900">{entry.year}</td>
											<td className="px-4 py-3 text-right text-gray-700">
												${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
											<td className="px-4 py-3 text-right text-red-600 font-semibold">
												${entry.depreciation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Insights */}
				{insights && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
						<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
						<div className="space-y-2 text-sm text-blue-700 leading-relaxed">
							{insights.split('.').filter(s => s.trim()).map((insight, index) => (
								<div key={index} className="flex items-start">
									<span className="mr-2">•</span>
									<span>{insight.trim()}.</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for monthly car expenses calculator
	if (calculator.id === 'monthly-car-expenses-calculator') {
		const totalMonthlyCost = outputs.totalMonthlyCost as number
		const totalFixedCosts = outputs.totalFixedCosts as number
		const totalVariableCosts = outputs.totalVariableCosts as number
		const costPerDay = outputs.costPerDay as number
		const costPerMile = outputs.costPerMile as number
		const fuelCost = outputs.fuelCost as number
		const breakdownStr = outputs.breakdown as string
		const biggestExpense = outputs.biggestExpense as string
		const insights = outputs.insights as string

		if (totalMonthlyCost === null || totalMonthlyCost === undefined) {
			return null
		}

		let breakdown: any = null
		if (breakdownStr) {
			try {
				breakdown = JSON.parse(breakdownStr)
			} catch (e) {
				// Ignore parse errors
			}
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Main Cost Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Total Monthly Cost</div>
						<div className="text-2xl font-bold text-blue-900">
							${totalMonthlyCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Fixed Costs</div>
						<div className="text-2xl font-bold text-green-900">
							${totalFixedCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
						<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Variable Costs</div>
						<div className="text-2xl font-bold text-purple-900">
							${totalVariableCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
						<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Cost Per Day</div>
						<div className="text-2xl font-bold text-orange-900">
							${costPerDay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					{costPerMile !== null && costPerMile !== undefined && costPerMile > 0 && (
						<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
							<div className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Cost Per Mile</div>
							<div className="text-2xl font-bold text-indigo-900">
								${costPerMile.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
							</div>
						</div>
					)}
					{fuelCost !== null && fuelCost !== undefined && fuelCost > 0 && (
						<div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
							<div className="text-xs font-medium text-yellow-600 uppercase tracking-wide mb-1">Fuel Cost</div>
							<div className="text-2xl font-bold text-yellow-900">
								${fuelCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
				</div>

				{/* Breakdown */}
				{breakdown && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
						<h3 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 border-b border-gray-200">
							Expense Breakdown
						</h3>
						<div className="p-4">
							{/* Fixed Costs */}
							{breakdown.fixed && (
								<div className="mb-6">
									<h4 className="text-base font-semibold text-gray-700 mb-3">Fixed Costs</h4>
									<div className="space-y-2">
										{breakdown.fixed.insurance !== undefined && breakdown.fixed.insurance > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Insurance</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.fixed.insurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										{breakdown.fixed.parking !== undefined && breakdown.fixed.parking > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Parking</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.fixed.parking.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										{breakdown.fixed.loan !== undefined && breakdown.fixed.loan > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Loan Payment</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.fixed.loan.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										{breakdown.fixed.registration !== undefined && breakdown.fixed.registration > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Registration</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.fixed.registration.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										<div className="flex justify-between items-center py-2 pt-3 border-t border-gray-200 mt-2">
											<span className="text-sm font-semibold text-gray-900">Fixed Total</span>
											<span className="text-base font-bold text-green-900">
												${breakdown.fixed.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</span>
										</div>
									</div>
								</div>
							)}

							{/* Variable Costs */}
							{breakdown.variable && (
								<div className="mb-4">
									<h4 className="text-base font-semibold text-gray-700 mb-3">Variable Costs</h4>
									<div className="space-y-2">
										{breakdown.variable.fuel !== undefined && breakdown.variable.fuel > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Fuel</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.variable.fuel.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										{breakdown.variable.maintenance !== undefined && breakdown.variable.maintenance > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Maintenance</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.variable.maintenance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										{breakdown.variable.repairs !== undefined && breakdown.variable.repairs > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Repairs</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.variable.repairs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										{breakdown.variable.other !== undefined && breakdown.variable.other > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Other</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.variable.other.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										<div className="flex justify-between items-center py-2 pt-3 border-t border-gray-200 mt-2">
											<span className="text-sm font-semibold text-gray-900">Variable Total</span>
											<span className="text-base font-bold text-purple-900">
												${breakdown.variable.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</span>
										</div>
									</div>
								</div>
							)}

							{/* Total */}
							<div className="pt-4 border-t-2 border-gray-300 mt-4">
								<div className="flex justify-between items-center">
									<span className="text-lg font-bold text-gray-900">Total Monthly Cost</span>
									<span className="text-xl font-bold text-blue-900">
										${breakdown.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Biggest Expense */}
				{biggestExpense && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
						<h4 className="text-base font-semibold text-yellow-800 mb-2">Biggest Expense</h4>
						<p className="text-lg font-bold text-yellow-900">{biggestExpense}</p>
					</div>
				)}

				{/* Insights */}
				{insights && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
						<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
						<div className="space-y-2 text-sm text-blue-700 leading-relaxed">
							{insights.split('.').filter(s => s.trim()).map((insight, index) => (
								<div key={index} className="flex items-start">
									<span className="mr-2">•</span>
									<span>{insight.trim()}.</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for car maintenance cost calculator
	if (calculator.id === 'car-maintenance-cost-calculator') {
		const totalAnnualMaintenanceCost = outputs.totalAnnualMaintenanceCost as number
		const monthlyMaintenanceCost = outputs.monthlyMaintenanceCost as number
		const costPerMile = outputs.costPerMile as number
		const routineMaintenanceAnnual = outputs.routineMaintenanceAnnual as number
		const unexpectedRepairsAnnual = outputs.unexpectedRepairsAnnual as number
		const breakdownStr = outputs.breakdown as string
		const insights = outputs.insights as string

		if (totalAnnualMaintenanceCost === null || totalAnnualMaintenanceCost === undefined) {
			return null
		}

		let breakdown: any = null
		if (breakdownStr) {
			try {
				breakdown = JSON.parse(breakdownStr)
			} catch (e) {
				// Ignore parse errors
			}
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Main Cost Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Total Annual Maintenance</div>
						<div className="text-2xl font-bold text-blue-900">
							${totalAnnualMaintenanceCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Monthly Maintenance Cost</div>
						<div className="text-2xl font-bold text-green-900">
							${monthlyMaintenanceCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
						<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Cost Per Mile</div>
						<div className="text-2xl font-bold text-purple-900">
							${costPerMile.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
						</div>
					</div>
					{routineMaintenanceAnnual !== null && routineMaintenanceAnnual !== undefined && (
						<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
							<div className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Routine Maintenance Annual</div>
							<div className="text-2xl font-bold text-indigo-900">
								${routineMaintenanceAnnual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
					{unexpectedRepairsAnnual !== null && unexpectedRepairsAnnual !== undefined && (
						<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
							<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Unexpected Repairs Annual</div>
							<div className="text-2xl font-bold text-orange-900">
								${unexpectedRepairsAnnual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
				</div>

				{/* Breakdown */}
				{breakdown && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
						<h3 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 border-b border-gray-200">
							Maintenance Breakdown
						</h3>
						<div className="p-4">
							{/* Routine Maintenance */}
							{breakdown.routine && (
								<div className="mb-6">
									<h4 className="text-base font-semibold text-gray-700 mb-3">Routine Maintenance</h4>
									<div className="space-y-2">
										{breakdown.routine.oilChanges !== undefined && breakdown.routine.oilChanges > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Oil Changes</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.routine.oilChanges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										{breakdown.routine.tireService !== undefined && breakdown.routine.tireService > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Tire Service</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.routine.tireService.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										{breakdown.routine.brakeService !== undefined && breakdown.routine.brakeService > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Brake Service</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.routine.brakeService.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										{breakdown.routine.scheduledService !== undefined && breakdown.routine.scheduledService > 0 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Scheduled Service</span>
												<span className="text-sm font-semibold text-gray-900">
													${breakdown.routine.scheduledService.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</span>
											</div>
										)}
										<div className="flex justify-between items-center py-2 pt-3 border-t border-gray-200 mt-2">
											<span className="text-sm font-semibold text-gray-900">Routine Total</span>
											<span className="text-base font-bold text-indigo-900">
												${breakdown.routine.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</span>
										</div>
									</div>
								</div>
							)}

							{/* Unexpected Repairs */}
							{breakdown.unexpected && (
								<div className="mb-4">
									<h4 className="text-base font-semibold text-gray-700 mb-3">Unexpected Repairs</h4>
									<div className="space-y-2">
										<div className="flex justify-between items-center py-2 border-b border-gray-100">
											<span className="text-sm text-gray-600">Base Annual Cost</span>
											<span className="text-sm font-semibold text-gray-900">
												${breakdown.unexpected.base.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</span>
										</div>
										{breakdown.unexpected.ageMultiplier && breakdown.unexpected.ageMultiplier > 1 && (
											<div className="flex justify-between items-center py-2 border-b border-gray-100">
												<span className="text-sm text-gray-600">Age Multiplier</span>
												<span className="text-sm font-semibold text-orange-600">
													{breakdown.unexpected.ageMultiplier.toFixed(1)}x
												</span>
											</div>
										)}
										<div className="flex justify-between items-center py-2 pt-3 border-t border-gray-200 mt-2">
											<span className="text-sm font-semibold text-gray-900">Adjusted Annual Cost</span>
											<span className="text-base font-bold text-orange-900">
												${breakdown.unexpected.adjusted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</span>
										</div>
									</div>
								</div>
							)}

							{/* Total */}
							<div className="pt-4 border-t-2 border-gray-300 mt-4">
								<div className="flex justify-between items-center">
									<span className="text-lg font-bold text-gray-900">Total Annual Maintenance</span>
									<span className="text-xl font-bold text-blue-900">
										${breakdown.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Insights */}
				{insights && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
						<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
						<div className="space-y-2 text-sm text-blue-700 leading-relaxed">
							{insights.split('.').filter(s => s.trim()).map((insight, index) => (
								<div key={index} className="flex items-start">
									<span className="mr-2">•</span>
									<span>{insight.trim()}.</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for car cost of ownership calculator
	if (calculator.id === 'car-cost-of-ownership-calculator') {
		const totalOwnershipCost = outputs.totalOwnershipCost as number
		const monthlyCost = outputs.monthlyCost as number
		const annualCost = outputs.annualCost as number
		const costPerMile = outputs.costPerMile as number
		const totalFuelCost = outputs.totalFuelCost as number
		const totalMaintenanceCost = outputs.totalMaintenanceCost as number
		const totalFixedCosts = outputs.totalFixedCosts as number
		const depreciationCost = outputs.depreciationCost as number
		const resaleValue = outputs.resaleValue as number
		const breakdownStr = outputs.breakdown as string
		const biggestCostDriver = outputs.biggestCostDriver as string
		const insights = outputs.insights as string

		if (totalOwnershipCost === null || totalOwnershipCost === undefined) {
			return null
		}

		let breakdown: any = null
		if (breakdownStr) {
			try {
				breakdown = JSON.parse(breakdownStr)
			} catch (e) {
				// Ignore parse errors
			}
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Main Cost Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Total Ownership Cost</div>
						<div className="text-2xl font-bold text-blue-900">
							${totalOwnershipCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Monthly Cost</div>
						<div className="text-2xl font-bold text-green-900">
							${monthlyCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
						<div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Annual Cost</div>
						<div className="text-2xl font-bold text-purple-900">
							${annualCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
						<div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Cost Per Mile</div>
						<div className="text-2xl font-bold text-orange-900">
							${costPerMile.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					{resaleValue !== null && resaleValue !== undefined && (
						<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
							<div className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Resale Value</div>
							<div className="text-2xl font-bold text-indigo-900">
								${resaleValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					)}
				</div>

				{/* Cost Breakdown */}
				{breakdown && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
						<h3 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 border-b border-gray-200">
							Cost Breakdown
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="bg-gray-100">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Percentage</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{breakdown.fuel !== undefined && breakdown.fuel > 0 && (
										<tr>
											<td className="px-4 py-3 font-medium text-gray-700">Fuel</td>
											<td className="px-4 py-3 text-right text-gray-900">
												${breakdown.fuel.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
											<td className="px-4 py-3 text-right text-gray-600">
												{totalOwnershipCost > 0 ? ((breakdown.fuel / totalOwnershipCost) * 100).toFixed(1) : '0.0'}%
											</td>
										</tr>
									)}
									{breakdown.maintenance !== undefined && breakdown.maintenance > 0 && (
										<tr>
											<td className="px-4 py-3 font-medium text-gray-700">Maintenance & Repairs</td>
											<td className="px-4 py-3 text-right text-gray-900">
												${breakdown.maintenance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
											<td className="px-4 py-3 text-right text-gray-600">
												{totalOwnershipCost > 0 ? ((breakdown.maintenance / totalOwnershipCost) * 100).toFixed(1) : '0.0'}%
											</td>
										</tr>
									)}
									{breakdown.insurance !== undefined && breakdown.insurance > 0 && (
										<tr>
											<td className="px-4 py-3 font-medium text-gray-700">Insurance</td>
											<td className="px-4 py-3 text-right text-gray-900">
												${breakdown.insurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
											<td className="px-4 py-3 text-right text-gray-600">
												{totalOwnershipCost > 0 ? ((breakdown.insurance / totalOwnershipCost) * 100).toFixed(1) : '0.0'}%
											</td>
										</tr>
									)}
									{breakdown.registration !== undefined && breakdown.registration > 0 && (
										<tr>
											<td className="px-4 py-3 font-medium text-gray-700">Registration</td>
											<td className="px-4 py-3 text-right text-gray-900">
												${breakdown.registration.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
											<td className="px-4 py-3 text-right text-gray-600">
												{totalOwnershipCost > 0 ? ((breakdown.registration / totalOwnershipCost) * 100).toFixed(1) : '0.0'}%
											</td>
										</tr>
									)}
									{breakdown.parking !== undefined && breakdown.parking > 0 && (
										<tr>
											<td className="px-4 py-3 font-medium text-gray-700">Parking</td>
											<td className="px-4 py-3 text-right text-gray-900">
												${breakdown.parking.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
											<td className="px-4 py-3 text-right text-gray-600">
												{totalOwnershipCost > 0 ? ((breakdown.parking / totalOwnershipCost) * 100).toFixed(1) : '0.0'}%
											</td>
										</tr>
									)}
									{breakdown.depreciation !== undefined && breakdown.depreciation > 0 && (
										<tr>
											<td className="px-4 py-3 font-medium text-gray-700">Depreciation</td>
											<td className="px-4 py-3 text-right text-gray-900">
												${breakdown.depreciation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
											<td className="px-4 py-3 text-right text-gray-600">
												{totalOwnershipCost > 0 ? ((breakdown.depreciation / totalOwnershipCost) * 100).toFixed(1) : '0.0'}%
											</td>
										</tr>
									)}
									<tr className="bg-gray-50 font-bold">
										<td className="px-4 py-3 text-gray-900">Total</td>
										<td className="px-4 py-3 text-right text-blue-900">
											${totalOwnershipCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
										</td>
										<td className="px-4 py-3 text-right text-blue-900">100.0%</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Biggest Cost Driver */}
				{biggestCostDriver && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
						<h4 className="text-base font-semibold text-yellow-800 mb-2">Biggest Cost Driver</h4>
						<p className="text-lg font-bold text-yellow-900">{biggestCostDriver}</p>
					</div>
				)}

				{/* Insights */}
				{insights && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
						<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
						<div className="space-y-2 text-sm text-blue-700 leading-relaxed">
							{insights.split('.').filter(s => s.trim()).map((insight, index) => (
								<div key={index} className="flex items-start">
									<span className="mr-2">•</span>
									<span>{insight.trim()}.</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Special handling for lease vs buy calculator
	if (calculator.id === 'lease-vs-buy-calculator') {
		const totalCostBuy = outputs.totalCostBuy as number
		const totalCostLease = outputs.totalCostLease as number
		const difference = outputs.difference as number
		const recommendationText = outputs.recommendationText as string
		const breakdownStr = outputs.breakdown as string
		const insights = outputs.insights as string
		const monthlyLoanPayment = outputs.monthlyLoanPayment as number
		const mileagePenalty = outputs.mileagePenalty as number

		if (totalCostBuy === null || totalCostBuy === undefined || totalCostLease === null || totalCostLease === undefined) {
			return null
		}

		let breakdown: any = null
		if (breakdownStr) {
			try {
				breakdown = JSON.parse(breakdownStr)
			} catch (e) {
				// Ignore parse errors
			}
		}

		return (
			<div className="w-full max-w-full space-y-6">
				{/* Main Comparison Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Total Cost to Buy</div>
						<div className="text-2xl font-bold text-blue-900">
							${totalCostBuy.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Total Cost to Lease</div>
						<div className="text-2xl font-bold text-green-900">
							${totalCostLease.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
				</div>

				{/* Difference and Recommendation */}
				<div className={`rounded-lg p-4 md:p-6 border-2 mb-6 ${
					difference > 0 
						? 'bg-blue-50 border-blue-500' 
						: difference < 0 
							? 'bg-green-50 border-green-500' 
							: 'bg-gray-50 border-gray-500'
				}`}>
					<div className="flex items-center gap-3 mb-2">
						<span className="text-2xl">
							{difference > 0 ? '💰' : difference < 0 ? '🚗' : '⚖️'}
						</span>
						<h3 className="text-lg md:text-xl font-bold text-gray-800">
							{difference > 0 ? 'Buying is Cheaper' : difference < 0 ? 'Leasing is Cheaper' : 'Costs are Similar'}
						</h3>
					</div>
					<div className="text-xl md:text-2xl font-bold mb-3">
						{difference !== 0 && (
							<span className={difference > 0 ? 'text-blue-700' : 'text-green-700'}>
								${Math.abs(difference).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} difference
							</span>
						)}
					</div>
					{recommendationText && (
						<p className="text-base text-gray-700 leading-relaxed">
							{recommendationText}
						</p>
					)}
				</div>

				{/* Breakdown Table */}
				{breakdown && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
						<h3 className="text-lg font-semibold text-gray-800 p-4 bg-gray-50 border-b border-gray-200">
							Cost Breakdown
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="bg-gray-100">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Buy</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Lease</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									<tr>
										<td className="px-4 py-3 font-medium text-gray-700">Upfront Costs</td>
										<td className="px-4 py-3 text-right text-gray-900">
											${breakdown.buy?.upfront?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
										</td>
										<td className="px-4 py-3 text-right text-gray-900">
											${breakdown.lease?.upfront?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
										</td>
									</tr>
									<tr>
										<td className="px-4 py-3 font-medium text-gray-700">Monthly Payments</td>
										<td className="px-4 py-3 text-right text-gray-900">
											${breakdown.buy?.monthlyPayments?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
										</td>
										<td className="px-4 py-3 text-right text-gray-900">
											${breakdown.lease?.monthlyPayments?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
										</td>
									</tr>
									{breakdown.buy?.resaleCredit && breakdown.buy.resaleCredit < 0 && (
										<tr>
											<td className="px-4 py-3 font-medium text-gray-700">Resale Value Credit</td>
											<td className="px-4 py-3 text-right text-green-600 font-semibold">
												${Math.abs(breakdown.buy.resaleCredit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
											<td className="px-4 py-3 text-right text-gray-500">—</td>
										</tr>
									)}
									{breakdown.lease?.mileagePenalty && breakdown.lease.mileagePenalty > 0 && (
										<tr>
											<td className="px-4 py-3 font-medium text-gray-700">Mileage Penalty</td>
											<td className="px-4 py-3 text-right text-gray-500">—</td>
											<td className="px-4 py-3 text-right text-red-600 font-semibold">
												${breakdown.lease.mileagePenalty.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</td>
										</tr>
									)}
									{(breakdown.buy?.insuranceMaintenance || breakdown.lease?.insuranceMaintenance) && (
										<tr>
											<td className="px-4 py-3 font-medium text-gray-700">Insurance & Maintenance</td>
											<td className="px-4 py-3 text-right text-gray-900">
												${breakdown.buy?.insuranceMaintenance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
											</td>
											<td className="px-4 py-3 text-right text-gray-900">
												${breakdown.lease?.insuranceMaintenance ? Math.abs(breakdown.lease.insuranceMaintenance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
											</td>
										</tr>
									)}
									<tr className="bg-gray-50 font-bold">
										<td className="px-4 py-3 text-gray-900">Total Cost</td>
										<td className="px-4 py-3 text-right text-blue-900">
											${breakdown.buy?.total?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
										</td>
										<td className="px-4 py-3 text-right text-green-900">
											${breakdown.lease?.total?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Additional Details */}
				{(monthlyLoanPayment || mileagePenalty) && (
					<div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
						<h4 className="text-base font-semibold text-gray-800 mb-3">Additional Details</h4>
						<div className="space-y-2 text-sm text-gray-700">
							{monthlyLoanPayment && monthlyLoanPayment > 0 && (
								<div>
									<span className="font-medium">Monthly Loan Payment:</span>{' '}
									<span className="text-gray-900">${monthlyLoanPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
								</div>
							)}
							{mileagePenalty && mileagePenalty > 0 && (
								<div>
									<span className="font-medium">Mileage Penalty:</span>{' '}
									<span className="text-red-600">${mileagePenalty.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Insights */}
				{insights && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-6">
						<h4 className="text-base md:text-lg font-semibold text-yellow-800 mb-3">Key Insights</h4>
						<div className="space-y-2 text-sm text-yellow-700 leading-relaxed">
							{insights.split('.').filter(s => s.trim()).map((insight, index) => (
								<div key={index} className="flex items-start">
									<span className="mr-2">•</span>
									<span>{insight.trim()}.</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Find main result (usually "area", "volume", "perimeter", "percentageChange", "roots", "result", "value", "mean", "standardDeviation", "finalAmount", "finalValue", "finalSavings", "periodicPayment", "monthlyPayment", "monthlyMortgagePayment", "overpayment", "roiPercentage", or first output)
	const mainOutput = calculator.outputs.find((out) => 
		out.name === 'area' || out.name === 'volume' || out.name === 'perimeter' || out.name === 'percentageChange' || out.name === 'roots' || out.name === 'result' || out.name === 'value' || out.name === 'mean' || out.name === 'standardDeviation' || out.name === 'finalAmount' || out.name === 'finalValue' || out.name === 'finalSavings' || out.name === 'periodicPayment' || out.name === 'monthlyPayment' || out.name === 'monthlyMortgagePayment' || out.name === 'overpayment' || out.name === 'roiPercentage'
	) || calculator.outputs[0]

	// Find formula output
	const formulaOutput = calculator.outputs.find((out) => 
		out.name === 'formula'
	)

	// Find explanation output (for pythagorean calculator)
	const explanationOutput = calculator.outputs.find((out) => 
		out.name === 'explanation'
	)

	// Find direction output (for percentage change calculator)
	const directionOutput = calculator.outputs.find((out) => 
		out.name === 'direction'
	)
	const directionValue = directionOutput ? outputs[directionOutput.name] : null

	// Find discriminant output (for quadratic calculator)
	const discriminantOutput = calculator.outputs.find((out) => 
		out.name === 'discriminant'
	)
	const discriminantValue = discriminantOutput ? outputs[discriminantOutput.name] : null

	// Find steps output (for equation solver)
	const stepsOutput = calculator.outputs.find((out) => 
		out.name === 'steps'
	)
	const stepsValue = stepsOutput ? outputs[stepsOutput.name] : null

	// Find normalized form output (for equation solver)
	const normalizedFormOutput = calculator.outputs.find((out) => 
		out.name === 'normalizedForm'
	)
	const normalizedFormValue = normalizedFormOutput ? outputs[normalizedFormOutput.name] : null

	// Find roots output (for equation solver and quadratic calculator)
	const rootsOutput = calculator.outputs.find((out) => 
		out.name === 'roots'
	)
	const rootsValue = rootsOutput ? outputs[rootsOutput.name] : null

	// Find sortedData output (for descriptive statistics)
	const sortedDataOutput = calculator.outputs.find((out) => 
		out.name === 'sortedData'
	)
	const sortedDataValue = sortedDataOutput ? outputs[sortedDataOutput.name] : null

	// Find yearBreakdown/yearlyBreakdown output (for compound interest and investment calculators)
	const yearBreakdownOutput = calculator.outputs.find((out) => 
		out.name === 'yearBreakdown' || out.name === 'yearlyBreakdown'
	)
	const yearBreakdownValue = yearBreakdownOutput ? outputs[yearBreakdownOutput.name] : null

	// Find formulaExplanation output (for loan payment and compound interest calculators)
	const formulaExplanationOutput = calculator.outputs.find((out) => 
		out.name === 'formulaExplanation'
	)
	const formulaExplanationValue = formulaExplanationOutput ? outputs[formulaExplanationOutput.name] : null

	// Other outputs (excluding main, formula, explanation, direction, discriminant, steps, normalizedForm, roots, sortedData, yearBreakdown, yearlyBreakdown, formulaExplanation, and shapeName)
	const otherOutputs = calculator.outputs.filter((out) => 
		out.name !== mainOutput?.name && out.name !== 'formula' && out.name !== 'explanation' && out.name !== 'direction' && out.name !== 'discriminant' && out.name !== 'steps' && out.name !== 'normalizedForm' && out.name !== 'roots' && out.name !== 'sortedData' && out.name !== 'yearBreakdown' && out.name !== 'yearlyBreakdown' && out.name !== 'formulaExplanation' && out.name !== 'shapeName'
	)

	const mainValue = mainOutput ? outputs[mainOutput.name] : null
	// Format different output types
	let formattedMainValue = null
	if (mainValue !== null && mainOutput) {
		if (mainOutput.name === 'result' && calculator.id === 'equation-solver') {
			// Format result for equation solver (can be string or number)
			if (typeof mainValue === 'string') {
				formattedMainValue = mainValue
			} else if (typeof mainValue === 'number') {
				formattedMainValue = `x = ${mainValue.toFixed(6)}`
			} else if (Array.isArray(mainValue)) {
				// Array of roots
				const arrValue = mainValue as unknown[]
				if (arrValue.length === 0) {
					formattedMainValue = 'No real roots'
				} else {
					formattedMainValue = (arrValue as number[]).map((r: number) => `x = ${r.toFixed(6)}`).join(', ')
				}
			} else {
				formattedMainValue = String(mainValue)
			}
		} else if (mainOutput.name === 'roots') {
			// Format roots array for quadratic calculator
			if (Array.isArray(mainValue)) {
				const arrValue = mainValue as unknown[]
				if (arrValue.length === 0) {
					formattedMainValue = 'No real roots'
				} else if (arrValue.length === 1 && typeof arrValue[0] === 'string') {
					formattedMainValue = arrValue[0] as string
				} else {
					formattedMainValue = (arrValue as number[]).map((r: number) => r.toFixed(6)).join(', ')
				}
			} else if (typeof mainValue === 'string') {
				formattedMainValue = mainValue
			} else {
				formattedMainValue = String(mainValue)
			}
		} else if (mainOutput.name === 'percentageChange') {
			const numValue = Number(mainValue)
			const sign = numValue >= 0 ? '+' : ''
			formattedMainValue = `${sign}${numValue.toFixed(6)}%`
		} else {
			formattedMainValue = formatOutputValue(
				mainValue,
				mainOutput.formatType,
				mainOutput.unitLabel,
			)
		}
	}

	const formulaValue = formulaOutput ? outputs[formulaOutput.name] : null
	const explanationValue = explanationOutput ? outputs[explanationOutput.name] : null

	// Special handling for BMI calculator
	const categoryValue = calculator.id === 'bmi-calculator' ? (outputs.category ? String(outputs.category) : null) : null
	const categoryDescriptionValue = calculator.id === 'bmi-calculator' ? outputs.categoryDescription : null
	const healthyWeightRangeValue = calculator.id === 'bmi-calculator' ? outputs.healthyWeightRange : null

	// Special handling for BMR calculator
	const bmrValue = calculator.id === 'bmr-calculator' ? outputs.bmr : null
	const bmrPerHourValue = calculator.id === 'bmr-calculator' ? outputs.bmrPerHour : null
	const formulaUsedValue = calculator.id === 'bmr-calculator' ? outputs.formulaUsed : null
	const bmrExplanationValue = calculator.id === 'bmr-calculator' ? outputs.explanation : null

	// Special handling for TDEE calculator
	const tdeeBMRValue = calculator.id === 'daily-calorie-needs-calculator' ? outputs.bmr : null
	const tdeeValue = calculator.id === 'daily-calorie-needs-calculator' ? outputs.tdee : null
	const goalCaloriesValue = calculator.id === 'daily-calorie-needs-calculator' ? outputs.goalCalories : null
	const goalDescriptionValue = calculator.id === 'daily-calorie-needs-calculator' ? outputs.goalDescription : null
	const activityDescriptionValue = calculator.id === 'daily-calorie-needs-calculator' ? outputs.activityDescription : null
	const activityMultiplierValue = calculator.id === 'daily-calorie-needs-calculator' ? outputs.activityMultiplier : null
	const goalDeltaValue = calculator.id === 'daily-calorie-needs-calculator' ? outputs.goalDelta : null
	const tdeeInsightsValue = calculator.id === 'daily-calorie-needs-calculator' ? outputs.insights : null

	// Special handling for Ideal Weight calculator
	const idealRangeKgValue = calculator.id === 'ideal-weight-calculator' ? outputs.idealRangeKg : null
	const idealRangeLbValue = calculator.id === 'ideal-weight-calculator' ? outputs.idealRangeLb : null
	const devineWeightValue = calculator.id === 'ideal-weight-calculator' ? outputs.devineWeight : null
	const devineWeightLbValue = calculator.id === 'ideal-weight-calculator' ? outputs.devineWeightLb : null
	const robinsonWeightValue = calculator.id === 'ideal-weight-calculator' ? outputs.robinsonWeight : null
	const robinsonWeightLbValue = calculator.id === 'ideal-weight-calculator' ? outputs.robinsonWeightLb : null
	const millerWeightValue = calculator.id === 'ideal-weight-calculator' ? outputs.millerWeight : null
	const millerWeightLbValue = calculator.id === 'ideal-weight-calculator' ? outputs.millerWeightLb : null
	const idealWeightInsightsValue = calculator.id === 'ideal-weight-calculator' ? outputs.insights : null

	// Special handling for Body Fat Percentage calculator
	const bodyFatValue = calculator.id === 'body-fat-percentage-calculator' ? outputs.bodyFatPercentage : null
	const bodyFatCategoryValue = calculator.id === 'body-fat-percentage-calculator' ? outputs.category : null
	const bodyFatCategoryDescValue = calculator.id === 'body-fat-percentage-calculator' ? outputs.categoryDescription : null
	const bodyFatColorValue = calculator.id === 'body-fat-percentage-calculator' ? outputs.color : null
	const bodyFatHasNeckValue = calculator.id === 'body-fat-percentage-calculator' ? outputs.hasNeckMeasurement : null
	const bodyFatInsightsValue = calculator.id === 'body-fat-percentage-calculator' ? outputs.insights : null

	// Special handling for Macronutrient calculator
	const proteinGramsValue = calculator.id === 'macronutrient-calculator' ? outputs.proteinGrams : null
	const carbsGramsValue = calculator.id === 'macronutrient-calculator' ? outputs.carbsGrams : null
	const fatGramsValue = calculator.id === 'macronutrient-calculator' ? outputs.fatGrams : null
	const proteinCaloriesValue = calculator.id === 'macronutrient-calculator' ? outputs.proteinCalories : null
	const carbsCaloriesValue = calculator.id === 'macronutrient-calculator' ? outputs.carbsCalories : null
	const fatCaloriesValue = calculator.id === 'macronutrient-calculator' ? outputs.fatCalories : null
	const proteinPercentValue = calculator.id === 'macronutrient-calculator' ? outputs.proteinPercent : null
	const carbsPercentValue = calculator.id === 'macronutrient-calculator' ? outputs.carbsPercent : null
	const fatPercentValue = calculator.id === 'macronutrient-calculator' ? outputs.fatPercent : null
	const macroPresetDescriptionValue = calculator.id === 'macronutrient-calculator' ? outputs.presetDescription : null
	const macroInsightsValue = calculator.id === 'macronutrient-calculator' ? outputs.insights : null

	// Special handling for Water Intake calculator
	const waterIntakeLitersValue = calculator.id === 'water-intake-calculator' ? outputs.dailyWaterIntakeLiters : null
	const waterIntakeCupsValue = calculator.id === 'water-intake-calculator' ? outputs.dailyWaterIntakeCups : null
	const waterIntakeOuncesValue = calculator.id === 'water-intake-calculator' ? outputs.dailyWaterIntakeOunces : null
	const waterIntakeInsightsValue = calculator.id === 'water-intake-calculator' ? outputs.insights : null

	// Special handling for Calories Burned calculator
	const caloriesBurnedValue = calculator.id === 'calories-burned-calculator' ? outputs.caloriesBurned : null
	const caloriesPerMinuteValue = calculator.id === 'calories-burned-calculator' ? outputs.caloriesPerMinute : null
	const metValueValue = calculator.id === 'calories-burned-calculator' ? outputs.metValue : null
	const metDescriptionValue = calculator.id === 'calories-burned-calculator' ? outputs.metDescription : null
	const caloriesBurnedInsightsValue = calculator.id === 'calories-burned-calculator' ? outputs.insights : null

	// Special handling for Heart Rate Zones calculator
	const maxHRValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.maxHeartRate : null
	const zone1MinValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.zone1Min : null
	const zone1MaxValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.zone1Max : null
	const zone2MinValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.zone2Min : null
	const zone2MaxValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.zone2Max : null
	const zone3MinValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.zone3Min : null
	const zone3MaxValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.zone3Max : null
	const zone4MinValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.zone4Min : null
	const zone4MaxValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.zone4Max : null
	const zone5MinValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.zone5Min : null
	const zone5MaxValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.zone5Max : null
	const hrMethodUsedValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.methodUsed : null
	const hrZonesInsightsValue = calculator.id === 'heart-rate-zones-calculator' ? outputs.insights : null

	// Special handling for Steps to Calories calculator
	const stepsCaloriesBurnedValue = calculator.id === 'steps-to-calories-calculator' ? outputs.caloriesBurned : null
	const stepsDistanceValue = calculator.id === 'steps-to-calories-calculator' ? outputs.estimatedDistance : null
	const stepsDistanceUnitValue = calculator.id === 'steps-to-calories-calculator' ? outputs.distanceUnit : null
	const stepsDistanceKmValue = calculator.id === 'steps-to-calories-calculator' ? outputs.distanceKm : null
	const stepsDistanceMilesValue = calculator.id === 'steps-to-calories-calculator' ? outputs.distanceMiles : null
	const stepsCaloriesPer1000Value = calculator.id === 'steps-to-calories-calculator' ? outputs.caloriesPer1000Steps : null
	const stepsStrideLengthValue = calculator.id === 'steps-to-calories-calculator' ? outputs.strideLengthUsed : null
	const stepsMetValueValue = calculator.id === 'steps-to-calories-calculator' ? outputs.metValue : null
	const stepsToCaloriesInsightsValue = calculator.id === 'steps-to-calories-calculator' ? outputs.insights : null

	// Special handling for Age calculator
	const ageYearsValue = calculator.id === 'age-calculator' ? outputs.years : null
	const ageMonthsValue = calculator.id === 'age-calculator' ? outputs.months : null
	const ageDaysValue = calculator.id === 'age-calculator' ? outputs.days : null
	const ageStringValue = calculator.id === 'age-calculator' ? outputs.ageString : null
	const totalDaysValue = calculator.id === 'age-calculator' ? outputs.totalDays : null
	const totalWeeksValue = calculator.id === 'age-calculator' ? outputs.totalWeeks : null
	const referenceDateUsedValue = calculator.id === 'age-calculator' ? outputs.referenceDateUsed : null
	const ageExplanationValue = calculator.id === 'age-calculator' ? outputs.explanation : null

	// Special handling for Days Between Dates calculator
	const daysTotalDaysValue = calculator.id === 'days-between-dates-calculator' ? outputs.totalDays : null
	const daysWeeksValue = calculator.id === 'days-between-dates-calculator' ? outputs.weeks : null
	const daysRemainingDaysValue = calculator.id === 'days-between-dates-calculator' ? outputs.remainingDays : null
	const daysTotalDaysInclusiveValue = calculator.id === 'days-between-dates-calculator' ? outputs.totalDaysInclusive : null
	const daysWeeksInclusiveValue = calculator.id === 'days-between-dates-calculator' ? outputs.weeksInclusive : null
	const daysRemainingDaysInclusiveValue = calculator.id === 'days-between-dates-calculator' ? outputs.remainingDaysInclusive : null
	const daysBreakdownValue = calculator.id === 'days-between-dates-calculator' ? outputs.breakdown : null
	const daysBreakdownInclusiveValue = calculator.id === 'days-between-dates-calculator' ? outputs.breakdownInclusive : null
	const daysStartDateFormattedValue = calculator.id === 'days-between-dates-calculator' ? outputs.startDateFormatted : null
	const daysEndDateFormattedValue = calculator.id === 'days-between-dates-calculator' ? outputs.endDateFormatted : null
	const daysExplanationValue = calculator.id === 'days-between-dates-calculator' ? outputs.explanation : null
	const daysIncludeEndDateValue = calculator.id === 'days-between-dates-calculator' ? outputs.includeEndDate : null

	// Special handling for Numbers to Words calculator
	const numbersToWordsWordsValue = calculator.id === 'numbers-to-words-calculator' ? outputs.words : null
	const numbersToWordsCurrencyValue = calculator.id === 'numbers-to-words-calculator' ? outputs.currencyWords : null
	const numbersToWordsBreakdownValue = calculator.id === 'numbers-to-words-calculator' ? outputs.breakdown : null
	const numbersToWordsMillionsValue = calculator.id === 'numbers-to-words-calculator' ? outputs.millions : null
	const numbersToWordsThousandsValue = calculator.id === 'numbers-to-words-calculator' ? outputs.thousands : null
	const numbersToWordsHundredsValue = calculator.id === 'numbers-to-words-calculator' ? outputs.hundreds : null
	const numbersToWordsExplanationValue = calculator.id === 'numbers-to-words-calculator' ? outputs.explanation : null
	const numbersToWordsOriginalValue = calculator.id === 'numbers-to-words-calculator' ? outputs.originalNumber : null

	// Special handling for Roman Numerals calculator
	const romanResultValue = calculator.id === 'roman-numerals-converter' ? outputs.result : null
	const romanBreakdownValue = calculator.id === 'roman-numerals-converter' ? outputs.breakdown : null
	const romanExplanationValue = calculator.id === 'roman-numerals-converter' ? outputs.explanation : null
	const romanSymbolsUsedValue = calculator.id === 'roman-numerals-converter' ? outputs.symbolsUsed : null
	const romanOriginalValue = calculator.id === 'roman-numerals-converter' ? outputs.originalValue : null
	const romanModeValue = calculator.id === 'roman-numerals-converter' ? outputs.mode : null

	// Special handling for Date Calculator
	const dateResultDateValue = calculator.id === 'date-calculator' ? outputs.resultDate : null
	const dateResultDateFormattedValue = calculator.id === 'date-calculator' ? outputs.resultDateFormatted : null
	const dateWeekdayValue = calculator.id === 'date-calculator' ? outputs.weekday : null
	const dateIsoDateValue = calculator.id === 'date-calculator' ? outputs.isoDate : null
	const dateExplanationValue = calculator.id === 'date-calculator' ? outputs.explanation : null
	const dateDaysAddedValue = calculator.id === 'date-calculator' ? outputs.daysAdded : null
	const dateDaysSubtractedValue = calculator.id === 'date-calculator' ? outputs.daysSubtracted : null
	const dateStartDateValue = calculator.id === 'date-calculator' ? outputs.startDate : null
	const dateStartDateFormattedValue = calculator.id === 'date-calculator' ? outputs.startDateFormatted : null
	const dateNumberOfDaysValue = calculator.id === 'date-calculator' ? outputs.numberOfDays : null
	const dateOperationValue = calculator.id === 'date-calculator' ? outputs.operation : null
	const dateDaysDifferenceValue = calculator.id === 'date-calculator' ? outputs.daysDifference : null

	// Special handling for Cooking Measurement Converter
	const cookingResultValue = calculator.id === 'cooking-measurement-converter' ? outputs.result : null
	const cookingResultFormattedValue = calculator.id === 'cooking-measurement-converter' ? outputs.resultFormatted : null
	const cookingExplanationValue = calculator.id === 'cooking-measurement-converter' ? outputs.explanation : null
	const cookingConversionTypeValue = calculator.id === 'cooking-measurement-converter' ? outputs.conversionType : null
	const cookingIngredientNoteValue = calculator.id === 'cooking-measurement-converter' ? outputs.ingredientNote : null
	const cookingFromUnitValue = calculator.id === 'cooking-measurement-converter' ? outputs.fromUnit : null
	const cookingToUnitValue = calculator.id === 'cooking-measurement-converter' ? outputs.toUnit : null
	const cookingIngredientValue = calculator.id === 'cooking-measurement-converter' ? outputs.ingredient : null
	const cookingOriginalValue = calculator.id === 'cooking-measurement-converter' ? outputs.originalValue : null

	// Special handling for Room Area calculator
	const roomAreaValue = calculator.id === 'room-area-calculator' ? outputs.area : null
	const roomAreaFormattedValue = calculator.id === 'room-area-calculator' ? outputs.areaFormatted : null
	const roomAreaAlternativeValue = calculator.id === 'room-area-calculator' ? outputs.areaInAlternativeUnitFormatted : null
	const roomAlternativeUnitValue = calculator.id === 'room-area-calculator' ? outputs.alternativeUnit : null
	const roomExplanationValue = calculator.id === 'room-area-calculator' ? outputs.explanation : null
	const roomFormulaValue = calculator.id === 'room-area-calculator' ? outputs.formula : null
	const roomShapeValue = calculator.id === 'room-area-calculator' ? outputs.shape : null
	const roomUnitSymbolValue = calculator.id === 'room-area-calculator' ? outputs.unitSymbol : null

	// Special handling for Paint calculator
	const paintRequiredValue = calculator.id === 'paint-calculator' ? outputs.paintRequired : null
	const paintRequiredFormattedValue = calculator.id === 'paint-calculator' ? outputs.paintRequiredFormatted : null
	const paintRequiredAlternativeValue = calculator.id === 'paint-calculator' ? outputs.paintRequiredAlternativeFormatted : null
	const paintAlternativeUnitValue = calculator.id === 'paint-calculator' ? outputs.alternativeUnit : null
	const paintExplanationValue = calculator.id === 'paint-calculator' ? outputs.explanation : null
	const paintCansEstimateValue = calculator.id === 'paint-calculator' ? outputs.cansEstimate : null
	const paintRoomAreaValue = calculator.id === 'paint-calculator' ? outputs.roomArea : null
	const paintNumberOfCoatsValue = calculator.id === 'paint-calculator' ? outputs.numberOfCoats : null
	const paintCoverageValue = calculator.id === 'paint-calculator' ? outputs.paintCoverage : null
	const paintCoverageUnitValue = calculator.id === 'paint-calculator' ? outputs.coverageUnit : null
	const paintUnitValue = calculator.id === 'paint-calculator' ? outputs.paintUnit : null
	const paintAreaUnitValue = calculator.id === 'paint-calculator' ? outputs.areaUnit : null

	// Special handling for Random Number Generator
	const randomNumbersValue = calculator.id === 'random-number-generator' ? outputs.numbers : null
	const randomNumbersFormattedValue = calculator.id === 'random-number-generator' ? outputs.numbersFormatted : null
	const randomExplanationValue = calculator.id === 'random-number-generator' ? outputs.explanation : null
	const randomMinValue = calculator.id === 'random-number-generator' ? outputs.minValue : null
	const randomMaxValue = calculator.id === 'random-number-generator' ? outputs.maxValue : null
	const randomQuantityValue = calculator.id === 'random-number-generator' ? outputs.quantity : null
	const randomAllowDuplicatesValue = calculator.id === 'random-number-generator' ? outputs.allowDuplicates : null
	const randomRangeValue = calculator.id === 'random-number-generator' ? outputs.range : null
	const randomRangeSizeValue = calculator.id === 'random-number-generator' ? outputs.rangeSize : null

	// Get BMI category color
	const getBMICategoryColor = (category: string | null): string => {
		if (!category) return 'text-blue-600'
		const cat = String(category).toLowerCase()
		if (cat === 'underweight') return 'text-blue-600'
		if (cat === 'normal') return 'text-green-600'
		if (cat === 'overweight') return 'text-yellow-600'
		if (cat === 'obese') return 'text-red-600'
		return 'text-blue-600'
	}

	const getBMICategoryBadgeColor = (category: string | null): string => {
		if (!category) return 'bg-gray-100 text-gray-800'
		const cat = String(category).toLowerCase()
		if (cat === 'underweight') return 'bg-blue-100 text-blue-800'
		if (cat === 'normal') return 'bg-green-100 text-green-800'
		if (cat === 'overweight') return 'bg-yellow-100 text-yellow-800'
		if (cat === 'obese') return 'bg-red-100 text-red-800'
		return 'bg-gray-100 text-gray-800'
	}

	return (
		<div className="h-full">
			{/* Main Result */}
			{formattedMainValue && (
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
						{mainOutput.label || 'Result'}
					</label>
					{/* Special formatting for BMI calculator */}
					{calculator.id === 'bmi-calculator' && mainOutput.name === 'bmi' ? (
						<div>
							<div className={`text-5xl md:text-6xl font-bold mb-3 ${getBMICategoryColor(categoryValue)}`}>
								{formattedMainValue}
							</div>
							{/* BMI Category Badge */}
							{categoryValue && (
								<div className="mt-3 mb-4">
									<span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-semibold ${getBMICategoryBadgeColor(categoryValue)}`}>
										{categoryValue}
									</span>
								</div>
							)}
							{/* BMI Visual Scale */}
							<div className="mt-4 mb-4">
								<div className="bg-gray-100 rounded-full h-4 relative overflow-hidden">
									<div className="absolute inset-0 flex">
										<div className="bg-blue-500" style={{ width: '18.5%' }}></div>
										<div className="bg-green-500" style={{ width: '6.4%' }}></div>
										<div className="bg-yellow-500" style={{ width: '5%' }}></div>
										<div className="bg-red-500" style={{ width: '70.1%' }}></div>
									</div>
									{/* BMI indicator */}
									{mainValue && typeof mainValue === 'number' && (
										<div 
											className="absolute top-0 h-full w-0.5 bg-gray-900 z-10"
											style={{ left: `${Math.min(Math.max((mainValue / 50) * 100, 0), 100)}%` }}
										></div>
									)}
								</div>
								<div className="flex justify-between text-xs text-gray-600 mt-2">
									<span>Underweight<br/>&lt;18.5</span>
									<span>Normal<br/>18.5-24.9</span>
									<span>Overweight<br/>25-29.9</span>
									<span>Obese<br/>≥30</span>
								</div>
							</div>
							{/* Category Description */}
							{categoryDescriptionValue && typeof categoryDescriptionValue === 'string' && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{categoryDescriptionValue}</p>
								</div>
							)}
							{/* Healthy Weight Range */}
							{healthyWeightRangeValue && typeof healthyWeightRangeValue === 'string' && (
								<div className="mt-4">
									<p className="text-sm font-medium text-gray-700 mb-1">Healthy Weight Range for Your Height:</p>
									<p className="text-lg font-semibold text-gray-900">{healthyWeightRangeValue}</p>
								</div>
							)}
						</div>
					) : calculator.id === 'bmr-calculator' && mainOutput.name === 'bmr' ? (
						<div>
							<div className="text-5xl md:text-6xl font-bold text-green-600 mb-3">
								{formattedMainValue}
							</div>
							{/* BMR per hour */}
							{bmrPerHourValue && typeof bmrPerHourValue === 'number' && (
								<div className="mt-2 mb-4">
									<p className="text-lg text-gray-600">
										Approximately <span className="font-semibold text-gray-900">{bmrPerHourValue}</span> calories per hour
									</p>
								</div>
							)}
							{/* Formula used */}
							{formulaUsedValue && typeof formulaUsedValue === 'string' && (
								<div className="mt-3 mb-4">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
										Formula: {formulaUsedValue}
									</span>
								</div>
							)}
							{/* What this means box */}
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 className="text-base font-semibold text-blue-900 mb-2">What This Means</h4>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									Your BMR of {formattedMainValue} is your baseline metabolism — the calories your body burns at complete rest. This represents approximately 60-70% of your total daily energy expenditure.
								</p>
								<p className="text-sm text-blue-800 leading-relaxed">
									<strong>Important:</strong> Your actual daily calorie needs are higher than your BMR because you move, exercise, and perform daily activities. To calculate your total daily energy expenditure (TDEE), you need to multiply your BMR by an activity factor. Use our <Link href="/calculators/health/daily-calorie-needs-calculator" className="underline font-medium hover:text-blue-900">Daily Calorie Needs (TDEE) Calculator</Link> to find your TDEE.
								</p>
							</div>
							{/* Explanation */}
							{bmrExplanationValue && typeof bmrExplanationValue === 'string' && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{bmrExplanationValue}</p>
								</div>
							)}
						</div>
					) : calculator.id === 'daily-calorie-needs-calculator' && mainOutput.name === 'tdee' ? (
						<div>
							<div className="text-5xl md:text-6xl font-bold text-blue-600 mb-3">
								{formattedMainValue}
							</div>
							<p className="text-sm text-gray-500 mb-4">Maintenance Calories (TDEE)</p>
							
							{/* BMR */}
							{tdeeBMRValue && typeof tdeeBMRValue === 'number' && (
								<div className="mt-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-600 mb-1">Basal Metabolic Rate (BMR)</p>
									<p className="text-2xl font-semibold text-gray-900">{tdeeBMRValue.toLocaleString()} <span className="text-base font-normal text-gray-600">kcal/day</span></p>
									<p className="text-xs text-gray-500 mt-1">Calories burned at complete rest</p>
								</div>
							)}
							
							{/* Activity Level */}
							{activityDescriptionValue && typeof activityDescriptionValue === 'string' && activityMultiplierValue && typeof activityMultiplierValue === 'number' && (
								<div className="mt-3 mb-4">
									<p className="text-sm text-gray-600 mb-1">Activity Level</p>
									<p className="text-base font-medium text-gray-900">{activityDescriptionValue} ({activityMultiplierValue}x multiplier)</p>
								</div>
							)}
							
							{/* Goal Calories */}
							{goalCaloriesValue && typeof goalCaloriesValue === 'number' && goalDescriptionValue && typeof goalDescriptionValue === 'string' && goalDeltaValue !== null && goalDeltaValue !== undefined && (
								<div className="mt-4 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<p className="text-sm font-medium text-blue-900 mb-2">Goal: {goalDescriptionValue}</p>
									<p className="text-2xl font-semibold text-blue-700">{goalCaloriesValue.toLocaleString()} <span className="text-base font-normal text-blue-600">kcal/day</span></p>
									{goalDeltaValue !== 0 && typeof goalDeltaValue === 'number' && (
										<p className="text-xs text-blue-700 mt-1">
											{goalDeltaValue > 0 ? '+' : ''}{goalDeltaValue} calories from maintenance
										</p>
									)}
								</div>
							)}
							
							{/* Calorie Targets Table */}
							{tdeeValue && typeof tdeeValue === 'number' && (
								<div className="mt-6 mb-4">
									<h4 className="text-sm font-semibold text-gray-900 mb-3">Calorie Targets</h4>
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Goal</th>
													<th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">Calories/Day</th>
													<th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">Weekly Change</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												<tr>
													<td className="px-4 py-2 text-sm text-gray-900">Maintain Weight</td>
													<td className="px-4 py-2 text-sm font-semibold text-right text-gray-900">{tdeeValue.toLocaleString()}</td>
													<td className="px-4 py-2 text-sm text-right text-gray-600">0 kg/week</td>
												</tr>
												<tr className="bg-blue-50">
													<td className="px-4 py-2 text-sm text-gray-900">Mild Loss</td>
													<td className="px-4 py-2 text-sm font-semibold text-right text-blue-700">{(tdeeValue - 250).toLocaleString()}</td>
													<td className="px-4 py-2 text-sm text-right text-blue-700">-0.25 kg/week</td>
												</tr>
												<tr>
													<td className="px-4 py-2 text-sm text-gray-900">Moderate Loss</td>
													<td className="px-4 py-2 text-sm font-semibold text-right text-gray-900">{(tdeeValue - 500).toLocaleString()}</td>
													<td className="px-4 py-2 text-sm text-right text-gray-600">-0.5 kg/week</td>
												</tr>
												<tr className="bg-green-50">
													<td className="px-4 py-2 text-sm text-gray-900">Mild Gain</td>
													<td className="px-4 py-2 text-sm font-semibold text-right text-green-700">{(tdeeValue + 250).toLocaleString()}</td>
													<td className="px-4 py-2 text-sm text-right text-green-700">+0.25 kg/week</td>
												</tr>
												<tr>
													<td className="px-4 py-2 text-sm text-gray-900">Moderate Gain</td>
													<td className="px-4 py-2 text-sm font-semibold text-right text-gray-900">{(tdeeValue + 500).toLocaleString()}</td>
													<td className="px-4 py-2 text-sm text-right text-gray-600">+0.5 kg/week</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							)}
							
							{/* What this means box */}
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 className="text-base font-semibold text-blue-900 mb-2">What This Means</h4>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									Your TDEE of {formattedMainValue} is your total daily energy expenditure — the calories you burn per day including all activities. This is calculated by multiplying your BMR by your activity level multiplier.
								</p>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									<strong>To maintain your current weight:</strong> Consume approximately {formattedMainValue} calories per day.
								</p>
								<p className="text-sm text-blue-800 leading-relaxed">
									<strong>Note:</strong> These are estimates. Individual calorie needs can vary based on genetics, body composition, medical conditions, and other factors. Adjust based on your results over 2-3 weeks and consult a healthcare provider for personalized advice.
								</p>
							</div>
							
							{/* Insights */}
							{tdeeInsightsValue && typeof tdeeInsightsValue === 'string' && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{tdeeInsightsValue}</p>
								</div>
							)}
						</div>
					) : calculator.id === 'ideal-weight-calculator' && mainOutput.name === 'idealRangeKg' ? (
						<div>
							<div className="text-4xl md:text-5xl font-bold text-green-600 mb-3">
								{idealRangeKgValue && typeof idealRangeKgValue === 'string' ? idealRangeKgValue : formattedMainValue}
							</div>
							{idealRangeLbValue && typeof idealRangeLbValue === 'string' && (
								<p className="text-lg text-gray-600 mb-4">
									{idealRangeLbValue}
								</p>
							)}
							<p className="text-sm text-gray-500 mb-6">Suggested Ideal Weight Range</p>
							
							{/* Formulas Table */}
							<div className="mt-6 mb-4">
								<h4 className="text-sm font-semibold text-gray-900 mb-3">Results by Formula</h4>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Formula</th>
												<th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">Weight (kg)</th>
												<th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">Weight (lb)</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											<tr>
												<td className="px-4 py-2 text-sm font-medium text-gray-900">Devine</td>
												<td className="px-4 py-2 text-sm text-right text-gray-900">
													{devineWeightValue && typeof devineWeightValue === 'number' ? devineWeightValue.toFixed(1) : '—'}
												</td>
												<td className="px-4 py-2 text-sm text-right text-gray-600">
													{devineWeightLbValue && typeof devineWeightLbValue === 'number' ? devineWeightLbValue.toFixed(1) : '—'}
												</td>
											</tr>
											<tr className="bg-gray-50">
												<td className="px-4 py-2 text-sm font-medium text-gray-900">Robinson</td>
												<td className="px-4 py-2 text-sm text-right text-gray-900">
													{robinsonWeightValue && typeof robinsonWeightValue === 'number' ? robinsonWeightValue.toFixed(1) : '—'}
												</td>
												<td className="px-4 py-2 text-sm text-right text-gray-600">
													{robinsonWeightLbValue && typeof robinsonWeightLbValue === 'number' ? robinsonWeightLbValue.toFixed(1) : '—'}
												</td>
											</tr>
											<tr>
												<td className="px-4 py-2 text-sm font-medium text-gray-900">Miller</td>
												<td className="px-4 py-2 text-sm text-right text-gray-900">
													{millerWeightValue && typeof millerWeightValue === 'number' ? millerWeightValue.toFixed(1) : '—'}
												</td>
												<td className="px-4 py-2 text-sm text-right text-gray-600">
													{millerWeightLbValue && typeof millerWeightLbValue === 'number' ? millerWeightLbValue.toFixed(1) : '—'}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							
							{/* What this means box */}
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 className="text-base font-semibold text-blue-900 mb-2">What This Means</h4>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									The ideal weight range shown above is calculated using three different formulas (Devine, Robinson, and Miller). These formulas give slightly different results because they were developed using different populations and methodologies.
								</p>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									<strong>Important:</strong> Ideal weight formulas are estimates based on height and sex only. They don't account for body composition (muscle vs fat), bone structure, or individual variations. BMI and body fat percentage may provide more comprehensive information about your health.
								</p>
								<p className="text-sm text-blue-800 leading-relaxed">
									Use ideal weight as a general guideline, but also consider your overall health, body composition, and how you feel. Consult with a healthcare provider for personalized advice.
								</p>
							</div>
							
							{/* Insights */}
							{idealWeightInsightsValue && typeof idealWeightInsightsValue === 'string' && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{idealWeightInsightsValue}</p>
								</div>
							)}
						</div>
					) : calculator.id === 'body-fat-percentage-calculator' && mainOutput.name === 'bodyFatPercentage' ? (
						<div>
							<div className={`text-5xl md:text-6xl font-bold mb-3 ${
								bodyFatColorValue === 'green' ? 'text-green-600' :
								bodyFatColorValue === 'blue' ? 'text-blue-600' :
								bodyFatColorValue === 'yellow' ? 'text-yellow-600' :
								bodyFatColorValue === 'red' ? 'text-red-600' :
								'text-gray-600'
							}`}>
								{formattedMainValue}
							</div>
							<p className="text-sm text-gray-500 mb-4">Body Fat Percentage</p>
							
							{/* Category Badge */}
							{bodyFatCategoryValue && typeof bodyFatCategoryValue === 'string' && (
								<div className="mt-3 mb-4">
									<span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-semibold ${
										bodyFatColorValue === 'green' ? 'bg-green-100 text-green-800' :
										bodyFatColorValue === 'blue' ? 'bg-blue-100 text-blue-800' :
										bodyFatColorValue === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
										bodyFatColorValue === 'red' ? 'bg-red-100 text-red-800' :
										'bg-gray-100 text-gray-800'
									}`}>
										{bodyFatCategoryValue}
									</span>
								</div>
							)}
							
							{/* Category Description */}
							{bodyFatCategoryDescValue && typeof bodyFatCategoryDescValue === 'string' && (
								<div className="mt-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{bodyFatCategoryDescValue}</p>
								</div>
							)}
							
						{/* Note about neck measurement */}
						{bodyFatHasNeckValue !== null && bodyFatHasNeckValue !== undefined && !bodyFatHasNeckValue && (
								<div className="mt-4 mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
									<p className="text-sm text-yellow-800">
										<strong>Note:</strong> This calculation used an estimated neck measurement. For improved accuracy, measure your neck circumference and include it in the calculation.
									</p>
								</div>
							)}
							
							{/* Estimation limitations box */}
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 className="text-base font-semibold text-blue-900 mb-2">About This Estimate</h4>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									This body fat percentage is an estimation using the U.S. Navy Method, a formula-based approach. Actual body fat percentage can vary based on:
								</p>
								<ul className="text-sm text-blue-800 leading-relaxed list-disc list-inside mb-3 space-y-1">
									<li>Hydration levels (water retention can affect measurements)</li>
									<li>Measurement technique (accuracy of tape placement)</li>
									<li>Body composition variations (muscle distribution, bone structure)</li>
									<li>Individual differences not captured by formulas</li>
								</ul>
								<p className="text-sm text-blue-800 leading-relaxed">
									For the most accurate measurement, consider professional methods like DEXA scan, BodPod, or hydrostatic weighing. This calculator provides a reasonable estimate for general use.
								</p>
							</div>
							
							{/* Insights */}
							{bodyFatInsightsValue && typeof bodyFatInsightsValue === 'string' && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{bodyFatInsightsValue}</p>
								</div>
							)}
						</div>
					) : calculator.id === 'macronutrient-calculator' && mainOutput.name === 'proteinGrams' ? (
						<div>
							{/* Macro Breakdown Cards */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								{/* Protein */}
								<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
									<div className="flex items-center justify-between mb-2">
										<h4 className="text-sm font-semibold text-blue-900">Protein</h4>
										<span className="text-xs text-blue-700 font-medium">
											{proteinPercentValue && typeof proteinPercentValue === 'number' ? `${proteinPercentValue}%` : '—'}
										</span>
									</div>
									<div className="text-3xl font-bold text-blue-700 mb-1">
										{proteinGramsValue && typeof proteinGramsValue === 'number' ? `${proteinGramsValue.toFixed(1)}` : '—'} <span className="text-lg font-normal text-blue-600">g</span>
									</div>
									<p className="text-xs text-blue-600">
										{proteinCaloriesValue && typeof proteinCaloriesValue === 'number' ? `${proteinCaloriesValue.toFixed(0)} kcal` : '—'}
									</p>
									<p className="text-xs text-blue-700 mt-2">4 kcal/g • Muscle repair & growth</p>
								</div>
								
								{/* Carbohydrates */}
								<div className="p-4 bg-green-50 rounded-lg border border-green-200">
									<div className="flex items-center justify-between mb-2">
										<h4 className="text-sm font-semibold text-green-900">Carbs</h4>
										<span className="text-xs text-green-700 font-medium">
											{carbsPercentValue && typeof carbsPercentValue === 'number' ? `${carbsPercentValue}%` : '—'}
										</span>
									</div>
									<div className="text-3xl font-bold text-green-700 mb-1">
										{carbsGramsValue && typeof carbsGramsValue === 'number' ? `${carbsGramsValue.toFixed(1)}` : '—'} <span className="text-lg font-normal text-green-600">g</span>
									</div>
									<p className="text-xs text-green-600">
										{carbsCaloriesValue && typeof carbsCaloriesValue === 'number' ? `${carbsCaloriesValue.toFixed(0)} kcal` : '—'}
									</p>
									<p className="text-xs text-green-700 mt-2">4 kcal/g • Primary energy source</p>
								</div>
								
								{/* Fat */}
								<div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
									<div className="flex items-center justify-between mb-2">
										<h4 className="text-sm font-semibold text-yellow-900">Fat</h4>
										<span className="text-xs text-yellow-700 font-medium">
											{fatPercentValue && typeof fatPercentValue === 'number' ? `${fatPercentValue}%` : '—'}
										</span>
									</div>
									<div className="text-3xl font-bold text-yellow-700 mb-1">
										{fatGramsValue && typeof fatGramsValue === 'number' ? `${fatGramsValue.toFixed(1)}` : '—'} <span className="text-lg font-normal text-yellow-600">g</span>
									</div>
									<p className="text-xs text-yellow-600">
										{fatCaloriesValue && typeof fatCaloriesValue === 'number' ? `${fatCaloriesValue.toFixed(0)} kcal` : '—'}
									</p>
									<p className="text-xs text-yellow-700 mt-2">9 kcal/g • Hormone production</p>
								</div>
							</div>
							
							{/* Preset Description */}
							{macroPresetDescriptionValue && typeof macroPresetDescriptionValue === 'string' && (
								<div className="mb-4">
									<p className="text-sm text-gray-600">
										<strong>Macro Split:</strong> {macroPresetDescriptionValue}
									</p>
								</div>
							)}
							
							{/* What this means box */}
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 className="text-base font-semibold text-blue-900 mb-2">Understanding Your Macros</h4>
								<div className="space-y-3 text-sm text-blue-800">
									<p>
										<strong>Protein ({proteinPercentValue && typeof proteinPercentValue === 'number' ? `${proteinPercentValue}%` : '—'}):</strong> Essential for muscle repair, immune function, and hormone production. Provides 4 calories per gram. Adequate protein helps preserve muscle mass during weight loss and supports recovery after exercise.
									</p>
									<p>
										<strong>Carbohydrates ({carbsPercentValue && typeof carbsPercentValue === 'number' ? `${carbsPercentValue}%` : '—'}):</strong> Your body's primary energy source. Provides 4 calories per gram. Carbs fuel your brain, muscles, and daily activities. They're especially important for high-intensity exercise and athletic performance.
									</p>
									<p>
										<strong>Fat ({fatPercentValue && typeof fatPercentValue === 'number' ? `${fatPercentValue}%` : '—'}):</strong> Provides 9 calories per gram (more than twice the energy density of protein and carbs). Essential for hormone production, vitamin absorption, and cell membrane function. Healthy fats support brain health and satiety.
									</p>
								</div>
							</div>
							
							{/* Insights */}
							{macroInsightsValue && typeof macroInsightsValue === 'string' && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{macroInsightsValue}</p>
								</div>
							)}
						</div>
					) : calculator.id === 'water-intake-calculator' && mainOutput.name === 'dailyWaterIntakeLiters' ? (
						<div>
							<div className="text-5xl md:text-6xl font-bold text-blue-600 mb-3">
								{formattedMainValue}
							</div>
							<p className="text-sm text-gray-500 mb-4">Recommended Daily Water Intake</p>
							
							{/* Equivalent measurements */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
								{waterIntakeCupsValue && typeof waterIntakeCupsValue === 'number' && (
									<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
										<p className="text-sm text-blue-700 mb-1">In Cups</p>
										<p className="text-2xl font-semibold text-blue-900">{waterIntakeCupsValue.toFixed(1)} <span className="text-base font-normal text-blue-700">cups</span></p>
									</div>
								)}
								{waterIntakeOuncesValue && typeof waterIntakeOuncesValue === 'number' && (
									<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
										<p className="text-sm text-blue-700 mb-1">In Ounces</p>
										<p className="text-2xl font-semibold text-blue-900">{waterIntakeOuncesValue.toFixed(0)} <span className="text-base font-normal text-blue-700">oz</span></p>
									</div>
								)}
							</div>
							
							{/* What this means box */}
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 className="text-base font-semibold text-blue-900 mb-2">Hydration Basics</h4>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									Your recommended daily water intake of {formattedMainValue} is based on your body weight, activity level, climate, and exercise routine. This amount helps maintain proper hydration, which is essential for:
								</p>
								<ul className="text-sm text-blue-800 leading-relaxed list-disc list-inside mb-3 space-y-1">
									<li>Temperature regulation and cooling</li>
									<li>Nutrient transport throughout your body</li>
									<li>Waste removal and kidney function</li>
									<li>Joint lubrication and cushioning</li>
									<li>Digestive health and regularity</li>
								</ul>
								<p className="text-sm text-blue-800 leading-relaxed">
									<strong>Note:</strong> This is a general guideline. Individual water needs can vary based on age, health conditions, medications, and other factors. About 20% of daily water intake typically comes from food. Listen to your body's thirst signals and adjust accordingly.
								</p>
							</div>
							
							{/* Insights */}
							{waterIntakeInsightsValue && typeof waterIntakeInsightsValue === 'string' && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{waterIntakeInsightsValue}</p>
								</div>
							)}
						</div>
					) : calculator.id === 'calories-burned-calculator' && mainOutput.name === 'caloriesBurned' ? (
						<div>
							<div className="text-5xl md:text-6xl font-bold text-orange-600 mb-3">
								{formattedMainValue}
							</div>
							<p className="text-sm text-gray-500 mb-4">Calories Burned</p>
							
							{/* Calories per minute and MET */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
								{caloriesPerMinuteValue && typeof caloriesPerMinuteValue === 'number' && (
									<div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
										<p className="text-sm text-orange-700 mb-1">Calories Per Minute</p>
										<p className="text-2xl font-semibold text-orange-900">{caloriesPerMinuteValue.toFixed(1)} <span className="text-base font-normal text-orange-700">kcal/min</span></p>
									</div>
								)}
								{metValueValue && typeof metValueValue === 'number' && (
									<div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
										<p className="text-sm text-orange-700 mb-1">MET Value</p>
										<p className="text-2xl font-semibold text-orange-900">{metValueValue.toFixed(1)} <span className="text-base font-normal text-orange-700">MET</span></p>
										{metDescriptionValue && typeof metDescriptionValue === 'string' && (
											<p className="text-xs text-orange-600 mt-1">{metDescriptionValue}</p>
										)}
									</div>
								)}
							</div>
							
							{/* What this means box */}
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 className="text-base font-semibold text-blue-900 mb-2">About This Estimate</h4>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									This calorie burn estimate uses the MET (Metabolic Equivalent of Task) formula: <strong>Calories = MET × weight(kg) × duration(hours)</strong>. MET values are standardized measures of energy expenditure used in exercise science.
								</p>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									<strong>What is MET?</strong> MET stands for Metabolic Equivalent of Task. 1 MET = the energy expended while sitting at rest. A MET of 3.5 means the activity requires 3.5 times the energy of resting. Higher MET values indicate more intense activities that burn more calories.
								</p>
								<p className="text-sm text-blue-800 leading-relaxed">
									<strong>Note:</strong> These are estimates based on average MET values. Actual calories burned can vary by ±10-20% based on individual factors such as fitness level, body composition, efficiency of movement, terrain, and environmental conditions. Fitness trackers and heart rate monitors may provide more personalized estimates.
								</p>
							</div>
							
							{/* Insights */}
							{caloriesBurnedInsightsValue && typeof caloriesBurnedInsightsValue === 'string' && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{caloriesBurnedInsightsValue}</p>
								</div>
							)}
						</div>
					) : calculator.id === 'heart-rate-zones-calculator' && mainOutput.name === 'maxHeartRate' ? (
						<div>
							<div className="text-5xl md:text-6xl font-bold text-red-600 mb-3">
								{formattedMainValue} <span className="text-2xl font-normal text-gray-600">bpm</span>
							</div>
							<p className="text-sm text-gray-500 mb-4">Maximum Heart Rate</p>
							
							{/* Method Used */}
							{hrMethodUsedValue && typeof hrMethodUsedValue === 'string' && (
								<div className="mb-4">
									<p className="text-sm text-gray-600">
										<strong>Method:</strong> {hrMethodUsedValue}
									</p>
								</div>
							)}
							
							{/* Heart Rate Zones Table */}
							<div className="mt-6 mb-4">
								<h4 className="text-sm font-semibold text-gray-900 mb-3">Training Zones</h4>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Zone</th>
												<th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">Heart Rate (bpm)</th>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Purpose</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											<tr className="bg-blue-50">
												<td className="px-4 py-3 text-sm font-medium text-blue-900">Zone 1</td>
												<td className="px-4 py-3 text-sm font-semibold text-right text-blue-900">
													{zone1MinValue && typeof zone1MinValue === 'number' && zone1MaxValue && typeof zone1MaxValue === 'number' 
														? `${zone1MinValue}-${zone1MaxValue}` 
														: '—'}
												</td>
												<td className="px-4 py-3 text-sm text-blue-800">Recovery (50-60%)</td>
											</tr>
											<tr className="bg-green-50">
												<td className="px-4 py-3 text-sm font-medium text-green-900">Zone 2</td>
												<td className="px-4 py-3 text-sm font-semibold text-right text-green-900">
													{zone2MinValue && typeof zone2MinValue === 'number' && zone2MaxValue && typeof zone2MaxValue === 'number' 
														? `${zone2MinValue}-${zone2MaxValue}` 
														: '—'}
												</td>
												<td className="px-4 py-3 text-sm text-green-800">Fat Burning (60-70%)</td>
											</tr>
											<tr className="bg-yellow-50">
												<td className="px-4 py-3 text-sm font-medium text-yellow-900">Zone 3</td>
												<td className="px-4 py-3 text-sm font-semibold text-right text-yellow-900">
													{zone3MinValue && typeof zone3MinValue === 'number' && zone3MaxValue && typeof zone3MaxValue === 'number' 
														? `${zone3MinValue}-${zone3MaxValue}` 
														: '—'}
												</td>
												<td className="px-4 py-3 text-sm text-yellow-800">Aerobic (70-80%)</td>
											</tr>
											<tr className="bg-orange-50">
												<td className="px-4 py-3 text-sm font-medium text-orange-900">Zone 4</td>
												<td className="px-4 py-3 text-sm font-semibold text-right text-orange-900">
													{zone4MinValue && typeof zone4MinValue === 'number' && zone4MaxValue && typeof zone4MaxValue === 'number' 
														? `${zone4MinValue}-${zone4MaxValue}` 
														: '—'}
												</td>
												<td className="px-4 py-3 text-sm text-orange-800">Threshold (80-90%)</td>
											</tr>
											<tr className="bg-red-50">
												<td className="px-4 py-3 text-sm font-medium text-red-900">Zone 5</td>
												<td className="px-4 py-3 text-sm font-semibold text-right text-red-900">
													{zone5MinValue && typeof zone5MinValue === 'number' && zone5MaxValue && typeof zone5MaxValue === 'number' 
														? `${zone5MinValue}-${zone5MaxValue}` 
														: '—'}
												</td>
												<td className="px-4 py-3 text-sm text-red-800">Peak (90-100%)</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							
							{/* What this means box */}
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 className="text-base font-semibold text-blue-900 mb-2">Understanding Your Zones</h4>
								<div className="space-y-2 text-sm text-blue-800">
									<p>
										<strong>Zone 1 (Recovery):</strong> Very light activity, ideal for warm-up, cool-down, and active recovery days. Easy to maintain for long periods.
									</p>
									<p>
										<strong>Zone 2 (Fat Burning):</strong> Light to moderate intensity, sustainable for long durations. Good for building aerobic base and endurance. Most of your training should be here.
									</p>
									<p>
										<strong>Zone 3 (Aerobic):</strong> Moderate to vigorous intensity. Improves cardiovascular fitness and aerobic capacity. Used for tempo runs and sustained efforts.
									</p>
									<p>
										<strong>Zone 4 (Threshold):</strong> High intensity, improves lactate threshold and anaerobic capacity. Challenging but sustainable for shorter durations. Used in interval training.
									</p>
									<p>
										<strong>Zone 5 (Peak):</strong> Very high intensity, near maximum heart rate. Used for short intervals and peak performance training. Not sustainable for long periods.
									</p>
								</div>
							</div>
							
							{/* Note box */}
							<div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
								<p className="text-sm text-yellow-800 leading-relaxed">
									<strong>Note:</strong> These zones are estimates based on age. Individual maximum heart rates can vary by ±10-15 bpm. Use these zones as guidelines and adjust based on how you feel. For personalized training zones, consider professional fitness testing or consultation with a healthcare provider.
								</p>
							</div>
							
							{/* Insights */}
							{hrZonesInsightsValue && typeof hrZonesInsightsValue === 'string' && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{hrZonesInsightsValue}</p>
								</div>
							)}
						</div>
					) : calculator.id === 'steps-to-calories-calculator' && mainOutput.name === 'caloriesBurned' ? (
						<div>
							<div className="text-5xl md:text-6xl font-bold text-green-600 mb-3">
								{formattedMainValue}
							</div>
							<p className="text-sm text-gray-500 mb-4">Calories Burned from Walking</p>
							
							{/* Distance and Calories per 1,000 steps */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
								{stepsDistanceValue && typeof stepsDistanceValue === 'number' && stepsDistanceUnitValue && (
									<div className="p-4 bg-green-50 rounded-lg border border-green-200">
										<p className="text-sm text-green-700 mb-1">Estimated Distance</p>
										<p className="text-2xl font-semibold text-green-900">
											{stepsDistanceValue.toFixed(stepsDistanceUnitValue === 'km' ? 2 : 0)} <span className="text-base font-normal text-green-700">{stepsDistanceUnitValue === 'km' ? 'km' : 'meters'}</span>
										</p>
										{stepsDistanceKmValue && typeof stepsDistanceKmValue === 'number' && stepsDistanceKmValue >= 1 && stepsDistanceMilesValue && typeof stepsDistanceMilesValue === 'number' && (
											<p className="text-xs text-green-600 mt-1">({stepsDistanceMilesValue.toFixed(2)} miles)</p>
										)}
									</div>
								)}
								{stepsCaloriesPer1000Value && typeof stepsCaloriesPer1000Value === 'number' && (
									<div className="p-4 bg-green-50 rounded-lg border border-green-200">
										<p className="text-sm text-green-700 mb-1">Calories Per 1,000 Steps</p>
										<p className="text-2xl font-semibold text-green-900">{stepsCaloriesPer1000Value.toFixed(1)} <span className="text-base font-normal text-green-700">kcal</span></p>
									</div>
								)}
							</div>
							
							{/* Stride length and MET info */}
							{(stepsStrideLengthValue || stepsMetValueValue) && (
								<div className="mt-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
										{stepsStrideLengthValue && typeof stepsStrideLengthValue === 'number' && (
											<div>
												<span className="text-gray-600">Stride Length Used: </span>
												<span className="font-medium text-gray-900">{stepsStrideLengthValue.toFixed(2)} m</span>
											</div>
										)}
										{stepsMetValueValue && typeof stepsMetValueValue === 'number' && (
											<div>
												<span className="text-gray-600">MET Value: </span>
												<span className="font-medium text-gray-900">{stepsMetValueValue.toFixed(1)}</span>
											</div>
										)}
									</div>
								</div>
							)}
							
							{/* What this means box */}
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 className="text-base font-semibold text-blue-900 mb-2">About This Estimate</h4>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									This calorie burn estimate is calculated using MET (Metabolic Equivalent of Task) values for walking. The calculation considers your steps, weight, estimated distance (from stride length), and walking speed.
								</p>
								<p className="text-sm text-blue-800 leading-relaxed mb-3">
									<strong>Why this is an estimate:</strong> Actual calories burned can vary based on individual factors such as fitness level, body composition, terrain (hills vs flat), walking surface, environmental conditions, and walking efficiency. Pedometers and fitness trackers may provide different estimates due to different algorithms and sensors.
								</p>
								<p className="text-sm text-blue-800 leading-relaxed">
									<strong>For better accuracy:</strong> Measure your actual stride length, account for terrain (hills increase calorie burn), and consider using a heart rate monitor for more personalized estimates. Use these estimates as general guidelines for tracking daily activity.
								</p>
							</div>
							
							{/* Insights */}
							{stepsToCaloriesInsightsValue && typeof stepsToCaloriesInsightsValue === 'string' && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700 leading-relaxed">{stepsToCaloriesInsightsValue}</p>
								</div>
							)}
						</div>
					) : calculator.id === 'age-calculator' && mainOutput.name === 'ageString' ? (
						<div>
							<div className="text-5xl md:text-6xl font-bold text-blue-600 mb-3">
								{ageStringValue && typeof ageStringValue === 'string' ? ageStringValue : formattedMainValue}
							</div>
							<p className="text-sm text-gray-500 mb-4">Your Exact Age</p>
							
							{/* Age Breakdown */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-4">
								{ageYearsValue !== null && ageYearsValue !== undefined && (
									<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
										<p className="text-sm text-blue-700 mb-1">Years</p>
										<p className="text-3xl font-semibold text-blue-900">{ageYearsValue}</p>
									</div>
								)}
								{ageMonthsValue !== null && ageMonthsValue !== undefined && (
									<div className="p-4 bg-green-50 rounded-lg border border-green-200">
										<p className="text-sm text-green-700 mb-1">Months</p>
										<p className="text-3xl font-semibold text-green-900">{ageMonthsValue}</p>
									</div>
								)}
								{ageDaysValue !== null && ageDaysValue !== undefined && (
									<div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
										<p className="text-sm text-purple-700 mb-1">Days</p>
										<p className="text-3xl font-semibold text-purple-900">{ageDaysValue}</p>
									</div>
								)}
							</div>
							
							{/* Total Days and Weeks */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
								{totalDaysValue !== null && totalDaysValue !== undefined && (
									<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
										<p className="text-sm text-gray-700 mb-1">Total Days Lived</p>
										<p className="text-2xl font-semibold text-gray-900">{totalDaysValue.toLocaleString()}</p>
									</div>
								)}
								{totalWeeksValue !== null && totalWeeksValue !== undefined && (
									<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
										<p className="text-sm text-gray-700 mb-1">Total Weeks Lived</p>
										<p className="text-2xl font-semibold text-gray-900">{totalWeeksValue.toLocaleString()}</p>
									</div>
								)}
							</div>
							
							{/* Reference Date Used */}
							{referenceDateUsedValue && typeof referenceDateUsedValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
									<p className="text-sm text-blue-800">
										<strong>Reference Date:</strong> {referenceDateUsedValue}
									</p>
								</div>
							)}
							
							{/* Explanation */}
							{ageExplanationValue && typeof ageExplanationValue === 'string' && (
								<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="text-base font-semibold text-blue-900 mb-2">Age Calculation</h4>
									<p className="text-sm text-blue-800 leading-relaxed">
										{ageExplanationValue}
									</p>
									<p className="text-sm text-blue-800 leading-relaxed mt-3">
										The calculator accounts for leap years and varying month lengths to provide an accurate age calculation. Age is calculated by subtracting your birth date from the reference date, then adjusting for years, months, and days.
									</p>
								</div>
							)}
						</div>
					) : calculator.id === 'days-between-dates-calculator' && mainOutput.name === 'totalDays' ? (
						<div>
							<div className="text-5xl md:text-6xl font-bold text-blue-600 mb-3">
								{daysTotalDaysInclusiveValue !== null && daysTotalDaysInclusiveValue !== undefined && daysIncludeEndDateValue === 'Yes'
									? daysTotalDaysInclusiveValue.toLocaleString()
									: daysTotalDaysValue !== null && daysTotalDaysValue !== undefined
									? daysTotalDaysValue.toLocaleString()
									: formattedMainValue}
							</div>
							<p className="text-sm text-gray-500 mb-4">
								{daysIncludeEndDateValue === 'Yes' ? 'Days (Inclusive)' : 'Days (Exclusive)'}
							</p>
							
							{/* Date Range */}
							{(daysStartDateFormattedValue || daysEndDateFormattedValue) && (
								<div className="mt-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<div className="text-sm text-gray-700">
										<p className="mb-1">
											<strong>From:</strong> {daysStartDateFormattedValue}
										</p>
										<p>
											<strong>To:</strong> {daysEndDateFormattedValue}
										</p>
									</div>
								</div>
							)}
							
							{/* Weeks and Days Breakdown */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
								{daysWeeksValue !== null && daysWeeksValue !== undefined && (
									<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
										<p className="text-sm text-blue-700 mb-1">Weeks</p>
										<p className="text-3xl font-semibold text-blue-900">{daysWeeksValue}</p>
										{daysRemainingDaysValue !== null && daysRemainingDaysValue !== undefined && typeof daysRemainingDaysValue === 'number' && daysRemainingDaysValue > 0 && (
											<p className="text-xs text-blue-600 mt-1">+ {daysRemainingDaysValue} {daysRemainingDaysValue === 1 ? 'day' : 'days'}</p>
										)}
									</div>
								)}
								{daysBreakdownValue && typeof daysBreakdownValue === 'string' && (
									<div className="p-4 bg-green-50 rounded-lg border border-green-200">
										<p className="text-sm text-green-700 mb-1">Breakdown</p>
										<p className="text-lg font-semibold text-green-900">{daysBreakdownValue}</p>
									</div>
								)}
							</div>
							
							{/* Inclusive vs Exclusive Info */}
							{daysIncludeEndDateValue && (
								<div className="mt-4 mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
									<p className="text-sm text-yellow-800">
										<strong>Counting Method:</strong> {daysIncludeEndDateValue === 'Yes' ? 'Inclusive (end date included)' : 'Exclusive (end date excluded)'}
									</p>
									{daysIncludeEndDateValue === 'Yes' && daysTotalDaysInclusiveValue !== null && daysTotalDaysInclusiveValue !== undefined && (
										<p className="text-xs text-yellow-700 mt-1">
											Total: {daysTotalDaysInclusiveValue} days ({daysBreakdownInclusiveValue || daysBreakdownValue})
										</p>
									)}
								</div>
							)}
							
							{/* Explanation */}
							{daysExplanationValue && typeof daysExplanationValue === 'string' && (
								<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="text-base font-semibold text-blue-900 mb-2">Date Difference Calculation</h4>
									<p className="text-sm text-blue-800 leading-relaxed">
										{daysExplanationValue}
									</p>
									<p className="text-sm text-blue-800 leading-relaxed mt-3">
										<strong>Inclusive vs Exclusive:</strong> Exclusive counting excludes the end date from the total (e.g., March 1 to March 5 = 4 days). Inclusive counting includes the end date (e.g., March 1 to March 5 = 5 days). Choose based on whether the end date is part of the period you're measuring.
									</p>
								</div>
							)}
						</div>
					) : calculator.id === 'numbers-to-words-calculator' && mainOutput.name === 'words' ? (
						<div>
							<div className="text-3xl md:text-4xl font-bold text-blue-600 mb-3 break-words">
								{numbersToWordsCurrencyValue && typeof numbersToWordsCurrencyValue === 'string' && numbersToWordsCurrencyValue.trim() !== ''
									? numbersToWordsCurrencyValue
									: numbersToWordsWordsValue && typeof numbersToWordsWordsValue === 'string'
									? numbersToWordsWordsValue
									: formattedMainValue}
							</div>
							<p className="text-sm text-gray-500 mb-4">
								{numbersToWordsCurrencyValue && typeof numbersToWordsCurrencyValue === 'string' && numbersToWordsCurrencyValue.trim() !== ''
									? 'Number in Currency Words'
									: 'Number in Words'}
							</p>
							
							{/* Original Number */}
							{numbersToWordsOriginalValue && typeof numbersToWordsOriginalValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700">
										<strong>Original Number:</strong> {numbersToWordsOriginalValue}
									</p>
								</div>
							)}
							
							{/* Breakdown by Scale */}
							{(numbersToWordsMillionsValue !== null || numbersToWordsThousandsValue !== null || numbersToWordsHundredsValue !== null) && (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-4">
								{numbersToWordsMillionsValue !== null && numbersToWordsMillionsValue !== undefined && typeof numbersToWordsMillionsValue === 'number' && numbersToWordsMillionsValue > 0 && (
									<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
										<p className="text-sm text-blue-700 mb-1">Millions</p>
										<p className="text-2xl font-semibold text-blue-900">{numbersToWordsMillionsValue.toLocaleString()}</p>
									</div>
								)}
								{numbersToWordsThousandsValue !== null && numbersToWordsThousandsValue !== undefined && typeof numbersToWordsThousandsValue === 'number' && numbersToWordsThousandsValue > 0 && (
									<div className="p-4 bg-green-50 rounded-lg border border-green-200">
										<p className="text-sm text-green-700 mb-1">Thousands</p>
										<p className="text-2xl font-semibold text-green-900">{numbersToWordsThousandsValue.toLocaleString()}</p>
									</div>
								)}
								{numbersToWordsHundredsValue !== null && numbersToWordsHundredsValue !== undefined && typeof numbersToWordsHundredsValue === 'number' && numbersToWordsHundredsValue > 0 && (
										<div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
											<p className="text-sm text-purple-700 mb-1">Hundreds</p>
											<p className="text-2xl font-semibold text-purple-900">{numbersToWordsHundredsValue.toLocaleString()}</p>
										</div>
									)}
								</div>
							)}
							
							{/* Breakdown Text */}
							{numbersToWordsBreakdownValue && typeof numbersToWordsBreakdownValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700">
										<strong>Breakdown:</strong> {numbersToWordsBreakdownValue}
									</p>
								</div>
							)}
							
							{/* Standard Format (if currency mode is on) */}
							{numbersToWordsCurrencyValue && typeof numbersToWordsCurrencyValue === 'string' && numbersToWordsCurrencyValue.trim() !== '' && numbersToWordsWordsValue && typeof numbersToWordsWordsValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
									<p className="text-sm text-blue-800 mb-1">
										<strong>Standard Format:</strong>
									</p>
									<p className="text-base font-medium text-blue-900">{numbersToWordsWordsValue}</p>
								</div>
							)}
							
							{/* Explanation */}
							{numbersToWordsExplanationValue && typeof numbersToWordsExplanationValue === 'string' && (
								<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="text-base font-semibold text-blue-900 mb-2">Number Conversion</h4>
									<p className="text-sm text-blue-800 leading-relaxed">
										{numbersToWordsExplanationValue}
									</p>
									<p className="text-sm text-blue-800 leading-relaxed mt-3">
										<strong>How it works:</strong> Numbers are broken down by scale (millions, thousands, hundreds) and each part is converted to words. The parts are then combined with appropriate scale words. For currency mode, the number is formatted as dollars (integer part) and cents (decimal part × 100).
									</p>
								</div>
							)}
						</div>
					) : calculator.id === 'roman-numerals-converter' && mainOutput.name === 'result' ? (
						<div>
							<div className="text-5xl md:text-6xl font-bold text-blue-600 mb-3 break-words">
								{romanResultValue && typeof romanResultValue === 'string' ? romanResultValue : formattedMainValue}
							</div>
							<p className="text-sm text-gray-500 mb-4">
								{romanModeValue === 'number-to-roman' ? 'Roman Numeral' : 'Decimal Number'}
							</p>
							
							{/* Original Value */}
							{romanOriginalValue && typeof romanOriginalValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<p className="text-sm text-gray-700">
										<strong>Original Value:</strong> {romanOriginalValue}
									</p>
								</div>
							)}
							
							{/* Symbols Used */}
							{romanSymbolsUsedValue && typeof romanSymbolsUsedValue === 'string' && romanSymbolsUsedValue.trim() !== '' && (
								<div className="mt-4 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
									<p className="text-sm text-purple-800">
										<strong>Symbols Used:</strong> {romanSymbolsUsedValue}
									</p>
								</div>
							)}
							
							{/* Step-by-Step Breakdown */}
							{romanBreakdownValue && typeof romanBreakdownValue === 'string' && (
								<div className="mt-6 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="text-base font-semibold text-blue-900 mb-3">Step-by-Step Breakdown</h4>
									<div className="space-y-2">
										{romanBreakdownValue.split(', ').map((step, index) => (
											<div key={index} className="text-sm text-blue-800">
												<span className="font-medium">Step {index + 1}:</span> {step.trim()}
											</div>
										))}
									</div>
								</div>
							)}
							
							{/* Explanation */}
							{romanExplanationValue && typeof romanExplanationValue === 'string' && (
								<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="text-base font-semibold text-blue-900 mb-2">Conversion Explanation</h4>
									<p className="text-sm text-blue-800 leading-relaxed">
										{romanExplanationValue}
									</p>
									{romanModeValue === 'number-to-roman' && (
										<p className="text-sm text-blue-800 leading-relaxed mt-3">
											<strong>How it works:</strong> Numbers are broken down by place value (thousands, hundreds, tens, ones) and converted using Roman symbols. Subtractive notation is used for 4 (IV), 9 (IX), 40 (XL), 90 (XC), 400 (CD), and 900 (CM) to follow standard Roman numeral rules.
										</p>
									)}
									{romanModeValue === 'roman-to-number' && (
										<p className="text-sm text-blue-800 leading-relaxed mt-3">
											<strong>How it works:</strong> Roman numerals are read from left to right. When a smaller value appears before a larger value, it's subtracted (e.g., IV = 4). Otherwise, values are added together. The calculator validates the input to ensure it follows proper Roman numeral rules.
										</p>
									)}
								</div>
							)}
						</div>
					) : calculator.id === 'date-calculator' && mainOutput.name === 'resultDate' ? (
						<div>
							<div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
								{dateResultDateFormattedValue && typeof dateResultDateFormattedValue === 'string'
									? dateResultDateFormattedValue
									: formattedMainValue}
							</div>
							{dateWeekdayValue && typeof dateWeekdayValue === 'string' && (
								<p className="text-lg text-gray-600 mb-4 font-medium">
									{dateWeekdayValue}
								</p>
							)}
							
							{/* Date Range Summary */}
							{(dateStartDateFormattedValue || dateNumberOfDaysValue !== null) && (
								<div className="mt-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<div className="text-sm text-gray-700">
										<p className="mb-1">
											<strong>Start Date:</strong> {dateStartDateFormattedValue || 'N/A'}
										</p>
										{dateOperationValue === 'add' && dateDaysAddedValue !== null && dateDaysAddedValue !== undefined && (
											<p className="mb-1">
												<strong>Operation:</strong> Added {dateDaysAddedValue} {dateDaysAddedValue === 1 ? 'day' : 'days'}
											</p>
										)}
										{dateOperationValue === 'subtract' && dateDaysSubtractedValue !== null && dateDaysSubtractedValue !== undefined && (
											<p className="mb-1">
												<strong>Operation:</strong> Subtracted {dateDaysSubtractedValue} {dateDaysSubtractedValue === 1 ? 'day' : 'days'}
											</p>
										)}
										{dateResultDateFormattedValue && typeof dateResultDateFormattedValue === 'string' && (
											<p>
												<strong>Result Date:</strong> {dateResultDateFormattedValue}
											</p>
										)}
									</div>
								</div>
							)}
							
							{/* ISO Date Format */}
							{dateIsoDateValue && typeof dateIsoDateValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
									<p className="text-sm text-blue-800">
										<strong>ISO Format:</strong> {dateIsoDateValue}
									</p>
								</div>
							)}
							
							{/* Days Difference Summary */}
							{dateDaysDifferenceValue !== null && dateDaysDifferenceValue !== undefined && typeof dateDaysDifferenceValue === 'number' && (
								<div className="mt-4 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
									<p className="text-sm text-green-800">
										<strong>Total Days Difference:</strong> {Math.abs(dateDaysDifferenceValue)} {Math.abs(dateDaysDifferenceValue) === 1 ? 'day' : 'days'}
									</p>
								</div>
							)}
							
							{/* Explanation */}
							{dateExplanationValue && typeof dateExplanationValue === 'string' && (
								<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="text-base font-semibold text-blue-900 mb-2">Date Calculation</h4>
									<p className="text-sm text-blue-800 leading-relaxed">
										{dateExplanationValue}
									</p>
									<p className="text-sm text-blue-800 leading-relaxed mt-3">
										<strong>How it works:</strong> The calculator adds or subtracts the specified number of calendar days from the start date. It automatically handles month boundaries, year transitions, and leap years. All calendar days are counted, including weekends.
									</p>
								</div>
							)}
						</div>
					) : calculator.id === 'cooking-measurement-converter' && mainOutput.name === 'result' ? (
						<div>
							<div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">
								{cookingResultFormattedValue && typeof cookingResultFormattedValue === 'string'
									? cookingResultFormattedValue
									: cookingResultValue !== null && cookingResultValue !== undefined && typeof cookingResultValue === 'number'
									? cookingResultValue.toFixed(2)
									: formattedMainValue}
								{cookingToUnitValue && typeof cookingToUnitValue === 'string' && (
									<span className="text-2xl md:text-3xl text-gray-600 ml-2 font-normal">
										{cookingToUnitValue}
									</span>
								)}
							</div>
							<p className="text-sm text-gray-500 mb-4">
								{cookingOriginalValue !== null && cookingOriginalValue !== undefined && cookingFromUnitValue && typeof cookingFromUnitValue === 'string'
									? `${cookingOriginalValue} ${cookingFromUnitValue} = ${cookingResultFormattedValue || (cookingResultValue !== null && cookingResultValue !== undefined && typeof cookingResultValue === 'number' ? cookingResultValue.toFixed(2) : 'N/A')} ${cookingToUnitValue || ''}`
									: 'Conversion Result'}
							</p>
							
							{/* Conversion Type */}
							{cookingConversionTypeValue && typeof cookingConversionTypeValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
									<p className="text-sm text-purple-800">
										<strong>Conversion Type:</strong> {
											cookingConversionTypeValue === 'volume-to-volume' ? 'Volume to Volume' :
											cookingConversionTypeValue === 'weight-to-weight' ? 'Weight to Weight' :
											cookingConversionTypeValue === 'volume-to-weight' ? 'Volume to Weight' :
											cookingConversionTypeValue === 'weight-to-volume' ? 'Weight to Volume' :
											cookingConversionTypeValue
										}
									</p>
									{cookingIngredientValue && typeof cookingIngredientValue === 'string' && (cookingConversionTypeValue === 'volume-to-weight' || cookingConversionTypeValue === 'weight-to-volume') && (
										<p className="text-xs text-purple-700 mt-1">
											Ingredient: {cookingIngredientValue.charAt(0).toUpperCase() + cookingIngredientValue.slice(1)}
										</p>
									)}
								</div>
							)}
							
							{/* Ingredient Note */}
							{cookingIngredientNoteValue && typeof cookingIngredientNoteValue === 'string' && cookingIngredientNoteValue.trim() !== '' && (
								<div className="mt-4 mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
									<p className="text-sm text-yellow-800">
										{cookingIngredientNoteValue}
									</p>
								</div>
							)}
							
							{/* Explanation */}
							{cookingExplanationValue && typeof cookingExplanationValue === 'string' && (
								<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="text-base font-semibold text-blue-900 mb-2">Conversion Details</h4>
									<p className="text-sm text-blue-800 leading-relaxed">
										{cookingExplanationValue}
									</p>
									<p className="text-sm text-blue-800 leading-relaxed mt-3">
										<strong>How it works:</strong> {
											cookingConversionTypeValue === 'volume-to-volume' || cookingConversionTypeValue === 'weight-to-weight'
												? 'This is a direct unit conversion using standard conversion factors. Volume-to-volume and weight-to-weight conversions are precise and don\'t depend on ingredient properties.'
												: 'This conversion uses ingredient density to convert between volume and weight. Different ingredients have different densities, so the same volume can have different weights depending on the ingredient.'
										}
									</p>
								</div>
							)}
						</div>
					) : calculator.id === 'room-area-calculator' && mainOutput.name === 'area' ? (
						<div>
							<div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">
								{roomAreaFormattedValue && typeof roomAreaFormattedValue === 'string'
									? roomAreaFormattedValue
									: roomAreaValue !== null && roomAreaValue !== undefined && typeof roomAreaValue === 'number'
									? roomAreaValue.toFixed(2)
									: formattedMainValue}
								{roomUnitSymbolValue && typeof roomUnitSymbolValue === 'string' && (
									<span className="text-2xl md:text-3xl text-gray-600 ml-2 font-normal">
										{roomUnitSymbolValue}
									</span>
								)}
							</div>
							<p className="text-sm text-gray-500 mb-4">
								Room Area
							</p>
							
							{/* Alternative Unit Conversion */}
							{roomAreaAlternativeValue && typeof roomAreaAlternativeValue === 'string' && roomAlternativeUnitValue && typeof roomAlternativeUnitValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
									<p className="text-sm text-green-800">
										<strong>Alternative Unit:</strong> {roomAreaAlternativeValue} {roomAlternativeUnitValue}
									</p>
								</div>
							)}
							
							{/* Shape and Formula */}
							{roomFormulaValue && typeof roomFormulaValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
									<p className="text-sm text-purple-800 mb-1">
										<strong>Shape:</strong> {roomShapeValue && typeof roomShapeValue === 'string' ? roomShapeValue.charAt(0).toUpperCase() + roomShapeValue.slice(1) : 'N/A'}
									</p>
									<p className="text-sm text-purple-800">
										<strong>Formula:</strong> {roomFormulaValue}
									</p>
								</div>
							)}
							
							{/* Explanation */}
							{roomExplanationValue && typeof roomExplanationValue === 'string' && (
								<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="text-base font-semibold text-blue-900 mb-2">Area Calculation</h4>
									<p className="text-sm text-blue-800 leading-relaxed">
										{roomExplanationValue}
									</p>
									<p className="text-sm text-blue-800 leading-relaxed mt-3">
										<strong>When this is useful:</strong> Room area is essential for planning flooring, carpet, paint coverage (combined with wall height), furniture placement, and estimating material needs. The area helps you determine how much material to purchase and plan your space effectively.
									</p>
								</div>
							)}
						</div>
					) : calculator.id === 'paint-calculator' && mainOutput.name === 'paintRequired' ? (
						<div>
							<div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">
								{paintRequiredFormattedValue && typeof paintRequiredFormattedValue === 'string'
									? paintRequiredFormattedValue
									: paintRequiredValue !== null && paintRequiredValue !== undefined && typeof paintRequiredValue === 'number'
									? paintRequiredValue.toFixed(1)
									: formattedMainValue}
								{paintUnitValue && typeof paintUnitValue === 'string' && (
									<span className="text-2xl md:text-3xl text-gray-600 ml-2 font-normal">
										{paintUnitValue}
									</span>
								)}
							</div>
							<p className="text-sm text-gray-500 mb-4">
								Paint Required
							</p>
							
							{/* Alternative Unit Conversion */}
							{paintRequiredAlternativeValue && typeof paintRequiredAlternativeValue === 'string' && paintAlternativeUnitValue && typeof paintAlternativeUnitValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
									<p className="text-sm text-green-800">
										<strong>Alternative Unit:</strong> {paintRequiredAlternativeValue} {paintAlternativeUnitValue}
									</p>
								</div>
							)}
							
							{/* Cans Estimate */}
							{paintCansEstimateValue && typeof paintCansEstimateValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
									<p className="text-sm text-purple-800">
										<strong>Estimated Cans:</strong> {paintCansEstimateValue}
									</p>
									<p className="text-xs text-purple-700 mt-1">
										Note: Add 10-15% extra for waste and touch-ups
									</p>
								</div>
							)}
							
							{/* Calculation Details */}
							{(paintRoomAreaValue !== null || paintNumberOfCoatsValue !== null || paintCoverageValue !== null) && (
								<div className="mt-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<div className="text-sm text-gray-700">
										{paintRoomAreaValue !== null && typeof paintRoomAreaValue === 'number' && paintAreaUnitValue && typeof paintAreaUnitValue === 'string' && (
											<p className="mb-1">
												<strong>Room Area:</strong> {paintRoomAreaValue.toFixed(1)} {paintAreaUnitValue}
											</p>
										)}
										{paintNumberOfCoatsValue !== null && (
											<p className="mb-1">
												<strong>Number of Coats:</strong> {paintNumberOfCoatsValue}
											</p>
										)}
										{paintCoverageValue !== null && paintCoverageUnitValue && typeof paintCoverageUnitValue === 'string' && (
											<p>
												<strong>Paint Coverage:</strong> {paintCoverageValue} {paintCoverageUnitValue}
											</p>
										)}
									</div>
								</div>
							)}
							
							{/* Explanation */}
							{paintExplanationValue && typeof paintExplanationValue === 'string' && (
								<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="text-base font-semibold text-blue-900 mb-2">Paint Calculation</h4>
									<p className="text-sm text-blue-800 leading-relaxed">
										{paintExplanationValue}
									</p>
									<p className="text-sm text-blue-800 leading-relaxed mt-3">
										<strong>Coverage assumptions:</strong> The calculator uses standard paint coverage rates (10 m²/liter or 400 ft²/gallon) unless you specify otherwise. Premium paints may have higher coverage, while economy paints may have lower coverage. Always check the paint can label for specific coverage rates.
									</p>
									<p className="text-sm text-blue-800 leading-relaxed mt-2">
										<strong>Why coats matter:</strong> Each coat multiplies the paint needed. Two coats provide better coverage, durability, and color consistency than one coat. The number of coats depends on the color change, paint quality, and desired finish.
									</p>
								</div>
							)}
						</div>
					) : calculator.id === 'random-number-generator' && mainOutput.name === 'numbers' ? (
						<div>
							<div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3 break-words">
								{randomNumbersFormattedValue && typeof randomNumbersFormattedValue === 'string'
									? randomNumbersFormattedValue
									: randomNumbersValue && Array.isArray(randomNumbersValue) && randomNumbersValue.length > 0
									? randomNumbersValue.join(', ')
									: formattedMainValue}
							</div>
							<p className="text-sm text-gray-500 mb-4">
								{randomQuantityValue !== null && randomQuantityValue !== undefined && typeof randomQuantityValue === 'number' && randomQuantityValue > 1
									? `Generated ${randomQuantityValue} Random Numbers`
									: 'Generated Random Number'}
							</p>
							
							{/* Range Information */}
							{randomRangeValue && typeof randomRangeValue === 'string' && (
								<div className="mt-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<div className="text-sm text-gray-700">
										<p className="mb-1">
											<strong>Range:</strong> {randomRangeValue}
										</p>
										{randomMinValue !== null && randomMaxValue !== null && (
											<p className="mb-1">
												<strong>Minimum:</strong> {randomMinValue} | <strong>Maximum:</strong> {randomMaxValue}
											</p>
										)}
										{randomQuantityValue !== null && randomQuantityValue !== undefined && (
											<p className="mb-1">
												<strong>Quantity:</strong> {randomQuantityValue}
											</p>
										)}
										{randomAllowDuplicatesValue !== null && randomAllowDuplicatesValue !== undefined && (
											<p>
												<strong>Duplicates:</strong> {randomAllowDuplicatesValue ? 'Allowed' : 'Not Allowed'}
											</p>
										)}
									</div>
								</div>
							)}
							
							{/* Individual Numbers (if multiple) */}
							{randomNumbersValue && Array.isArray(randomNumbersValue) && randomNumbersValue.length > 1 && (
								<div className="mt-4 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
									<p className="text-sm text-purple-800 mb-2">
										<strong>Individual Numbers:</strong>
									</p>
									<div className="flex flex-wrap gap-2">
										{randomNumbersValue.map((num, index) => (
											<span key={index} className="px-3 py-1 bg-purple-100 rounded text-sm font-medium text-purple-900">
												{num}
											</span>
										))}
									</div>
								</div>
							)}
							
							{/* Explanation */}
							{randomExplanationValue && typeof randomExplanationValue === 'string' && (
								<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="text-base font-semibold text-blue-900 mb-2">Random Number Generation</h4>
									<p className="text-sm text-blue-800 leading-relaxed">
										{randomExplanationValue}
									</p>
									<p className="text-sm text-blue-800 leading-relaxed mt-3">
										<strong>Note:</strong> This generator uses pseudo-random number generation suitable for general use, games, and simulations. It is not cryptographically secure and should not be used for security-sensitive applications. Each number in the range has an equal probability of being selected.
									</p>
								</div>
							)}
						</div>
					) : calculator.id === 'roi-calculator' && mainOutput.name === 'roiPercentage' ? (
						<div className={`text-5xl md:text-6xl font-bold mb-2 ${
							Number(mainValue) < 0 
								? 'text-red-600' 
								: Number(mainValue) === 0 
									? 'text-gray-600' 
									: Number(mainValue) < 10 
										? 'text-yellow-600' 
										: Number(mainValue) < 25 
											? 'text-blue-600' 
											: 'text-green-600'
						}`}>
							{formattedMainValue}
						</div>
					) : calculator.id === 'equation-solver' ? (
						<div className={`text-3xl md:text-4xl font-bold mb-2 ${
							typeof formattedMainValue === 'string' && (
								formattedMainValue.includes('no solutions') || formattedMainValue.includes('no real roots')
							)
								? 'text-red-600'
								: typeof formattedMainValue === 'string' && formattedMainValue.includes('infinite solutions')
								? 'text-orange-600'
								: 'text-green-600'
						}`}>
							{formattedMainValue}
						</div>
					) : (
						<div className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">
							{formattedMainValue}
						</div>
					)}
					{/* Direction badge (for percentage change) */}
					{directionValue && typeof directionValue === 'string' && (
						<div className="mt-3">
							<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
								directionValue === 'Increase' 
									? 'bg-green-100 text-green-800' 
									: directionValue === 'Decrease'
									? 'bg-red-100 text-red-800'
									: 'bg-gray-100 text-gray-800'
							}`}>
								{directionValue}
							</span>
						</div>
					)}
					{mainOutput.unitLabel && !directionValue && calculator.id !== 'equation-solver' && (
						<p className="text-sm text-gray-500">{mainOutput.unitLabel}</p>
					)}
					{/* Result explanation */}
					{(() => {
						const explanation = getResultExplanation(calculator, mainOutput.name, mainValue)
						return explanation ? (
							<div className="mt-4 pt-4 border-t border-gray-200">
								<p className="text-sm text-gray-600 leading-relaxed">{explanation}</p>
							</div>
						) : null
					})()}
				</div>
			)}

			{/* Discriminant (for quadratic calculator) */}
			{discriminantValue !== null && discriminantValue !== undefined && (
				<div className="mb-4">
					<p className="text-sm text-gray-500 mb-1">Discriminant</p>
					<p className="text-lg font-semibold text-gray-900">
						D = {Number(discriminantValue).toFixed(6)}
					</p>
				</div>
			)}

			{/* Roots (for quadratic calculator and equation solver) */}
			{rootsValue !== null && rootsValue !== undefined && (
				<div className="mb-4">
					<p className="text-sm text-gray-500 mb-1">Roots</p>
					<p className="text-lg font-semibold text-gray-900">
						{Array.isArray(rootsValue) ? (
							rootsValue.length === 0 ? (
								'No real roots'
							) : (
								rootsValue.map((r: number, idx: number) => {
									if (typeof r === 'number' && !isNaN(r)) {
										return <span key={idx}>{idx > 0 && ', '}x = {r.toFixed(6)}</span>
									}
									return null
								})
							)
						) : typeof rootsValue === 'string' ? (
							rootsValue
						) : (
							'No real roots'
						)}
					</p>
				</div>
			)}

			{/* Formula (secondary text) */}
			{formulaValue && typeof formulaValue === 'string' && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm text-gray-500 mb-1">Formula</p>
					<p className="text-base text-gray-600 font-mono whitespace-pre-line">{formulaValue}</p>
				</div>
			)}

			{/* Normalized form (for equation solver) */}
			{normalizedFormValue && typeof normalizedFormValue === 'string' && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm text-gray-500 mb-1">Normalized Form</p>
					<p className="text-base text-gray-700 font-mono">{normalizedFormValue}</p>
				</div>
			)}

			{/* Steps (for equation solver) */}
			{stepsValue && Array.isArray(stepsValue) && stepsValue.length > 0 && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm font-medium text-gray-700 mb-4">Solution Steps</p>
					<div className="space-y-4">
						{stepsValue.map((step: any, index: number) => (
							<div key={index} className="bg-gray-50 rounded-lg p-4">
								<p className="text-sm font-semibold text-gray-900 mb-2">
									{step.title || `Step ${index + 1}`}
								</p>
								{step.math && (
									<p className="text-base text-gray-800 font-mono whitespace-pre-line mb-2">
										{step.math}
									</p>
								)}
								{step.explanation && (
									<p className="text-sm text-gray-600 leading-relaxed">
										{step.explanation}
									</p>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Explanation (for pythagorean calculator) */}
			{explanationValue && typeof explanationValue === 'string' && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm text-gray-500 mb-1">Explanation</p>
					<p className="text-base text-gray-700 leading-relaxed">{explanationValue}</p>
				</div>
			)}

			{/* Formula Explanation (for compound interest and loan payment calculators) */}
			{formulaExplanationValue && typeof formulaExplanationValue === 'string' && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm font-medium text-gray-700 mb-3">How the Calculation Works</p>
					<p className="text-base text-gray-700 leading-relaxed whitespace-pre-line font-mono text-sm bg-gray-50 p-4 rounded-lg">
						{formulaExplanationValue}
					</p>
				</div>
			)}

			{/* Year-by-Year Breakdown (for compound interest, investment, and savings calculators) */}
			{yearBreakdownValue && Array.isArray(yearBreakdownValue) && yearBreakdownValue.length > 0 && (
				<div className="mb-6 pt-6 border-t border-gray-200">
					<p className="text-sm font-medium text-gray-700 mb-4">Year-by-Year Growth</p>
					<div className="bg-gray-50 rounded-lg overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="bg-gray-100">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Year</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
											{calculator.id === 'investment-calculator' ? 'Starting Value' : calculator.id === 'savings-calculator' ? 'Starting Balance' : 'Starting Balance'}
										</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Contributions</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
											{calculator.id === 'investment-calculator' ? 'Return Earned' : calculator.id === 'savings-calculator' ? 'Interest Earned' : 'Interest Earned'}
										</th>
										<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
											{calculator.id === 'investment-calculator' ? 'Ending Value' : calculator.id === 'savings-calculator' ? 'Ending Balance' : 'Ending Balance'}
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{yearBreakdownValue.map((year: any, index: number) => {
										// Support both compound interest and investment calculator field names
										const startingValue = year.startingValue || year.startingBalance || 0
										const contributions = year.contribution || year.contributions || 0
										const returnEarned = year.returnEarned || year.interestEarned || 0
										const endingValue = year.endingValue || year.endingBalance || 0
										
										return (
											<tr key={year.year || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
												<td className="px-4 py-3 font-medium text-gray-900">{year.year}</td>
												<td className="px-4 py-3 text-right text-gray-700">
													${startingValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className="px-4 py-3 text-right text-gray-700">
													${contributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className="px-4 py-3 text-right text-green-600 font-semibold">
													${returnEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
												<td className="px-4 py-3 text-right text-gray-900 font-semibold">
													${endingValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}

			{/* Statistics table (for descriptive statistics, average, and standard deviation calculators) */}
			{(calculator.id === 'descriptive-statistics-calculator' || calculator.id === 'average-calculator' || calculator.id === 'standard-deviation-calculator') && otherOutputs.length > 0 && (
				<div className="pt-6 border-t border-gray-200">
					<p className="text-sm font-medium text-gray-700 mb-4">Statistics</p>
					<div className="bg-gray-50 rounded-lg overflow-hidden">
						<table className="w-full">
							<tbody className="divide-y divide-gray-200">
								{otherOutputs.map((output) => {
									const value = outputs[output.name]
									if (value === null || value === undefined) return null
									
									// Special handling for mode (can be string "No mode" or array)
									let displayValue: string
									if (output.name === 'mode') {
										if (typeof value === 'string') {
											displayValue = value
										} else if (Array.isArray(value)) {
											displayValue = value.length > 0 ? value.join(', ') : 'No mode'
										} else {
											displayValue = String(value)
										}
									} else {
										displayValue = formatOutputValue(
											value,
											output.formatType,
											output.unitLabel,
										)
									}

									// Highlight important statistics
									const isImportant = output.name === 'mean' || output.name === 'median' || output.name === 'standardDeviation'
									
									// For average calculator, all outputs are important
									const isAverageCalc = calculator.id === 'average-calculator'
									
									// For standard deviation calculator, standardDeviation is most important
									const isStdDevCalc = calculator.id === 'standard-deviation-calculator'
									const isStdDevImportant = isStdDevCalc && output.name === 'standardDeviation'

									return (
										<tr key={output.name} className={(isImportant || isAverageCalc || isStdDevImportant) ? 'bg-blue-50' : ''}>
											<td className="px-4 py-3 text-sm font-medium text-gray-700">
												{output.label}
											</td>
											<td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
												{displayValue}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
					{/* Sorted data */}
					{sortedDataValue && Array.isArray(sortedDataValue) && sortedDataValue.length > 0 && (
						<div className="mt-4">
							<p className="text-sm font-medium text-gray-700 mb-2">Sorted Data (Ascending)</p>
							<div className="bg-gray-50 rounded-lg p-3">
								<p className="text-sm text-gray-800 font-mono">
									{sortedDataValue.map((n: number, idx: number) => (
										<span key={idx}>
											{idx > 0 && ', '}
											{n.toFixed(6).replace(/\.?0+$/, '')}
										</span>
									))}
								</p>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Universal Insights Handler - for all calculators with insights */}
			{(() => {
				const insights = outputs.insights as string | undefined
				if (insights && typeof insights === 'string' && insights.trim()) {
					// Check if this calculator already has special handling (to avoid duplicates)
					// Calculators with special handling have their own insights formatting in their dedicated blocks
					const hasSpecialHandling = [
						'car-cost-of-ownership-calculator',
						'car-maintenance-cost-calculator',
						'monthly-car-expenses-calculator',
						'car-depreciation-calculator',
						'car-resale-value-calculator',
						'tire-cost-calculator',
						'lease-vs-buy-calculator',
						'trip-cost-calculator',
						'fuel-cost-calculator',
						'car-affordability-calculator',
					].includes(calculator.id)
					
					if (!hasSpecialHandling) {
						return (
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mt-6">
								<h4 className="text-base md:text-lg font-semibold text-blue-800 mb-3">Key Insights</h4>
								<div className="space-y-2 text-sm text-blue-700 leading-relaxed">
									{insights.split('.').filter(s => s.trim()).map((insight, index) => (
										<div key={index} className="flex items-start">
											<span className="mr-2">•</span>
											<span>{insight.trim()}.</span>
										</div>
									))}
								</div>
							</div>
						)
					}
				}
				return null
			})()}

			{/* Other outputs (if any, for non-statistics calculators) */}
			{calculator.id !== 'descriptive-statistics-calculator' && calculator.id !== 'average-calculator' && calculator.id !== 'standard-deviation-calculator' && otherOutputs.length > 0 && (
				<div className="space-y-3 pt-4 border-t border-gray-200">
					{otherOutputs.map((output) => {
						const value = outputs[output.name]
						if (value === null || value === undefined) return null
						
						// Skip arrays and objects - they should be handled separately
						if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
							return null
						}
						
						// Skip insights - already handled above
						if (output.name === 'insights') {
							return null
						}
						
						const formattedValue = formatOutputValue(
							value,
							output.formatType,
							output.unitLabel,
						)

						return (
							<div
								key={output.name}
								className="flex items-center justify-between py-2"
							>
								<span className="text-sm text-gray-600">
									{output.label}
								</span>
								<span className="text-lg font-semibold text-gray-900">
									{formattedValue}
								</span>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}




