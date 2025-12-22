import { generateHreflangLinks } from '@/lib/hreflang'

interface HreflangLinksProps {
	path: string
}

/**
 * Client component for rendering hreflang links in the head
 * Note: In Next.js App Router, hreflang is better handled via Metadata API
 * This component is provided as an alternative for dynamic paths
 */
export function HreflangLinks({ path }: HreflangLinksProps) {
	const links = generateHreflangLinks(path)

	return (
		<>
			{links.map((link) => (
				<link
					key={link.hreflang}
					rel="alternate"
					hrefLang={link.hreflang}
					href={link.href}
				/>
			))}
			{/* x-default points to default locale */}
			<link
				rel="alternate"
				hrefLang="x-default"
				href={links.find((l) => l.hreflang === 'en')?.href || links[0].href}
			/>
		</>
	)
}








