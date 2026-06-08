import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { userTableService, UserTableComplexity, UserTableRow } from '../services/userTableService'

const fmt = (n: number): string =>
  n >= 1e6 ? (n / 1e6).toFixed(1) + ' M' : n >= 1e3 ? (n / 1e3).toFixed(1) + ' K' : String(n)

interface CardDef {
  key: keyof UserTableComplexity
  icon: string
  label: string
  accent: string
  iconBg: string
  iconColor: string
  border: string
}

const CARDS: CardDef[] = [
  { key: 'vlowcount',    icon: 'trending_down', label: 'Very Low Complexity', accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'lowcount',     icon: 'trending_down', label: 'Low Complexity',      accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'mediumcount',  icon: 'trending_flat', label: 'Medium Complexity',   accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'highcount',    icon: 'trending_up',   label: 'High Complexity',     accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'complexcount', icon: 'warning',       label: 'Complex',             accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
]

const complexityColors: Record<string, string> = {
  'Very Low': '#0891B2', Low: '#0F766E', Medium: '#B45309', High: '#BE185D', Complex: '#7C3AED'
}

const COLS: Column[] = [
  { key: 'Object_Name',      label: 'Table Name' },
  { key: 'Column_Count',     label: 'Column Count' },
  { key: 'Row_Count',        label: 'Row Count',      render: v => fmt(v as number) },
  { key: 'Constraint_Count', label: 'Constraint Count' },
  { key: 'Index_Count',      label: 'Index Count' },
  { key: 'Complexity',       label: 'Complexity', render: v => {
    const val = String(v ?? '')
    return (
      <span style={{ background: complexityColors[val] + '22', color: complexityColors[val], padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
        {val}
      </span>
    )
  }},
]

export default function UserTable() {
  const [complexity, setComplexity] = useState<Partial<UserTableComplexity>>({})
  const [rows, setRows] = useState<UserTableRow[]>([])

  useEffect(() => {
    userTableService.getComplexity().then(r => setComplexity(Array.isArray(r) ? r[0] : r))
    userTableService.getTableData().then(setRows)
  }, [])

  return (
    <Layout title="User Table Inventory">
      <PageTitle title="User Table Inventory" badge="Assessment" />
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {CARDS.map(c => (
          <div
            key={c.key}
            style={{
              flex: 1, background: '#fff', borderRadius: 12,
              border: `1.5px solid ${c.border}`,
              borderLeft: `4px solid ${c.accent}`,
              boxShadow: '0 2px 10px rgba(0,0,0,.06)',
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              transition: 'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.11)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.06)' }}
          >
            <div style={{ width: 46, height: 46, borderRadius: 11, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="material-icons" style={{ fontSize: 24, color: c.iconColor }}>{c.icon}</i>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', letterSpacing: '-.5px', lineHeight: 1.15 }}>{complexity[c.key] ?? 0}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="cap-card">
        <div className="cap-card-header"><h4>User Table Inventory</h4></div>
        <div className="cap-card-body">
          <DataTable columns={COLS} data={rows as Record<string, unknown>[]} title="User-Table-Inventory" />
        </div>
      </div>
    </Layout>
  )
}
