import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { locales, type Locale, loadNamespaces, createT } from '@/lib/i18n'
import { getPopularCalculators } from '@/lib/navigation/structure'
import { calculatorRegistry, articleRegistry } from '@/lib/registry/loader'
import { getStandardsByLocale } from '@/data/standards'
import { getNationalLandingList } from '@/data/national-standards'
import { getCategoryIds, getCategoryMeta } from '@/lib/navigation/categories'
import { legacyTools } from '@/lib/tools/registry'
import { getLegacyTitle } from '@/lib/legacy/content'
import { CalculatorCard } from '@/components/calculators/calculator-card'
import { SearchInput } from '@/components/home/search-input'
import { PageContainer } from '@/components/layout/page-container'

const namespaces = ['common', 'navigation', 'home'] as const

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
		en: 'Free online calculators for math, finance, construction, and more. Calculate percentages, loans, compound interest, and much more with our easy-to-use tools.',
		ru: 'Бесплатные онлайн калькуляторы для математики, финансов, строительства и многого другого. Рассчитывайте проценты, кредиты, сложные проценты и многое другое с помощью наших простых инструментов.',
		es: 'Calculadoras online gratuitas para matemáticas, finanzas y más. Calcula porcentajes, préstamos, interés compuesto y mucho más con nuestras herramientas fáciles de usar.',
		tr: 'Matematik, finans ve daha fazlası için ücretsiz çevrimiçi hesap makineleri. Yüzde, kredi, bileşik faiz ve daha fazlasını kullanıcı dostu araçlarımızla hesaplayın.',
		hi: 'गणित, वित्त और अधिक के लिए मुफ्त ऑनलाइन कैलकुलेटर। हमारे उपयोग में आसान उपकरणों के साथ प्रतिशत, ऋण, चक्रवृद्धि ब्याज और बहुत कुछ की गणना करें।',
	}

	const basePath = locale === 'en' ? '' : `/${locale}`
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://first-calc.com'

	return {
		title: titles[locale],
		description: descriptions[locale],
		alternates: {
			languages: {
				en: `${baseUrl}/`,
				ru: `${baseUrl}/ru`,
				es: `${baseUrl}/es`,
				tr: `${baseUrl}/tr`,
				hi: `${baseUrl}/hi`,
			},
			canonical: `${baseUrl}${basePath === '' ? '/' : basePath}`,
		},
		openGraph: {
			title: titles[locale],
			description: descriptions[locale],
			type: 'website',
			locale: locale,
		},
	}
}

export default async function HomePage({ params }: HomePageProps) {
	const { locale } = params

	// Validate locale
	if (!locales.includes(locale)) {
		notFound()
	}

	// Load translations
	const dict = await loadNamespaces(locale, namespaces)
	const t = createT(dict)
	const basePath = locale === 'en' ? '' : `/${locale}`

	// Check if we need to show fallback badge (ES/TR/HI use EN content)
	const showFallbackBadge = !['en', 'ru'].includes(locale)

	// Get popular calculators (6-12)
	const popularCalculators = await getPopularCalculators(locale)
	const allCalculators = await calculatorRegistry.getAll(locale)
	const additionalPopular = allCalculators
		.filter((calc) => !popularCalculators.some((p) => p.id === calc.id))
		.slice(0, Math.max(0, 12 - popularCalculators.length))
	const displayCalculators = [...popularCalculators, ...additionalPopular].slice(0, 12)

	// Get main categories (Math, Finance, Construction, Health, Everyday, Compatibility, Tools)
	const mainCategoryIds = ['math', 'finance', 'construction', 'health', 'everyday', 'compatibility'] as const
	const allCategoryIds = getCategoryIds()
	const categoryList = mainCategoryIds
		.map((id) => {
			const category = allCategoryIds.includes(id) ? getCategoryMeta(id, locale, t) : null
			if (!category) return null
			return {
				id: category.id,
				name: category.name,
				iconKey: category.iconKey,
				href: `${basePath}/calculators/${category.id}`,
			}
		})
		.filter((cat): cat is NonNullable<typeof cat> => cat !== null)
	
	// Add Tools as a separate tile
	const categories = [
		...categoryList,
		{
			id: 'tools',
			name: t('navigation.menu.tools'),
			iconKey: '🔧',
			href: `${basePath}/tools`,
		},
	]

	// Get legacy tools (3-4 featured)
	const featuredToolSlugs = ['numbers-to-words', 'roman-numerals-converter', 'percentage-of-a-number', 'add-subtract-percentage']
	const featuredTools = legacyTools
		.filter((tool) => tool.slug && featuredToolSlugs.includes(tool.slug))
		.slice(0, 4)
		.map((tool) => {
			const title = tool.slug ? getLegacyTitle(tool.slug, locale) : tool.title || 'Tool'
			const cleanTitle = title
				.replace(' - Calculator Portal', '')
				.replace(' – калькулятор', '')
				.replace(' – Calculator', '')
				.trim()
			const path = tool.path.startsWith('/') ? tool.path : `/${tool.path}`
			return {
				icon: tool.icon,
				title: cleanTitle,
				href: `${basePath}${path}`,
			}
		})

	// Get latest/featured articles (2-3)
	const allArticles = await articleRegistry.getAll(locale)
	const featuredArticles = allArticles.slice(0, 3)

	// Get featured standards (2-3)
	const standards = getStandardsByLocale(locale)
	const nationalEntries = getNationalLandingList(locale)
	const featuredStandards = [...standards.slice(0, 2), ...nationalEntries.slice(0, 1)].slice(0, 3)

	return (
		<PageContainer>
			{/* Fallback badge for ES/TR/HI */}
			{showFallbackBadge && (
				<div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm text-blue-800">
					{t('common.label.contentInEnglish')}
				</div>
			)}

			{/* Hero Section */}
			<section className="mb-16 text-center">
				<h1 className="text-5xl font-bold text-gray-900 mb-4">
					{t('home.hero.title')}
				</h1>
				<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
					{t('home.hero.subtitle')}
				</p>
				<div className="mb-6">
					<SearchInput placeholder={t('home.hero.searchPlaceholder')} />
				</div>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href={`${basePath}/calculators`}
						className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
					>
						{t('home.hero.ctaBrowse')}
					</Link>
					<Link
						href={`${basePath}/tools`}
						className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
					>
						{t('home.hero.ctaTools')}
					</Link>
				</div>
			</section>

			{/* Category Tiles */}
			<section className="mb-16">
				<h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
					{t('home.sections.categories')}
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
					{categories.map((category) => (
						<Link
							key={category.id}
							href={category.href}
							className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all text-center"
						>
							<div className="text-4xl mb-2">{category.iconKey}</div>
							<h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
						</Link>
					))}
				</div>
			</section>

			{/* Popular Calculators */}
			{displayCalculators.length > 0 && (
				<section className="mb-16">
					<h2 className="text-3xl font-semibold text-gray-900 mb-6">
						{t('home.sections.popular')}
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
						{displayCalculators.map((calc) => (
							<CalculatorCard
								key={calc.id}
								calculator={calc}
								locale={locale}
								isPopular={true}
								hasStandard={calc.standardIds && calc.standardIds.length > 0}
							/>
						))}
					</div>
				</section>
			)}

			{/* Tools / Classic Utilities */}
			{featuredTools.length > 0 && (
				<section className="mb-16">
					<h2 className="text-3xl font-semibold text-gray-900 mb-6">
						{t('home.sections.tools')}
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{featuredTools.map((tool) => (
							<Link
								key={tool.href}
								href={tool.href}
								className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
							>
								<div className="flex items-center gap-3">
									<div className="text-3xl">{tool.icon}</div>
									<h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			{/* Learn & Standards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
				{/* Learn Section */}
				{featuredArticles.length > 0 && (
					<section>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-2xl font-semibold text-gray-900">
								{t('home.sections.learn')}
							</h2>
							<Link
								href={`${basePath}/learn`}
								className="text-blue-600 hover:text-blue-800 text-sm font-medium"
							>
								{t('navigation.menu.learn')} →
							</Link>
						</div>
						<div className="space-y-3">
							{featuredArticles.map((article) => (
								<Link
									key={article.id}
									href={`${basePath}/learn/${article.slug}`}
									className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all"
								>
									<h3 className="text-lg font-semibold text-gray-900 mb-1">
										{article.title}
									</h3>
									{article.shortDescription && (
										<p className="text-sm text-gray-600 line-clamp-2">
											{article.shortDescription}
										</p>
									)}
								</Link>
							))}
						</div>
					</section>
				)}

				{/* Standards Section */}
				{featuredStandards.length > 0 && (
					<section>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-2xl font-semibold text-gray-900">
								{t('home.sections.standards')}
							</h2>
							<Link
								href={`${basePath}/standards`}
								className="text-blue-600 hover:text-blue-800 text-sm font-medium"
							>
								{t('navigation.menu.standards')} →
							</Link>
						</div>
						<div className="space-y-3">
							{featuredStandards.map((standard) => {
								if ('countryName' in standard) {
									// National standard landing
									return (
										<Link
											key={standard.id}
											href={`${basePath}/standards/national/${standard.slug}`}
											className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all"
										>
											<h3 className="text-lg font-semibold text-gray-900 mb-1">
												{standard.countryName}
											</h3>
											<p className="text-sm text-gray-600 line-clamp-2">
												{standard.intro[0]}
											</p>
										</Link>
									)
								}
								// Regular standard
								return (
									<Link
										key={standard.id}
										href={`${basePath}/standards/${standard.country}/${standard.slug}`}
										className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all"
									>
										<h3 className="text-lg font-semibold text-gray-900 mb-1">
											{standard.title}
										</h3>
										<p className="text-sm text-gray-600 line-clamp-2">
											{standard.shortDescription}
										</p>
									</Link>
								)
							})}
						</div>
					</section>
				)}
			</div>

			{/* Disclaimer */}
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
				<p className="text-sm text-gray-600">
					{t('home.disclaimer')}
				</p>
			</div>
		</PageContainer>
	)
}
