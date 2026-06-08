import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { technicalOverheadsService, OverheadSummary, OverheadRow } from '../services/technicalOverheadsService'

interface CardDef { key: keyof OverheadSummary; icon: string; label: string }

const CARDS: CardDef[] = [
  { key: 'unusedObjects',      icon: 'delete_sweep',  label: 'Unused Objects'     },
  { key: 'unusedIndexes',      icon: 'device_hub',    label: 'Unused Indexes'     },
  { key: 'unusedTriggers',     icon: 'flash_on',      label: 'Unused Triggers'    },
  { key: 'deprecatedFeatures', icon: 'warning',       label: 'Deprecated'         },
  { key: 'totalOverhead',      icon: 'speed',         label: 'Total Overhead'     },
]

const sevColor = (s: string) =>
  s === 'High' ? '#BE185D' : s === 'Medium' ? '#B45309' : '#0891B2'

const typeIcon = (t: string) =>
  t === 'Index' ? 'device_hub' : t === 'Trigger' ? 'flash_on' : t === 'View' ? 'visibility' : t === 'Procedure' ? 'code' : 'functions'

const COLS: Column[] = [
  { key: 'Object_Type', label: 'Object Type', render: (v) => {
    const val = String(v ?? '')
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <i className="material-icons" style={{ fontSize: 14, color: '#0070AD' }}>{typeIcon(val)}</i>
        <span style={{ fontWeight: 600, color: '#12234F' }}>{val}</span>
      </div>
    )
  }},
  { key: 'Object_Name',    label: 'Object Name'   },
  { key: 'Issue',          label: 'Issue'         },
  { key: 'Last_Used',      label: 'Last Used'     },
  { key: 'Severity',       label: 'Severity', render: v => {
    const val = String(v ?? '')
    const c = sevColor(val)
    return <span style={{ background: c + '18', color: c, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{val}</span>
  }},
  { key: 'Recommendation', label: 'Recommendation' },
]

export default function TechnicalOverheads() {
  const [summary, setSummary] = useState<Partial<OverheadSummary>>({})
  const [rows, setRows]       = useState<OverheadRow[]>([])

  useEffect(() => {
    technicalOverheadsService.getSummary().then(setSummary)
    technicalOverheadsService.getRows().then(setRows)
  }, [])

  return (
    <Layout title="Technical Overheads">
      <PageTitle title="Technical Overheads" badge="Analysis" />

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {CARDS.map(c => (
          <div key={c.key} style={{
            flex: 1, background: '#fff', borderRadius: 12,
            border: '1.5px solid #DDE8F4', borderLeft: '4px solid #0070AD',
            boxShadow: '0 2px 10px rgba(0,0,0,.06)',
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
            transition: 'transform .2s, box-shadow .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.11)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.06)' }}
          >
            <div style={{ width: 46, height: 46, borderRadius: 11, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="material-icons" style={{ fontSize: 24, color: '#0070AD' }}>{c.icon}</i>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1E293B', letterSpacing: '-.5px', lineHeight: 1.1 }}>{summary[c.key] ?? 0}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 3 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Data table */}
      <div className="cap-card">
        <div className="cap-card-header">
          <h4>Technical Overhead Analysis</h4>
          <p>Unused objects, deprecated features, and performance overhead items requiring attention</p>
        </div>
        <div className="cap-card-body">
          <DataTable columns={COLS} data={rows as Record<string, unknown>[]} title="Technical-Overheads" />
        </div>
      </div>
    </Layout>
  )
}
