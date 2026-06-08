import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { datatypeService, DatatypeSummary, DatatypeRow } from '../services/datatypeService'

interface CardDef {
  key: keyof DatatypeSummary
  icon: string
  label: string
}

const CARDS: CardDef[] = [
  { key: 'totalDatatypes', icon: 'category',      label: 'Total Data Types'  },
  { key: 'numericCount',   icon: 'pin',           label: 'Numeric Types'     },
  { key: 'stringCount',    icon: 'text_fields',   label: 'String Types'      },
  { key: 'dateCount',      icon: 'event',         label: 'Date / Time Types' },
  { key: 'otherCount',     icon: 'more_horiz',    label: 'Other Types'       },
]

const categoryColors: Record<string, string> = {
  Numeric: '#0070AD', String: '#0F766E', Date: '#B45309', LOB: '#7C3AED', Other: '#475569'
}

const COLS: Column[] = [
  { key: 'Datatype',     label: 'Data Type'    },
  { key: 'Category',     label: 'Category', render: v => {
    const val = String(v ?? '')
    const c = categoryColors[val] ?? '#64748B'
    return <span style={{ background: c + '18', color: c, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{val}</span>
  }},
  { key: 'Column_Count', label: 'Column Count' },
  { key: 'Table_Count',  label: 'Table Count'  },
]

export default function Datatype() {
  const [summary, setSummary] = useState<Partial<DatatypeSummary>>({})
  const [rows, setRows]       = useState<DatatypeRow[]>([])

  useEffect(() => {
    datatypeService.getSummary().then(setSummary)
    datatypeService.getTableData().then(setRows)
  }, [])

  return (
    <Layout title="Data Types">
      <PageTitle title="Data Types" badge="Assessment" />

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
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', letterSpacing: '-.5px', lineHeight: 1.15 }}>{summary[c.key] ?? 0}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 3 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="cap-card">
        <div className="cap-card-header"><h4>Data Type Usage</h4></div>
        <div className="cap-card-body">
          <DataTable columns={COLS} data={rows as Record<string, unknown>[]} title="Datatype-Usage" />
        </div>
      </div>
    </Layout>
  )
}
