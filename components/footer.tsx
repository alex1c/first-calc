'use client'

/**
 * Site footer chrome. Locale follows pathname (same resolver as Header/Search)
 * so soft navigations onto historical Russian propisyu pages update labels.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShareButtons } from './footer/share-buttons'
import { getTelegramContactLink, hasTelegramBot } from '@/lib/contact'
import type { Locale } from '@/lib/i18n'
import { localePath } from '@/lib/site-url'
import { resolveUiLocaleFromPathname } from '@/lib/i18n/resolve-ui-locale'
import { useClientT, type Dictionary } from '@/lib/i18n/useClientT'

const calculatorHrefs = [
	{ key: 'math', href: '/calculators/math' },
	{ key: 'finance', href: '/calculators/finance' },
	{ key: 'construction', href: '/calculators/construction' },
	{ key: 'health', href: '/calculators/health' },
	{ key: 'everyday', href: '/calculators/everyday' },
	{ key: 'compatibility', href: '/calculators/compatibility' },
] as const

const knowledgeHrefs = [
	{ key: 'learn', href: '/learn' },
	{ key: 'standards', href: '/standards' },
	{ key: 'about', href: '/about' },
] as const

const legalHrefs = [
	{ href: '/privacy', key: 'privacy' },
	{ href: '/terms', key: 'terms' },
	{ href: '/disclaimer', key: 'disclaimer' },
] as const

interface FooterProps {
	/** SSR-matched UI locale for the first paint. */
	initialLocale: Locale
	/** Server-loaded footer+navigation dict for hydration parity. */
	initialDict?: Dictionary
}

export function Footer({ initialLocale, initialDict = {} }: FooterProps) {
	const pathname = usePathname()
	const locale = resolveUiLocaleFromPathname(pathname) || initialLocale
	const year = new Date().getFullYear()
	const telegramLink = getTelegramContactLink()
	const t = useClientT(
		locale,
		['footer', 'navigation'],
		locale === initialLocale ? initialDict : {},
	)
	const footerCalcLocale: Locale =
		locale === 'en' || locale === 'ru' ? locale : 'en'

	return (
		<footer className="bg-slate-950 text-slate-100 mt-16">
			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							First Calc
						</p>
						<p className="text-lg font-bold mb-3">{t('footer.tagline')}</p>
						<p className="text-sm text-slate-300 mb-5">{t('footer.blurb')}</p>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							{t('footer.sharePage')}
						</p>
						<ShareButtons locale={locale} />
					</div>
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							{t('navigation.menu.calculators')}
						</p>
						<ul className="space-y-2 text-sm">
							{calculatorHrefs.map((link) => (
								<li key={link.href}>
									<Link
										href={localePath(footerCalcLocale, link.href)}
										className="text-slate-300 hover:text-white transition-colors"
									>
										{t(`navigation.categories.${link.key}`)}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							{t('navigation.menu.learn')}
						</p>
						<ul className="space-y-2 text-sm mb-6">
							{knowledgeHrefs.map((link) => (
								<li key={link.href}>
									<Link
										href={localePath(locale, link.href)}
										className="text-slate-300 hover:text-white transition-colors"
									>
										{t(`navigation.menu.${link.key}`)}
									</Link>
								</li>
							))}
						</ul>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							{t('navigation.menu.tools')}
						</p>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href={localePath(footerCalcLocale, '/calculators')}
									className="text-slate-300 hover:text-white transition-colors"
								>
									{t('navigation.menu.calculators')}
								</Link>
							</li>
							<li>
								<Link
									href={localePath(locale, '/tools')}
									className="text-slate-300 hover:text-white transition-colors"
								>
									{t('navigation.menu.tools')}
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							{t('navigation.menu.contact')}
						</p>
						<p className="text-sm text-slate-300 mb-3">
							{t('footer.contactPrompt')}
						</p>
						{telegramLink ? (
							<Link
								href={telegramLink}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 bg-white hover:border-blue-400 hover:text-blue-700 transition-colors"
							>
								Telegram
							</Link>
						) : hasTelegramBot() ? (
							<p className="text-sm text-slate-300">
								Telegram bot configured. Direct contact link will be published
								soon.
							</p>
						) : (
							<p className="text-sm text-slate-500">{t('footer.contactSoon')}</p>
						)}
					</div>
				</div>
				<div className="mt-10 border-t border-slate-800 pt-6 flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
					<p>© {year} First Calc</p>
					<div className="flex flex-wrap gap-4">
						{legalHrefs.map((link) => (
							<Link
								key={link.href}
								href={localePath(locale, link.href)}
								className="hover:text-white transition-colors"
							>
								{t(`footer.${link.key}`)}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	)
}
