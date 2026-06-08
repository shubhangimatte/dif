import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { functionService, FunctionComplexity, FunctionRow } from '../services/functionService'

interface CardDef { key: keyof FunctionComplexity; icon: string; label: string }

const CARDS: CardDef[] = [
  { key: 'vlowcount',    icon: 'trending_down', label: 'Very Low Complexity' },
  { key: 'lowcount',     icon: 'trending_down', label: 'Low Complexity'      },
  { key: 'mediumcount',  icon: 'trending_flat', label: 'Medium Complexity'   },
  { key: 'highcount',    icon: 'trending_up',   label: 'High Complexity'     },
  { key: 'complexcount', icon: 'warning',       label: 'Complex'             },
]

const complexityColors: Record<string, string> = {
  'Very Low': '#0891B2', Low: '#0F766E', Medium: '#B45309', High: '#BE185D', Complex: '#7C3AED'
}

const COLS: Column[] = [
  { key: 'Function_Name',  label: 'Function Name'   },
  { key: 'Return_Type',    label: 'Return Type'     },
  { key: 'Line_Count',     label: 'Lines of Code'   },
  { key: 'Parameter_Count',label: 'Parameters'      },
  { key: 'Complexity',     label: 'Complexity', render: v => {
    const val = String(v ?? '')
    const c = complexityColors[val] ?? '#64748B'
    return <span style={{ background: c + '22', color: c, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{val}</span>
  }},
]

export default function Functions() {
  const [complexity, setComplexity] = useState<Partial<FunctionComplexity>>({})
  const [rows, setRows]             = useState<FunctionRow[]>([])

  useEffect(() => {
    functionService.getComplexity().then(r => setComplexity(Array.isArray(r) ? r[0] : r))
    functionService.getTableData().then(setRows)
  }, [])

  return (
    <Layout title="Functions">
      <PageTitle title="Functions" badge="Assessment" />

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
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', letterSpacing: '-.5px', lineHeight: 1.15 }}>{complexity[c.key] ?? 0}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="cap-card">
        <div className="cap-card-header"><h4>Functions Inventory</h4></div>
        <div className="cap-card-body">
          <DataTable columns={COLS} data={rows as Record<string, unknown>[]} title="Functions" />
        </div>
      </div>
    </Layout>
  )
}
