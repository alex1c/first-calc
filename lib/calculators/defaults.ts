/**
 * Sensible default values for calculator inputs
 * Provides fallback defaults when schema doesn't define defaultValue
 */

import type { CalculatorInput } from '@/lib/calculators/types'

/**
 * Get sensible default value for an input field
 * Only applies when input.defaultValue is undefined
 * 
 * @param input - Input field definition
 * @param calculatorId - Calculator ID for context-specific defaults
 * @returns Default value or undefined
 */
export function getSensibleDefault(
	input: CalculatorInput,
	calculatorId?: string,
): number | string | undefined {
	// If input already has defaultValue, don't override
	if (input.defaultValue !== undefined) {
		return undefined
	}

	// For select inputs: use first option value
	if (input.type === 'select' && input.options && input.options.length > 0) {
		return input.options[0].value
	}

	// For number inputs: provide defaults based on field name
	if (input.type === 'number') {
		const name = input.name.toLowerCase()

		// Finance defaults
		if (name.includes('interestrate') || name === 'interestrate') {
			return 5
		}
		
		if (name.includes('loanterm') || name === 'loanterm') {
			return 12 // months
		}
		
		if (name.includes('investmentperiod') || name === 'investmentperiod' || name === 'years') {
			return 10 // years
		}
		
		if (name.includes('initialinvestment') || name.includes('initialamount') || name.includes('initialdeposit') || name.includes('initialsavings')) {
			return 10000
		}
		
		if (name.includes('monthlycontribution') || name.includes('monthlydeposit') || name.includes('monthlypayment')) {
			return 500
		}
		
		if (name.includes('loanamount') || name.includes('principal')) {
			return 100000
		}
		
		// Auto defaults
		if (name.includes('fuelconsumption') || name === 'fuelconsumption') {
			return 8 // L/100km
		}
		
		if (name.includes('fuelprice') || name.includes('priceperunit')) {
			return 1.5
		}
		
		if (name.includes('distance') || name.includes('tripdistance')) {
			return 100
		}
		
		// Health defaults
		if (name === 'height' && !name.includes('wall') && !name.includes('room')) {
			return 170 // cm
		}
		
		if (name === 'weight' && !name.includes('bag')) {
			return 70 // kg
		}
		
		if (name === 'age') {
			return 30
		}
		
		if (name.includes('duration') || name.includes('minutes')) {
			return 30
		}

		// Waste margin defaults
		if (name.includes('wastemargin') || name === 'wastemargin') {
			// Rebar typically uses 5%, others use 10%
			if (calculatorId?.includes('rebar')) {
				return 5
			}
			return 10
		}

		// Coats defaults
		if (name.includes('coats') || name.includes('numberofcoats')) {
			if (calculatorId?.includes('paint')) {
				return 2
			}
			if (calculatorId?.includes('primer')) {
				return 1
			}
			return 1
		}

		// Coverage defaults (m² per liter)
		if (name.includes('coverage') || name.includes('paintcoverage')) {
			if (calculatorId?.includes('paint')) {
				return 10 // Standard paint coverage
			}
			// Primer coverage depends on surface condition, handled in calculation
			return 10
		}

		if (name.includes('primercoverage')) {
			// Primer coverage varies by surface condition
			// Default to smooth surface: ~12 m²/L
			return 12
		}

		// Rebar spacing (mm)
		if (name === 'spacing') {
			return 200
		}

		// Edge allowance (mm)
		if (name.includes('edgeallowance') || name === 'edgeallowance') {
			return 50
		}

		// Joint thickness (mm)
		if (name.includes('jointthickness') || name === 'jointthickness') {
			return 10
		}

		// Layer thickness (mm) - for putty
		if (name.includes('layerthickness') || name === 'layerthickness') {
			return 1
		}

		// Consumption rate (kg/m²) - for putty
		if (name.includes('consumptionrate') || name === 'consumptionrate') {
			return 1.5
		}

		// Slab thickness (m)
		if (name.includes('slabthickness') || name === 'slabthickness') {
			return 0.12 // 120mm = 0.12m
		}

		// Pipe dimensions - common defaults
		if (name.includes('pipethickness') || name === 'pipethickness') {
			return 0.15 // 150mm
		}

		// Wall dimensions - example defaults
		if (name.includes('wallheight') || name === 'wallheight') {
			return 2.5 // Standard room height
		}

		if (name.includes('wallwidth') || name === 'wallwidth') {
			return 4 // Example wall width
		}

		// Room dimensions
		if (name.includes('roomlength') || name === 'roomlength') {
			return 5
		}

		if (name.includes('roomwidth') || name === 'roomwidth') {
			return 4
		}

		// Surface area - example default
		if (name.includes('surfacearea') || name === 'surfacearea') {
			return 20 // 20 m² example
		}

		// Pipe length - example default
		if (name.includes('pipelength') || name === 'pipelength') {
			return 20 // 20 meters
		}

		// Pipe inner diameter (mm)
		if (name.includes('pipeinnerdiameter') || name === 'pipeinnerdiameter') {
			return 25 // 25mm common pipe
		}

		// Slab dimensions
		if (name.includes('slablength') || name === 'slablength') {
			return 6
		}

		if (name.includes('slabwidth') || name === 'slabwidth') {
			return 4
		}

		// Foundation dimensions
		if (name.includes('foundationlength') || name === 'foundationlength') {
			return 10
		}

		if (name.includes('foundationwidth') || name === 'foundationwidth') {
			return 0.5
		}

		if (name.includes('foundationheight') || name === 'foundationheight') {
			return 0.5
		}

		// Wall area dimensions
		if (name.includes('length') && !name.includes('pipe') && !name.includes('slab')) {
			return 5
		}

		if (name.includes('width') && !name.includes('pipe') && !name.includes('slab') && !name.includes('edge')) {
			return 4
		}

		if (name.includes('height') && !name.includes('wall')) {
			return 2.5
		}

		// Tile/laminate dimensions
		if (name.includes('tilelength') || name === 'tilelength') {
			return 0.3 // 30cm
		}

		if (name.includes('tilewidth') || name === 'tilewidth') {
			return 0.3 // 30cm
		}

		// Brick dimensions
		if (name.includes('bricklength') || name === 'bricklength') {
			return 0.2 // 20cm
		}

		if (name.includes('brickwidth') || name === 'brickwidth') {
			return 0.1 // 10cm
		}
	}

	// Date inputs - default to today or reasonable date
	if (input.type === 'date') {
		const name = input.name.toLowerCase()
		const today = new Date()
		const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD
		
		// For date of birth: default to 30 years ago
		if (name.includes('birth') || name.includes('dateofbirth')) {
			const birthDate = new Date(today)
			birthDate.setFullYear(today.getFullYear() - 30)
			return birthDate.toISOString().split('T')[0]
		}
		
		// For start date: default to today
		if (name.includes('start')) {
			return todayStr
		}
		
		// For end date: default to 30 days from today
		if (name.includes('end') || name.includes('reference') || name.includes('target')) {
			const endDate = new Date(today)
			endDate.setDate(today.getDate() + 30)
			return endDate.toISOString().split('T')[0]
		}
		
		// Default to today for any other date
		return todayStr
	}

	// No default found
	return undefined
}

