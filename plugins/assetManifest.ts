import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { Plugin } from 'vite'

const ASSETS_DIR = 'public/assets'
const MANIFEST_PATH = 'src/generated/asset-manifest.json'

function walkAssets(dir: string, root: string): string[] {
  if (!existsSync(dir)) return []

  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      files.push(...walkAssets(fullPath, root))
    } else {
      files.push(relative(root, fullPath).replace(/\\/g, '/'))
    }
  }
  return files.sort()
}

function writeManifest(): void {
  const root = process.cwd()
  const assetsRoot = join(root, ASSETS_DIR)
  const paths = walkAssets(assetsRoot, assetsRoot)

  mkdirSync(join(root, 'src/generated'), { recursive: true })
  writeFileSync(
    join(root, MANIFEST_PATH),
    JSON.stringify({ generatedAt: new Date().toISOString(), files: paths }, null, 2),
    'utf-8',
  )
}

export function assetManifestPlugin(): Plugin {
  return {
    name: 'asset-manifest',
    buildStart() {
      writeManifest()
    },
    configureServer(server) {
      writeManifest()
      server.watcher.add(join(process.cwd(), ASSETS_DIR))
      server.watcher.on('add', (path) => {
        if (path.includes('/assets/') || path.endsWith('/assets')) writeManifest()
      })
      server.watcher.on('unlink', (path) => {
        if (path.includes('/assets/')) writeManifest()
      })
    },
  }
}
