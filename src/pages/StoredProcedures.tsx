import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import { storedProcService, StoredProcComplexity, StoredProcRow, SPObject } from '../services/storedProcService'

const complexityColors: Record<string, string> = {
  'Very Low': '#0891B2', Low: '#0F766E', Medium: '#B45309', High: '#BE185D', Complex: '#7C3AED',
}

const fmt = (n: number): string =>
  n >= 1e6 ? (n / 1e6).toFixed(1) + ' M' : n >= 1e3 ? (n / 1e3).toFixed(1) + ' K' : String(n)

interface CardDef { key: keyof StoredProcComplexity; icon: string; label: string }

const CARDS: CardDef[] = [
  { key: 'vlowcount',    icon: 'assessment',  label: 'Very Low' },
  { key: 'lowcount',     icon: 'description', label: 'Low'      },
  { key: 'mediumcount',  icon: 'trending_flat', label: 'Medium' },
  { key: 'highcount',    icon: 'trending_up', label: 'High'     },
  { key: 'complexcount', icon: 'timer',       label: 'Complex'  },
]

export default function StoredProcedures() {
  const [complexity, setComplexity] = useState<Partial<StoredProcComplexity>>({})
  const [procs, setProcs]           = useState<StoredProcRow[]>([])
  const [modal, setModal]           = useState<{ spName: string } | null>(null)
  const [modalData, setModalData]   = useState<SPObject[]>([])
  const [modalLoading, setModalLoading] = useState(false)
  const [depCache, setDepCache]     = useState<Record<string, SPObject[]>>({})

  useEffect(() => {
    storedProcService.getComplexity().then(r => setComplexity(Array.isArray(r) ? r[0] : r))
    storedProcService.getTableData().then(setProcs)
  }, [])

  const showDependency = async (spName: string) => {
    setModal({ spName })
    setModalData([])
    if (depCache[spName]) { setModalData(depCache[spName]); return }
    setModalLoading(true)
    try {
      const data = await storedProcService.getSPObjects(spName)
      setModalData(data)
      setDepCache(p => ({ ...p, [spName]: data }))
    } catch { setModalData([]) }
    finally { setModalLoading(false) }
  }

  const printDependency = async () => {
    const rows: Array<{ Sp_Name: string; object_name: string; object_type: string }> = []
    for (const proc of procs) {
      const deps = depCache[proc.Sp_Name] ?? await storedProcService.getSPObjects(proc.Sp_Name)
      deps.forEach(d => rows.push({ Sp_Name: proc.Sp_Name, object_name: d.Object_Name, object_type: d.Object_Type }))
    }
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>SP Dependencies</title></head><body>
      <h2>All SP Dependencies</h2>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <thead style="background:#12234F;color:#fff">
          <tr><th>SP Name</th><th>Object Name</th><th>Object Type</th></tr>
        </thead>
        <tbody>${rows.map((r, i) => `<tr style="background:${i % 2 === 0 ? '#f7fafd' : '#fff'}">
          <td>${r.Sp_Name}</td><td>${r.object_name}</td><td>${r.object_type}</td></tr>`).join('')}
        </tbody>
      </table></body></html>`)
    win.document.close()
    win.print()
  }

  const downloadCSV = async () => {
    const rows: Array<{ Sp_Name: string; object_name: string; object_type: string }> = []
    for (const proc of procs) {
      const deps = depCache[proc.Sp_Name] ?? await storedProcService.getSPObjects(proc.Sp_Name)
      deps.forEach(d => rows.push({ Sp_Name: proc.Sp_Name, object_name: d.Object_Name, object_type: d.Object_Type }))
    }
    const csv = ['SP_Name,Object_Name,Object_type',
      ...rows.map(r => `${r.Sp_Name},${r.object_name},${r.object_type}`)
    ].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'SP_Dependencies.csv'
    a.click()
  }

  return (
    <Layout title="Stored Procedures">
      <PageTitle title="Stored Procedures" badge="Assessment" />

      {/* Complexity summary cards */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {CARDS.map(c => (
          <div key={c.key} style={{
            flex: 1, background: '#fff', borderRadius: 12,
            border: '1.5px solid #DDE8F4', borderLeft: '4px solid #0070AD',
            boxShadow: '0 2px 10px rgba(0,0,0,.06)',
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
            transition: 'transform .2s, box-shadow .2s', cursor: 'default',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.11)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.06)' }}
          >
            <div style={{ width: 46, height: 46, borderRadius: 11, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="material-icons" style={{ fontSize: 24, color: '#0070AD' }}>{c.icon}</i>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1E293B', letterSpacing: '-.5px', lineHeight: 1.1 }}>{complexity[c.key] ?? 0}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 3 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons row */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginBottom: 12 }}>
        <button
          onClick={printDependency}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', border: '1.5px solid #0070AD', background: '#fff', color: '#0070AD', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
        >
          <i className="material-icons" style={{ fontSize: 16 }}>print</i>
          Print Dependency
        </button>
        <button
          onClick={downloadCSV}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', border: 'none', background: 'linear-gradient(135deg, #12234F, #0070AD)', color: '#fff', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
        >
          <i className="material-icons" style={{ fontSize: 16 }}>download</i>
          Download CSV of Dependency
        </button>
      </div>

      {/* Stored Procedure Table */}
      <div className="cap-card">
        <div className="cap-card-header">
          <h4>Stored Procedure</h4>
        </div>
        <div className="cap-card-body" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table className="cap-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Stored Procedure Name</th>
                  <th>Executable LoC</th>
                  <th>Complexity</th>
                  <th style={{ textAlign: 'center' }}>Dependency</th>
                </tr>
              </thead>
              <tbody>
                {procs.map((sp, i) => {
                  const cplx = String(sp.Complexity)
                  const cc = complexityColors[cplx] ?? '#64748B'
                  return (
                    <tr key={String(sp.Sp_Name)} style={{ background: i % 2 === 0 ? '#F7FAFD' : '#fff' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <i className="material-icons" style={{ fontSize: 15, color: '#0070AD', flexShrink: 0 }}>code</i>
                          <span style={{ fontWeight: 600, color: '#12234F' }}>{String(sp.Sp_Name)}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', color: '#475569' }}>{sp.Line_Of_Code}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ background: cc + '20', color: cc, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                          {cplx}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => showDependency(String(sp.Sp_Name))}
                          style={{ background: '#0070AD', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background .15s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#005C91' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0070AD' }}
                        >
                          Show
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dependency Modal */}
      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null) }}
        >
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 860, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,.3)' }}>
            {/* Modal header */}
            <div style={{ background: 'linear-gradient(135deg, #12234F, #0070AD)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <i className="material-icons" style={{ color: '#fff', fontSize: 20 }}>account_tree</i>
              <h5 style={{ color: '#fff', margin: 0, fontSize: 14, fontWeight: 700 }}>SP Dependency — {modal.spName}</h5>
              <button
                onClick={() => setModal(null)}
                style={{ marginLeft: 'auto', background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', borderRadius: 6, cursor: 'pointer', padding: '3px 8px', display: 'flex', alignItems: 'center' }}
              >
                <i className="material-icons" style={{ fontSize: 18 }}>close</i>
              </button>
            </div>

            {/* Modal body */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              {modalLoading ? (
                <div style={{ textAlign: 'center', padding: 48, color: '#0070AD' }}>
                  <i className="material-icons" style={{ fontSize: 36 }}>refresh</i>
                  <div style={{ marginTop: 8, fontWeight: 600 }}>Loading dependencies...</div>
                </div>
              ) : (
                <table className="cap-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Object Name</th>
                      <th>Object Type</th>
                      <th>Record Count</th>
                      <th>Complexity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>No dependencies found</td></tr>
                    ) : modalData.map((obj, i) => {
                      const cc = complexityColors[obj.Complexity] ?? '#64748B'
                      const tc = obj.Object_Type === 'TABLE' ? '#0070AD' : obj.Object_Type === 'VIEW' ? '#0F766E' : '#475569'
                      return (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#F7FAFD' : '#fff' }}>
                          <td style={{ fontWeight: 600, color: '#12234F' }}>{obj.Object_Name}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ background: tc + '18', color: tc, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                              {obj.Object_Type}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', color: '#475569' }}>{fmt(obj.Row_Count)}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ background: cc + '22', color: cc, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                              {obj.Complexity}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
