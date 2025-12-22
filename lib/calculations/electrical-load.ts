/**
 * Electrical load calculation function
 * Calculates total electrical load by summing appliance power
 */

import type { CalculationFunction } from '@/lib/calculators/types'
import { registerCalculation } from '@/lib/calculations/registry'

/**
 * Parse appliances from input
 * Accepts format: "name1:power1:qty1,name2:power2:qty2" or JSON array
 * Also accepts individual appliance inputs (appliance1, appliance2, etc.)
 */
function parseAppliances(inputs: Record<string, number | string>): Array<{ name: string; power: number; quantity: number }> {
	const appliances: Array<{ name: string; power: number; quantity: number }> = []
	
	// Try to get appliances from structured inputs (appliance1, appliance2, etc.)
	let applianceIndex = 1
	while (true) {
		const nameKey = `appliance${applianceIndex}Name`
		const powerKey = `appliance${applianceIndex}Power`
		const qtyKey = `appliance${applianceIndex}Quantity`
		
		if (!inputs[nameKey] && !inputs[powerKey]) {
			break // No more appliances
		}
		
		const name = String(inputs[nameKey] || `Appliance ${applianceIndex}`).trim()
		const powerStr = String(inputs[powerKey] || '0').trim()
		const qtyStr = String(inputs[qtyKey] || '1').trim()
		
		if (powerStr && powerStr !== '0') {
			const power = parseFloat(powerStr)
			const quantity = parseFloat(qtyStr) || 1
			
			if (!isNaN(power) && power > 0) {
				appliances.push({ name, power, quantity })
			}
		}
		
		applianceIndex++
		if (applianceIndex > 50) break // Safety limit
	}
	
	// If no structured inputs, try to parse from appliances/applianceList field
	if (appliances.length === 0) {
		const appliancesInput = inputs.appliances || inputs.applianceList || ''
		
		if (appliancesInput && String(appliancesInput).trim() !== '') {
			const inputStr = String(appliancesInput)
			
			// Try to parse as JSON first
			if (inputStr.trim().startsWith('[')) {
				try {
					const parsed = JSON.parse(inputStr)
					if (Array.isArray(parsed)) {
						for (const item of parsed) {
							if (item && (item.power || item.p)) {
								appliances.push({
									name: item.name || item.n || 'Appliance',
									power: Number(item.power || item.p || 0),
									quantity: Number(item.quantity || item.qty || item.q || 1),
								})
							}
						}
						return appliances
					}
				} catch (e) {
					// Not JSON, continue with string parsing
				}
			}
			
			// Parse as comma-separated format: "name:power:qty,name:power:qty"
			const entries = inputStr.split(',').map(s => s.trim()).filter(s => s)
			
			for (const entry of entries) {
				const parts = entry.split(':').map(s => s.trim())
				if (parts.length >= 2) {
					const name = parts[0] || 'Appliance'
					const power = parseFloat(parts[1] || '0')
					const quantity = parts.length >= 3 ? parseFloat(parts[2] || '1') : 1
					
					if (!isNaN(power) && power > 0) {
						appliances.push({ name, power, quantity })
					}
				}
			}
		}
	}
	
	return appliances
}

/**
 * Calculate total electrical load
 * 
 * Takes into account:
 * - Multiple appliances with power and quantity
 * - Demand factor (simultaneity factor)
 * 
 * @param inputs - Input values including appliances and demand factor
 * @returns Calculated total load and breakdown
 */
export const calculateElectricalLoad: CalculationFunction = (inputs) => {
	// Extract inputs
	const demandFactorStr = String(inputs.demandFactor || '100').trim()
	
	// Parse appliances from inputs
	const appliances = parseAppliances(inputs)
	
	if (appliances.length === 0) {
		throw new Error('At least one appliance is required. Enter appliance name, power (W or kW), and quantity.')
	}
	
	// Parse demand factor
	const demandFactor = parseFloat(demandFactorStr)
	if (isNaN(demandFactor) || !Number.isFinite(demandFactor) || demandFactor < 0 || demandFactor > 100) {
		throw new Error('Demand factor must be a number between 0 and 100.')
	}
	
	// Calculate raw total power (sum of all appliances)
	let totalRawPower = 0
	const applianceDetails: Array<{ name: string; power: number; quantity: number; total: number }> = []
	
	for (const appliance of appliances) {
		if (isNaN(appliance.power) || appliance.power <= 0) {
			throw new Error(`Invalid power for appliance "${appliance.name}": must be a positive number.`)
		}
		if (isNaN(appliance.quantity) || appliance.quantity < 1) {
			throw new Error(`Invalid quantity for appliance "${appliance.name}": must be at least 1.`)
		}
		
		const applianceTotal = appliance.power * appliance.quantity
		totalRawPower += applianceTotal
		
		applianceDetails.push({
			name: appliance.name,
			power: appliance.power,
			quantity: appliance.quantity,
			total: applianceTotal,
		})
	}
	
	// Convert to kW if needed (assume input is in W if > 1000, otherwise kW)
	let totalRawPowerkW = totalRawPower
	if (totalRawPower > 1000) {
		totalRawPowerkW = totalRawPower / 1000
	}
	
	// Apply demand factor
	const adjustedPowerkW = totalRawPowerkW * (demandFactor / 100)
	
	// Create formula explanation
	let formula = `Raw Total Power = Sum of all appliances:\n`
	for (let i = 0; i < applianceDetails.length; i++) {
		const app = applianceDetails[i]
		formula += `  ${app.name}: ${app.power} ${app.power > 1000 ? 'W' : 'kW'} × ${app.quantity} = ${app.total > 1000 ? (app.total / 1000).toFixed(2) : app.total.toFixed(2)} ${app.total > 1000 ? 'kW' : 'W'}\n`
	}
	formula += `\nTotal Raw Power = ${totalRawPowerkW.toFixed(2)} kW\n\n`
	formula += `Adjusted Power (with ${demandFactor}% demand factor):\n`
	formula += `Adjusted = ${totalRawPowerkW.toFixed(2)} × (${demandFactor} / 100) = ${adjustedPowerkW.toFixed(2)} kW`
	
	// Create breakdown
	let breakdown = `Appliances:\n`
	for (const app of applianceDetails) {
		const appTotal = app.total > 1000 ? app.total / 1000 : app.total
		const appUnit = app.total > 1000 ? 'kW' : 'W'
		breakdown += `  ${app.name}: ${app.power} ${app.power > 1000 ? 'W' : 'kW'} × ${app.quantity} = ${appTotal.toFixed(2)} ${appUnit}\n`
	}
	breakdown += `\nTotal Raw Load: ${totalRawPowerkW.toFixed(2)} kW\n`
	breakdown += `Demand Factor: ${demandFactor}%\n`
	breakdown += `Adjusted Load: ${adjustedPowerkW.toFixed(2)} kW`
	
	// Create explanation
	let explanation = `For ${appliances.length} appliance${appliances.length > 1 ? 's' : ''}, the total raw electrical load is ${totalRawPowerkW.toFixed(2)} kW.`
	
	if (demandFactor < 100) {
		explanation += `\n\nWith a ${demandFactor}% demand factor (simultaneity factor), the adjusted load is ${adjustedPowerkW.toFixed(2)} kW. The demand factor accounts for the fact that not all appliances operate at the same time - it's a realistic estimate of actual simultaneous power consumption.`
	} else {
		explanation += `\n\nWith 100% demand factor (all appliances running simultaneously), the total load is ${adjustedPowerkW.toFixed(2)} kW. In practice, not all appliances run at the same time, so you may want to use a lower demand factor (typically 70-80%) for more realistic estimates.`
	}
	
	// Add practical note
	explanation += `\n\nPractical Note: Not all appliances work at the same time. The demand factor (simultaneity factor) accounts for this - typical values are 70-80% for residential, 60-70% for commercial. Use the adjusted load for cable sizing, circuit breaker selection, and electrical system design.`
	
	// Create appliance list for display
	const applianceList = applianceDetails.map(app => 
		`${app.name} (${app.power} ${app.power > 1000 ? 'W' : 'kW'} × ${app.quantity})`
	).join(', ')

	return {
		totalRawPower: Number(totalRawPowerkW.toFixed(2)),
		adjustedPower: Number(adjustedPowerkW.toFixed(2)),
		demandFactor: Number(demandFactor),
		applianceCount: appliances.length,
		applianceList,
		applianceDetails: applianceDetails.map(app => ({
			name: app.name,
			power: app.power,
			quantity: app.quantity,
			total: app.total > 1000 ? Number((app.total / 1000).toFixed(2)) : Number(app.total.toFixed(2)),
			unit: app.total > 1000 ? 'kW' : 'W',
		})),
		formula,
		breakdown,
		explanation,
	}
}

// Register the calculation function
registerCalculation('calculateElectricalLoad', calculateElectricalLoad)

