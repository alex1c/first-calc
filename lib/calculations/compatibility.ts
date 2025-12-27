/**
 * Compatibility-themed calculation helpers
 * Entertainment-focused estimations based on simple patterns
 */

import type { CalculationFunction } from '@/lib/calculations/registry'
import { registerCalculation } from '@/lib/calculations/registry'

function normalize(value: string): string {
	return value.toLowerCase().replace(/[^a-z0-9]/gi, '')
}

function hashScore(parts: string[]): number {
	const combined = parts.join('|')
	let hash = 0
	for (let i = 0; i < combined.length; i++) {
		hash = (hash << 5) - hash + combined.charCodeAt(i)
		hash |= 0
	}
	const score = Math.abs(hash) % 101
	return score
}

function scoreLabel(score: number): string {
	if (score >= 85) return 'Excellent energy'
	if (score >= 70) return 'Strong connection'
	if (score >= 55) return 'Balanced potential'
	return 'Growth opportunity'
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max)
}

function getLoveInsight(score: number): string {
	if (score >= 85) {
		return 'Plan a memorable date or trip together—the energy is already on your side.'
	}
	if (score >= 70) {
		return 'Lean into shared traditions and talk openly about expectations.'
	}
	if (score >= 55) {
		return 'Small rituals—like check-in texts or weekly coffee—keep momentum steady.'
	}
	return 'Slow the pace, ask curious questions, and let shared hobbies build trust.'
}

function lifePathNumber(date: string): number {
	const digits = date.replace(/\D/g, '')
	let sum = 0

	for (const char of digits) {
		sum += Number(char)
	}

	while (sum > 9 && sum !== 11 && sum !== 22) {
		sum = sum
			.toString()
			.split('')
			.reduce((acc, digit) => acc + Number(digit), 0)
	}

	return sum
}

const masterLifePaths = new Set([11, 22])

// Predefined bonuses highlight well-known complementary life path pairs.
const numerologyPairBonuses: Record<string, number> = {
	'1-5': 4,
	'1-7': 2,
	'2-6': 4,
	'3-9': 5,
	'4-8': 4,
	'5-7': 2,
	'6-9': 3,
	'7-11': 6,
	'8-11': 3,
	'9-11': 2,
	'11-22': 6,
}

// Derive a compatibility score by comparing the gap between two life paths
// and layering in bonuses for popular numerology pairings.
function numerologyCompatibilityScore(pathA: number, pathB: number): number {
	const diff = Math.abs(pathA - pathB)
	let base = 94 - diff * 7

	if (pathA === pathB) {
		base += 4
	}

	const isMasterA = masterLifePaths.has(pathA)
	const isMasterB = masterLifePaths.has(pathB)

	if (isMasterA && isMasterB) {
		base += 6
	} else if (isMasterA || isMasterB) {
		base += 3
	}

	const pairKey = [pathA, pathB].sort((a, b) => a - b).join('-')
	base += numerologyPairBonuses[pairKey] ?? 0

	return clamp(Math.round(base), 28, 97)
}

// Provide a short interpretation that references the overall score, the gap
// between paths, and any master-number influence.
function getNumerologyInterpretation(
	score: number,
	pathA: number,
	pathB: number,
): string {
	const diff = Math.abs(pathA - pathB)
	const masterNote = masterLifePaths.has(pathA) || masterLifePaths.has(pathB)
		? ' One or both life paths are master numbers, so stay intentional about your shared goals.'
		: ''

	if (score >= 80) {
		return `Life paths ${pathA} and ${pathB} share an easy rhythm—plan bold projects or meaningful rituals while the momentum feels natural.${masterNote}`
	}

	if (score >= 65) {
		return `Life paths ${pathA} and ${pathB} are largely in sync. Use weekly check-ins to keep priorities aligned and celebrate small wins.${masterNote}`
	}

	if (score >= 45) {
		return `Life paths ${pathA} and ${pathB} differ by ${diff}, which can add perspective. Compare routines, money habits, or planning styles to stay balanced.${masterNote}`
	}

	return `Life paths ${pathA} and ${pathB} operate at very different speeds. Treat the contrast as a learning lab, and revisit expectations before making big promises.${masterNote}`
}

interface DateCompatibilityMetrics {
	communication: number
	emotional: number
	lifestyle: number
	overall: number
}

function ensureValidDateInput(value: string): Date {
	const parsed = new Date(value)

	if (Number.isNaN(parsed.getTime())) {
		throw new Error('One of the dates looks invalid. Try YYYY-MM-DD format.')
	}

	return parsed
}

function getDateCompatibilityMetrics(
	dateA: Date,
	dateB: Date,
): DateCompatibilityMetrics {
	const dayDiff = Math.abs(dateA.getDate() - dateB.getDate())
	const monthDiff = Math.abs(dateA.getMonth() - dateB.getMonth())
	const yearDiff = Math.abs(dateA.getFullYear() - dateB.getFullYear())

	const seed =
		dayDiff * 17 +
		monthDiff * 23 +
		Number(`${dateA.getFullYear() % 100}${dateB.getFullYear() % 100}`)

	const communication = clamp(
		Math.round(90 - dayDiff * 2 + Math.sin(seed) * 8),
		40,
		96,
	)
	const emotional = clamp(
		Math.round(88 - monthDiff * 3 + Math.sin(seed + 7) * 10),
		35,
		97,
	)
	const lifestyle = clamp(
		Math.round(85 - yearDiff * 1.2 + Math.sin(seed + 13) * 9),
		30,
		95,
	)
	const overall = clamp(
		Math.round(
			(communication + emotional + lifestyle) / 3 + Math.sin(seed + 3) * 4,
		),
		30,
		98,
	)

	return {
		communication,
		emotional,
		lifestyle,
		overall,
	}
}

function getFriendshipInterpretation(
	overall: number,
	communication: number,
	trust: number,
	energy: number,
): string {
	const notes: string[] = []

	if (overall >= 80) {
		notes.push(
			'This duo runs on effortless rapport—double down on shared adventures or creative projects.',
		)
	} else if (overall >= 60) {
		notes.push(
			'Plenty of potential here. Set mini rituals (coffee chats, game nights) to keep the vibe steady.',
		)
	} else {
		notes.push(
			'Different rhythms make this friendship interesting—stay curious and give each other space to recharge.',
		)
	}

	if (trust > communication + 8) {
		notes.push(
			'Trust sits ahead of conversation, so schedule honest check-ins to keep things aligned.',
		)
	} else if (communication > trust + 8) {
		notes.push(
			'Communication flows easily—use that clarity to discuss boundaries or future plans.',
		)
	}

	if (energy >= 80) {
		notes.push('High shared energy suggests trying something active or spontaneous soon.')
	} else if (energy <= 50) {
		notes.push('Energy levels differ—alternate between calm hangouts and high-action plans.')
	}

	return notes.join(' ')
}

function getWorkRecommendations(
	overall: number,
	communication: number,
	discipline: number,
): string[] {
	const recs: string[] = []

	if (overall >= 80) {
		recs.push('Co-lead complex projects where autonomy and shared strategy matter.')
		recs.push('Alternate sprint planning ownership to keep perspectives balanced.')
	} else if (overall >= 65) {
		recs.push('Clarify roles at the start of each sprint to reduce duplicate effort.')
		recs.push('Use lightweight retros to keep collaboration friction-free.')
	} else {
		recs.push('Start with short pilot tasks to learn how each person prefers to work.')
		recs.push('Document agreements right away so expectations stay visible.')
	}

	if (communication >= 75) {
		recs.push('Lean on async updates and shared docs to maintain speed between meetings.')
	} else if (communication >= 55) {
		recs.push('Schedule quick weekly standups to surface blockers before they grow.')
	} else {
		recs.push('Pair longer 1:1 syncs with written summaries to avoid misalignment.')
	}

	if (discipline >= 75) {
		recs.push('Build a transparent Kanban or Notion board to showcase planning strength.')
		recs.push('Reserve deep-focus blocks for joint architecture or requirements work.')
	} else if (discipline >= 55) {
		recs.push('Break large deliverables into mini-milestones with mutual check-ins.')
	} else {
		recs.push('Agree on no-surprise deadlines and recap decisions at the end of each session.')
	}

	if (overall >= 70 && communication >= 70) {
		recs.push('Host monthly innovation hours to capture ideas before they fade.')
	}

	if (overall < 60) {
		recs.push('Set up a shared “working agreement” doc covering response times and review styles.')
	}

	recs.push('Celebrate quick wins publicly to reinforce trust and accountability.')
	recs.push('Keep a living list of open questions so nothing slips between context switches.')

	const unique = Array.from(new Set(recs))
	return unique.slice(0, 8)
}

export const calculateLoveCompatibility: CalculationFunction = (inputs) => {
	const partnerOneName = normalize(String(inputs.partnerOneName || ''))
	const partnerTwoName = normalize(String(inputs.partnerTwoName || ''))
	const partnerOneBirth = String(inputs.partnerOneBirthDate || '')
	const partnerTwoBirth = String(inputs.partnerTwoBirthDate || '')

	if (!partnerOneName || !partnerTwoName || !partnerOneBirth || !partnerTwoBirth) {
		throw new Error('Please enter both names and birth dates.')
	}

	const baseScore = hashScore([
		partnerOneName,
		partnerTwoName,
		partnerOneBirth,
		partnerTwoBirth,
	])
	const summary = scoreLabel(baseScore)

	return {
		compatibilityScore: `${baseScore}%`,
		matchSummary: summary,
		insight: getLoveInsight(baseScore),
	}
}

registerCalculation('calculateLoveCompatibility', calculateLoveCompatibility)

export const calculateZodiacCompatibility: CalculationFunction = (inputs) => {
	const dateA = String(inputs.dateA || '')
	const dateB = String(inputs.dateB || '')

	if (!dateA || !dateB) {
		throw new Error('Please enter both birth dates.')
	}

	const parsedA = new Date(dateA)
	const parsedB = new Date(dateB)

	if (Number.isNaN(parsedA.getTime()) || Number.isNaN(parsedB.getTime())) {
		throw new Error('One of the dates looks invalid. Try YYYY-MM-DD format.')
	}

	const signA = getZodiacSignFromDate(parsedA)
	const signB = getZodiacSignFromDate(parsedB)

	const score = zodiacCompatibilityMatrix[signA]?.[signB] ?? defaultZodiacScore
	const interpretation = getZodiacInterpretation(score)

	return {
		signA: zodiacDisplayNames[signA],
		signB: zodiacDisplayNames[signB],
		compatibilityScore: `${score}%`,
		interpretation,
	}
}

registerCalculation('calculateZodiacCompatibility', calculateZodiacCompatibility)

export const calculateNumerologyCompatibility: CalculationFunction = (inputs) => {
	const dateA = String(inputs.dateA || '')
	const dateB = String(inputs.dateB || '')

	if (!dateA || !dateB) {
		throw new Error('Please enter both birth dates.')
	}

	const parsedA = new Date(dateA)
	const parsedB = new Date(dateB)

	if (Number.isNaN(parsedA.getTime()) || Number.isNaN(parsedB.getTime())) {
		throw new Error('One of the dates looks invalid. Try YYYY-MM-DD format.')
	}

	const pathA = lifePathNumber(dateA)
	const pathB = lifePathNumber(dateB)
	const score = numerologyCompatibilityScore(pathA, pathB)
	const interpretation = getNumerologyInterpretation(score, pathA, pathB)

	return {
		lifePathA: pathA.toString(),
		lifePathB: pathB.toString(),
		compatibilityScore: `${score}%`,
		interpretation,
	}
}

registerCalculation('calculateNumerologyCompatibility', calculateNumerologyCompatibility)

export const calculateFriendshipCompatibility: CalculationFunction = (inputs) => {
	const dateA = String(inputs.dateA || '')
	const dateB = String(inputs.dateB || '')

	if (!dateA || !dateB) {
		throw new Error('Please enter both birth dates.')
	}

	const parsedA = ensureValidDateInput(dateA)
	const parsedB = ensureValidDateInput(dateB)
	const metrics = getDateCompatibilityMetrics(parsedA, parsedB)
	const trustScore = metrics.emotional
	const energyScore = metrics.lifestyle
	const interpretation = getFriendshipInterpretation(
		metrics.overall,
		metrics.communication,
		trustScore,
		energyScore,
	)

	return {
		overallCompatibility: `${metrics.overall}%`,
		communication: `${metrics.communication}%`,
		trust: `${trustScore}%`,
		energy: `${energyScore}%`,
		interpretation,
	}
}

registerCalculation('calculateFriendshipCompatibility', calculateFriendshipCompatibility)

export const calculateWorkCompatibility: CalculationFunction = (inputs) => {
	const dateA = String(inputs.dateA || '')
	const dateB = String(inputs.dateB || '')

	if (!dateA || !dateB) {
		throw new Error('Please enter both birth dates.')
	}

	const parsedA = ensureValidDateInput(dateA)
	const parsedB = ensureValidDateInput(dateB)
	const metrics = getDateCompatibilityMetrics(parsedA, parsedB)
	const planningScore = clamp(
		Math.round(metrics.lifestyle * 0.6 + metrics.emotional * 0.4),
		30,
		98,
	)
	const recommendations = getWorkRecommendations(
		metrics.overall,
		metrics.communication,
		planningScore,
	)

	return {
		collaborationScore: `${metrics.overall}%`,
		communicationScore: `${metrics.communication}%`,
		planningScore: `${planningScore}%`,
		recommendations: recommendations.map((rec) => `• ${rec}`).join('\n'),
	}
}

registerCalculation('calculateWorkCompatibility', calculateWorkCompatibility)

export const calculateBirthDateCompatibility: CalculationFunction = (inputs) => {
	const dateA = String(inputs.dateA || '')
	const dateB = String(inputs.dateB || '')

	if (!dateA || !dateB) {
		throw new Error('Please enter both birth dates.')
	}

	const parsedA = ensureValidDateInput(dateA)
	const parsedB = ensureValidDateInput(dateB)
	const metrics = getDateCompatibilityMetrics(parsedA, parsedB)
	const interpretations: string[] = []

	if (metrics.overall >= 80) {
		interpretations.push(
			'Great synergy: the dates point to complementary pacing and shared priorities. Lean into rituals that celebrate what already works.',
		)
	} else if (metrics.overall >= 60) {
		interpretations.push(
			'Balanced energy: small adjustments in routines or communication can make the connection feel effortless.',
		)
	} else {
		interpretations.push(
			'Different rhythms add perspective. Talk about expectations early, and keep things playful while you explore what feels natural.',
		)
	}

	if (metrics.emotional > metrics.communication + 8) {
		interpretations.push(
			'Emotional signals look strong—make room for honest check-ins so they stay that way.',
		)
	} else if (metrics.communication > metrics.emotional + 8) {
		interpretations.push(
			'Communication flows easily. Use that clarity to discuss feelings or long-term goals when the timing feels right.',
		)
	} else if (metrics.lifestyle > 80) {
		interpretations.push(
			'Lifestyle alignment is a highlight. Plan activities that reflect that natural synchronicity.',
		)
	}

	return {
		overallCompatibility: `${metrics.overall}%`,
		communication: `${metrics.communication}%`,
		emotional: `${metrics.emotional}%`,
		lifestyle: `${metrics.lifestyle}%`,
		interpretation: interpretations.join(' '),
	}
}

registerCalculation('calculateBirthDateCompatibility', calculateBirthDateCompatibility)

type ZodiacSign =
	| 'aries'
	| 'taurus'
	| 'gemini'
	| 'cancer'
	| 'leo'
	| 'virgo'
	| 'libra'
	| 'scorpio'
	| 'sagittarius'
	| 'capricorn'
	| 'aquarius'
	| 'pisces'

const zodiacDisplayNames: Record<ZodiacSign, string> = {
	aries: 'Aries',
	taurus: 'Taurus',
	gemini: 'Gemini',
	cancer: 'Cancer',
	leo: 'Leo',
	virgo: 'Virgo',
	libra: 'Libra',
	scorpio: 'Scorpio',
	sagittarius: 'Sagittarius',
	capricorn: 'Capricorn',
	aquarius: 'Aquarius',
	pisces: 'Pisces',
}

interface ZodiacRange {
	sign: ZodiacSign
	start: { month: number; day: number }
	end: { month: number; day: number }
}

const zodiacRanges: ZodiacRange[] = [
	{ sign: 'aries', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
	{ sign: 'taurus', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
	{ sign: 'gemini', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
	{ sign: 'cancer', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
	{ sign: 'leo', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
	{ sign: 'virgo', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
	{ sign: 'libra', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
	{ sign: 'scorpio', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
	{ sign: 'sagittarius', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
	{ sign: 'capricorn', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
	{ sign: 'aquarius', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
	{ sign: 'pisces', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
]

const zodiacSigns: ZodiacSign[] = zodiacRanges.map((range) => range.sign)

const defaultZodiacScore = 60

const zodiacCompatibilityMatrix: Record<ZodiacSign, Record<ZodiacSign, number>> =
	zodiacSigns.reduce((acc, sign) => {
		acc[sign] = {} as Record<ZodiacSign, number>
		zodiacSigns.forEach((other) => {
			acc[sign][other] = defaultZodiacScore
		})
		return acc
	}, {} as Record<ZodiacSign, Record<ZodiacSign, number>>)

const zodiacPairScores: Array<{ pair: [ZodiacSign, ZodiacSign]; score: number }> = [
	{ pair: ['aries', 'leo'], score: 92 },
	{ pair: ['aries', 'sagittarius'], score: 90 },
	{ pair: ['aries', 'libra'], score: 83 },
	{ pair: ['aries', 'cancer'], score: 58 },
	{ pair: ['taurus', 'virgo'], score: 88 },
	{ pair: ['taurus', 'capricorn'], score: 86 },
	{ pair: ['taurus', 'scorpio'], score: 79 },
	{ pair: ['taurus', 'leo'], score: 55 },
	{ pair: ['gemini', 'libra'], score: 89 },
	{ pair: ['gemini', 'aquarius'], score: 85 },
	{ pair: ['gemini', 'pisces'], score: 52 },
	{ pair: ['gemini', 'cancer'], score: 60 },
	{ pair: ['cancer', 'pisces'], score: 90 },
	{ pair: ['cancer', 'scorpio'], score: 88 },
	{ pair: ['cancer', 'capricorn'], score: 77 },
	{ pair: ['leo', 'libra'], score: 84 },
	{ pair: ['leo', 'sagittarius'], score: 91 },
	{ pair: ['leo', 'aquarius'], score: 80 },
	{ pair: ['virgo', 'capricorn'], score: 87 },
	{ pair: ['virgo', 'pisces'], score: 74 },
	{ pair: ['virgo', 'aries'], score: 50 },
	{ pair: ['libra', 'aquarius'], score: 88 },
	{ pair: ['libra', 'pisces'], score: 63 },
	{ pair: ['scorpio', 'pisces'], score: 90 },
	{ pair: ['scorpio', 'taurus'], score: 82 },
	{ pair: ['scorpio', 'leo'], score: 57 },
	{ pair: ['sagittarius', 'aquarius'], score: 86 },
	{ pair: ['sagittarius', 'pisces'], score: 62 },
	{ pair: ['capricorn', 'virgo'], score: 88 },
	{ pair: ['capricorn', 'aquarius'], score: 70 },
	{ pair: ['capricorn', 'aries'], score: 53 },
]

zodiacPairScores.forEach(({ pair, score }) => {
	const [a, b] = pair
	zodiacCompatibilityMatrix[a][b] = score
	zodiacCompatibilityMatrix[b][a] = score
})

zodiacSigns.forEach((sign) => {
	if (zodiacCompatibilityMatrix[sign][sign] === defaultZodiacScore) {
		zodiacCompatibilityMatrix[sign][sign] = 78
	}
})

function getZodiacSignFromDate(date: Date): ZodiacSign {
	const month = date.getUTCMonth() + 1
	const day = date.getUTCDate()
	for (const range of zodiacRanges) {
		const start = range.start
		const end = range.end
		if (start.month === 12 && end.month === 1) {
			if (
				(month === 12 && day >= start.day) ||
				(month === 1 && day <= end.day)
			) {
				return range.sign
			}
		} else if (
			(month === start.month && day >= start.day) ||
			(month === end.month && day <= end.day) ||
			(month > start.month && month < end.month)
		) {
			return range.sign
		}
	}
	return 'aries'
}

function getZodiacInterpretation(score: number): string {
	if (score >= 81) {
		return 'Fantastic chemistry. Plan something memorable and enjoy the momentum.'
	}
	if (score >= 61) {
		return 'Strong potential. Prioritize clear conversations to keep energy positive.'
	}
	if (score >= 31) {
		return 'Mixed signals. Small adjustments in pace and expectations can help.'
	}
	return 'Different rhythms. Stay curious and treat the pairing as a fun experiment.'
}



