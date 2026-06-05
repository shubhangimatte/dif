import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface NavbarProps {
  title?: string
}

export default function Navbar({ title = 'Dashboard' }: NavbarProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="cap-navbar">
      <Link to="/" className="cap-logo-pill" style={{ textDecoration: 'none' }}>
        <span className="cap-logo-brand">Capgemini</span>
        <span className="cap-logo-dot" />
        <span className="cap-logo-product">Database Assessment</span>
      </Link>
      <div className="cap-nav-sep" />
      <span className="cap-nav-title">{title.toUpperCase()}</span>
      <div className="cap-nav-right">
        {user && (
          <span className="cap-nav-welcome">
            <i className="material-icons" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 3 }}>
              {user.role === 'admin' ? 'admin_panel_settings' : 'person_outline'}
            </i>
            {user.username}
            <span style={{
              marginLeft: 6, fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              background: user.role === 'admin' ? 'rgba(0,174,239,.2)' : 'rgba(255,255,255,.12)',
              color: user.role === 'admin' ? '#00AEEF' : 'rgba(255,255,255,.7)',
              padding: '2px 7px', borderRadius: 20, letterSpacing: '.4px',
            }}>
              {user.role}
            </span>
          </span>
        )}
        <button className="cap-nav-btn" onClick={() => navigate('/')}>
          <i className="material-icons">dashboard</i>
          <span>Dashboard</span>
        </button>
        <button className="cap-nav-btn" onClick={handleLogout}>
          <i className="material-icons">logout</i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )
}
