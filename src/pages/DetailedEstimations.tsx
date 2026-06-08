import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { estimationSummaryService, DetailedEstimationRow } from '../services/estimationSummaryService'

const COMPLEXITY_COLOR: Record<string, string> = {
  'Very Low': '#0891B2',
  'Low':      '#0F766E',
  'Medium':   '#B45309',
  'High':     '#BE185D',
  'Complex':  '#7C3AED',
}

const TYPE_ICON: Record<string, string> = {
  Table:     'table_chart',
  View:      'visibility',
  Trigger:   'flash_on',
  Procedure: 'code',
  Function:  'functions',
}

const patternColor = (p: string) => p === 'Automated' ? '#0F766E' : '#B45309'

const OBJECT_TYPES = ['Table', 'View', 'Trigger', 'Procedure', 'Function']

const COLUMNS: Column[] = [
  {
    key: 'Object_Name',
    label: 'Object Name',
    render: (v, row) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <i className="material-icons" style={{ fontSize: 14, color: '#0070AD' }}>
          {TYPE_ICON[row.Object_Type as string] ?? 'data_object'}
        </i>
        <span style={{ fontWeight: 600, color: '#12234F', fontFamily: 'monospace', fontSize: 12 }}>{String(v)}</span>
      </span>
    ),
  },
  {
    key: 'Object_Type',
    label: 'Object Type',
    render: v => (
      <span style={{ fontSize: 11, fontWeight: 600, color: '#0070AD', background: '#E6F1FB', padding: '2px 8px', borderRadius: 20 }}>
        {String(v)}
      </span>
    ),
  },
  {
    key: 'Complexity',
    label: 'Complexity',
    render: v => {
      const c = COMPLEXITY_COLOR[String(v)] ?? '#64748B'
      return (
        <span style={{ fontSize: 11, fontWeight: 600, color: c, background: c + '1A', padding: '2px 8px', borderRadius: 20 }}>
          {String(v)}
        </span>
      )
    },
  },
  {
    key: 'Migration_Pattern',
    label: 'Migration Pattern',
    render: v => {
      const pc = patternColor(String(v))
      return (
        <span style={{ fontSize: 11, fontWeight: 600, color: pc, background: pc + '18', padding: '2px 8px', borderRadius: 20 }}>
          {String(v)}
        </span>
      )
    },
  },
  {
    key: 'Automation_Pct',
    label: 'Automation %',
    render: v => (
      <span style={{ fontWeight: 700, color: '#0070AD', fontSize: 12 }}>{String(v)}</span>
    ),
  },
  {
    key: 'Efforts_PD',
    label: 'Efforts (PD)',
    render: v => (
      <span style={{ fontWeight: 700, color: '#1E293B', fontSize: 13 }}>
        {Number(v).toFixed(2)}
      </span>
    ),
  },
  {
    key: 'Notes',
    label: 'Notes',
    render: v => (
      <span style={{ fontSize: 11, color: '#64748B', fontStyle: String(v) ? 'normal' : 'italic' }}>
        {String(v) || '—'}
      </span>
    ),
  },
]

export default function DetailedEstimations() {
  const [rows, setRows] = useState<DetailedEstimationRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    estimationSummaryService.getDetailedRows().then(data => {
      setRows(data)
      setLoading(false)
    })
  }, [])

  const totalPD = rows.reduce((s, r) => s + r.Efforts_PD, 0)

  const typeSummary = OBJECT_TYPES.map(t => {
    const subset = rows.filter(r => r.Object_Type === t)
    return { type: t, count: subset.length, pd: subset.reduce((s, r) => s + r.Efforts_PD, 0) }
  })

  return (
    <Layout title="Detailed Estimations">
      <PageTitle title="Detailed Estimations" badge="Assessment" />

      {/* Summary cards — one per object type */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        {typeSummary.map(({ type, count, pd }) => (
          <div key={type} style={{
            flex: '1 1 160px', background: '#fff', border: '1px solid #DDE8F4', borderRadius: 10,
            padding: '14px 18px', boxShadow: '0 2px 8px rgba(18,35,79,.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="material-icons" style={{ fontSize: 16, color: '#0070AD' }}>{TYPE_ICON[type] ?? 'data_object'}</i>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#12234F' }}>{type}s</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0070AD', lineHeight: 1 }}>{pd.toFixed(2)}</div>
            <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 3 }}>{count} object{count !== 1 ? 's' : ''} · PD</div>
          </div>
        ))}

        {/* Total card */}
        <div style={{
          flex: '1 1 160px', background: 'linear-gradient(135deg,#12234F,#0070AD)', borderRadius: 10,
          padding: '14px 18px', boxShadow: '0 4px 14px rgba(18,35,79,.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="material-icons" style={{ fontSize: 16, color: '#fff' }}>summarize</i>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Total</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{totalPD.toFixed(2)}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.65)', marginTop: 3 }}>{rows.length} objects · Total PD</div>
        </div>
      </div>

      {/* Detailed table */}
      <div className="cap-card">
        <div className="cap-card-header">
          <h4>Object-Level Estimation Breakdown</h4>
          <p>Per-object migration effort with complexity, pattern, and automation details</p>
        </div>
        <div className="cap-card-body" style={{ padding: 0 }}>
          {loading
            ? <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading...</div>
            : (
              <>
                <DataTable
                  columns={COLUMNS}
                  data={rows as unknown as Record<string, unknown>[]}
                  pageSize={15}
                  title="Detailed-Estimations"
                />
                {/* Total footer */}
                <div style={{
                  display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24,
                  padding: '10px 20px', borderTop: '2px solid #0070AD', background: '#EEF3F9',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#12234F' }}>
                    Total Objects: <span style={{ color: '#0070AD' }}>{rows.length}</span>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#12234F' }}>
                    Total Estimated Effort:&nbsp;
                    <span style={{ color: '#0070AD', fontSize: 16 }}>{totalPD.toFixed(2)}</span>
                    &nbsp;PD
                  </span>
                </div>
              </>
            )
          }
        </div>
      </div>
    </Layout>
  )
}
