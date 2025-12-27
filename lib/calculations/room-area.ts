/**
 * Calculate room area
 * Inputs: shape, length, width, radius, unit
 * Outputs: area, areaFormatted, areaInAlternativeUnit, explanation, formula
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Convert square meters to square feet
 */
function squareMetersToSquareFeet(sqm: number): number {
	return sqm * 10.7639
}

/**
 * Convert square feet to square meters
 */
function squareFeetToSquareMeters(sqft: number): number {
	return sqft / 10.7639
}

/**
 * Calculate room area
 */
export const calculateRoomArea: CalculationFunction = (inputs) => {
	// Extract inputs
	const shape = String(inputs.shape || 'rectangle').toLowerCase()
	const lengthStr = String(inputs.length || '').trim()
	const widthStr = String(inputs.width || '').trim()
	const radiusStr = String(inputs.radius || '').trim()
	const sideStr = String(inputs.side || '').trim()
	const unit = String(inputs.unit || 'meters').toLowerCase()

	// Validation
	if (!shape) {
		throw new Error('Shape is required.')
	}

	let area: number
	let formula: string
	let explanation: string
	let inputsUsed: string[] = []

	if (shape === 'rectangle' || shape === 'rectangular') {
		// Rectangle: area = length × width
		if (!lengthStr || !widthStr) {
			throw new Error('Length and width are required for rectangular rooms.')
		}

		const length = parseFloat(lengthStr)
		const width = parseFloat(widthStr)

		if (isNaN(length) || isNaN(width) || !Number.isFinite(length) || !Number.isFinite(width)) {
			throw new Error('Length and width must be valid numbers.')
		}

		if (length <= 0 || width <= 0) {
			throw new Error('Length and width must be greater than 0.')
		}

		area = length * width
		formula = `Area = Length × Width = ${length} × ${width}`
		explanation = `The area of a rectangular room with length ${length} ${unit === 'meters' ? 'm' : 'ft'} and width ${width} ${unit === 'meters' ? 'm' : 'ft'} is ${area.toFixed(2)} ${unit === 'meters' ? 'm²' : 'ft²'}.`
		inputsUsed = ['length', 'width']
	} else if (shape === 'square') {
		// Square: area = side²
		const sideValue = sideStr || lengthStr || widthStr
		if (!sideValue) {
			throw new Error('Side length is required for square rooms.')
		}

		const side = parseFloat(sideValue)

		if (isNaN(side) || !Number.isFinite(side)) {
			throw new Error('Side length must be a valid number.')
		}

		if (side <= 0) {
			throw new Error('Side length must be greater than 0.')
		}

		area = side * side
		formula = `Area = Side² = ${side}²`
		explanation = `The area of a square room with side length ${side} ${unit === 'meters' ? 'm' : 'ft'} is ${area.toFixed(2)} ${unit === 'meters' ? 'm²' : 'ft²'}.`
		inputsUsed = ['side']
	} else if (shape === 'circle' || shape === 'circular') {
		// Circle: area = π × r²
		const radiusValue = radiusStr || lengthStr || widthStr
		if (!radiusValue) {
			throw new Error('Radius is required for circular rooms.')
		}

		const radius = parseFloat(radiusValue)

		if (isNaN(radius) || !Number.isFinite(radius)) {
			throw new Error('Radius must be a valid number.')
		}

		if (radius <= 0) {
			throw new Error('Radius must be greater than 0.')
		}

		area = Math.PI * radius * radius
		formula = `Area = π × r² = π × ${radius}²`
		explanation = `The area of a circular room with radius ${radius} ${unit === 'meters' ? 'm' : 'ft'} is ${area.toFixed(2)} ${unit === 'meters' ? 'm²' : 'ft²'}.`
		inputsUsed = ['radius']
	} else {
		throw new Error(`Unsupported shape: ${shape}. Supported shapes are: rectangle, square, circle.`)
	}

	// Format area
	const areaFormatted = area < 0.01 
		? area.toFixed(4) 
		: area < 1 
		? area.toFixed(3) 
		: area < 10 
		? area.toFixed(2) 
		: area.toFixed(1)

	// Convert to alternative unit
	let areaInAlternativeUnit: number
	let alternativeUnit: string
	if (unit === 'meters' || unit === 'meter' || unit === 'm') {
		areaInAlternativeUnit = squareMetersToSquareFeet(area)
		alternativeUnit = 'ft²'
	} else {
		areaInAlternativeUnit = squareFeetToSquareMeters(area)
		alternativeUnit = 'm²'
	}

	const areaInAlternativeUnitFormatted = areaInAlternativeUnit < 0.01 
		? areaInAlternativeUnit.toFixed(4) 
		: areaInAlternativeUnit < 1 
		? areaInAlternativeUnit.toFixed(3) 
		: areaInAlternativeUnit < 10 
		? areaInAlternativeUnit.toFixed(2) 
		: areaInAlternativeUnit.toFixed(1)

	return {
		area,
		areaFormatted,
		areaInAlternativeUnit,
		areaInAlternativeUnitFormatted,
		alternativeUnit,
		explanation,
		formula,
		shape,
		unit: unit === 'meters' || unit === 'meter' || unit === 'm' ? 'meters' : 'feet',
		unitSymbol: unit === 'meters' || unit === 'meter' || unit === 'm' ? 'm²' : 'ft²',
	}
}

// Register the calculation function
registerCalculation('calculateRoomArea', calculateRoomArea)


