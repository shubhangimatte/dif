import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import Alert from '../components/common/Alert'
import { realtimeService, DbInstance, RealtimeFormData } from '../services/realtimeService'

interface AlertState {
  type: string
  message: string
}

export default function RealtimeExtraction() {
  const [instances, setInstances] = useState<DbInstance[]>([])
  const [form, setForm] = useState<RealtimeFormData>({
    sourceinstance: '', hostname: '', port: '', username: '', password: '', dbname: '', schemaname: '', destinstnce: ''
  })
  const [tested, setTested] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [alert, setAlert] = useState<AlertState | null>(null)

  useEffect(() => { realtimeService.getInstances().then(setInstances) }, [])

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const testConn = async () => {
    try {
      await realtimeService.testConnection(form)
      setTested(true)
      setAlert({ type: 'success', message: 'Connection tested successfully.' })
    } catch {
      setAlert({ type: 'danger', message: 'Connection failed. Please check your credentials.' })
    }
  }

  const scan = async () => {
    setScanning(true); setProgress(0)
    const interval = setInterval(() => setProgress(p => Math.min(p + 8, 95)), 400)
    try {
      await realtimeService.scanDatabase(form)
      clearInterval(interval); setProgress(100)
      setAlert({ type: 'success', message: 'Database scan completed successfully.' })
    } catch {
      clearInterval(interval)
      setAlert({ type: 'danger', message: 'Scan failed. Please try again.' })
    } finally { setScanning(false) }
  }

  return (
    <Layout title="Realtime Database Scan">
      <PageTitle title="Realtime Database Scan" badge="Live Extraction" />

      <div style={{ display: 'flex', alignItems: 'center', maxWidth: 700, margin: '0 auto 20px' }}>
        {['Configure Connection', 'Test Connection', 'Scan Database'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                background: (i === 0 && tested) || (i === 1 && tested) ? '#28A745' : i === 0 || (i === 1 && tested) ? '#0070AD' : '#C8D8EC',
                color: (i === 0 && tested) || (i === 1 && tested) || i === 0 ? '#fff' : '#8A95A3', border: '2px solid transparent'
              }}>
                {(i === 0 && tested) || (i === 1 && tested) ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: tested && i < 2 ? '#28A745' : i === 0 ? '#0070AD' : '#8A95A3' }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: tested && i === 0 ? '#28A745' : '#DDE8F4', margin: '0 8px' }} />}
          </div>
        ))}
      </div>

      <div className="cap-card" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="cap-card-header" style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <h4>Database Connection Settings</h4>
            <p>Enter source database credentials to begin the realtime scan</p>
          </div>
          {tested && (
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: '#E6F6EE', color: '#1A6B3C', border: '0.5px solid #A8DFB8' }}>
              <i className="material-icons" style={{ fontSize: 14 }}>check_circle</i> Connection Verified
            </span>
          )}
        </div>
        <div className="cap-card-body">
          <Alert type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

          <div className="section-divider"><span>Database Technology</span></div>
          <div className="grid-2">
            <div className="form-field">
              <label className="form-label"><i className="material-icons">storage</i>Source DB Technology</label>
              <select className="form-control" name="sourceinstance" value={form.sourceinstance} onChange={update}>
                <option value="">Select Source Technology</option>
                {instances.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label"><i className="material-icons">track_changes</i>Target DB Technology</label>
              <select className="form-control" name="destinstnce" value={form.destinstnce} onChange={update}>
                <option value="">Select Target DB Type</option>
                {instances.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
          </div>

          <div className="section-divider"><span>Connection Details</span></div>
          <div className="grid-2">
            <div className="form-field">
              <label className="form-label"><i className="material-icons">dns</i>Host Name</label>
              <input className="form-control" name="hostname" value={form.hostname} onChange={update} placeholder="e.g. 192.168.1.1" />
            </div>
            <div className="form-field">
              <label className="form-label"><i className="material-icons">settings_ethernet</i>Port</label>
              <input className="form-control" name="port" value={form.port} onChange={update} placeholder="e.g. 1521" />
            </div>
            <div className="form-field">
              <label className="form-label"><i className="material-icons">person</i>User Name</label>
              <input className="form-control" name="username" value={form.username} onChange={update} placeholder="Database username" />
            </div>
            <div className="form-field">
              <label className="form-label"><i className="material-icons">lock</i>Password</label>
              <input className="form-control" type="password" name="password" value={form.password} onChange={update} placeholder="••••••••" />
            </div>
          </div>

          <div className="section-divider"><span>Database Info</span></div>
          <div className="grid-2">
            <div className="form-field">
              <label className="form-label"><i className="material-icons">folder_open</i>Database Name</label>
              <input className="form-control" name="dbname" value={form.dbname} onChange={update} placeholder="e.g. ORCL" />
            </div>
            <div className="form-field">
              <label className="form-label"><i className="material-icons">layers</i>Schema Name</label>
              <input className="form-control" name="schemaname" value={form.schemaname} onChange={update} placeholder="e.g. HR" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn-primary" onClick={testConn}>
              <i className="material-icons" style={{ fontSize: 16 }}>electrical_services</i> Test Connection
            </button>
            {tested && (
              <button className="btn-success" onClick={scan} disabled={scanning}>
                <i className="material-icons" style={{ fontSize: 16 }}>radar</i> {scanning ? 'Scanning...' : 'Scan Database'}
              </button>
            )}
          </div>

          {(scanning || progress > 0) && (
            <div className="progress-wrap">
              <div className="progress-label"><i className="material-icons">hourglass_top</i> Scanning... {progress}%</div>
              <div className="progress-track"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
