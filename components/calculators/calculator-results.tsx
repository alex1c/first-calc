import type { CalculatorDefinitionClient } from '@/lib/calculators/types'
import { formatOutputValue } from '@/lib/calculators/format'

interface CalculatorResultsProps {
	calculator: CalculatorDefinitionClient
	outputs: Record<string, number | string | null>
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
			const yearlyBreakdown = outputs.yearlyBreakdown as any[]
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
		const amortizationSchedule = outputs.amortizationSchedule as any[]
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
				if (mainValue.length === 0) {
					formattedMainValue = 'No real roots'
				} else {
					formattedMainValue = mainValue.map((r: number) => `x = ${r.toFixed(6)}`).join(', ')
				}
			} else {
				formattedMainValue = String(mainValue)
			}
		} else if (mainOutput.name === 'roots') {
			// Format roots array for quadratic calculator
			if (Array.isArray(mainValue)) {
				if (mainValue.length === 0) {
					formattedMainValue = 'No real roots'
				} else if (mainValue.length === 1 && typeof mainValue[0] === 'string') {
					formattedMainValue = mainValue[0]
				} else {
					formattedMainValue = mainValue.map((r: number) => r.toFixed(6)).join(', ')
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

	return (
		<div className="h-full">
			{/* Main Result */}
			{formattedMainValue && (
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
						{mainOutput.label || 'Result'}
					</label>
					{/* Special formatting for ROI calculator - color-coded */}
					{calculator.id === 'roi-calculator' && mainOutput.name === 'roiPercentage' ? (
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




