import manifest from '../generated/asset-manifest.json'

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|bmp|ico|avif)$/i

export function assetPublicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const normalized = path.replace(/^\/+/, '')
  return `${base}assets/${normalized}`
}

export function fileRoutePath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${base}/file/${path}`
}

export function isImageFile(path: string): boolean {
  return IMAGE_EXT.test(path)
}

export function getAssetManifest(): string[] {
  return manifest.files ?? []
}
