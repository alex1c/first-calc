import type { ReactNode } from 'react'

export type CompatibilityHeaderVariant =
	| 'birth-date'
	| 'friendship'
	| 'work'
	| 'zodiac'
	| 'numerology'

interface CompatibilityHeaderProps {
	title: string
	subtitle: string
	variant: CompatibilityHeaderVariant
	disclaimer?: string
}

const variantConfig: Record<
	CompatibilityHeaderVariant,
	{
		gradient: string
		accent: string
	}
> = {
	'birth-date': {
		gradient: 'from-pink-50 via-rose-50 to-purple-50',
		accent: 'text-pink-500',
	},
	friendship: {
		gradient: 'from-amber-50 via-orange-50 to-rose-50',
		accent: 'text-amber-500',
	},
	work: {
		gradient: 'from-sky-50 via-cyan-50 to-indigo-50',
		accent: 'text-sky-500',
	},
	zodiac: {
		gradient: 'from-indigo-50 via-purple-50 to-blue-50',
		accent: 'text-indigo-500',
	},
	numerology: {
		gradient: 'from-green-50 via-emerald-50 to-teal-50',
		accent: 'text-emerald-500',
	},
}

function BirthDateVisual({ accent }: { accent: string }) {
	return (
		<svg
			viewBox="0 0 220 180"
			className="w-full h-36 md:h-40"
			role="presentation"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="connection" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="rgba(99,102,241,0.25)" />
					<stop offset="100%" stopColor="rgba(236,72,153,0.2)" />
				</linearGradient>
			</defs>
			<rect
				x="30"
				y="40"
				width="60"
				height="70"
				rx="12"
				className="stroke-current text-purple-200 fill-white/60"
				strokeWidth="2"
			/>
			<rect
				x="130"
				y="40"
				width="60"
				height="70"
				rx="12"
				className="stroke-current text-purple-200 fill-white/60"
				strokeWidth="2"
			/>
			<circle
				cx="60"
				cy="30"
				r="16"
				className={`fill-white stroke-current ${accent}`}
				strokeWidth="2"
			/>
			<circle
				cx="160"
				cy="30"
				r="16"
				className={`fill-white stroke-current ${accent}`}
				strokeWidth="2"
			/>
			<path
				d="M70 80 C 90 60, 130 60, 150 80"
				stroke="url(#connection)"
				strokeWidth="4"
				fill="none"
			/>
			<circle cx="110" cy="95" r="28" className="fill-white/80" />
			<circle
				cx="110"
				cy="95"
				r="26"
				className={`fill-none stroke-current ${accent}`}
				strokeWidth="3"
				strokeDasharray="10 6"
				strokeLinecap="round"
			/>
			<text
				x="110"
				y="100"
				textAnchor="middle"
				className={`text-base font-semibold ${accent}`}
			>
				86%
			</text>
			<rect
				x="40"
				y="100"
				width="40"
				height="6"
				rx="3"
				className={`fill-current ${accent}`}
				opacity="0.5"
			/>
			<rect
				x="140"
				y="100"
				width="40"
				height="6"
				rx="3"
				className={`fill-current ${accent}`}
				opacity="0.35"
			/>
		</svg>
	)
}

function ZodiacVisual({ accent }: { accent: string }) {
	return (
		<svg
			viewBox="0 0 220 180"
			className="w-full h-36 md:h-40"
			role="presentation"
			aria-hidden="true"
		>
			<circle
				cx="80"
				cy="90"
				r="40"
				className="fill-white stroke-indigo-100"
				strokeWidth="2"
			/>
			<circle
				cx="140"
				cy="90"
				r="40"
				className="fill-white stroke-indigo-100"
				strokeWidth="2"
			/>
			<text
				x="80"
				y="95"
				textAnchor="middle"
				className={`text-2xl font-semibold ${accent}`}
			>
				AR
			</text>
			<text
				x="140"
				y="95"
				textAnchor="middle"
				className={`text-2xl font-semibold ${accent}`}
			>
				LI
			</text>
			<line
				x1="90"
				y1="120"
				x2="130"
				y2="120"
				className={`stroke-current ${accent}`}
				strokeWidth="4"
				strokeLinecap="round"
			/>
			<circle
				cx="110"
				cy="120"
				r="6"
				className={`fill-current ${accent}`}
				opacity="0.4"
			/>
			<path
				d="M 60 50 Q 110 20 160 50"
				className={`stroke-current ${accent}`}
				strokeWidth="2"
				fill="none"
				opacity="0.3"
				strokeDasharray="6 4"
			/>
			<path
				d="M 60 130 Q 110 160 160 130"
				className={`stroke-current ${accent}`}
				strokeWidth="2"
				fill="none"
				opacity="0.3"
				strokeDasharray="6 4"
			/>
		</svg>
	)
}

function NumerologyVisual({ accent }: { accent: string }) {
	return (
		<svg
			viewBox="0 0 220 180"
			className="w-full h-36 md:h-40"
			role="presentation"
			aria-hidden="true"
		>
			<circle
				cx="70"
				cy="90"
				r="34"
				className="fill-white stroke-emerald-100"
				strokeWidth="2"
			/>
			<circle
				cx="150"
				cy="90"
				r="34"
				className="fill-white stroke-emerald-100"
				strokeWidth="2"
			/>
			<text
				x="70"
				y="98"
				textAnchor="middle"
				className={`text-3xl font-bold ${accent}`}
			>
				4
			</text>
			<text
				x="150"
				y="98"
				textAnchor="middle"
				className={`text-3xl font-bold ${accent}`}
			>
				7
			</text>
			<rect
				x="80"
				y="130"
				width="60"
				height="10"
				rx="5"
				className={`fill-current ${accent}`}
				opacity="0.25"
			/>
			<rect
				x="80"
				y="130"
				width="42"
				height="10"
				rx="5"
				className={`fill-current ${accent}`}
				opacity="0.6"
			/>
			<text
				x="110"
				y="126"
				textAnchor="middle"
				className={`text-sm font-semibold ${accent}`}
			>
				Life Path Gap: 3
			</text>
		</svg>
	)
}

function WorkVisual({ accent }: { accent: string }) {
	return (
		<svg
			viewBox="0 0 220 180"
			className="w-full h-36 md:h-40"
			role="presentation"
			aria-hidden="true"
		>
			<rect
				x="30"
				y="50"
				width="70"
				height="90"
				rx="18"
				className="fill-white stroke-sky-100"
				strokeWidth="2"
			/>
			<rect
				x="120"
				y="50"
				width="70"
				height="90"
				rx="18"
				className="fill-white stroke-sky-100"
				strokeWidth="2"
			/>
			<circle
				cx="65"
				cy="70"
				r="16"
				className={`stroke-current ${accent} fill-white`}
				strokeWidth="2"
			/>
			<circle
				cx="155"
				cy="70"
				r="16"
				className={`stroke-current ${accent} fill-white`}
				strokeWidth="2"
			/>
			<rect
				x="50"
				y="95"
				width="30"
				height="30"
				rx="6"
				className={`fill-current ${accent}`}
				opacity="0.15"
			/>
			<rect
				x="140"
				y="95"
				width="30"
				height="30"
				rx="6"
				className={`fill-current ${accent}`}
				opacity="0.25"
			/>
			<line
				x1="80"
				y1="110"
				x2="140"
				y2="110"
				className={`stroke-current ${accent}`}
				strokeWidth="3"
				strokeLinecap="round"
			/>
			<circle
				cx="110"
				cy="130"
				r="22"
				className="fill-white/70 stroke-sky-100"
				strokeWidth="2"
			/>
			<text
				x="110"
				y="136"
				textAnchor="middle"
				className={`text-base font-semibold ${accent}`}
			>
				Team Tip
			</text>
		</svg>
	)
}

function getVisual(variant: CompatibilityHeaderVariant, accent: string): ReactNode {
	if (variant === 'zodiac') {
		return <ZodiacVisual accent={accent} />
	}
	if (variant === 'numerology') {
		return <NumerologyVisual accent={accent} />
	}
	if (variant === 'work') {
		return <WorkVisual accent={accent} />
	}
	return <BirthDateVisual accent={accent} />
}

export function CompatibilityHeader({
	title,
	subtitle,
	variant,
	disclaimer = 'Results are for entertainment and self-reflection purposes only.',
}: CompatibilityHeaderProps) {
	const config = variantConfig[variant] || variantConfig['birth-date']

	return (
		<div className="mb-8">
			<div
				className={`rounded-2xl border border-white/60 bg-gradient-to-br ${config.gradient} p-6 md:p-8 shadow-sm`}
			>
				<div className="flex flex-col gap-6 md:flex-row md:items-center">
					<div className="flex-1">
						<p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-3">
							Compatibility calculator
						</p>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
							{title}
						</h1>
						<p className="text-base md:text-lg text-gray-700 leading-relaxed">
							{subtitle}
						</p>
					</div>
					<div className="w-full md:w-72">{getVisual(variant, config.accent)}</div>
				</div>
			</div>
			<p className="text-xs text-gray-500 mt-3 text-center md:text-left">
				{disclaimer}
			</p>
		</div>
	)
}

