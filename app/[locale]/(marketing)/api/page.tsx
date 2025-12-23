import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'

interface ApiPageProps {
	params: {
		locale: Locale
	}
}

export default function ApiPage({ params }: ApiPageProps) {
	const { locale } = params

	if (!locales.includes(locale)) {
		notFound()
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					API
				</h1>
				<p className="text-lg text-gray-600 mb-8">
					Current locale: {locale}
				</p>
				<p className="text-gray-500">
					This page will contain API documentation.
				</p>
			</div>
		</div>
	)
}









