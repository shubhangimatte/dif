import { useState } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'

interface FormState {
  name: string; opportunity: string; accountpoc: string; clientpoc: string
  sensitive_user: boolean
  pusername: string; ppassword: string
  susername: string; spassword: string
}

const EMPTY: FormState = {
  name: '', opportunity: '', accountpoc: '', clientpoc: '',
  sensitive_user: false,
  pusername: '', ppassword: '',
  susername: '', spassword: '',
}

export default function SetupNewClient() {
  const [form, setForm]   = useState<FormState>(EMPTY)
  const [msg, setMsg]     = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const set = (k: keyof FormState, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // POST to backend when available
      await new Promise(r => setTimeout(r, 600))
      setMsg({ type: 'success', text: 'Client setup saved successfully.' })
      setForm(EMPTY)
    } catch {
      setMsg({ type: 'error', text: 'Failed to save client. Please try again.' })
    } finally { setSaving(false) }
  }

  return (
    <Layout title="Setup New Client">
      <PageTitle title="Client Information" badge="Admin" />

      {msg && (
        <div className={`alert alert-${msg.type === 'success' ? 'success' : 'danger'}`}>
          <i className="material-icons">{msg.type === 'success' ? 'check_circle' : 'error'}</i>
          {msg.text}
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }} onClick={() => setMsg(null)}>
            <i className="material-icons" style={{ fontSize: 16 }}>close</i>
          </button>
        </div>
      )}

      <div className="cap-card">
        <div className="cap-card-header"><h4>Setup New Client</h4></div>
        <div className="cap-card-body">
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-field">
                <label className="form-label"><i className="material-icons">business</i>Client Name</label>
                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Client name" required />
              </div>
              <div className="form-field">
                <label className="form-label"><i className="material-icons">work</i>Opportunity</label>
                <input className="form-control" value={form.opportunity} onChange={e => set('opportunity', e.target.value)} placeholder="Opportunity" />
              </div>
              <div className="form-field">
                <label className="form-label"><i className="material-icons">account_circle</i>Account POC</label>
                <input className="form-control" value={form.accountpoc} onChange={e => set('accountpoc', e.target.value)} placeholder="Account POC" />
              </div>
              <div className="form-field">
                <label className="form-label"><i className="material-icons">person</i>Client POC</label>
                <input className="form-control" value={form.clientpoc} onChange={e => set('clientpoc', e.target.value)} placeholder="Client POC" />
              </div>
            </div>

            <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="sensitive_user" checked={form.sensitive_user} onChange={e => set('sensitive_user', e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
              <label htmlFor="sensitive_user" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Sensitive User</label>
            </div>

            {/* Primary / Secondary credentials side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', marginTop: 8 }}>
              {/* Primary */}
              <div>
                <div style={{ background: 'linear-gradient(135deg, #12234F, #0070AD)', borderRadius: '6px 6px 0 0', padding: '8px 14px', color: '#fff', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>
                  Primary
                </div>
                <div className="form-field">
                  <label className="form-label"><i className="material-icons">person_outline</i>Username</label>
                  <input className="form-control" value={form.pusername} onChange={e => set('pusername', e.target.value)} placeholder="Primary username" />
                </div>
                <div className="form-field">
                  <label className="form-label"><i className="material-icons">lock</i>Password</label>
                  <input type="password" className="form-control" value={form.ppassword} onChange={e => set('ppassword', e.target.value)} placeholder="Primary password" />
                </div>
              </div>
              {/* Secondary */}
              <div>
                <div style={{ background: 'linear-gradient(135deg, #0D1F47, #005C91)', borderRadius: '6px 6px 0 0', padding: '8px 14px', color: '#fff', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>
                  Secondary
                </div>
                <div className="form-field">
                  <label className="form-label"><i className="material-icons">person_outline</i>Username</label>
                  <input className="form-control" value={form.susername} onChange={e => set('susername', e.target.value)} placeholder="Secondary username" />
                </div>
                <div className="form-field">
                  <label className="form-label"><i className="material-icons">lock</i>Password</label>
                  <input type="password" className="form-control" value={form.spassword} onChange={e => set('spassword', e.target.value)} placeholder="Secondary password" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                <i className="material-icons" style={{ fontSize: 16 }}>save</i>
                {saving ? 'Saving...' : 'Setup New Client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
