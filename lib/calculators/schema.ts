/**
 * DSL/JSON Schema for calculator definitions
 * Allows creating calculators without modifying React components
 */

/**
 * Calculator Schema (structure only, no texts)
 * Texts are loaded from locales/{locale}/calculators/items/{slug}.json
 */
export interface CalculatorSchema {
	id: string
	category: string
	slug: string
	engine?: 'formula' | 'function' // Calculation engine type (default: 'formula')
	calculationId?: string | null // Function ID for engine='function'
	inputs: Array<{
		name: string
		type: 'number' | 'text' | 'select' | 'date'
		unit?: string
		min?: number | string
		max?: number | string
		step?: number | 'any'
		options?: Array<{ value: string; label: string }>
		defaultValue?: number | string
		optional?: boolean
		visibleIf?: {
			field: string
			value: string | number
		}
	}>
	outputs: Array<{
		name: string
	}>
	formula?: string // e.g., "value * percent / 100" (required for engine='formula')
	variables?: Record<string, string> // Variable descriptions
	defaults?: Record<string, any> // Default values for inputs
	tags?: string[] // Tags for filtering and related calculators
	relatedIds?: string[]
	standardIds?: string[]
	isEnabled?: boolean // Soft disable flag (default: true)
}

/**
 * Validate calculator schema
 */
export function validateCalculatorSchema(schema: unknown): {
	valid: boolean
	errors: string[]
} {
	const errors: string[] = []

	if (!schema || typeof schema !== 'object') {
		return { valid: false, errors: ['Schema must be an object'] }
	}

	const s = schema as Partial<CalculatorSchema>

	// Required fields
	if (!s.id || typeof s.id !== 'string') {
		errors.push('id is required and must be a string')
	}
	// locale is optional in schema (it's passed as parameter to schemaToDefinition)
	// if (s.locale && typeof s.locale !== 'string') {
	// 	errors.push('locale must be a string if provided')
	// }
	if (!s.category || typeof s.category !== 'string') {
		errors.push('category is required and must be a string')
	}
	if (!s.slug || typeof s.slug !== 'string') {
		errors.push('slug is required and must be a string')
	}
	// title and description are loaded from items files (T-серия), not required in schema
	// if (!s.title || typeof s.title !== 'string') {
	// 	errors.push('title is required and must be a string')
	// }
	// if (!s.description || typeof s.description !== 'string') {
	// 	errors.push('description is required and must be a string')
	// }

	// Inputs validation
	// Allow empty arrays for disabled calculators (isEnabled: false)
	const isDisabled = s.isEnabled === false
	if (!Array.isArray(s.inputs)) {
		errors.push('inputs must be an array')
	} else if (!isDisabled && s.inputs.length === 0) {
		errors.push('inputs is required and must be a non-empty array')
	} else if (s.inputs.length > 0) {
		s.inputs.forEach((input, index) => {
			if (!input.name || typeof input.name !== 'string') {
				errors.push(`inputs[${index}].name is required`)
			}
			// label is loaded from items files (T-серия), not required in schema
			// if (!input.label || typeof input.label !== 'string') {
			// 	errors.push(`inputs[${index}].label is required`)
			// }
			if (!['number', 'text', 'select', 'date'].includes(input.type)) {
				errors.push(`inputs[${index}].type must be "number", "text", "select", or "date"`)
			}
			if (input.type === 'select' && !input.options) {
				errors.push(`inputs[${index}].options is required for select type`)
			}
		})
	}

	// Outputs validation
	// Allow empty arrays for disabled calculators (isEnabled: false)
	if (!Array.isArray(s.outputs)) {
		errors.push('outputs must be an array')
	} else if (!isDisabled && s.outputs.length === 0) {
		errors.push('outputs is required and must be a non-empty array')
	} else if (s.outputs.length > 0) {
		s.outputs.forEach((output, index) => {
			if (!output.name || typeof output.name !== 'string') {
				errors.push(`outputs[${index}].name is required`)
			}
			// label is loaded from items files (T-серия), not required in schema
			// if (!output.label || typeof output.label !== 'string') {
			// 	errors.push(`outputs[${index}].label is required`)
			// }
		})
	}

	// Formula validation (only required for engine='formula')
	// Skip validation for disabled calculators
	if (!isDisabled) {
		const engine = s.engine || 'formula'
		if (engine === 'formula') {
			if (!s.formula || typeof s.formula !== 'string') {
				errors.push('formula is required and must be a string for engine="formula"')
			}
		} else if (engine === 'function') {
			if (!s.calculationId || typeof s.calculationId !== 'string') {
				errors.push('calculationId is required and must be a string for engine="function"')
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	}
}

/**
 * Parse formula string and execute calculation
 * Supports basic math operations: +, -, *, /, %, **, Math functions
 */
export function executeFormula(
	formula: string,
	variables: Record<string, number>,
): number {
	// Create safe evaluation context
	const context: Record<string, number> = {
		...variables,
		Math,
		PI: Math.PI,
		E: Math.E,
	}

	// Replace variable names with their values
	let expression = formula
	for (const [key, value] of Object.entries(variables)) {
		// Replace whole word matches only
		const regex = new RegExp(`\\b${key}\\b`, 'g')
		expression = expression.replace(regex, String(value))
	}

	// Evaluate safely (in production, consider using a proper expression parser)
	try {
		// eslint-disable-next-line no-eval
		const result = eval(expression)
		if (typeof result !== 'number' || !Number.isFinite(result)) {
			throw new Error('Formula result is not a valid number')
		}
		return result
	} catch (error) {
		throw new Error(
			`Formula evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
		)
	}
}

/**
 * Convert CalculatorSchema to CalculatorDefinition
 * Loads content from locales/{locale}/calculators/items/{slug}.json
 * Falls back to autogen if content not found
 */
export async function schemaToDefinition(
	schema: CalculatorSchema,
	locale: string = 'en',
): Promise<import('@/lib/calculators/types').CalculatorDefinition> {
	// Load content from items file
	const { loadCalculatorContent, getDefaultCalculatorContent } = await import(
		'@/lib/i18n/loadItemContent'
	)
	const { content, contentLocale } = await loadCalculatorContent(locale as any, schema.slug)
	const defaults = getDefaultCalculatorContent(schema.slug)

	// Use content from items file, fallback to defaults
	const title = content?.title || defaults.title || schema.slug
	const shortDescription = content?.shortDescription || defaults.shortDescription || ''
	const longDescription = content?.longDescription || content?.shortDescription || shortDescription
	const howTo = content?.howTo || defaults.howTo || []
	const examples = content?.examples || []
	const faq = content?.faq || []
	const seo = content?.seo

	// Log if using fallback
	if (!content) {
		console.warn(
			`[i18n] Calculator content not found for "${schema.slug}" (locale: ${locale}), using defaults`,
		)
	}
	const { formula, variables, engine, calculationId, ...rest } = schema
	const calcEngine = engine || 'formula'

	// Import calculation registry for function engine
	let getCalculation: ((id: string) => import('@/lib/calculations/registry').CalculationFunction | undefined) | null = null
	if (calcEngine === 'function') {
		const registry = await import('@/lib/calculations/registry')
		getCalculation = registry.getCalculation
		
		// Import calculation functions to ensure they're registered
		// This ensures that when a calculator uses engine="function",
		// the corresponding calculation function is loaded and registered
		if (calculationId === 'calculateArea') {
			await import('@/lib/calculations/area')
		}
		if (calculationId === 'calculateVolume') {
			await import('@/lib/calculations/volume')
		}
		if (calculationId === 'calculatePerimeter') {
			await import('@/lib/calculations/perimeter')
		}
		if (calculationId === 'calculatePythagorean') {
			await import('@/lib/calculations/pythagorean')
		}
		if (calculationId === 'calculatePercentageChange') {
			await import('@/lib/calculations/percentage-change')
		}
		if (calculationId === 'calculateQuadratic') {
			await import('@/lib/calculations/quadratic')
		}
		if (calculationId === 'solveEquation') {
			await import('@/lib/calculations/equation-solver')
		}
		if (calculationId === 'calculateDescriptiveStatistics') {
			await import('@/lib/calculations/descriptive-statistics')
		}
		if (calculationId === 'calculateAverage') {
			await import('@/lib/calculations/average')
		}
		if (calculationId === 'calculateStandardDeviation') {
			await import('@/lib/calculations/standard-deviation')
		}
		if (calculationId === 'calculateMortgage') {
			await import('@/lib/calculations/mortgage')
		}
		if (calculationId === 'calculateInvestment') {
			await import('@/lib/calculations/investment')
		}
		if (calculationId === 'calculateROI') {
			await import('@/lib/calculations/roi')
		}
		if (calculationId === 'calculateLoanOverpayment') {
			await import('@/lib/calculations/loan-overpayment')
		}
		if (calculationId === 'calculateAutoLoan') {
			await import('@/lib/calculations/auto-loan')
		}
		if (calculationId === 'calculatePersonalLoan') {
			await import('@/lib/calculations/personal-loan')
		}
		if (calculationId === 'calculateSavings') {
			await import('@/lib/calculations/savings')
		}
		if (calculationId === 'calculateCarCostOfOwnership') {
			await import('@/lib/calculations/car-cost-of-ownership')
		}
		if (calculationId === 'calculateMonthlyCarExpenses') {
			await import('@/lib/calculations/monthly-car-expenses')
		}
		if (calculationId === 'calculateFuelCost') {
			await import('@/lib/calculations/fuel-cost')
		}
		if (calculationId === 'calculateFuelConsumption') {
			await import('@/lib/calculations/fuel-consumption')
		}
		if (calculationId === 'calculateTripCost') {
			await import('@/lib/calculations/trip-cost')
		}
		if (calculationId === 'calculateCarDepreciation') {
			await import('@/lib/calculations/car-depreciation')
		}
		if (calculationId === 'calculateLeaseVsBuy') {
			await import('@/lib/calculations/lease-vs-buy')
		}
		if (calculationId === 'calculateCarAffordability') {
			await import('@/lib/calculations/car-affordability')
		}
		if (calculationId === 'calculateCarResaleValue') {
			await import('@/lib/calculations/car-resale-value')
		}
		if (calculationId === 'calculateCarMaintenanceCost') {
			await import('@/lib/calculations/car-maintenance-cost')
		}
		if (calculationId === 'calculateTireCost') {
			await import('@/lib/calculations/tire-cost')
		}
		if (calculationId === 'calculateBMI') {
			await import('@/lib/calculations/bmi')
		}
		if (calculationId === 'calculateBMR') {
			await import('@/lib/calculations/bmr')
		}
		if (calculationId === 'calculateDailyCalorieNeeds') {
			await import('@/lib/calculations/daily-calorie-needs')
		}
		if (calculationId === 'calculateIdealWeight') {
			await import('@/lib/calculations/ideal-weight')
		}
		if (calculationId === 'calculateBodyFatPercentage') {
			await import('@/lib/calculations/body-fat-percentage')
		}
		if (calculationId === 'calculateBodyFatPercentage') {
			await import('@/lib/calculations/body-fat-percentage')
		}
		if (calculationId === 'calculateBodyFatPercentage') {
			await import('@/lib/calculations/body-fat-percentage')
		}
		if (calculationId === 'calculateMacronutrient') {
			await import('@/lib/calculations/macronutrient')
		}
		if (calculationId === 'calculateWaterIntake') {
			await import('@/lib/calculations/water-intake')
		}
		if (calculationId === 'calculateCaloriesBurned') {
			await import('@/lib/calculations/calories-burned')
		}
		if (calculationId === 'calculateHeartRateZones') {
			await import('@/lib/calculations/heart-rate-zones')
		}
		if (calculationId === 'calculateStepsToCalories') {
			await import('@/lib/calculations/steps-to-calories')
		}
		if (calculationId === 'calculateAge') {
			await import('@/lib/calculations/age')
		}
		if (calculationId === 'calculateDaysBetweenDates') {
			await import('@/lib/calculations/days-between-dates')
		}
		if (calculationId === 'calculateNumbersToWords') {
			await import('@/lib/calculations/numbers-to-words')
		}
		if (calculationId === 'calculateRomanNumerals') {
			await import('@/lib/calculations/roman-numerals')
		}
		if (calculationId === 'calculateDateCalculator') {
			await import('@/lib/calculations/date-calculator')
		}
		if (calculationId === 'calculateCookingMeasurement') {
			await import('@/lib/calculations/cooking-measurement')
		}
		if (calculationId === 'calculateRoomArea') {
			await import('@/lib/calculations/room-area')
		}
		if (calculationId === 'calculatePaint') {
			await import('@/lib/calculations/paint')
		}
		if (calculationId === 'calculateConcreteVolume') {
			await import('@/lib/calculations/concrete-volume')
		}
		if (calculationId === 'calculateCement') {
			await import('@/lib/calculations/cement')
		}
		if (calculationId === 'calculateSand') {
			await import('@/lib/calculations/sand')
		}
		if (calculationId === 'calculateGravel') {
			await import('@/lib/calculations/gravel')
		}
		if (calculationId === 'calculateConcreteMixRatio') {
			await import('@/lib/calculations/concrete-mix-ratio')
		}
		if (calculationId === 'calculateFoundationVolume') {
			await import('@/lib/calculations/foundation-volume')
		}
		if (calculationId === 'calculateStripFoundation') {
			await import('@/lib/calculations/strip-foundation')
		}
		if (calculationId === 'calculateSlabFoundation') {
			await import('@/lib/calculations/slab-foundation')
		}
		if (calculationId === 'calculatePileFoundation') {
			await import('@/lib/calculations/pile-foundation')
		}
		if (calculationId === 'calculateWallArea') {
			await import('@/lib/calculations/wall-area')
		}
		if (calculationId === 'calculateBrick') {
			await import('@/lib/calculations/brick')
		}
		if (calculationId === 'calculatePrimer') {
			await import('@/lib/calculations/primer')
		}
		if (calculationId === 'calculatePutty') {
			await import('@/lib/calculations/putty')
		}
		if (calculationId === 'calculateTile') {
			await import('@/lib/calculations/tile')
		}
		if (calculationId === 'calculateLaminate') {
			await import('@/lib/calculations/laminate')
		}
		if (calculationId === 'calculateRebar') {
			await import('@/lib/calculations/rebar')
		}
		if (calculationId === 'calculateRebarWeight') {
			await import('@/lib/calculations/rebar-weight')
		}
		if (calculationId === 'calculateStair') {
			await import('@/lib/calculations/stair')
		}
		if (calculationId === 'calculateCableSize') {
			await import('@/lib/calculations/cable-size')
		}
		if (calculationId === 'calculateElectricalLoad') {
			await import('@/lib/calculations/electrical-load')
		}
		if (calculationId === 'calculatePipeVolume') {
			await import('@/lib/calculations/pipe-volume')
		}
		if (calculationId === 'calculateRandomNumber') {
			await import('@/lib/calculations/random-number')
		}
		// Add more imports as needed for other calculation functions
	}

	// Create calculate function based on engine type
	const calculate: import('@/lib/calculators/types').CalculatorFunction = (
		inputs,
	) => {
		if (calcEngine === 'function') {
			// Use function-based calculation
			if (!calculationId) {
				throw new Error('calculationId is required for engine="function"')
			}
			if (!getCalculation) {
				throw new Error('Calculation registry not loaded')
			}
			const calcFn = getCalculation(calculationId)
			if (!calcFn) {
				throw new Error(
					`Calculation function "${calculationId}" not found. Please ensure the calculation function is registered in lib/calculations/registry.ts`,
				)
			}
			return calcFn(inputs)
		} else {
			// Use formula-based calculation (existing logic)
			// Convert inputs to numbers (skip select/text fields)
			const numericInputs: Record<string, number> = {}
			for (const [key, value] of Object.entries(inputs)) {
				// Skip non-numeric fields (select, text)
				const inputDef = schema.inputs.find((inp) => inp.name === key)
				if (inputDef && (inputDef.type === 'select' || inputDef.type === 'text')) {
					continue // Skip select/text fields
				}
				const numValue = Number(value)
				if (isNaN(numValue)) {
					throw new Error(`Invalid number for input: ${key}`)
				}
				numericInputs[key] = numValue
			}

			// Check if formula is valid (not code or object)
			const isValidFormula = formula && 
				typeof formula === 'string' && 
				formula.trim().length > 0 &&
				!formula.includes('export') &&
				!formula.includes('type') &&
				!formula.includes('interface') &&
				!formula.includes('function') &&
				!formula.startsWith('{') &&
				!formula.includes('\r\n *')

			// Execute formula for each output
			const results: Record<string, number | string> = {}
			for (const output of schema.outputs) {
				try {
					if (isValidFormula) {
						// Use the formula
						const result = executeFormula(formula, numericInputs)
						results[output.name] = result
					} else {
						// Fallback: use first input value or 0
						const firstInputName = schema.inputs[0]?.name
						if (firstInputName && numericInputs[firstInputName] !== undefined) {
							results[output.name] = numericInputs[firstInputName]
						} else {
							results[output.name] = 0
						}
					}
				} catch (error) {
					// Fallback to first input value
					const firstInputName = schema.inputs[0]?.name
					if (firstInputName && numericInputs[firstInputName] !== undefined) {
						results[output.name] = numericInputs[firstInputName]
					} else {
						results[output.name] = 0
					}
				}
			}

			return results
		}
	}

	// Convert inputs - use labels from content if available
	const calculatorInputs: import('@/lib/calculators/types').CalculatorInput[] =
		schema.inputs.map((input, index) => {
			const contentInput = content?.inputs?.[index]
			// Preserve input type: 'select', 'text', 'date', or 'number'
			let inputType: 'select' | 'text' | 'number' | 'date'
			if (input.type === 'select') {
				inputType = 'select'
			} else if (input.type === 'text') {
				inputType = 'text'
			} else if (input.type === 'date') {
				inputType = 'date'
			} else {
				inputType = 'number'
			}
			return {
				name: input.name,
				label: contentInput?.label || input.name,
				type: inputType,
				unitLabel: contentInput?.unitLabel || input.unit,
				placeholder: contentInput?.placeholder || `Enter ${input.name}`,
				options: input.options,
				min: input.min,
				max: input.max,
				step: input.step,
				defaultValue: input.defaultValue,
				helpText: contentInput?.helpText,
				visibleIf: input.visibleIf,
				validation: {
					// Field is required only if it doesn't have a defaultValue
					// Fields with defaultValue can be omitted (will use default)
					required: input.defaultValue === undefined,
					min: input.min,
					max: input.max,
				},
			}
		})

	// Convert outputs - use labels from content if available
	const calculatorOutputs: import('@/lib/calculators/types').CalculatorOutput[] =
		schema.outputs.map((output, index) => {
			const contentOutput = content?.outputs?.[index]
			return {
				name: output.name,
				label: contentOutput?.label || output.name,
				unitLabel: contentOutput?.unitLabel,
				formatType: 'number' as const,
			}
		})

	// Convert examples from content
	const calculatorExamples: import('@/lib/calculators/types').CalculatorExample[] =
		examples.map((example, index) => ({
			id: `example-${index + 1}`,
			title: example.title || `Example ${index + 1}`,
			inputDescription: example.description || 'Calculation example',
			steps: example.steps || [],
			resultDescription: (example as any).result || example.resultDescription || '',
			// Preserve original example data for special handling (e.g., inputs, result)
			...(example as any).inputs && { inputs: (example as any).inputs },
			...(example as any).result && { result: (example as any).result },
		}))

	// Convert FAQ from content
	const calculatorFaq: import('@/lib/calculators/types').CalculatorFaqItem[] = faq

	return {
		id: schema.id,
		slug: schema.slug,
		category: schema.category as import('@/lib/calculators/types').CalculatorCategory,
		title,
		shortDescription,
		longDescription,
		locale: locale as import('@/lib/calculators/types').CalculatorLocale,
		contentLocale: contentLocale as import('@/lib/calculators/types').CalculatorLocale,
		tags: schema.tags,
		inputs: calculatorInputs,
		outputs: calculatorOutputs,
		calculate,
		howToBullets: howTo,
		examples: calculatorExamples,
		faq: calculatorFaq,
		relatedIds: schema.relatedIds,
		standardIds: schema.standardIds,
		isEnabled: schema.isEnabled !== false, // Default to true if not specified
		meta: seo
			? {
					keywords: seo.keywords,
				}
			: undefined,
	}
}

/**
 * Load calculator schema from JSON file
 * Note: This function only works on the server side (Node.js environment)
 */
export async function loadCalculatorSchema(
	filePath: string,
): Promise<CalculatorSchema> {
	// Check if we're on the server side
	if (typeof window !== 'undefined') {
		throw new Error(
			'loadCalculatorSchema can only be used on the server side',
		)
	}

	try {
		// Dynamic import to ensure this only runs on server
		const fs = await import('fs/promises')
		const path = await import('path')
		
		// Resolve path relative to project root
		const resolvedPath = path.resolve(process.cwd(), filePath)
		const content = await fs.readFile(resolvedPath, 'utf-8')
		const schema = JSON.parse(content) as CalculatorSchema

		const validation = validateCalculatorSchema(schema)
		if (!validation.valid) {
			throw new Error(`Invalid schema: ${validation.errors.join(', ')}`)
		}

		return schema
	} catch (error) {
		throw new Error(
			`Failed to load calculator schema: ${error instanceof Error ? error.message : 'Unknown error'}`,
		)
	}
}




