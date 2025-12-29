import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

interface LogoProps {
	locale: Locale
	className?: string
}

/**
 * Logo component with calculator icon
 * Links to home page with proper locale
 */
export function Logo({ locale, className = '' }: LogoProps) {
	const homePath = locale === 'en' ? '/' : `/${locale}`

	return (
		<Link
			href={homePath}
			className={`flex items-center gap-3 ${className}`}
			aria-label="Calculator Portal - Home"
		>
			<svg
				viewBox="0 0 120 120"
				xmlns="http://www.w3.org/2000/svg"
				className="w-10 h-10 md:w-12 md:h-12"
				aria-hidden="true"
			>
				<defs>
					<linearGradient id="calcGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
					</linearGradient>
					<linearGradient id="screenGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" style={{ stopColor: '#E0E7FF', stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: '#C7D2FE', stopOpacity: 1 }} />
					</linearGradient>
					<filter id="shadow">
						<feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.15" />
					</filter>
				</defs>

				<g transform="translate(10, 10)">
					<rect
						x="0"
						y="0"
						width="100"
						height="100"
						rx="12"
						fill="url(#calcGrad3)"
						filter="url(#shadow)"
					/>
					<rect
						x="12"
						y="12"
						width="76"
						height="24"
						rx="4"
						fill="url(#screenGrad3)"
					/>
					<text
						x="82"
						y="29"
						fontFamily="'Courier New', monospace"
						fontSize="16"
						fill="#4F46E5"
						textAnchor="end"
						fontWeight="bold"
					>
						100+
					</text>
					<rect
						x="12"
						y="44"
						width="16"
						height="12"
						rx="3"
						fill="#ffffff"
						opacity="0.9"
					/>
					<rect
						x="32"
						y="44"
						width="16"
						height="12"
						rx="3"
						fill="#ffffff"
						opacity="0.9"
					/>
					<rect
						x="52"
						y="44"
						width="16"
						height="12"
						rx="3"
						fill="#ffffff"
						opacity="0.9"
					/>
					<rect
						x="72"
						y="44"
						width="16"
						height="12"
						rx="3"
						fill="#FCD34D"
						opacity="0.95"
					/>
					<rect
						x="12"
						y="60"
						width="16"
						height="12"
						rx="3"
						fill="#ffffff"
						opacity="0.9"
					/>
					<rect
						x="32"
						y="60"
						width="16"
						height="12"
						rx="3"
						fill="#ffffff"
						opacity="0.9"
					/>
					<rect
						x="52"
						y="60"
						width="16"
						height="12"
						rx="3"
						fill="#ffffff"
						opacity="0.9"
					/>
					<rect
						x="72"
						y="60"
						width="16"
						height="12"
						rx="3"
						fill="#FCD34D"
						opacity="0.95"
					/>
					<rect
						x="12"
						y="76"
						width="16"
						height="12"
						rx="3"
						fill="#ffffff"
						opacity="0.9"
					/>
					<rect
						x="32"
						y="76"
						width="16"
						height="12"
						rx="3"
						fill="#ffffff"
						opacity="0.9"
					/>
					<rect
						x="52"
						y="76"
						width="16"
						height="12"
						rx="3"
						fill="#ffffff"
						opacity="0.9"
					/>
					<rect
						x="72"
						y="76"
						width="16"
						height="12"
						rx="3"
						fill="#10B981"
						opacity="0.95"
					/>
					<text
						x="20"
						y="53"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#4F46E5"
						textAnchor="middle"
						fontWeight="bold"
					>
						7
					</text>
					<text
						x="40"
						y="53"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#4F46E5"
						textAnchor="middle"
						fontWeight="bold"
					>
						8
					</text>
					<text
						x="60"
						y="53"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#4F46E5"
						textAnchor="middle"
						fontWeight="bold"
					>
						9
					</text>
					<text
						x="80"
						y="53"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#92400E"
						textAnchor="middle"
						fontWeight="bold"
					>
						÷
					</text>
					<text
						x="20"
						y="69"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#4F46E5"
						textAnchor="middle"
						fontWeight="bold"
					>
						4
					</text>
					<text
						x="40"
						y="69"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#4F46E5"
						textAnchor="middle"
						fontWeight="bold"
					>
						5
					</text>
					<text
						x="60"
						y="69"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#4F46E5"
						textAnchor="middle"
						fontWeight="bold"
					>
						6
					</text>
					<text
						x="80"
						y="69"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#92400E"
						textAnchor="middle"
						fontWeight="bold"
					>
						×
					</text>
					<text
						x="20"
						y="85"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#4F46E5"
						textAnchor="middle"
						fontWeight="bold"
					>
						1
					</text>
					<text
						x="40"
						y="85"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#4F46E5"
						textAnchor="middle"
						fontWeight="bold"
					>
						2
					</text>
					<text
						x="60"
						y="85"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#4F46E5"
						textAnchor="middle"
						fontWeight="bold"
					>
						3
					</text>
					<text
						x="80"
						y="85"
						fontFamily="Arial, sans-serif"
						fontSize="9"
						fill="#065F46"
						textAnchor="middle"
						fontWeight="bold"
					>
						=
					</text>
				</g>

				<g transform="translate(85, 15)">
					<circle
						cx="0"
						cy="0"
						r="18"
						fill="#10B981"
						filter="url(#shadow)"
					/>
					<text
						x="0"
						y="6"
						fontFamily="Arial, sans-serif"
						fontSize="20"
						fill="#ffffff"
						textAnchor="middle"
						fontWeight="bold"
					>
						+
					</text>
				</g>
			</svg>
			<span className="text-xl md:text-2xl font-bold text-gray-900 hidden sm:inline">
				Calculator Portal
			</span>
		</Link>
	)
}


