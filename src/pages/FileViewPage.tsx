import { Link, useParams } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import { assetPublicUrl, getAssetManifest, isImageFile } from '../lib/assets'

export function FileViewPage() {
  const { '*': splat } = useParams()
  const path = splat ?? ''
  const files = getAssetManifest()
  const exists = files.includes(path)
  const url = path ? assetPublicUrl(path) : ''

  if (!path) {
    return (
      <AppLayout title="文件" subtitle="未指定文件">
        <p className="files-empty">
          请从 <Link to="/files">文件列表</Link> 选择，或访问 <code>/file/文件名</code>
        </p>
      </AppLayout>
    )
  }

  if (!exists) {
    return (
      <AppLayout title="文件未找到" subtitle={path}>
        <p className="app__error">找不到该文件，请确认它已放在 public/assets/ 并已重新构建。</p>
        <Link to="/files" className="btn btn--ghost files-back">返回列表</Link>
      </AppLayout>
    )
  }

  const isImage = isImageFile(path)

  return (
    <AppLayout title={path} subtitle="文件预览">
      <div className="file-view">
        {isImage ? (
          <img src={url} alt={path} className="file-view__image" />
        ) : (
          <div className="file-view__download">
            <p>此文件类型无法在页面内预览。</p>
            <a href={url} className="btn btn--primary" download>
              下载 / 打开
            </a>
          </div>
        )}
        <div className="file-view__actions">
          <a href={url} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
            在新标签页打开
          </a>
          <Link to="/files" className="btn btn--ghost">返回列表</Link>
        </div>
        <p className="file-view__url">
          直链：<a href={url}>{url}</a>
        </p>
      </div>
    </AppLayout>
  )
}
