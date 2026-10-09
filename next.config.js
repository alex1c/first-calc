/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		// Calculator definitions are read through fs at request time. Dynamic paths
		// cannot be discovered by Next.js output tracing automatically, so include
		// them explicitly in the standalone runtime used by Docker.
		outputFileTracingIncludes: {
			'/*': ['./data/calculators/**/*.json'],
		},
	},
	// Enable React strict mode
	reactStrictMode: true,
	// Enable standalone output for Docker
	output: 'standalone',
	// Allow dots in URLs for decimal numbers
	async rewrites() {
		return []
	},
	/**
	 * Historical bare hubs for number-dependent legacy tools 404.
	 * Send them to concrete example pages (308 permanent) so old
	 * internal/external links stay usable without stub landings.
	 */
	async redirects() {
		return [
			{
				source: '/factors',
				destination: '/factors/12',
				permanent: true,
			},
			{
				source: '/:locale(ru|es|tr|hi)/factors',
				destination: '/:locale/factors/12',
				permanent: true,
			},
			{
				source: '/number-format/in',
				destination: '/number-format/in/1234567',
				permanent: true,
			},
			{
				source: '/:locale(ru|es|tr|hi)/number-format/in',
				destination: '/:locale/number-format/in/1234567',
				permanent: true,
			},
		]
	},
	// Configure page extensions to allow dots in dynamic routes
	pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
	webpack: (config, { isServer }) => {
		// Exclude fs and path from client bundle
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				path: false,
			}
		}
		return config
	},
}

module.exports = nextConfig




