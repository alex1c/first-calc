/**
 * Tile calculation function
 * Calculates number of tiles needed for floors or walls
 */

import type { CalculationFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Calculate tiles needed for surface covering
 * 
 * Takes into account:
 * - Surface dimensions
 * - Tile size
 * - Layout type (affects waste margin)
 * - Waste margin
 * 
 * @param inputs - Input values including surface dimensions, tile size, layout, and waste margin
 * @returns Calculated tile quantities and breakdown
 */
export const calculateTile: CalculationFunction = (inputs) => {
	// Extract inputs
	const surfaceType = String(inputs.surfaceType || 'floor').toLowerCase()
	const surfaceLengthStr = String(inputs.surfaceLength || '').trim()
	const surfaceWidthStr = String(inputs.surfaceWidth || '').trim()
	const tileLengthStr = String(inputs.tileLength || '').trim()
	const tileWidthStr = String(inputs.tileWidth || '').trim()
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
	if (!surfaceLengthStr || surfaceLengthStr.trim() === '') {
		throw new Error('Surface length is required.')
	}
	if (!surfaceWidthStr || surfaceWidthStr.trim() === '') {
		throw new Error('Surface width is required.')
	}
	if (!tileLengthStr || tileLengthStr.trim() === '') {
		throw new Error('Tile length is required.')
	}
	if (!tileWidthStr || tileWidthStr.trim() === '') {
		throw new Error('Tile width is required.')
	}

	const surfaceLength = parseFloat(surfaceLengthStr)
	const surfaceWidth = parseFloat(surfaceWidthStr)
	const tileLength = parseFloat(tileLengthStr)
	const tileWidth = parseFloat(tileWidthStr)

	if (isNaN(surfaceLength) || !Number.isFinite(surfaceLength) || surfaceLength <= 0) {
		throw new Error('Surface length must be a valid positive number.')
	}
	if (isNaN(surfaceWidth) || !Number.isFinite(surfaceWidth) || surfaceWidth <= 0) {
		throw new Error('Surface width must be a valid positive number.')
	}
	if (isNaN(tileLength) || !Number.isFinite(tileLength) || tileLength <= 0) {
		throw new Error('Tile length must be a valid positive number.')
	}
	if (isNaN(tileWidth) || !Number.isFinite(tileWidth) || tileWidth <= 0) {
		throw new Error('Tile width must be a valid positive number.')
	}

	// Calculate surface area
	const surfaceArea = surfaceLength * surfaceWidth
	
	// Calculate tile area
	const tileArea = tileLength * tileWidth
	
	// Calculate base number of tiles needed
	const baseTiles = surfaceArea / tileArea
	
	// Apply waste margin if enabled
	let totalTiles = baseTiles
	if (includeWaste) {
		totalTiles = baseTiles * (1 + wastePercent / 100)
	}
	
	// Round up to whole tiles (you can't buy partial tiles)
	const totalTilesRounded = Math.ceil(totalTiles)
	const baseTilesRounded = Math.ceil(baseTiles)

	// Determine unit labels
	const areaUnit = unit === 'meters' || unit === 'meter' || unit === 'm' ? 'm²' : 'ft²'
	const areaUnitFull = unit === 'meters' || unit === 'meter' || unit === 'm' ? 'square meters' : 'square feet'
	const lengthUnit = unit === 'meters' || unit === 'meter' || unit === 'm' ? 'm' : 'ft'
	const surfaceTypeName = surfaceType === 'floor' ? 'floor' : 'wall'
	const layoutTypeName = layoutType === 'diagonal' ? 'Diagonal' : 'Straight'

	// Create formula explanation
	let formula = `Surface Area = Length × Width = ${surfaceLength} × ${surfaceWidth} = ${surfaceArea.toFixed(2)} ${areaUnit}\n\n`
	formula += `Tile Area = Tile Length × Tile Width = ${tileLength} × ${tileWidth} = ${tileArea.toFixed(4)} ${areaUnit}\n\n`
	formula += `Base Tiles = Surface Area / Tile Area = ${surfaceArea.toFixed(2)} / ${tileArea.toFixed(4)} = ${baseTiles.toFixed(2)} tiles`
	
	if (includeWaste) {
		formula += `\n\nWith ${wastePercent}% waste margin (${layoutTypeName} layout): ${totalTiles.toFixed(2)} tiles → ${totalTilesRounded} tiles (rounded up)`
	} else {
		formula += ` → ${baseTilesRounded} tiles (rounded up)`
	}

	// Create breakdown
	let breakdown = `${surfaceTypeName.charAt(0).toUpperCase() + surfaceTypeName.slice(1)} Dimensions: ${surfaceLength} × ${surfaceWidth} ${lengthUnit}\n`
	breakdown += `Surface Area: ${surfaceArea.toFixed(2)} ${areaUnit}\n\n`
	breakdown += `Tile Size: ${tileLength} × ${tileWidth} ${lengthUnit}\n`
	breakdown += `Tile Area: ${tileArea.toFixed(4)} ${areaUnit}\n`
	breakdown += `Layout: ${layoutTypeName}\n\n`
	breakdown += `Base Tiles: ${baseTilesRounded} tiles`
	
	if (includeWaste) {
		breakdown += `\nWith ${wastePercent}% waste margin: ${totalTilesRounded} tiles`
	}

	// Create explanation
	let explanation = `For a ${surfaceTypeName} measuring ${surfaceLength} × ${surfaceWidth} ${lengthUnit} (${surfaceArea.toFixed(2)} ${areaUnitFull}), using tiles of size ${tileLength} × ${tileWidth} ${lengthUnit} (${tileArea.toFixed(4)} ${areaUnit} each), you need approximately ${baseTilesRounded} tiles.`
	
	if (includeWaste) {
		explanation += `\n\nWith a ${wastePercent}% waste margin for ${layoutTypeName.toLowerCase()} layout, you should order ${totalTilesRounded} tiles to account for cutting, breakage, and pattern matching.`
	} else {
		explanation += `\n\nConsider adding ${defaultWasteMargin}% extra (${layoutTypeName === 'Diagonal' ? '15%' : '10%'} for ${layoutTypeName.toLowerCase()} layout) for waste, cutting, and breakage.`
	}
	
	// Add practical note
	explanation += `\n\nPractical Note: Always buy extra tiles from the same batch to ensure color and pattern matching. Tiles from different batches may have slight color variations. Keep extra tiles for future repairs or replacements.`

	return {
		surfaceArea: Number(surfaceArea.toFixed(2)),
		tileArea: Number(tileArea.toFixed(4)),
		baseTiles: Number(baseTiles.toFixed(2)),
		baseTilesRounded,
		totalTiles: includeWaste ? totalTilesRounded : baseTilesRounded,
		totalTilesExact: Number(totalTiles.toFixed(2)),
		surfaceLength,
		surfaceWidth,
		tileLength,
		tileWidth,
		surfaceType: surfaceTypeName,
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
registerCalculation('calculateTile', calculateTile)


