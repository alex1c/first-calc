import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import { PageContainer } from '@/components/layout/page-container'

export const metadata: Metadata = {
	title: 'Privacy Policy – First-Calc',
	description:
		'Learn how First-Calc handles privacy, cookies, analytics, and advertising partners.',
}

interface PrivacyPageProps {
	params: { locale: Locale }
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
	const { locale } = params
	if (!locales.includes(locale)) {
		notFound()
	}

	return (
		<PageContainer>
			<h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
			<div className="space-y-6 text-gray-700 leading-relaxed">
				<p>
					First-Calc provides free calculators and tools. We respect your privacy and aim to
					collect as little personal information as possible.
				</p>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">Data Collection</h2>
					<p>
						By default, we do not ask for or store personal data. Calculator inputs remain in
						your browser. If you contact us, the information you provide is used only to reply
						to your inquiry.
					</p>
				</section>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">Analytics &amp; Cookies</h2>
					<p>
						We may use privacy-friendly analytics to understand aggregate usage. If analytics
						or cookies are enabled, they are used solely to improve reliability—not to build
						individual profiles.
					</p>
				</section>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">Advertising Partners</h2>
					<p>
						First-Calc works with advertising networks such as Google Ads and Yandex Ads. These
						providers may set their own cookies or use their own tracking in compliance with
						their policies. Please review their privacy documentation for additional details.
					</p>
				</section>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">Third-Party Links</h2>
					<p>
						Some calculators or articles may reference third-party resources. We are not
						responsible for the content or privacy practices of external sites.
					</p>
				</section>
				<section>
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">Contact</h2>
					<p>
						If you have questions about this policy, please reach out through the contact
						options listed in the footer. We respond to privacy inquiries as quickly as
						possible.
					</p>
				</section>
			</div>
		</PageContainer>
	)
}





