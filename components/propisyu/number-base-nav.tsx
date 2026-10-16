/**
 * Server-rendered «База чисел» / number-base navigation — 100 historical decade hubs.
 */

import Link from 'next/link'
import { DECADE_HUBS } from '@/lib/propisyu/decades'
import { localePath } from '@/lib/site-url'
import type { Locale } from '@/lib/i18n'

interface NumberBaseNavProps {
	locale: Locale
	/** Highlight the current decade slug when rendering on a hub page. */
	activeSlug?: string
}

export function NumberBaseNav({ locale, activeSlug }: NumberBaseNavProps) {
	const isRu = locale === 'ru'

	return (
		<section
			className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
			aria-labelledby="propisyu-number-base-heading"
		>
			<h2
				id="propisyu-number-base-heading"
				className="mb-2 text-xl font-semibold text-slate-900"
			>
				{isRu ? 'База чисел' : 'Number base'}
			</h2>
			<p className="mb-6 max-w-3xl text-sm text-slate-600">
				{isRu ? (
					<>
						Историческая навигация по диапазонам по 10&nbsp;000 чисел
						(0–999&nbsp;999). Выберите диапазон, чтобы перейти к его странице.
					</>
				) : (
					<>
						Historical navigation across ranges of 10&nbsp;000 numbers
						(0–999&nbsp;999). Choose a range to open its hub page.
					</>
				)}
			</p>
			<ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{DECADE_HUBS.map((hub) => {
					const href = localePath(locale, hub.pathname)
					const isActive = activeSlug === hub.slug
					return (
						<li key={hub.slug}>
							<Link
								href={href}
								className={
									isActive
										? 'block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white'
										: 'block rounded-md border border-slate-200 px-3 py-2 text-center text-sm text-slate-800 hover:border-blue-400 hover:text-blue-700'
								}
								aria-current={isActive ? 'page' : undefined}
							>
								{hub.slug}
							</Link>
						</li>
					)
				})}
			</ul>
		</section>
	)
}
