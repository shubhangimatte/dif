import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { indexService, IndexSummary, IndexRow } from '../services/indexService'

interface CardDef { key: keyof IndexSummary; icon: string; label: string }

const CARDS: CardDef[] = [
  { key: 'totalCount',      icon: 'device_hub',   label: 'Total Indexes'       },
  { key: 'uniqueCount',     icon: 'fingerprint',  label: 'Unique Indexes'      },
  { key: 'clusteredCount',  icon: 'view_stream',  label: 'Clustered'           },
  { key: 'nonClusteredCount',icon: 'list',        label: 'Non-Clustered'       },
  { key: 'compositeCount',  icon: 'grid_on',      label: 'Composite Indexes'   },
]

const COLS: Column[] = [
  { key: 'Index_Name',  label: 'Index Name'  },
  { key: 'Table_Name',  label: 'Table Name'  },
  { key: 'Columns',     label: 'Columns'     },
  { key: 'Index_Type',  label: 'Index Type', render: v => {
    const val = String(v ?? '')
    const c = val === 'Clustered' ? '#0070AD' : '#475569'
    return <span style={{ background: c + '18', color: c, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{val}</span>
  }},
  { key: 'Is_Unique', label: 'Unique', render: v => {
    const yes = String(v ?? '') === 'Yes'
    return <span style={{ color: yes ? '#0F766E' : '#94A3B8', fontWeight: 600 }}>{yes ? 'Yes' : 'No'}</span>
  }},
]

export default function Indexes() {
  const [summary, setSummary] = useState<Partial<IndexSummary>>({})
  const [rows, setRows]       = useState<IndexRow[]>([])

  useEffect(() => {
    indexService.getSummary().then(setSummary)
    indexService.getTableData().then(setRows)
  }, [])

  return (
    <Layout title="Indexes">
      <PageTitle title="Indexes" badge="Assessment" />

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
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="cap-card">
        <div className="cap-card-header"><h4>Index Inventory</h4></div>
        <div className="cap-card-body">
          <DataTable columns={COLS} data={rows as Record<string, unknown>[]} title="Indexes" />
        </div>
      </div>
    </Layout>
  )
}
