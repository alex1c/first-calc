import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { PageContainer } from '@/components/layout/page-container'

export const metadata: Metadata = {
	title: 'Terms of Use – First-Calc',
	description: 'Review the terms that govern the use of First-Calc calculators and tools.',
}

interface TermsPageProps {
	params: { locale: Locale }
}

export default function TermsPage({ params }: TermsPageProps) {
	const { locale } = params
	if (!locales.includes(locale)) {
		notFound()
	}

	return (
		<PageContainer>
			<h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Use</h1>
			<div className="space-y-6 text-gray-700 leading-relaxed">
				<p>
					By using First-Calc you agree to the terms below. If you do not agree, please do not
					use the site.
				</p>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">As-Is Services</h2>
					<p>
						All calculators, articles, and tools are provided “as is”. We make no warranties
						about accuracy, completeness, or suitability for a specific purpose.
					</p>
				</section>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">User Responsibility</h2>
					<p>
						You are solely responsible for decisions made using the numbers shown on this
						site. Always verify values with professionals and official documentation before
						adopting them in real projects.
					</p>
				</section>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">No Professional Advice</h2>
					<p>
						First-Calc does not provide legal, medical, engineering, or financial services.
						Content is for educational and estimation purposes only and should not be treated
						as certified advice.
					</p>
				</section>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">Limitations of Liability</h2>
					<p>
						We are not liable for any direct or indirect damages that result from using or
						inability to use First-Calc. This includes lost data, lost profits, or other
						consequential losses.
					</p>
				</section>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">Changes</h2>
					<p>
						We may update these terms at any time. Continued use of the site after an update
						means you accept the new terms.
					</p>
				</section>
			</div>
		</PageContainer>
	)
}


