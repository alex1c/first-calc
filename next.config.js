/** @type {import('next').NextConfig} */
const nextConfig = {
	// Enable React strict mode
	reactStrictMode: true,
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





