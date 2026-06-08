import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { triggerService, TriggerSummary, TriggerRow } from '../services/triggerService'

interface CardDef { key: keyof TriggerSummary; icon: string; label: string }

const CARDS: CardDef[] = [
  { key: 'totalCount',  icon: 'flash_on',      label: 'Total Triggers'  },
  { key: 'insertCount', icon: 'add_circle',    label: 'INSERT Triggers' },
  { key: 'updateCount', icon: 'edit',          label: 'UPDATE Triggers' },
  { key: 'deleteCount', icon: 'delete',        label: 'DELETE Triggers' },
]

const complexityColors: Record<string, string> = {
  'Very Low': '#0891B2', Low: '#0F766E', Medium: '#B45309', High: '#BE185D', Complex: '#7C3AED'
}

const timingColors: Record<string, string> = { BEFORE: '#B45309', AFTER: '#0070AD' }

const COLS: Column[] = [
  { key: 'Trigger_Name', label: 'Trigger Name' },
  { key: 'Table_Name',   label: 'Table Name'   },
  { key: 'Event',        label: 'Event'        },
  { key: 'Timing',       label: 'Timing', render: v => {
    const val = String(v ?? '')
    const c = timingColors[val] ?? '#475569'
    return <span style={{ background: c + '18', color: c, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{val}</span>
  }},
  { key: 'Complexity',   label: 'Complexity', render: v => {
    const val = String(v ?? '')
    const c = complexityColors[val] ?? '#64748B'
    return <span style={{ background: c + '22', color: c, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{val}</span>
  }},
]

export default function Triggers() {
  const [summary, setSummary] = useState<Partial<TriggerSummary>>({})
  const [rows, setRows]       = useState<TriggerRow[]>([])

  useEffect(() => {
    triggerService.getSummary().then(setSummary)
    triggerService.getTableData().then(setRows)
  }, [])

  return (
    <Layout title="Triggers">
      <PageTitle title="Triggers" badge="Assessment" />

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
        <div className="cap-card-header"><h4>Triggers Inventory</h4></div>
        <div className="cap-card-body">
          <DataTable columns={COLS} data={rows as Record<string, unknown>[]} title="Triggers" />
        </div>
      </div>
    </Layout>
  )
}
