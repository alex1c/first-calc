import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { PageContainer } from '@/components/layout/page-container'

export const metadata: Metadata = {
	title: 'Disclaimer – First-Calc',
	description: 'Understand the limitations of First-Calc calculators and learn how to use them responsibly.',
}

interface DisclaimerPageProps {
	params: { locale: Locale }
}

export default function DisclaimerPage({ params }: DisclaimerPageProps) {
	const { locale } = params
	if (!locales.includes(locale)) {
		notFound()
	}

	return (
		<PageContainer>
			<h1 className="text-4xl font-bold text-gray-900 mb-6">Disclaimer</h1>
			<div className="space-y-6 text-gray-700 leading-relaxed">
				<p>
					First-Calc calculators are educational tools. They simplify complex topics to make
					planning and self-reflection easier.
				</p>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">
						No Professional Advice
					</h2>
					<p>
						Outputs do not replace advice from qualified doctors, engineers, lawyers,
						financial advisors, or other licensed professionals. Always consult the right
						experts and review official standards before acting on any calculation.
					</p>
				</section>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">Estimation Only</h2>
					<p>
						Every calculator uses simplified formulas. External factors such as local laws,
						materials, personal health, or economic conditions can change real outcomes.
					</p>
				</section>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">No Guarantees</h2>
					<p>
						We do not guarantee accuracy, completeness, or suitability for any project. Using
						this site is at your own risk.
					</p>
				</section>
			</div>
		</PageContainer>
	)
}





