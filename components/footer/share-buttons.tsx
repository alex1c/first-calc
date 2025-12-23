"use client"

import { useEffect, useState } from 'react'

interface ShareButtonsProps {
	className?: string
}

const socialTargets = [
	{
		name: 'Telegram',
		icon: (
			<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
				<path d="M9.681 14.916 9.5 18.25c.356 0 .512-.152.697-.334l1.672-1.603 3.467 2.548c.636.35 1.088.166 1.251-.589l2.267-10.659v0c.202-.94-.343-1.308-.965-1.079L2.62 9.97c-.917.355-.903.864-.156 1.095l3.902 1.217 9.055-5.706c.427-.282.816-.126.497.156" />
			</svg>
		),
		buildUrl: (url: string) => `https://t.me/share/url?url=${url}`,
	},
	{
		name: 'WhatsApp',
		icon: (
			<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
				<path d="M12.02 2a9.96 9.96 0 0 0-8.59 14.84l-1.37 4.16 4.28-1.35A9.95 9.95 0 1 0 12.02 2m5.83 15.7c-.23.65-1.33 1.24-1.83 1.3-.47.05-1.07.05-1.74-.11a15.5 15.5 0 0 1-6.83-3.98A12.67 12.67 0 0 1 5.5 9.5c0-.9.38-1.85.83-2.21.45-.36.99-.54 1.32-.54h.96c.3 0 .73.05.92.46.2.45.63 1.58.69 1.7.05.11.09.24.02.38-.07.14-.11.22-.2.34-.11.12-.23.26-.32.34-.11.11-.23.22-.1.44.12.22.54.89 1.15 1.44.79.7 1.46.92 1.67 1.02.21.11.34.09.46-.05.11-.14.53-.62.68-.83.14-.22.3-.17.5-.1l1.7.8c.24.12.39.17.45.27.06.12.06.67-.16 1.32" />
			</svg>
		),
		buildUrl: (url: string) => `https://wa.me/?text=${url}`,
	},
	{
		name: 'X',
		icon: (
			<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
				<path d="M20.47 2h-3.52l-4.31 5.58L9.35 2H2.5l6.9 10.26L2.71 22h3.53l4.55-5.89L15.35 22h6.85l-7.05-10.3L20.47 2ZM6.61 4.05h1.48l9.36 13.91h-1.48Z" />
			</svg>
		),
		buildUrl: (url: string) =>
			`https://twitter.com/intent/tweet?url=${url}&via=FirstCalc`,
	},
	{
		name: 'Facebook',
		icon: (
			<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
				<path d="M22 12.07A10 10 0 1 0 10.9 22v-7h-2.1v-2.93h2.1V9.22c0-2.08 1.21-3.24 3.07-3.24a12.57 12.57 0 0 1 1.82.16v2H14.7c-.99 0-1.3.62-1.3 1.26v1.54h2.64l-.42 2.93H13.4V22A10 10 0 0 0 22 12.07" />
			</svg>
		),
		buildUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
	},
]

export function ShareButtons({ className }: ShareButtonsProps) {
	const [currentUrl, setCurrentUrl] = useState('')
	const [copied, setCopied] = useState(false)
	const [supportsWebShare, setSupportsWebShare] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setCurrentUrl(window.location.href)
			setSupportsWebShare(typeof navigator !== 'undefined' && !!navigator.share)
		}
	}, [])

	const handleCopy = async () => {
		if (!currentUrl || typeof navigator === 'undefined' || !navigator.clipboard) {
			return
		}
		try {
			await navigator.clipboard.writeText(currentUrl)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			setCopied(false)
		}
	}

	const handleWebShare = async () => {
		if (typeof window === 'undefined' || !navigator.share || !currentUrl) return
		try {
			await navigator.share({
				title: document.title,
				text: 'Check out this page on First-Calc',
				url: currentUrl,
			})
		} catch {
			// Ignore cancellations
		}
	}

	const encodedUrl = encodeURIComponent(currentUrl)

	return (
		<div className={className}>
			<div className="flex flex-wrap gap-3">
				<button
					type="button"
					onClick={supportsWebShare ? handleWebShare : handleCopy}
					className="flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:border-blue-400 hover:text-blue-700 transition-colors"
				>
					<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
						<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.22.09-.45.09-.69s-.04-.47-.09-.69l7.02-4.11A2.99 2.99 0 0 0 18 7.91a3 3 0 1 0-2.83-4A3 3 0 0 0 15 7.91c0 .24.04.47.09.69l-7.02 4.11a3 3 0 1 0 0 2.57l7.02 4.11c-.05.22-.09.45-.09.69a3 3 0 1 0 3-3Z" />
					</svg>
					{supportsWebShare ? 'Share' : copied ? 'Copied!' : 'Copy link'}
				</button>

				{socialTargets.map((target) => (
					<a
						key={target.name}
						className="flex items-center justify-center rounded-full border border-slate-300 p-2 text-slate-600 hover:border-blue-400 hover:text-blue-700 transition-colors"
						href={target.buildUrl(encodedUrl)}
						aria-label={target.name}
						target="_blank"
						rel="noopener noreferrer"
					>
						{target.icon}
					</a>
				))}
			</div>
		</div>
	)
}

