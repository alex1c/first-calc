import type { CalculatorDefinition, CalculatorLocale } from '@/lib/calculators/types'
import { calculatePercentageOfNumber } from '@/lib/calculations/percentage'
import { calculateAddPercentage } from '@/lib/calculations/add-percentage'
import { calculateSubtractPercentage } from '@/lib/calculations/subtract-percentage'
import { calculateLoanPayment } from '@/lib/calculations/loan'
import { calculateCompoundInterest } from '@/lib/calculations/compound-interest'
import { calculateAutoLoan } from '@/lib/calculations/auto-loan'
import { calculateInvestment } from '@/lib/calculations/investment'
import { calculateLoanOverpayment } from '@/lib/calculations/loan-overpayment'
import { calculateMortgage } from '@/lib/calculations/mortgage'
import { calculatePersonalLoan } from '@/lib/calculations/personal-loan'
import { calculateROI } from '@/lib/calculations/roi'
import { calculateSavings } from '@/lib/calculations/savings'
import { calculateLoanComparison } from '@/lib/calculations/loan-comparison'
import { calculateMortgageComparison } from '@/lib/calculations/mortgage-comparison'
import { calculateRetirement } from '@/lib/calculations/retirement'
import { calculateInvestmentVsSavings } from '@/lib/calculations/investment-vs-savings'
import { calculateTakeHomePay } from '@/lib/calculations/take-home-pay'
import { calculateEmergencyFund } from '@/lib/calculations/emergency-fund'
import { calculateNetWorth } from '@/lib/calculations/net-worth'
import {
	calculateLoveCompatibility,
	calculateBirthDateCompatibility,
	calculateZodiacCompatibility,
	calculateNumerologyCompatibility,
	calculateFriendshipCompatibility,
	calculateWorkCompatibility,
} from '@/lib/calculations/compatibility'

const compatibilityLocales: CalculatorLocale[] = ['en', 'ru', 'es', 'tr', 'hi']

type CompatibilityCalculatorBase = Omit<CalculatorDefinition, 'locale'>

function createCompatibilityEntries(
	base: CompatibilityCalculatorBase,
): CalculatorDefinition[] {
	return compatibilityLocales.map((locale) => ({
		...base,
		locale,
	}))
}

const loveCompatibilityBase: CompatibilityCalculatorBase = {
	id: 'love-compatibility',
	slug: 'love-compatibility',
	category: 'compatibility',
	title: 'Love Compatibility by Birth Date',
	shortDescription:
		'Blend two names and birthdays to get a playful compatibility score with a quick insight.',
	longDescription:
		'This light-hearted calculator combines both names and birth dates to create a fun compatibility score. It is not a scientific or regulatory tool—just an entertaining way to start conversations, reflect on your connection, or plan the next date night.',
	contentLocale: 'en',
	inputs: [
		{
			name: 'partnerOneName',
			label: 'Your name',
			type: 'text',
			placeholder: 'Taylor',
			validation: {
				required: true,
				message: 'Enter name',
			},
		},
		{
			name: 'partnerOneBirthDate',
			label: 'Your birth date',
			type: 'date',
			validation: {
				required: true,
				message: 'Select a birth date',
			},
		},
		{
			name: 'partnerTwoName',
			label: 'Partner name',
			type: 'text',
			placeholder: 'Jordan',
			validation: {
				required: true,
				message: 'Enter partner name',
			},
		},
		{
			name: 'partnerTwoBirthDate',
			label: 'Partner birth date',
			type: 'date',
			validation: {
				required: true,
				message: 'Select a birth date',
			},
		},
	],
	outputs: [
		{
			name: 'compatibilityScore',
			label: 'Compatibility score',
		},
		{
			name: 'matchSummary',
			label: 'Match summary',
		},
		{
			name: 'insight',
			label: 'Insight',
		},
	],
	calculate: calculateLoveCompatibility,
	howToBullets: [
		'Enter both names exactly how you prefer to be called',
		'Add birth dates (no year limitations—past or present)',
		'Press Calculate to reveal the percentage and quick insight',
		'Remember: this is for fun and self-reflection only',
	],
	examples: [
		{
			id: 'love-example-1',
			title: 'Example: Taylor & Jordan',
			inputDescription: 'Taylor (02/14/1992) and Jordan (09/03/1991)',
			steps: [
				'Enter both names',
				'Pick the two birth dates',
				'Tap Calculate',
				'Score: 78% – Strong connection',
			],
			resultDescription:
				'Shows a high score plus a suggestion to plan a special date night.',
		},
	],
	faq: [
		{
			question: 'Is this a scientific compatibility test?',
			answer:
				'No, it is a playful calculator intended for entertainment and self-reflection only.',
		},
		{
			question: 'Does the calculator store my data?',
			answer:
				'No, the inputs are calculated instantly in your browser and are not saved.',
		},
		{
			question: 'Need a date-only comparison?',
			answer:
				'Run the [Birth Date Compatibility Calculator](compatibility/birth-date-compatibility) for a quick 0–100 score before layering on names and stories here.',
		},
	],
	relatedIds: [
		'zodiac-compatibility',
		'numerology-compatibility',
		'friendship-compatibility',
	],
	meta: {
		keywords: [
			'love compatibility',
			'date compatibility',
			'fun relationship calculator',
		],
	},
}

const zodiacCompatibilityBase: CompatibilityCalculatorBase = {
	id: 'zodiac-compatibility',
	slug: 'zodiac-compatibility',
	category: 'compatibility',
	title: 'Zodiac Compatibility Checker',
	shortDescription:
		'Enter two birth dates to reveal their zodiac signs, compatibility score, and a short interpretation.',
	longDescription:
		'This calculator determines each zodiac sign from the supplied birth dates and uses a fixed compatibility matrix to create a playful score. It is perfect for self-reflection, journaling prompts, or light-hearted conversations.',
	contentLocale: 'en',
	tags: ['compatibility', 'zodiac', 'astrology', 'relationships'],
	inputs: [
		{
			name: 'dateA',
			label: 'Birth date #1',
			type: 'date',
			defaultValue: defaultBirthDate(26),
			validation: {
				required: true,
				message: 'Select the first birth date',
			},
		},
		{
			name: 'dateB',
			label: 'Birth date #2',
			type: 'date',
			defaultValue: defaultBirthDate(24),
			validation: {
				required: true,
				message: 'Select the second birth date',
			},
		},
	],
	outputs: [
		{
			name: 'signA',
			label: 'Sign (person 1)',
		},
		{
			name: 'signB',
			label: 'Sign (person 2)',
		},
		{
			name: 'compatibilityScore',
			label: 'Compatibility score',
		},
		{
			name: 'interpretation',
			label: 'Interpretation',
		},
	],
	calculate: calculateZodiacCompatibility,
	howToBullets: [
		'Enter two birth dates (any year works).',
		'The calculator finds each zodiac sign automatically.',
		'It looks up the pairing in a fixed compatibility matrix—no randomness involved.',
		'You receive the sign names, a 0–100 score, and a short interpretation.',
		'Use the result to start a conversation, journal entry, or playful debate.',
		'Run multiple scenarios if you want to compare different dates.',
		'No information is saved or sent to a server; everything happens in your browser.',
		'Remember: results are for entertainment and self-reflection only.',
	],
	examples: [
		{
			id: 'zodiac-example-1',
			title: 'Example: 1990-08-04 + 1992-12-01',
			inputDescription: 'Birth dates convert to Leo and Sagittarius',
			steps: [
				'Enter 1990-08-04 and 1992-12-01',
				'Tap Calculate',
				'Signs: Leo + Sagittarius',
				'Score: 91% – Fantastic chemistry',
			],
			resultDescription:
				'Great for couples who want a fire-sign pulse check before planning a milestone date.',
		},
		{
			id: 'zodiac-example-2',
			title: 'Example: 1985-01-10 + 1987-10-18',
			inputDescription: 'Capricorn meets Libra',
			steps: [
				'Enter 1985-01-10 and 1987-10-18',
				'Tap Calculate',
				'Signs: Capricorn + Libra',
				'Score: 63% – Mixed signals',
			],
			resultDescription:
				'Suggests adjusting pace and expectations to keep things steady.',
		},
		{
			id: 'zodiac-example-3',
			title: 'Example: 1993-06-05 + 1994-02-14',
			inputDescription: 'Gemini with Aquarius',
			steps: [
				'Enter 1993-06-05 and 1994-02-14',
				'Tap Calculate',
				'Signs: Gemini + Aquarius',
				'Score: 85% – Strong potential',
			],
			resultDescription:
				'Perfect for friends or partners planning creative collaborations.',
		},
	],
	faq: [
		{
			question: 'Do I need the birth time?',
			answer:
				'No. This tool only needs calendar dates and uses Western sun-sign boundaries.',
		},
		{
			question: 'Is the compatibility matrix random?',
			answer:
				'No. Each pairing references a fixed table so the same dates always yield the same score.',
		},
		{
			question: 'Can I compare more than two people?',
			answer:
				'Run the calculator multiple times with different date pairs and compare the results.',
		},
		{
			question: 'Why do some signs seem to score higher?',
			answer:
				'Fire-fire and water-water pairings often receive higher numbers, matching common astrology themes.',
		},
		{
			question: 'What if two people share the same birthday?',
			answer:
				'You’ll see identical sign names and a balanced score—fun for twins or “birthday twins.”',
		},
		{
			question: 'Does a low score mean the relationship is doomed?',
			answer:
				'Absolutely not. Treat it as a playful insight, not a prediction.',
		},
		{
			question: 'Does the tool store my dates or signs?',
			answer:
				'No. Calculations happen instantly in your browser and are not saved.',
		},
		{
			question: 'Can I use this for friendships or work relationships?',
			answer:
				'Definitely. Many people use it for any connection where curiosity and fun matter.',
		},
		{
			question: 'Is Vedic/Jyotish astrology supported?',
			answer:
				'This calculator currently uses Western sun-sign boundaries only.',
		},
		{
			question: 'Can the score change over time?',
			answer:
				'It only changes if you enter different dates. The matrix itself is static.',
		},
		{
			question: 'What about cusp birthdays?',
			answer:
				'We follow standard date ranges. If you’re on a cusp, try both dates for fun.',
		},
		{
			question: 'Is this advice for real-life decisions?',
			answer:
				'No. Use it for entertainment, then talk to the people in your life for actual decisions.',
		},
		{
			question: 'Can I embed this calculator on my blog?',
			answer:
				'Not yet. Share the URL instead so readers always see the latest version.',
		},
		{
			question: 'Does the matrix cover all 12 x 12 pairs?',
			answer:
				'Yes. Every sign combination has a predefined score, even if it defaults to a balanced 60%.',
		},
		{
			question: 'Why is the interpretation short?',
			answer:
				'We keep it concise so you can add your own reflections or discussions afterward.',
		},
		{
			question: 'Want a number-focused perspective too?',
			answer:
				'Pair this with the [Numerology Compatibility Calculator](compatibility/numerology-compatibility) to see how your life path numbers line up alongside zodiac chemistry.',
		},
	],
	relatedIds: ['birth-date-compatibility', 'numerology-compatibility'],
	meta: {
		keywords: [
			'zodiac compatibility',
			'birth date zodiac calculator',
			'astrology compatibility score',
		],
	},
	seo: {
		title: 'Zodiac Compatibility Calculator',
		description:
			'Enter two birth dates to reveal their zodiac signs, compatibility score, and short interpretation. Entertainment and self-reflection only.',
		schema: {
			applicationSubCategory: 'EntertainmentCalculator',
		},
	},
}

const numerologyCompatibilityBase: CompatibilityCalculatorBase = {
	id: 'numerology-compatibility',
	slug: 'numerology-compatibility',
	category: 'compatibility',
	title: 'Numerology Compatibility (Life Path Numbers)',
	shortDescription:
		'Turn two birth dates into life path numbers, compare the pairing, and read a friendly interpretation.',
	longDescription:
		'Enter two birth dates to calculate classic life path numbers and see how they interact. The calculator relies on a deterministic scoring matrix inspired by numerology traditions, so you always get the same score for the same dates. Treat every result as entertainment and self-reflection, not professional advice.',
	contentLocale: 'en',
	tags: ['numerology', 'life-path', 'compatibility', 'entertainment'],
	inputs: [
		{
			name: 'dateA',
			label: 'Birth date #1',
			type: 'date',
			defaultValue: defaultBirthDate(27),
			validation: {
				required: true,
				message: 'Select the first birth date',
			},
		},
		{
			name: 'dateB',
			label: 'Birth date #2',
			type: 'date',
			defaultValue: defaultBirthDate(24),
			validation: {
				required: true,
				message: 'Select the second birth date',
			},
		},
	],
	outputs: [
		{
			name: 'lifePathA',
			label: 'Life path (person 1)',
		},
		{
			name: 'lifePathB',
			label: 'Life path (person 2)',
		},
		{
			name: 'compatibilityScore',
			label: 'Compatibility score',
		},
		{
			name: 'interpretation',
			label: 'Interpretation',
		},
	],
	calculate: calculateNumerologyCompatibility,
	howToBullets: [
		'Enter any two birth dates (past or present).',
		'We sum the digits to create each life path number.',
		'A deterministic scoring matrix compares the two paths.',
		'Life path values plus the compatibility percentage display instantly.',
		'Read the interpretation paragraph for context and journaling prompts.',
		'Repeat the calculation if you want to compare multiple connections.',
		'Share the result with friends as a playful conversation starter.',
		'Remember: entertainment and self-reflection only.',
	],
	examples: [
		{
			id: 'numerology-example-1',
			title: 'Example: 1991-04-07 & 1992-11-15',
			inputDescription: 'Dates convert to life paths 4 and 1',
			steps: [
				'Enter 1991-04-07 and 1992-11-15',
				'Tap Calculate',
				'Life paths: 4 + 1',
				'Score: 68% – Balanced potential',
			],
			resultDescription:
				'Great for couples who appreciate structure but need occasional flexibility.',
		},
		{
			id: 'numerology-example-2',
			title: 'Example: 1988-11-23 & 1996-05-19',
			inputDescription: 'Produces life paths 6 and 3',
			steps: [
				'Enter 1988-11-23 and 1996-05-19',
				'Tap Calculate',
				'Life paths: 6 + 3',
				'Score: 82% – Strong creative spark',
			],
			resultDescription:
				'Highlights the caring + expressive combo that thrives on shared projects.',
		},
		{
			id: 'numerology-example-3',
			title: 'Example: 1999-07-29 & 1999-08-02',
			inputDescription: 'Same year friends with paths 1 and 1',
			steps: [
				'Enter 1999-07-29 and 1999-08-02',
				'Tap Calculate',
				'Life paths: 1 + 1',
				'Score: 91% – Matching drive',
			],
			resultDescription:
				'Demonstrates how identical life paths often earn high scores for momentum.',
		},
		{
			id: 'numerology-example-4',
			title: 'Example: 1978-02-11 & 1980-12-24',
			inputDescription: 'Yields master number 11 with life path 6',
			steps: [
				'Enter 1978-02-11 and 1980-12-24',
				'Tap Calculate',
				'Life paths: 11 + 6',
				'Score: 74% – Intentional teamwork',
			],
			resultDescription:
				'Shows how master numbers boost the score while still suggesting mindful planning.',
		},
	],
	faq: [
		{
			question: 'How are life path numbers calculated?',
			answer:
				'We add all digits in YYYYMMDD format and reduce to a single digit, keeping master numbers 11 and 22 intact.',
		},
		{
			question: 'Do I need the exact birth time?',
			answer:
				'No. Life path numbers only use the date, so time and location are not required.',
		},
		{
			question: 'Can this replace professional numerology readings?',
			answer:
				'It cannot. This is an entertainment tool for quick self-reflection.',
		},
		{
			question: 'Does the score ever change for the same dates?',
			answer:
				'No. The scoring matrix is deterministic, so identical inputs always return the same result.',
		},
		{
			question: 'What does a high compatibility score mean?',
			answer:
				'It indicates the life path pairing is traditionally considered harmonious, perfect for journaling or planning fun activities.',
		},
		{
			question: 'What if the score is low?',
			answer:
				'Use it as a conversation starter. Different life paths add perspective and growth.',
		},
		{
			question: 'Are master numbers treated differently?',
			answer:
				'Yes. Life paths 11 and 22 receive gentle boosts and extra interpretation notes.',
		},
		{
			question: 'Can I compare friendships or coworkers?',
			answer:
				'Absolutely—run it for any two people when you want a playful compatibility snapshot.',
		},
		{
			question: 'Is my data stored anywhere?',
			answer:
				'No. Everything is calculated instantly in your browser and never saved.',
		},
		{
			question: 'Does numerology guarantee relationship outcomes?',
			answer:
				'No. Real relationships depend on communication, boundaries, and professional guidance when needed.',
		},
		{
			question: 'Why do identical life paths score higher?',
			answer:
				'Matching numbers often point to shared pacing and priorities, so the algorithm adds a small boost.',
		},
		{
			question: 'Can I use different calendar systems?',
			answer:
				'The calculator expects Gregorian dates in YYYY-MM-DD format. Convert other calendars before entering.',
		},
		{
			question: 'Does this support more than two people?',
			answer:
				'Run multiple comparisons if you want to map dynamics inside a group.',
		},
		{
			question: 'What if I am on the cusp of two life paths?',
			answer:
				'Use the official birth certificate date, then explore how the interpretation resonates.',
		},
		{
			question: 'Can I cite this calculator for serious decisions?',
			answer:
				'Please do not. Treat it as a playful resource alongside real conversations and expert advice.',
		},
		{
			question: 'Need sign-based context too?',
			answer:
				'Use the [Zodiac Compatibility Checker](compatibility/zodiac-compatibility) alongside numerology to compare life path numbers with elemental chemistry.',
		},
	],
	relatedIds: ['birth-date-compatibility', 'zodiac-compatibility'],
	meta: {
		keywords: [
			'numerology compatibility',
			'life path number calculator',
			'fun relationship numerology',
		],
	},
	seo: {
		title: 'Numerology Compatibility Calculator',
		description:
			'Compare two life path numbers derived from birth dates and get a fun compatibility score with a short interpretation.',
		schema: {
			applicationSubCategory: 'LifestyleCalculator',
		},
	},
}

const friendshipCompatibilityBase: CompatibilityCalculatorBase = {
	id: 'friendship-compatibility',
	slug: 'friendship-compatibility',
	category: 'compatibility',
	title: 'Friendship Compatibility Calculator',
	shortDescription:
		'Enter two birth dates to see a playful friendship score plus communication, trust, and energy highlights.',
	longDescription:
		'This calculator reuses the same scoring engine as our birth date compatibility tool but shifts the interpretation toward friendships. It breaks the results into communication, trust, and shared energy signals so you can plan meetups, road trips, or downtime with more intention. Use it strictly for entertainment and self-reflection.',
	contentLocale: 'en',
	tags: ['friendship', 'compatibility', 'birth-date', 'self-reflection'],
	inputs: [
		{
			name: 'dateA',
			label: 'Friend birth date #1',
			type: 'date',
			defaultValue: defaultBirthDate(23),
			validation: {
				required: true,
				message: 'Enter the first birth date',
			},
		},
		{
			name: 'dateB',
			label: 'Friend birth date #2',
			type: 'date',
			defaultValue: defaultBirthDate(22),
			validation: {
				required: true,
				message: 'Enter the second birth date',
			},
		},
	],
	outputs: [
		{
			name: 'overallCompatibility',
			label: 'Overall friendship score',
		},
		{
			name: 'communication',
			label: 'Communication flow',
		},
		{
			name: 'trust',
			label: 'Trust signal',
		},
		{
			name: 'energy',
			label: 'Shared energy',
		},
		{
			name: 'interpretation',
			label: 'Interpretation',
		},
	],
	calculate: calculateFriendshipCompatibility,
	howToBullets: [
		'Enter each friend’s birth date (no need for year alignment).',
		'Hit Calculate to generate the overall score plus three quick signals.',
		'Communication highlights how easy it is to talk or plan.',
		'Trust reflects comfort levels for honest conversations and support.',
		'Shared energy suggests whether to plan chill time or high-action outings.',
		'Use screenshots or shared links as conversation starters.',
		'Repeat the process with different friends or group pairings.',
		'Remember: results are for entertainment and self-reflection only.',
	],
	examples: [
		{
			id: 'friend-example-1',
			title: 'Example: 1998-03-21 & 1997-09-12',
			inputDescription: 'Roommates planning a reunion trip',
			steps: [
				'Enter 1998-03-21 and 1997-09-12',
				'Tap Calculate',
				'Score: 79% overall',
				'Communication: 82%, Trust: 75%, Energy: 80%',
			],
			resultDescription:
				'Suggests booking an itinerary that balances deep talks with spontaneous adventures.',
		},
		{
			id: 'friend-example-2',
			title: 'Example: 2000-01-05 & 1999-11-30',
			inputDescription: 'Coworkers-turned-friends',
			steps: [
				'Enter 2000-01-05 and 1999-11-30',
				'Tap Calculate',
				'Score: 62% overall',
				'Communication: 58%, Trust: 66%, Energy: 63%',
			],
			resultDescription:
				'The interpretation recommends structured check-ins before launching side projects together.',
		},
		{
			id: 'friend-example-3',
			title: 'Example: 1995-07-18 & 1995-07-18',
			inputDescription: 'Birthday twins celebrating yearly traditions',
			steps: [
				'Enter the same date twice',
				'Tap Calculate',
				'Score: 90% overall',
				'Communication: 92%, Trust: 89%, Energy: 88%',
			],
			resultDescription:
				'Identical dates highlight how shared pacing fuels effortless planning.',
		},
	],
	faq: [
		{
			question: 'Why does the calculator need birth dates for friendships?',
			answer:
				'We reuse the same date-based scoring engine as our relationship calculator to keep results consistent.',
		},
		{
			question: 'Is this information stored anywhere?',
			answer:
				'No. Everything is calculated instantly in your browser and never saved to our servers.',
		},
		{
			question: 'Does a high score guarantee we will stay friends?',
			answer:
				'No. Treat the score as a conversation starter, not a promise about the future.',
		},
		{
			question: 'Can I use this for siblings or cousins?',
			answer:
				'Absolutely. Any two people can be compared as long as you have their birthdays.',
		},
		{
			question: 'What if we only know the birth month?',
			answer:
				'Pick your best guess or placeholder date—the tool is meant for reflection, not official records.',
		},
		{
			question: 'Why do communication and trust sometimes differ a lot?',
			answer:
				'Each metric uses a different part of the date math, which makes the breakdown more varied.',
		},
		{
			question: 'Does the tool make friendship recommendations?',
			answer:
				'It provides playful ideas in the interpretation text, but you decide what actually fits your bond.',
		},
		{
			question: 'Can I compare more than two friends?',
			answer:
				'Run the calculator multiple times and keep notes if you want a bigger picture of your group dynamics.',
		},
		{
			question: 'Are the scores deterministic?',
			answer:
				'Yes. Identical date inputs always generate the same numbers.',
		},
		{
			question: 'Do I need to share my name or email?',
			answer:
				'No. Birth dates are the only inputs, and they never leave your device.',
		},
		{
			question: 'What if the energy score is low?',
			answer:
				'Use it as a reminder to alternate between quiet catch-ups and high-energy plans.',
		},
		{
			question: 'Can this replace honest conversations?',
			answer:
				'Never. Use the output to spark discussions, then rely on real communication to keep the friendship healthy.',
		},
		{
			question: 'Will you add group compatibility in the future?',
			answer:
				'We are exploring it. For now, pair-by-pair comparisons are the easiest way to map a group.',
		},
		{
			question: 'Is it okay to share results on social media?',
			answer:
				'Sure—as long as both friends are comfortable sharing their birth dates publicly.',
		},
		{
			question: 'Does the calculator work on mobile?',
			answer:
				'Yes. The form and results are optimized for both phones and desktops.',
		},
		{
			question: 'Planning to collaborate on a project together?',
			answer:
				'Run the [Work & Team Compatibility Calculator](compatibility/work-compatibility) for sprint-friendly tips, then come back here to plan hangouts and recharge sessions.',
		},
	],
	relatedIds: ['birth-date-compatibility', 'work-compatibility'],
	meta: {
		keywords: [
			'friendship compatibility calculator',
			'birth date friendship score',
			'communication trust energy quiz',
		],
	},
	seo: {
		title: 'Friendship Compatibility Calculator',
		description:
			'Check friendship compatibility with a playful birth date calculator featuring communication, trust, and energy breakdowns.',
		schema: {
			applicationSubCategory: 'LifestyleCalculator',
		},
	},
}

const workCompatibilityBase: CompatibilityCalculatorBase = {
	id: 'work-compatibility',
	slug: 'work-compatibility',
	category: 'compatibility',
	title: 'Work & Team Compatibility Calculator',
	shortDescription:
		'Enter two birth dates to see collaboration, communication, and planning scores plus tailored teamwork tips.',
	longDescription:
		'This work-focused calculator reuses the deterministic date engine from our relationship tools to highlight collaboration chemistry for colleagues, co-founders, or study partners. It produces three quick indicators and a set of actionable recommendations so you can plan meetings, sprints, or co-created projects with more intention. Treat every insight as entertainment and self-reflection.',
	contentLocale: 'en',
	tags: ['work', 'team', 'compatibility', 'collaboration', 'self-reflection'],
	inputs: [
		{
			name: 'dateA',
			label: 'Teammate birth date #1',
			type: 'date',
			defaultValue: defaultBirthDate(30),
			validation: {
				required: true,
				message: 'Enter the first birth date',
			},
		},
		{
			name: 'dateB',
			label: 'Teammate birth date #2',
			type: 'date',
			defaultValue: defaultBirthDate(28),
			validation: {
				required: true,
				message: 'Enter the second birth date',
			},
		},
	],
	outputs: [
		{
			name: 'collaborationScore',
			label: 'Collaboration score',
		},
		{
			name: 'communicationScore',
			label: 'Communication score',
		},
		{
			name: 'planningScore',
			label: 'Planning & discipline score',
		},
		{
			name: 'recommendations',
			label: 'Best ways to work together',
		},
	],
	calculate: calculateWorkCompatibility,
	howToBullets: [
		'Enter both birth dates. Year does not need to match.',
		'Press Calculate to see collaboration, communication, and planning signals.',
		'Compare the three metrics to choose meeting cadences or pairing styles.',
		'Use the recommendation bullets as lightweight working-agreement ideas.',
		'Re-run the calculator for any duo you want to map inside your team.',
		'Remember: results are for entertainment and self-reflection—not performance reviews.',
	],
	examples: [
		{
			id: 'work-example-1',
			title: 'Example: 1987-04-12 & 1991-10-09',
			inputDescription: 'Product manager + engineering lead',
			steps: [
				'Enter the two dates',
				'Tap Calculate',
				'Collaboration: 83%',
				'Communication: 78%',
				'Planning: 80%',
			],
			resultDescription:
				'Recommendations focus on alternating sprint planning ownership and using async docs.',
		},
		{
			id: 'work-example-2',
			title: 'Example: 1995-06-03 & 1998-02-27',
			inputDescription: 'Early-career duo building a side project',
			steps: [
				'Enter the two dates',
				'Tap Calculate',
				'Collaboration: 64%',
				'Communication: 59%',
				'Planning: 62%',
			],
			resultDescription:
				'Suggests adding weekly check-ins and documenting decisions right away.',
		},
		{
			id: 'work-example-3',
			title: 'Example: 1980-12-05 & 1980-12-05',
			inputDescription: 'Co-founders with the same birthday',
			steps: [
				'Enter identical dates',
				'Tap Calculate',
				'Collaboration: 90%',
				'Communication: 92%',
				'Planning: 88%',
			],
			resultDescription:
				'Highlights how mirrored pacing helps them co-lead strategic planning sessions.',
		},
	],
	faq: [
		{
			question: 'Why does a work calculator use birth dates?',
			answer:
				'We reuse the same deterministic date engine as other compatibility tools so every duo can compare signals consistently.',
		},
		{
			question: 'Is this an HR assessment?',
			answer:
				'No. It is an entertainment and self-reflection tool meant for informal team conversations.',
		},
		{
			question: 'Does entering my date of birth store any data?',
			answer:
				'No. All calculations run instantly in your browser and are never saved to our servers.',
		},
		{
			question: 'Can I share the recommendations with my team?',
			answer:
				'Definitely—just be sure everyone understands the playful, non-evaluative nature of the tool.',
		},
		{
			question: 'How should we interpret a low collaboration score?',
			answer:
				'Use it as a prompt to clarify roles, expectations, and escalation paths—not as a verdict on anyone’s skills.',
		},
		{
			question: 'Do identical birthdays always yield perfect results?',
			answer:
				'They tend to score high because pacing is similar, but the recommendations still encourage intentional planning.',
		},
		{
			question: 'Can we run this for mentors, study buddies, or volunteer teams?',
			answer:
				'Yes. Any two collaborators can use the calculator as long as you have their birthdays.',
		},
		{
			question: 'Will you add support for entire teams (3+ people)?',
			answer:
				'We are exploring it. For now, compare pairs to map relationships across the group.',
		},
		{
			question: 'Does the calculator adjust for industry or job role?',
			answer:
				'Not yet. Keep the insights high-level and adapt them to your domain.',
		},
		{
			question: 'How many recommendations do we get?',
			answer:
				'You receive 6–8 bullet tips tailored to collaboration, communication, and planning signals.',
		},
		{
			question: 'Can we embed the results in onboarding docs?',
			answer:
				'Feel free to copy the text, provided you note it’s an entertainment tool.',
		},
		{
			question: 'Does timezone or birth time matter?',
			answer:
				'No. Only the calendar date is used in the calculation.',
		},
		{
			question: 'What if I mistype a date?',
			answer:
				'Simply update the input and recalculate—the matrix always returns deterministic results.',
		},
		{
			question: 'Are there accessibility considerations?',
			answer:
				'The form uses standard date pickers and text output compatible with screen readers.',
		},
		{
			question: 'Can I cite this in performance reviews?',
			answer:
				'Please do not. Keep it squarely in the fun, self-reflection category.',
		},
		{
			question: 'Want a lighter friendship-focused view afterward?',
			answer:
				'After setting work agreements here, switch to the [Friendship Compatibility Calculator](compatibility/friendship-compatibility) to plan recharge time as friends.',
		},
	],
	relatedIds: ['friendship-compatibility', 'numerology-compatibility'],
	meta: {
		keywords: [
			'work compatibility calculator',
			'team collaboration score',
			'self reflection work quiz',
		],
	},
	seo: {
		title: 'Work Compatibility Calculator',
		description:
			'Check work compatibility with collaboration, communication, and planning scores plus quick teamwork tips.',
		schema: {
			applicationSubCategory: 'LifestyleCalculator',
		},
	},
}

function defaultBirthDate(yearsAgo: number): string {
	const date = new Date()
	date.setFullYear(date.getFullYear() - yearsAgo)
	return date.toISOString().slice(0, 10)
}

const birthDateCompatibilityBase: CompatibilityCalculatorBase = {
	id: 'birth-date-compatibility',
	slug: 'birth-date-compatibility',
	category: 'compatibility',
	title: 'Birth Date Compatibility Calculator',
	shortDescription:
		'Compare two birth dates to get a playful compatibility score with communication, emotional, and lifestyle breakdowns.',
	longDescription:
		'Enter two birth dates to see a fun compatibility score. This tool summarizes communication, emotional, and lifestyle signals using simple date-based patterns—ideal for icebreakers, journaling prompts, or planning your next conversation.',
	contentLocale: 'en',
	tags: ['compatibility', 'birth-date', 'relationship', 'love-compatibility'],
	inputs: [
		{
			name: 'dateA',
			label: 'Birth date #1',
			type: 'date',
			defaultValue: defaultBirthDate(25),
			validation: {
				required: true,
				message: 'Enter the first birth date',
			},
		},
		{
			name: 'dateB',
			label: 'Birth date #2',
			type: 'date',
			defaultValue: defaultBirthDate(24),
			validation: {
				required: true,
				message: 'Enter the second birth date',
			},
		},
	],
	outputs: [
		{
			name: 'overallCompatibility',
			label: 'Overall compatibility',
		},
		{
			name: 'communication',
			label: 'Communication energy',
		},
		{
			name: 'emotional',
			label: 'Emotional rhythm',
		},
		{
			name: 'lifestyle',
			label: 'Lifestyle pacing',
		},
		{
			name: 'interpretation',
			label: 'Interpretation',
		},
	],
	calculate: calculateBirthDateCompatibility,
	howToBullets: [
		'Enter two birth dates (any calendar year works).',
		'Press Calculate to generate an overall score plus three detailed metrics.',
		'Use the insight paragraph as a journaling prompt or conversation starter.',
		'Compare multiple dates if you want to track different dynamics.',
		'Results do not store any personal data—they are generated instantly in your browser.',
		'Share the score screenshot with a partner or friend if you want a fun icebreaker.',
		'Repeat the calculation whenever you pick a new hypothetical date idea.',
		'Remember: every result is for entertainment and self-reflection only.',
	],
	examples: [
		{
			id: 'bdc-example-1',
			title: 'Example: 1994-05-18 + 1992-11-03',
			inputDescription: 'Two 90s birthdays',
			steps: [
				'Enter 1994-05-18 and 1992-11-03',
				'Tap Calculate',
				'Overall score: 82%',
				'Highlights: Communication 84%, Emotional 79%, Lifestyle 83%',
			],
			resultDescription:
				'Great for couples planning a milestone dinner and wanting a playful preview.',
		},
		{
			id: 'bdc-example-2',
			title: 'Example: 1988-02-07 + 1999-07-22',
			inputDescription: 'Different decades, new friendship',
			steps: [
				'Enter 1988-02-07 and 1999-07-22',
				'Tap Calculate',
				'Overall score: 64%',
				'Highlights: Communication 68%, Emotional 59%, Lifestyle 65%',
			],
			resultDescription:
				'Suggests slowing the pace and comparing expectations early in the friendship.',
		},
		{
			id: 'bdc-example-3',
			title: 'Example: 2001-12-30 + 2001-12-30',
			inputDescription: 'Matching birthdays',
			steps: [
				'Enter the same date twice',
				'Tap Calculate',
				'Overall score: 90%',
				'Highlights: Communication 92%, Emotional 89%, Lifestyle 88%',
			],
			resultDescription:
				'Shows how identical dates often yield balanced scores—fun for twins or close friends.',
		},
	],
	faq: [
		{
			question: 'Is this calculator scientifically validated?',
			answer:
				'No. It uses deterministic patterns for entertainment and self-reflection only.',
		},
		{
			question: 'Can I use the scores to make relationship decisions?',
			answer:
				'Please don’t. Treat the results as a conversation starter, not a definitive answer.',
		},
		{
			question: 'Does the tool store or share my birth dates?',
			answer:
				'No. The calculation happens instantly in your browser and is never saved to a server.',
		},
		{
			question: 'Why do scores sum to different numbers each time?',
			answer:
				'Scores depend on the day, month, and year differences. Identical dates always repeat the same score.',
		},
		{
			question: 'Can I compare multiple people?',
			answer:
				'Yes. Run the calculator as many times as you like to compare different pairs.',
		},
		{
			question: 'What if I only know the month and day?',
			answer:
				'You can use an approximate year. The calculator still generates a consistent score.',
		},
		{
			question: 'Does matching birthdays always mean perfect compatibility?',
			answer:
				'Not necessarily, but identical dates often receive high lifestyle and emotional scores.',
		},
		{
			question: 'Why do communication and lifestyle scores differ?',
			answer:
				'Each dimension uses different parts of the date inputs, highlighting varied patterns.',
		},
		{
			question: 'Can I share the results?',
			answer:
				'Absolutely. Many people screenshot the score to send as a playful message.',
		},
		{
			question: 'Do you plan to add custom messages for zodiac signs?',
			answer:
				'Possibly in the future. Right now the focus is on date-based math for clarity.',
		},
		{
			question: 'Can I export the scores?',
			answer:
				'Not yet. For now the easiest option is to copy or screenshot the results.',
		},
		{
			question: 'Does time of birth matter?',
			answer:
				'This tool does not use time of birth—only the calendar date.',
		},
		{
			question: 'Why do 1980s and 2000s pairs sometimes score lower?',
			answer:
				'Large year gaps reduce the lifestyle score slightly to reflect different life stages.',
		},
		{
			question: 'Is there a best score range?',
			answer:
				'Anything above 70% usually indicates smooth energy, but remember it’s only for fun.',
		},
		{
			question: 'How often should I recalculate?',
			answer:
				'As often as you like—especially if you’re journaling about different connections or hypotheticals.',
		},
		{
			question: 'Want to see how those same dates map to zodiac signs?',
			answer:
				'After checking this score, run the [Zodiac Compatibility Checker](compatibility/zodiac-compatibility) to compare elemental chemistry with your birth-date breakdown.',
		},
	],
	relatedIds: [
		'love-compatibility',
		'zodiac-compatibility',
		'numerology-compatibility',
	],
	meta: {
		keywords: [
			'birth date compatibility',
			'birthday compatibility',
			'fun compatibility calculator',
		],
		author: 'FirstCalc',
	},
	seo: {
		title: 'Birth Date Compatibility Calculator',
		description:
			'Check compatibility based on two birth dates. Fun, instant results with breakdown and explanations.',
		schema: {
			applicationSubCategory: 'EntertainmentCalculator',
		},
	},
}

const compatibilityCalculators: CalculatorDefinition[] = [
	...createCompatibilityEntries(loveCompatibilityBase),
	...createCompatibilityEntries(zodiacCompatibilityBase),
	...createCompatibilityEntries(numerologyCompatibilityBase),
	...createCompatibilityEntries(friendshipCompatibilityBase),
	...createCompatibilityEntries(workCompatibilityBase),
	...createCompatibilityEntries(birthDateCompatibilityBase),
]

/**
 * Registry of all calculator definitions
 * Add new calculators here to make them available
 * Each calculator can have multiple locale versions with the same id
 */
export const calculators: CalculatorDefinition[] = [
	...compatibilityCalculators,
	// Percentage of a Number (EN)
	{
		id: 'percentage-of-a-number',
		slug: 'percentage-of-a-number',
		category: 'math',
		title: 'Percentage of a Number',
		shortDescription:
			'Calculate what a certain percentage of a number is. Useful for discounts, tips, taxes, and other percentage-based calculations.',
		longDescription:
			'This calculator helps you determine what a specific percentage of any number equals. Simply enter the base number and the percentage you want to calculate. Perfect for calculating discounts, tips, taxes, commissions, and any other percentage-based calculations.',
		locale: 'en',
		inputs: [
			{
				name: 'value',
				label: 'Number',
				type: 'number',
				placeholder: 'Enter the number',
				validation: {
					required: true,
					min: 0,
					message: 'Number must be greater than or equal to 0',
				},
			},
			{
				name: 'percent',
				label: 'Percentage',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter the percentage',
				validation: {
					required: true,
					min: 0,
					max: 1000,
					message: 'Percentage must be between 0 and 1000',
				},
			},
		],
		outputs: [
			{
				name: 'result',
				label: 'Result',
				formatType: 'number',
			},
		],
		calculate: calculatePercentageOfNumber,
		howToBullets: [
			'Enter the number you want to calculate a percentage of',
			'Enter the percentage value (e.g., 20 for 20%)',
			'Click "Calculate" to get the result',
			'The result shows what the percentage of the number is',
			'You can use this for discounts, tips, taxes, and more',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Calculate 20% of 100',
				inputDescription: 'Calculate 20% of 100',
				steps: [
					'Number: 100',
					'Percentage: 20%',
					'Calculation: (100 × 20) / 100',
					'Result: 20',
				],
				resultDescription: '20% of 100 equals 20',
			},
			{
				id: 'example-2',
				title: 'Example 2: Calculate 15% tip',
				inputDescription: 'Calculate 15% tip on a $250 bill',
				steps: [
					'Number: 250',
					'Percentage: 15%',
					'Calculation: (250 × 15) / 100',
					'Result: 37.5',
				],
				resultDescription: 'A 15% tip on $250 is $37.50',
			},
			{
				id: 'example-3',
				title: 'Example 3: Calculate discount',
				inputDescription: 'Calculate 25% discount on $80',
				steps: [
					'Number: 80',
					'Percentage: 25%',
					'Calculation: (80 × 25) / 100',
					'Result: 20',
				],
				resultDescription: 'A 25% discount on $80 is $20',
			},
		],
		faq: [
			{
				question: 'How do I calculate a percentage of a number?',
				answer:
					'To calculate a percentage of a number, multiply the number by the percentage and divide by 100. For example, 20% of 100 = (100 × 20) / 100 = 20.',
			},
			{
				question: 'Can I use this for discounts?',
				answer:
					'Yes! Enter the original price as the number and the discount percentage. The result will show the discount amount.',
			},
			{
				question: 'What if I want to calculate a tip?',
				answer:
					'Enter the bill amount as the number and the tip percentage (e.g., 15 for 15% tip). The result will show the tip amount.',
			},
			{
				question: 'Can I calculate percentages greater than 100%?',
				answer:
					'Yes, you can enter percentages greater than 100%. For example, 150% of 100 equals 150.',
			},
			{
				question: 'How do I calculate sales tax?',
				answer:
					'Enter the purchase amount as the number and the tax rate as the percentage. The result will show the tax amount.',
			},
		],
		relatedIds: ['add-percentage', 'subtract-percentage', 'loan-payment'],
		standardIds: [],
		meta: {
			keywords: ['percentage', 'calculation', 'math', 'discount', 'tip', 'tax'],
		},
	},
	// Add Percentage (EN)
	{
		id: 'add-percentage',
		slug: 'add-percentage',
		category: 'math',
		title: 'Add Percentage to Number',
		shortDescription:
			'Increase a number by a certain percentage. Useful for calculating price increases, salary raises, and growth rates.',
		longDescription:
			'This calculator helps you add a percentage to a number. Enter the base number and the percentage you want to add. The result will be the original number plus the percentage increase. Perfect for calculating price increases, salary raises, growth rates, and markups.',
		locale: 'en',
		inputs: [
			{
				name: 'value',
				label: 'Number',
				type: 'number',
				placeholder: 'Enter the number',
				validation: {
					required: true,
					min: 0,
					message: 'Number must be greater than or equal to 0',
				},
			},
			{
				name: 'percent',
				label: 'Percentage to Add',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter the percentage',
				validation: {
					required: true,
					min: 0,
					message: 'Percentage must be greater than or equal to 0',
				},
			},
		],
		outputs: [
			{
				name: 'result',
				label: 'Result',
				formatType: 'number',
			},
		],
		calculate: calculateAddPercentage,
		howToBullets: [
			'Enter the base number you want to increase',
			'Enter the percentage you want to add (e.g., 20 for 20%)',
			'Click "Calculate" to get the result',
			'The result shows the original number plus the percentage increase',
			'Formula: Result = Number × (1 + Percentage / 100)',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Add 20% to 100',
				inputDescription: 'Add 20% to 100',
				steps: [
					'Number: 100',
					'Percentage: 20%',
					'Calculation: 100 × (1 + 20/100)',
					'Calculation: 100 × 1.20',
					'Result: 120',
				],
				resultDescription: '100 increased by 20% equals 120',
			},
			{
				id: 'example-2',
				title: 'Example 2: Price increase',
				inputDescription: 'Increase $50 by 15%',
				steps: [
					'Number: 50',
					'Percentage: 15%',
					'Calculation: 50 × (1 + 15/100)',
					'Result: 57.5',
				],
				resultDescription: '$50 increased by 15% equals $57.50',
			},
		],
		faq: [
			{
				question: 'How do I add a percentage to a number?',
				answer:
					'To add a percentage to a number, multiply the number by (1 + percentage/100). For example, 100 + 20% = 100 × 1.20 = 120.',
			},
			{
				question: 'Can I use this for price increases?',
				answer:
					'Yes! Enter the original price and the percentage increase. The result will show the new price.',
			},
			{
				question: 'What if I want to calculate a salary raise?',
				answer:
					'Enter your current salary and the raise percentage. The result will show your new salary.',
			},
			{
				question: 'How is this different from percentage of a number?',
				answer:
					'Adding a percentage increases the original number by that percentage. Calculating a percentage of a number gives you only the percentage amount, not the increased total.',
			},
		],
		relatedIds: ['percentage-of-a-number', 'subtract-percentage'],
		meta: {
			keywords: ['add percentage', 'increase', 'growth', 'raise', 'markup'],
		},
	},
	// Subtract Percentage (EN)
	{
		id: 'subtract-percentage',
		slug: 'subtract-percentage',
		category: 'math',
		title: 'Subtract Percentage from Number',
		shortDescription:
			'Decrease a number by a certain percentage. Useful for calculating discounts, price reductions, and decreases.',
		longDescription:
			'This calculator helps you subtract a percentage from a number. Enter the base number and the percentage you want to subtract. The result will be the original number minus the percentage decrease. Perfect for calculating discounts, price reductions, decreases, and markdowns.',
		locale: 'en',
		inputs: [
			{
				name: 'value',
				label: 'Number',
				type: 'number',
				placeholder: 'Enter the number',
				validation: {
					required: true,
					min: 0,
					message: 'Number must be greater than or equal to 0',
				},
			},
			{
				name: 'percent',
				label: 'Percentage to Subtract',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter the percentage',
				validation: {
					required: true,
					min: 0,
					max: 100,
					message: 'Percentage must be between 0 and 100',
				},
			},
		],
		outputs: [
			{
				name: 'result',
				label: 'Result',
				formatType: 'number',
			},
		],
		calculate: calculateSubtractPercentage,
		howToBullets: [
			'Enter the base number you want to decrease',
			'Enter the percentage you want to subtract (e.g., 20 for 20%)',
			'Click "Calculate" to get the result',
			'The result shows the original number minus the percentage decrease',
			'Formula: Result = Number × (1 - Percentage / 100)',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Subtract 20% from 100',
				inputDescription: 'Subtract 20% from 100',
				steps: [
					'Number: 100',
					'Percentage: 20%',
					'Calculation: 100 × (1 - 20/100)',
					'Calculation: 100 × 0.80',
					'Result: 80',
				],
				resultDescription: '100 decreased by 20% equals 80',
			},
			{
				id: 'example-2',
				title: 'Example 2: Discount calculation',
				inputDescription: 'Apply 30% discount to $200',
				steps: [
					'Number: 200',
					'Percentage: 30%',
					'Calculation: 200 × (1 - 30/100)',
					'Result: 140',
				],
				resultDescription: '$200 with 30% discount equals $140',
			},
		],
		faq: [
			{
				question: 'How do I subtract a percentage from a number?',
				answer:
					'To subtract a percentage from a number, multiply the number by (1 - percentage/100). For example, 100 - 20% = 100 × 0.80 = 80.',
			},
			{
				question: 'Can I use this for discounts?',
				answer:
					'Yes! Enter the original price and the discount percentage. The result will show the discounted price.',
			},
			{
				question: 'What is the maximum percentage I can subtract?',
				answer:
					'You can subtract up to 100%, which would result in 0. However, in practice, discounts are usually less than 100%.',
			},
			{
				question: 'How is this different from calculating a percentage of a number?',
				answer:
					'Subtracting a percentage decreases the original number by that percentage. Calculating a percentage of a number gives you only the percentage amount, not the decreased total.',
			},
		],
		relatedIds: ['percentage-of-a-number', 'add-percentage'],
		standardIds: [],
		meta: {
			keywords: ['subtract percentage', 'discount', 'decrease', 'reduction', 'markdown'],
		},
	},
	// Loan Payment (EN)
	{
		id: 'loan-payment',
		slug: 'loan-payment',
		category: 'finance',
		title: 'Loan Payment Calculator',
		shortDescription:
			'Calculate your loan payment, total interest, and repayment cost. Estimate monthly payments for personal loans, auto loans, and mortgages.',
		longDescription:
			'Calculate loan payments, total interest, and overpayment. Estimate monthly payments for personal loans, auto loans, and mortgages. This calculator uses the standard annuity formula to determine your periodic payment amount, total amount paid over the life of the loan, and total interest cost. Supports monthly, bi-weekly, and weekly payment frequencies.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'loanAmount',
				label: 'Loan Amount',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter loan amount',
				validation: {
					required: true,
					min: 0.01,
					message: 'Loan amount must be greater than 0',
				},
			},
			{
				name: 'annualInterestRate',
				label: 'Annual Interest Rate (APR)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0.01,
					max: 100,
					message: 'Interest rate must be greater than 0 and less than or equal to 100',
				},
			},
			{
				name: 'loanTerm',
				label: 'Loan Term',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter loan term in years',
				validation: {
					required: true,
					min: 1,
					max: 50,
					message: 'Loan term must be between 1 and 50 years',
				},
			},
			{
				name: 'paymentFrequency',
				label: 'Payment Frequency',
				type: 'select',
				options: [
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'bi-weekly', label: 'Bi-weekly' },
					{ value: 'weekly', label: 'Weekly' },
				],
				defaultValue: 'monthly',
				helpText: 'How often you make loan payments',
			},
			{
				name: 'loanType',
				label: 'Loan Type',
				type: 'select',
				options: [
					{ value: 'annuity', label: 'Annuity (Amortizing)' },
					{ value: 'interest-only', label: 'Interest-Only' },
				],
				defaultValue: 'annuity',
				helpText: 'Annuity loans have fixed payments that include principal and interest. Interest-only loans require only interest payments during the term.',
			},
		],
		outputs: [
			{
				name: 'periodicPayment',
				label: 'Loan Payment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalInterest',
				label: 'Total Interest Paid',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalPayment',
				label: 'Total Payment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'overpayment',
				label: 'Overpayment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateLoanPayment,
		howToBullets: [
			'Enter the loan amount - the total amount you are borrowing (principal)',
			'Enter the annual interest rate (APR) as a percentage - this is the cost of borrowing money',
			'Enter the loan term in years - how long you have to repay the loan (must be a whole number between 1 and 50)',
			'Select payment frequency - choose monthly, bi-weekly, or weekly payments',
			'Select loan type - choose annuity (standard amortizing loan) or interest-only',
			'Click "Calculate" to see your periodic payment amount',
			'Review the total interest paid - this shows how much extra you pay beyond the loan amount',
			'Understand the difference between payment and total cost - your payment is what you pay each period, while total payment includes all interest',
			'Consider that longer loan terms result in lower payments but higher total interest (overpayment)',
			'Use the formula explanation to understand how your payment is calculated',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Personal Loan',
				inputDescription:
					'$10,000 personal loan at 8% APR for 5 years with monthly payments',
				steps: [
					'Loan amount: $10,000',
					'Annual interest rate: 8% (APR)',
					'Loan term: 5 years',
					'Payment frequency: Monthly',
					'Loan type: Annuity (amortizing)',
					'Formula: P = L × [r(1+r)^n] / [(1+r)^n - 1]',
					'Monthly payment: $202.76',
					'Total payment: $12,165.84',
					'Total interest: $2,165.84',
					'Overpayment: $2,165.84',
				],
				resultDescription:
					'A $10,000 personal loan at 8% APR for 5 years requires a monthly payment of $202.76. Over the life of the loan, you will pay $12,165.84 total, which includes $2,165.84 in interest. This means you pay 21.7% more than the original loan amount due to interest.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Mortgage-Style Loan',
				inputDescription:
					'$250,000 mortgage at 5% APR for 30 years with monthly payments',
				steps: [
					'Loan amount: $250,000',
					'Annual interest rate: 5% (APR)',
					'Loan term: 30 years',
					'Payment frequency: Monthly',
					'Loan type: Annuity (amortizing)',
					'Formula: P = L × [r(1+r)^n] / [(1+r)^n - 1]',
					'Monthly payment: $1,342.05',
					'Total payment: $483,139.20',
					'Total interest: $233,139.20',
					'Overpayment: $233,139.20',
				],
				resultDescription:
					'A $250,000 mortgage at 5% APR for 30 years requires a monthly payment of $1,342.05. Over 30 years, you will pay $483,139.20 total, which includes $233,139.20 in interest. This demonstrates how longer loan terms result in significantly higher total interest costs, even with a relatively low interest rate.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Short-Term Loan',
				inputDescription:
					'$15,000 loan at 6% APR for 3 years with monthly payments',
				steps: [
					'Loan amount: $15,000',
					'Annual interest rate: 6% (APR)',
					'Loan term: 3 years',
					'Payment frequency: Monthly',
					'Loan type: Annuity (amortizing)',
					'Formula: P = L × [r(1+r)^n] / [(1+r)^n - 1]',
					'Monthly payment: $456.33',
					'Total payment: $16,427.88',
					'Total interest: $1,427.88',
					'Overpayment: $1,427.88',
				],
				resultDescription:
					'A $15,000 loan at 6% APR for 3 years requires a monthly payment of $456.33. While the monthly payment is higher than a longer-term loan, the total interest paid is only $1,427.88 (9.5% of the loan amount). Shorter loan terms result in higher payments but lower total interest costs.',
			},
		],
		faq: [
			{
				question: 'What is a loan payment?',
				answer:
					'A loan payment is the periodic amount you pay to your lender, typically monthly, bi-weekly, or weekly. For amortizing loans, each payment includes both principal (the original loan amount) and interest (the cost of borrowing). The payment amount remains constant, but the proportion of principal vs. interest changes over time.',
			},
			{
				question: 'What is APR?',
				answer:
					'APR (Annual Percentage Rate) is the annual interest rate charged on a loan. It represents the true cost of borrowing money, expressed as a percentage. APR includes the base interest rate and may include other fees, making it a more accurate measure of loan cost than the interest rate alone.',
			},
			{
				question: 'What is the difference between monthly and bi-weekly payments?',
				answer:
					'Monthly payments are made 12 times per year, while bi-weekly payments are made 26 times per year (every two weeks). Bi-weekly payments result in 13 full monthly payments per year, which can help you pay off your loan faster and reduce total interest. However, bi-weekly payments are typically half the monthly payment amount, so you pay more frequently.',
			},
			{
				question: 'How does interest rate affect my loan payment?',
				answer:
					'Higher interest rates increase both your periodic payment amount and total interest paid over the life of the loan. For example, a $100,000 loan at 3% for 30 years has a monthly payment of $421.60, while the same loan at 6% has a payment of $599.55. The interest rate directly impacts the cost of borrowing money.',
			},
			{
				question: 'What is overpayment?',
				answer:
					'Overpayment is the total amount you pay in interest over the life of the loan. It represents the extra cost beyond the original loan amount. For example, if you borrow $10,000 and pay $2,000 in interest, your overpayment is $2,000. This is also called the total interest cost.',
			},
			{
				question: 'Can I reduce my loan payment?',
				answer:
					'Yes, you can reduce your loan payment by: extending the loan term (longer repayment period), negotiating a lower interest rate, making a larger down payment (reducing the loan amount), or refinancing the loan. However, longer terms typically result in higher total interest costs.',
			},
			{
				question: 'What is the difference between short and long loan terms?',
				answer:
					'Short loan terms (e.g., 3-5 years) result in higher monthly payments but lower total interest costs. Long loan terms (e.g., 30 years) result in lower monthly payments but significantly higher total interest costs. For example, a $200,000 loan at 5% costs $93,256 in interest over 30 years but only $15,616 over 15 years.',
			},
			{
				question: 'What is the difference between fixed and variable interest rates?',
				answer:
					'Fixed interest rates remain constant throughout the loan term, providing predictable payments. Variable interest rates can change over time based on market conditions, which means your payment amount may increase or decrease. This calculator assumes a fixed interest rate. Variable rate loans require different calculations.',
			},
			{
				question: 'Is this loan payment calculation accurate?',
				answer:
					'Yes, this calculator uses the standard annuity formula (P = L × [r(1+r)^n] / [(1+r)^n - 1]) which is the industry standard for calculating loan payments. However, actual loan payments may vary slightly due to rounding, fees, or lender-specific calculations. Always verify with your lender for exact payment amounts.',
			},
			{
				question: 'What fees are not included in this calculation?',
				answer:
					'This calculator only includes principal and interest payments. It does not include: origination fees, closing costs, property taxes (for mortgages), insurance premiums (homeowners, PMI, auto insurance), late fees, prepayment penalties, or other lender fees. These additional costs can significantly increase your total loan cost.',
			},
			{
				question: 'What is an interest-only loan?',
				answer:
					'An interest-only loan requires you to pay only the interest during the loan term, with the full principal due at the end. This results in lower periodic payments but requires a large lump-sum payment (balloon payment) at maturity. Interest-only loans are typically used for short-term financing or investment properties.',
			},
			{
				question: 'How does payment frequency affect total interest?',
				answer:
					'More frequent payments (weekly or bi-weekly) can reduce total interest if you make the same total annual payment. For example, making 26 bi-weekly payments of $500 each year is equivalent to 13 monthly payments, which pays down principal faster and reduces interest. However, if you simply divide monthly payments, the effect is minimal.',
			},
			{
				question: 'Can I use this calculator for credit cards?',
				answer:
					'This calculator is designed for installment loans with fixed payment schedules. Credit cards have revolving credit with minimum payments that change based on balance, so they require different calculations. Use this calculator for personal loans, auto loans, mortgages, and other fixed-rate installment loans.',
			},
			{
				question: 'What happens if I make extra payments?',
				answer:
					'Making extra payments reduces your principal balance faster, which decreases total interest paid and can shorten your loan term. This calculator shows the standard payment schedule. To see the impact of extra payments, use a loan overpayment calculator that can show how additional payments affect your loan payoff timeline.',
			},
		],
		relatedIds: [
			'loan-overpayment-calculator',
			'loan-comparison-calculator',
			'personal-loan-calculator',
			'take-home-pay-calculator',
		],
		standardIds: [],
		tags: ['finance', 'loans', 'loan-payment', 'interest', 'credit', 'amortization'],
		meta: {
			keywords: [
				'loan payment calculator',
				'monthly payment calculator',
				'loan calculator',
				'mortgage payment calculator',
				'personal loan calculator',
				'auto loan calculator',
				'loan interest calculator',
				'APR calculator',
				'loan payment formula',
				'amortization calculator',
			],
		},
	},
	// Compound Interest (EN)
	{
		id: 'compound-interest',
		slug: 'compound-interest',
		category: 'finance',
		title: 'Compound Interest Calculator',
		shortDescription:
			'Calculate how your investment grows over time with compound interest. See the final amount, total contributions, and interest earned.',
		longDescription:
			'Calculate compound interest on investments and savings. See how your money grows with interest compounding and regular contributions. This calculator helps you plan for long-term financial goals, retirement, and investment growth. Enter your initial investment, monthly contributions, annual interest rate, investment period, and compounding frequency to see detailed year-by-year growth projections.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'initialAmount',
				label: 'Initial Investment Amount',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter initial amount',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Initial amount must be greater than or equal to 0',
				},
			},
			{
				name: 'monthlyContribution',
				label: 'Monthly Contribution',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter monthly contribution',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Monthly contribution must be greater than or equal to 0',
				},
			},
			{
				name: 'annualInterestRate',
				label: 'Annual Interest Rate',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0.01,
					max: 100,
					message: 'Interest rate must be greater than 0 and less than or equal to 100',
				},
			},
			{
				name: 'investmentPeriod',
				label: 'Investment Period',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter number of years',
				validation: {
					required: true,
					min: 1,
					max: 50,
					message: 'Investment period must be between 1 and 50 years',
				},
			},
			{
				name: 'compoundingFrequency',
				label: 'Compounding Frequency',
				type: 'select',
				options: [
					{ value: 'annually', label: 'Annually' },
					{ value: 'quarterly', label: 'Quarterly' },
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'daily', label: 'Daily' },
				],
				defaultValue: 'monthly',
				helpText: 'How often interest is calculated and added to your investment',
			},
		],
		outputs: [
			{
				name: 'finalAmount',
				label: 'Final Investment Value',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalContributions',
				label: 'Total Contributions',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalInterestEarned',
				label: 'Total Interest Earned',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'effectiveAnnualRate',
				label: 'Effective Annual Rate',
				unitLabel: '%',
				formatType: 'percentage',
			},
			{
				name: 'yearBreakdown',
				label: 'Year-by-Year Breakdown',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateCompoundInterest,
		howToBullets: [
			'Define your initial investment amount - the starting balance you invest today',
			'Add regular monthly contributions - enter how much you plan to contribute each month (can be $0)',
			'Choose your annual interest rate - enter the expected annual return as a percentage (e.g., 7 for 7%)',
			'Select the investment period - enter the number of years you plan to invest (must be an integer between 1 and 50)',
			'Select compounding frequency - choose how often interest is calculated (annually, quarterly, monthly, or daily)',
			'Click "Calculate" to see your investment growth projection',
			'Review the final investment value - this is what your investment will be worth at the end of the period',
			'Understand how compounding works - interest is added not only to your initial amount but also to previously earned interest',
			'Check the year-by-year breakdown to see how your investment grows each year',
			'Use the effective annual rate to compare different compounding frequencies',
			'For detailed investment planning, try the Investment Calculator',
			'To compare savings vs investments, use the Investment vs Savings Calculator',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Long-term Investing with Regular Contributions',
				inputDescription:
					'$10,000 initial investment, $200 monthly contributions, 7% annual interest rate, 20 years, monthly compounding',
				steps: [
					'Initial investment: $10,000',
					'Monthly contribution: $200',
					'Annual interest rate: 7%',
					'Investment period: 20 years',
					'Compounding frequency: Monthly (12 times per year)',
					'Formula: Combines future value of initial amount plus future value of monthly contributions',
					'Total contributions: $10,000 + ($200 × 12 × 20) = $58,000',
					'Final amount: Approximately $128,000',
					'Total interest earned: Approximately $70,000',
				],
				resultDescription:
					'After 20 years of investing $10,000 initially and $200 monthly at 7% annual interest with monthly compounding, your investment grows to approximately $128,000. You contributed $58,000 total and earned about $70,000 in interest, demonstrating the power of compound interest over time. For more detailed investment analysis, try the Investment Calculator.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Small Monthly Savings Plan',
				inputDescription:
					'$0 initial investment, $300 monthly contributions, 5% annual interest rate, 10 years, monthly compounding',
				steps: [
					'Initial investment: $0',
					'Monthly contribution: $300',
					'Annual interest rate: 5%',
					'Investment period: 10 years',
					'Compounding frequency: Monthly (12 times per year)',
					'Formula: Future value of annuity (monthly contributions)',
					'Total contributions: $0 + ($300 × 12 × 10) = $36,000',
					'Final amount: Approximately $46,500',
					'Total interest earned: Approximately $10,500',
				],
				resultDescription:
					'Starting with $0 and contributing $300 monthly for 10 years at 5% annual interest with monthly compounding results in approximately $46,500. You contributed $36,000 and earned about $10,500 in interest, showing how consistent small contributions can grow significantly over time.',
			},
			{
				id: 'example-3',
				title: 'Example 3: High-Rate Investment with No Monthly Contributions',
				inputDescription:
					'$5,000 initial investment, $0 monthly contributions, 10% annual interest rate, 15 years, monthly compounding',
				steps: [
					'Initial investment: $5,000',
					'Monthly contribution: $0',
					'Annual interest rate: 10%',
					'Investment period: 15 years',
					'Compounding frequency: Monthly (12 times per year)',
					'Formula: A = P(1 + r/n)^(nt)',
					'Calculation: $5,000 × (1 + 0.10/12)^(12×15)',
					'Total contributions: $5,000',
					'Final amount: Approximately $22,200',
					'Total interest earned: Approximately $17,200',
				],
				resultDescription:
					'A $5,000 investment at 10% annual interest with monthly compounding grows to approximately $22,200 over 15 years. The initial $5,000 more than quadruples, earning about $17,200 in interest, demonstrating the power of compound interest even without additional contributions.',
			},
		],
		faq: [
			{
				question: 'What is compound interest?',
				answer:
					'Compound interest is interest calculated on both the initial principal amount and the accumulated interest from previous periods. Unlike simple interest, which only grows on the original amount, compound interest allows your investment to grow exponentially because interest earns interest over time.',
			},
			{
				question: 'How is compound interest different from simple interest?',
				answer:
					'Simple interest is calculated only on the principal amount and remains constant each period. Compound interest is calculated on the principal plus all previously earned interest, causing your investment to grow at an accelerating rate. Over long periods, compound interest significantly outperforms simple interest.',
			},
			{
				question: 'How often should interest compound?',
				answer:
					'More frequent compounding (daily > monthly > quarterly > annually) results in higher returns because interest is calculated and added more often. However, the difference between monthly and daily compounding is usually small. Monthly compounding is common for most investments and provides a good balance between growth and simplicity.',
			},
			{
				question: 'Is compound interest good or bad?',
				answer:
					'Compound interest is beneficial when you are investing or saving money, as it helps your money grow faster over time. However, it works against you when you borrow money, as interest compounds on your debt. For investments and savings, compound interest is one of the most powerful tools for building wealth.',
			},
			{
				question: 'How can I maximize compound growth?',
				answer:
					'To maximize compound growth: start investing early to give your money more time to compound, invest regularly with monthly contributions, choose investments with higher interest rates when possible, select more frequent compounding when available, and avoid withdrawing funds to let interest compound uninterrupted.',
			},
			{
				question: 'Does inflation affect compound interest?',
				answer:
					'Yes, inflation reduces the purchasing power of your returns over time. While your investment may grow in dollar terms, inflation erodes its real value. It\'s important to consider the real rate of return (nominal rate minus inflation rate) when evaluating long-term investments. Aim for investments that outpace inflation to maintain purchasing power.',
			},
			{
				question: 'What is the difference between monthly and annual compounding?',
				answer:
					'Monthly compounding calculates and adds interest 12 times per year, while annual compounding does so once per year. Monthly compounding results in higher returns because interest is added more frequently and can compound on itself sooner. The difference becomes more significant over longer investment periods and higher interest rates.',
			},
			{
				question: 'What happens if I don\'t make monthly contributions?',
				answer:
					'If you set monthly contributions to $0, the calculator will only calculate compound interest on your initial investment amount. Your investment will still grow through compound interest, but the growth will be slower than if you were making regular contributions. The final amount will be based solely on the initial investment and the interest it earns.',
			},
			{
				question: 'Is compound interest realistic for real-world investments?',
				answer:
					'Yes, compound interest is realistic and is how most investments actually work, including savings accounts, certificates of deposit (CDs), bonds, and many investment accounts. However, actual returns may vary due to market fluctuations, fees, and changing interest rates. This calculator provides projections based on fixed rates, which is useful for planning but may differ from actual results.',
			},
			{
				question: 'Can I use this calculator for retirement planning?',
				answer:
					'Yes, this calculator is excellent for retirement planning. Enter your current retirement savings as the initial amount, your planned monthly retirement contributions, expected annual return rate, and years until retirement. The calculator will show how much you\'ll have saved and help you determine if you\'re on track to meet your retirement goals.',
			},
			{
				question: 'What is the effective annual rate (EAR)?',
				answer:
					'The effective annual rate (EAR) is the actual annual interest rate you earn when compounding is taken into account. It\'s higher than the nominal (stated) rate when interest compounds more than once per year. EAR helps you compare investments with different compounding frequencies on an equal basis.',
			},
			{
				question: 'How does the investment period affect the final amount?',
				answer:
					'The investment period has a significant impact due to the exponential nature of compound interest. Longer periods allow more time for interest to compound, resulting in exponentially higher returns. Even small differences in time (e.g., 20 vs. 25 years) can result in substantially different final amounts, which is why starting to invest early is so important.',
			},
			{
				question: 'Can I calculate compound interest for different currencies?',
				answer:
					'While the calculator displays results in dollars ($), you can use it with any currency by treating the currency symbol as a placeholder. The calculations work the same regardless of currency, so you can mentally substitute your currency symbol (€, £, ¥, etc.) when interpreting the results.',
			},
			{
				question: 'What if my interest rate changes over time?',
				answer:
					'This calculator assumes a constant interest rate throughout the investment period. If your rate changes, you would need to calculate each period separately. For planning purposes, using an average expected rate is often sufficient, though actual results may vary if rates fluctuate significantly.',
			},
		],
		relatedIds: [
			'investment-calculator',
			'savings-calculator',
			'retirement-calculator',
			'investment-vs-savings-calculator',
		],
		standardIds: [],
		tags: ['finance', 'investments', 'compound-interest', 'savings', 'interest', 'long-term'],
		meta: {
			keywords: [
				'compound interest calculator',
				'investment growth calculator',
				'savings calculator',
				'compound interest formula',
				'investment calculator',
				'retirement calculator',
				'future value calculator',
				'interest calculator',
				'compound interest explained',
				'investment growth projection',
			],
		},
	},
	// Auto Loan (EN)
	{
		id: 'auto-loan-calculator',
		slug: 'auto-loan-calculator',
		category: 'finance',
		title: 'Auto Loan Calculator',
		shortDescription:
			'Estimate your car loan payment, interest cost, and total vehicle price. Calculate monthly payments with down payment, trade-in, taxes, and fees.',
		longDescription:
			'Calculate auto loan payments with down payment, trade-in, taxes, and fees. Estimate monthly car payments and total loan cost. This calculator helps you understand the true cost of financing a vehicle, including how down payments, trade-ins, sales tax, and fees affect your monthly payment and total interest paid. Perfect for comparing financing options and planning your car purchase.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'vehiclePrice',
				label: 'Vehicle Price',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter vehicle price',
				validation: {
					required: true,
					min: 0.01,
					message: 'Vehicle price must be greater than 0',
				},
			},
			{
				name: 'downPayment',
				label: 'Down Payment',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter down payment',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Down payment must be greater than or equal to 0',
				},
			},
			{
				name: 'tradeInValue',
				label: 'Trade-in Value',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter trade-in value',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Trade-in value must be greater than or equal to 0',
				},
			},
			{
				name: 'salesTaxRate',
				label: 'Sales Tax Rate',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter sales tax rate',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					max: 15,
					message: 'Sales tax rate must be between 0 and 15',
				},
			},
			{
				name: 'annualInterestRate',
				label: 'Annual Interest Rate (APR)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0.01,
					max: 30,
					message: 'Interest rate must be greater than 0 and less than or equal to 30',
				},
			},
			{
				name: 'loanTerm',
				label: 'Loan Term',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter loan term',
				validation: {
					required: true,
					min: 1,
					max: 10,
					message: 'Loan term must be between 1 and 10 years',
				},
			},
			{
				name: 'fees',
				label: 'Fees (Registration, Dealer, etc.)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter total fees',
				defaultValue: 0,
				helpText: 'Registration fees, dealer fees, and other one-time costs',
				validation: {
					required: true,
					min: 0,
					message: 'Fees must be greater than or equal to 0',
				},
			},
		],
		outputs: [
			{
				name: 'monthlyPayment',
				label: 'Monthly Auto Loan Payment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'loanAmount',
				label: 'Loan Amount',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalInterest',
				label: 'Total Interest Paid',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalCostOfVehicle',
				label: 'Total Cost of Vehicle',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'overpayment',
				label: 'Overpayment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateAutoLoan,
		howToBullets: [
			'Enter the vehicle price - the total cost of the car you want to purchase',
			'Enter your down payment amount - the cash you pay upfront (can be $0)',
			'Enter your trade-in value - the value of your current vehicle if trading it in (can be $0)',
			'Enter the sales tax rate - your state or local sales tax percentage (typically 0-10%)',
			'Enter the annual interest rate (APR) - the interest rate offered by your lender',
			'Enter the loan term in years - how long you have to repay (typically 3-7 years for auto loans, must be 1-10 years)',
			'Enter any fees - registration fees, dealer fees, and other one-time costs',
			'Click "Calculate" to see your monthly payment and total costs',
			'Review the loan amount - this is what you actually need to finance after down payment, trade-in, taxes, and fees',
			'Understand that APR matters more than price - a lower APR can save thousands in interest even on a more expensive vehicle',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Typical Car Loan',
				inputDescription:
					'$30,000 vehicle with $5,000 down payment at 6% APR for 5 years',
				steps: [
					'Vehicle price: $30,000',
					'Down payment: $5,000',
					'Trade-in value: $0',
					'Sales tax rate: 7%',
					'Annual interest rate: 6% (APR)',
					'Loan term: 5 years',
					'Fees: $500',
					'Taxable amount: $30,000',
					'Sales tax: $2,100',
					'Total vehicle cost: $32,600',
					'Loan amount: $27,600',
					'Monthly payment: $533.31',
					'Total payment: $31,998.60',
					'Total interest: $4,398.60',
				],
				resultDescription:
					'A $30,000 vehicle with $5,000 down payment at 6% APR for 5 years requires a monthly payment of $533.31. After sales tax and fees, the total vehicle cost is $32,600. You finance $27,600 and pay $4,398.60 in interest over 5 years, for a total cost of $32,998.60 (including down payment).',
			},
			{
				id: 'example-2',
				title: 'Example 2: Trade-in Scenario',
				inputDescription:
					'$40,000 vehicle with $0 down payment and $10,000 trade-in at 5% APR for 6 years',
				steps: [
					'Vehicle price: $40,000',
					'Down payment: $0',
					'Trade-in value: $10,000',
					'Sales tax rate: 6%',
					'Annual interest rate: 5% (APR)',
					'Loan term: 6 years',
					'Fees: $800',
					'Taxable amount: $30,000 (price - trade-in)',
					'Sales tax: $1,800',
					'Total vehicle cost: $41,800',
					'Loan amount: $31,800',
					'Monthly payment: $511.23',
					'Total payment: $36,808.56',
					'Total interest: $5,008.56',
				],
				resultDescription:
					'A $40,000 vehicle with a $10,000 trade-in and no down payment at 5% APR for 6 years requires a monthly payment of $511.23. The trade-in reduces your taxable amount and loan amount, resulting in lower monthly payments. You finance $31,800 and pay $5,008.56 in interest over 6 years.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Short-Term Loan',
				inputDescription:
					'$20,000 vehicle with $4,000 down payment at 4% APR for 3 years',
				steps: [
					'Vehicle price: $20,000',
					'Down payment: $4,000',
					'Trade-in value: $0',
					'Sales tax rate: 8%',
					'Annual interest rate: 4% (APR)',
					'Loan term: 3 years',
					'Fees: $400',
					'Taxable amount: $20,000',
					'Sales tax: $1,600',
					'Total vehicle cost: $22,000',
					'Loan amount: $18,000',
					'Monthly payment: $531.43',
					'Total payment: $19,131.48',
					'Total interest: $1,131.48',
				],
				resultDescription:
					'A $20,000 vehicle with $4,000 down payment at 4% APR for 3 years requires a monthly payment of $531.43. While the monthly payment is higher than a longer-term loan, the total interest paid is only $1,131.48 (6.3% of the loan amount). Shorter loan terms result in higher payments but significantly lower total interest costs.',
			},
		],
		faq: [
			{
				question: 'What is an auto loan?',
				answer:
					'An auto loan is a secured loan used to purchase a vehicle. The vehicle serves as collateral, meaning the lender can repossess it if you fail to make payments. Auto loans typically have fixed interest rates and monthly payments over 3-7 years. The loan amount is the vehicle price minus your down payment and trade-in value, plus taxes and fees.',
			},
			{
				question: 'What is the difference between down payment and trade-in?',
				answer:
					'A down payment is cash you pay upfront from your savings. A trade-in is the value of your current vehicle applied toward the purchase. Both reduce your loan amount, but trade-ins may also reduce your taxable amount (sales tax is typically calculated on price minus trade-in). A larger down payment or trade-in lowers your monthly payment and total interest.',
			},
			{
				question: 'What is APR for car loans?',
				answer:
					'APR (Annual Percentage Rate) is the annual interest rate charged on your auto loan. It represents the true cost of borrowing money. Auto loan APRs typically range from 3% to 15% depending on your credit score, loan term, and lender. A lower APR means lower monthly payments and less total interest paid over the life of the loan.',
			},
			{
				question: 'What is the difference between short and long auto loan terms?',
				answer:
					'Short loan terms (3-4 years) result in higher monthly payments but significantly less total interest. Long loan terms (6-7 years) have lower monthly payments but much more total interest. For example, a $30,000 loan at 6% costs $3,645 in interest over 5 years but $5,400 over 7 years. Shorter terms also help you build equity faster and avoid being "upside down" on your loan.',
			},
			{
				question: 'What is the difference between new and used car loans?',
				answer:
					'New car loans typically have lower interest rates (often 0-5% with promotions) and longer terms (up to 7 years). Used car loans usually have higher rates (5-15%) and shorter terms (3-5 years). New cars also depreciate faster, which can leave you "upside down" (owing more than the car is worth) on longer loans.',
			},
			{
				question: 'How do taxes affect auto loans?',
				answer:
					'Sales tax is calculated on the vehicle price (minus trade-in in most states) and added to your loan amount. For example, a $30,000 car with 7% tax adds $2,100 to your loan. This increases your monthly payment and total interest. Some states allow you to pay tax separately, which can reduce your loan amount.',
			},
			{
				question: 'How can I lower my car loan payment?',
				answer:
					'You can lower your payment by: making a larger down payment, trading in a vehicle, negotiating a lower vehicle price, getting a lower APR (improve credit score or shop around), extending the loan term (but this increases total interest), or choosing a less expensive vehicle. Remember that extending the term saves money monthly but costs more overall.',
			},
			{
				question: 'Is 0% APR really free?',
				answer:
					'0% APR financing is typically only available on new cars with excellent credit and is often a promotional offer. While there\'s no interest, you may pay a higher vehicle price or lose other incentives. Always compare the total cost (price + interest) of 0% financing vs. cash rebates and regular financing to determine the best deal.',
			},
			{
				question: 'Should I finance through the dealer or a bank?',
				answer:
					'Compare both options. Dealers may offer promotional rates (especially 0% APR) but may mark up rates for profit. Banks and credit unions often have competitive rates and may offer pre-approval. Get pre-approved from a bank before visiting the dealer to have a baseline for comparison. Dealers may match or beat bank rates to earn your business.',
			},
			{
				question: 'What fees are included in auto loans?',
				answer:
					'Common fees include: registration fees ($50-$500), dealer documentation fees ($100-$500), title fees ($10-$100), and sometimes extended warranty or gap insurance. These fees are typically added to your loan amount, increasing what you finance. Always ask for a breakdown of all fees and negotiate when possible.',
			},
			{
				question: 'What is gap insurance?',
				answer:
					'Gap insurance covers the difference between what you owe on your loan and the car\'s actual value if it\'s totaled or stolen. It\'s especially important if you have a small down payment, long loan term, or the car depreciates quickly. Without gap insurance, you could owe thousands more than the insurance payout.',
			},
			{
				question: 'Can I refinance my auto loan?',
				answer:
					'Yes, you can refinance an auto loan if your credit has improved, interest rates have dropped, or you want to change your payment terms. Refinancing can lower your monthly payment or total interest, but check for prepayment penalties and compare the costs of refinancing vs. keeping your current loan.',
			},
			{
				question: 'What happens if I can\'t make my car payment?',
				answer:
					'Contact your lender immediately to discuss options like payment deferral, loan modification, or temporary payment reduction. Missing payments can result in repossession, damage to your credit score, additional fees, and legal action. Most lenders prefer to work with you rather than repossess the vehicle.',
			},
			{
				question: 'How does my credit score affect my auto loan?',
				answer:
					'Your credit score directly impacts the APR you\'ll receive. Excellent credit (750+) typically gets rates of 3-5%, good credit (700-749) gets 5-7%, fair credit (650-699) gets 7-10%, and poor credit (below 650) may get 10-20% or require a larger down payment. Improving your credit score before applying can save thousands in interest.',
			},
		],
		relatedIds: [
			'loan-payment',
			'personal-loan-calculator',
			'loan-overpayment-calculator',
		],
		standardIds: [],
		tags: ['finance', 'auto-loan', 'car-loan', 'vehicle', 'interest', 'apr', 'down-payment', 'trade-in'],
		meta: {
			keywords: [
				'auto loan calculator',
				'car loan calculator',
				'vehicle loan calculator',
				'car payment calculator',
				'auto loan payment',
				'car financing calculator',
				'auto loan interest calculator',
				'car loan APR calculator',
				'down payment calculator',
				'trade-in calculator',
			],
		},
	},
	// Investment (EN)
	{
		id: 'investment-calculator',
		slug: 'investment-calculator',
		category: 'finance',
		title: 'Investment Calculator',
		shortDescription:
			'Estimate how your investments grow over time with compound returns. Calculate profit, total contributions, and long-term value.',
		longDescription:
			'Calculate investment growth with regular contributions and compound returns. Estimate profit, total contributions, and long-term value. This calculator helps you understand how your investments grow over time through compound returns, showing the difference between your contributions and final value. Perfect for retirement planning, long-term savings goals, and understanding the power of compound returns.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'initialInvestment',
				label: 'Initial Investment',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter initial investment',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Initial investment must be greater than or equal to 0',
				},
			},
			{
				name: 'periodicContribution',
				label: 'Periodic Contribution',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter contribution amount',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Periodic contribution must be greater than or equal to 0',
				},
			},
			{
				name: 'contributionFrequency',
				label: 'Contribution Frequency',
				type: 'select',
				options: [
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'yearly', label: 'Yearly' },
				],
				defaultValue: 'monthly',
				helpText: 'How often you make contributions',
			},
			{
				name: 'expectedAnnualReturn',
				label: 'Expected Annual Return',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter expected annual return',
				validation: {
					required: true,
					min: 0.01,
					max: 30,
					message: 'Expected annual return must be greater than 0 and less than or equal to 30',
				},
			},
			{
				name: 'investmentPeriod',
				label: 'Investment Period',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter investment period',
				validation: {
					required: true,
					min: 1,
					max: 50,
					message: 'Investment period must be between 1 and 50 years',
				},
			},
			{
				name: 'compoundingFrequency',
				label: 'Compounding Frequency',
				type: 'select',
				options: [
					{ value: 'annually', label: 'Annually' },
					{ value: 'quarterly', label: 'Quarterly' },
					{ value: 'monthly', label: 'Monthly' },
				],
				defaultValue: 'monthly',
				helpText: 'How often returns are compounded',
			},
			{
				name: 'inflationRate',
				label: 'Inflation Rate (Optional)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter inflation rate',
				defaultValue: 0,
				helpText: 'Expected annual inflation rate for real value calculation',
				validation: {
					required: true,
					min: 0,
					max: 20,
					message: 'Inflation rate must be between 0 and 20',
				},
			},
		],
		outputs: [
			{
				name: 'finalValue',
				label: 'Final Investment Value',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalContributions',
				label: 'Total Contributions',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalReturn',
				label: 'Total Profit',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'returnPercentage',
				label: 'Return Percentage',
				unitLabel: '%',
				formatType: 'percentage',
			},
			{
				name: 'inflationAdjustedValue',
				label: 'Inflation-Adjusted Value',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'yearlyBreakdown',
				label: 'Year-by-Year Breakdown',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateInvestment,
		howToBullets: [
			'Enter your initial investment - the starting amount you invest today (can be $0)',
			'Enter your periodic contribution - how much you plan to contribute each period (can be $0)',
			'Select contribution frequency - choose monthly or yearly contributions',
			'Enter your expected annual return - the average annual return rate you expect (e.g., 7% for stock market)',
			'Enter the investment period in years - how long you plan to invest (must be an integer between 1 and 50)',
			'Select compounding frequency - choose how often returns are compounded (annually, quarterly, or monthly)',
			'Optionally enter inflation rate - to see the real value in today\'s purchasing power',
			'Click "Calculate" to see your investment growth projection',
			'Review the final investment value - this is what your investment will be worth at the end of the period',
			'Understand the difference between contributions and profit - your contributions are what you put in, profit is the growth from returns',
			'For retirement planning, try the Retirement Calculator to see how much you\'ll need',
			'To compare savings vs investments, use the Investment vs Savings Calculator',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Long-Term Investing',
				inputDescription:
					'$10,000 initial investment, $300 monthly contributions, 7% annual return, 25 years, monthly compounding',
				steps: [
					'Initial investment: $10,000',
					'Monthly contribution: $300',
					'Expected annual return: 7%',
					'Investment period: 25 years',
					'Compounding frequency: Monthly',
					'Formula: Combines future value of initial investment plus future value of monthly contributions',
					'Total contributions: $10,000 + ($300 × 12 × 25) = $100,000',
					'Final value: Approximately $280,000',
					'Total profit: Approximately $180,000',
					'Return percentage: Approximately 180%',
				],
				resultDescription:
					'After 25 years of investing $10,000 initially and $300 monthly at 7% annual return with monthly compounding, your investment grows to approximately $280,000. You contributed $100,000 total and earned about $180,000 in profit, demonstrating the power of compound returns over long investment periods. For retirement planning, try the Retirement Calculator to see how this fits your retirement goals.',
			},
			{
				id: 'example-2',
				title: 'Example 2: No Initial Capital',
				inputDescription:
					'$0 initial investment, $500 monthly contributions, 6% annual return, 15 years, monthly compounding',
				steps: [
					'Initial investment: $0',
					'Monthly contribution: $500',
					'Expected annual return: 6%',
					'Investment period: 15 years',
					'Compounding frequency: Monthly',
					'Formula: Future value of annuity (monthly contributions)',
					'Total contributions: $0 + ($500 × 12 × 15) = $90,000',
					'Final value: Approximately $145,000',
					'Total profit: Approximately $55,000',
					'Return percentage: Approximately 61%',
				],
				resultDescription:
					'Starting with $0 and contributing $500 monthly for 15 years at 6% annual return with monthly compounding results in approximately $145,000. You contributed $90,000 and earned about $55,000 in profit, showing how consistent contributions can build significant wealth even without an initial investment.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Lump-Sum Investment',
				inputDescription:
					'$50,000 initial investment, $0 monthly contributions, 5% annual return, 10 years, monthly compounding',
				steps: [
					'Initial investment: $50,000',
					'Monthly contribution: $0',
					'Expected annual return: 5%',
					'Investment period: 10 years',
					'Compounding frequency: Monthly',
					'Formula: Future value of single sum with compound returns',
					'Total contributions: $50,000',
					'Final value: Approximately $82,350',
					'Total profit: Approximately $32,350',
					'Return percentage: Approximately 65%',
				],
				resultDescription:
					'A $50,000 lump-sum investment at 5% annual return with monthly compounding grows to approximately $82,350 over 10 years. The initial $50,000 more than doubles, earning about $32,350 in profit, demonstrating how compound returns work even without additional contributions.',
			},
		],
		faq: [
			{
				question: 'What is investment return?',
				answer:
					'Investment return is the profit or loss you earn on your investment over time, expressed as a percentage of your initial investment. It represents how much your investment has grown (or decreased) compared to what you originally invested. Returns can come from capital appreciation (increase in value), dividends, interest, or a combination of these.',
			},
			{
				question: 'What is the difference between compound interest and investment return?',
				answer:
					'Compound interest is interest calculated on both the principal and previously earned interest, creating exponential growth. Investment return is a broader term that includes all gains from an investment (capital appreciation, dividends, interest). This calculator uses compound return calculations, which work similarly to compound interest but apply to investment growth rather than just interest payments.',
			},
			{
				question: 'Is expected return guaranteed?',
				answer:
					'No, expected return is not guaranteed. Investment returns vary based on market conditions, economic factors, and the specific investments you choose. Past performance does not guarantee future results. This calculator provides projections based on your assumptions, but actual returns may be higher or lower. Always consider your risk tolerance and investment goals.',
			},
			{
				question: 'What is a good annual return?',
				answer:
					'Good annual returns vary by investment type and risk level. Historically, stocks have averaged 7-10% annually over long periods, bonds 3-5%, and savings accounts 1-3%. A "good" return depends on your goals, time horizon, and risk tolerance. Higher returns typically come with higher risk. For long-term investing, 6-8% is often considered a reasonable expectation for a diversified portfolio.',
			},
			{
				question: 'How does inflation affect investments?',
				answer:
					'Inflation erodes the purchasing power of your investment returns over time. While your investment may grow in dollar terms, inflation reduces its real value. For example, if your investment grows 7% but inflation is 3%, your real return is only 4%. The inflation-adjusted value shows what your investment is worth in today\'s purchasing power, helping you understand the true growth of your wealth.',
			},
			{
				question: 'What is the difference between monthly and yearly contributions?',
				answer:
					'Monthly contributions allow you to invest more frequently, which can help with dollar-cost averaging (buying at different price points) and take advantage of compound returns sooner. Yearly contributions are simpler but may miss opportunities for more frequent compounding. Monthly contributions typically result in slightly higher returns due to more frequent compounding, especially over long periods.',
			},
			{
				question: 'What is the relationship between risk and return?',
				answer:
					'Generally, higher potential returns come with higher risk. Low-risk investments (savings accounts, bonds) offer lower but more predictable returns. High-risk investments (stocks, real estate) offer higher potential returns but with greater volatility and potential for loss. Diversification helps balance risk and return. This calculator assumes a constant return rate, but real investments fluctuate.',
			},
			{
				question: 'What is the difference between long-term and short-term investing?',
				answer:
					'Long-term investing (10+ years) allows more time for compound returns to work, can weather market volatility, and typically produces higher overall returns. Short-term investing (1-3 years) is more susceptible to market fluctuations and may not allow compound returns to fully develop. Long-term investing is generally recommended for retirement and major financial goals.',
			},
			{
				question: 'Can investment returns be negative?',
				answer:
					'Yes, investment returns can be negative. Investments can lose value due to market downturns, economic recessions, poor investment choices, or company-specific issues. This calculator assumes positive returns, but real investments can decline. Diversification, long-term perspective, and understanding your risk tolerance help manage the possibility of negative returns.',
			},
			{
				question: 'How realistic are these investment calculator results?',
				answer:
					'These results are projections based on your assumptions and assume constant returns, which is not realistic. Real investments fluctuate daily, and returns vary year to year. However, over long periods (10+ years), average returns often align with historical averages. Use this calculator for planning and understanding compound returns, but remember that actual results will vary based on market performance.',
			},
			{
				question: 'What is dollar-cost averaging?',
				answer:
					'Dollar-cost averaging is investing a fixed amount regularly (e.g., monthly) regardless of market conditions. This strategy helps reduce the impact of market volatility by buying more shares when prices are low and fewer when prices are high. Monthly contributions in this calculator effectively use dollar-cost averaging, which can help smooth out returns over time.',
			},
			{
				question: 'How does compounding frequency affect returns?',
				answer:
					'More frequent compounding (monthly > quarterly > annually) results in slightly higher returns because returns are calculated and reinvested more often. However, the difference is usually small. For example, 7% compounded monthly vs. annually results in about 0.1-0.2% difference in annual return. Monthly compounding is common for most investments and provides a good balance.',
			},
			{
				question: 'Should I invest monthly or yearly?',
				answer:
					'Monthly investing is generally recommended because it allows for dollar-cost averaging, takes advantage of compound returns sooner, and is easier to budget (smaller amounts). Yearly investing may be simpler but requires larger lump sums and misses opportunities for more frequent compounding. Most investment accounts support automatic monthly contributions.',
			},
			{
				question: 'What is the difference between nominal and real returns?',
				answer:
					'Nominal returns are the actual dollar returns without adjusting for inflation. Real returns are adjusted for inflation and show your purchasing power. For example, if your investment grows 7% but inflation is 3%, your nominal return is 7% but your real return is 4%. Real returns are more meaningful for understanding true wealth growth over long periods.',
			},
		],
		relatedIds: [
			'compound-interest',
			'roi-calculator',
			'investment-vs-savings-calculator',
			'retirement-calculator',
		],
		standardIds: [],
		tags: ['finance', 'investments', 'investment-calculator', 'returns', 'compound-interest', 'long-term'],
		meta: {
			keywords: [
				'investment calculator',
				'investment growth calculator',
				'investment return calculator',
				'compound return calculator',
				'investment profit calculator',
				'long-term investment calculator',
				'investment planning calculator',
				'retirement calculator',
				'investment growth projection',
				'compound interest calculator',
			],
		},
	},
	// Loan Overpayment (EN)
	{
		id: 'loan-overpayment-calculator',
		slug: 'loan-overpayment-calculator',
		category: 'finance',
		title: 'Loan Overpayment Calculator',
		shortDescription:
			'See how much interest you overpay on a loan and how to reduce it. Calculate total interest cost and savings from extra payments.',
		longDescription:
			'Calculate loan overpayment and total interest cost. Find out how much extra you pay on a loan and how to reduce interest expenses. This calculator shows the true cost of borrowing money - the overpayment (total interest) you pay beyond the principal. Learn how extra payments can significantly reduce interest costs and shorten your loan term.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'loanAmount',
				label: 'Loan Amount',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter loan amount',
				validation: {
					required: true,
					min: 0.01,
					message: 'Loan amount must be greater than 0',
				},
			},
			{
				name: 'annualInterestRate',
				label: 'Annual Interest Rate (APR)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0.01,
					max: 30,
					message: 'Interest rate must be greater than 0 and less than or equal to 30',
				},
			},
			{
				name: 'loanTerm',
				label: 'Loan Term',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter loan term',
				validation: {
					required: true,
					min: 1,
					max: 50,
					message: 'Loan term must be between 1 and 50 years',
				},
			},
			{
				name: 'paymentFrequency',
				label: 'Payment Frequency',
				type: 'select',
				options: [
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'bi-weekly', label: 'Bi-weekly' },
				],
				defaultValue: 'monthly',
				helpText: 'How often you make payments',
			},
			{
				name: 'extraMonthlyPayment',
				label: 'Extra Monthly Payment (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter extra payment',
				defaultValue: 0,
				helpText: 'Additional amount paid each month to reduce interest',
				validation: {
					required: true,
					min: 0,
					message: 'Extra payment must be greater than or equal to 0',
				},
			},
			{
				name: 'loanType',
				label: 'Loan Type',
				type: 'select',
				options: [
					{ value: 'annuity', label: 'Annuity (Fixed Payment)' },
					{ value: 'interest-only', label: 'Interest-Only' },
				],
				defaultValue: 'annuity',
				helpText: 'Annuity loans have fixed payments. Interest-only loans only pay interest.',
			},
		],
		outputs: [
			{
				name: 'overpayment',
				label: 'Loan Overpayment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalInterest',
				label: 'Total Interest Paid',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalPayment',
				label: 'Total Payment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'regularPayment',
				label: 'Regular Monthly Payment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'interestSaved',
				label: 'Interest Saved',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'loanDurationReduced',
				label: 'Loan Term Reduction',
				unitLabel: 'years',
				formatType: 'number',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateLoanOverpayment,
		howToBullets: [
			'Enter the loan amount - the total amount you borrowed',
			'Enter the annual interest rate (APR) - the interest rate charged by your lender',
			'Enter the loan term in years - how long you have to repay the loan (must be an integer between 1 and 50)',
			'Select payment frequency - choose monthly or bi-weekly payments',
			'Optionally enter extra monthly payment - additional amount you plan to pay each month to reduce interest',
			'Select loan type - choose annuity (fixed payment) or interest-only',
			'Click "Calculate" to see your loan overpayment and interest costs',
			'Review the overpayment - this is the total interest you pay beyond the principal',
			'Understand that longer loan terms result in much higher overpayment due to interest accumulation',
			'If you entered extra payments, see how much interest you save and how much time you shave off the loan',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Standard Loan',
				inputDescription:
					'$20,000 loan at 7% APR for 5 years with monthly payments',
				steps: [
					'Loan amount: $20,000',
					'Annual interest rate: 7% (APR)',
					'Loan term: 5 years',
					'Payment frequency: Monthly',
					'Extra payment: $0',
					'Regular monthly payment: $396.36',
					'Total payment: $23,781.60',
					'Total interest (overpayment): $3,781.60',
					'Overpayment percentage: 18.9% of loan amount',
				],
				resultDescription:
					'A $20,000 loan at 7% APR for 5 years requires a monthly payment of $396.36. Over 5 years, you pay $23,781.60 total, meaning you overpay by $3,781.60 in interest - nearly 19% of the original loan amount. This demonstrates how even moderate interest rates result in significant overpayment over standard loan terms.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Long-Term Loan',
				inputDescription:
					'$200,000 loan at 5% APR for 30 years with monthly payments',
				steps: [
					'Loan amount: $200,000',
					'Annual interest rate: 5% (APR)',
					'Loan term: 30 years',
					'Payment frequency: Monthly',
					'Extra payment: $0',
					'Regular monthly payment: $1,073.64',
					'Total payment: $386,510.40',
					'Total interest (overpayment): $186,510.40',
					'Overpayment percentage: 93.3% of loan amount',
				],
				resultDescription:
					'A $200,000 loan at 5% APR for 30 years requires a monthly payment of $1,073.64. Over 30 years, you pay $386,510.40 total, meaning you overpay by $186,510.40 in interest - nearly as much as the original loan amount! This dramatic overpayment demonstrates why longer loan terms are so expensive, even with relatively low interest rates.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Extra Payments',
				inputDescription:
					'$150,000 loan at 4.5% APR for 25 years with $200 extra monthly payment',
				steps: [
					'Loan amount: $150,000',
					'Annual interest rate: 4.5% (APR)',
					'Loan term: 25 years',
					'Payment frequency: Monthly',
					'Extra payment: $200 per month',
					'Regular monthly payment: $843.21',
					'Payment with extra: $1,043.21',
					'Standard total interest: $102,963.00',
					'Total interest with extra: $75,234.00',
					'Interest saved: $27,729.00',
					'Loan term reduction: 6.2 years (from 25 to 18.8 years)',
				],
				resultDescription:
					'A $150,000 loan at 4.5% APR for 25 years normally requires $843.21 monthly and results in $102,963 in total interest. By adding just $200 extra per month, you save $27,729 in interest and pay off the loan 6.2 years early. The extra $200 per month ($48,000 total) saves you $27,729 in interest, demonstrating the powerful impact of extra payments on reducing overpayment.',
			},
		],
		faq: [
			{
				question: 'What is loan overpayment?',
				answer:
					'Loan overpayment is the total amount you pay beyond the principal (original loan amount). It equals the total interest paid over the life of the loan. For example, if you borrow $100,000 and pay back $150,000 total, your overpayment is $50,000. Overpayment represents the true cost of borrowing money.',
			},
			{
				question: 'Is overpayment the same as interest?',
				answer:
					'Yes, overpayment is the same as total interest paid. It\'s the difference between what you borrow (principal) and what you pay back in total. Overpayment = Total Payment - Loan Amount = Total Interest. This calculator uses "overpayment" to emphasize the extra cost beyond the principal.',
			},
			{
				question: 'Why do banks earn so much interest on loans?',
				answer:
					'Banks earn interest because they charge interest on the entire loan balance over the entire loan term. With longer terms, interest accumulates over more periods, resulting in exponential growth of interest costs. For example, a 30-year mortgage at 5% results in nearly as much interest as the principal. Banks profit from the time value of money - charging interest for the privilege of borrowing.',
			},
			{
				question: 'How can I reduce loan overpayment?',
				answer:
					'You can reduce overpayment by: making extra payments (most effective), choosing a shorter loan term, negotiating a lower interest rate, refinancing to a lower rate, or making bi-weekly payments instead of monthly. Extra payments directly reduce principal, which reduces future interest calculations. Even small extra payments can save thousands in interest over time.',
			},
			{
				question: 'Are extra payments worth it?',
				answer:
					'Yes, extra payments are usually worth it because they reduce total interest paid and shorten your loan term. The savings depend on your interest rate and loan term. For example, on a $200,000 mortgage at 5% for 30 years, an extra $200 per month saves about $60,000 in interest and pays off the loan 7 years early. Compare this to investing the extra payment - if your investment return is lower than your loan interest rate, extra payments are better.',
			},
			{
				question: 'What is the difference between short and long loan terms?',
				answer:
					'Short loan terms (3-5 years) have higher monthly payments but much lower total interest (overpayment). Long loan terms (20-30 years) have lower monthly payments but significantly higher total interest. For example, a $200,000 loan at 5% costs $26,000 in interest over 10 years but $186,000 over 30 years. Short terms save money overall but require higher monthly payments.',
			},
			{
				question: 'What is the difference between fixed and variable interest?',
				answer:
					'Fixed interest rates stay the same for the entire loan term, making payments predictable. Variable rates can change based on market conditions, making payments unpredictable. Fixed rates are generally higher initially but provide stability. Variable rates may start lower but can increase significantly. This calculator assumes fixed rates - variable rates would require different calculations.',
			},
			{
				question: 'Is refinancing a good idea to reduce overpayment?',
				answer:
					'Refinancing can reduce overpayment if you get a lower interest rate, shorter term, or both. However, refinancing has costs (closing fees, appraisal, etc.) that must be considered. Calculate the break-even point - how long it takes for interest savings to exceed refinancing costs. If you plan to stay in the loan long enough, refinancing can significantly reduce overpayment.',
			},
			{
				question: 'Does overpayment depend on APR?',
				answer:
					'Yes, overpayment depends heavily on APR (Annual Percentage Rate). Higher APR means higher overpayment. For example, a $200,000 loan for 30 years costs $186,000 in interest at 5% APR but $348,000 at 8% APR - nearly double! Even small differences in APR (e.g., 4% vs. 5%) can result in tens of thousands of dollars difference in overpayment over long terms.',
			},
			{
				question: 'Is this calculation accurate?',
				answer:
					'This calculation is accurate for standard fixed-rate loans with fixed monthly payments. It assumes: payments are made on time, interest compounds monthly, no prepayment penalties, and extra payments are applied to principal. Actual results may vary due to fees, payment timing, variable rates, or lender-specific terms. Always verify with your lender for exact amounts.',
			},
			{
				question: 'What happens if I miss payments?',
				answer:
					'Missing payments increases overpayment because: late fees are added, interest continues to accrue on unpaid balance, and your loan term may extend. Some lenders may also increase your interest rate after missed payments. Always contact your lender immediately if you cannot make a payment to discuss options and minimize additional costs.',
			},
			{
				question: 'Can I reduce overpayment on an existing loan?',
				answer:
					'Yes, you can reduce overpayment on an existing loan by making extra payments, refinancing to a lower rate or shorter term, making bi-weekly payments (26 half-payments per year = 13 full payments), or making a lump-sum payment. Extra payments are usually the easiest and most effective method, as they directly reduce principal and future interest calculations.',
			},
			{
				question: 'What is the difference between principal and interest in payments?',
				answer:
					'Each loan payment consists of two parts: principal (the original loan amount) and interest (the cost of borrowing). Early in the loan, most of each payment goes to interest. As the loan progresses, more goes to principal. Extra payments go entirely to principal, which is why they\'re so effective at reducing overpayment - they reduce the balance that future interest is calculated on.',
			},
			{
				question: 'Should I pay off my loan early or invest the money?',
				answer:
					'Compare your loan interest rate to your expected investment return. If your loan rate is higher than your expected investment return, extra payments are better. If your investment return is higher, investing may be better. However, consider: investment returns are uncertain, loan interest is guaranteed savings, and paying off debt provides peace of mind. Many people prefer guaranteed savings over uncertain returns.',
			},
		],
		relatedIds: [
			'loan-payment',
			'mortgage-calculator',
			'personal-loan-calculator',
			'auto-loan-calculator',
		],
		standardIds: [],
		tags: ['finance', 'loans', 'overpayment', 'interest', 'credit-cost', 'amortization'],
		meta: {
			keywords: [
				'loan overpayment calculator',
				'loan interest calculator',
				'total interest calculator',
				'loan cost calculator',
				'interest savings calculator',
				'extra payment calculator',
				'loan overpayment explained',
				'how much interest on loan',
				'loan interest cost',
				'reduce loan interest',
			],
		},
	},
	// Mortgage (EN)
	{
		id: 'mortgage-calculator',
		slug: 'mortgage-calculator',
		category: 'finance',
		title: 'Mortgage Calculator',
		shortDescription:
			'Estimate your monthly mortgage payment, total interest, and full home ownership cost. Includes taxes, insurance, HOA, and extra payment impact.',
		longDescription:
			'Calculate your mortgage payment, total interest, and full home ownership cost. This advanced mortgage calculator helps you understand the true cost of buying a home, including how down payment, interest rate, loan term, property taxes, insurance, HOA fees, and extra payments affect your monthly payment and total loan cost. Perfect for first-time home buyers and anyone planning to purchase a home.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'homePrice',
				label: 'Home Price',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter home price',
				validation: {
					required: true,
					min: 0.01,
					message: 'Home price must be greater than 0',
				},
			},
			{
				name: 'downPayment',
				label: 'Down Payment',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter down payment',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Down payment must be greater than or equal to 0',
				},
			},
			{
				name: 'downPaymentType',
				label: 'Down Payment Type',
				type: 'select',
				options: [
					{ value: 'amount', label: 'Amount ($)' },
					{ value: 'percentage', label: 'Percentage (%)' },
				],
				defaultValue: 'amount',
				helpText: 'Choose whether to enter down payment as dollar amount or percentage',
			},
			{
				name: 'loanTermYears',
				label: 'Loan Term',
				type: 'select',
				options: [
					{ value: '15', label: '15 years' },
					{ value: '20', label: '20 years' },
					{ value: '25', label: '25 years' },
					{ value: '30', label: '30 years' },
				],
				defaultValue: '30',
				helpText: 'Loan term in years',
			},
			{
				name: 'interestRateAPR',
				label: 'Interest Rate (APR)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0.01,
					max: 30,
					message: 'Interest rate must be greater than 0 and less than or equal to 30',
				},
			},
			{
				name: 'paymentFrequency',
				label: 'Payment Frequency',
				type: 'select',
				options: [
					{ value: 'monthly', label: 'Monthly' },
				],
				defaultValue: 'monthly',
				helpText: 'How often you make payments',
			},
			{
				name: 'propertyTax',
				label: 'Property Tax (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter property tax',
				defaultValue: 0,
				helpText: 'Annual property tax (as percentage or amount)',
				validation: {
					required: true,
					min: 0,
					message: 'Property tax must be greater than or equal to 0',
				},
			},
			{
				name: 'propertyTaxType',
				label: 'Property Tax Type',
				type: 'select',
				options: [
					{ value: 'percentage', label: 'Percentage (%)' },
					{ value: 'amount', label: 'Annual Amount ($)' },
				],
				defaultValue: 'percentage',
				helpText: 'Choose whether property tax is percentage or annual amount',
			},
			{
				name: 'homeInsurance',
				label: 'Home Insurance (Optional)',
				type: 'number',
				unitLabel: '$/year',
				placeholder: 'Enter annual insurance',
				defaultValue: 0,
				helpText: 'Annual homeowners insurance cost',
				validation: {
					required: true,
					min: 0,
					message: 'Home insurance must be greater than or equal to 0',
				},
			},
			{
				name: 'HOA',
				label: 'HOA Fees (Optional)',
				type: 'number',
				unitLabel: '$/month',
				placeholder: 'Enter monthly HOA',
				defaultValue: 0,
				helpText: 'Monthly homeowners association fees',
				validation: {
					required: true,
					min: 0,
					message: 'HOA fees must be greater than or equal to 0',
				},
			},
			{
				name: 'extraMonthlyPayment',
				label: 'Extra Monthly Payment (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter extra payment',
				defaultValue: 0,
				helpText: 'Additional monthly payment toward principal',
				validation: {
					required: true,
					min: 0,
					message: 'Extra payment must be greater than or equal to 0',
				},
			},
			{
				name: 'startDate',
				label: 'Start Date (Optional)',
				type: 'date',
				placeholder: 'Select start date',
				helpText: 'Loan start date for payoff date calculation',
			},
		],
		outputs: [
			{
				name: 'monthlyMortgagePayment',
				label: 'Monthly Mortgage Payment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalMonthlyPayment',
				label: 'Total Monthly Payment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'loanAmount',
				label: 'Loan Amount',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalInterest',
				label: 'Total Interest Paid',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalCost',
				label: 'Total Cost',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'payoffDate',
				label: 'Payoff Date',
				formatType: 'date',
			},
			{
				name: 'paymentBreakdown',
				label: 'Payment Breakdown',
			},
			{
				name: 'extraPaymentImpact',
				label: 'Extra Payment Impact',
			},
			{
				name: 'amortizationSchedule',
				label: 'Amortization Schedule',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateMortgage,
		howToBullets: [
			'Enter the home price - the total purchase price of the home you want to buy',
			'Enter your down payment - either as a dollar amount or percentage of home price (20% is traditional, but 3-10% is common for first-time buyers)',
			'Select down payment type - choose whether you entered amount ($) or percentage (%)',
			'Select loan term - choose 15, 20, 25, or 30 years (15-year loans have higher payments but less interest; 30-year loans have lower payments but more interest)',
			'Enter the interest rate (APR) - the annual percentage rate offered by your lender (typically 3-7% depending on market conditions)',
			'Optionally enter property tax - your local annual property tax (as percentage of home value or annual amount, typically 0.5-2%)',
			'Optionally enter home insurance - your annual homeowners insurance cost (typically $1,000-$2,000 per year)',
			'Optionally enter HOA fees - monthly homeowners association fees if applicable',
			'Optionally enter extra monthly payment - additional amount you plan to pay toward principal each month to pay off faster',
			'Optionally select start date - the date your mortgage begins (used to calculate payoff date)',
			'Click "Calculate" to see your mortgage payment breakdown and total costs',
			'Review the payment breakdown - see how much goes to principal, interest, taxes, insurance, and HOA',
			'Check extra payment impact - if you entered extra payments, see how much interest you save and how many years you shave off the loan',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Standard Mortgage',
				inputDescription:
					'$300,000 home, 20% down, 30 years @ 6.5% APR',
				steps: [
					'Home price: $300,000',
					'Down payment: 20% ($60,000)',
					'Loan amount: $240,000',
					'Interest rate: 6.5% APR',
					'Loan term: 30 years',
					'Property tax: 1.2% ($3,600/year)',
					'Home insurance: $1,200/year',
					'Monthly mortgage payment: $1,515.84',
					'Monthly property tax: $300',
					'Monthly insurance: $100',
					'Total monthly payment: $1,915.84',
					'Total interest: $305,702.40',
					'Total cost: $689,302.40',
				],
				resultDescription:
					'A $300,000 home with 20% down payment ($60,000) at 6.5% APR for 30 years requires a monthly mortgage payment of $1,515.84. With property taxes ($300/month) and insurance ($100/month), the total monthly payment is $1,915.84. Over 30 years, you pay $305,702.40 in interest - more than the original loan amount! This demonstrates why understanding total cost is crucial when buying a home.',
			},
			{
				id: 'example-2',
				title: 'Example 2: 15-Year vs 30-Year Comparison',
				inputDescription:
					'$300,000 home, 20% down, comparing 15-year @ 6% vs 30-year @ 6.5%',
				steps: [
					'Home price: $300,000',
					'Down payment: 20% ($60,000)',
					'Loan amount: $240,000',
					'15-year mortgage @ 6%:',
					'  Monthly payment: $2,025.28',
					'  Total interest: $124,550.40',
					'30-year mortgage @ 6.5%:',
					'  Monthly payment: $1,515.84',
					'  Total interest: $305,702.40',
					'Difference: $509.44/month higher payment, but $181,152 less interest!',
				],
				resultDescription:
					'Comparing a 15-year mortgage at 6% to a 30-year mortgage at 6.5% on the same $240,000 loan shows the trade-off: the 15-year loan has a $509.44 higher monthly payment ($2,025.28 vs $1,515.84) but saves $181,152 in total interest ($124,550 vs $305,702). If you can afford the higher payment, the 15-year mortgage saves significant money over time.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Extra $200/Month Payment',
				inputDescription:
					'$300,000 home, 20% down, 30 years @ 6.5%, with $200 extra monthly payment',
				steps: [
					'Home price: $300,000',
					'Down payment: 20% ($60,000)',
					'Loan amount: $240,000',
					'Interest rate: 6.5% APR',
					'Loan term: 30 years',
					'Extra monthly payment: $200',
					'Standard monthly payment: $1,515.84',
					'With extra payment: $1,715.84',
					'Interest saved: $68,000+',
					'Loan term reduced: ~7 years',
					'Payoff date: 23 years instead of 30 years',
				],
				resultDescription:
					'Adding just $200 per month to a $240,000 mortgage at 6.5% APR saves over $68,000 in interest and reduces the loan term by approximately 7 years. Instead of paying off in 30 years, you finish in 23 years. This demonstrates how small extra payments can have a huge impact on total interest and payoff time.',
			},
			{
				id: 'example-4',
				title: 'Example 4: Low Down Payment (5%)',
				inputDescription:
					'$300,000 home, 5% down, 30 years @ 6.5% APR',
				steps: [
					'Home price: $300,000',
					'Down payment: 5% ($15,000)',
					'Loan amount: $285,000',
					'Interest rate: 6.5% APR',
					'Loan term: 30 years',
					'Property tax: 1.2%',
					'Home insurance: $1,200/year',
					'Monthly mortgage payment: $1,800.39',
					'Total monthly payment: $2,200.39',
					'Total interest: $363,140.40',
					'Note: PMI would typically be required (not included in calculation)',
				],
				resultDescription:
					'A $300,000 home with only 5% down payment ($15,000) at 6.5% APR for 30 years requires a monthly mortgage payment of $1,800.39 - $284.55 higher than with 20% down. The smaller down payment results in a larger loan amount ($285,000 vs $240,000), higher monthly payment, and $57,438 more total interest. Additionally, with less than 20% down, you typically need PMI (Private Mortgage Insurance), which adds 0.5-2% annually to your payment. Low down payments make homeownership more accessible but increase both monthly costs and total interest.',
			},
		],
		faq: [
			{
				question: 'What is a mortgage?',
				answer:
					'A mortgage is a loan used to purchase real estate, typically a home. The property serves as collateral, meaning the lender can foreclose if you fail to make payments. Mortgages typically have fixed or variable interest rates and terms of 15-30 years. Your monthly payment includes principal (the loan amount), interest (the cost of borrowing), and often property taxes and insurance.',
			},
			{
				question: 'How is mortgage payment calculated?',
				answer:
					'Mortgage payments are calculated using the annuity formula: M = P × [r(1+r)^n] / [(1+r)^n - 1], where M is the monthly payment, P is the loan principal, r is the monthly interest rate, and n is the number of payments. This formula ensures each payment covers both principal and interest, with the interest portion decreasing and principal portion increasing over time.',
			},
			{
				question: 'What is a good down payment?',
				answer:
					'A 20% down payment is traditionally considered ideal because it avoids Private Mortgage Insurance (PMI), qualifies you for better interest rates, and reduces your loan amount. However, many buyers put down 3-10%, especially first-time buyers. A larger down payment reduces monthly payments and total interest, but requires more upfront cash.',
			},
			{
				question: 'What is the difference between 15 and 30 year mortgages?',
				answer:
					'A 15-year mortgage has higher monthly payments but significantly less total interest. A 30-year mortgage has lower monthly payments but much more total interest. For example, a $300,000 loan at 6% costs $155,332 in interest over 15 years but $347,515 over 30 years. Choose 15 years if you can afford higher payments and want to save on interest. Choose 30 years for lower monthly payments and more flexibility.',
			},
			{
				question: 'What is the difference between fixed and variable rate mortgages?',
				answer:
					'Fixed-rate mortgages have the same interest rate for the entire loan term, providing predictable payments. Variable-rate (adjustable-rate) mortgages have rates that can change based on market conditions, potentially increasing or decreasing your payment. Fixed rates are typically higher initially but provide stability. Variable rates may start lower but carry risk of increases.',
			},
			{
				question: 'What is APR?',
				answer:
					'APR (Annual Percentage Rate) is the annual interest rate charged on your mortgage. It represents the true cost of borrowing money, including the interest rate and some fees. APR is higher than the interest rate because it includes additional costs. When comparing mortgages, use APR to see the true cost difference between offers.',
			},
			{
				question: 'How do property taxes affect mortgage payments?',
				answer:
					'Property taxes are typically included in your monthly mortgage payment through an escrow account. The lender collects 1/12 of your annual property tax each month and pays it when due. Property taxes vary by location (typically 0.5-2% of home value annually) and increase your total monthly payment. They don\'t reduce your loan balance but are a significant ongoing cost.',
			},
			{
				question: 'Is mortgage interest tax-deductible?',
				answer:
					'In the United States, mortgage interest on loans up to $750,000 (or $375,000 if married filing separately) is tax-deductible if you itemize deductions. This can reduce your taxable income and lower your tax bill. However, the standard deduction may be more beneficial for many taxpayers. Consult a tax professional for advice specific to your situation.',
			},
			{
				question: 'How can I lower my mortgage payment?',
				answer:
					'You can lower your payment by: making a larger down payment (reduces loan amount), getting a lower interest rate (improve credit score, shop around, buy points), choosing a longer loan term (30 vs 15 years), refinancing to a lower rate, or making extra payments to pay off faster. Remember that longer terms reduce monthly payments but increase total interest.',
			},
			{
				question: 'Is refinancing worth it?',
				answer:
					'Refinancing can be worth it if you get a lower interest rate, shorter term, or both. However, refinancing has costs (closing fees, appraisal, etc.) that typically range from 2-5% of the loan amount. Calculate the break-even point - how long it takes for interest savings to exceed refinancing costs. If you plan to stay in the home long enough, refinancing can save thousands.',
			},
			{
				question: 'What is PMI (Private Mortgage Insurance)?',
				answer:
					'PMI is insurance that protects the lender if you default on your mortgage. It\'s typically required when your down payment is less than 20%. PMI costs 0.5-2% of the loan amount annually and is added to your monthly payment. Once you reach 20% equity (loan-to-value ratio), you can usually cancel PMI, reducing your monthly payment.',
			},
			{
				question: 'Is this mortgage calculation accurate?',
				answer:
					'This calculation is accurate for standard fixed-rate mortgages with fixed monthly payments. It assumes: payments are made on time, interest compounds monthly, no prepayment penalties, and standard amortization. Actual results may vary due to fees, PMI, variable rates, payment timing, or lender-specific terms. Always verify with your lender for exact amounts.',
			},
			{
				question: 'What is PITI?',
				answer:
					'PITI stands for Principal, Interest, Taxes, and Insurance - the four components of your total monthly mortgage payment. Principal is the loan amount, Interest is the cost of borrowing, Taxes are property taxes, and Insurance is homeowners insurance. Some lenders also include PMI (Private Mortgage Insurance) in the payment, making it PITI + PMI.',
			},
			{
				question: 'How does amortization work?',
				answer:
					'Amortization is the process of paying off a loan through regular payments. Early in the loan, most of each payment goes to interest and little to principal. As the loan progresses, more goes to principal and less to interest. This is why extra payments early in the loan are so effective - they reduce principal, which reduces future interest calculations.',
			},
			{
				question: 'What happens if I can\'t make my mortgage payment?',
				answer:
					'Contact your lender immediately to discuss options like loan modification, forbearance, or repayment plans. Missing payments can result in late fees, damage to your credit score, and eventually foreclosure. Most lenders prefer to work with you rather than foreclose. Early communication is key to finding solutions and protecting your home.',
			},
			{
				question: 'How much house can I afford?',
				answer:
					'Generally, you can afford a home that costs 2.5-3 times your annual income. For example, if you earn $100,000/year, you can typically afford a $250,000-$300,000 home. However, consider: your down payment amount, monthly debts (car loans, credit cards), property taxes and insurance, and your comfort level with monthly payments. Use this calculator with different home prices to see what monthly payment fits your budget.',
			},
			{
				question: 'How much interest will I pay over the life of the loan?',
				answer:
					'Total interest depends on loan amount, interest rate, and loan term. For example, a $300,000 loan at 6.5% for 30 years costs approximately $380,000 in interest - more than the original loan! A 15-year loan at 6% on the same amount costs about $155,000 in interest. Use this calculator to see exact interest costs for your specific loan terms.',
			},
			{
				question: 'Is making extra payments worth it?',
				answer:
					'Yes! Extra payments reduce your principal balance, which reduces future interest calculations. Even small extra payments ($50-200/month) can save thousands in interest and shave years off your loan. For example, adding $200/month to a $240,000 mortgage at 6.5% saves over $68,000 in interest and reduces the loan term by 7 years. Extra payments are most effective early in the loan when interest is highest.',
			},
			{
				question: 'Does this calculator include taxes?',
				answer:
					'Yes, this calculator includes property taxes if you enter them. Property taxes are typically 0.5-2% of home value annually and are included in your total monthly payment (PITI). However, this calculator does not include income tax deductions for mortgage interest - consult a tax professional for tax advice specific to your situation.',
			},
			{
				question: 'What is HOA and should I include it?',
				answer:
					'HOA (Homeowners Association) fees are monthly fees paid to maintain common areas, amenities, and services in certain communities. HOA fees typically range from $100-$500/month but can be higher in luxury communities. Include HOA fees in your calculation to see your true monthly housing cost, as they are a fixed monthly expense that doesn\'t reduce your loan balance.',
			},
		],
		relatedIds: [
			'mortgage-comparison-calculator',
			'loan-overpayment-calculator',
			'savings-calculator',
			'investment-calculator',
			'loan-payment',
		],
		standardIds: [],
		tags: ['finance', 'mortgage', 'home-loan', 'housing', 'interest', 'apr', 'amortization', 'down-payment'],
		meta: {
			keywords: [
				'mortgage calculator',
				'mortgage payment calculator',
				'home loan calculator',
				'monthly mortgage payment',
				'mortgage interest calculator',
				'mortgage cost calculator',
				'home loan payment',
				'mortgage APR calculator',
				'mortgage down payment calculator',
				'PITI calculator',
				'mortgage amortization calculator',
				'home affordability calculator',
				'mortgage extra payment calculator',
				'mortgage total cost calculator',
			],
		},
	},
	// Personal Loan (EN)
	{
		id: 'personal-loan-calculator',
		slug: 'personal-loan-calculator',
		category: 'finance',
		title: 'Personal Loan Calculator',
		shortDescription:
			'Calculate personal loan payments, interest, fees, and total repayment cost. Estimate monthly payments and overpayment.',
		longDescription:
			'Calculate personal loan payments, interest, fees, and total repayment cost. Estimate monthly payments and overpayment. This calculator helps you understand the true cost of a personal loan, including how origination fees affect your effective APR and how loan terms impact your monthly payment and total interest.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'loanAmount',
				label: 'Loan Amount',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter loan amount',
				validation: {
					required: true,
					min: 0.01,
					message: 'Loan amount must be greater than 0',
				},
			},
			{
				name: 'annualInterestRate',
				label: 'Annual Interest Rate (APR)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0.01,
					max: 36,
					message: 'Interest rate must be greater than 0 and less than or equal to 36',
				},
			},
			{
				name: 'loanTerm',
				label: 'Loan Term',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter loan term',
				validation: {
					required: true,
					min: 1,
					max: 10,
					message: 'Loan term must be between 1 and 10 years',
				},
			},
			{
				name: 'paymentFrequency',
				label: 'Payment Frequency',
				type: 'select',
				options: [
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'bi-weekly', label: 'Bi-weekly' },
				],
				defaultValue: 'monthly',
				helpText: 'How often you make payments',
			},
			{
				name: 'originationFee',
				label: 'Origination Fee (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter origination fee',
				defaultValue: 0,
				helpText: 'One-time fee charged by the lender',
				validation: {
					required: true,
					min: 0,
					message: 'Origination fee must be greater than or equal to 0',
				},
			},
			{
				name: 'feeType',
				label: 'Fee Type',
				type: 'select',
				options: [
					{ value: 'percentage', label: 'Percentage (%)' },
					{ value: 'fixed', label: 'Fixed Amount ($)' },
				],
				defaultValue: 'percentage',
				helpText: 'Whether the fee is a percentage of loan amount or fixed amount',
			},
			{
				name: 'extraMonthlyPayment',
				label: 'Extra Monthly Payment (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter extra payment',
				defaultValue: 0,
				helpText: 'Additional amount paid each month to reduce interest',
				validation: {
					required: true,
					min: 0,
					message: 'Extra payment must be greater than or equal to 0',
				},
			},
		],
		outputs: [
			{
				name: 'monthlyPayment',
				label: 'Monthly Personal Loan Payment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalPayment',
				label: 'Total Repayment Amount',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalInterest',
				label: 'Total Interest Paid',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'overpayment',
				label: 'Overpayment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'effectiveAPR',
				label: 'Effective APR',
				unitLabel: '%',
				formatType: 'percentage',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculatePersonalLoan,
		howToBullets: [
			'Enter the loan amount - the total amount you want to borrow',
			'Enter the annual interest rate (APR) - the interest rate offered by your lender',
			'Enter the loan term in years - how long you have to repay (must be between 1 and 10 years)',
			'Select payment frequency - choose monthly or bi-weekly payments',
			'Optionally enter origination fee - a one-time fee charged by the lender (can be percentage or fixed amount)',
			'Select fee type - choose whether the fee is a percentage of loan amount or a fixed dollar amount',
			'Optionally enter extra monthly payment - additional amount you plan to pay each month to reduce interest',
			'Click "Calculate" to see your loan payment and total costs',
			'Review the monthly payment - this is your principal and interest payment',
			'Check the effective APR - this includes fees and shows the true annual cost of borrowing',
			'Understand that origination fees reduce the net amount you receive, effectively increasing your borrowing cost',
			'Compare the nominal APR (interest rate) with the effective APR (includes fees) to see the true cost',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Typical Personal Loan',
				inputDescription:
					'$10,000 loan at 9% APR for 4 years with monthly payments',
				steps: [
					'Loan amount: $10,000',
					'Annual interest rate: 9% (APR)',
					'Loan term: 4 years',
					'Payment frequency: Monthly',
					'Origination fee: $0',
					'Monthly payment: $248.85',
					'Total payment: $11,944.80',
					'Total interest: $1,944.80',
					'Overpayment: $1,944.80',
					'Effective APR: 9% (same as nominal, no fees)',
				],
				resultDescription:
					'A $10,000 personal loan at 9% APR for 4 years requires a monthly payment of $248.85. Over 4 years, you pay $11,944.80 total, meaning you pay $1,944.80 in interest - about 19% of the original loan amount. This demonstrates typical personal loan costs for unsecured borrowing.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Loan with Origination Fee',
				inputDescription:
					'$15,000 loan at 8% APR with 3% origination fee for 5 years',
				steps: [
					'Loan amount: $15,000',
					'Annual interest rate: 8% (APR)',
					'Loan term: 5 years',
					'Payment frequency: Monthly',
					'Origination fee: 3% ($450)',
					'Net loan amount: $14,550',
					'Monthly payment: $295.24',
					'Total payment: $17,714.40',
					'Total interest: $3,164.40',
					'Overpayment: $3,614.40 (interest + fee)',
					'Effective APR: 9.97% (higher than 8% due to fee)',
				],
				resultDescription:
					'A $15,000 loan at 8% APR with a 3% origination fee ($450) for 5 years requires a monthly payment of $295.24. The fee reduces your net loan amount to $14,550, but you still pay interest on the full $15,000 structure. The effective APR is 9.97%, higher than the nominal 8% APR, demonstrating how fees increase the true cost of borrowing.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Short-Term Loan',
				inputDescription:
					'$5,000 loan at 7% APR for 2 years with monthly payments',
				steps: [
					'Loan amount: $5,000',
					'Annual interest rate: 7% (APR)',
					'Loan term: 2 years',
					'Payment frequency: Monthly',
					'Origination fee: $0',
					'Monthly payment: $223.86',
					'Total payment: $5,372.64',
					'Total interest: $372.64',
					'Overpayment: $372.64',
					'Effective APR: 7%',
				],
				resultDescription:
					'A $5,000 loan at 7% APR for 2 years requires a monthly payment of $223.86 - higher than a longer-term loan but with much less total interest ($372.64 vs $1,944.80 for a 4-year loan on $10,000). Shorter loan terms result in higher monthly payments but significantly lower total interest costs, making them ideal if you can afford the higher payment.',
			},
		],
		faq: [
			{
				question: 'What is a personal loan?',
				answer:
					'A personal loan is an unsecured loan that doesn\'t require collateral (like a house or car). You borrow a fixed amount and repay it in fixed monthly payments over a set term (typically 1-7 years). Personal loans are used for debt consolidation, major purchases, home improvements, or other expenses. Because they\'re unsecured, interest rates are typically higher than secured loans.',
			},
			{
				question: 'What is the difference between secured and unsecured loans?',
				answer:
					'Secured loans require collateral (like a house for a mortgage or car for an auto loan). If you default, the lender can seize the collateral. Unsecured loans (like personal loans) don\'t require collateral, making them riskier for lenders. This results in higher interest rates for unsecured loans. Personal loans are unsecured, which is why they typically have higher rates than mortgages or auto loans.',
			},
			{
				question: 'What is APR?',
				answer:
					'APR (Annual Percentage Rate) is the annual interest rate charged on your loan. It represents the cost of borrowing money. For personal loans, APR typically ranges from 6% to 36% depending on your credit score, loan amount, and lender. A lower APR means lower monthly payments and less total interest. Always compare APRs when shopping for loans.',
			},
			{
				question: 'How do origination fees affect loan cost?',
				answer:
					'Origination fees are one-time charges deducted from your loan amount upfront. For example, a 3% fee on a $10,000 loan means you receive $9,700 but pay interest on the full $10,000 structure. This effectively increases your borrowing cost, making the effective APR higher than the nominal APR. Fees can range from 0% to 8% of the loan amount.',
			},
			{
				question: 'Is a personal loan better than a credit card?',
				answer:
					'Personal loans often have lower interest rates than credit cards (typically 6-36% vs 15-25% for credit cards) and fixed repayment terms. They\'re better for large, one-time expenses or debt consolidation. Credit cards offer more flexibility but higher rates. If you can get a personal loan at a lower rate than your credit card, it may save money, especially for debt consolidation.',
			},
			{
				question: 'What are typical personal loan terms?',
				answer:
					'Personal loan terms typically range from 1 to 7 years, with 3-5 years being most common. Loan amounts usually range from $1,000 to $100,000. Interest rates vary widely based on credit score: excellent credit (750+) may get 6-10%, good credit (700-749) gets 10-15%, fair credit (650-699) gets 15-20%, and poor credit (below 650) may get 20-36% or be denied.',
			},
			{
				question: 'How can I lower my personal loan interest rate?',
				answer:
					'You can lower your rate by: improving your credit score (pay bills on time, reduce debt, check credit reports), shopping around and comparing offers from multiple lenders, choosing a shorter loan term (if affordable), making a larger down payment (if applicable), or getting a co-signer with good credit. Even small rate differences can save hundreds or thousands over the loan term.',
			},
			{
				question: 'Can I repay my personal loan early?',
				answer:
					'Most personal loans allow early repayment without penalty, but check your loan agreement. Some lenders charge prepayment penalties (typically 1-2% of remaining balance). Early repayment saves interest by reducing the loan term. If there\'s no penalty, paying off early is usually beneficial. Always verify prepayment terms before signing.',
			},
			{
				question: 'Is this personal loan calculation accurate?',
				answer:
					'This calculation is accurate for standard fixed-rate personal loans with fixed monthly payments. It assumes: payments are made on time, interest compounds monthly, no prepayment penalties (unless specified), and standard amortization. Actual results may vary due to fees, payment timing, variable rates, or lender-specific terms. Always verify with your lender for exact amounts.',
			},
			{
				question: 'What costs are not included in this calculator?',
				answer:
					'This calculator includes principal, interest, and origination fees. It does not include: late payment fees, prepayment penalties, application fees, credit check fees, or other lender-specific charges. These additional costs can increase your total loan cost. Always read your loan agreement carefully to understand all fees.',
			},
			{
				question: 'What is the difference between nominal APR and effective APR?',
				answer:
					'Nominal APR is the stated interest rate. Effective APR includes fees and shows the true annual cost of borrowing. For example, a loan with 8% nominal APR and a 3% origination fee has an effective APR of about 10%. The effective APR accounts for fees reducing your net loan amount, giving you a more accurate picture of the true borrowing cost.',
			},
			{
				question: 'How does loan term affect my payment?',
				answer:
					'Longer loan terms (5-7 years) result in lower monthly payments but significantly more total interest. Shorter terms (1-3 years) have higher monthly payments but much less total interest. For example, a $10,000 loan at 9% costs $1,945 in interest over 4 years but $2,800 over 7 years. Choose the shortest term you can afford to minimize total cost.',
			},
			{
				question: 'What credit score do I need for a personal loan?',
				answer:
					'Most lenders require a minimum credit score of 580-600, but better scores get better rates. Excellent credit (750+) gets the best rates (6-10%). Good credit (700-749) gets decent rates (10-15%). Fair credit (650-699) gets higher rates (15-20%). Poor credit (below 650) may get very high rates (20-36%) or be denied. Some lenders specialize in loans for lower credit scores.',
			},
			{
				question: 'Can I use a personal loan for anything?',
				answer:
					'Personal loans can be used for most purposes, including debt consolidation, home improvements, medical expenses, major purchases, or other expenses. However, some lenders restrict use for education expenses, business purposes, or illegal activities. Always check your loan agreement for any restrictions. Some lenders may require you to specify the loan purpose.',
			},
		],
		relatedIds: [
			'loan-payment',
			'loan-overpayment-calculator',
			'auto-loan-calculator',
			'mortgage-calculator',
		],
		standardIds: [],
		tags: ['finance', 'personal-loan', 'unsecured-loan', 'credit', 'apr', 'interest', 'repayment'],
		meta: {
			keywords: [
				'personal loan calculator',
				'personal loan payment calculator',
				'unsecured loan calculator',
				'personal loan interest calculator',
				'personal loan APR calculator',
				'personal loan cost calculator',
				'loan payment calculator',
				'personal loan repayment calculator',
				'effective APR calculator',
				'origination fee calculator',
			],
		},
	},
	// ROI (EN)
	{
		id: 'roi-calculator',
		slug: 'roi-calculator',
		category: 'finance',
		title: 'ROI Calculator',
		shortDescription:
			'Calculate return on investment and evaluate profitability. Measure net profit, return percentage, and performance.',
		longDescription:
			'Calculate ROI to evaluate investment and business profitability. Measure net profit, return percentage, and performance. This calculator helps you understand the efficiency and profitability of your investments, showing how much profit you earned relative to your investment cost. Perfect for evaluating business investments, marketing campaigns, real estate, and other financial decisions.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'investmentCost',
				label: 'Investment Cost',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter investment cost',
				validation: {
					required: true,
					min: 0.01,
					message: 'Investment cost must be greater than 0',
				},
			},
			{
				name: 'returnValue',
				label: 'Return Value',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter return value',
				validation: {
					required: true,
					min: 0,
					message: 'Return value must be greater than or equal to 0',
				},
			},
			{
				name: 'additionalCosts',
				label: 'Additional Costs (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter additional costs',
				defaultValue: 0,
				helpText: 'Any additional costs beyond the initial investment (fees, maintenance, etc.)',
				validation: {
					required: true,
					min: 0,
					message: 'Additional costs must be greater than or equal to 0',
				},
			},
			{
				name: 'timePeriod',
				label: 'Time Period (Optional)',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter time period',
				defaultValue: 0,
				helpText: 'Investment period in years (for reference, not used in basic ROI calculation)',
				validation: {
					required: true,
					min: 0,
					message: 'Time period must be greater than or equal to 0',
				},
			},
			{
				name: 'revenueType',
				label: 'Revenue Type (Optional)',
				type: 'select',
				options: [
					{ value: 'one-time', label: 'One-time' },
					{ value: 'recurring', label: 'Recurring' },
				],
				defaultValue: 'one-time',
				helpText: 'Whether the return is a one-time payment or recurring revenue',
			},
		],
		outputs: [
			{
				name: 'roiPercentage',
				label: 'ROI',
				unitLabel: '%',
				formatType: 'percentage',
			},
			{
				name: 'netProfit',
				label: 'Net Profit',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalInvestment',
				label: 'Total Investment',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'profitMargin',
				label: 'Profit Margin',
				unitLabel: '%',
				formatType: 'percentage',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateROI,
		howToBullets: [
			'Enter the investment cost - the total amount you invested (must be greater than 0)',
			'Enter the return value - the total amount you received or the current value of your investment (can be 0 or greater)',
			'Optionally enter additional costs - any extra costs beyond the initial investment (fees, maintenance, operating costs, etc.)',
			'Optionally enter time period - how long the investment took (in years, for reference only)',
			'Optionally select revenue type - whether the return is one-time or recurring (for reference only)',
			'Click "Calculate" to see your ROI and profitability metrics',
			'Review the ROI percentage - this shows your return as a percentage of your investment',
			'Check the net profit - this is the actual dollar amount you gained or lost',
			'Understand the interpretation - the calculator explains what your ROI means in plain language',
			'Compare ROI to benchmarks - typical ROI varies by investment type (stocks: 7-10%, real estate: 8-12%, marketing: 200-400%)',
			'For detailed investment analysis, try the Investment Calculator',
			'To understand compound growth, use the Compound Interest Calculator',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Business Investment',
				inputDescription:
					'$20,000 invested in equipment, returned $26,000 in revenue',
				steps: [
					'Investment cost: $20,000',
					'Return value: $26,000',
					'Additional costs: $0',
					'Net profit: $26,000 - $20,000 = $6,000',
					'ROI = ($6,000 / $20,000) × 100 = 30%',
					'Profit margin: ($6,000 / $26,000) × 100 = 23.08%',
				],
				resultDescription:
					'A $20,000 business investment that returned $26,000 has a ROI of 30%. This means for every $1 invested, you earned $0.30 in profit. The net profit is $6,000, representing a 23.08% profit margin on the revenue. This is a good return for a business investment, indicating the investment was profitable.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Marketing Campaign',
				inputDescription:
					'$5,000 marketing campaign cost, generated $6,500 in revenue',
				steps: [
					'Investment cost: $5,000',
					'Return value: $6,500',
					'Additional costs: $0',
					'Net profit: $6,500 - $5,000 = $1,500',
					'ROI = ($1,500 / $5,000) × 100 = 30%',
					'Profit margin: ($1,500 / $6,500) × 100 = 23.08%',
				],
				resultDescription:
					'A $5,000 marketing campaign that generated $6,500 in revenue has a ROI of 30%. This means for every $1 spent on marketing, you earned $0.30 in profit. The net profit is $1,500. While 30% ROI is good for many investments, marketing campaigns often target much higher ROIs (200-400%+) because marketing should generate significantly more revenue than it costs.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Poor Investment',
				inputDescription:
					'$10,000 invested, only returned $9,000',
				steps: [
					'Investment cost: $10,000',
					'Return value: $9,000',
					'Additional costs: $0',
					'Net profit: $9,000 - $10,000 = -$1,000',
					'ROI = (-$1,000 / $10,000) × 100 = -10%',
					'Profit margin: (-$1,000 / $9,000) × 100 = -11.11%',
				],
				resultDescription:
					'A $10,000 investment that only returned $9,000 has a ROI of -10%. This means for every $1 invested, you lost $0.10. The net loss is $1,000. A negative ROI indicates the investment resulted in a loss - you received less than you invested. This demonstrates why ROI is important for evaluating investments before committing capital.',
			},
		],
		faq: [
			{
				question: 'What is ROI?',
				answer:
					'ROI (Return on Investment) is a financial metric that measures the profitability and efficiency of an investment. It calculates the percentage return on an investment relative to its cost. ROI = (Net Profit / Investment Cost) × 100. A positive ROI indicates profit, while a negative ROI indicates loss. ROI helps investors compare different investment opportunities and make informed decisions.',
			},
			{
				question: 'What is a good ROI?',
				answer:
					'A "good" ROI depends on the investment type, risk level, and time period. For stocks, 7-10% annually is considered good. For real estate, 8-12% is typical. For marketing campaigns, 200-400%+ is often expected. For business investments, 15-30% is generally good. Higher-risk investments typically require higher ROI to justify the risk. Always compare ROI to industry benchmarks and alternative investments.',
			},
			{
				question: 'What is the difference between ROI and profit?',
				answer:
					'Profit is the absolute dollar amount you gained (Return - Investment). ROI is the percentage return relative to your investment. For example, a $1,000 profit on a $10,000 investment is 10% ROI, while a $1,000 profit on a $100,000 investment is only 1% ROI. ROI allows you to compare investments of different sizes on an equal basis, while profit shows the actual dollar gain.',
			},
			{
				question: 'What is the difference between ROI and profit margin?',
				answer:
					'ROI measures profit relative to investment cost: ROI = (Profit / Investment) × 100. Profit margin measures profit relative to revenue: Profit Margin = (Profit / Revenue) × 100. For example, a $10,000 investment that returns $15,000 has 50% ROI but 33.33% profit margin. ROI focuses on investment efficiency, while profit margin focuses on revenue efficiency.',
			},
			{
				question: 'Can ROI be negative?',
				answer:
					'Yes, ROI can be negative. A negative ROI means you lost money on the investment - you received less than you invested. For example, if you invest $10,000 and only get back $8,000, your ROI is -20%. Negative ROI indicates a loss and suggests the investment was not profitable. Always consider the risk of negative ROI when making investment decisions.',
			},
			{
				question: 'How do I calculate ROI for marketing?',
				answer:
					'Marketing ROI = ((Revenue from Marketing - Marketing Cost) / Marketing Cost) × 100. Include all marketing costs (advertising, creative, tools, etc.) in the investment cost. Track revenue directly attributable to the marketing campaign. Marketing ROI is often much higher than other investments (200-400%+) because marketing should generate significantly more revenue than it costs. However, tracking exact revenue attribution can be challenging.',
			},
			{
				question: 'How do I calculate ROI for real estate?',
				answer:
					'Real estate ROI = ((Rental Income + Appreciation - Costs) / Total Investment) × 100. Include purchase price, closing costs, repairs, and improvements in investment cost. Include rental income, appreciation, and sale proceeds in return value. Real estate ROI typically ranges from 8-12% annually, but can vary significantly based on location, property type, and market conditions.',
			},
			{
				question: 'How does ROI change over time?',
				answer:
					'ROI can change significantly over time. A short-term investment with 50% ROI in 1 year is different from 50% ROI over 10 years. To compare investments over different time periods, use annualized ROI: Annualized ROI = [(1 + ROI)^(1/years) - 1] × 100. This gives you the equivalent annual return rate, making it easier to compare investments with different time horizons.',
			},
			{
				question: 'What are the limitations of ROI?',
				answer:
					'ROI has several limitations: it doesn\'t account for time (a 50% ROI in 1 year vs 10 years is very different), it doesn\'t consider risk (a risky 20% ROI may be worse than a safe 10% ROI), it doesn\'t account for cash flows (intermediate payments or dividends), and it can be manipulated by how costs and returns are defined. Always consider ROI alongside other metrics like risk, time horizon, and cash flow.',
			},
			{
				question: 'Is ROI enough to evaluate investments?',
				answer:
					'No, ROI alone is not enough. Consider: risk level (higher ROI often means higher risk), time period (compare annualized ROI for different timeframes), cash flows (when money comes in and goes out), opportunity cost (what you could earn elsewhere), and other factors like liquidity, tax implications, and strategic value. Use ROI as one tool in a comprehensive investment evaluation.',
			},
			{
				question: 'What should I include in investment cost?',
				answer:
					'Include all costs associated with the investment: initial purchase price, fees (transaction, legal, administrative), setup costs, and any additional costs (maintenance, operating expenses, etc.). Be comprehensive - excluding costs will inflate your ROI and give you an inaccurate picture of profitability. The more accurate your cost calculation, the more useful your ROI will be.',
			},
			{
				question: 'What should I include in return value?',
				answer:
					'Include all returns from the investment: sale proceeds, revenue generated, dividends, interest, appreciation, and any other income. For ongoing investments, use current market value or total returns received. Be consistent - if you include appreciation in one calculation, include it in similar calculations. Accurate return values ensure accurate ROI calculations.',
			},
			{
				question: 'How do I compare ROI across different investments?',
				answer:
					'To compare ROI across different investments: use annualized ROI for different time periods, consider risk-adjusted returns (higher risk should justify higher ROI), account for all costs and returns consistently, and consider other factors like liquidity and strategic value. Remember that ROI is just one metric - a lower ROI investment might be better if it\'s safer, more liquid, or strategically important.',
			},
			{
				question: 'What ROI should I expect from different investment types?',
				answer:
					'Expected ROI varies by investment type: stocks (7-10% annually), bonds (3-5% annually), real estate (8-12% annually), savings accounts (1-3% annually), business investments (15-30%+), marketing campaigns (200-400%+), and high-risk investments (variable, can be very high or negative). These are general guidelines - actual ROI depends on many factors including market conditions, management, and timing.',
			},
		],
		relatedIds: [
			'investment-calculator',
			'compound-interest',
			'investment-vs-savings-calculator',
		],
		standardIds: [],
		tags: ['finance', 'roi', 'business', 'investment-return', 'profitability', 'marketing'],
		meta: {
			keywords: [
				'ROI calculator',
				'return on investment calculator',
				'investment ROI calculator',
				'ROI percentage calculator',
				'business ROI calculator',
				'marketing ROI calculator',
				'profitability calculator',
				'investment return calculator',
				'ROI formula',
				'calculate ROI',
			],
		},
	},
	// Loan Comparison (EN)
	{
		id: 'loan-comparison-calculator',
		slug: 'loan-comparison-calculator',
		category: 'finance',
		title: 'Loan Comparison Calculator',
		shortDescription:
			'Compare loan offers side-by-side. See monthly payment, total interest, fees, and total cost to choose the best loan.',
		longDescription:
			'Compare loan offers side-by-side. See monthly payment, total interest, fees, and total cost to choose the best loan. This calculator helps you evaluate multiple loan options simultaneously, showing which loan is best for lowest monthly payment, lowest total interest, or lowest total cost. Perfect for comparing personal loans, auto loans, mortgages, or any loan offers.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'comparisonMetric',
				label: 'Comparison Metric',
				type: 'select',
				options: [
					{ value: 'lowest-monthly-payment', label: 'Lowest Monthly Payment' },
					{ value: 'lowest-total-interest', label: 'Lowest Total Interest' },
					{ value: 'lowest-total-cost', label: 'Lowest Total Cost' },
				],
				defaultValue: 'lowest-monthly-payment',
				helpText: 'Select which metric to use for determining the best loan',
			},
			{
				name: 'paymentFrequency',
				label: 'Payment Frequency',
				type: 'select',
				options: [
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'bi-weekly', label: 'Bi-weekly' },
				],
				defaultValue: 'monthly',
				helpText: 'How often payments are made',
			},
			{
				name: 'loan1Name',
				label: 'Loan A Name',
				type: 'text',
				placeholder: 'Enter loan name',
				defaultValue: 'Loan A',
				validation: {
					required: true,
					message: 'Loan name is required',
				},
			},
			{
				name: 'loan1Amount',
				label: 'Loan A Amount',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter loan amount',
				validation: {
					required: true,
					min: 0.01,
					message: 'Loan amount must be greater than 0',
				},
			},
			{
				name: 'loan1AnnualInterestRate',
				label: 'Loan A APR',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0.01,
					max: 100,
					message: 'Interest rate must be between 0.01 and 100',
				},
			},
			{
				name: 'loan1TermYears',
				label: 'Loan A Term',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter loan term',
				validation: {
					required: true,
					min: 1,
					max: 50,
					message: 'Loan term must be between 1 and 50 years',
				},
			},
			{
				name: 'loan1Fees',
				label: 'Loan A Fees (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter fees',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Fees must be greater than or equal to 0',
				},
			},
			{
				name: 'loan1ExtraMonthlyPayment',
				label: 'Loan A Extra Payment (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter extra payment',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Extra payment must be greater than or equal to 0',
				},
			},
			{
				name: 'loan2Name',
				label: 'Loan B Name',
				type: 'text',
				placeholder: 'Enter loan name',
				defaultValue: 'Loan B',
				validation: {
					required: true,
					message: 'Loan name is required',
				},
			},
			{
				name: 'loan2Amount',
				label: 'Loan B Amount',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter loan amount',
				validation: {
					required: true,
					min: 0.01,
					message: 'Loan amount must be greater than 0',
				},
			},
			{
				name: 'loan2AnnualInterestRate',
				label: 'Loan B APR',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0.01,
					max: 100,
					message: 'Interest rate must be between 0.01 and 100',
				},
			},
			{
				name: 'loan2TermYears',
				label: 'Loan B Term',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter loan term',
				validation: {
					required: true,
					min: 1,
					max: 50,
					message: 'Loan term must be between 1 and 50 years',
				},
			},
			{
				name: 'loan2Fees',
				label: 'Loan B Fees (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter fees',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Fees must be greater than or equal to 0',
				},
			},
			{
				name: 'loan2ExtraMonthlyPayment',
				label: 'Loan B Extra Payment (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter extra payment',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Extra payment must be greater than or equal to 0',
				},
			},
		],
		outputs: [
			{
				name: 'comparisonTable',
				label: 'Comparison Table',
			},
			{
				name: 'winner',
				label: 'Winner',
			},
			{
				name: 'bestLoanByMetric',
				label: 'Best Loan by Metric',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateLoanComparison,
		howToBullets: [
			'Select comparison metric - choose whether to find the loan with lowest monthly payment, lowest total interest, or lowest total cost',
			'Select payment frequency - choose monthly or bi-weekly payments',
			'Enter Loan A details - loan name, amount, APR, term, optional fees, and optional extra monthly payment',
			'Enter Loan B details - same information for the second loan',
			'Optionally add more loans (Loan C, D, E) if comparing more than 2 loans',
			'Click "Calculate" to see the comparison results',
			'Review the comparison table - shows monthly payment, total interest, total cost, and term for each loan',
			'Check the winner banner - highlights which loan is best by your selected metric',
			'Compare the metrics - understand that lowest monthly payment doesn\'t always mean lowest total cost',
			'Consider fees - fees are included in total cost, which can change which loan is best',
			'Review extra payment impact - if you entered extra payments, see how they affect payoff time and interest saved',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Same Amount, Different APR',
				inputDescription:
					'$20,000 loan at 7% APR for 5 years vs $20,000 loan at 9% APR for 5 years',
				steps: [
					'Loan A: $20,000, 7% APR, 5 years',
					'Loan B: $20,000, 9% APR, 5 years',
					'Comparison metric: Lowest Total Interest',
					'Loan A monthly payment: $396.36',
					'Loan B monthly payment: $415.17',
					'Loan A total interest: $3,781.60',
					'Loan B total interest: $4,910.20',
					'Winner: Loan A (lower APR = less interest)',
				],
				resultDescription:
					'Comparing two $20,000 loans with different APRs (7% vs 9%) over 5 years shows that Loan A with 7% APR has a lower monthly payment ($396.36 vs $415.17) and significantly less total interest ($3,781.60 vs $4,910.20). The 2% APR difference saves over $1,100 in interest, demonstrating why APR matters more than loan amount when comparing loans.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Same APR, Different Terms',
				inputDescription:
					'$20,000 loan at 8% APR for 3 years vs $20,000 loan at 8% APR for 5 years',
				steps: [
					'Loan A: $20,000, 8% APR, 3 years',
					'Loan B: $20,000, 8% APR, 5 years',
					'Comparison metric: Lowest Total Interest',
					'Loan A monthly payment: $626.73',
					'Loan B monthly payment: $405.53',
					'Loan A total interest: $2,562.28',
					'Loan B total interest: $4,331.80',
					'Winner: Loan A (shorter term = less interest)',
				],
				resultDescription:
					'Comparing two $20,000 loans at 8% APR with different terms (3 years vs 5 years) shows the trade-off: Loan A has a higher monthly payment ($626.73 vs $405.53) but significantly less total interest ($2,562.28 vs $4,331.80). The shorter term saves nearly $1,800 in interest, demonstrating that longer terms reduce monthly payments but increase total cost.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Fees vs Lower APR',
				inputDescription:
					'$25,000 loan at 6.5% APR for 5 years with $500 fee vs $25,000 loan at 6.9% APR for 5 years with $0 fee',
				steps: [
					'Loan A: $25,000, 6.5% APR, 5 years, $500 fee',
					'Loan B: $25,000, 6.9% APR, 5 years, $0 fee',
					'Comparison metric: Lowest Total Cost',
					'Loan A monthly payment: $489.40',
					'Loan B monthly payment: $494.27',
					'Loan A total interest: $4,364.00',
					'Loan B total interest: $4,656.20',
					'Loan A total cost: $29,364.00',
					'Loan B total cost: $29,656.20',
					'Winner: Loan A (lower APR + fee still cheaper overall)',
				],
				resultDescription:
					'Comparing loans with fees vs higher APR shows that Loan A with 6.5% APR and a $500 fee has a lower total cost ($29,364 vs $29,656) than Loan B with 6.9% APR and no fee. Even with the fee, the lower APR saves money overall. This demonstrates why it\'s important to compare total cost, not just APR or fees individually.',
			},
		],
		faq: [
			{
				question: 'How do I compare loans?',
				answer:
					'To compare loans effectively, gather the same information for each loan: loan amount, APR (Annual Percentage Rate), loan term, and any fees. Enter this information into the calculator and select your comparison metric (lowest monthly payment, lowest total interest, or lowest total cost). The calculator will show you which loan is best for your selected metric and provide a side-by-side comparison table.',
			},
			{
				question: 'What is APR?',
				answer:
					'APR (Annual Percentage Rate) is the annual interest rate charged on your loan. It represents the true cost of borrowing money. When comparing loans, APR is one of the most important factors because it directly affects your monthly payment and total interest. A lower APR means lower payments and less total interest, even if other factors (like fees) are the same.',
			},
			{
				question: 'What is the difference between monthly payment and total interest?',
				answer:
					'Monthly payment is what you pay each month (principal + interest). Total interest is the total amount of interest you pay over the entire loan term. A loan with a lower monthly payment may have higher total interest if it has a longer term. Always consider both metrics when comparing loans - lower monthly payments are easier on your budget, but lower total interest saves money overall.',
			},
			{
				question: 'Is a longer loan term better?',
				answer:
					'Longer loan terms reduce monthly payments but increase total interest. For example, a $20,000 loan at 8% costs $2,562 in interest over 3 years but $4,332 over 5 years. Longer terms are better if you need lower monthly payments and can afford the extra interest. Shorter terms are better if you want to minimize total cost and can afford higher payments.',
			},
			{
				question: 'What fees should I include when comparing loans?',
				answer:
					'Include all upfront fees: origination fees, application fees, processing fees, and any other one-time charges. Don\'t include ongoing fees like late payment fees or prepayment penalties (unless you plan to pay late or prepay). Fees are important because they increase your total cost - a loan with a lower APR but high fees may cost more overall than a loan with a slightly higher APR but no fees.',
			},
			{
				question: 'Should I refinance my loan?',
				answer:
					'Refinancing can be beneficial if you can get a lower APR, shorter term, or both. However, refinancing has costs (closing fees, etc.) that must be considered. Use this calculator to compare your current loan with potential refinance offers. Calculate the break-even point - how long it takes for savings to exceed refinancing costs. If you plan to stay in the loan long enough, refinancing can save money.',
			},
			{
				question: 'How do extra payments affect loan comparison?',
				answer:
					'Extra payments reduce your loan term and total interest paid. When comparing loans, if you plan to make extra payments, enter them in the calculator to see the true cost difference. A loan that looks worse without extra payments may become better with extra payments if it has more favorable terms for early payoff. Extra payments are most effective on loans with higher interest rates.',
			},
			{
				question: 'What is the difference between fixed and variable interest rates?',
				answer:
					'Fixed rates stay the same for the entire loan term, making payments predictable. Variable rates can change based on market conditions, making payments unpredictable. This calculator assumes fixed rates. For variable rate loans, use the initial rate as a baseline, but understand that payments may increase. Fixed rates are generally safer for budgeting, while variable rates may start lower but carry risk.',
			},
			{
				question: 'How accurate is this loan comparison?',
				answer:
					'This comparison is accurate for standard fixed-rate loans with fixed monthly payments. It assumes: payments are made on time, interest compounds monthly, no prepayment penalties (unless specified), and standard amortization. Actual results may vary due to: variable rates, payment timing, lender-specific terms, or fees not included. Always verify with lenders for exact amounts and terms.',
			},
			{
				question: 'What if loans have different amounts?',
				answer:
					'You can compare loans with different amounts. The calculator will show monthly payments, total interest, and total cost for each loan. However, comparing different amounts can be misleading - a $10,000 loan will always have lower payments than a $20,000 loan. For fair comparison, try to compare loans for the same purpose or normalize the amounts. The comparison is most useful when loan amounts are similar.',
			},
			{
				question: 'Can I compare more than 2 loans?',
				answer:
					'Yes, this calculator supports comparing 2-5 loans. Enter details for Loan A, Loan B, and optionally Loan C, D, and E. The comparison table will show all loans side-by-side, making it easy to see which loan is best for your selected metric. Comparing more loans gives you more options but can make the decision more complex.',
			},
			{
				question: 'What if I can\'t afford the monthly payment of the "best" loan?',
				answer:
					'If the loan with the lowest total cost has a monthly payment you can\'t afford, you may need to choose a loan with a longer term (higher total cost but lower monthly payment). Use the "Lowest Monthly Payment" metric to find the most affordable option. However, remember that longer terms increase total interest - try to find a balance between affordability and total cost.',
			},
			{
				question: 'How do I know which comparison metric to use?',
				answer:
					'Use "Lowest Monthly Payment" if budget is your primary concern and you need the most affordable monthly payment. Use "Lowest Total Interest" if you want to minimize the cost of borrowing and can afford higher payments. Use "Lowest Total Cost" if you want the most economical loan overall, considering both interest and fees. Consider your financial situation and goals when choosing a metric.',
			},
		],
		relatedIds: [
			'loan-payment',
			'loan-overpayment-calculator',
			'personal-loan-calculator',
			'auto-loan-calculator',
			'mortgage-calculator',
		],
		standardIds: [],
		tags: ['finance', 'loans', 'compare-loans', 'loan-payment', 'apr', 'interest', 'amortization'],
		meta: {
			keywords: [
				'loan comparison calculator',
				'compare loans',
				'loan comparison tool',
				'compare loan offers',
				'best loan calculator',
				'loan APR comparison',
				'compare loan payments',
				'loan interest comparison',
				'compare loan costs',
				'loan comparison tool',
			],
		},
		isEnabled: true,
	},
	// Mortgage Comparison (EN)
	{
		id: 'mortgage-comparison-calculator',
		slug: 'mortgage-comparison-calculator',
		category: 'finance',
		title: 'Mortgage Comparison Calculator',
		shortDescription:
			'Compare mortgage offers side-by-side. See monthly payments, total interest, taxes, insurance, and total cost to choose the best mortgage.',
		longDescription:
			'Compare mortgage offers side-by-side. See monthly payments, total interest, taxes, insurance, and total cost to choose the best mortgage. This calculator helps you evaluate multiple mortgage options simultaneously, showing which mortgage is best for lowest monthly payment, lowest total interest, lowest total cost, or fastest payoff. Perfect for comparing different mortgage offers, loan terms, down payment options, and interest rates.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'comparisonMetric',
				label: 'Comparison Metric',
				type: 'select',
				options: [
					{ value: 'lowest-total-monthly-payment', label: 'Lowest Total Monthly Payment' },
					{ value: 'lowest-total-interest', label: 'Lowest Total Interest' },
					{ value: 'lowest-total-cost', label: 'Lowest Total Cost' },
					{ value: 'fastest-payoff', label: 'Fastest Payoff' },
				],
				defaultValue: 'lowest-total-monthly-payment',
				helpText: 'Select which metric to use for determining the best mortgage',
			},
			{
				name: 'includeTaxesInsurance',
				label: 'Include Taxes & Insurance',
				type: 'checkbox',
				defaultValue: false,
				helpText: 'Include property taxes and insurance in total monthly payment',
			},
			{
				name: 'scenario1Name',
				label: 'Mortgage A Name',
				type: 'text',
				placeholder: 'Enter mortgage name',
				defaultValue: 'Mortgage A',
				validation: {
					required: true,
					message: 'Mortgage name is required',
				},
			},
			{
				name: 'scenario1HomePrice',
				label: 'Mortgage A Home Price',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter home price',
				validation: {
					required: true,
					min: 0.01,
					message: 'Home price must be greater than 0',
				},
			},
			{
				name: 'scenario1DownPayment',
				label: 'Mortgage A Down Payment',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter down payment',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Down payment must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario1DownPaymentType',
				label: 'Mortgage A Down Payment Type',
				type: 'select',
				options: [
					{ value: 'amount', label: 'Amount ($)' },
					{ value: 'percentage', label: 'Percentage (%)' },
				],
				defaultValue: 'amount',
				helpText: 'Choose whether down payment is amount or percentage',
			},
			{
				name: 'scenario1InterestRateAPR',
				label: 'Mortgage A APR',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0.01,
					max: 30,
					message: 'Interest rate must be between 0.01 and 30',
				},
			},
			{
				name: 'scenario1LoanTermYears',
				label: 'Mortgage A Term',
				type: 'select',
				options: [
					{ value: '15', label: '15 years' },
					{ value: '20', label: '20 years' },
					{ value: '25', label: '25 years' },
					{ value: '30', label: '30 years' },
				],
				defaultValue: '30',
				helpText: 'Loan term in years',
			},
			{
				name: 'scenario1PropertyTaxAnnual',
				label: 'Mortgage A Property Tax (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter property tax',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Property tax must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario1PropertyTaxType',
				label: 'Mortgage A Property Tax Type',
				type: 'select',
				options: [
					{ value: 'amount', label: 'Annual Amount ($)' },
					{ value: 'percentage', label: 'Percentage (%)' },
				],
				defaultValue: 'amount',
				helpText: 'Choose whether property tax is amount or percentage',
			},
			{
				name: 'scenario1HomeInsuranceAnnual',
				label: 'Mortgage A Home Insurance (Optional)',
				type: 'number',
				unitLabel: '$/year',
				placeholder: 'Enter annual insurance',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Home insurance must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario1HOAmonthly',
				label: 'Mortgage A HOA Fees (Optional)',
				type: 'number',
				unitLabel: '$/month',
				placeholder: 'Enter monthly HOA',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'HOA fees must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario1ExtraMonthlyPayment',
				label: 'Mortgage A Extra Payment (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter extra payment',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Extra payment must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario1ClosingCosts',
				label: 'Mortgage A Closing Costs (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter closing costs',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Closing costs must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario2Name',
				label: 'Mortgage B Name',
				type: 'text',
				placeholder: 'Enter mortgage name',
				defaultValue: 'Mortgage B',
				validation: {
					required: true,
					message: 'Mortgage name is required',
				},
			},
			{
				name: 'scenario2HomePrice',
				label: 'Mortgage B Home Price',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter home price',
				validation: {
					required: true,
					min: 0.01,
					message: 'Home price must be greater than 0',
				},
			},
			{
				name: 'scenario2DownPayment',
				label: 'Mortgage B Down Payment',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter down payment',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Down payment must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario2DownPaymentType',
				label: 'Mortgage B Down Payment Type',
				type: 'select',
				options: [
					{ value: 'amount', label: 'Amount ($)' },
					{ value: 'percentage', label: 'Percentage (%)' },
				],
				defaultValue: 'amount',
				helpText: 'Choose whether down payment is amount or percentage',
			},
			{
				name: 'scenario2InterestRateAPR',
				label: 'Mortgage B APR',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				validation: {
					required: true,
					min: 0.01,
					max: 30,
					message: 'Interest rate must be between 0.01 and 30',
				},
			},
			{
				name: 'scenario2LoanTermYears',
				label: 'Mortgage B Term',
				type: 'select',
				options: [
					{ value: '15', label: '15 years' },
					{ value: '20', label: '20 years' },
					{ value: '25', label: '25 years' },
					{ value: '30', label: '30 years' },
				],
				defaultValue: '30',
				helpText: 'Loan term in years',
			},
			{
				name: 'scenario2PropertyTaxAnnual',
				label: 'Mortgage B Property Tax (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter property tax',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Property tax must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario2PropertyTaxType',
				label: 'Mortgage B Property Tax Type',
				type: 'select',
				options: [
					{ value: 'amount', label: 'Annual Amount ($)' },
					{ value: 'percentage', label: 'Percentage (%)' },
				],
				defaultValue: 'amount',
				helpText: 'Choose whether property tax is amount or percentage',
			},
			{
				name: 'scenario2HomeInsuranceAnnual',
				label: 'Mortgage B Home Insurance (Optional)',
				type: 'number',
				unitLabel: '$/year',
				placeholder: 'Enter annual insurance',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Home insurance must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario2HOAmonthly',
				label: 'Mortgage B HOA Fees (Optional)',
				type: 'number',
				unitLabel: '$/month',
				placeholder: 'Enter monthly HOA',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'HOA fees must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario2ExtraMonthlyPayment',
				label: 'Mortgage B Extra Payment (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter extra payment',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Extra payment must be greater than or equal to 0',
				},
			},
			{
				name: 'scenario2ClosingCosts',
				label: 'Mortgage B Closing Costs (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter closing costs',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Closing costs must be greater than or equal to 0',
				},
			},
		],
		outputs: [
			{
				name: 'comparisonTable',
				label: 'Comparison Table',
			},
			{
				name: 'winner',
				label: 'Winner',
			},
			{
				name: 'bestScenarioByMetric',
				label: 'Best Mortgage by Metric',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateMortgageComparison,
		howToBullets: [
			'Select comparison metric - choose whether to find the mortgage with lowest total monthly payment, lowest total interest, lowest total cost, or fastest payoff',
			'Choose whether to include taxes and insurance - toggle to include property taxes and insurance in total monthly payment (PITI)',
			'Enter Mortgage A details - mortgage name, home price, down payment (amount or percentage), APR, loan term, optional property tax, insurance, HOA, extra payments, and closing costs',
			'Enter Mortgage B details - same information for the second mortgage',
			'Optionally add more mortgages (Mortgage C, D) if comparing more than 2 mortgages',
			'Click "Calculate" to see the comparison results',
			'Review the comparison table - shows loan amount, P&I monthly, total monthly, total interest, total cost, term, APR, and payoff date for each mortgage',
			'Check the winner banner - highlights which mortgage is best by your selected metric',
			'Compare the metrics - understand that lowest monthly payment doesn\'t always mean lowest total cost',
			'Consider closing costs - closing costs are included in total cost, which can change which mortgage is best',
			'Review extra payment impact - if you entered extra payments, see how they affect payoff time and interest saved',
			'Use the insights to make an informed decision based on your financial situation and goals',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Same Home Price, Different APR',
				inputDescription:
					'$300,000 home, 20% down, 30 years, comparing 6% APR vs 6.5% APR',
				steps: [
					'Mortgage A: $300,000 home, 20% down, 6% APR, 30 years',
					'Mortgage B: $300,000 home, 20% down, 6.5% APR, 30 years',
					'Comparison metric: Lowest Total Interest',
					'Mortgage A monthly P&I: $1,438.92',
					'Mortgage B monthly P&I: $1,515.84',
					'Mortgage A total interest: $277,611.20',
					'Mortgage B total interest: $305,702.40',
					'Winner: Mortgage A (lower APR = less interest)',
				],
				resultDescription:
					'Comparing two $300,000 mortgages with 20% down payment and different APRs (6% vs 6.5%) over 30 years shows that Mortgage A with 6% APR has a lower monthly payment ($1,438.92 vs $1,515.84) and significantly less total interest ($277,611 vs $305,702). The 0.5% APR difference saves over $28,000 in interest, demonstrating why APR matters more than loan amount when comparing mortgages.',
			},
			{
				id: 'example-2',
				title: 'Example 2: 15-Year vs 30-Year Mortgage',
				inputDescription:
					'$300,000 home, 20% down, 6% APR, comparing 15-year vs 30-year term',
				steps: [
					'Mortgage A: $300,000 home, 20% down, 6% APR, 15 years',
					'Mortgage B: $300,000 home, 20% down, 6% APR, 30 years',
					'Comparison metric: Lowest Total Interest',
					'Mortgage A monthly P&I: $2,025.28',
					'Mortgage B monthly P&I: $1,438.92',
					'Mortgage A total interest: $124,550.40',
					'Mortgage B total interest: $277,611.20',
					'Winner: Mortgage A (shorter term = less interest)',
				],
				resultDescription:
					'Comparing a 15-year mortgage to a 30-year mortgage on the same $240,000 loan at 6% APR shows the trade-off: the 15-year loan has a $586.36 higher monthly payment ($2,025.28 vs $1,438.92) but saves $153,060.80 in total interest ($124,550 vs $277,611). The shorter term saves over $150,000 in interest, demonstrating that longer terms reduce monthly payments but significantly increase total cost.',
			},
			{
				id: 'example-3',
				title: 'Example 3: 10% Down vs 20% Down',
				inputDescription:
					'$300,000 home, comparing 10% down vs 20% down, both at 6.5% APR for 30 years',
				steps: [
					'Mortgage A: $300,000 home, 10% down ($30,000), 6.5% APR, 30 years',
					'Mortgage B: $300,000 home, 20% down ($60,000), 6.5% APR, 30 years',
					'Comparison metric: Lowest Total Interest',
					'Mortgage A loan amount: $270,000',
					'Mortgage B loan amount: $240,000',
					'Mortgage A monthly P&I: $1,705.95',
					'Mortgage B monthly P&I: $1,515.84',
					'Mortgage A total interest: $344,142.00',
					'Mortgage B total interest: $305,702.40',
					'Winner: Mortgage B (larger down payment = less interest)',
				],
				resultDescription:
					'Comparing mortgages with different down payments (10% vs 20%) on the same $300,000 home at 6.5% APR for 30 years shows that the larger down payment reduces both monthly payment and total interest. Mortgage B with 20% down has a $190.11 lower monthly payment ($1,515.84 vs $1,705.95) and saves $38,439.60 in total interest ($305,702 vs $344,142). Additionally, a 20% down payment typically avoids PMI, further reducing costs.',
			},
			{
				id: 'example-4',
				title: 'Example 4: Closing Costs vs Higher APR',
				inputDescription:
					'$300,000 home, 20% down, 30 years, comparing 6% APR with $5,000 closing costs vs 6.3% APR with $0 closing costs',
				steps: [
					'Mortgage A: $300,000 home, 20% down, 6% APR, 30 years, $5,000 closing costs',
					'Mortgage B: $300,000 home, 20% down, 6.3% APR, 30 years, $0 closing costs',
					'Comparison metric: Lowest Total Cost',
					'Mortgage A monthly P&I: $1,438.92',
					'Mortgage B monthly P&I: $1,485.11',
					'Mortgage A total interest: $277,611.20',
					'Mortgage B total interest: $294,639.60',
					'Mortgage A total cost: $517,611.20',
					'Mortgage B total cost: $534,639.60',
					'Winner: Mortgage A (lower APR + closing costs still cheaper overall)',
				],
				resultDescription:
					'Comparing mortgages with closing costs vs higher APR shows that Mortgage A with 6% APR and $5,000 closing costs has a lower total cost ($517,611 vs $534,640) than Mortgage B with 6.3% APR and no closing costs. Even with closing costs, the lower APR saves money overall. This demonstrates why it\'s important to compare total cost, not just APR or closing costs individually.',
			},
		],
		faq: [
			{
				question: 'How do I compare mortgage offers?',
				answer:
					'To compare mortgage offers effectively, gather the same information for each mortgage: home price, down payment, APR, loan term, property taxes, insurance, HOA fees, closing costs, and any extra payment plans. Enter this information into the calculator and select your comparison metric (lowest monthly payment, lowest total interest, lowest total cost, or fastest payoff). The calculator will show you which mortgage is best for your selected metric and provide a side-by-side comparison table.',
			},
			{
				question: 'What is the difference between APR and interest rate?',
				answer:
					'Interest rate is the cost of borrowing money, expressed as a percentage. APR (Annual Percentage Rate) includes the interest rate plus additional fees and costs, giving you the true cost of the loan. APR is typically higher than the interest rate because it includes origination fees, points, and other costs. When comparing mortgages, use APR to see the true cost difference between offers, as it accounts for all loan costs.',
			},
			{
				question: 'What is the difference between 15-year and 30-year mortgages?',
				answer:
					'A 15-year mortgage has higher monthly payments but significantly less total interest. A 30-year mortgage has lower monthly payments but much more total interest. For example, a $240,000 loan at 6% costs $124,550 in interest over 15 years but $277,611 over 30 years. Choose 15 years if you can afford higher payments and want to save on interest. Choose 30 years for lower monthly payments and more flexibility.',
			},
			{
				question: 'How much down payment is enough?',
				answer:
					'A 20% down payment is traditionally considered ideal because it avoids Private Mortgage Insurance (PMI), qualifies you for better interest rates, and reduces your loan amount. However, many buyers put down 3-10%, especially first-time buyers. A larger down payment reduces monthly payments and total interest, but requires more upfront cash. Use this calculator to see how different down payment amounts affect your monthly payment and total cost.',
			},
			{
				question: 'Should I pay points or closing costs?',
				answer:
					'Paying points (prepaid interest) or higher closing costs can lower your interest rate, reducing monthly payments and total interest. However, you need to calculate the break-even point - how long it takes for interest savings to exceed the upfront cost. If you plan to stay in the home long enough, paying points can save money. Use this calculator to compare mortgages with and without points to see which is better for your situation.',
			},
			{
				question: 'Do property taxes and insurance matter when comparing mortgages?',
				answer:
					'Yes! Property taxes and insurance are significant ongoing costs that increase your total monthly payment. A mortgage with a lower P&I payment but higher taxes/insurance may cost more overall. This calculator allows you to include or exclude taxes and insurance in the comparison. Including them gives you a more accurate picture of your true monthly housing cost (PITI: Principal, Interest, Taxes, Insurance).',
			},
			{
				question: 'Is making extra payments worth it?',
				answer:
					'Yes! Extra payments reduce your principal balance, which reduces future interest calculations. Even small extra payments ($50-200/month) can save thousands in interest and shave years off your loan. For example, adding $200/month to a $240,000 mortgage at 6.5% saves over $68,000 in interest and reduces the loan term by 7 years. Extra payments are most effective early in the loan when interest is highest.',
			},
			{
				question: 'Should I refinance or get a new mortgage?',
				answer:
					'Refinancing can be beneficial if you can get a lower APR, shorter term, or both. However, refinancing has costs (closing fees, etc.) that must be considered. Use this calculator to compare your current mortgage with potential refinance offers. Calculate the break-even point - how long it takes for savings to exceed refinancing costs. If you plan to stay in the home long enough, refinancing can save money.',
			},
			{
				question: 'How accurate is this mortgage comparison calculator?',
				answer:
					'This comparison is accurate for standard fixed-rate mortgages with fixed monthly payments. It assumes: payments are made on time, interest compounds monthly, no prepayment penalties (unless specified), and standard amortization. Actual results may vary due to: variable rates, payment timing, lender-specific terms, PMI (if down payment < 20%), or fees not included. Always verify with lenders for exact amounts and terms.',
			},
			{
				question: 'What should I include in closing costs?',
				answer:
					'Closing costs typically include: origination fees, appraisal fees, title insurance, recording fees, prepaid property taxes and insurance, and other lender fees. Closing costs typically range from 2-5% of the loan amount. Include all upfront costs in the closing costs field to get an accurate total cost comparison. Some lenders offer "no-closing-cost" mortgages, but they often charge a higher interest rate.',
			},
			{
				question: 'How do HOA fees affect mortgage comparison?',
				answer:
					'HOA (Homeowners Association) fees are monthly fees that don\'t reduce your loan balance but increase your total monthly payment. When comparing mortgages, include HOA fees to see your true monthly housing cost. HOA fees typically range from $100-$500/month but can be higher in luxury communities. This calculator includes HOA fees in the total monthly payment and total cost calculations.',
			},
			{
				question: 'What if mortgages have different home prices?',
				answer:
					'You can compare mortgages with different home prices. The calculator will show loan amounts, monthly payments, total interest, and total cost for each mortgage. However, comparing different home prices can be misleading - a $200,000 home will always have lower payments than a $400,000 home. For fair comparison, try to compare mortgages for similar homes or normalize the amounts. The comparison is most useful when home prices are similar.',
			},
			{
				question: 'Can I compare more than 2 mortgages?',
				answer:
					'Yes, this calculator supports comparing 2-4 mortgages. Enter details for Mortgage A, Mortgage B, and optionally Mortgage C and D. The comparison table will show all mortgages side-by-side, making it easy to see which mortgage is best for your selected metric. Comparing more mortgages gives you more options but can make the decision more complex.',
			},
			{
				question: 'What if I can\'t afford the monthly payment of the "best" mortgage?',
				answer:
					'If the mortgage with the lowest total cost has a monthly payment you can\'t afford, you may need to choose a mortgage with a longer term (higher total cost but lower monthly payment) or a larger down payment. Use the "Lowest Total Monthly Payment" metric to find the most affordable option. However, remember that longer terms increase total interest - try to find a balance between affordability and total cost.',
			},
			{
				question: 'How do I know which comparison metric to use?',
				answer:
					'Use "Lowest Total Monthly Payment" if budget is your primary concern and you need the most affordable monthly payment. Use "Lowest Total Interest" if you want to minimize the cost of borrowing and can afford higher payments. Use "Lowest Total Cost" if you want the most economical mortgage overall, considering all costs. Use "Fastest Payoff" if you want to get out of debt as quickly as possible. Consider your financial situation and goals when choosing a metric.',
			},
			{
				question: 'What is PMI and how does it affect comparison?',
				answer:
					'PMI (Private Mortgage Insurance) is insurance that protects the lender if you default. It\'s typically required when your down payment is less than 20%. PMI costs 0.5-2% of the loan amount annually and is added to your monthly payment. This calculator doesn\'t automatically include PMI, but you can add it as an extra monthly cost. Once you reach 20% equity, you can usually cancel PMI, reducing your monthly payment.',
			},
			{
				question: 'Should I include taxes and insurance in the comparison?',
				answer:
					'Including taxes and insurance gives you a more accurate picture of your true monthly housing cost (PITI). However, property taxes and insurance are the same regardless of which mortgage you choose for the same home. If you\'re comparing mortgages for the same home, including them may not change which mortgage is best. If you\'re comparing mortgages for different homes, including them is essential to see the true cost difference.',
			},
		],
		relatedIds: [
			'mortgage-calculator',
			'loan-comparison-calculator',
			'loan-overpayment-calculator',
			'savings-calculator',
			'roi-calculator',
		],
		standardIds: [],
		tags: ['finance', 'mortgage', 'compare-mortgages', 'home-loan', 'apr', 'down-payment', 'interest'],
		meta: {
			keywords: [
				'mortgage comparison calculator',
				'compare mortgages',
				'mortgage comparison tool',
				'compare mortgage offers',
				'best mortgage calculator',
				'mortgage APR comparison',
				'compare mortgage payments',
				'mortgage interest comparison',
				'compare mortgage costs',
				'home loan comparison',
			],
		},
		isEnabled: true,
	},
	// Savings (EN)
	{
		id: 'savings-calculator',
		slug: 'savings-calculator',
		category: 'finance',
		title: 'Savings Calculator',
		shortDescription:
			'Plan your savings and see how regular deposits grow over time. Calculate savings growth with compound interest.',
		longDescription:
			'Calculate savings growth with regular deposits and compound interest. Plan your savings goals and see how your money grows. This calculator helps you understand how regular contributions and compound interest work together to grow your savings over time. Perfect for planning emergency funds, major purchases, or long-term savings goals.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'initialSavings',
				label: 'Initial Savings',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter initial savings',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Initial savings must be greater than or equal to 0',
				},
			},
			{
				name: 'regularContribution',
				label: 'Regular Contribution',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter contribution amount',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Regular contribution must be greater than or equal to 0',
				},
			},
			{
				name: 'contributionFrequency',
				label: 'Contribution Frequency',
				type: 'select',
				options: [
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'yearly', label: 'Yearly' },
				],
				defaultValue: 'monthly',
				helpText: 'How often you make contributions',
			},
			{
				name: 'annualInterestRate',
				label: 'Annual Interest Rate',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual interest rate',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					max: 20,
					message: 'Interest rate must be between 0 and 20',
				},
			},
			{
				name: 'savingsPeriod',
				label: 'Savings Period',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter savings period',
				validation: {
					required: true,
					min: 1,
					max: 50,
					message: 'Savings period must be between 1 and 50 years',
				},
			},
			{
				name: 'compoundingFrequency',
				label: 'Compounding Frequency',
				type: 'select',
				options: [
					{ value: 'annually', label: 'Annually' },
					{ value: 'quarterly', label: 'Quarterly' },
					{ value: 'monthly', label: 'Monthly' },
				],
				defaultValue: 'monthly',
				helpText: 'How often interest is compounded',
			},
			{
				name: 'targetAmount',
				label: 'Target Amount (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter target amount',
				defaultValue: 0,
				helpText: 'Your savings goal amount',
				validation: {
					required: true,
					min: 0,
					message: 'Target amount must be greater than or equal to 0',
				},
			},
			{
				name: 'inflationRate',
				label: 'Inflation Rate (Optional)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter inflation rate',
				defaultValue: 0,
				helpText: 'Expected annual inflation rate for real value calculation',
				validation: {
					required: true,
					min: 0,
					max: 20,
					message: 'Inflation rate must be between 0 and 20',
				},
			},
		],
		outputs: [
			{
				name: 'finalSavings',
				label: 'Final Savings Amount',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalContributions',
				label: 'Total Contributions',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalInterestEarned',
				label: 'Total Interest Earned',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'timeToTarget',
				label: 'Time to Reach Target',
				unitLabel: 'years',
				formatType: 'number',
			},
			{
				name: 'inflationAdjustedSavings',
				label: 'Inflation-Adjusted Savings',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'yearlyBreakdown',
				label: 'Year-by-Year Breakdown',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateSavings,
		howToBullets: [
			'Enter your initial savings - the amount you already have saved (can be $0)',
			'Enter your regular contribution - how much you plan to save each period (can be $0)',
			'Select contribution frequency - choose monthly or yearly contributions',
			'Enter the annual interest rate - the interest rate your savings account pays (typically 0-5% for savings accounts)',
			'Enter the savings period in years - how long you plan to save (must be an integer between 1 and 50)',
			'Select compounding frequency - choose how often interest is compounded (annually, quarterly, or monthly)',
			'Optionally enter target amount - your savings goal to see if you\'ll reach it',
			'Optionally enter inflation rate - to see the real value in today\'s purchasing power',
			'Click "Calculate" to see your savings growth projection',
			'Review the final savings amount - this is what your savings will be worth at the end of the period',
			'Understand the difference between contributions and interest - your contributions are what you save, interest is the growth from your savings',
			'If you entered a target amount, check if you\'ll reach it and how long it will take',
			'For emergency fund planning, try the Emergency Fund Calculator',
			'To compare savings vs investments, use the Investment vs Savings Calculator',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Monthly Saving Habit',
				inputDescription:
					'$5,000 initial savings, $200 monthly contributions, 4% annual interest, 10 years, monthly compounding',
				steps: [
					'Initial savings: $5,000',
					'Monthly contribution: $200',
					'Annual interest rate: 4%',
					'Savings period: 10 years',
					'Compounding frequency: Monthly',
					'Formula: Combines future value of initial savings plus future value of monthly contributions',
					'Total contributions: $5,000 + ($200 × 12 × 10) = $29,000',
					'Final savings: Approximately $38,000',
					'Total interest earned: Approximately $9,000',
				],
				resultDescription:
					'Starting with $5,000 and saving $200 monthly at 4% annual interest with monthly compounding for 10 years results in approximately $38,000. You contributed $29,000 total and earned about $9,000 in interest, demonstrating how regular contributions and compound interest work together to grow savings over time.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Saving from Zero',
				inputDescription:
					'$0 initial savings, $300 monthly contributions, 5% annual interest, 15 years, monthly compounding',
				steps: [
					'Initial savings: $0',
					'Monthly contribution: $300',
					'Annual interest rate: 5%',
					'Savings period: 15 years',
					'Compounding frequency: Monthly',
					'Formula: Future value of annuity (monthly contributions)',
					'Total contributions: $0 + ($300 × 12 × 15) = $54,000',
					'Final savings: Approximately $80,000',
					'Total interest earned: Approximately $26,000',
				],
				resultDescription:
					'Starting with $0 and saving $300 monthly for 15 years at 5% annual interest with monthly compounding results in approximately $80,000. You contributed $54,000 and earned about $26,000 in interest, showing how consistent saving habits can build significant savings even without an initial amount. The power of compound interest is evident in the interest earned.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Target-Based Savings',
				inputDescription:
					'$2,000 initial savings, $250 monthly contributions, 4% annual interest, target: $50,000',
				steps: [
					'Initial savings: $2,000',
					'Monthly contribution: $250',
					'Annual interest rate: 4%',
					'Target amount: $50,000',
					'Compounding frequency: Monthly',
					'Formula: Calculates time needed to reach target',
					'Monthly contribution: $250',
					'Estimated time to reach $50,000: Approximately 14-15 years',
					'This shows how long it takes to reach a specific savings goal',
				],
				resultDescription:
					'Starting with $2,000 and saving $250 monthly at 4% annual interest, it takes approximately 14-15 years to reach a $50,000 savings goal. This demonstrates how target-based savings planning helps you understand the time commitment needed to reach specific financial goals. Regular contributions combined with compound interest make goal achievement possible.',
			},
		],
		faq: [
			{
				question: 'What is a savings calculator?',
				answer:
					'A savings calculator helps you project how your savings will grow over time with regular contributions and compound interest. It shows your final savings amount, total contributions, total interest earned, and helps you plan for savings goals. It\'s different from an investment calculator because it focuses on lower-risk, lower-return savings accounts rather than higher-risk investments.',
			},
			{
				question: 'How much should I save monthly?',
				answer:
					'The amount you should save monthly depends on your goals, income, and expenses. Common recommendations include: 20% of income for general savings, 3-6 months of expenses for emergency fund, and specific amounts for major purchases (house, car, etc.). Start with what you can afford and increase over time. Even small amounts ($50-100/month) add up significantly over years with compound interest.',
			},
			{
				question: 'What is the difference between savings and investing?',
				answer:
					'Savings are typically low-risk, low-return accounts (savings accounts, CDs) that preserve capital and earn modest interest (0.5-5%). Investing involves higher-risk assets (stocks, bonds, real estate) that can earn higher returns (7-10%+) but can also lose value. Savings are for short-term goals and emergency funds. Investing is for long-term wealth building. This calculator focuses on savings accounts.',
			},
			{
				question: 'How does interest affect savings?',
				answer:
					'Interest is the money your savings account pays you for keeping your money with the bank. With compound interest, you earn interest on both your principal and previously earned interest, creating exponential growth over time. Even modest interest rates (2-4%) can significantly increase your savings over long periods. Higher interest rates and more frequent compounding result in more growth.',
			},
			{
				question: 'Is compound interest realistic for savings accounts?',
				answer:
					'Yes, compound interest is how savings accounts actually work. Most savings accounts compound interest monthly or daily, meaning you earn interest on your interest. However, savings account interest rates are typically low (0.5-5% annually) compared to investments. The compound interest effect is real but modest for savings accounts, making it important to save regularly and for long periods.',
			},
			{
				question: 'What happens if I save with zero interest?',
				answer:
					'If your savings account pays 0% interest, your savings grow only through your contributions. For example, saving $200 monthly for 10 years results in $24,000 (no interest earned). While you still build savings, you miss out on the growth that compound interest provides. Even low interest rates (1-2%) can add thousands to your savings over time.',
			},
			{
				question: 'How does inflation affect savings?',
				answer:
					'Inflation erodes the purchasing power of your savings over time. If your savings grow 3% but inflation is 3%, your real purchasing power stays the same. If inflation is higher than your interest rate, your savings lose purchasing power even though the dollar amount increases. The inflation-adjusted value shows what your savings are worth in today\'s dollars, accounting for inflation.',
			},
			{
				question: 'What is the difference between short-term and long-term savings?',
				answer:
					'Short-term savings (1-3 years) are for immediate goals like vacations, emergency funds, or major purchases. They typically use low-risk savings accounts. Long-term savings (5+ years) can benefit more from compound interest and may consider higher-yield savings accounts or CDs. Longer periods allow compound interest to work more effectively, significantly increasing your savings.',
			},
			{
				question: 'Can I reach my savings goal faster?',
				answer:
					'You can reach your savings goal faster by: increasing your monthly contribution, starting with a larger initial amount, finding a higher interest rate account, or reducing your target amount. Even small increases in monthly contributions can significantly reduce the time needed to reach your goal. Use this calculator to see how different contribution amounts affect your timeline.',
			},
			{
				question: 'Is this savings calculation accurate?',
				answer:
					'This calculation is accurate for standard savings accounts with fixed interest rates and regular contributions. It assumes: interest compounds at the specified frequency, contributions are made on schedule, interest rates remain constant, and no withdrawals are made. Actual results may vary due to changing interest rates, missed contributions, fees, or account-specific terms. Always verify with your bank for exact amounts.',
			},
			{
				question: 'Should I save monthly or yearly?',
				answer:
					'Monthly saving is generally recommended because it allows for more frequent compounding, creates a consistent habit, and is easier to budget (smaller amounts). Yearly saving may be simpler but requires larger lump sums and misses opportunities for more frequent compounding. Most people find monthly saving more manageable and effective.',
			},
			{
				question: 'What is a good interest rate for savings?',
				answer:
					'Good savings account interest rates vary by economic conditions. As of recent years, high-yield savings accounts offer 4-5% APY, traditional savings accounts offer 0.5-2% APY, and money market accounts offer 3-5% APY. Compare rates from multiple banks and credit unions. Online banks often offer higher rates than traditional banks. Always check for minimum balance requirements and fees.',
			},
			{
				question: 'How do I choose a savings account?',
				answer:
					'When choosing a savings account, consider: interest rate (APY), minimum balance requirements, fees (monthly maintenance, transaction limits), accessibility (online vs. branch), FDIC insurance (up to $250,000), and convenience. High-yield savings accounts typically offer the best rates but may have higher minimums or be online-only. Compare multiple options to find the best fit.',
			},
		],
		relatedIds: [
			'compound-interest',
			'emergency-fund-calculator',
			'investment-vs-savings-calculator',
			'take-home-pay-calculator',
		],
		standardIds: [],
		tags: ['finance', 'savings', 'saving-goals', 'compound-interest', 'planning', 'deposits'],
		meta: {
			keywords: [
				'savings calculator',
				'savings growth calculator',
				'savings goal calculator',
				'compound interest savings',
				'savings planning calculator',
				'how much will I save',
				'savings account calculator',
				'regular savings calculator',
				'savings projection calculator',
				'emergency fund calculator',
			],
		},
	},
	// Percentage of a Number (RU)
	{
		id: 'percentage-of-a-number',
		slug: 'percentage-of-a-number',
		category: 'math',
		title: 'Процент от числа',
		shortDescription:
			'Рассчитайте, сколько составляет определенный процент от числа. Полезно для расчета скидок, чаевых, налогов и других процентных вычислений.',
		longDescription:
			'Этот калькулятор помогает определить, сколько составляет определенный процент от любого числа. Просто введите базовое число и процент, который хотите рассчитать. Идеально подходит для расчета скидок, чаевых, налогов, комиссий и любых других процентных вычислений.',
		locale: 'ru',
		inputs: [
			{
				name: 'value',
				label: 'Число',
				type: 'number',
				placeholder: 'Введите число',
				validation: {
					required: true,
					min: 0,
					message: 'Число должно быть больше или равно 0',
				},
			},
			{
				name: 'percent',
				label: 'Процент',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Введите процент',
				validation: {
					required: true,
					min: 0,
					max: 1000,
					message: 'Процент должен быть от 0 до 1000',
				},
			},
		],
		outputs: [
			{
				name: 'result',
				label: 'Результат',
				formatType: 'number',
			},
		],
		calculate: calculatePercentageOfNumber,
		howToBullets: [
			'Введите число, от которого хотите рассчитать процент',
			'Введите значение процента (например, 20 для 20%)',
			'Нажмите "Рассчитать" для получения результата',
			'Результат показывает, сколько составляет процент от числа',
			'Вы можете использовать это для скидок, чаевых, налогов и многого другого',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Пример 1: Рассчитать 20% от 100',
				inputDescription: 'Рассчитать 20% от 100',
				steps: [
					'Число: 100',
					'Процент: 20%',
					'Расчет: (100 × 20) / 100',
					'Результат: 20',
				],
				resultDescription: '20% от 100 равно 20',
			},
			{
				id: 'example-2',
				title: 'Пример 2: Рассчитать 15% чаевых',
				inputDescription: 'Рассчитать 15% чаевых со счета 250 рублей',
				steps: [
					'Число: 250',
					'Процент: 15%',
					'Расчет: (250 × 15) / 100',
					'Результат: 37.5',
				],
				resultDescription: '15% чаевых с 250 рублей составляет 37.50 рублей',
			},
		],
		faq: [
			{
				question: 'Как рассчитать процент от числа?',
				answer:
					'Чтобы рассчитать процент от числа, умножьте число на процент и разделите на 100. Например, 20% от 100 = (100 × 20) / 100 = 20.',
			},
			{
				question: 'Можно ли использовать это для скидок?',
				answer:
					'Да! Введите исходную цену как число и процент скидки. Результат покажет сумму скидки.',
			},
			{
				question: 'Что если я хочу рассчитать чаевые?',
				answer:
					'Введите сумму счета как число и процент чаевых (например, 15 для 15% чаевых). Результат покажет сумму чаевых.',
			},
		],
		relatedIds: ['loan-payment'],
		meta: {
			keywords: ['процент', 'расчет', 'математика', 'скидка', 'чаевые', 'налог'],
		},
	},
	// Loan Payment (RU)
	{
		id: 'loan-payment',
		slug: 'loan-payment',
		category: 'finance',
		title: 'Калькулятор платежей по кредиту',
		shortDescription:
			'Рассчитайте ежемесячный платеж по кредиту, общую сумму выплат и общую сумму процентов за весь срок кредита.',
		longDescription:
			'Этот калькулятор помогает определить ежемесячный платеж по кредиту, используя стандартную формулу кредита. Введите сумму кредита, годовую процентную ставку и срок кредита в годах. Калькулятор покажет ежемесячный платеж, общую сумму выплат за весь срок кредита и общую сумму процентов. Работает для ипотеки, автокредитов, потребительских кредитов и любых кредитов с фиксированной ставкой.',
		locale: 'ru',
		inputs: [
			{
				name: 'principal',
				label: 'Сумма кредита',
				type: 'number',
				unitLabel: '₽',
				placeholder: 'Введите сумму кредита',
				validation: {
					required: true,
					min: 0,
					message: 'Сумма кредита должна быть больше 0',
				},
			},
			{
				name: 'annualRate',
				label: 'Годовая процентная ставка',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Введите годовую процентную ставку',
				validation: {
					required: true,
					min: 0,
					max: 100,
					message: 'Процентная ставка должна быть от 0 до 100',
				},
			},
			{
				name: 'years',
				label: 'Срок кредита',
				type: 'number',
				unitLabel: 'лет',
				placeholder: 'Введите срок кредита в годах',
				step: 0.5,
				validation: {
					required: true,
					min: 0.1,
					max: 100,
					message: 'Срок кредита должен быть от 0.1 до 100 лет',
				},
			},
		],
		outputs: [
			{
				name: 'monthlyPayment',
				label: 'Ежемесячный платеж',
				unitLabel: '₽',
				formatType: 'number',
			},
			{
				name: 'totalPayment',
				label: 'Общая сумма выплат',
				unitLabel: '₽',
				formatType: 'number',
			},
			{
				name: 'totalInterest',
				label: 'Общая сумма процентов',
				unitLabel: '₽',
				formatType: 'number',
			},
		],
		calculate: calculateLoanPayment,
		howToBullets: [
			'Введите сумму кредита (основной долг)',
			'Введите годовую процентную ставку в процентах (например, 5 для 5%)',
			'Введите срок кредита в годах',
			'Нажмите "Рассчитать", чтобы увидеть ежемесячный платеж, общую сумму выплат и общую сумму процентов',
			'Ежемесячный платеж рассчитывается по стандартной формуле кредита',
			'Общая сумма выплат включает как основной долг, так и проценты',
			'Общая сумма процентов показывает, сколько вы заплатите процентов за весь срок кредита',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Пример 1: Ипотека 1,000,000 рублей под 5% на 30 лет',
				inputDescription: 'Кредит 1,000,000 рублей под 5% годовых на 30 лет',
				steps: [
					'Основной долг: 1,000,000 рублей',
					'Годовая ставка: 5% (месячная ставка: 5% / 12 = 0.4167%)',
					'Срок: 30 лет (360 месяцев)',
					'Ежемесячный платеж: 5,368.22 рублей',
					'Общая сумма выплат: 1,932,557.80 рублей',
					'Общая сумма процентов: 932,557.80 рублей',
				],
				resultDescription: 'Ежемесячный платеж: 5,368.22 рублей',
			},
		],
		faq: [
			{
				question: 'Как рассчитывается ежемесячный платеж?',
				answer:
					'Ежемесячный платеж рассчитывается по стандартной формуле кредита: M = P × [r(1+r)^n] / [(1+r)^n - 1], где P - основной долг, r - месячная процентная ставка, n - количество платежей.',
			},
			{
				question: 'Что входит в общую сумму выплат?',
				answer:
					'Общая сумма выплат включает как сумму основного долга, так и все проценты, выплаченные за весь срок кредита.',
			},
			{
				question: 'Можно ли использовать это для ипотеки?',
				answer:
					'Да, этот калькулятор работает для любых кредитов с фиксированной ставкой, включая ипотеку, автокредиты и потребительские кредиты.',
			},
		],
		relatedIds: ['percentage-of-a-number'],
		meta: {
			keywords: ['кредит', 'ипотека', 'платеж', 'финансы', 'проценты', 'аннуитет'],
		},
	},
	// Retirement Calculator (EN)
	{
		id: 'retirement-calculator',
		slug: 'retirement-calculator',
		category: 'finance',
		title: 'Retirement Calculator',
		shortDescription:
			'Plan your retirement savings and income. Estimate how much you will have and how much you need to retire comfortably.',
		longDescription:
			'Plan your retirement savings and income. This retirement calculator helps you answer two key questions: "How much will I have at retirement?" and "How much do I need to save?" Calculate future balance based on current savings, contributions, and returns, or determine required savings for your desired retirement income. Includes inflation adjustments and withdrawal rate calculations.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'calculationMode',
				label: 'Calculation Mode',
				type: 'select',
				options: [
					{ value: 'future_balance', label: 'How much will I have?' },
					{ value: 'required_savings', label: 'How much do I need?' },
				],
				defaultValue: 'future_balance',
				helpText: 'Choose what you want to calculate',
			},
			{
				name: 'currentAge',
				label: 'Current Age',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter your current age',
				validation: {
					required: true,
					min: 18,
					max: 75,
					message: 'Age must be between 18 and 75',
				},
			},
			{
				name: 'retirementAge',
				label: 'Retirement Age',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter retirement age',
				validation: {
					required: true,
					min: 18,
					max: 75,
					message: 'Retirement age must be between 18 and 75',
				},
			},
			{
				name: 'currentSavings',
				label: 'Current Savings',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter current savings',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Current savings must be greater than or equal to 0',
				},
			},
			{
				name: 'monthlyContribution',
				label: 'Monthly Contribution',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter monthly contribution',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Monthly contribution must be greater than or equal to 0',
				},
			},
			{
				name: 'annualReturnRate',
				label: 'Annual Return Rate',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter annual return rate',
				validation: {
					required: true,
					min: 0,
					max: 50,
					message: 'Return rate must be between 0 and 50',
				},
			},
			{
				name: 'contributionGrowthRate',
				label: 'Contribution Growth Rate (Optional)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter growth rate',
				defaultValue: 0,
				helpText: 'Annual increase in contributions (e.g., salary raises)',
				validation: {
					required: true,
					min: 0,
					max: 10,
					message: 'Growth rate must be between 0 and 10',
				},
			},
			{
				name: 'inflationRate',
				label: 'Inflation Rate (Optional)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter inflation rate',
				defaultValue: 2.5,
				helpText: 'Annual inflation rate (typically 2-3%)',
				validation: {
					required: true,
					min: 0,
					max: 20,
					message: 'Inflation rate must be between 0 and 20',
				},
			},
			{
				name: 'compoundFrequency',
				label: 'Compound Frequency',
				type: 'select',
				options: [
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'annual', label: 'Annual' },
				],
				defaultValue: 'monthly',
				helpText: 'How often interest compounds',
			},
			{
				name: 'lifeExpectancy',
				label: 'Life Expectancy (Required for "How much do I need?")',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter life expectancy',
				defaultValue: 85,
				validation: {
					required: true,
					min: 60,
					max: 100,
					message: 'Life expectancy must be between 60 and 100',
				},
			},
			{
				name: 'desiredMonthlyIncome',
				label: 'Desired Monthly Income (Required for "How much do I need?")',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter desired monthly income',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Desired monthly income must be greater than or equal to 0',
				},
			},
			{
				name: 'expectedReturnRate',
				label: 'Expected Return Rate During Retirement (Required for "How much do I need?")',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter expected return rate',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					max: 50,
					message: 'Return rate must be between 0 and 50',
				},
			},
			{
				name: 'withdrawalRate',
				label: 'Withdrawal Rate (Optional)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter withdrawal rate',
				defaultValue: 0,
				helpText: 'Safe withdrawal rate (typically 3-4%). Leave 0 to use annuity calculation.',
				validation: {
					required: true,
					min: 0,
					max: 10,
					message: 'Withdrawal rate must be between 0 and 10',
				},
			},
		],
		outputs: [
			{
				name: 'finalBalance',
				label: 'Final Balance',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalContributed',
				label: 'Total Contributed',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalEarnings',
				label: 'Total Earnings',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'inflationAdjustedBalance',
				label: 'Inflation-Adjusted Balance',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'monthlyRetirementIncome',
				label: 'Monthly Retirement Income',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'requiredRetirementFund',
				label: 'Required Retirement Fund',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'monthlyIncomeAchievable',
				label: 'Monthly Income Achievable',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'savingsGap',
				label: 'Savings Gap',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'requiredMonthlyContribution',
				label: 'Required Monthly Contribution',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'yearlyBreakdown',
				label: 'Year-by-Year Breakdown',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateRetirement,
		howToBullets: [
			'Select calculation mode - choose "How much will I have?" to project your future balance, or "How much do I need?" to determine required savings',
			'Enter your current age and desired retirement age - this determines how many years you have to save',
			'Enter your current savings - the amount you already have saved for retirement',
			'Enter your monthly contribution - how much you plan to save each month',
			'Enter annual return rate - expected investment return (typically 6-8% for balanced portfolio)',
			'Optionally enter contribution growth rate - annual increase in contributions due to salary raises',
			'Optionally enter inflation rate - annual inflation (typically 2-3%) to see real purchasing power',
			'Select compound frequency - monthly or annual compounding',
			'For "How much do I need?" mode: enter life expectancy, desired monthly income, expected return rate during retirement, and optional withdrawal rate',
			'Click "Calculate" to see your retirement projections',
			'Review the results - see your projected balance, total contributions, earnings, and estimated monthly income',
			'Use the insights to adjust your savings strategy and retirement goals',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Age 30 → Retire at 65',
				inputDescription:
					'Age 30, retire at 65, $10,000 current savings, $300/month contribution, 7% return',
				steps: [
					'Current age: 30',
					'Retirement age: 65',
					'Current savings: $10,000',
					'Monthly contribution: $300',
					'Annual return rate: 7%',
					'Years to retirement: 35',
					'Final balance: ~$600,000+',
					'Total contributed: $126,000',
					'Total earnings: ~$474,000',
				],
				resultDescription:
					'Starting at age 30 with $10,000 and contributing $300/month at 7% annual return, you would have approximately $600,000+ at age 65. This demonstrates the power of starting early and consistent contributions over 35 years.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Start Late vs Early Saver',
				inputDescription:
					'Compare starting at age 25 vs age 35 with same monthly contribution',
				steps: [
					'Early saver: Age 25, $200/month, 7% return, 40 years → ~$525,000',
					'Late saver: Age 35, $200/month, 7% return, 30 years → ~$244,000',
					'Difference: 10 years = $281,000 more',
					'Early saver contributes $96,000 total',
					'Late saver contributes $72,000 total',
				],
				resultDescription:
					'Starting 10 years earlier (age 25 vs 35) with the same $200/month contribution results in over $280,000 more at retirement, even though the early saver only contributed $24,000 more. This demonstrates the critical importance of starting early due to compound interest.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Desired $3,000/Month Income',
				inputDescription:
					'Age 40, retire at 65, want $3,000/month income, 6% return during retirement, 85 life expectancy',
				steps: [
					'Current age: 40',
					'Retirement age: 65',
					'Desired monthly income: $3,000',
					'Life expectancy: 85',
					'Expected return: 6%',
					'Inflation: 2.5%',
					'Required retirement fund: ~$900,000+',
					'Required monthly contribution: ~$1,200+',
				],
				resultDescription:
					'To achieve $3,000/month in retirement income (adjusted for inflation), you would need approximately $900,000+ saved by age 65. Starting at age 40, this requires saving about $1,200/month at 7% return. This shows the importance of planning for inflation-adjusted income needs.',
			},
			{
				id: 'example-4',
				title: 'Example 4: Effect of Inflation',
				inputDescription:
					'Age 35, retire at 65, $500/month, 7% return, with and without 2.5% inflation',
				steps: [
					'Without inflation: Final balance ~$567,000',
					'With 2.5% inflation: Inflation-adjusted balance ~$280,000',
					'Purchasing power reduced by ~50%',
					'Monthly income (4% withdrawal): $1,890 vs $933 (inflation-adjusted)',
				],
				resultDescription:
					'Inflation significantly reduces the purchasing power of your savings. A $567,000 balance with 2.5% annual inflation over 30 years is worth only $280,000 in today\'s dollars. This demonstrates why it\'s crucial to account for inflation in retirement planning and aim for returns that outpace inflation.',
			},
		],
		faq: [
			{
				question: 'How much should I save for retirement?',
				answer:
					'Financial experts typically recommend saving 10-15% of your income for retirement, or enough to replace 70-80% of your pre-retirement income. Use the "How much do I need?" mode to calculate your specific target based on your desired retirement lifestyle and expenses.',
			},
			{
				question: 'What is a safe withdrawal rate?',
				answer:
					'A safe withdrawal rate is the percentage of your retirement savings you can withdraw annually without running out of money. The "4% rule" suggests withdrawing 4% of your initial retirement balance in the first year, then adjusting for inflation. This calculator uses 4% by default, but you can adjust it based on your risk tolerance and expected returns.',
			},
			{
				question: 'Does this calculator include inflation?',
				answer:
					'Yes, this calculator includes optional inflation adjustments. When enabled, it shows both nominal (future dollar) and real (today\'s dollar) values. Inflation typically runs 2-3% annually, which significantly reduces purchasing power over long periods. Always consider inflation when planning for retirement.',
			},
			{
				question: 'What return rate should I assume?',
				answer:
					'Historical stock market returns average 7-10% annually, but this varies by asset allocation. Conservative portfolios (bonds) may return 3-5%, balanced portfolios 6-8%, and aggressive portfolios (stocks) 8-10%. Use a conservative estimate (6-7%) to avoid overestimating your future balance. Remember, past performance doesn\'t guarantee future results.',
			},
			{
				question: 'When should I start saving for retirement?',
				answer:
					'The earlier, the better! Starting in your 20s gives compound interest decades to work. However, it\'s never too late to start. Even starting at age 40 or 50 can make a significant difference. Use this calculator to see how starting age affects your final balance.',
			},
			{
				question: 'Is pension included in this calculator?',
				answer:
					'This calculator focuses on personal savings and investments. If you have a pension, you can either: 1) Add your expected pension income to your desired monthly income, or 2) Subtract your pension value from the required retirement fund. Pensions provide guaranteed income but may not keep up with inflation.',
			},
			{
				question: 'How accurate is this retirement calculator?',
				answer:
					'This calculator provides estimates based on the inputs you provide. It assumes consistent returns, contributions, and inflation rates, which may not reflect reality. Actual results will vary based on market conditions, investment choices, and life circumstances. Use this as a planning tool, not a guarantee.',
			},
			{
				question: 'Can I retire early?',
				answer:
					'Early retirement is possible but requires more aggressive saving. Retiring at 55 instead of 65 means 10 fewer years to save but 10 more years of withdrawals. Use this calculator to see how much you need to save monthly to retire early. Generally, you need 25-30x your annual expenses saved.',
			},
			{
				question: 'What is the difference between "How much will I have?" and "How much do I need?"',
				answer:
					'"How much will I have?" projects your future balance based on current savings, contributions, and returns. "How much do I need?" calculates the required savings to achieve a specific retirement income goal. Use the first to see where you\'re headed, and the second to determine if you\'re on track.',
			},
			{
				question: 'Should I include Social Security?',
				answer:
					'Social Security provides additional retirement income but shouldn\'t be your only source. You can either: 1) Subtract expected Social Security income from your desired monthly income, or 2) Use this calculator for personal savings only and add Social Security separately. Social Security benefits vary based on your earnings history.',
			},
			{
				question: 'What if I can\'t save the required amount?',
				answer:
					'If you can\'t save the required amount, consider: 1) Increasing your retirement age, 2) Reducing your desired retirement income, 3) Increasing your return rate (higher risk), 4) Starting a side income, 5) Reducing current expenses. Even small increases in savings can make a big difference over time.',
			},
			{
				question: 'How does contribution growth rate work?',
				answer:
					'Contribution growth rate accounts for annual increases in your savings contributions, typically due to salary raises or promotions. For example, if you start with $500/month and set a 3% growth rate, your contribution increases by 3% each year. This helps model realistic long-term savings patterns.',
			},
			{
				question: 'What is the 4% withdrawal rule?',
				answer:
					'The 4% rule suggests withdrawing 4% of your retirement savings in the first year, then adjusting for inflation each year. This rule is based on historical market data and aims to make your savings last 30 years. However, market conditions and your specific situation may require adjustments.',
			},
			{
				question: 'Should I use monthly or annual compounding?',
				answer:
					'Monthly compounding is more accurate for most retirement accounts (401(k), IRA) where contributions and returns compound monthly. Annual compounding is simpler but slightly less accurate. The difference is usually small over long periods, but monthly compounding gives slightly higher results.',
			},
			{
				question: 'What if I have multiple retirement accounts?',
				answer:
					'Combine all your retirement accounts (401(k), IRA, Roth IRA, etc.) into a single "current savings" amount. Use the average return rate across all accounts, or use a conservative estimate. The calculator treats all savings as one portfolio.',
			},
			{
				question: 'How do I account for taxes in retirement?',
				answer:
					'This calculator doesn\'t explicitly account for taxes. Traditional 401(k) and IRA withdrawals are taxed, while Roth accounts are tax-free. Consider: 1) Using after-tax income for desired monthly income, 2) Factoring in tax-advantaged accounts, 3) Consulting a tax professional for specific advice.',
			},
			{
				question: 'What if I want to retire abroad?',
				answer:
					'Retiring abroad can reduce costs significantly. Adjust your desired monthly income based on the cost of living in your target country. Some countries have lower healthcare costs, which can reduce retirement expenses. Research cost of living indexes for accurate planning.',
			},
			{
				question: 'Can I use this for other long-term goals?',
				answer:
					'Yes! This calculator works for any long-term savings goal with regular contributions and compound growth. Examples: college savings, house down payment, major purchase, or financial independence. Adjust the time horizon and goal amount accordingly.',
			},
		],
		relatedIds: [
			'compound-interest',
			'investment-calculator',
			'savings-calculator',
			'net-worth-calculator',
		],
		standardIds: [],
		tags: ['finance', 'retirement', 'pension', 'savings', 'investing', 'passive-income', 'future-planning'],
		meta: {
			keywords: [
				'retirement calculator',
				'retirement planning',
				'retirement savings calculator',
				'how much do I need to retire',
				'retirement income calculator',
				'pension calculator',
				'retirement planning tool',
				'401k calculator',
				'IRA calculator',
				'retirement fund calculator',
			],
		},
		isEnabled: true,
	},
	// Investment vs Savings Calculator (EN)
	{
		id: 'investment-vs-savings-calculator',
		slug: 'investment-vs-savings-calculator',
		category: 'finance',
		title: 'Investment vs Savings Calculator',
		shortDescription:
			'Compare saving and investing to see which grows your money faster. Calculate final balance, earnings, and inflation-adjusted value.',
		longDescription:
			'Compare saving and investing to see which grows your money faster. This calculator shows side-by-side comparison of savings (lower risk, lower return) and investments (higher risk, higher return) strategies. Calculate final balance, total contributions, earnings, and inflation-adjusted value for both strategies. Understand the trade-offs between safety and growth potential.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'initialAmount',
				label: 'Initial Amount',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter initial amount',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Initial amount must be greater than or equal to 0',
				},
			},
			{
				name: 'monthlyContribution',
				label: 'Monthly Contribution',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter monthly contribution',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Monthly contribution must be greater than or equal to 0',
				},
			},
			{
				name: 'timeHorizonYears',
				label: 'Time Horizon',
				type: 'number',
				unitLabel: 'years',
				placeholder: 'Enter time horizon',
				validation: {
					required: true,
					min: 1,
					max: 50,
					message: 'Time horizon must be between 1 and 50 years',
				},
			},
			{
				name: 'inflationRate',
				label: 'Inflation Rate (Optional)',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter inflation rate',
				defaultValue: 2.5,
				helpText: 'Annual inflation rate (typically 2-3%)',
				validation: {
					required: true,
					min: 0,
					max: 20,
					message: 'Inflation rate must be between 0 and 20',
				},
			},
			{
				name: 'savingsInterestRate',
				label: 'Savings Interest Rate',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter savings interest rate',
				validation: {
					required: true,
					min: 0,
					max: 50,
					message: 'Savings interest rate must be between 0 and 50',
				},
			},
			{
				name: 'savingsCompoundingFrequency',
				label: 'Savings Compounding Frequency',
				type: 'select',
				options: [
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'annual', label: 'Annual' },
				],
				defaultValue: 'monthly',
				helpText: 'How often interest compounds for savings',
			},
			{
				name: 'expectedInvestmentReturn',
				label: 'Expected Investment Return',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter expected return',
				validation: {
					required: true,
					min: 0,
					max: 50,
					message: 'Expected investment return must be between 0 and 50',
				},
			},
			{
				name: 'investmentCompoundingFrequency',
				label: 'Investment Compounding Frequency',
				type: 'select',
				options: [
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'annual', label: 'Annual' },
				],
				defaultValue: 'monthly',
				helpText: 'How often returns compound for investments',
			},
		],
		outputs: [
			{
				name: 'savingsFinalBalance',
				label: 'Savings Final Balance',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'savingsTotalContributions',
				label: 'Savings Total Contributions',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'savingsTotalEarnings',
				label: 'Savings Total Earnings',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'savingsInflationAdjustedBalance',
				label: 'Savings Inflation-Adjusted Balance',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'investmentFinalBalance',
				label: 'Investment Final Balance',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'investmentTotalContributions',
				label: 'Investment Total Contributions',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'investmentTotalEarnings',
				label: 'Investment Total Earnings',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'investmentInflationAdjustedBalance',
				label: 'Investment Inflation-Adjusted Balance',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'differenceInFinalBalance',
				label: 'Difference in Final Balance',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'percentageAdvantage',
				label: 'Percentage Advantage',
				unitLabel: '%',
				formatType: 'percentage',
			},
			{
				name: 'breakevenYear',
				label: 'Breakeven Year',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateInvestmentVsSavings,
		howToBullets: [
			'Enter your initial amount - the money you start with',
			'Enter your monthly contribution - how much you plan to add each month',
			'Enter your time horizon - how many years you plan to save or invest',
			'Optionally enter inflation rate - annual inflation (typically 2-3%) to see real purchasing power',
			'Enter savings interest rate - the annual interest rate for savings (typically 1-3%)',
			'Select savings compounding frequency - monthly or annual compounding for savings',
			'Enter expected investment return - the annual return rate for investments (typically 6-10%)',
			'Select investment compounding frequency - monthly or annual compounding for investments',
			'Click "Calculate" to see the comparison results',
			'Review the comparison summary - see final balances, contributions, and earnings for both strategies',
			'Check the difference - see how much more (or less) one strategy yields',
			'Review the breakeven year - see when investment strategy surpasses savings (if applicable)',
			'Use the insights to make an informed decision based on your risk tolerance and goals',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: $5,000 Initial, $200/Month, 10 Years',
				inputDescription:
					'$5,000 initial, $200/month contribution, 10 years, Savings 3% vs Investment 7%',
				steps: [
					'Initial amount: $5,000',
					'Monthly contribution: $200',
					'Time horizon: 10 years',
					'Savings interest rate: 3%',
					'Investment return: 7%',
					'Savings final balance: ~$32,000',
					'Investment final balance: ~$38,000',
					'Difference: ~$6,000 (Investment advantage)',
				],
				resultDescription:
					'Over 10 years with $5,000 initial and $200/month, savings at 3% yields approximately $32,000, while investments at 7% yield approximately $38,000. The investment strategy provides a $6,000 advantage, demonstrating how higher returns compound over time. However, investments carry higher risk and volatility.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Short-Term (3 Years)',
				inputDescription:
					'$10,000 initial, $300/month, 3 years, Savings 2.5% vs Investment 6%',
				steps: [
					'Initial amount: $10,000',
					'Monthly contribution: $300',
					'Time horizon: 3 years',
					'Savings interest rate: 2.5%',
					'Investment return: 6%',
					'Savings final balance: ~$21,000',
					'Investment final balance: ~$22,000',
					'Difference: ~$1,000 (Investment advantage)',
				],
				resultDescription:
					'Over a short 3-year period, the difference between savings and investments is relatively small (~$1,000). For short-term goals, savings provide stability and lower risk, making them more suitable than investments which can be volatile over short periods.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Long-Term (25 Years)',
				inputDescription:
					'$20,000 initial, $500/month, 25 years, Savings 3% vs Investment 8%',
				steps: [
					'Initial amount: $20,000',
					'Monthly contribution: $500',
					'Time horizon: 25 years',
					'Savings interest rate: 3%',
					'Investment return: 8%',
					'Savings final balance: ~$280,000',
					'Investment final balance: ~$550,000',
					'Difference: ~$270,000 (Investment advantage)',
				],
				resultDescription:
					'Over 25 years, the difference becomes dramatic. Savings at 3% yield approximately $280,000, while investments at 8% yield approximately $550,000 - nearly double! This demonstrates the power of compound interest and higher returns over long time horizons. However, investments require accepting higher risk and volatility.',
			},
			{
				id: 'example-4',
				title: 'Example 4: Inflation-Adjusted Comparison',
				inputDescription:
					'$15,000 initial, $400/month, 15 years, Savings 2.5% vs Investment 7%, 2.5% inflation',
				steps: [
					'Initial amount: $15,000',
					'Monthly contribution: $400',
					'Time horizon: 15 years',
					'Savings interest rate: 2.5%',
					'Investment return: 7%',
					'Inflation rate: 2.5%',
					'Savings nominal balance: ~$110,000',
					'Savings real balance: ~$75,000',
					'Investment nominal balance: ~$150,000',
					'Investment real balance: ~$102,000',
				],
				resultDescription:
					'When accounting for 2.5% inflation, the real purchasing power of both strategies is significantly reduced. Savings at 2.5% barely keep pace with inflation, resulting in minimal real growth. Investments at 7% still provide substantial real growth (~$102,000 vs $75,000), demonstrating why higher returns are important for long-term wealth building, especially when inflation is considered.',
			},
		],
		faq: [
			{
				question: 'Is it better to save or invest?',
				answer:
					'The answer depends on your goals, time horizon, and risk tolerance. Savings are better for short-term goals (under 3-5 years), emergency funds, and when you need guaranteed access to money. Investments are better for long-term goals (5+ years), retirement planning, and when you can accept market volatility for potentially higher returns. Use this calculator to see the difference for your specific situation.',
			},
			{
				question: 'When should I choose savings?',
				answer:
					'Choose savings when: you need money within 3-5 years, you require guaranteed access to funds, you have a low risk tolerance, you\'re building an emergency fund, or you need stability and predictability. Savings accounts are FDIC-insured and provide guaranteed returns, making them ideal for short-term goals and safety.',
			},
			{
				question: 'When should I invest?',
				answer:
					'Invest when: you have a time horizon of 5+ years, you can accept market volatility, you want to build long-term wealth, you\'re planning for retirement, or you have money you won\'t need immediately. Investments offer higher potential returns but come with risk of loss, especially over short periods.',
			},
			{
				question: 'What is a good return assumption for investments?',
				answer:
					'Historical stock market returns average 7-10% annually, but this varies by asset allocation. Conservative portfolios (bonds) may return 3-5%, balanced portfolios 6-8%, and aggressive portfolios (stocks) 8-10%. Use conservative estimates (6-7%) to avoid overestimating returns. Remember, past performance doesn\'t guarantee future results, and returns can be negative in any given year.',
			},
			{
				question: 'How risky are investments?',
				answer:
					'Investments carry risk of loss, especially over short periods. Stock markets can decline 20-50% in bad years, and individual investments can lose value. However, over long periods (10+ years), markets have historically recovered and grown. Diversification, time horizon, and asset allocation help manage risk. Savings have virtually no risk but offer lower returns.',
			},
			{
				question: 'Does inflation matter?',
				answer:
					'Yes! Inflation erodes purchasing power over time. If your savings earn 2% but inflation is 3%, you\'re losing purchasing power. Investments with higher returns (6-8%) can outpace inflation, preserving and growing real wealth. Always consider inflation when planning long-term financial goals.',
			},
			{
				question: 'Can I combine both savings and investments?',
				answer:
					'Absolutely! A balanced approach often works best. Keep 3-6 months of expenses in savings for emergencies, then invest the rest for long-term growth. This provides both safety and growth potential. Many financial advisors recommend this hybrid strategy.',
			},
			{
				question: 'Is this calculation realistic?',
				answer:
					'This calculator provides estimates based on consistent returns and contributions, which may not reflect reality. Investment returns vary year-to-year, and savings rates can change. Use this as a planning tool to understand the difference between strategies, not as a guarantee of future results.',
			},
			{
				question: 'What if investment returns are lower than expected?',
				answer:
					'If investment returns are lower than expected, the advantage over savings decreases. In worst-case scenarios, investments can lose value, while savings remain stable. This is why risk tolerance and time horizon matter - you need time to recover from market downturns. Never invest money you need in the short term.',
			},
			{
				question: 'What is the breakeven year?',
				answer:
					'The breakeven year is when the investment strategy\'s balance surpasses the savings strategy\'s balance. This happens because higher returns compound over time. The breakeven year helps you understand how long it takes for investments to outperform savings. Longer time horizons favor investments.',
			},
			{
				question: 'Should I use monthly or annual compounding?',
				answer:
					'Monthly compounding is more accurate for most savings accounts and investment accounts where returns compound monthly. Annual compounding is simpler but slightly less accurate. The difference is usually small, but monthly compounding gives slightly higher results. Most modern accounts use monthly or daily compounding.',
			},
			{
				question: 'What if I have different contribution amounts?',
				answer:
					'This calculator assumes the same monthly contribution for both strategies. In reality, you might contribute different amounts to savings vs investments. You can run separate calculations for each strategy with different contribution amounts, then compare the results manually.',
			},
			{
				question: 'Are savings accounts FDIC-insured?',
				answer:
					'Yes, savings accounts at FDIC-insured banks are protected up to $250,000 per depositor, per bank. This means your savings are guaranteed by the federal government, making them virtually risk-free. Investments are not insured and can lose value.',
			},
			{
				question: 'What about taxes?',
				answer:
					'This calculator doesn\'t account for taxes. Savings interest is typically taxable as ordinary income. Investment returns may be taxed as capital gains (often lower rates) or dividends. Tax-advantaged accounts (401(k), IRA) can defer or eliminate taxes. Consider tax implications when choosing between strategies.',
			},
			{
				question: 'Can I use this for retirement planning?',
				answer:
					'Yes! This calculator helps you understand the difference between conservative (savings) and growth (investment) strategies for retirement. However, for detailed retirement planning, use a dedicated retirement calculator that accounts for withdrawal strategies, life expectancy, and other retirement-specific factors.',
			},
		],
		relatedIds: [
			'savings-calculator',
			'investment-calculator',
			'compound-interest',
			'retirement-calculator',
		],
		standardIds: [],
		tags: ['finance', 'savings', 'investments', 'compare', 'compound-interest', 'long-term-planning'],
		meta: {
			keywords: [
				'investment vs savings calculator',
				'savings vs investment calculator',
				'compare savings and investments',
				'savings vs investing',
				'should I save or invest',
				'investment comparison calculator',
				'savings comparison tool',
				'compare investment returns',
				'savings vs stocks',
				'long-term savings calculator',
			],
		},
		isEnabled: true,
	},
	// Take-Home Pay Calculator (EN)
	{
		id: 'take-home-pay-calculator',
		slug: 'take-home-pay-calculator',
		category: 'finance',
		title: 'Take-Home Pay Calculator',
		shortDescription:
			'Estimate your net income after taxes and deductions. Calculate take-home pay from gross salary using effective tax rates.',
		longDescription:
			'Estimate your net income after taxes and deductions. Calculate take-home pay from gross salary using effective tax rates. This calculator helps you understand how gross income becomes net income after taxes, pension contributions, social contributions, and other deductions. Note: This is an estimation tool and not tied to any specific country or tax system.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'grossIncome',
				label: 'Gross Income',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter gross income',
				validation: {
					required: true,
					min: 0.01,
					message: 'Gross income must be greater than 0',
				},
			},
			{
				name: 'incomePeriod',
				label: 'Income Period',
				type: 'select',
				options: [
					{ value: 'yearly', label: 'Yearly' },
					{ value: 'monthly', label: 'Monthly' },
				],
				defaultValue: 'yearly',
				helpText: 'Is this annual or monthly income?',
			},
			{
				name: 'taxCalculationMode',
				label: 'Tax Calculation Mode',
				type: 'select',
				options: [
					{ value: 'rate', label: 'Tax Rate (%)' },
					{ value: 'amount', label: 'Tax Amount ($)' },
				],
				defaultValue: 'rate',
				helpText: 'Calculate taxes by rate or fixed amount',
			},
			{
				name: 'effectiveTaxRate',
				label: 'Effective Tax Rate',
				type: 'number',
				unitLabel: '%',
				placeholder: 'Enter tax rate',
				defaultValue: 0,
				helpText: 'Average effective tax rate (typically 15-35%)',
				validation: {
					required: true,
					min: 0,
					max: 60,
					message: 'Tax rate must be between 0 and 60',
				},
			},
			{
				name: 'totalTaxAmount',
				label: 'Total Tax Amount',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter tax amount',
				defaultValue: 0,
				helpText: 'Fixed tax amount (if using tax amount mode)',
				validation: {
					required: true,
					min: 0,
					message: 'Tax amount must be greater than or equal to 0',
				},
			},
			{
				name: 'pensionContribution',
				label: 'Pension Contribution (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter pension contribution',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Pension contribution must be greater than or equal to 0',
				},
			},
			{
				name: 'pensionContributionType',
				label: 'Pension Contribution Type',
				type: 'select',
				options: [
					{ value: 'amount', label: 'Amount ($)' },
					{ value: 'percentage', label: 'Percentage (%)' },
				],
				defaultValue: 'amount',
				helpText: 'Is pension contribution a fixed amount or percentage?',
			},
			{
				name: 'socialContributions',
				label: 'Social Contributions (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter social contributions',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Social contributions must be greater than or equal to 0',
				},
			},
			{
				name: 'socialContributionsType',
				label: 'Social Contributions Type',
				type: 'select',
				options: [
					{ value: 'amount', label: 'Amount ($)' },
					{ value: 'percentage', label: 'Percentage (%)' },
				],
				defaultValue: 'amount',
				helpText: 'Are social contributions a fixed amount or percentage?',
			},
			{
				name: 'otherDeductions',
				label: 'Other Deductions (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter other deductions',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Other deductions must be greater than or equal to 0',
				},
			},
			{
				name: 'bonusIncome',
				label: 'Bonus Income (Optional)',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter bonus income',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Bonus income must be greater than or equal to 0',
				},
			},
		],
		outputs: [
			{
				name: 'grossIncome',
				label: 'Gross Income',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalTaxes',
				label: 'Total Taxes',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalDeductions',
				label: 'Total Deductions',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'netIncome',
				label: 'Take-Home Pay (Net Income)',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'netIncomePerMonth',
				label: 'Monthly Net Income',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'effectiveNetRate',
				label: 'Effective Net Rate',
				unitLabel: '%',
				formatType: 'percentage',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateTakeHomePay,
		howToBullets: [
			'Enter your gross income - your total income before taxes and deductions',
			'Select income period - choose whether this is yearly or monthly income',
			'Select tax calculation mode - choose to calculate taxes by rate (%) or fixed amount ($)',
			'Enter effective tax rate - your average tax rate (typically 15-35%, varies by country and income level)',
			'OR enter total tax amount - if you know the exact tax amount instead of rate',
			'Optionally enter pension contribution - retirement savings deduction (as amount or percentage)',
			'Optionally enter social contributions - social security or similar contributions (as amount or percentage)',
			'Optionally enter other deductions - any other pre-tax deductions',
			'Optionally enter bonus income - additional income to include in calculation',
			'Click "Calculate" to see your take-home pay',
			'Review the breakdown - see how gross income becomes net income after taxes and deductions',
			'Check the effective net rate - see what percentage of gross income you actually keep',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: $60,000 Gross, 25% Tax',
				inputDescription:
					'$60,000 annual gross income, 25% effective tax rate',
				steps: [
					'Gross income: $60,000/year',
					'Effective tax rate: 25%',
					'Tax amount: $15,000',
					'Net income: $45,000/year',
					'Monthly net income: $3,750',
					'Effective net rate: 75%',
				],
				resultDescription:
					'A $60,000 annual gross income with a 25% effective tax rate results in $15,000 in taxes and $45,000 net income. This means you keep 75% of your gross income, or $3,750 per month. This is a simplified example - actual taxes vary by country, state, and individual circumstances.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Monthly Salary with Pension',
				inputDescription:
					'$5,000 monthly gross, 20% tax, 5% pension contribution',
				steps: [
					'Gross income: $5,000/month',
					'Effective tax rate: 20%',
					'Tax amount: $1,000',
					'Pension contribution: 5% ($250)',
					'Net income: $3,750/month',
					'Effective net rate: 75%',
				],
				resultDescription:
					'A $5,000 monthly gross income with 20% tax and 5% pension contribution results in $1,000 in taxes and $250 in pension contributions, leaving $3,750 net income per month. Pension contributions reduce your take-home pay but build retirement savings.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Bonus Income Included',
				inputDescription:
					'$50,000 annual gross, $10,000 bonus, 22% tax',
				steps: [
					'Gross income: $50,000/year',
					'Bonus income: $10,000',
					'Total gross: $60,000',
					'Effective tax rate: 22%',
					'Tax amount: $13,200',
					'Net income: $46,800/year',
					'Monthly net income: $3,900',
				],
				resultDescription:
					'Including a $10,000 bonus increases total gross income to $60,000. With a 22% tax rate, total taxes are $13,200, resulting in $46,800 net income. Bonuses are typically taxed at the same rate as regular income, though some jurisdictions may have different withholding rates.',
			},
			{
				id: 'example-4',
				title: 'Example 4: Different Tax Rates Comparison',
				inputDescription:
					'$80,000 annual gross, comparing 20% vs 30% tax rates',
				steps: [
					'Gross income: $80,000/year',
					'At 20% tax: Net = $64,000 ($5,333/month)',
					'At 30% tax: Net = $56,000 ($4,667/month)',
					'Difference: $8,000/year ($667/month)',
					'Effective net rate: 80% vs 70%',
				],
				resultDescription:
					'Comparing different tax rates on the same $80,000 gross income shows the significant impact of tax rates. At 20%, you keep $64,000 (80%), while at 30%, you keep $56,000 (70%). The 10 percentage point difference results in $8,000 less take-home pay per year, or $667 per month. This demonstrates why understanding your effective tax rate is important for financial planning.',
			},
		],
		faq: [
			{
				question: 'What is take-home pay?',
				answer:
					'Take-home pay (net income) is the amount of money you actually receive after taxes, deductions, and other withholdings are subtracted from your gross income. It\'s the money that goes into your bank account and is available for spending and saving.',
			},
			{
				question: 'What is the difference between gross and net income?',
				answer:
					'Gross income is your total income before any taxes or deductions. Net income (take-home pay) is what remains after taxes, pension contributions, social security, health insurance, and other deductions are subtracted. Gross income is what you earn; net income is what you keep.',
			},
			{
				question: 'What is an effective tax rate?',
				answer:
					'Effective tax rate is the average percentage of your income that goes to taxes. It\'s calculated as total taxes divided by gross income. For example, if you earn $60,000 and pay $15,000 in taxes, your effective tax rate is 25%. This differs from marginal tax rate, which is the rate on your highest income bracket.',
			},
			{
				question: 'Why do taxes differ by country?',
				answer:
					'Tax systems vary significantly by country due to different government structures, social programs, and economic policies. Some countries have progressive tax systems (higher rates for higher income), flat tax systems (same rate for all), or no income tax at all. Tax rates also vary by state/province and local jurisdiction.',
			},
			{
				question: 'Are bonuses taxed differently?',
				answer:
					'In most tax systems, bonuses are taxed at the same rate as regular income. However, some jurisdictions may have different withholding rates for bonuses (often higher initially), which are then adjusted when you file your tax return. The effective tax rate on bonuses is typically the same as your regular income tax rate.',
			},
			{
				question: 'What deductions reduce taxes?',
				answer:
					'Common pre-tax deductions include: pension/retirement contributions, health insurance premiums, life insurance, flexible spending accounts, and certain charitable contributions. These deductions reduce your taxable income, which can lower your tax bill. However, they also reduce your take-home pay.',
			},
			{
				question: 'Is this calculator accurate?',
				answer:
					'This calculator provides estimates based on the inputs you provide. It uses effective tax rates and general assumptions. Actual take-home pay varies significantly by: country, state/province, local tax laws, specific deductions, filing status, dependents, and individual circumstances. This is an estimation tool, not a guarantee of actual take-home pay.',
			},
			{
				question: 'Why does my real paycheck differ from this calculation?',
				answer:
					'Real paychecks differ because: tax systems are complex with multiple brackets and deductions, withholding rates may differ from effective rates, there may be additional deductions (health insurance, life insurance, etc.), local taxes may apply, and tax laws change frequently. Always use official tax calculators for your specific location for accurate calculations.',
			},
			{
				question: 'Does this include social security?',
				answer:
					'This calculator includes social security if you enter it in the "Social Contributions" field. Social security contributions vary by country and are typically a percentage of income (often 6-12%). In some countries, social security is separate from income tax, while in others it\'s combined. Enter your social security contribution rate or amount to include it in the calculation.',
			},
			{
				question: 'How can I increase my net income?',
				answer:
					'To increase net income, you can: increase gross income (raise, promotion, side income), reduce taxable income through deductions (retirement contributions, health savings accounts), move to a lower-tax jurisdiction (if possible), take advantage of tax credits and deductions, or negotiate better benefits that reduce taxable income. However, some strategies may reduce take-home pay in favor of future benefits (like retirement contributions).',
			},
			{
				question: 'What is the difference between effective and marginal tax rate?',
				answer:
					'Effective tax rate is the average rate you pay on all income (total taxes / total income). Marginal tax rate is the rate on your highest income bracket - the rate you\'d pay on additional income. For example, if you\'re in the 25% tax bracket, your marginal rate is 25%, but your effective rate might be 20% because lower portions of income are taxed at lower rates.',
			},
			{
				question: 'Should I use yearly or monthly income?',
				answer:
					'Use yearly income if you want to see annual take-home pay and monthly breakdown. Use monthly income if you want to see monthly take-home pay directly. The calculator automatically converts yearly to monthly for display. Most people think in terms of annual salary, so yearly is often more intuitive.',
			},
			{
				question: 'What if I have multiple income sources?',
				answer:
					'Combine all income sources into a single gross income amount, or use the bonus income field for additional income. The calculator treats all income the same for tax calculation. In reality, different income types (salary, dividends, capital gains) may be taxed differently, but this calculator uses a single effective rate for simplicity.',
			},
			{
				question: 'Does this calculator work for self-employed people?',
				answer:
					'This calculator can provide rough estimates for self-employed individuals, but self-employment taxes are typically more complex. Self-employed people often pay both employee and employer portions of social security, have different deduction rules, and may pay estimated taxes quarterly. Use this as a starting point, but consult a tax professional for self-employment tax planning.',
			},
			{
				question: 'What about tax refunds?',
				answer:
					'This calculator shows annual take-home pay based on effective tax rates. Tax refunds occur when you overpay taxes during the year (through withholding) and receive money back when filing your return. Refunds don\'t change your effective tax rate - they\'re just a return of overpaid taxes. To account for refunds, you could use a slightly lower effective tax rate.',
			},
		],
		relatedIds: [
			'savings-calculator',
			'investment-calculator',
			'roi-calculator',
			'retirement-calculator',
		],
		standardIds: [],
		tags: ['finance', 'taxes', 'income-tax', 'take-home-pay', 'net-income', 'salary'],
		meta: {
			keywords: [
				'take-home pay calculator',
				'net income calculator',
				'salary calculator',
				'after tax income calculator',
				'gross to net calculator',
				'take home pay',
				'net salary calculator',
				'income tax calculator',
				'salary after taxes',
				'net pay calculator',
			],
		},
		isEnabled: true,
	},
	// Emergency Fund Calculator (EN)
	{
		id: 'emergency-fund-calculator',
		slug: 'emergency-fund-calculator',
		category: 'finance',
		title: 'Emergency Fund Calculator',
		shortDescription:
			'Find out how much emergency savings you need for financial security. Calculate your emergency fund target and time to reach your goal.',
		longDescription:
			'Find out how much emergency savings you need for financial security. Calculate your emergency fund target based on monthly expenses and target months of coverage. See how much you need to save, track your progress, and estimate how long it will take to build your emergency fund. An emergency fund provides a financial safety net for unexpected situations like job loss, medical emergencies, or major repairs.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'monthlyExpenses',
				label: 'Monthly Expenses',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter monthly expenses',
				validation: {
					required: true,
					min: 0.01,
					message: 'Monthly expenses must be greater than 0',
				},
			},
			{
				name: 'targetMonths',
				label: 'Target Months',
				type: 'select',
				options: [
					{ value: '3', label: '3 months' },
					{ value: '6', label: '6 months (recommended)' },
					{ value: '9', label: '9 months' },
					{ value: '12', label: '12 months' },
				],
				defaultValue: '6',
				helpText: 'How many months of expenses to save (6 months is recommended)',
			},
			{
				name: 'currentSavings',
				label: 'Current Savings',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter current savings',
				defaultValue: 0,
				validation: {
					required: true,
					min: 0,
					message: 'Current savings must be greater than or equal to 0',
				},
			},
			{
				name: 'monthlyContribution',
				label: 'Monthly Contribution',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter monthly contribution',
				defaultValue: 0,
				helpText: 'How much you plan to save each month',
				validation: {
					required: true,
					min: 0,
					message: 'Monthly contribution must be greater than or equal to 0',
				},
			},
		],
		outputs: [
			{
				name: 'targetEmergencyFund',
				label: 'Target Emergency Fund',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'remainingAmount',
				label: 'Remaining Amount',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'monthsToGoal',
				label: 'Months to Reach Goal',
			},
			{
				name: 'progressPercentage',
				label: 'Progress Percentage',
				unitLabel: '%',
				formatType: 'percentage',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateEmergencyFund,
		howToBullets: [
			'Enter your monthly expenses - include all essential expenses (housing, food, utilities, transportation, insurance, minimum debt payments)',
			'Select target months - choose how many months of expenses to save (3, 6, 9, or 12 months; 6 months is recommended)',
			'Enter your current savings - how much you already have saved for emergencies',
			'Enter your monthly contribution - how much you plan to save each month toward your emergency fund',
			'Click "Calculate" to see your emergency fund target and progress',
			'Review your target emergency fund - this is the total amount you need to save',
			'Check your progress - see what percentage of your goal you\'ve reached',
			'See how long it will take - if you entered a monthly contribution, see when you\'ll reach your goal',
			'Use the insights to adjust your savings strategy and timeline',
			'Remember: an emergency fund should be easily accessible, so keep it in a savings account, not investments',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: $2,500 Monthly Expenses, 6 Months Target',
				inputDescription:
					'$2,500 monthly expenses, 6 months target, $5,000 saved, $300/month contribution',
				steps: [
					'Monthly expenses: $2,500',
					'Target months: 6 months',
					'Target emergency fund: $15,000',
					'Current savings: $5,000',
					'Remaining amount: $10,000',
					'Monthly contribution: $300',
					'Time to reach goal: ~33 months (2.8 years)',
					'Progress: 33.3%',
				],
				resultDescription:
					'With $2,500 in monthly expenses, a 6-month emergency fund target is $15,000. If you have $5,000 saved and contribute $300/month, you\'ll reach your goal in approximately 33 months. This demonstrates the importance of consistent savings and starting early.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Single Income Household, 9 Months Target',
				inputDescription:
					'$3,000 monthly expenses, 9 months target, $0 saved, $500/month contribution',
				steps: [
					'Monthly expenses: $3,000',
					'Target months: 9 months',
					'Target emergency fund: $27,000',
					'Current savings: $0',
					'Remaining amount: $27,000',
					'Monthly contribution: $500',
					'Time to reach goal: 54 months (4.5 years)',
					'Progress: 0%',
				],
				resultDescription:
					'For a single-income household with $3,000 monthly expenses, a 9-month emergency fund ($27,000) provides extra security. Starting from zero and saving $500/month, it takes 4.5 years to reach the goal. Single-income households may need larger emergency funds due to less financial flexibility.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Zero Savings Start, Aggressive Saving',
				inputDescription:
					'$2,000 monthly expenses, 6 months target, $0 saved, $1,000/month contribution',
				steps: [
					'Monthly expenses: $2,000',
					'Target months: 6 months',
					'Target emergency fund: $12,000',
					'Current savings: $0',
					'Remaining amount: $12,000',
					'Monthly contribution: $1,000',
					'Time to reach goal: 12 months (1 year)',
					'Progress: 0%',
				],
				resultDescription:
					'Starting from zero with $2,000 monthly expenses, a 6-month emergency fund ($12,000) can be reached in just 12 months by saving $1,000/month. Aggressive saving can quickly build an emergency fund, providing financial security in a relatively short time.',
			},
		],
		faq: [
			{
				question: 'What is an emergency fund?',
				answer:
					'An emergency fund is money set aside to cover unexpected expenses or financial emergencies, such as job loss, medical bills, car repairs, or home repairs. It provides a financial safety net so you don\'t have to rely on credit cards or loans during difficult times. Emergency funds should be easily accessible and kept in a savings account.',
			},
			{
				question: 'How many months should I save?',
				answer:
					'Financial experts typically recommend 3-6 months of expenses for an emergency fund. Three months is a good starting point, while 6 months provides more security. Single-income households, freelancers, or those with unstable income may need 9-12 months. Choose based on your income stability, expenses, and risk tolerance.',
			},
			{
				question: 'What expenses should I include in monthly expenses?',
				answer:
					'Include all essential expenses: housing (rent/mortgage), utilities, food, transportation, insurance (health, auto, home), minimum debt payments, and other necessary expenses. Don\'t include discretionary spending like entertainment, dining out, or non-essential subscriptions. Focus on expenses you must pay to maintain your basic lifestyle.',
			},
			{
				question: 'Where should I keep my emergency fund?',
				answer:
					'Keep your emergency fund in a high-yield savings account or money market account. These accounts offer: easy access when needed, FDIC insurance (in the US), some interest growth, and low risk. Avoid investing emergency funds in stocks or other volatile investments, as you may need the money during market downturns.',
			},
			{
				question: 'Should I invest my emergency fund?',
				answer:
					'No. Emergency funds should not be invested in stocks, bonds, or other volatile investments. Emergency funds need to be easily accessible and stable in value. If you invest your emergency fund and the market drops when you need the money, you may be forced to sell at a loss. Keep emergency funds in savings accounts or money market accounts.',
			},
			{
				question: 'Can I skip building an emergency fund?',
				answer:
					'While you can skip building an emergency fund, it\'s not recommended. Without an emergency fund, unexpected expenses can lead to credit card debt, high-interest loans, or financial stress. An emergency fund provides peace of mind and financial security. Even a small emergency fund ($1,000) is better than nothing.',
			},
			{
				question: 'Is this calculator accurate?',
				answer:
					'This calculator provides accurate estimates based on the inputs you provide. It assumes consistent monthly expenses and contributions. However, actual expenses may vary month-to-month, and your ability to save may change. Use this as a planning tool to set goals and track progress toward your emergency fund.',
			},
			{
				question: 'What if my income is unstable?',
				answer:
					'If your income is unstable (freelancer, contractor, seasonal worker), you may need a larger emergency fund (9-12 months) to account for income fluctuations. During high-income months, save more aggressively. During low-income months, you may need to pause contributions. The key is consistency over time.',
			},
			{
				question: 'Should I pay off debt or build an emergency fund first?',
				answer:
					'Many financial experts recommend building a small emergency fund ($1,000) first, then focusing on high-interest debt, then building a full emergency fund. This prevents you from going into more debt when emergencies arise. However, the best strategy depends on your interest rates, debt amounts, and personal situation.',
			},
			{
				question: 'What if I use my emergency fund?',
				answer:
					'If you use your emergency fund for a true emergency, that\'s what it\'s for! After using it, prioritize rebuilding it. Resume your monthly contributions or increase them temporarily to rebuild faster. Don\'t feel guilty about using your emergency fund - it\'s doing its job by protecting you during difficult times.',
			},
			{
				question: 'Can I count my investments as an emergency fund?',
				answer:
					'Investments are not a substitute for an emergency fund. Investments can lose value, may take time to sell, and selling during market downturns can lock in losses. However, if you have substantial investments, you may be able to use a smaller emergency fund (3 months instead of 6) since you have other assets to fall back on.',
			},
			{
				question: 'How do I start building an emergency fund?',
				answer:
					'Start by setting a realistic monthly contribution goal, even if it\'s small ($50-100/month). Automate your savings by setting up automatic transfers to a dedicated savings account. Cut unnecessary expenses to free up more money. As your income increases, increase your contributions. Consistency is more important than the amount.',
			},
			{
				question: 'What counts as an emergency?',
				answer:
					'Emergencies are unexpected, necessary expenses that you can\'t avoid: job loss, medical emergencies, major car or home repairs, unexpected travel for family emergencies. Non-emergencies include: planned vacations, shopping sales, home improvements, or other discretionary spending. If you can plan for it, it\'s not an emergency.',
			},
			{
				question: 'Should I include my partner\'s income?',
				answer:
					'If you share expenses with a partner, include both incomes and shared expenses in your calculation. However, if you want to be more conservative, calculate based on your individual expenses and income. Dual-income households may need smaller emergency funds (3-6 months) since both partners can contribute.',
			},
		],
		relatedIds: [
			'savings-calculator',
			'take-home-pay-calculator',
			'net-worth-calculator',
			'investment-calculator',
		],
		standardIds: [],
		tags: ['finance', 'emergency-fund', 'savings', 'financial-safety', 'budgeting'],
		meta: {
			keywords: [
				'emergency fund calculator',
				'emergency savings calculator',
				'how much emergency fund do I need',
				'emergency fund planning',
				'financial safety net calculator',
				'emergency savings goal',
				'how to build emergency fund',
				'emergency fund target',
				'financial emergency planning',
				'emergency fund savings',
			],
		},
		isEnabled: true,
	},
	// Net Worth Calculator (EN)
	{
		id: 'net-worth-calculator',
		slug: 'net-worth-calculator',
		category: 'finance',
		title: 'Net Worth Calculator',
		shortDescription:
			'Calculate your net worth by subtracting liabilities from assets. Understand your financial health and track progress over time.',
		longDescription:
			'Calculate your net worth by subtracting liabilities from assets. Understand your financial health and track progress over time. Net worth is a key indicator of financial health, representing the difference between what you own (assets) and what you owe (liabilities). This calculator helps you see the big picture of your finances and make informed decisions about saving, investing, and debt management.',
		locale: 'en',
		contentLocale: 'en',
		inputs: [
			{
				name: 'cashSavings',
				label: 'Cash & Savings',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter cash and savings',
				defaultValue: 0,
				helpText: 'Checking accounts, savings accounts, cash on hand',
				validation: {
					required: true,
					min: 0,
					message: 'Cash and savings must be greater than or equal to 0',
				},
			},
			{
				name: 'investments',
				label: 'Investments',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter investments',
				defaultValue: 0,
				helpText: 'Stocks, bonds, mutual funds, ETFs (current market value)',
				validation: {
					required: true,
					min: 0,
					message: 'Investments must be greater than or equal to 0',
				},
			},
			{
				name: 'retirementAccounts',
				label: 'Retirement Accounts',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter retirement accounts',
				defaultValue: 0,
				helpText: '401(k), IRA, pension plans (current balance)',
				validation: {
					required: true,
					min: 0,
					message: 'Retirement accounts must be greater than or equal to 0',
				},
			},
			{
				name: 'realEstate',
				label: 'Real Estate',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter real estate value',
				defaultValue: 0,
				helpText: 'Home value, rental properties (current market value)',
				validation: {
					required: true,
					min: 0,
					message: 'Real estate value must be greater than or equal to 0',
				},
			},
			{
				name: 'vehicles',
				label: 'Vehicles',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter vehicle value',
				defaultValue: 0,
				helpText: 'Cars, motorcycles, boats (current market value)',
				validation: {
					required: true,
					min: 0,
					message: 'Vehicle value must be greater than or equal to 0',
				},
			},
			{
				name: 'otherAssets',
				label: 'Other Assets',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter other assets',
				defaultValue: 0,
				helpText: 'Jewelry, collectibles, business equity, etc.',
				validation: {
					required: true,
					min: 0,
					message: 'Other assets must be greater than or equal to 0',
				},
			},
			{
				name: 'mortgage',
				label: 'Mortgage',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter mortgage balance',
				defaultValue: 0,
				helpText: 'Outstanding mortgage balance on your home',
				validation: {
					required: true,
					min: 0,
					message: 'Mortgage balance must be greater than or equal to 0',
				},
			},
			{
				name: 'personalLoans',
				label: 'Personal Loans',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter personal loan balance',
				defaultValue: 0,
				helpText: 'Outstanding balance on personal loans',
				validation: {
					required: true,
					min: 0,
					message: 'Personal loan balance must be greater than or equal to 0',
				},
			},
			{
				name: 'autoLoans',
				label: 'Auto Loans',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter auto loan balance',
				defaultValue: 0,
				helpText: 'Outstanding balance on car loans',
				validation: {
					required: true,
					min: 0,
					message: 'Auto loan balance must be greater than or equal to 0',
				},
			},
			{
				name: 'creditCardDebt',
				label: 'Credit Card Debt',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter credit card debt',
				defaultValue: 0,
				helpText: 'Total outstanding credit card balances',
				validation: {
					required: true,
					min: 0,
					message: 'Credit card debt must be greater than or equal to 0',
				},
			},
			{
				name: 'studentLoans',
				label: 'Student Loans',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter student loan balance',
				defaultValue: 0,
				helpText: 'Outstanding balance on student loans',
				validation: {
					required: true,
					min: 0,
					message: 'Student loan balance must be greater than or equal to 0',
				},
			},
			{
				name: 'otherDebts',
				label: 'Other Debts',
				type: 'number',
				unitLabel: '$',
				placeholder: 'Enter other debts',
				defaultValue: 0,
				helpText: 'Medical debt, tax debt, other obligations',
				validation: {
					required: true,
					min: 0,
					message: 'Other debts must be greater than or equal to 0',
				},
			},
		],
		outputs: [
			{
				name: 'totalAssets',
				label: 'Total Assets',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'totalLiabilities',
				label: 'Total Liabilities',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'netWorth',
				label: 'Net Worth',
				unitLabel: '$',
				formatType: 'currency',
			},
			{
				name: 'debtToAssetRatio',
				label: 'Debt-to-Asset Ratio',
				unitLabel: '%',
				formatType: 'percentage',
			},
			{
				name: 'netWorthStatus',
				label: 'Net Worth Status',
				formatType: 'text',
			},
			{
				name: 'formulaExplanation',
				label: 'Formula Explanation',
			},
		],
		calculate: calculateNetWorth,
		howToBullets: [
			'Gather information about your assets - cash, savings, investments, retirement accounts, real estate, vehicles, and other valuable items',
			'Enter your cash and savings - include checking accounts, savings accounts, and cash on hand',
			'Enter your investments - stocks, bonds, mutual funds, ETFs at their current market value',
			'Enter your retirement accounts - 401(k), IRA, pension plans at their current balance',
			'Enter your real estate value - home value and rental properties at current market value (not purchase price)',
			'Enter your vehicle values - cars, motorcycles, boats at their current market value (not purchase price)',
			'Enter any other assets - jewelry, collectibles, business equity, etc.',
			'Gather information about your liabilities - all debts and obligations',
			'Enter your mortgage balance - the outstanding amount you owe on your home',
			'Enter your loan balances - personal loans, auto loans, student loans',
			'Enter your credit card debt - total outstanding balances across all cards',
			'Enter any other debts - medical debt, tax debt, other obligations',
			'Click "Calculate" to see your net worth and financial breakdown',
			'Review your total assets, total liabilities, and net worth',
			'Check your debt-to-asset ratio to understand your debt burden',
			'Use the insights to identify areas for improvement - reducing debt or increasing assets',
		],
		examples: [
			{
				id: 'example-1',
				title: 'Example 1: Young Professional, Positive Net Worth',
				inputDescription:
					'Young professional with savings, investments, and some debt',
				steps: [
					'Cash & Savings: $15,000',
					'Investments: $25,000',
					'Retirement Accounts: $30,000',
					'Real Estate: $0',
					'Vehicles: $12,000',
					'Other Assets: $0',
					'Total Assets: $82,000',
					'Mortgage: $0',
					'Personal Loans: $5,000',
					'Auto Loans: $8,000',
					'Credit Card Debt: $2,000',
					'Student Loans: $20,000',
					'Other Debts: $0',
					'Total Liabilities: $35,000',
					'Net Worth: $47,000',
					'Debt-to-Asset Ratio: 42.7%',
				],
				resultDescription:
					'A young professional with $82,000 in assets and $35,000 in liabilities has a positive net worth of $47,000. This is a healthy financial position for someone early in their career. The debt-to-asset ratio of 42.7% is reasonable, with most debt being student loans and manageable consumer debt.',
			},
			{
				id: 'example-2',
				title: 'Example 2: Homeowner with Mortgage, High Assets & Liabilities',
				inputDescription:
					'Homeowner with significant assets but also a large mortgage',
				steps: [
					'Cash & Savings: $50,000',
					'Investments: $150,000',
					'Retirement Accounts: $200,000',
					'Real Estate: $400,000',
					'Vehicles: $35,000',
					'Other Assets: $15,000',
					'Total Assets: $850,000',
					'Mortgage: $280,000',
					'Personal Loans: $0',
					'Auto Loans: $15,000',
					'Credit Card Debt: $5,000',
					'Student Loans: $0',
					'Other Debts: $0',
					'Total Liabilities: $300,000',
					'Net Worth: $550,000',
					'Debt-to-Asset Ratio: 35.3%',
				],
				resultDescription:
					'A homeowner with $850,000 in assets and $300,000 in liabilities (primarily mortgage) has a net worth of $550,000. This demonstrates how real estate can significantly impact net worth. The debt-to-asset ratio of 35.3% is healthy, with most debt being mortgage debt, which is typically considered "good debt" as it builds equity.',
			},
			{
				id: 'example-3',
				title: 'Example 3: Negative Net Worth, Starting Point',
				inputDescription:
					'Recent graduate with student loans and minimal assets',
				steps: [
					'Cash & Savings: $3,000',
					'Investments: $0',
					'Retirement Accounts: $0',
					'Real Estate: $0',
					'Vehicles: $8,000',
					'Other Assets: $0',
					'Total Assets: $11,000',
					'Mortgage: $0',
					'Personal Loans: $0',
					'Auto Loans: $6,000',
					'Credit Card Debt: $4,000',
					'Student Loans: $45,000',
					'Other Debts: $0',
					'Total Liabilities: $55,000',
					'Net Worth: -$44,000',
					'Debt-to-Asset Ratio: 500%',
				],
				resultDescription:
					'A recent graduate with $11,000 in assets and $55,000 in liabilities (primarily student loans) has a negative net worth of -$44,000. This is common for young adults starting their careers. Negative net worth is not necessarily bad - it\'s a starting point. With consistent income and debt repayment, net worth can improve over time. The key is to focus on increasing assets and reducing high-interest debt.',
			},
		],
		faq: [
			{
				question: 'What is net worth?',
				answer:
					'Net worth is the difference between your assets (what you own) and your liabilities (what you owe). It\'s calculated as: Net Worth = Assets - Liabilities. Net worth is a key indicator of financial health and represents your overall financial position at a point in time.',
			},
			{
				question: 'Is negative net worth bad?',
				answer:
					'Negative net worth is not necessarily bad, especially for young adults, recent graduates, or those with significant student loan debt. It\'s a starting point. Many people start with negative net worth and build it over time through income, savings, and debt repayment. The key is to have a plan to improve your net worth over time.',
			},
			{
				question: 'What is the difference between net worth and income?',
				answer:
					'Net worth is your total assets minus total liabilities at a point in time. Income is the money you earn regularly (salary, wages, etc.). You can have a high income but low net worth if you spend everything you earn. Conversely, you can have a lower income but higher net worth if you save and invest wisely. Net worth represents accumulated wealth, while income represents earning power.',
			},
			{
				question: 'How often should I calculate my net worth?',
				answer:
					'Many financial experts recommend calculating your net worth quarterly (every 3 months) or annually. This allows you to track progress over time without obsessing over daily fluctuations. Regular tracking helps you see trends, identify areas for improvement, and stay motivated to build wealth.',
			},
			{
				question: 'Should I include my home value in net worth?',
				answer:
					'Yes, you should include your home value in net worth calculations, but use the current market value (what you could sell it for today), not the purchase price. However, you must also include your mortgage balance as a liability. The difference (home value minus mortgage) is your home equity, which is part of your net worth.',
			},
			{
				question: 'How do I increase my net worth?',
				answer:
					'You can increase net worth by: 1) Increasing assets (save more, invest, build retirement accounts), 2) Decreasing liabilities (pay off debt, especially high-interest debt), 3) Both. The most effective approach is usually a combination - save and invest while also paying down debt. Focus on high-interest debt first, then build assets.',
			},
			{
				question: 'Is this calculator accurate?',
				answer:
					'This calculator provides accurate calculations based on the values you enter. However, accuracy depends on using current market values for assets (not purchase prices) and accurate debt balances. Asset values can fluctuate, so net worth is a snapshot at a point in time. For the most accurate picture, update values regularly.',
			},
			{
				question: 'What counts as an asset?',
				answer:
					'Assets are things you own that have value: cash, savings accounts, investments (stocks, bonds, mutual funds), retirement accounts (401(k), IRA), real estate (home value, rental properties), vehicles (cars, boats), and other valuable items (jewelry, collectibles, business equity). Use current market value, not purchase price.',
			},
			{
				question: 'What counts as a liability?',
				answer:
					'Liabilities are debts and obligations you owe: mortgage, personal loans, auto loans, credit card debt, student loans, medical debt, tax debt, and other debts. Use the outstanding balance (what you still owe), not the original loan amount.',
			},
			{
				question: 'Should I include my car loan if I included my car value?',
				answer:
					'Yes, absolutely. If you include your car\'s value as an asset, you must also include the outstanding car loan balance as a liability. This gives you an accurate picture. For example, if your car is worth $20,000 but you owe $12,000 on the loan, your net car equity is $8,000.',
			},
			{
				question: 'What is a good debt-to-asset ratio?',
				answer:
					'A debt-to-asset ratio below 50% is generally considered healthy. A ratio above 50% means you owe more than half of your assets. However, context matters - a high ratio due to a mortgage on a valuable home is different from a high ratio due to credit card debt. Focus on reducing high-interest debt and building assets.',
			},
			{
				question: 'Can net worth be negative?',
				answer:
					'Yes, net worth can be negative when your liabilities exceed your assets. This is common for young adults with student loans, recent homebuyers with large mortgages, or those who have experienced financial setbacks. Negative net worth is a starting point, not a permanent condition. With a plan and consistent effort, net worth can improve over time.',
			},
			{
				question: 'Should I include my 401(k) even though I can\'t access it yet?',
				answer:
					'Yes, include your 401(k) and other retirement accounts in your net worth calculation. Even though you can\'t access the money until retirement (without penalties), it\'s still your asset and part of your wealth. Retirement accounts are a significant component of many people\'s net worth.',
			},
			{
				question: 'How does net worth change over time?',
				answer:
					'Net worth changes as: 1) Asset values fluctuate (stocks go up/down, home values change), 2) You pay off debt (reducing liabilities), 3) You save and invest (increasing assets), 4) You take on new debt (increasing liabilities). Regular tracking helps you see trends and understand what\'s driving changes in your net worth.',
			},
			{
				question: 'What if I have a business?',
				answer:
					'If you own a business, include your business equity (the value of your ownership stake) as an asset. This can be challenging to value - you might use book value, estimated market value, or a professional valuation. Be conservative in your estimate. Business debt should be included as a liability if you\'re personally responsible for it.',
			},
		],
		relatedIds: [
			'savings-calculator',
			'investment-calculator',
			'loan-overpayment-calculator',
			'retirement-calculator',
		],
		standardIds: [],
		tags: ['finance', 'net-worth', 'assets', 'liabilities', 'wealth', 'financial-health'],
		meta: {
			keywords: [
				'net worth calculator',
				'calculate net worth',
				'assets and liabilities calculator',
				'financial health calculator',
				'wealth calculator',
				'net worth calculation',
				'personal net worth',
				'financial position calculator',
				'assets minus liabilities',
				'net worth tracker',
			],
		},
		isEnabled: true,
	},
]

/**
 * Get calculator by ID and locale
 * @deprecated Use getCalculatorById from @/lib/calculators/loader instead
 */
export function getCalculatorById(
	id: string,
	locale: string = 'en',
): CalculatorDefinition | undefined {
	return calculators.find((calc) => calc.id === id && calc.locale === locale)
}

/**
 * Get calculator by slug, category, and locale
 * @deprecated Use getCalculatorBySlug from @/lib/calculators/loader instead
 */
export function getCalculatorBySlug(
	category: string,
	slug: string,
	locale: string = 'en',
): CalculatorDefinition | undefined {
	return calculators.find(
		(calc) =>
			calc.category === category &&
			calc.slug === slug &&
			calc.locale === locale,
	)
}

/**
 * Get all calculators for a specific locale
 */
export function getCalculatorsByLocale(
	locale: string = 'en',
): CalculatorDefinition[] {
	return calculators.filter((calc) => calc.locale === locale)
}

/**
 * Get calculators by category and locale
 */
export function getCalculatorsByCategory(
	category: string,
	locale: string = 'en',
): CalculatorDefinition[] {
	return calculators.filter(
		(calc) => calc.category === category && calc.locale === locale,
	)
}

/**
 * Get related calculators by IDs and locale
 */
export function getRelatedCalculators(
	relatedIds: string[],
	locale: string = 'en',
): CalculatorDefinition[] {
	return calculators.filter(
		(calc) => relatedIds.includes(calc.id) && calc.locale === locale,
	)
}

/**
 * Get all unique categories for a locale
 */
export function getCategories(locale: string = 'en'): string[] {
	const categories = new Set<string>()
	calculators
		.filter((calc) => calc.locale === locale)
		.forEach((calc) => categories.add(calc.category))
	return Array.from(categories).sort()
}
