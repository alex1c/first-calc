/**
 * Decade hub body: purpose, adjacent navigation, sample entry points.
 * Does not emit 10_000 per-number links (E2 constraint). Chunks of 50 are E3.
 */

import Link from 'next/link'
import {
	getAdjacentDecadeHubs,
	type DecadeHub,
} from '@/lib/propisyu/decades'
import { NumberBaseNav } from '@/components/propisyu/number-base-nav'
import { localePath } from '@/lib/site-url'
import type { Locale } from '@/lib/i18n'

interface DecadeHubContentProps {
	locale: Locale
	hub: DecadeHub
}

/**
 * Build up to 10 evenly spaced sample money URLs inside the decade.
 * These are discovery links only — not a full enumeration.
 */
function sampleMoneySlugs(hub: DecadeHub): string[] {
	const samples: string[] = []
	const span = hub.end - hub.start
	const steps = 9
	for (let i = 0; i <= steps; i++) {
		const value = hub.start + Math.floor((span * i) / steps)
		samples.push(`${value}-00`)
	}
	return [...new Set(samples)]
}

export function DecadeHubContent({ locale, hub }: DecadeHubContentProps) {
	const { previous, next } = getAdjacentDecadeHubs(hub.start, hub.end)
	const samples = sampleMoneySlugs(hub)
	const converterHref = localePath(locale, '/chislo-propisyu')

	return (
		<div className="space-y-10">
			<section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<p className="mb-4 text-slate-700">
					Страница диапазона <strong>{hub.slug}</strong> — часть исторической
					«Базы чисел». Здесь собрана навигация по соседним диапазонам и примеры
					сумм прописью внутри этого интервала. Полные таблицы по 50 чисел
					(исторические chunk-страницы) появятся на этапе E3.
				</p>
				<p className="text-sm text-slate-600">
					Любую сумму в диапазоне можно открыть как{' '}
					<code className="rounded bg-slate-100 px-1">
						/chislo-propisyu/N-00
					</code>{' '}
					или через{' '}
					<Link
						href={converterHref}
						className="font-medium text-blue-700 hover:underline"
					>
						основной конвертер
					</Link>
					.
				</p>
			</section>

			<nav
				className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
				aria-label="Соседние диапазоны"
			>
				{previous ? (
					<Link
						href={localePath(locale, previous.pathname)}
						className="text-sm font-medium text-blue-700 hover:underline"
					>
						← {previous.slug}
					</Link>
				) : (
					<span className="text-sm text-slate-400">Начало базы</span>
				)}
				{next ? (
					<Link
						href={localePath(locale, next.pathname)}
						className="text-sm font-medium text-blue-700 hover:underline"
					>
						{next.slug} →
					</Link>
				) : (
					<span className="text-sm text-slate-400">Конец базы</span>
				)}
			</nav>

			<section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 className="mb-3 text-lg font-semibold text-slate-900">
					Примеры сумм в диапазоне
				</h2>
				<p className="mb-4 text-sm text-slate-600">
					Неполный список (до 10 точек) для перехода к денежным страницам без
					генерации тысяч ссылок.
				</p>
				<ul className="flex flex-wrap gap-2">
					{samples.map((slug) => (
						<li key={slug}>
							<Link
								href={localePath(locale, `/chislo-propisyu/${slug}`)}
								className="inline-block rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-800 hover:border-blue-400 hover:text-blue-700"
							>
								{slug}
							</Link>
						</li>
					))}
				</ul>
			</section>

			<NumberBaseNav locale={locale} activeSlug={hub.slug} />
		</div>
	)
}
