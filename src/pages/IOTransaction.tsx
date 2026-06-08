import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { ioTransactionService, IOSummary, IORow } from '../services/ioTransactionService'

const fmt = (n: number): string =>
  n >= 1e9 ? (n / 1e9).toFixed(1) + ' B' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' M' : n >= 1e3 ? (n / 1e3).toFixed(1) + ' K' : String(n)

interface CardDef { key: keyof IOSummary; icon: string; label: string }

const CARDS: CardDef[] = [
  { key: 'totalReads',       icon: 'download',      label: 'Total Reads'        },
  { key: 'totalWrites',      icon: 'upload',        label: 'Total Writes'       },
  { key: 'totalTransactions',icon: 'swap_horiz',    label: 'Total Transactions' },
  { key: 'highIOCount',      icon: 'speed',         label: 'High I/O Tables'    },
]

const COLS: Column[] = [
  { key: 'Table_Name', label: 'Table Name'         },
  { key: 'Reads',      label: 'Reads',      render: v => fmt(v as number) },
  { key: 'Writes',     label: 'Writes',     render: v => fmt(v as number) },
  { key: 'Total_IO',   label: 'Total I/O',  render: v => fmt(v as number) },
  { key: 'Read_Pct',   label: 'Read %',     render: v => (
    <span style={{ color: '#0070AD', fontWeight: 600 }}>{String(v ?? '')}</span>
  )},
  { key: 'Write_Pct',  label: 'Write %',    render: v => (
    <span style={{ color: '#B45309', fontWeight: 600 }}>{String(v ?? '')}</span>
  )},
]

export default function IOTransaction() {
  const [summary, setSummary] = useState<Partial<IOSummary>>({})
  const [rows, setRows]       = useState<IORow[]>([])

  useEffect(() => {
    ioTransactionService.getSummary().then(setSummary)
    ioTransactionService.getTableData().then(setRows)
  }, [])

  return (
    <Layout title="IO Transaction">
      <PageTitle title="IO Transaction" badge="Assessment" />

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
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', letterSpacing: '-.5px', lineHeight: 1.15 }}>{fmt(summary[c.key] ?? 0)}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 3 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="cap-card">
        <div className="cap-card-header"><h4>I/O Transaction Analysis</h4></div>
        <div className="cap-card-body">
          <DataTable columns={COLS} data={rows as Record<string, unknown>[]} title="IO-Transaction" />
        </div>
      </div>
    </Layout>
  )
}
