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
  const [alert, setAlert] = useState<AlertState | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { importService.getInstances().then(setInstances) }, [])

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] ?? null)

  const handleImport = async () => {
    if (!file) return setAlert({ type: 'danger', message: 'Please select a file to import.' })
    const fd = new FormData()
    fd.append('file', file)
    fd.append('destinstnce', form.destinstnce)
    fd.append('name', form.name)
    setUploading(true); setProgress(0)
    try {
      const res = await importService.importFile(fd, setProgress)
      setAlert({ type: 'success', message: res?.message || 'File imported successfully.' })
    } catch {
      setAlert({ type: 'danger', message: 'Import failed. Please try again.' })
    } finally { setUploading(false) }
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
            <div className="progress-wrap">
              <div className="progress-label"><i className="material-icons">hourglass_top</i> Uploading... {progress}%</div>
              <div className="progress-track"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
