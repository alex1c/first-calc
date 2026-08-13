'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n'
import type { SearchResponse } from '@/lib/search'
import { useRouter } from 'next/navigation'
import { localePath } from '@/lib/site-url'
import { useClientT } from '@/lib/i18n/useClientT'

interface SearchModalProps {
	isOpen: boolean
	onClose: () => void
	locale: Locale
}

const GROUP_META = [
	{ key: 'calculators', labelKey: 'search.groups.calculators' },
	{ key: 'articles', labelKey: 'search.groups.articles' },
	{ key: 'standards', labelKey: 'search.groups.standards' },
] as const
const SEARCH_NAMESPACES = ['search'] as const

type GroupKey = (typeof GROUP_META)[number]['key']

interface FlatResult {
	group: GroupKey
	title: string
	description: string
	url: string
	id: string
	badge?: string
	isForeignLocale?: boolean
}

export function SearchModal({ isOpen, onClose, locale }: SearchModalProps) {
	const router = useRouter()
	const t = useClientT(locale, SEARCH_NAMESPACES)
	const inputRef = useRef<HTMLInputElement>(null)
	const dialogRef = useRef<HTMLDivElement>(null)
	const previousFocusRef = useRef<HTMLElement | null>(null)
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const [activeIndex, setActiveIndex] = useState(0)
	const resultsLocale = results?.usedLocale ?? locale

	useEffect(() => {
		if (isOpen) {
			previousFocusRef.current = document.activeElement as HTMLElement | null
			setQuery('')
			setResults(null)
			setTimeout(() => inputRef.current?.focus(), 50)
			return () => previousFocusRef.current?.focus()
		}
	}, [isOpen])

	useEffect(() => {
		if (!isOpen) return
		if (query.trim().length < 2) {
			setResults(null)
			setLoading(false)
			return
		}

		const controller = new AbortController()
		setLoading(true)
		const timeout = setTimeout(async () => {
			try {
				const response = await fetch(
					`/api/search?q=${encodeURIComponent(query)}&locale=${locale}&limit=5`,
					{ signal: controller.signal },
				)
				if (!response.ok) {
					throw new Error('Failed to search')
				}
				const data = (await response.json()) as SearchResponse
				setResults(data)
			} catch (error) {
				if ((error as Error).name !== 'AbortError') {
					console.error(error)
				}
			} finally {
				setLoading(false)
			}
		}, 200)

		return () => {
			controller.abort()
			clearTimeout(timeout)
		}
	}, [query, locale, isOpen])

	useEffect(() => {
		function handleKey(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				onClose()
			} else if (event.key === 'Tab') {
				const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
					'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
				)
				if (!focusable?.length) return
				const first = focusable[0]
				const last = focusable[focusable.length - 1]
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault()
					last.focus()
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault()
					first.focus()
				}
			}
		}

		if (isOpen) {
			const previousOverflow = document.body.style.overflow
			document.body.style.overflow = 'hidden'
			window.addEventListener('keydown', handleKey)
			return () => {
				document.body.style.overflow = previousOverflow
				window.removeEventListener('keydown', handleKey)
			}
		}
	}, [isOpen, onClose])

	const groupedResults = useMemo(() => {
		if (!results) {
			return []
		}

		return GROUP_META.map((group) => {
			const key = group.key as GroupKey
			return {
				...group,
				data: results[key],
			}
		})
	}, [results])

	const flatResults: FlatResult[] = useMemo(() => {
		if (!results) return []
		const mapGroup = (group: GroupKey) => {
			const data = results[group]
			return data.items.map((item) => ({
				group,
				id: item.id,
				title: item.title,
				description: item.description,
				url: item.url,
				badge: item.badge,
				isForeignLocale: item.isForeignLocale || results.fallbackLocaleUsed,
			}))
		}
		return [...mapGroup('calculators'), ...mapGroup('articles'), ...mapGroup('standards')]
	}, [results])

	useEffect(() => {
		setActiveIndex(0)
	}, [results])

	const handleSelect = (item: FlatResult) => {
		onClose()
		router.push(item.url)
	}

	const handleKeyNavigation = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (!flatResults.length) return

		if (event.key === 'ArrowDown') {
			event.preventDefault()
			setActiveIndex((prev) => (prev + 1) % flatResults.length)
		} else if (event.key === 'ArrowUp') {
			event.preventDefault()
			setActiveIndex((prev) =>
				prev - 1 < 0 ? flatResults.length - 1 : prev - 1,
			)
		} else if (event.key === 'Enter') {
			event.preventDefault()
			const item = flatResults[activeIndex]
			if (item) {
				handleSelect(item)
			}
		}
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 py-6 backdrop-blur-sm">
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="search-dialog-title"
				className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
			>
				<h2 id="search-dialog-title" className="sr-only">{t('search.title')}</h2>
				<div className="border-b border-slate-200 px-5 py-4">
					<div className="flex items-center gap-3">
						<svg
							className="h-5 w-5 text-slate-500"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
						>
							<circle cx="11" cy="11" r="8" strokeWidth="1.5" />
							<path d="m21 21-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
						<input
							ref={inputRef}
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							onKeyDown={handleKeyNavigation}
							placeholder={t('search.placeholder')}
							className="flex-1 border-none text-base focus:outline-none"
							aria-label={t('search.inputLabel')}
						/>
						<button
							type="button"
							onClick={onClose}
							className="rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
						>
							{t('search.close')}
						</button>
					</div>
					<p className="mt-2 text-xs text-slate-500">{t('search.keyboardHint')}</p>
				</div>
				<div className="max-h-[70vh] overflow-y-auto px-5 py-4">
					{results?.fallbackLocaleUsed && (
						<div className="mb-3 rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
							{t('search.fallback')}
						</div>
					)}

					{loading && (
						<div className="py-6 text-center text-sm text-slate-500">{t('search.loading')}</div>
					)}

					{!loading && query.trim().length >= 2 && flatResults.length === 0 && (
						<div className="py-6 text-center text-sm text-slate-500">
							{t('search.empty')}
						</div>
					)}

					{groupedResults.map((group) => {
						const data = group.data
						if (!data || data.items.length === 0) {
							return null
						}

						return (
							<div key={group.key} className="mb-6">
								<div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
									<span>
										{t(group.labelKey)} ({data.total})
									</span>
									{data.total > data.items.length && (
										<button
											type="button"
											onClick={() => {
												onClose()
												router.push(
													`${localePath(resultsLocale, '/search')}?q=${encodeURIComponent(query.trim())}`,
												)
											}}
											className="text-blue-600 hover:text-blue-700"
										>
											{t('search.viewAll')}
										</button>
									)}
								</div>
								<ul className="space-y-2">
									{data.items.map((item, index) => {
										const flattenedIndex = flatResults.findIndex(
											(flat) => flat.id === item.id,
										)
										const isActive = flattenedIndex === activeIndex
										return (
											<li key={item.id}>
												<button
													type="button"
													onMouseEnter={() => setActiveIndex(flattenedIndex)}
													onClick={() =>
														handleSelect({
															group: group.key as GroupKey,
															id: item.id,
															title: item.title,
															description: item.description,
															url: item.url,
															badge: item.badge,
															isForeignLocale:
																item.isForeignLocale ||
																results?.fallbackLocaleUsed,
														})
													}
													className={`w-full rounded-xl border px-4 py-3 text-left ${
														isActive
															? 'border-blue-200 bg-blue-50'
															: 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
													}`}
												>
													<div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
														<span>{item.title}</span>
														{item.badge && (
															<span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-xs font-medium text-slate-600">
																{item.badge}
															</span>
														)}
														{(item.isForeignLocale ||
															results?.fallbackLocaleUsed) && (
															<span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
														{t('search.contentInEnglish')}
															</span>
														)}
													</div>
													<p className="text-sm text-slate-600 line-clamp-2">
														{item.description}
													</p>
												</button>
											</li>
										)
									})}
								</ul>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
