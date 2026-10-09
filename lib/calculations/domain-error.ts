/**
 * User-facing calculation domain errors become HTTP 4xx.
 * Unexpected Error remains HTTP 500 without leaking internals.
 */
export class CalculationDomainError extends Error {
	readonly statusCode = 400

	constructor(message: string) {
		super(message)
		this.name = 'CalculationDomainError'
	}
}

export function isCalculationDomainError(
	error: unknown,
): error is CalculationDomainError {
	return error instanceof CalculationDomainError
}
