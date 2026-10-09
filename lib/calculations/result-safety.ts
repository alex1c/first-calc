/**
 * Recursively ensure calculation payloads never contain non-finite numbers.
 * JSON.stringify turns Infinity/NaN into null, which would look like a
 * successful empty result over HTTP 200 — reject those before responding.
 */

/**
 * Walk arrays and plain objects; throw if any numeric leaf is not finite.
 */
export function assertFiniteResults(
	value: unknown,
	path: string = 'result',
): void {
	if (typeof value === 'number') {
		if (!Number.isFinite(value)) {
			throw new Error(
				`Calculation produced a non-finite number at ${path}`,
			)
		}
		return
	}

	if (Array.isArray(value)) {
		value.forEach((item, index) => {
			assertFiniteResults(item, `${path}[${index}]`)
		})
		return
	}

	if (value !== null && typeof value === 'object') {
		for (const [key, child] of Object.entries(
			value as Record<string, unknown>,
		)) {
			assertFiniteResults(child, `${path}.${key}`)
		}
	}
}
