interface PageTitleProps {
  title: string
  badge?: string
}

export default function PageTitle({ title, badge }: PageTitleProps) {
  return (
    <div className="page-title-wrap">
      <h4>{title}</h4>
      {badge && <span className="page-badge">{badge}</span>}
    </div>
  )
}
