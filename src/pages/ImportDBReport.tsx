import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import Alert from '../components/common/Alert'
import { importService, DbInstance } from '../services/importService'

interface AlertState {
  type: string
  message: string
}

export default function ImportDBReport() {
  const [instances, setInstances] = useState<DbInstance[]>([])
  const [form, setForm] = useState({ destinstnce: '', name: '' })
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadPhase, setUploadPhase] = useState<'uploading' | 'processing' | 'done'>('uploading')
  const [alert, setAlert] = useState<AlertState | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const simRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { importService.getInstances().then(setInstances) }, [])

  const clearSim = () => { if (simRef.current) { clearInterval(simRef.current); simRef.current = null } }

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] ?? null)

  const handleImport = async () => {
    if (!file) return setAlert({ type: 'danger', message: 'Please select a file to import.' })

    setUploading(true)
    setUploadPhase('uploading')
    setProgress(0)

    // Simulated progress — increments quickly to 85%, then slows
    let simPct = 0
    simRef.current = setInterval(() => {
      simPct += simPct < 60 ? Math.random() * 10 + 4 : Math.random() * 2 + 0.5
      if (simPct >= 85) { clearSim(); simPct = 85 }
      setProgress(Math.min(Math.round(simPct), 85))
    }, 180)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('destinstnce', form.destinstnce)
    fd.append('name', form.name)

    try {
      const res = await importService.importFile(fd, realPct => {
        simPct = realPct          // sync simulation with real progress
        setProgress(realPct)
        if (realPct >= 100) clearSim()
      })
      clearSim()
      setProgress(95)
      setUploadPhase('processing')
      await new Promise(r => setTimeout(r, 700))  // brief "processing" pause
      setProgress(100)
      await new Promise(r => setTimeout(r, 400))
      setAlert({ type: 'success', message: res?.message || 'File imported successfully.' })
    } catch {
      clearSim()
      setAlert({ type: 'danger', message: 'Import failed. Please try again.' })
    } finally {
      setUploading(false)
      setProgress(0)
      setUploadPhase('uploading')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete all imported data?')) return
    await importService.deleteAll()
    setAlert({ type: 'success', message: 'All imported data deleted.' })
  }

  return (
    <Layout title="Import DB Output Report">
      <PageTitle title="Import DB Output Report" badge="Data Import" />

      <div className="cap-card" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="cap-card-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="material-icons" style={{ color: '#fff', fontSize: 20 }}>upload_file</i>
          </div>
          <div>
            <h4>Import Database Report</h4>
            <p>Upload your source database output file to begin import</p>
          </div>
        </div>
        <div className="cap-card-body">
          <Alert type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

          <div className="form-field">
            <label className="form-label"><i className="material-icons">storage</i>Source Database Technology <span style={{ color: '#E40521' }}>*</span></label>
            <select className="form-control" name="destinstnce" value={form.destinstnce} onChange={update}>
              <option value="">Select Database Technology</option>
              {instances.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label"><i className="material-icons">dns</i>Database Instance Name <span style={{ color: '#E40521' }}>*</span></label>
            <input className="form-control" name="name" value={form.name} onChange={update} placeholder="Enter database instance name" />
          </div>

          <div className="form-field">
            <label className="form-label"><i className="material-icons">attach_file</i>Source Database Output Report <span style={{ color: '#E40521' }}>*</span></label>
            <div className="file-drop" onClick={() => fileRef.current?.click()}>
              <i className="material-icons">cloud_upload</i>
              <div className="file-drop-text">Drag & drop or <strong>browse</strong></div>
              <div className="file-drop-hint">Supports Excel, CSV, SQL output files</div>
              {file && <div className="file-name">📎 {file.name}</div>}
              <input ref={fileRef} type="file" id="uploadFile" name="file" onChange={onFileChange} style={{ display: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn-primary" onClick={handleImport} disabled={uploading}>
              <i className="material-icons" style={{ fontSize: 16 }}>upload</i>
              {uploading ? `Importing... ${progress}%` : 'Import Report'}
            </button>
            <button className="btn-danger" onClick={handleDelete}>
              <i className="material-icons" style={{ fontSize: 15 }}>delete_sweep</i> Delete All Imported Data
            </button>
          </div>

          {uploading && (
            <div style={{
              marginTop: 18, padding: '16px 18px', borderRadius: 10,
              background: 'linear-gradient(135deg, #EBF4FB, #F0F7FD)',
              border: '1.5px solid #B5D4F4',
            }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="material-icons" style={{ fontSize: 18, color: '#0070AD', animation: 'spin 1.2s linear infinite' }}>
                    {uploadPhase === 'processing' ? 'settings' : 'cloud_upload'}
                  </i>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#12234F' }}>
                      {uploadPhase === 'processing' ? 'Processing file...' : `Uploading${file ? ` — ${file.name}` : '...'}`}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 1 }}>
                      {uploadPhase === 'processing' ? 'Validating and importing data' : 'Please do not close or refresh the page'}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#0070AD', letterSpacing: '-1px' }}>
                  {progress}%
                </span>
              </div>

              {/* Track */}
              <div style={{ height: 10, background: '#D0E6F5', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #0070AD, #00AEEF)',
                  borderRadius: 20,
                  transition: 'width 0.25s ease',
                }} />
              </div>

              {/* Step indicators */}
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {[
                  { icon: 'upload_file',   label: 'Uploading',   done: progress >= 30  },
                  { icon: 'sync',          label: 'Transferring',done: progress >= 85  },
                  { icon: 'storage',       label: 'Processing',  done: progress >= 95  },
                  { icon: 'check_circle',  label: 'Complete',    done: progress >= 100 },
                ].map((step, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <i className="material-icons" style={{ fontSize: 14, color: step.done ? '#0070AD' : '#CBD5E1' }}>{step.icon}</i>
                    <span style={{ fontSize: 8.5, fontWeight: 600, color: step.done ? '#0070AD' : '#CBD5E1', textTransform: 'uppercase', letterSpacing: '.4px' }}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
