import { useState, useEffect, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../context/AuthContext'

const MOCK_PROJECTS = [
  { id: 1, project_name: 'Project Alpha'  },
  { id: 2, project_name: 'Project Beta'   },
  { id: 3, project_name: 'Project Gamma'  },
]

type DashType = 'assess' | 'migration' | 'que' | ''

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [role,      setRole]      = useState<Role>('user')
  const [username,  setUsername]  = useState('')
  const [password,  setPassword]  = useState('')
  const [showPwd,   setShowPwd]   = useState(false)
  const [project,   setProject]   = useState('')
  const [dashType,  setDashType]  = useState<DashType>('')
  const [showExtra, setShowExtra] = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [loading,   setLoading]   = useState(false)

  /* Mirror PHP's on-input AJAX — show project/dashType once both fields have values */
  useEffect(() => {
    if (username.trim() && password.trim()) {
      setShowExtra(true)
    } else {
      setShowExtra(false)
      setProject('')
      setDashType('')
    }
  }, [username, password])

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    await new Promise(r => setTimeout(r, 700))
    const ok = login(username.trim(), password, role)
    setLoading(false)
    if (ok) {
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => navigate('/', { replace: true }), 600)
    } else {
      setError('Invalid credentials. Please check your username and password.')
    }
  }

  const fillDemo = (r: Role) => {
    setRole(r)
    setUsername(r === 'admin' ? 'admin' : 'user')
    setPassword(r === 'admin' ? 'admin@123' : 'user@123')
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Segoe UI', Roboto, Arial, sans-serif", background: '#EEF3F9' }}>

      {/* ── Left branding panel ── */}
      <div style={{
        flex: '0 0 40%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #0D1F47 0%, #091833 55%, #050E1F 100%)',
        display: 'flex', flexDirection: 'column', padding: '44px 52px',
      }}>
        {/* decorative blobs */}
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(0,112,173,.13)', top: -90, right: -110, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,174,239,.09)', bottom: 50, left: -70, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', background: 'rgba(0,174,239,.06)', bottom: 220, right: 30, pointerEvents: 'none' }} />

        {/* Logo pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 6, padding: '6px 13px', width: 'fit-content', marginBottom: 56 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#0070AD', letterSpacing: '.5px' }}>Capgemini</span>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00AEEF', display: 'inline-block' }} />
          <span style={{ fontSize: 10.5, fontWeight: 600, color: '#12234F' }}>Database Assessment</span>
        </div>

        {/* Main copy */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: '#00AEEF', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 14 }}>
            Enterprise Platform
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1.1, margin: '0 0 6px', letterSpacing: '-1px' }}>
            Definitiv
          </h1>
          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,.55)', fontWeight: 400, margin: '0 0 40px' }}>
            Database Assessment &amp; Migration Analysis
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: 'analytics',   text: 'Schema Complexity Analysis'   },
              { icon: 'storage',     text: 'Data Volume Assessment'        },
              { icon: 'cable',       text: 'Real-time Database Extraction' },
              { icon: 'upload_file', text: 'Migration Report Import'       },
              { icon: 'quiz',        text: 'Assessment Questionnaire'      },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(0,112,173,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="material-icons" style={{ fontSize: 18, color: '#00AEEF' }}>{icon}</i>
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.72)', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.25)', marginTop: 44 }}>
          © {new Date().getFullYear()} Capgemini · All Rights Reserved · v2.0
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 40px' }}>
        <div style={{ width: '100%', maxWidth: 500 }}>

          {/* ── Card matching PHP card structure ── */}
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 8px 40px rgba(18,35,79,.13)', overflow: 'hidden' }}>

            {/* card-header card-header-primary (PHP equivalent) */}
            <div style={{
              background: 'linear-gradient(135deg, #12234F 0%, #0070AD 60%, #0096D6 100%)',
              padding: '22px 28px 20px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,.06)', top: -60, right: -40, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,.04)', bottom: -30, left: 20, pointerEvents: 'none' }} />
              <h4 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 5px', position: 'relative' }}>
                Definitiv — Database Assessment
              </h4>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.72)', margin: 0, position: 'relative' }}>
                Login With Your Credentials
              </p>
            </div>

            {/* card-body */}
            <div style={{ padding: '28px 28px 24px' }}>

              {/* Flash: success */}
              {success && (
                <div style={{ background: '#E6F6EE', color: '#1A6B3C', borderLeft: '4px solid #28A745', borderRadius: '0 8px 8px 0', padding: '10px 14px', marginBottom: 18, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="material-icons" style={{ fontSize: 16, flexShrink: 0 }}>check_circle</i>
                  <span><strong>Success!</strong> {success}</span>
                </div>
              )}

              {/* Flash: error */}
              {error && (
                <div style={{ background: '#FDE8EA', color: '#9B1C1C', borderLeft: '4px solid #E40521', borderRadius: '0 8px 8px 0', padding: '10px 14px', marginBottom: 18, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="material-icons" style={{ fontSize: 16, flexShrink: 0 }}>error_outline</i>
                  <span><strong>Error!</strong> {error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Role — Admin / User toggle */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#12234F', display: 'block', marginBottom: 8 }}>Dashboard Role</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {(['user', 'admin'] as Role[]).map(r => (
                      <button key={r} type="button" onClick={() => { setRole(r); setError('') }}
                        style={{
                          flex: 1, padding: '9px 0', borderRadius: 8, cursor: 'pointer',
                          fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
                          border: role === r ? '2px solid #0070AD' : '2px solid #DDE8F4',
                          background: role === r ? 'linear-gradient(135deg,#0070AD,#005A8E)' : '#F7FAFD',
                          color: role === r ? '#fff' : '#6B7A8D',
                          boxShadow: role === r ? '0 3px 10px rgba(0,112,173,.28)' : 'none',
                          transition: 'all .18s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}>
                        <i className="material-icons" style={{ fontSize: 16 }}>
                          {r === 'admin' ? 'admin_panel_settings' : 'person'}
                        </i>
                        {r === 'admin' ? 'Admin' : 'User'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Username */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#12234F', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                    <i className="material-icons" style={{ fontSize: 15, color: '#0070AD' }}>person</i>
                    Username
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="uname"
                    id="userpro"
                    autoComplete="username"
                    placeholder={role === 'admin' ? 'admin' : 'user'}
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError('') }}
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: showExtra ? 20 : 24 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#12234F', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                    <i className="material-icons" style={{ fontSize: 15, color: '#0070AD' }}>lock</i>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-control"
                      type={showPwd ? 'text' : 'password'}
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      style={{ paddingRight: 42 }}
                      onChange={e => { setPassword(e.target.value); setError('') }}
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A95A3', padding: 2 }}>
                      <i className="material-icons" style={{ fontSize: 18 }}>{showPwd ? 'visibility_off' : 'visibility'}</i>
                    </button>
                  </div>
                </div>

                {/* ── Dynamic fields (PHP: shown after AJAX credentials check) ── */}
                {showExtra && (
                  <div style={{
                    background: '#F7FAFD', border: '1px solid #DDE8F4', borderRadius: 10,
                    padding: '18px 18px 14px', marginBottom: 20,
                    animation: 'fadeSlide .25s ease',
                  }}>
                    {/* Project dropdown */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 12.5, fontWeight: 600, color: '#12234F', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                        <i className="material-icons" style={{ fontSize: 15, color: '#0070AD' }}>folder_open</i>
                        Project
                      </label>
                      <select
                        className="form-control"
                        name="projectlist"
                        value={project}
                        onChange={e => setProject(e.target.value)}
                      >
                        <option value="" disabled>Select project</option>
                        {MOCK_PROJECTS.map(p => (
                          <option key={p.id} value={String(p.id)}>{p.project_name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dashboard Type radios */}
                    <div>
                      <label style={{ fontSize: 12.5, fontWeight: 600, color: '#12234F', display: 'block', marginBottom: 10 }}>
                        Dashboard Type
                      </label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {([
                          { value: 'assess',    label: 'Assessment',    icon: 'analytics'    },
                          { value: 'migration', label: 'Validation',    icon: 'fact_check'   },
                          { value: 'que',       label: 'Questionnaire', icon: 'quiz'         },
                        ] as { value: DashType; label: string; icon: string }[]).map(opt => (
                          <label key={opt.value}
                            style={{
                              flex: 1, minWidth: 110, display: 'flex', alignItems: 'center', gap: 7,
                              padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                              border: dashType === opt.value ? '2px solid #0070AD' : '2px solid #C8D8EC',
                              background: dashType === opt.value ? 'rgba(0,112,173,.07)' : '#fff',
                              transition: 'all .15s',
                            }}>
                            <input
                              type="radio"
                              name="dashboardtype"
                              value={opt.value}
                              checked={dashType === opt.value}
                              onChange={() => setDashType(opt.value)}
                              style={{ accentColor: '#0070AD', width: 14, height: 14, flexShrink: 0 }}
                            />
                            <i className="material-icons" style={{ fontSize: 15, color: dashType === opt.value ? '#0070AD' : '#8A95A3' }}>{opt.icon}</i>
                            <span style={{ fontSize: 12, fontWeight: 600, color: dashType === opt.value ? '#0070AD' : '#6B7A8D' }}>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Login button — right-aligned like PHP's pull-right */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14 }}>
                  <button type="button" onClick={() => fillDemo(role)}
                    style={{ fontSize: 12, color: '#0070AD', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}>
                    Use demo credentials
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '11px 28px', borderRadius: 8, border: 'none',
                      background: loading ? '#C8D8EC' : 'linear-gradient(135deg, #0070AD, #005A8E)',
                      color: '#fff', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: loading ? 'none' : '0 4px 14px rgba(0,112,173,.32)',
                      transition: 'all .18s', display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    {loading
                      ? <><i className="material-icons" style={{ fontSize: 17, animation: 'spin 1s linear infinite' }}>refresh</i> Signing in...</>
                      : <><i className="material-icons" style={{ fontSize: 17 }}>login</i> Login</>
                    }
                  </button>
                </div>

              </form>
            </div>

            {/* Demo credentials bar at bottom */}
            <div style={{ borderTop: '1px solid #EDF4FB', background: '#F7FAFD', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#8A95A3', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>Quick fill:</span>
              {(['admin', 'user'] as Role[]).map(r => (
                <button key={r} type="button" onClick={() => fillDemo(r)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, border: '1px solid #C8D8EC', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#0070AD')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#C8D8EC')}>
                  <i className="material-icons" style={{ fontSize: 13, color: '#0070AD' }}>{r === 'admin' ? 'admin_panel_settings' : 'person'}</i>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: '#4A5E72' }}>{r}</span>
                  <span style={{ fontSize: 10.5, color: '#8A95A3', fontFamily: 'monospace' }}>/ {r}@123</span>
                </button>
              ))}
            </div>

          </div>

          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 11, color: '#8A95A3' }}>
            Capgemini Definitiv · Database Assessment Tool
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
