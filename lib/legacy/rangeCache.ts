/**
 * In-memory cache for range calculations
 * Used to cache table results and chunk lists for range pages
 */

interface CacheEntry<T> {
	data: T
	timestamp: number
	ttl: number // Time to live in milliseconds
}

class RangeCache {
	private tableCache = new Map<string, CacheEntry<any[]>>()
	private chunksCache = new Map<string, CacheEntry<any[]>>()

	/**
	 * Generate cache key for table
	 */
	private getTableKey(locale: string, start: number, end: number): string {
		return `table:${locale}:${start}:${end}`
	}

	/**
	 * Generate cache key for chunks
	 */
	private getChunksKey(locale: string, start: number, end: number): string {
		return `chunks:${locale}:${start}:${end}`
	}

	/**
	 * Check if entry is still valid
	 */
	private isValid<T>(entry: CacheEntry<T> | undefined): boolean {
		if (!entry) return false
		const now = Date.now()
		return now - entry.timestamp < entry.ttl
	}

	/**
	 * Get cached table data
	 */
	getTable(locale: string, start: number, end: number): any[] | null {
		const key = this.getTableKey(locale, start, end)
		const entry = this.tableCache.get(key)
		if (this.isValid(entry)) {
			return entry!.data
		}
		// Remove expired entry
		if (entry) {
			this.tableCache.delete(key)
		}
		return null
	}

	/**
	 * Set cached table data
	 */
	setTable(locale: string, start: number, end: number, data: any[], ttl: number = 24 * 60 * 60 * 1000): void {
		const key = this.getTableKey(locale, start, end)
		this.tableCache.set(key, {
			data,
			timestamp: Date.now(),
			ttl,
		})
	}

	/**
	 * Get cached chunks list
	 */
	getChunks(locale: string, start: number, end: number): any[] | null {
		const key = this.getChunksKey(locale, start, end)
		const entry = this.chunksCache.get(key)
		if (this.isValid(entry)) {
			return entry!.data
		}
		// Remove expired entry
		if (entry) {
			this.chunksCache.delete(key)
		}
		return null
	}

	/**
	 * Set cached chunks list
	 */
	setChunks(locale: string, start: number, end: number, data: any[], ttl: number = 24 * 60 * 60 * 1000): void {
		const key = this.getChunksKey(locale, start, end)
		this.chunksCache.set(key, {
			data,
			timestamp: Date.now(),
			ttl,
		})
	}

	/**
	 * Clear all cache (useful for testing or manual cache invalidation)
	 */
	clear(): void {
		this.tableCache.clear()
		this.chunksCache.clear()
	}

	/**
	 * Get cache statistics (for debugging)
	 */
	getStats(): { tableSize: number; chunksSize: number } {
		return {
			tableSize: this.tableCache.size,
			chunksSize: this.chunksCache.size,
		}
	}
}

// Export singleton instance
export const rangeCache = new RangeCache()



