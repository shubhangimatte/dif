import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <Navbar title={title} />
        <div className="content">{children}</div>
      </div>
    </div>
  )
}
