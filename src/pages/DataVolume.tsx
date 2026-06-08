import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { dataVolumeService, DataVolumeSummary, TableVolumeRow } from '../services/dataVolumeService'

const fmtMB = (n: number): string => {
  const v = parseFloat(String(n))
  return v >= 1048576 ? (v / 1048576).toFixed(2) + ' TB' : v >= 1024 ? (v / 1024).toFixed(2) + ' GB' : Math.round(v) + ' MB'
}

interface CardDef {
  key: keyof DataVolumeSummary
  icon: string
  label: string
  accent: string
  iconBg: string
  iconColor: string
  border: string
  fmt: (n: number) => ReactNode
}

const CARDS: CardDef[] = [
  { key: 'top10',         icon: 'table_chart',          label: 'Top 10 Tables Volume',   accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4', fmt: fmtMB },
  { key: 'top25',         icon: 'bar_chart',            label: 'Top 25 Tables Volume',   accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4', fmt: fmtMB },
  { key: '50percentdata', icon: 'pie_chart',            label: '50% Data Volume Tables', accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4', fmt: n => n },
  { key: '1to10MB',       icon: 'filter_1',             label: '1 MB – 10 MB Tables',    accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4', fmt: n => n },
  { key: '10to100MB',     icon: 'filter_2',             label: '10 MB – 100 MB Tables',  accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4', fmt: n => n },
]

const CARDS2: CardDef[] = [
  { key: '100to1GB',        icon: 'filter_3',   label: '100 MB – 1 GB Tables',  accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4', fmt: n => n },
  { key: '1GBto10GB',       icon: 'filter_4',   label: '1 GB – 10 GB Tables',   accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4', fmt: n => n },
  { key: '10GBto50GB',      icon: 'filter_5',   label: '10 GB – 50 GB Tables',  accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4', fmt: n => n },
  { key: '50GBto100GB',     icon: 'filter_6',   label: '50 GB – 100 GB Tables', accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4', fmt: n => n },
  { key: 'greaterThan100GB',icon: 'filter_none',label: '> 100 GB Tables',       accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4', fmt: n => n },
]

interface CardRowProps {
  cards: CardDef[]
  data: Partial<DataVolumeSummary>
}

function CardRow({ cards, data }: CardRowProps) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
      {cards.map(c => (
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
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', letterSpacing: '-.5px', lineHeight: 1.15 }}>{c.fmt(data[c.key] ?? 0)}</div>
            <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const COLS: Column[] = [
  { key: 'Table_Name', label: 'Table Name' },
  { key: 'Size_MB',    label: 'Size', render: v => fmtMB(v as number) },
]

export default function DataVolume() {
  const [summary, setSummary] = useState<Partial<DataVolumeSummary>>({})
  const [rows, setRows] = useState<TableVolumeRow[]>([])

  useEffect(() => {
    dataVolumeService.getSummary().then(setSummary)
    dataVolumeService.getTableData().then(setRows)
  }, [])

  return (
    <Layout title="Data Volume">
      <PageTitle title="Data Volume" badge="Analysis" />
      <CardRow cards={CARDS} data={summary} />
      <CardRow cards={CARDS2} data={summary} />
      <div className="cap-card">
        <div className="cap-card-header"><h4>Data Volume</h4></div>
        <div className="cap-card-body">
          <DataTable columns={COLS} data={rows as Record<string, unknown>[]} title="Data-Volume" />
        </div>
      </div>
    </Layout>
  )
}
