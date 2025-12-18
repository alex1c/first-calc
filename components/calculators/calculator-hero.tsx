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
		// Check if this is volume calculator
		const isVolume = calculator.id === 'volume-of-shapes' || calculator.slug === 'volume-of-shapes'
		
		if (isVolume) {
			// Volume calculator icons: Cube, Sphere, Cylinder, Cone
			return (
				<div className="flex flex-col items-center">
					<div className="flex items-center justify-center space-x-6 mb-3">
						{/* Cube */}
						<div className="flex flex-col items-center">
							<svg
								width="80"
								height="80"
								viewBox="0 0 60 60"
								className="text-blue-600"
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
								width="80"
								height="80"
								viewBox="0 0 60 60"
								className="text-blue-600"
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
								width="80"
								height="80"
								viewBox="0 0 60 60"
								className="text-blue-600"
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
								width="80"
								height="80"
								viewBox="0 0 60 60"
								className="text-blue-600"
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
					<p className="text-sm text-gray-600 font-medium">
						Cube • Sphere • Cylinder • Cone
					</p>
				</div>
			)
		}
		
		// Area calculator icons: Circle, Square, Rectangle, Triangle
		return (
			<div className="flex flex-col items-center">
				<div className="flex items-center justify-center space-x-6 mb-3">
					{/* Circle */}
					<div className="flex flex-col items-center">
						<svg
							width="80"
							height="80"
							viewBox="0 0 60 60"
							className="text-blue-600"
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
							width="80"
							height="80"
							viewBox="0 0 60 60"
							className="text-blue-600"
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
							width="80"
							height="80"
							viewBox="0 0 60 60"
							className="text-blue-600"
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
							width="80"
							height="80"
							viewBox="0 0 60 60"
							className="text-blue-600"
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
				<p className="text-sm text-gray-600 font-medium">
					Circle • Square • Rectangle • Triangle
				</p>
			</div>
		)
	}

	return (
		<div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 md:p-10 mb-12 border border-blue-100">
			<div className="flex flex-col md:flex-row items-start md:items-center gap-8">
				{/* Left: Badge, Title and Description */}
				<div className="flex-1">
					{/* Category Badge */}
					<span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-700 uppercase bg-blue-100 rounded-md">
						{getCategoryBadge(calculator.category)}
					</span>
					<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						{calculator.title}
					</h1>
					<p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
						{shortDesc}
					</p>
				</div>
				{/* Right: Visual Illustration */}
				<div className="flex-shrink-0">
					{getShapeIcons()}
				</div>
			</div>
		</div>
	)
}

