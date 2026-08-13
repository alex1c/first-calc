import { cpSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const standalone = join(root, '.next', 'standalone')

if (!existsSync(join(standalone, 'server.js'))) {
	throw new Error('Standalone build is missing. Run `npm run build` first.')
}

for (const [source, destination] of [
	[join(root, '.next', 'static'), join(standalone, '.next', 'static')],
	[join(root, 'public'), join(standalone, 'public')],
]) {
	if (existsSync(source)) cpSync(source, destination, { recursive: true })
}

await import('../.next/standalone/server.js')
