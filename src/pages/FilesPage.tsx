import { Link } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import {
  assetPublicUrl,
  fileRoutePath,
  getAssetManifest,
  isImageFile,
} from '../lib/assets'

export function FilesPage() {
  const files = getAssetManifest()

  return (
    <AppLayout title="文件库" subtitle="public/assets 中的全部文件">
      {files.length === 0 ? (
        <div className="files-empty">
          <p>还没有文件。</p>
          <p className="files-empty__hint">
            把图片等文件放进 <code>public/assets/</code>，重新构建或刷新 dev 后即可出现在这里。
          </p>
        </div>
      ) : (
        <ul className="files-list">
          {files.map((path) => (
            <li key={path} className="files-list__item">
              <Link to={`/file/${path}`} className="files-list__link">
                {isImageFile(path) ? (
                  <img
                    src={assetPublicUrl(path)}
                    alt=""
                    className="files-list__thumb"
                    loading="lazy"
                  />
                ) : (
                  <span className="files-list__icon" aria-hidden>📄</span>
                )}
                <span className="files-list__name">{path}</span>
              </Link>
              <a
                href={assetPublicUrl(path)}
                className="files-list__raw"
                target="_blank"
                rel="noopener noreferrer"
              >
                直链
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="files-footer">
        访问路径示例：<code>{fileRoutePath('example.jpg')}</code>
      </p>
    </AppLayout>
  )
}
