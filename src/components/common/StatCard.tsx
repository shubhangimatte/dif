interface StatCardProps {
  icon: string
  value: string | number
  label: string
  gradient: string
}

export default function StatCard({ icon, value, label, gradient }: StatCardProps) {
  return (
    <div className="stat-card" style={{ background: gradient }}>
      <div className="stat-card-header">
        <div className="stat-card-icon">
          <i className="material-icons">{icon}</i>
        </div>
      </div>
      <div className="stat-card-body">
        <h5>{value}</h5>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  )
}
