/** @type {import('next').NextConfig} */
const nextConfig = {
	// Enable React strict mode
	reactStrictMode: true,
	// Allow dots in URLs for decimal numbers
	async rewrites() {
		return []
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





