/**
 * PageContainer component
 * Common page container with consistent max-width, padding, and background
 * Used across /calculators, /learn, /standards, and other main pages
 */

import { ReactNode } from 'react'

interface PageContainerProps {
	children: ReactNode
	className?: string
}

/**
 * PageContainer - Standard page container
 * Provides consistent layout (max-width, padding, background) for all main pages
 */
export function PageContainer({ children, className = '' }: PageContainerProps) {
	return (
		<div className={`min-h-screen bg-gray-50 ${className}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</div>
		</div>
	)
}

