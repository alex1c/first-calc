import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { locales, type Locale } from '@/lib/i18n'
import { PageContainer } from '@/components/layout/page-container'
import { BreadcrumbsBar } from '@/components/layout/breadcrumbs-bar'
import { getTelegramContactLink } from '@/lib/contact'

export const metadata: Metadata = {
	title: 'About First-Calc – Free Online Calculators',
	description:
		'Learn about First-Calc, how our calculators work, and how to use them responsibly.',
}

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'AboutPage',
	name: 'About First-Calc',
	description:
		'Learn about First-Calc, how our calculators work, and how to use them responsibly.',
	isPartOf: {
		'@type': 'WebSite',
		name: 'First-Calc',
		url: 'https://first-calc.com',
	},
}

interface AboutPageProps {
	params: { locale: Locale }
}

export default function AboutPage({ params }: AboutPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	const basePath = locale === 'en' ? '' : `/${locale}`
	const breadcrumbs = [
		{ label: 'Home', href: basePath || '/' },
		{ label: 'About', href: `${basePath}/about` },
	]

	const telegramLink = getTelegramContactLink()

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<BreadcrumbsBar items={breadcrumbs} />
			<PageContainer>
				<h1 className="text-4xl font-bold text-gray-900 mb-6">About First-Calc</h1>
				<div className="space-y-8 text-gray-700">
					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-3">
							What First-Calc Is
						</h2>
						<p>
							First-Calc is an online portal with free calculators and tools focused on
							estimation, planning, and self-reflection. The experience is designed to be
							lightweight, accessible on every device, and fast to use without installing
							anything.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-3">
							How Calculations Work
						</h2>
						<p>
							Every calculator runs a simplified model behind the scenes. Results are
							educational estimates and starting points for additional research—not a
							substitute for professional advice. We avoid hidden inputs, so you can see
							exactly what data goes in and what comes out.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-3">
							Standards &amp; Learn
						</h2>
						<p>
							Standards pages summarize engineering and regulatory principles in plain
							language. Learn articles explain broader concepts and provide best practices
							for estimation. Calculators implement simplified logic inspired by those
							references so you can bridge the gap between theory and quick numbers.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-3">
							Who This Site Is For
						</h2>
						<ul className="list-disc list-inside space-y-1">
							<li>Homeowners comparing renovation or DIY scenarios</li>
							<li>Students practicing math or engineering fundamentals</li>
							<li>Professionals building early estimates before deep analysis</li>
							<li>Curious users exploring how numbers behave</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-3">
							Important Disclaimer
						</h2>
						<p>
							Calculations are estimates. We do not guarantee accuracy, completeness, or
							suitability for your specific project. Always consult the relevant medical,
							financial, legal, or engineering professionals before making decisions based
							on calculator outputs.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact</h2>
						{telegramLink ? (
							<p>
								For suggestions or feedback, message us on{' '}
								<Link
									href={telegramLink}
									className="text-blue-600 hover:text-blue-700 font-semibold"
								>
									Telegram
								</Link>
								.
							</p>
						) : (
							<p>We are opening additional contact channels soon. Stay tuned!</p>
						)}
					</section>
				</div>
			</PageContainer>
		</>
	)
}

