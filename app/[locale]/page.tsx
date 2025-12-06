import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/lib/i18n'

interface HomePageProps {
	params: {
		locale: Locale
	}
}

export async function generateMetadata({
	params,
}: HomePageProps): Promise<Metadata> {
	const { locale } = params

	const titles: Record<Locale, string> = {
		en: 'Calculator Portal - Free Online Calculators and Tools',
		ru: 'Портал калькуляторов - Бесплатные онлайн калькуляторы и инструменты',
		es: 'Portal de Calculadoras - Calculadoras y Herramientas Online Gratis',
		tr: 'Hesap Makinesi Portalı - Ücretsiz Çevrimiçi Hesap Makineleri ve Araçlar',
		hi: 'कैलकुलेटर पोर्टल - मुफ्त ऑनलाइन कैलकुलेटर और उपकरण',
	}

	const descriptions: Record<Locale, string> = {
		en: 'Free online calculators for math, finance, and more. Calculate percentages, loans, compound interest, and much more with our easy-to-use tools.',
		ru: 'Бесплатные онлайн калькуляторы для математики, финансов и многого другого. Рассчитывайте проценты, кредиты, сложные проценты и многое другое с помощью наших простых инструментов.',
		es: 'Calculadoras online gratuitas para matemáticas, finanzas y más. Calcula porcentajes, préstamos, interés compuesto y mucho más con nuestras herramientas fáciles de usar.',
		tr: 'Matematik, finans ve daha fazlası için ücretsiz çevrimiçi hesap makineleri. Yüzde, kredi, bileşik faiz ve daha fazlasını kullanıcı dostu araçlarımızla hesaplayın.',
		hi: 'गणित, वित्त और अधिक के लिए मुफ्त ऑनलाइन कैलकुलेटर। हमारे उपयोग में आसान उपकरणों के साथ प्रतिशत, ऋण, चक्रवृद्धि ब्याज और बहुत कुछ की गणना करें।',
	}

	return {
		title: titles[locale],
		description: descriptions[locale],
		alternates: {
			languages: {
				en: '/en',
				ru: '/ru',
				es: '/es',
				tr: '/tr',
				hi: '/hi',
			},
		},
		openGraph: {
			title: titles[locale],
			description: descriptions[locale],
			type: 'website',
			locale: locale,
		},
	}
}

export default function HomePage({ params }: HomePageProps) {
	const { locale } = params

	// Validate locale
	if (!locales.includes(locale)) {
		notFound()
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="max-w-4xl mx-auto text-center">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					Welcome to Calculator Portal
				</h1>
				<p className="text-lg text-gray-600 mb-8">
					Current locale: {locale}
				</p>
				<p className="text-gray-500">
					This is the home page of the calculator portal.
				</p>
			</div>
		</div>
	)
}


