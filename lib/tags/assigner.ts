/**
 * Tag assignment utility
 * Automatically assigns tags to calculators based on category, ID, and content
 */

import { getDomainTagForCategory, type TagDefinition, tagDefinitions } from './definitions'
import type { CalculatorSchema } from '@/lib/calculators/schema'

/**
 * Tag assignment rules based on calculator properties
 */
interface TagAssignmentRule {
	condition: (calc: CalculatorSchema) => boolean
	tags: string[]
}

/**
 * Get topic tags based on calculator ID/slug
 */
function getTopicTagsByCalculatorId(id: string, slug: string): string[] {
	const idLower = id.toLowerCase()
	const slugLower = slug.toLowerCase()
	const tags: string[] = []

	// Finance topics
	if (idLower.includes('loan') || slugLower.includes('loan')) {
		if (idLower.includes('auto') || slugLower.includes('auto')) {
			tags.push('auto-loan', 'car-loan')
		} else if (idLower.includes('mortgage') || slugLower.includes('mortgage')) {
			tags.push('mortgage')
		} else if (idLower.includes('personal') || slugLower.includes('personal')) {
			tags.push('loan')
		} else {
			tags.push('loan')
		}
	}
	if (idLower.includes('mortgage') || slugLower.includes('mortgage')) {
		tags.push('mortgage')
	}
	if (idLower.includes('investment') || slugLower.includes('investment')) {
		tags.push('investment', 'compound-interest')
	}
	if (idLower.includes('savings') || slugLower.includes('savings')) {
		tags.push('savings', 'interest')
	}
	if (idLower.includes('interest') || slugLower.includes('interest')) {
		tags.push('interest', 'compound-interest')
	}
	if (idLower.includes('roi') || slugLower.includes('roi')) {
		tags.push('roi', 'investment')
	}
	if (idLower.includes('retirement') || slugLower.includes('retirement')) {
		tags.push('retirement', 'savings')
	}
	if (idLower.includes('salary') || slugLower.includes('salary') || idLower.includes('take-home')) {
		tags.push('salary', 'tax')
	}
	if (idLower.includes('net-worth') || slugLower.includes('net-worth')) {
		tags.push('net-worth')
	}
	if (idLower.includes('emergency-fund') || slugLower.includes('emergency-fund')) {
		tags.push('emergency-fund', 'savings')
	}
	if (idLower.includes('overpayment') || slugLower.includes('overpayment')) {
		tags.push('loan', 'interest')
	}

	// Math topics
	if (idLower.includes('percent') || slugLower.includes('percent')) {
		tags.push('percent')
	}
	if (idLower.includes('area') || slugLower.includes('area')) {
		tags.push('area')
	}
	if (idLower.includes('volume') || slugLower.includes('volume')) {
		tags.push('volume')
	}
	if (idLower.includes('equation') || slugLower.includes('equation')) {
		if (idLower.includes('quadratic') || slugLower.includes('quadratic')) {
			tags.push('quadratic', 'equation')
		} else {
			tags.push('equation')
		}
	}
	if (idLower.includes('pythagorean') || slugLower.includes('pythagorean')) {
		tags.push('pythagorean', 'area')
	}
	if (idLower.includes('statistics') || slugLower.includes('statistics') || idLower.includes('standard-deviation') || idLower.includes('average')) {
		tags.push('probability')
	}

	// Construction topics
	if (idLower.includes('paint') || slugLower.includes('paint')) {
		tags.push('paint')
	}
	if (idLower.includes('primer') || slugLower.includes('primer')) {
		tags.push('primer')
	}
	if (idLower.includes('putty') || slugLower.includes('putty')) {
		tags.push('putty')
	}
	if (idLower.includes('tile') || slugLower.includes('tile')) {
		tags.push('tile')
	}
	if (idLower.includes('laminate') || slugLower.includes('laminate')) {
		tags.push('laminate')
	}
	if (idLower.includes('concrete') || slugLower.includes('concrete')) {
		tags.push('concrete')
	}
	if (idLower.includes('cement') || slugLower.includes('cement')) {
		tags.push('concrete')
	}
	if (idLower.includes('brick') || slugLower.includes('brick')) {
		tags.push('bricks')
	}
	if (idLower.includes('foundation') || slugLower.includes('foundation')) {
		tags.push('foundation')
	}
	if (idLower.includes('rebar') || slugLower.includes('rebar')) {
		tags.push('rebar')
	}
	if (idLower.includes('stair') || slugLower.includes('stair')) {
		tags.push('stairs')
	}
	if (idLower.includes('pipe') || slugLower.includes('pipe')) {
		tags.push('pipes')
	}
	if (idLower.includes('electrical') || slugLower.includes('electrical') || idLower.includes('cable')) {
		tags.push('electrical')
	}
	if (idLower.includes('gravel') || slugLower.includes('gravel') || idLower.includes('sand')) {
		tags.push('concrete')
	}

	// Health topics
	if (idLower.includes('bmi') || slugLower.includes('bmi')) {
		tags.push('bmi')
	}
	if (idLower.includes('calorie') || slugLower.includes('calorie')) {
		tags.push('calories')
	}
	if (idLower.includes('pregnancy') || slugLower.includes('pregnancy') || idLower.includes('due-date')) {
		tags.push('pregnancy', 'due-date')
	}
	if (idLower.includes('body-fat') || slugLower.includes('body-fat')) {
		tags.push('body-fat')
	}
	if (idLower.includes('heart-rate') || slugLower.includes('heart-rate')) {
		tags.push('heart-rate')
	}
	if (idLower.includes('bmr') || slugLower.includes('bmr')) {
		tags.push('calories')
	}
	if (idLower.includes('water-intake') || slugLower.includes('water-intake')) {
		tags.push('calories')
	}
	if (idLower.includes('macronutrient') || slugLower.includes('macronutrient')) {
		tags.push('calories')
	}

	// Auto topics
	if (idLower.includes('fuel') || slugLower.includes('fuel')) {
		if (idLower.includes('consumption') || slugLower.includes('consumption')) {
			tags.push('fuel-consumption', 'fuel')
		} else {
			tags.push('fuel', 'fuel-consumption')
		}
	}
	if (idLower.includes('depreciation') || slugLower.includes('depreciation')) {
		tags.push('depreciation')
	}
	if (idLower.includes('maintenance') || slugLower.includes('maintenance')) {
		tags.push('maintenance')
	}
	if (idLower.includes('car-tax') || slugLower.includes('car-tax')) {
		tags.push('car-tax', 'tax')
	}
	if (idLower.includes('affordability') || slugLower.includes('affordability') || idLower.includes('cost-of-ownership')) {
		tags.push('car-loan', 'depreciation', 'maintenance')
	}

	// Tools topics
	if (idLower.includes('converter') || slugLower.includes('converter')) {
		tags.push('converter')
	}
	if (idLower.includes('temperature') || slugLower.includes('temperature')) {
		tags.push('temperature', 'converter')
	}
	if (idLower.includes('speed') || slugLower.includes('speed')) {
		tags.push('speed', 'converter')
	}
	if (idLower.includes('length') || slugLower.includes('length')) {
		tags.push('length', 'converter')
	}
	if (idLower.includes('weight') && !idLower.includes('body-fat') && !idLower.includes('ideal-weight')) {
		tags.push('weight', 'converter')
	}
	if (idLower.includes('date') || slugLower.includes('date') || idLower.includes('days-between')) {
		tags.push('date', 'time')
	}
	if (idLower.includes('random') || slugLower.includes('random')) {
		tags.push('random', 'generator')
	}
	if (idLower.includes('password') || slugLower.includes('password')) {
		tags.push('password', 'generator')
	}
	if (idLower.includes('qr') || slugLower.includes('qr')) {
		tags.push('qr', 'generator')
	}
	if (idLower.includes('crypto') || slugLower.includes('crypto')) {
		tags.push('crypto')
	}
	if (idLower.includes('number-to-words') || slugLower.includes('number-to-words')) {
		tags.push('number-to-words', 'converter')
	}
	if (idLower.includes('roman-numerals') || slugLower.includes('roman-numerals')) {
		tags.push('roman-numerals', 'converter')
	}

	return [...new Set(tags)] // Remove duplicates
}

/**
 * Get intent tag based on calculator properties
 */
function getIntentTag(calc: CalculatorSchema): string {
	const idLower = calc.id.toLowerCase()
	const slugLower = calc.slug.toLowerCase()

	if (idLower.includes('converter') || slugLower.includes('converter')) {
		return 'converter'
	}
	if (idLower.includes('generator') || slugLower.includes('generator') || idLower.includes('random') || idLower.includes('password') || idLower.includes('qr')) {
		return 'generator'
	}
	if (idLower.includes('planner') || slugLower.includes('planner') || idLower.includes('retirement') || idLower.includes('emergency-fund')) {
		return 'planner'
	}
	if (idLower.includes('checker') || slugLower.includes('checker') || idLower.includes('compatibility')) {
		return 'checker'
	}
	if (idLower.includes('estimator') || slugLower.includes('estimator') || calc.category === 'construction') {
		return 'estimator'
	}

	return 'calculator' // Default
}

/**
 * Assign tags to a calculator
 * Returns array of tag IDs: [domain, ...topics, intent]
 */
export function assignTagsToCalculator(calc: CalculatorSchema): string[] {
	const tags: string[] = []

	// 1. Domain tag (required)
	const domainTag = getDomainTagForCategory(calc.category)
	if (domainTag) {
		tags.push(domainTag)
	}

	// 2. Topic tags (2-5 tags)
	const topicTags = getTopicTagsByCalculatorId(calc.id, calc.slug)
	tags.push(...topicTags.slice(0, 5)) // Limit to 5 topic tags

	// 3. Intent tag (required)
	const intentTag = getIntentTag(calc)
	tags.push(intentTag)

	// Remove duplicates and return
	return [...new Set(tags)]
}

/**
 * Validate and normalize tags for a calculator
 */
export function normalizeCalculatorTags(calc: CalculatorSchema): string[] {
	// If calculator already has tags, validate them
	if (calc.tags && calc.tags.length > 0) {
		const validTagIds = new Set(tagDefinitions.map((tag) => tag.id))
		const validTags = calc.tags.filter((tag) => validTagIds.has(tag))
		
		// If we have valid tags, use them (but ensure we have domain and intent)
		if (validTags.length > 0) {
			const domainTag = getDomainTagForCategory(calc.category)
			const intentTag = getIntentTag(calc)
			const tags = new Set(validTags)
			
			if (domainTag) tags.add(domainTag)
			tags.add(intentTag)
			
			return Array.from(tags)
		}
	}

	// Otherwise, assign tags automatically
	return assignTagsToCalculator(calc)
}


