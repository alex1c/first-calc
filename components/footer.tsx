import Link from 'next/link'
import { ShareButtons } from './footer/share-buttons'
import { getTelegramContactLink, hasTelegramBot } from '@/lib/contact'

const calculatorLinks = [
	{ label: 'Math', href: '/calculators/math' },
	{ label: 'Finance', href: '/calculators/finance' },
	{ label: 'Construction', href: '/calculators/construction' },
	{ label: 'Health', href: '/calculators/health' },
	{ label: 'Life', href: '/calculators/everyday' },
	{ label: 'Compatibility', href: '/calculators/compatibility' },
]

const knowledgeLinks = [
	{ label: 'Learn', href: '/learn' },
	{ label: 'Standards', href: '/standards' },
	{ label: 'About', href: '/about' },
]

const toolLinks = [
	{ label: 'All Calculators', href: '/calculators' },
	{ label: 'Popular Calculators', href: '/calculators#popular-calculators' },
	{ label: 'Tools Hub', href: '/tools' },
]

const legalLinks = [
	{ label: 'Privacy Policy', href: '/privacy' },
	{ label: 'Terms of Use', href: '/terms' },
	{ label: 'Disclaimer', href: '/disclaimer' },
]

export function Footer() {
	const year = new Date().getFullYear()
	const telegramLink = getTelegramContactLink()

	return (
		<footer className="bg-slate-950 text-slate-100 mt-16">
			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							First-Calc
						</p>
						<p className="text-lg font-bold mb-3">
							Free calculators for better planning.
						</p>
						<p className="text-sm text-slate-300 mb-5">
							Free calculators and tools for estimation, planning, and self-reflection.
						</p>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							Share this page
						</p>
						<ShareButtons />
					</div>
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							Calculators
						</p>
						<ul className="space-y-2 text-sm">
							{calculatorLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-slate-300 hover:text-white transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							Knowledge
						</p>
						<ul className="space-y-2 text-sm mb-6">
							{knowledgeLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-slate-300 hover:text-white transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							Tools
						</p>
						<ul className="space-y-2 text-sm">
							{toolLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-slate-300 hover:text-white transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
							Contact & Feedback
						</p>
						<p className="text-sm text-slate-300 mb-3">
							Have suggestions or found an issue? Contact us.
						</p>
						{telegramLink ? (
							<Link
								href={telegramLink}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 bg-white hover:border-blue-400 hover:text-blue-700 transition-colors"
							>
								Message us on Telegram
							</Link>
						) : hasTelegramBot() ? (
							<p className="text-sm text-slate-300">
								Telegram bot configured. Direct contact link will be published soon.
							</p>
						) : (
							<p className="text-sm text-slate-500">Contact form coming soon.</p>
						)}
					</div>
				</div>
				<div className="mt-10 border-t border-slate-800 pt-6 flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
					<p>© {year} First-Calc</p>
					<div className="flex flex-wrap gap-4">
						{legalLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="hover:text-white transition-colors"
							>
								{link.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	)
}










