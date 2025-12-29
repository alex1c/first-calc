'use client'

/**
 * Tags filter component
 * Displays clickable tag chips for filtering calculators
 */

import { useRouter, useSearchParams } from 'next/navigation'
import { useClientT } from '@/lib/i18n/useClientT'
import type { Locale } from '@/lib/i18n'

interface TagItem {
	id: string
	label: string
	count?: number
}

interface TagsFilterProps {
	locale: Locale
	tags: TagItem[]
}

/**
 * Tags filter component
 * Shows top tags as clickable chips that add/remove ?tag= query parameter
 */
export function TagsFilter({ locale, tags }: TagsFilterProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const currentTag = searchParams.get('tag')
	const basePath = locale === 'en' ? '' : `/${locale}`
	const t = useClientT(locale, ['calculators/ui'])

	const handleTagClick = (tagId: string) => {
		const params = new URLSearchParams(searchParams.toString())
		
		if (currentTag === tagId) {
			// Remove tag if already selected
			params.delete('tag')
		} else {
			// Set new tag
			params.set('tag', tagId)
		}
		
		const queryString = params.toString()
		const url = queryString 
			? `${basePath}/calculators?${queryString}`
			: `${basePath}/calculators`
		
		router.push(url)
	}

	const handleClearFilter = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete('tag')
		const queryString = params.toString()
		const url = queryString 
			? `${basePath}/calculators?${queryString}`
			: `${basePath}/calculators`
		router.push(url)
	}

	if (tags.length === 0) {
		return null
	}

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-2">
				<div>
					<h2 className="text-2xl font-semibold text-gray-900">
						{t('calculators/ui.sections.tags') || 'Tags'}
					</h2>
					<p className="text-sm text-gray-600 mt-1">
						{t('calculators/ui.sections.tagsHint') || 'Filter calculators by topic'}
					</p>
				</div>
				{currentTag && (
					<button
						onClick={handleClearFilter}
						className="text-sm text-blue-600 hover:text-blue-800 font-medium"
					>
						{t('calculators/ui.tags.clear') || 'Clear filter'}
					</button>
				)}
			</div>
			<div className="flex flex-wrap gap-2">
				{tags.map((tag) => (
					<button
						key={tag.id}
						onClick={() => handleTagClick(tag.id)}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
							currentTag === tag.id
								? 'bg-blue-600 text-white hover:bg-blue-700'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
						aria-label={`${tag.label}${tag.count ? ` (${tag.count})` : ''}`}
					>
						{tag.label}
						{tag.count !== undefined && tag.count > 0 && (
							<span className="ml-1.5 opacity-75">({tag.count})</span>
						)}
					</button>
				))}
			</div>
		</div>
	)
}

