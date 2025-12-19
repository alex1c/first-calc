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
		
		// Check if this is volume calculator
		const isVolume = calculator.id === 'volume-of-shapes' || calculator.slug === 'volume-of-shapes'
		
		// Check if this is pythagorean calculator
		const isPythagorean = calculator.id === 'pythagorean-theorem-calculator' || calculator.slug === 'pythagorean-theorem-calculator'
		
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

