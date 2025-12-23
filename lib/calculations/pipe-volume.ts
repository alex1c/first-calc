/**
 * Pipe volume calculation function
 * Calculates volume of liquid inside pipes based on diameter and length
 */

import type { CalculationFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Convert liters to gallons
 */
function litersToGallons(liters: number): number {
	return liters / 3.78541
}

/**
 * Convert gallons to liters
 */
function gallonsToLiters(gallons: number): number {
	return gallons * 3.78541
}

/**
 * Convert cubic meters to cubic feet
 */
function cubicMetersToCubicFeet(m3: number): number {
	return m3 * 35.3147
}

/**
 * Convert cubic feet to cubic meters
 */
function cubicFeetToCubicMeters(ft3: number): number {
	return ft3 / 35.3147
}

/**
 * Calculate pipe volume
 * 
 * Takes into account:
 * - Pipe length
 * - Inner diameter
 * - Number of pipes
 * 
 * @param inputs - Input values including pipe dimensions and count
 * @returns Calculated pipe volume in various units
 */
export const calculatePipeVolume: CalculationFunction = (inputs) => {
	// Extract inputs
	const pipeLengthStr = String(inputs.pipeLength || '').trim()
	const pipeInnerDiameterStr = String(inputs.pipeInnerDiameter || '').trim()
	const pipesCount = Number(inputs.pipesCount || 1)
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'

	// Validation
	if (!pipeLengthStr || pipeLengthStr.trim() === '') {
		throw new Error('Pipe length is required.')
	}
	if (!pipeInnerDiameterStr || pipeInnerDiameterStr.trim() === '') {
		throw new Error('Pipe inner diameter is required.')
	}

	const pipeLength = parseFloat(pipeLengthStr)
	const pipeInnerDiameter = parseFloat(pipeInnerDiameterStr)

	if (isNaN(pipeLength) || !Number.isFinite(pipeLength) || pipeLength <= 0) {
		throw new Error('Pipe length must be a valid positive number.')
	}
	if (isNaN(pipeInnerDiameter) || !Number.isFinite(pipeInnerDiameter) || pipeInnerDiameter <= 0) {
		throw new Error('Pipe inner diameter must be a valid positive number.')
	}
	if (isNaN(pipesCount) || !Number.isInteger(pipesCount) || pipesCount < 1) {
		throw new Error('Number of pipes must be a positive integer.')
	}

	// Convert to meters for calculations
	let pipeLengthM = pipeLength
	let pipeDiameterM = 0

	if (isMetric) {
		// Assume diameter is in mm, convert to meters
		pipeDiameterM = pipeInnerDiameter / 1000
	} else {
		// Convert feet to meters for length
		pipeLengthM = pipeLength / 3.28084
		// Convert inches to meters for diameter (assuming input is in inches)
		pipeDiameterM = pipeInnerDiameter / 39.3701
	}

	// Calculate radius
	const radius = pipeDiameterM / 2

	// Calculate volume per pipe: V = π × r² × length
	const volumePerPipeM3 = Math.PI * radius * radius * pipeLengthM

	// Calculate total volume
	const totalVolumeM3 = volumePerPipeM3 * pipesCount

	// Convert to liters (1 m³ = 1000 liters)
	const volumePerPipeLiters = volumePerPipeM3 * 1000
	const totalVolumeLiters = totalVolumeM3 * 1000

	// Convert to gallons for imperial users
	const totalVolumeGallons = !isMetric ? litersToGallons(totalVolumeLiters) : 0
	const volumePerPipeGallons = !isMetric ? litersToGallons(volumePerPipeLiters) : 0

	// Convert to cubic feet for imperial users
	const totalVolumeCubicFeet = !isMetric ? cubicMetersToCubicFeet(totalVolumeM3) : 0
	const volumePerPipeCubicFeet = !isMetric ? cubicMetersToCubicFeet(volumePerPipeM3) : 0

	// Determine unit labels
	const lengthUnit = isMetric ? 'm' : 'ft'
	const diameterUnit = isMetric ? 'mm' : 'in'
	const volumeUnit = isMetric ? 'L' : 'gal'
	const volumeUnitFull = isMetric ? 'liters' : 'gallons'
	const volumeUnitM3 = 'm³'
	const volumeUnitFt3 = 'ft³'

	// Create formula explanation
	let formula = `Pipe Radius = Diameter / 2 = ${pipeDiameterM.toFixed(4)} / 2 = ${radius.toFixed(4)} m\n\n`
	formula += `Volume per Pipe = π × r² × Length\n`
	formula += `Volume = π × ${radius.toFixed(4)}² × ${pipeLengthM.toFixed(2)} = ${volumePerPipeM3.toFixed(4)} m³\n`
	formula += `Volume = ${volumePerPipeLiters.toFixed(2)} liters\n\n`
	
	if (pipesCount > 1) {
		formula += `Total Volume = Volume per Pipe × Number of Pipes\n`
		formula += `Total = ${volumePerPipeM3.toFixed(4)} × ${pipesCount} = ${totalVolumeM3.toFixed(4)} m³\n`
		formula += `Total = ${totalVolumeLiters.toFixed(2)} liters`
	} else {
		formula += `Total Volume = ${totalVolumeM3.toFixed(4)} m³ = ${totalVolumeLiters.toFixed(2)} liters`
	}
	
	if (!isMetric) {
		formula += `\n\nImperial Units:\n`
		formula += `Total Volume = ${totalVolumeGallons.toFixed(2)} gallons = ${totalVolumeCubicFeet.toFixed(2)} ft³`
	}

	// Create breakdown
	let breakdown = `Pipe Specifications:\n`
	breakdown += `  Length: ${pipeLength} ${lengthUnit} (${pipeLengthM.toFixed(2)} m)\n`
	breakdown += `  Inner Diameter: ${pipeInnerDiameter} ${diameterUnit} (${pipeDiameterM.toFixed(4)} m)\n`
	breakdown += `  Number of Pipes: ${pipesCount}\n\n`
	breakdown += `Volume per Pipe:\n`
	breakdown += `  ${volumePerPipeM3.toFixed(4)} m³ = ${volumePerPipeLiters.toFixed(2)} liters`
	if (!isMetric) {
		breakdown += ` = ${volumePerPipeGallons.toFixed(2)} gallons = ${volumePerPipeCubicFeet.toFixed(2)} ft³`
	}
	breakdown += `\n\nTotal Volume (${pipesCount} pipe${pipesCount > 1 ? 's' : ''}):\n`
	breakdown += `  ${totalVolumeM3.toFixed(4)} m³ = ${totalVolumeLiters.toFixed(2)} liters`
	if (!isMetric) {
		breakdown += ` = ${totalVolumeGallons.toFixed(2)} gallons = ${totalVolumeCubicFeet.toFixed(2)} ft³`
	}

	// Create explanation
	let explanation = `For ${pipesCount} pipe${pipesCount > 1 ? 's' : ''} with length ${pipeLength} ${lengthUnit} and inner diameter ${pipeInnerDiameter} ${diameterUnit}, the total volume is ${totalVolumeLiters.toFixed(2)} ${volumeUnitFull} (${totalVolumeM3.toFixed(4)} m³).`
	
	if (pipesCount > 1) {
		explanation += `\n\nEach pipe contains ${volumePerPipeLiters.toFixed(2)} ${volumeUnitFull} (${volumePerPipeM3.toFixed(4)} m³).`
	}
	
	if (!isMetric) {
		explanation += `\n\nThis equals approximately ${totalVolumeGallons.toFixed(2)} gallons or ${totalVolumeCubicFeet.toFixed(2)} cubic feet.`
	}
	
	// Add practical note
	explanation += `\n\nPractical Note: Pipe volume is important when filling or draining systems (heating, plumbing, irrigation). Knowing the volume helps estimate: filling time, amount of fluid needed, draining capacity, and system capacity. Always use inner diameter (not outer diameter) for accurate volume calculations.`

	return {
		volumePerPipe: Number(volumePerPipeM3.toFixed(4)),
		volumePerPipeLiters: Number(volumePerPipeLiters.toFixed(2)),
		volumePerPipeGallons: !isMetric ? Number(volumePerPipeGallons.toFixed(2)) : 0,
		volumePerPipeCubicFeet: !isMetric ? Number(volumePerPipeCubicFeet.toFixed(2)) : 0,
		totalVolume: Number(totalVolumeM3.toFixed(4)),
		totalVolumeLiters: Number(totalVolumeLiters.toFixed(2)),
		totalVolumeGallons: !isMetric ? Number(totalVolumeGallons.toFixed(2)) : 0,
		totalVolumeCubicFeet: !isMetric ? Number(totalVolumeCubicFeet.toFixed(2)) : 0,
		pipeLength: Number(pipeLengthM.toFixed(2)),
		pipeInnerDiameter: Number(pipeDiameterM.toFixed(4)),
		pipeInnerDiameterDisplay: Number(pipeInnerDiameter.toFixed(1)),
		pipesCount,
		radius: Number(radius.toFixed(4)),
		volumeUnit,
		volumeUnitFull,
		volumeUnitM3,
		volumeUnitFt3,
		lengthUnit,
		diameterUnit,
		formula,
		breakdown,
		unit: isMetric ? 'meters' : 'feet',
		explanation,
	}
}

// Register the calculation function
registerCalculation('calculatePipeVolume', calculatePipeVolume)


