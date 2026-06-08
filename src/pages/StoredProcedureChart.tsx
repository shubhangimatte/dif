import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import { storedProcService, StoredProcRow, SPObject } from '../services/storedProcService'

const complexityColors: Record<string, string> = {
  'Very Low': '#0891B2', Low: '#0F766E', Medium: '#B45309', High: '#BE185D', Complex: '#7C3AED',
}

const DBG = (i: number) =>
  i % 2 === 0 ? 'linear-gradient(135deg, #12234F, #0070AD)' : 'linear-gradient(135deg, #0D1F47, #005C91)'

interface SPWithDeps { sp: StoredProcRow; deps: SPObject[] }

export default function StoredProcedureChart() {
  const [data, setData]     = useState<SPWithDeps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const procs = await storedProcService.getTableData()
      const all = await Promise.all(
        procs.map(async sp => ({
          sp,
          deps: await storedProcService.getSPObjects(String(sp.Sp_Name)).catch(() => [] as SPObject[]),
        }))
      )
      setData(all)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <Layout title="Stored Procedure Chart">
      <PageTitle title="Stored Procedure Chart" badge="Assessment" />

      <div className="cap-card">
        <div className="cap-card-header">
          <h4>SP Dependency Network</h4>
          <p>Dependency map — each stored procedure and the objects it references</p>
        </div>

        {loading ? (
          <div className="cap-card-body" style={{ textAlign: 'center', padding: 60, color: '#0070AD' }}>
            <i className="material-icons" style={{ fontSize: 44 }}>refresh</i>
            <div style={{ marginTop: 10, fontWeight: 600 }}>Building dependency chart...</div>
          </div>
        ) : (
          <div className="cap-card-body" style={{ padding: '8px 0' }}>
            {data.map(({ sp, deps }, i) => {
              const cplx = String(sp.Complexity)
              const cc   = complexityColors[cplx] ?? '#64748B'
              return (
                <div
                  key={String(sp.Sp_Name)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0,
                    padding: '14px 20px',
                    borderBottom: i < data.length - 1 ? '1px solid #EEF3F9' : 'none',
                  }}
                >
                  {/* SP node */}
                  <div style={{
                    background: DBG(i), borderRadius: 9, padding: '10px 16px',
                    minWidth: 210, flexShrink: 0,
                    boxShadow: '0 2px 10px rgba(18,35,79,.18)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <i className="material-icons" style={{ fontSize: 16, color: 'rgba(255,255,255,.7)' }}>code</i>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', wordBreak: 'break-all' }}>{String(sp.Sp_Name)}</span>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.6)' }}>{sp.Line_Of_Code} LoC</span>
                      <span style={{ fontSize: 10, background: cc + '35', color: '#fff', padding: '1px 7px', borderRadius: 9, fontWeight: 600 }}>{cplx}</span>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {deps.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', height: 46, flexShrink: 0 }}>
                      <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg, #0070AD 60%, #DDE8F4)' }} />
                      <i className="material-icons" style={{ fontSize: 14, color: '#0070AD', marginLeft: -2, marginRight: 6 }}>arrow_forward</i>
                    </div>
                  )}

                  {/* Dependency nodes */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-start' }}>
                    {deps.length === 0 ? (
                      <span style={{ fontSize: 11, color: '#94A3B8', paddingTop: 14, paddingLeft: 10, fontStyle: 'italic' }}>No dependencies</span>
                    ) : deps.map((dep, j) => {
                      const tc = dep.Object_Type === 'TABLE' ? '#0070AD'
                                : dep.Object_Type === 'VIEW'  ? '#0F766E' : '#475569'
                      const dc = complexityColors[dep.Complexity] ?? '#64748B'
                      return (
                        <div key={j} style={{
                          background: '#fff',
                          border: `1.5px solid ${tc}28`,
                          borderTop: `3px solid ${tc}`,
                          borderRadius: 8, padding: '7px 12px',
                          boxShadow: '0 1px 6px rgba(0,0,0,.07)',
                          minWidth: 120,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                            <i className="material-icons" style={{ fontSize: 12, color: tc }}>
                              {dep.Object_Type === 'TABLE' ? 'table_chart' : dep.Object_Type === 'VIEW' ? 'visibility' : 'code'}
                            </i>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#12234F' }}>{dep.Object_Name}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 5 }}>
                            <span style={{ fontSize: 9, background: tc + '15', color: tc, padding: '1px 6px', borderRadius: 8, fontWeight: 600 }}>
                              {dep.Object_Type}
                            </span>
                            <span style={{ fontSize: 9, background: dc + '18', color: dc, padding: '1px 6px', borderRadius: 8, fontWeight: 600 }}>
                              {dep.Complexity}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
