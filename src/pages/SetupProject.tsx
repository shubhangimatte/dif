import { useState } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'

const MOCK_CLIENTS = [
  { id: 1, name: 'Acme Corporation' },
  { id: 2, name: 'Global Finance Ltd' },
  { id: 3, name: 'TechNova Inc' },
]

interface FormState {
  client: string; project: string; description: string
}

export default function SetupProject() {
  const [form, setForm]     = useState<FormState>({ client: '', project: '', description: '' })
  const [msg, setMsg]       = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const set = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await new Promise(r => setTimeout(r, 600))
      setMsg({ type: 'success', text: 'Project setup saved successfully.' })
      setForm({ client: '', project: '', description: '' })
    } catch {
      setMsg({ type: 'error', text: 'Failed to save project. Please try again.' })
    } finally { setSaving(false) }
  }

  return (
    <Layout title="Setup Project">
      <PageTitle title="Project Setup" badge="Admin" />

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
        <div className="cap-card-header"><h4>Setup New Project</h4></div>
        <div className="cap-card-body">
          <form onSubmit={handleSubmit} style={{ maxWidth: 560, margin: '0 auto' }}>
            <div className="form-field">
              <label className="form-label"><i className="material-icons">business</i>Select Client</label>
              <select className="form-control" value={form.client} onChange={e => set('client', e.target.value)} required>
                <option value="" disabled>Select Client</option>
                {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label"><i className="material-icons">folder</i>Project Name</label>
              <input className="form-control" value={form.project} onChange={e => set('project', e.target.value)} placeholder="e.g. Oracle Migration Phase 1" required />
            </div>
            <div className="form-field">
              <label className="form-label"><i className="material-icons">description</i>Project Description</label>
              <input className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of the project" required />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                <i className="material-icons" style={{ fontSize: 16 }}>save</i>
                {saving ? 'Saving...' : 'Setup New Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
