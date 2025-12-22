/**
 * Laminate flooring calculation function
 * Calculates number of laminate planks needed for flooring
 */

import type { CalculationFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Calculate laminate flooring needed
 * 
 * Takes into account:
 * - Room dimensions
 * - Laminate plank size
 * - Layout type (affects waste margin)
 * - Waste margin
 * 
 * @param inputs - Input values including room dimensions, plank size, layout, and waste margin
 * @returns Calculated laminate quantities and breakdown
 */
export const calculateLaminate: CalculationFunction = (inputs) => {
	// Extract inputs
	const roomLengthStr = String(inputs.roomLength || '').trim()
	const roomWidthStr = String(inputs.roomWidth || '').trim()
	const plankLengthStr = String(inputs.plankLength || '').trim()
	const plankWidthStr = String(inputs.plankWidth || '').trim()
	const layoutType = String(inputs.layoutType || 'straight').toLowerCase()
	const unit = String(inputs.unit || 'meters').toLowerCase()
	const includeWaste = 
		inputs.includeWaste === true || 
		inputs.includeWaste === 'true' || 
		String(inputs.includeWaste).toLowerCase() === 'true'
	
	// Determine default waste margin based on layout
	let defaultWasteMargin = 10
	if (layoutType === 'diagonal') {
		defaultWasteMargin = 15
	}
	
	const wastePercent = Number(inputs.wasteMargin) || defaultWasteMargin

	// Validation
	if (!roomLengthStr || roomLengthStr.trim() === '') {
		throw new Error('Room length is required.')
	}
	if (!roomWidthStr || roomWidthStr.trim() === '') {
		throw new Error('Room width is required.')
	}
	if (!plankLengthStr || plankLengthStr.trim() === '') {
		throw new Error('Plank length is required.')
	}
	if (!plankWidthStr || plankWidthStr.trim() === '') {
		throw new Error('Plank width is required.')
	}

	const roomLength = parseFloat(roomLengthStr)
	const roomWidth = parseFloat(roomWidthStr)
	const plankLength = parseFloat(plankLengthStr)
	const plankWidth = parseFloat(plankWidthStr)

	if (isNaN(roomLength) || !Number.isFinite(roomLength) || roomLength <= 0) {
		throw new Error('Room length must be a valid positive number.')
	}
	if (isNaN(roomWidth) || !Number.isFinite(roomWidth) || roomWidth <= 0) {
		throw new Error('Room width must be a valid positive number.')
	}
	if (isNaN(plankLength) || !Number.isFinite(plankLength) || plankLength <= 0) {
		throw new Error('Plank length must be a valid positive number.')
	}
	if (isNaN(plankWidth) || !Number.isFinite(plankWidth) || plankWidth <= 0) {
		throw new Error('Plank width must be a valid positive number.')
	}

	// Calculate room area
	const roomArea = roomLength * roomWidth
	
	// Calculate plank area
	const plankArea = plankLength * plankWidth
	
	// Calculate base number of planks needed
	const basePlanks = roomArea / plankArea
	
	// Apply waste margin if enabled
	let totalPlanks = basePlanks
	if (includeWaste) {
		totalPlanks = basePlanks * (1 + wastePercent / 100)
	}
	
	// Round up to whole planks (you can't buy partial planks)
	const totalPlanksRounded = Math.ceil(totalPlanks)
	const basePlanksRounded = Math.ceil(basePlanks)

	// Determine unit labels
	const areaUnit = unit === 'meters' || unit === 'meter' || unit === 'm' ? 'm²' : 'ft²'
	const areaUnitFull = unit === 'meters' || unit === 'meter' || unit === 'm' ? 'square meters' : 'square feet'
	const lengthUnit = unit === 'meters' || unit === 'meter' || unit === 'm' ? 'm' : 'ft'
	const layoutTypeName = layoutType === 'diagonal' ? 'Diagonal' : 'Straight'

	// Create formula explanation
	let formula = `Room Area = Length × Width = ${roomLength} × ${roomWidth} = ${roomArea.toFixed(2)} ${areaUnit}\n\n`
	formula += `Plank Area = Plank Length × Plank Width = ${plankLength} × ${plankWidth} = ${plankArea.toFixed(4)} ${areaUnit}\n\n`
	formula += `Base Planks = Room Area / Plank Area = ${roomArea.toFixed(2)} / ${plankArea.toFixed(4)} = ${basePlanks.toFixed(2)} planks`
	
	if (includeWaste) {
		formula += `\n\nWith ${wastePercent}% waste margin (${layoutTypeName} layout): ${totalPlanks.toFixed(2)} planks → ${totalPlanksRounded} planks (rounded up)`
	} else {
		formula += ` → ${basePlanksRounded} planks (rounded up)`
	}

	// Create breakdown
	let breakdown = `Room Dimensions: ${roomLength} × ${roomWidth} ${lengthUnit}\n`
	breakdown += `Room Area: ${roomArea.toFixed(2)} ${areaUnit}\n\n`
	breakdown += `Plank Size: ${plankLength} × ${plankWidth} ${lengthUnit}\n`
	breakdown += `Plank Area: ${plankArea.toFixed(4)} ${areaUnit}\n`
	breakdown += `Layout: ${layoutTypeName}\n\n`
	breakdown += `Base Planks: ${basePlanksRounded} planks`
	
	if (includeWaste) {
		breakdown += `\nWith ${wastePercent}% waste margin: ${totalPlanksRounded} planks`
	}

	// Create explanation
	let explanation = `For a room measuring ${roomLength} × ${roomWidth} ${lengthUnit} (${roomArea.toFixed(2)} ${areaUnitFull}), using laminate planks of size ${plankLength} × ${plankWidth} ${lengthUnit} (${plankArea.toFixed(4)} ${areaUnit} each), you need approximately ${basePlanksRounded} planks.`
	
	if (includeWaste) {
		explanation += `\n\nWith a ${wastePercent}% waste margin for ${layoutTypeName.toLowerCase()} layout, you should order ${totalPlanksRounded} planks to account for cutting, breakage, and pattern matching.`
	} else {
		explanation += `\n\nConsider adding ${defaultWasteMargin}% extra (${layoutTypeName === 'Diagonal' ? '15%' : '10%'} for ${layoutTypeName.toLowerCase()} layout) for waste, cutting, and breakage.`
	}
	
	// Add practical note
	explanation += `\n\nPractical Note: Always buy laminate from the same batch to avoid color differences. Laminate from different batches may have slight color variations. Keep extra planks for future repairs or replacements. Check laminate packaging for planks per pack to determine number of packs needed.`

	return {
		roomArea: Number(roomArea.toFixed(2)),
		plankArea: Number(plankArea.toFixed(4)),
		basePlanks: Number(basePlanks.toFixed(2)),
		basePlanksRounded,
		totalPlanks: includeWaste ? totalPlanksRounded : basePlanksRounded,
		totalPlanksExact: Number(totalPlanks.toFixed(2)),
		roomLength,
		roomWidth,
		plankLength,
		plankWidth,
		layoutType: layoutTypeName,
		areaUnit,
		areaUnitFull,
		lengthUnit,
		formula,
		breakdown,
		unit: unit === 'meters' || unit === 'meter' || unit === 'm' ? 'meters' : 'feet',
		includeWaste: includeWaste ? 'true' : 'false',
		wastePercent: includeWaste ? wastePercent : defaultWasteMargin,
		explanation,
	}
}

// Register the calculation function
registerCalculation('calculateLaminate', calculateLaminate)

