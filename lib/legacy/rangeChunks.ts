/**
 * Helper functions for splitting large ranges into chunks
 */

export interface RangeChunk {
	start: number
	end: number
	url: string // URL without /range/ prefix (old format)
}

/**
 * Split a range into chunks of maximum size
 * @param start - Start of range
 * @param end - End of range
 * @param maxChunkSize - Maximum size of each chunk
 * @param baseUrl - Base URL path (without /range/ prefix)
 * @returns Array of chunks with URLs
 */
export function splitRangeIntoChunks(
	start: number,
	end: number,
	maxChunkSize: number,
	baseUrl: string = '',
): RangeChunk[] {
	const chunks: RangeChunk[] = []
	let currentStart = start

	while (currentStart <= end) {
		const currentEnd = Math.min(currentStart + maxChunkSize - 1, end)
		const chunkUrl = baseUrl ? `${baseUrl}/${currentStart}-${currentEnd}` : `${currentStart}-${currentEnd}`
		
		chunks.push({
			start: currentStart,
			end: currentEnd,
			url: chunkUrl.startsWith('/') ? chunkUrl : `/${chunkUrl}`,
		})

		currentStart = currentEnd + 1
	}

	return chunks
}

/**
 * Split nested ranges - only split the last segment
 * @param ranges - Array of range segments (e.g., [{start: 210000, end: 219999}, {start: 213500, end: 213549}])
 * @param maxChunkSize - Maximum size of each chunk
 * @returns Array of chunks with URLs (without /range/ prefix)
 */
export function splitNestedRangesIntoChunks(
	ranges: Array<{ start: number; end: number }>,
	maxChunkSize: number,
): RangeChunk[] {
	if (ranges.length === 0) {
		return []
	}

	// If only one range, split it normally
	if (ranges.length === 1) {
		const { start, end } = ranges[0]
		return splitRangeIntoChunks(start, end, maxChunkSize)
	}

	// For nested ranges, keep all but the last segment as base URL
	const baseRanges = ranges.slice(0, -1)
	const lastRange = ranges[ranges.length - 1]

	// Build base URL from previous ranges (without /range/ prefix)
	const baseUrlParts = baseRanges.map((r) => `${r.start}-${r.end}`)
	const baseUrl = baseUrlParts.join('/')

	// Split only the last range
	const lastChunks = splitRangeIntoChunks(
		lastRange.start,
		lastRange.end,
		maxChunkSize,
		baseUrl,
	)

	return lastChunks
}

/**
 * Find chunk index for a given number in a range
 * @param number - Number to find chunk for
 * @param start - Start of full range
 * @param end - End of full range
 * @param maxChunkSize - Maximum size of each chunk
 * @returns Chunk index (0-based) or -1 if not found
 */
export function findChunkIndex(
	number: number,
	start: number,
	end: number,
	maxChunkSize: number,
): number {
	if (number < start || number > end) {
		return -1
	}

	const chunkIndex = Math.floor((number - start) / maxChunkSize)
	return chunkIndex
}

