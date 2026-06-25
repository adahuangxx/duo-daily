import { Link } from 'react-router-dom'

interface AppLayoutProps {
  title: string
  subtitle?: React.ReactNode
  children: React.ReactNode
}

export function AppLayout({ title, subtitle, children }: AppLayoutProps) {
  return (
    <div className="app">
      <header className="app__header">
        <p className="app__brand">{title}</p>
        {subtitle && <p className="app__subtitle">{subtitle}</p>}
        <nav className="app__nav" aria-label="主导航">
          <Link to="/" className="app__nav-link">日历</Link>
          <Link to="/files" className="app__nav-link">文件</Link>
        </nav>
      </header>
      <main className="app__main">{children}</main>
    </div>
  )
}
