/**
 * Calculator Hero component
 * Displays title, description, and visual illustration
 */

import type { CalculatorDefinitionClient } from '@/lib/calculators/types'

interface CalculatorHeroProps {
	calculator: CalculatorDefinitionClient
}

/**
 * Get category badge text based on category
 */
function getCategoryBadge(category: string): string {
	const badges: Record<string, string> = {
		math: 'GEOMETRY CALCULATOR',
		finance: 'FINANCE CALCULATOR',
		health: 'HEALTH CALCULATOR',
		everyday: 'EVERYDAY CALCULATOR',
		engineering: 'ENGINEERING CALCULATOR',
		business: 'BUSINESS CALCULATOR',
	}
	return badges[category] || 'CALCULATOR'
}

/**
 * Calculator Hero component
 * Shows H1 title, short description, and visual illustration
 */
export function CalculatorHero({ calculator }: CalculatorHeroProps) {
	// Get short description (first 1-2 sentences)
	const shortDesc = calculator.shortDescription
		.split('.')
		.slice(0, 2)
		.join('.')
		.trim()

	// Shape icons with accent color and labels
	const getShapeIcons = () => {
		// Check if this is a finance calculator
		const isFinance = calculator.category === 'finance'
		
		// Check if this is an auto calculator
		const isAuto = calculator.category === 'auto'
		
		// Check if this is a health calculator
		const isHealth = calculator.category === 'health'
		
		// Check if this is an everyday calculator
		const isEveryday = calculator.category === 'everyday'
		
		// Check if this is BMR calculator
		const isBMR = calculator.id === 'bmr-calculator' || calculator.slug === 'bmr-calculator'
		
		// Check if this is TDEE calculator
		const isTDEE = calculator.id === 'daily-calorie-needs-calculator' || calculator.slug === 'daily-calorie-needs-calculator'
		
		// Check if this is Ideal Weight calculator
		const isIdealWeight = calculator.id === 'ideal-weight-calculator' || calculator.slug === 'ideal-weight-calculator'
		
		// Check if this is Body Fat Percentage calculator
		const isBodyFat = calculator.id === 'body-fat-percentage-calculator' || calculator.slug === 'body-fat-percentage-calculator'
		
		// Check if this is Macronutrient calculator
		const isMacronutrient = calculator.id === 'macronutrient-calculator' || calculator.slug === 'macronutrient-calculator'
		
		// Check if this is Water Intake calculator
		const isWaterIntake = calculator.id === 'water-intake-calculator' || calculator.slug === 'water-intake-calculator'
		
		// Check if this is Calories Burned calculator
		const isCaloriesBurned = calculator.id === 'calories-burned-calculator' || calculator.slug === 'calories-burned-calculator'
		
		// Check if this is Heart Rate Zones calculator
		const isHeartRateZones = calculator.id === 'heart-rate-zones-calculator' || calculator.slug === 'heart-rate-zones-calculator'
		
		// Check if this is Steps to Calories calculator
		const isStepsToCalories = calculator.id === 'steps-to-calories-calculator' || calculator.slug === 'steps-to-calories-calculator'
		
		// Check if this is volume calculator
		const isVolume = calculator.id === 'volume-of-shapes' || calculator.slug === 'volume-of-shapes'
		
		// Check if this is pythagorean calculator
		const isPythagorean = calculator.id === 'pythagorean-theorem-calculator' || calculator.slug === 'pythagorean-theorem-calculator'
		
		if (isAuto) {
			// Auto calculator icons: Car, Fuel Pump, Speedometer, Wrench
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Car */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Car body */}
								<rect
									x="8"
									y="25"
									width="44"
									height="20"
									rx="3"
									ry="3"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Windows */}
								<rect
									x="15"
									y="30"
									width="12"
									height="8"
									fill="currentColor"
									opacity="0.2"
								/>
								<rect
									x="33"
									y="30"
									width="12"
									height="8"
									fill="currentColor"
									opacity="0.2"
								/>
								{/* Wheels */}
								<circle
									cx="18"
									cy="45"
									r="6"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<circle
									cx="42"
									cy="45"
									r="6"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Roof */}
								<polygon
									points="12,25 30,15 48,25"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
							</svg>
						</div>
						{/* Fuel Pump */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Pump base */}
								<rect
									x="20"
									y="35"
									width="20"
									height="15"
									rx="2"
									ry="2"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Pump nozzle */}
								<rect
									x="25"
									y="20"
									width="10"
									height="15"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Hose */}
								<path
									d="M 30 20 Q 15 10 10 5"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
								{/* Display */}
								<rect
									x="23"
									y="38"
									width="14"
									height="8"
									fill="currentColor"
									opacity="0.2"
								/>
							</svg>
						</div>
						{/* Speedometer */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Gauge circle */}
								<circle
									cx="30"
									cy="30"
									r="22"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Gauge arc */}
								<path
									d="M 10 30 A 20 20 0 0 1 50 30"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
								{/* Needle */}
								<line
									x1="30"
									y1="30"
									x2="40"
									y2="20"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
								/>
								{/* Center dot */}
								<circle
									cx="30"
									cy="30"
									r="2"
									fill="currentColor"
								/>
							</svg>
						</div>
						{/* Wrench/Tools */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Wrench */}
								<path
									d="M 35 15 L 40 10 L 45 15 L 42 18 L 48 24 L 45 27 L 38 20 L 35 23 Z"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								{/* Handle */}
								<rect
									x="25"
									y="20"
									width="12"
									height="4"
									rx="2"
									ry="2"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
							</svg>
						</div>
					</div>
					<p className="text-sm text-gray-600 font-medium">
						Car • Fuel • Speed • Maintenance
					</p>
				</div>
			)
		}
		
		if (isFinance) {
			// Finance calculator icons: Money, Chart, Card, Bank
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Money/Coin */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								<circle
									cx="30"
									cy="30"
									r="20"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<text
									x="30"
									y="35"
									fontSize="16"
									fontWeight="bold"
									fill="currentColor"
									textAnchor="middle"
								>
									$
								</text>
							</svg>
						</div>
						{/* Growth Chart */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Chart bars */}
								<rect
									x="10"
									y="40"
									width="8"
									height="15"
									fill="currentColor"
									opacity="0.7"
								/>
								<rect
									x="22"
									y="30"
									width="8"
									height="25"
									fill="currentColor"
									opacity="0.7"
								/>
								<rect
									x="34"
									y="20"
									width="8"
									height="35"
									fill="currentColor"
									opacity="0.7"
								/>
								<rect
									x="46"
									y="10"
									width="8"
									height="45"
									fill="currentColor"
									opacity="0.7"
								/>
								{/* Trend line */}
								<polyline
									points="14,45 26,35 38,25 50,15"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						{/* Credit Card */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								<rect
									x="8"
									y="18"
									width="44"
									height="28"
									rx="3"
									ry="3"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<rect
									x="12"
									y="22"
									width="36"
									height="4"
									fill="currentColor"
									opacity="0.3"
								/>
								<rect
									x="12"
									y="30"
									width="20"
									height="3"
									fill="currentColor"
									opacity="0.5"
								/>
								<rect
									x="12"
									y="36"
									width="16"
									height="3"
									fill="currentColor"
									opacity="0.5"
								/>
							</svg>
						</div>
						{/* Bank/Building */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Building base */}
								<rect
									x="15"
									y="25"
									width="30"
									height="25"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Windows */}
								<rect
									x="20"
									y="30"
									width="6"
									height="6"
									fill="currentColor"
									opacity="0.4"
								/>
								<rect
									x="30"
									y="30"
									width="6"
									height="6"
									fill="currentColor"
									opacity="0.4"
								/>
								<rect
									x="40"
									y="30"
									width="6"
									height="6"
									fill="currentColor"
									opacity="0.4"
								/>
								<rect
									x="20"
									y="38"
									width="6"
									height="6"
									fill="currentColor"
									opacity="0.4"
								/>
								<rect
									x="30"
									y="38"
									width="6"
									height="6"
									fill="currentColor"
									opacity="0.4"
								/>
								<rect
									x="40"
									y="38"
									width="6"
									height="6"
									fill="currentColor"
									opacity="0.4"
								/>
								{/* Door */}
								<rect
									x="26"
									y="40"
									width="8"
									height="10"
									fill="currentColor"
									opacity="0.6"
								/>
								{/* Roof */}
								<polygon
									points="10,25 30,10 50,25"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
							</svg>
						</div>
					</div>
					<p className="text-sm text-gray-600 font-medium">
						Money • Growth • Credit • Bank
					</p>
				</div>
			)
		}
		
		if (isPythagorean) {
			// Pythagorean calculator icon: Right triangle
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center mb-3">
						<svg
							width="90"
							height="90"
							viewBox="0 0 60 60"
							className="text-blue-600 md:w-[120px] md:h-[120px]"
						>
							{/* Right triangle with right angle indicator */}
							<polygon
								points="10,50 50,50 50,10"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							/>
							{/* Right angle square */}
							<rect
								x="45"
								y="45"
								width="5"
								height="5"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							/>
							{/* Labels */}
							<text x="30" y="35" fontSize="8" fill="currentColor" textAnchor="middle">c</text>
							<text x="20" y="55" fontSize="8" fill="currentColor" textAnchor="middle">a</text>
							<text x="55" y="30" fontSize="8" fill="currentColor" textAnchor="middle">b</text>
						</svg>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						a² + b² = c²
					</p>
				</div>
			)
		}
		
		if (isVolume) {
			// Volume calculator icons: Cube, Sphere, Cylinder, Cone
			return (
				<div className="flex flex-col items-center">
					<div className="flex items-center justify-center space-x-6 mb-3">
						{/* Cube */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								<rect
									x="10"
									y="10"
									width="40"
									height="40"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<rect
									x="15"
									y="15"
									width="40"
									height="40"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									opacity="0.5"
								/>
								<line
									x1="10"
									y1="10"
									x2="15"
									y2="15"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="50"
									y1="10"
									x2="55"
									y2="15"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="10"
									y1="50"
									x2="15"
									y2="55"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Sphere */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								<circle
									cx="30"
									cy="30"
									r="25"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<ellipse
									cx="30"
									cy="30"
									rx="25"
									ry="8"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									opacity="0.5"
								/>
							</svg>
						</div>
						{/* Cylinder */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								<ellipse
									cx="30"
									cy="15"
									rx="20"
									ry="5"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="10"
									y1="15"
									x2="10"
									y2="45"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="50"
									y1="15"
									x2="50"
									y2="45"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<ellipse
									cx="30"
									cy="45"
									rx="20"
									ry="5"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Cone */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								<ellipse
									cx="30"
									cy="45"
									rx="20"
									ry="5"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="10"
									x2="10"
									y2="45"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="10"
									x2="50"
									y2="45"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Cube • Sphere • Cylinder • Cone
					</p>
				</div>
			)
		}
		
		if (isBodyFat) {
			// Body Fat Percentage calculator icons: Body Composition, Percentage, Measurement, Analysis
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Body/Composition */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Body outline */}
								<ellipse
									cx="30"
									cy="20"
									rx="12"
									ry="8"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<rect
									x="18"
									y="28"
									width="24"
									height="20"
									rx="4"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Fat layer indicator */}
								<ellipse
									cx="30"
									cy="20"
									rx="10"
									ry="6"
									fill="currentColor"
									opacity="0.2"
								/>
							</svg>
						</div>
						{/* Percentage symbol */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								<text
									x="30"
									y="40"
									textAnchor="middle"
									fontSize="36"
									fill="currentColor"
									fontWeight="bold"
								>
									%
								</text>
							</svg>
						</div>
						{/* Measurement tape */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Tape measure */}
								<rect
									x="15"
									y="20"
									width="30"
									height="8"
									rx="2"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Measurement marks */}
								<line
									x1="20"
									y1="20"
									x2="20"
									y2="25"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="20"
									x2="30"
									y2="28"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="40"
									y1="20"
									x2="40"
									y2="25"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Analysis/Chart */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Chart bars */}
								<rect
									x="15"
									y="35"
									width="8"
									height="15"
									fill="currentColor"
									opacity="0.6"
								/>
								<rect
									x="26"
									y="25"
									width="8"
									height="25"
									fill="currentColor"
									opacity="0.6"
								/>
								<rect
									x="37"
									y="30"
									width="8"
									height="20"
									fill="currentColor"
									opacity="0.6"
								/>
								{/* Chart base */}
								<line
									x1="12"
									y1="50"
									x2="48"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Body • Percentage • Measurement • Analysis
					</p>
				</div>
			)
		}

		if (isBodyFat) {
			// Body Fat Percentage calculator icons: Body, Fat, Muscle, Composition
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Body/Person */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Head */}
								<circle
									cx="30"
									cy="15"
									r="6"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Body */}
								<line
									x1="30"
									y1="21"
									x2="30"
									y2="40"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Arms */}
								<line
									x1="30"
									y1="28"
									x2="20"
									y2="35"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="28"
									x2="40"
									y2="35"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Legs */}
								<line
									x1="30"
									y1="40"
									x2="25"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="40"
									x2="35"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Percentage/Circle */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Circle with percentage */}
								<circle
									cx="30"
									cy="30"
									r="20"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<text
									x="30"
									y="35"
									textAnchor="middle"
									fontSize="12"
									fill="currentColor"
									fontWeight="bold"
								>
									%
								</text>
							</svg>
						</div>
						{/* Fat/Storage */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Fat cells representation */}
								<circle
									cx="20"
									cy="25"
									r="4"
									fill="currentColor"
									opacity="0.6"
								/>
								<circle
									cx="30"
									cy="20"
									r="4"
									fill="currentColor"
									opacity="0.6"
								/>
								<circle
									cx="40"
									cy="25"
									r="4"
									fill="currentColor"
									opacity="0.6"
								/>
								<circle
									cx="25"
									cy="35"
									r="4"
									fill="currentColor"
									opacity="0.6"
								/>
								<circle
									cx="35"
									cy="35"
									r="4"
									fill="currentColor"
									opacity="0.6"
								/>
							</svg>
						</div>
						{/* Composition/Balance */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Pie chart representation */}
								<circle
									cx="30"
									cy="30"
									r="18"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<path
									d="M 30 30 L 30 12 A 18 18 0 0 1 48 30 Z"
									fill="currentColor"
									opacity="0.3"
								/>
								<path
									d="M 30 30 L 48 30 A 18 18 0 0 1 30 48 Z"
									fill="currentColor"
									opacity="0.6"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Body • Percentage • Fat • Composition
					</p>
				</div>
			)
		}
		
		if (isStepsToCalories) {
			// Steps to Calories calculator icons: Footsteps, Walking, Distance, Calories
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Footsteps */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Footprint */}
								<ellipse
									cx="30"
									cy="40"
									rx="12"
									ry="8"
									fill="currentColor"
									opacity="0.7"
								/>
								<ellipse
									cx="30"
									cy="25"
									rx="8"
									ry="10"
									fill="currentColor"
									opacity="0.7"
								/>
								{/* Toes */}
								<circle
									cx="25"
									cy="18"
									r="3"
									fill="currentColor"
									opacity="0.8"
								/>
								<circle
									cx="30"
									cy="16"
									r="3"
									fill="currentColor"
									opacity="0.8"
								/>
								<circle
									cx="35"
									cy="18"
									r="3"
									fill="currentColor"
									opacity="0.8"
								/>
							</svg>
						</div>
						{/* Walking person */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Head */}
								<circle
									cx="30"
									cy="15"
									r="6"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Body */}
								<line
									x1="30"
									y1="21"
									x2="30"
									y2="40"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Arms (walking motion) */}
								<line
									x1="30"
									y1="28"
									x2="20"
									y2="35"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="28"
									x2="40"
									y2="32"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Legs (walking motion) */}
								<line
									x1="30"
									y1="40"
									x2="25"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="40"
									x2="35"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Distance/Path */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Path */}
								<path
									d="M 10 30 Q 20 25, 30 30 T 50 30"
									stroke="currentColor"
									strokeWidth="2.5"
									fill="none"
									strokeLinecap="round"
								/>
								{/* Distance markers */}
								<line
									x1="15"
									y1="28"
									x2="15"
									y2="32"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="28"
									x2="30"
									y2="32"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="45"
									y1="28"
									x2="45"
									y2="32"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Calories/Fire */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Flame */}
								<path
									d="M 30 50 Q 25 45, 25 40 Q 25 35, 30 30 Q 35 25, 35 30 Q 35 35, 30 40 Q 30 45, 30 50 Z"
									fill="currentColor"
									opacity="0.8"
								/>
								<path
									d="M 30 45 Q 28 42, 28 38 Q 28 35, 30 32 Q 32 30, 32 33 Q 32 36, 30 38 Q 30 40, 30 45 Z"
									fill="currentColor"
									opacity="0.9"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Steps • Walking • Distance • Calories
					</p>
				</div>
			)
		}
		
		if (isHeartRateZones) {
			// Heart Rate Zones calculator icons: Heart, Pulse, Chart, Zones
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Heart */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-red-600 md:w-20 md:h-20"
							>
								<path
									d="M 30 20 C 25 15, 15 15, 15 25 C 15 30, 20 35, 30 45 C 40 35, 45 30, 45 25 C 45 15, 35 15, 30 20 Z"
									fill="currentColor"
									opacity="0.8"
								/>
							</svg>
						</div>
						{/* Pulse/Heartbeat */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-red-600 md:w-20 md:h-20"
							>
								<polyline
									points="5,30 15,20 25,35 35,15 45,25 55,20"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<circle
									cx="15"
									cy="20"
									r="2.5"
									fill="currentColor"
								/>
								<circle
									cx="35"
									cy="15"
									r="2.5"
									fill="currentColor"
								/>
								<circle
									cx="55"
									cy="20"
									r="2.5"
									fill="currentColor"
								/>
							</svg>
						</div>
						{/* Chart/Zones */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-red-600 md:w-20 md:h-20"
							>
								{/* Bar chart */}
								<rect
									x="10"
									y="40"
									width="8"
									height="15"
									fill="currentColor"
									opacity="0.6"
								/>
								<rect
									x="22"
									y="30"
									width="8"
									height="25"
									fill="currentColor"
									opacity="0.7"
								/>
								<rect
									x="34"
									y="20"
									width="8"
									height="35"
									fill="currentColor"
									opacity="0.8"
								/>
								<rect
									x="46"
									y="10"
									width="8"
									height="45"
									fill="currentColor"
									opacity="0.9"
								/>
							</svg>
						</div>
						{/* Target/Zones */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-red-600 md:w-20 md:h-20"
							>
								{/* Target circles */}
								<circle
									cx="30"
									cy="30"
									r="18"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<circle
									cx="30"
									cy="30"
									r="12"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<circle
									cx="30"
									cy="30"
									r="6"
									fill="currentColor"
									opacity="0.6"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Heart • Pulse • Zones • Target
					</p>
				</div>
			)
		}
		
		if (isCaloriesBurned) {
			// Calories Burned calculator icons: Running, Cycling, Activity, Fire
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Running */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-orange-600 md:w-20 md:h-20"
							>
								{/* Running figure */}
								<circle
									cx="30"
									cy="18"
									r="6"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<path
									d="M 30 24 L 25 38 M 30 24 L 35 38 M 25 38 L 22 48 M 35 38 L 38 48"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									fill="none"
								/>
								<path
									d="M 25 32 L 20 28 M 35 32 L 40 28"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						{/* Cycling */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-orange-600 md:w-20 md:h-20"
							>
								{/* Bike */}
								<circle
									cx="20"
									cy="40"
									r="8"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<circle
									cx="40"
									cy="40"
									r="8"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<line
									x1="20"
									y1="40"
									x2="40"
									y2="40"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<line
									x1="30"
									y1="20"
									x2="30"
									y2="40"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<line
									x1="20"
									y1="40"
									x2="30"
									y2="20"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Activity/Exercise */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-orange-600 md:w-20 md:h-20"
							>
								{/* Dumbbell */}
								<rect
									x="15"
									y="25"
									width="30"
									height="10"
									rx="2"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<rect
									x="10"
									y="20"
									width="8"
									height="20"
									rx="2"
									fill="currentColor"
									opacity="0.7"
								/>
								<rect
									x="42"
									y="20"
									width="8"
									height="20"
									rx="2"
									fill="currentColor"
									opacity="0.7"
								/>
							</svg>
						</div>
						{/* Fire/Energy */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-orange-600 md:w-20 md:h-20"
							>
								{/* Flame */}
								<path
									d="M 30 50 Q 25 45, 25 40 Q 25 35, 30 30 Q 35 25, 35 30 Q 35 35, 30 40 Q 30 45, 30 50 Z"
									fill="currentColor"
									opacity="0.8"
								/>
								<path
									d="M 30 45 Q 28 42, 28 38 Q 28 35, 30 32 Q 32 30, 32 33 Q 32 36, 30 38 Q 30 40, 30 45 Z"
									fill="currentColor"
									opacity="0.9"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Running • Cycling • Exercise • Energy
					</p>
				</div>
			)
		}
		
		if (isWaterIntake) {
			// Water Intake calculator icons: Water Drop, Glass, Bottle, Hydration
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Water Drop */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								<path
									d="M 30 10 Q 25 15, 25 25 Q 25 35, 30 45 Q 35 35, 35 25 Q 35 15, 30 10 Z"
									fill="currentColor"
									opacity="0.7"
								/>
								<path
									d="M 30 12 Q 26 16, 26 25 Q 26 33, 30 42 Q 34 33, 34 25 Q 34 16, 30 12 Z"
									fill="currentColor"
									opacity="0.9"
								/>
							</svg>
						</div>
						{/* Glass */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Glass outline */}
								<path
									d="M 20 15 L 20 45 L 25 50 L 35 50 L 40 45 L 40 15 Z"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Water level */}
								<rect
									x="20"
									y="30"
									width="20"
									height="15"
									fill="currentColor"
									opacity="0.3"
								/>
							</svg>
						</div>
						{/* Bottle */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Bottle body */}
								<rect
									x="22"
									y="20"
									width="16"
									height="30"
									rx="2"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Bottle neck */}
								<rect
									x="26"
									y="15"
									width="8"
									height="8"
									rx="1"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Water level */}
								<rect
									x="22"
									y="35"
									width="16"
									height="15"
									rx="1"
									fill="currentColor"
									opacity="0.3"
								/>
							</svg>
						</div>
						{/* Waves/Hydration */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Waves */}
								<path
									d="M 10 30 Q 20 25, 30 30 T 50 30"
									stroke="currentColor"
									strokeWidth="2.5"
									fill="none"
									strokeLinecap="round"
								/>
								<path
									d="M 10 40 Q 20 35, 30 40 T 50 40"
									stroke="currentColor"
									strokeWidth="2.5"
									fill="none"
									strokeLinecap="round"
								/>
								<path
									d="M 10 50 Q 20 45, 30 50 T 50 50"
									stroke="currentColor"
									strokeWidth="2.5"
									fill="none"
									strokeLinecap="round"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Water • Glass • Bottle • Hydration
					</p>
				</div>
			)
		}
		
		if (isMacronutrient) {
			// Macronutrient calculator icons: Plate, Protein, Carbs, Fat
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Plate/Food */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Plate */}
								<ellipse
									cx="30"
									cy="35"
									rx="20"
									ry="8"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Food items */}
								<circle
									cx="25"
									cy="32"
									r="3"
									fill="currentColor"
									opacity="0.6"
								/>
								<circle
									cx="35"
									cy="32"
									r="3"
									fill="currentColor"
									opacity="0.6"
								/>
								<rect
									x="28"
									y="28"
									width="4"
									height="4"
									rx="1"
									fill="currentColor"
									opacity="0.6"
								/>
							</svg>
						</div>
						{/* Protein */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Protein symbol (P) */}
								<path
									d="M 20 15 L 20 45 M 20 15 L 30 15 L 30 25 L 25 25 M 30 25 L 30 35 L 25 35 L 30 35 L 30 45"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="none"
								/>
							</svg>
						</div>
						{/* Carbs */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Carbs symbol (C) */}
								<path
									d="M 35 15 Q 25 15, 25 30 Q 25 45, 35 45"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									fill="none"
								/>
							</svg>
						</div>
						{/* Fat */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-yellow-600 md:w-20 md:h-20"
							>
								{/* Fat symbol (F) */}
								<path
									d="M 20 15 L 20 45 M 20 15 L 30 15 M 20 30 L 28 30"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Plate • Protein • Carbs • Fat
					</p>
				</div>
			)
		}
		
		if (isBodyFat) {
			// Body Fat Percentage calculator icons: Body, Measurement, Percentage, Composition
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Body/Person */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Head */}
								<circle
									cx="30"
									cy="15"
									r="6"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Body */}
								<ellipse
									cx="30"
									cy="30"
									rx="10"
									ry="12"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Arms */}
								<line
									x1="20"
									y1="28"
									x2="15"
									y2="35"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="40"
									y1="28"
									x2="45"
									y2="35"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Legs */}
								<line
									x1="30"
									y1="42"
									x2="25"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="42"
									x2="35"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Measurement Tape */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Tape */}
								<rect
									x="15"
									y="20"
									width="30"
									height="20"
									rx="2"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Measurement marks */}
								<line
									x1="20"
									y1="20"
									x2="20"
									y2="25"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="20"
									x2="30"
									y2="28"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="40"
									y1="20"
									x2="40"
									y2="25"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Percentage Symbol */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* % symbol */}
								<circle
									cx="20"
									cy="20"
									r="4"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<circle
									cx="40"
									cy="40"
									r="4"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<line
									x1="15"
									y1="45"
									x2="45"
									y2="15"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						{/* Composition/Chart */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Pie chart */}
								<circle
									cx="30"
									cy="30"
									r="18"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Segment */}
								<path
									d="M 30 30 L 30 12 A 18 18 0 0 1 42 24 Z"
									fill="currentColor"
									opacity="0.3"
								/>
								<path
									d="M 30 30 L 42 24 A 18 18 0 0 1 30 48 Z"
									fill="currentColor"
									opacity="0.6"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Body • Measurement • Percentage • Composition
					</p>
				</div>
			)
		}
		
		if (isIdealWeight) {
			// Ideal Weight calculator icons: Height, Scale, Ruler, Balance
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Height/Ruler */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Ruler */}
								<rect
									x="20"
									y="10"
									width="20"
									height="40"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Measurement marks */}
								<line
									x1="25"
									y1="10"
									x2="25"
									y2="15"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="10"
									x2="30"
									y2="20"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="35"
									y1="10"
									x2="35"
									y2="15"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Scale */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Scale base */}
								<line
									x1="15"
									y1="50"
									x2="45"
									y2="50"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
								/>
								{/* Scale center */}
								<line
									x1="30"
									y1="20"
									x2="30"
									y2="50"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Left plate */}
								<ellipse
									cx="20"
									cy="25"
									rx="8"
									ry="3"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="20"
									y1="20"
									x2="20"
									y2="25"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Right plate */}
								<ellipse
									cx="40"
									cy="25"
									rx="8"
									ry="3"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="40"
									y1="20"
									x2="40"
									y2="25"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Person/Height */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Head */}
								<circle
									cx="30"
									cy="15"
									r="6"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Body */}
								<line
									x1="30"
									y1="21"
									x2="30"
									y2="40"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Arms */}
								<line
									x1="30"
									y1="28"
									x2="20"
									y2="35"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="28"
									x2="40"
									y2="35"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Legs */}
								<line
									x1="30"
									y1="40"
									x2="25"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="40"
									x2="35"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						{/* Range/Target */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Target circle */}
								<circle
									cx="30"
									cy="30"
									r="18"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								<circle
									cx="30"
									cy="30"
									r="12"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<circle
									cx="30"
									cy="30"
									r="6"
									fill="currentColor"
									opacity="0.6"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Height • Scale • Body • Target
					</p>
				</div>
			)
		}
		
		if (isTDEE) {
			// TDEE calculator icons: Calorie Gauge, Activity, Food, Scale
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Calorie Gauge */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Gauge circle */}
								<circle
									cx="30"
									cy="30"
									r="20"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Gauge needle */}
								<line
									x1="30"
									y1="30"
									x2="30"
									y2="15"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									transform="rotate(45 30 30)"
								/>
								{/* Calorie text */}
								<text
									x="30"
									y="35"
									textAnchor="middle"
									fontSize="8"
									fill="currentColor"
									fontWeight="bold"
								>
									Cal
								</text>
							</svg>
						</div>
						{/* Activity/Exercise */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Running figure */}
								<circle
									cx="30"
									cy="20"
									r="6"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<path
									d="M 30 26 L 25 40 M 30 26 L 35 40 M 25 40 L 22 50 M 35 40 L 38 50"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									fill="none"
								/>
								<path
									d="M 25 35 L 20 30 M 35 35 L 40 30"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						{/* Food/Plate */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Plate */}
								<ellipse
									cx="30"
									cy="35"
									rx="18"
									ry="8"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Food items */}
								<circle
									cx="25"
									cy="32"
									r="3"
									fill="currentColor"
									opacity="0.6"
								/>
								<circle
									cx="35"
									cy="32"
									r="3"
									fill="currentColor"
									opacity="0.6"
								/>
								<circle
									cx="30"
									cy="28"
									r="2.5"
									fill="currentColor"
									opacity="0.6"
								/>
							</svg>
						</div>
						{/* Scale/Balance */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Scale base */}
								<line
									x1="20"
									y1="50"
									x2="40"
									y2="50"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
								/>
								{/* Scale center */}
								<line
									x1="30"
									y1="20"
									x2="30"
									y2="50"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Left plate */}
								<ellipse
									cx="20"
									cy="25"
									rx="8"
									ry="3"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="20"
									y1="20"
									x2="20"
									y2="25"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Right plate */}
								<ellipse
									cx="40"
									cy="25"
									rx="8"
									ry="3"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="40"
									y1="20"
									x2="40"
									y2="25"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Calories • Activity • Food • Balance
					</p>
				</div>
			)
		}
		
		if (isBMR) {
			// BMR calculator icons: Metabolism, Calories, Activity, Energy
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Metabolism/Energy */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Energy symbol */}
								<circle
									cx="30"
									cy="30"
									r="20"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Energy rays */}
								<path
									d="M 30 10 L 30 5 M 30 50 L 30 55 M 10 30 L 5 30 M 50 30 L 55 30 M 18 18 L 13 13 M 42 18 L 47 13 M 18 42 L 13 47 M 42 42 L 47 47"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						{/* Calories */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Flame/Calorie symbol */}
								<path
									d="M 30 15 Q 25 20, 25 30 Q 25 35, 30 40 Q 35 35, 35 30 Q 35 20, 30 15 Z"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinejoin="round"
								/>
								<path
									d="M 30 20 Q 28 25, 28 30 Q 28 32, 30 35 Q 32 32, 32 30 Q 32 25, 30 20 Z"
									fill="currentColor"
									opacity="0.3"
								/>
							</svg>
						</div>
						{/* Activity/Heartbeat */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								<polyline
									points="5,30 15,20 25,35 35,15 45,25 55,20"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<circle
									cx="15"
									cy="20"
									r="2.5"
									fill="currentColor"
								/>
								<circle
									cx="35"
									cy="15"
									r="2.5"
									fill="currentColor"
								/>
								<circle
									cx="55"
									cy="20"
									r="2.5"
									fill="currentColor"
								/>
							</svg>
						</div>
						{/* Rest/Sleep */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Moon/Rest symbol */}
								<path
									d="M 20 15 Q 15 20, 20 30 Q 25 35, 35 30 Q 40 25, 35 20 Q 30 15, 20 15 Z"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinejoin="round"
								/>
								<path
									d="M 25 20 Q 20 25, 25 28 Q 28 30, 32 28 Q 35 25, 32 22 Q 28 20, 25 20 Z"
									fill="currentColor"
									opacity="0.3"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Metabolism • Calories • Activity • Rest
					</p>
				</div>
			)
		}
		
		if (isEveryday) {
			// Everyday calculator icons: Calendar, Clock, Numbers, Home
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Calendar */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Calendar body */}
								<rect
									x="10"
									y="15"
									width="40"
									height="35"
									rx="2"
									ry="2"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Calendar header */}
								<rect
									x="10"
									y="15"
									width="40"
									height="12"
									fill="currentColor"
									opacity="0.2"
								/>
								{/* Calendar grid lines */}
								<line
									x1="20"
									y1="27"
									x2="20"
									y2="50"
									stroke="currentColor"
									strokeWidth="1.5"
									opacity="0.3"
								/>
								<line
									x1="30"
									y1="27"
									x2="30"
									y2="50"
									stroke="currentColor"
									strokeWidth="1.5"
									opacity="0.3"
								/>
								<line
									x1="40"
									y1="27"
									x2="40"
									y2="50"
									stroke="currentColor"
									strokeWidth="1.5"
									opacity="0.3"
								/>
								<line
									x1="10"
									y1="35"
									x2="50"
									y2="35"
									stroke="currentColor"
									strokeWidth="1.5"
									opacity="0.3"
								/>
								<line
									x1="10"
									y1="42"
									x2="50"
									y2="42"
									stroke="currentColor"
									strokeWidth="1.5"
									opacity="0.3"
								/>
								{/* Ring binder */}
								<circle
									cx="20"
									cy="21"
									r="2"
									fill="currentColor"
									opacity="0.5"
								/>
								<circle
									cx="40"
									cy="21"
									r="2"
									fill="currentColor"
									opacity="0.5"
								/>
							</svg>
						</div>
						{/* Clock */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Clock face */}
								<circle
									cx="30"
									cy="30"
									r="22"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Hour marks */}
								<line
									x1="30"
									y1="10"
									x2="30"
									y2="12"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="30"
									y1="48"
									x2="30"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="10"
									y1="30"
									x2="12"
									y2="30"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="48"
									y1="30"
									x2="50"
									y2="30"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{/* Hour hand */}
								<line
									x1="30"
									y1="30"
									x2="30"
									y2="20"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
								/>
								{/* Minute hand */}
								<line
									x1="30"
									y1="30"
									x2="38"
									y2="30"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
								{/* Center dot */}
								<circle
									cx="30"
									cy="30"
									r="2.5"
									fill="currentColor"
								/>
							</svg>
						</div>
						{/* Numbers/Text */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* Number 1 */}
								<path
									d="M 20 15 L 20 45"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
								/>
								{/* Number 2 */}
								<path
									d="M 30 15 Q 35 15, 35 25 Q 35 30, 30 35 Q 25 40, 25 45 L 35 45"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="none"
								/>
								{/* Number 3 */}
								<path
									d="M 40 15 Q 45 15, 45 20 Q 45 25, 40 30 Q 45 35, 45 40 Q 45 45, 40 45"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="none"
								/>
							</svg>
						</div>
						{/* Home */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-blue-600 md:w-20 md:h-20"
							>
								{/* House roof */}
								<polygon
									points="10,30 30,10 50,30"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinejoin="round"
								/>
								{/* House body */}
								<rect
									x="15"
									y="30"
									width="30"
									height="20"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								/>
								{/* Door */}
								<rect
									x="24"
									y="38"
									width="12"
									height="12"
									rx="1"
									fill="currentColor"
									opacity="0.3"
								/>
								{/* Window */}
								<rect
									x="18"
									y="33"
									width="6"
									height="6"
									fill="currentColor"
									opacity="0.3"
								/>
								<rect
									x="36"
									y="33"
									width="6"
									height="6"
									fill="currentColor"
									opacity="0.3"
								/>
								{/* Door handle */}
								<circle
									cx="33"
									cy="44"
									r="1.5"
									fill="currentColor"
								/>
							</svg>
						</div>
					</div>
					<p className="text-xs md:text-sm text-gray-600 font-medium">
						Calendar • Clock • Numbers • Home
					</p>
				</div>
			)
		}
		
		if (isHealth) {
			// Health calculator icons: Heart, Activity, Scale, Stethoscope
			return (
				<div className="flex flex-col items-center hidden md:flex">
					<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
						{/* Heart */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								<path
									d="M30 20 C25 15, 15 15, 15 25 C15 30, 30 45, 30 45 C30 45, 45 30, 45 25 C45 15, 35 15, 30 20 Z"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						{/* Activity/Heartbeat */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								<polyline
									points="5,30 15,20 25,35 35,15 45,25 55,20"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<circle
									cx="15"
									cy="20"
									r="2.5"
									fill="currentColor"
								/>
								<circle
									cx="35"
									cy="15"
									r="2.5"
									fill="currentColor"
								/>
								<circle
									cx="55"
									cy="20"
									r="2.5"
									fill="currentColor"
								/>
							</svg>
						</div>
						{/* Scale/Balance */}
						<div className="flex flex-col items-center">
							<svg
								width="60"
								height="60"
								viewBox="0 0 60 60"
								className="text-green-600 md:w-20 md:h-20"
							>
								{/* Base */}
								<line
									x1="10"
									y1="50"
									x2="50"
									y2="50"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
								/>
								{/* Center post */}
								<line
									x1="30"
									y1="50"
									x2="30"
									y2="25"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
								/>
						{/* Beam */}
						<line
							x1="15"
							y1="25"
							x2="45"
							y2="25"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
						/>
						{/* Left pan */}
						<ellipse
							cx="15"
							cy="30"
							rx="8"
							ry="3"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						/>
						<line
							x1="7"
							y1="30"
							x2="23"
							y2="30"
							stroke="currentColor"
							strokeWidth="2.5"
						/>
						{/* Right pan */}
						<ellipse
							cx="45"
							cy="30"
							rx="8"
							ry="3"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						/>
						<line
							x1="37"
							y1="30"
							x2="53"
							y2="30"
							stroke="currentColor"
							strokeWidth="2.5"
						/>
						{/* Chains */}
						<line
							x1="15"
							y1="25"
							x2="15"
							y2="30"
							stroke="currentColor"
							strokeWidth="2"
						/>
						<line
							x1="45"
							y1="25"
							x2="45"
							y2="30"
							stroke="currentColor"
							strokeWidth="2"
						/>
			</svg>
		</div>
		{/* Stethoscope */}
		<div className="flex flex-col items-center">
			<svg
				width="60"
				height="60"
				viewBox="0 0 60 60"
				className="text-green-600 md:w-20 md:h-20"
			>
				{/* Earpieces */}
				<path
					d="M 20 15 Q 15 10, 10 15 Q 5 20, 10 25"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
				/>
				<path
					d="M 40 15 Q 45 10, 50 15 Q 55 20, 50 25"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
				/>
				{/* Y-tube */}
				<path
					d="M 20 15 L 30 25 M 40 15 L 30 25"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
				/>
				{/* Main tube */}
				<line
					x1="30"
					y1="25"
					x2="30"
					y2="40"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
				/>
				{/* Chest piece */}
				<circle
					cx="30"
					cy="45"
					r="8"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
				<circle
					cx="30"
					cy="45"
					r="4"
					fill="currentColor"
					opacity="0.3"
				/>
			</svg>
		</div>
	</div>
	<p className="text-xs md:text-sm text-gray-600 font-medium">
		Heart • Activity • Scale • Health
	</p>
</div>
)
}
		
		// Area calculator icons: Circle, Square, Rectangle, Triangle
		return (
			<div className="flex flex-col items-center hidden md:flex">
				<div className="flex items-center justify-center space-x-3 md:space-x-6 mb-3">
					{/* Circle */}
					<div className="flex flex-col items-center">
						<svg
							width="60"
							height="60"
							viewBox="0 0 60 60"
							className="text-blue-600 md:w-20 md:h-20"
						>
							<circle
								cx="30"
								cy="30"
								r="25"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
					</div>
					{/* Square */}
					<div className="flex flex-col items-center">
						<svg
							width="60"
							height="60"
							viewBox="0 0 60 60"
							className="text-blue-600 md:w-20 md:h-20"
						>
							<rect
								x="10"
								y="10"
								width="40"
								height="40"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
					</div>
					{/* Rectangle */}
					<div className="flex flex-col items-center">
						<svg
							width="60"
							height="60"
							viewBox="0 0 60 60"
							className="text-blue-600 md:w-20 md:h-20"
						>
							<rect
								x="5"
								y="15"
								width="50"
								height="30"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
					</div>
					{/* Triangle */}
					<div className="flex flex-col items-center">
						<svg
							width="60"
							height="60"
							viewBox="0 0 60 60"
							className="text-blue-600 md:w-20 md:h-20"
						>
							<polygon
								points="30,10 50,50 10,50"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
					</div>
				</div>
				<p className="text-xs md:text-sm text-gray-600 font-medium">
					Circle • Square • Rectangle • Triangle
				</p>
			</div>
		)
	}

	return (
		<div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 md:p-8 lg:p-10 mb-12 border border-blue-100">
			<div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
				{/* Left: Badge, Title and Description */}
				<div className="flex-1">
					{/* Category Badge */}
					<span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-700 uppercase bg-blue-100 rounded-md">
						{getCategoryBadge(calculator.category)}
					</span>
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
						{calculator.title}
					</h1>
					<p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
						{shortDesc}
					</p>
				</div>
				{/* Right: Visual Illustration - hidden on mobile, shown on md+ */}
				<div className="flex-shrink-0 hidden md:block">
					{getShapeIcons()}
				</div>
			</div>
		</div>
	)
}

