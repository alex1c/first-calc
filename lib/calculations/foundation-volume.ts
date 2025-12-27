/**
 * Foundation volume calculation function
 * Calculates concrete volume for common foundation types: slab, strip, pads, and piles
 */

import type { CalculationFunction } from './registry'

/**
 * Calculate foundation concrete volume based on foundation type
 * 
 * Supported foundation types:
 * - slab: rectangular slab foundation
 * - strip: continuous strip foundation
 * - pads: isolated pad footings
 * - piles: cylindrical pile foundations
 * 
 * @param inputs - Input values including foundation type, dimensions, and waste margin
 * @returns Calculated concrete volume and breakdown
 */
export function calculateFoundationVolume(
	inputs: Record<string, number | string | boolean>,
): Record<string, number | string | null | undefined> {
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const isMetric = unit === 'meters' || unit === 'm'
	
	// Get foundation type
	const foundationType = String(inputs.foundationType || 'slab').toLowerCase()
	
	let volume = 0
	let formula = ''
	let foundationName = ''
	let breakdown = ''
	
	// Convert to cubic meters if needed (for calculations)
	const convertToM3 = (value: number) => {
		return isMetric ? value : value * 0.0283168 // ft³ to m³
	}
	
	// Convert from cubic meters to display unit
	const convertFromM3 = (value: number) => {
		return isMetric ? value : value * 35.3147 // m³ to ft³
	}
	
	switch (foundationType) {
		case 'slab': {
			const length = Number(inputs.length)
			const width = Number(inputs.width)
			const thickness = Number(inputs.thickness)
			
			if (isNaN(length) || length <= 0) {
				throw new Error('Length must be a positive number')
			}
			if (isNaN(width) || width <= 0) {
				throw new Error('Width must be a positive number')
			}
			if (isNaN(thickness) || thickness <= 0) {
				throw new Error('Thickness must be a positive number')
			}
			
			volume = length * width * thickness
			const volumeM3 = convertToM3(volume)
			formula = `V = length × width × thickness = ${length} × ${width} × ${thickness} = ${volume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'}`
			foundationName = 'Slab Foundation'
			breakdown = `Slab: ${length} × ${width} × ${thickness} = ${volume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'}`
			volume = volumeM3 // Store in m³ for consistency
			break
		}
		
		case 'strip': {
			const totalStripLength = Number(inputs.totalStripLength)
			const stripWidth = Number(inputs.stripWidth)
			const stripHeight = Number(inputs.stripHeight)
			
			if (isNaN(totalStripLength) || totalStripLength <= 0) {
				throw new Error('Total strip length must be a positive number')
			}
			if (isNaN(stripWidth) || stripWidth <= 0) {
				throw new Error('Strip width must be a positive number')
			}
			if (isNaN(stripHeight) || stripHeight <= 0) {
				throw new Error('Strip height must be a positive number')
			}
			
			volume = totalStripLength * stripWidth * stripHeight
			const volumeM3 = convertToM3(volume)
			formula = `V = total length × width × height = ${totalStripLength} × ${stripWidth} × ${stripHeight} = ${volume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'}`
			foundationName = 'Strip Foundation'
			breakdown = `Strip: ${totalStripLength} × ${stripWidth} × ${stripHeight} = ${volume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'}`
			volume = volumeM3
			break
		}
		
		case 'pads': {
			const padsCount = Number(inputs.padsCount)
			const padLength = Number(inputs.padLength)
			const padWidth = Number(inputs.padWidth)
			const padHeight = Number(inputs.padHeight)
			
			if (isNaN(padsCount) || padsCount <= 0 || !Number.isInteger(padsCount)) {
				throw new Error('Number of pads must be a positive integer')
			}
			if (isNaN(padLength) || padLength <= 0) {
				throw new Error('Pad length must be a positive number')
			}
			if (isNaN(padWidth) || padWidth <= 0) {
				throw new Error('Pad width must be a positive number')
			}
			if (isNaN(padHeight) || padHeight <= 0) {
				throw new Error('Pad height must be a positive number')
			}
			
			const singlePadVolume = padLength * padWidth * padHeight
			volume = padsCount * singlePadVolume
			const volumeM3 = convertToM3(volume)
			formula = `V = count × (length × width × height) = ${padsCount} × (${padLength} × ${padWidth} × ${padHeight}) = ${volume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'}`
			foundationName = 'Isolated Pad Footings'
			breakdown = `${padsCount} pads × (${padLength} × ${padWidth} × ${padHeight}) = ${volume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'}`
			volume = volumeM3
			break
		}
		
		case 'piles': {
			const pilesCount = Number(inputs.pilesCount)
			const pileDiameter = Number(inputs.pileDiameter)
			const pileDepth = Number(inputs.pileDepth)
			
			if (isNaN(pilesCount) || pilesCount <= 0 || !Number.isInteger(pilesCount)) {
				throw new Error('Number of piles must be a positive integer')
			}
			if (isNaN(pileDiameter) || pileDiameter <= 0) {
				throw new Error('Pile diameter must be a positive number')
			}
			if (isNaN(pileDepth) || pileDepth <= 0) {
				throw new Error('Pile depth must be a positive number')
			}
			
			const radius = pileDiameter / 2
			const singlePileVolume = Math.PI * radius * radius * pileDepth
			volume = pilesCount * singlePileVolume
			const volumeM3 = convertToM3(volume)
			formula = `V = count × (π × (diameter/2)² × depth) = ${pilesCount} × (π × (${pileDiameter}/2)² × ${pileDepth}) ≈ ${volume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'}`
			foundationName = 'Cylindrical Piles'
			breakdown = `${pilesCount} piles × (π × (${pileDiameter}/2)² × ${pileDepth}) ≈ ${volume.toFixed(2)} ${isMetric ? 'm³' : 'ft³'}`
			volume = volumeM3
			break
		}
		
		default:
			throw new Error(`Unknown foundation type: ${foundationType}`)
	}
	
	// Apply waste margin if enabled
	const includeWaste = 
		inputs.includeWaste === true || 
		inputs.includeWaste === 'true' || 
		(typeof inputs.includeWaste === 'string' && inputs.includeWaste.toLowerCase() === 'true')
	const wastePercent = Number(inputs.wasteMargin) || 10
	
	let volumeWithWaste = volume
	if (includeWaste) {
		volumeWithWaste = volume * (1 + wastePercent / 100)
	}
	
	// Convert to display units
	const volumeDisplay = convertFromM3(volume)
	const volumeDisplayWithWaste = convertFromM3(volumeWithWaste)
	
	// Convert to cubic yards for imperial users
	const volumeCubicYards = !isMetric ? volumeDisplay / 27 : 0
	const volumeCubicYardsWithWaste = !isMetric ? volumeDisplayWithWaste / 27 : 0
	
	// Determine unit labels
	const volumeUnit = isMetric ? 'm³' : 'ft³'
	const volumeUnitFull = isMetric ? 'cubic meters' : 'cubic feet'
	
	// Create explanation
	let explanation = `The ${foundationName.toLowerCase()} requires ${volumeDisplay.toFixed(2)} ${volumeUnitFull} (${volume.toFixed(4)} m³) of concrete.`
	
	if (includeWaste) {
		explanation += ` With a ${wastePercent}% waste margin, you should order ${volumeDisplayWithWaste.toFixed(2)} ${volumeUnitFull} (${volumeWithWaste.toFixed(4)} m³).`
		if (!isMetric) {
			explanation += ` This is approximately ${volumeCubicYardsWithWaste.toFixed(2)} cubic yards.`
		}
	} else {
		explanation += ` Consider adding 5-10% extra for waste, spillage, and formwork variations.`
		if (!isMetric) {
			explanation += ` This is approximately ${volumeCubicYards.toFixed(2)} cubic yards.`
		}
	}
	
	// Add practical note
	explanation += `\n\nPractical Note: Always order a little extra concrete to account for formwork variations, spillage, and to ensure you have enough material. For ready-mix concrete, suppliers typically quote prices in cubic meters (metric) or cubic yards (imperial).`
	
	return {
		concreteVolume: Number(volume.toFixed(4)),
		concreteVolumeWithWaste: includeWaste ? Number(volumeWithWaste.toFixed(4)) : volume,
		concreteVolumeDisplay: Number(volumeDisplay.toFixed(2)),
		concreteVolumeDisplayWithWaste: includeWaste ? Number(volumeDisplayWithWaste.toFixed(2)) : volumeDisplay,
		concreteVolumeCubicYards: !isMetric ? Number(volumeCubicYards.toFixed(2)) : 0,
		concreteVolumeCubicYardsWithWaste: !isMetric && includeWaste ? Number(volumeCubicYardsWithWaste.toFixed(2)) : 0,
		volumeUnit,
		volumeUnitFull,
		formula,
		foundationName,
		foundationType,
		breakdown,
		unit: isMetric ? 'meters' : 'feet',
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : 0,
		explanation,
	}
}

// Register the calculation function
// This import must be at the end to ensure the function is defined first
import { registerCalculation } from './registry'

// Auto-register on module load
registerCalculation('calculateFoundationVolume', calculateFoundationVolume)


