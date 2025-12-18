'use client'

/**
 * Tags filter component
 * Displays clickable tag chips for filtering calculators
 */

import { useRouter, useSearchParams } from 'next/navigation'
import { getTopTags } from '@/lib/navigation/tags'
import { useClientT } from '@/lib/i18n/useClientT'

interface TagsFilterProps {
	locale: string
}

/**
 * Tags filter component
 * Shows top tags as clickable chips that add/remove ?tag= query parameter
 */
export function TagsFilter({ locale }: TagsFilterProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const currentTag = searchParams.get('tag')
	const topTags = getTopTags(20)
	const basePath = locale === 'en' ? '' : `/${locale}`
	const t = useClientT(locale, ['calculators/ui'])

	const handleTagClick = (tag: string) => {
		const params = new URLSearchParams(searchParams.toString())
		
		if (currentTag === tag) {
			// Remove tag if already selected
			params.delete('tag')
		} else {
			// Set new tag
			params.set('tag', tag)
		}
		
		const queryString = params.toString()
		const url = queryString 
			? `${basePath}/calculators?${queryString}`
			: `${basePath}/calculators`
		
		router.push(url)
	}

	return (
		<div className="mb-8">
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">
				{t('calculators/ui.sections.tags') || 'Tags'}
			</h2>
			<div className="flex flex-wrap gap-2">
				{topTags.map((tag) => (
					<button
						key={tag}
						onClick={() => handleTagClick(tag)}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
							currentTag === tag
								? 'bg-blue-600 text-white hover:bg-blue-700'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						{tag}
					</button>
				))}
			</div>
		</div>
	)
}

