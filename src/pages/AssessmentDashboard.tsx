import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import { assessmentService, AssessmentData, AssessmentSummary, ComplexityRow } from '../services/assessmentService'

const fmt = (n: number): string =>
  n >= 1e9 ? (n / 1e9).toFixed(1) + ' B' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' M' : n >= 1e3 ? (n / 1e3).toFixed(1) + ' K' : String(n || 0)

const fmtMB = (n: number): string => {
  const v = parseFloat(String(n || 0))
  return v >= 1048576 ? (v / 1048576).toFixed(1) + ' TB' : v >= 1024 ? (v / 1024).toFixed(1) + ' GB' : Math.round(v) + ' MB'
}

interface CardDef {
  key: keyof AssessmentSummary
  icon: string
  label: string
  accent: string
  iconBg: string
  iconColor: string
  border: string
}

const CARDS: CardDef[] = [
  { key: 'tablesCount',    icon: 'table_chart', label: 'Tables',       accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'fieldCount',     icon: 'view_column', label: 'Fields',       accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'datatypeCount',  icon: 'category',    label: 'Data Types',   accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'storedproCount', icon: 'code',        label: 'Stored Procs', accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'funCount',       icon: 'functions',   label: 'Functions',    accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'viewCount',      icon: 'visibility',  label: 'Views',        accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'rowSum',         icon: 'format_list_numbered', label: 'DB Records', accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'dbSum',          icon: 'storage',     label: 'DB Size',      accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
]

const BADGE: Record<string, string> = {
  'Very Low': '#0891B2', 'Low': '#0F766E', 'Medium': '#B45309', 'High': '#BE185D', 'Complex': '#7C3AED'
}

interface LocalStatCardProps {
  card: CardDef
  value: string
}

function StatCard({ card, value }: LocalStatCardProps) {
  return (
    <div
      style={{
        flex: 1, background: '#fff', borderRadius: 12,
        border: `1.5px solid ${card.border}`,
        borderLeft: `4px solid ${card.accent}`,
        boxShadow: '0 2px 10px rgba(0,0,0,.06)',
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', cursor: 'default',
        transition: 'transform .2s, box-shadow .2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.11)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.06)' }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 11, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className="material-icons" style={{ fontSize: 24, color: card.iconColor }}>{card.icon}</i>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', letterSpacing: '-.5px', lineHeight: 1.15 }}>{value}</div>
        <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.label}</div>
      </div>
    </div>
  )
}

type BadgeKey = Exclude<keyof ComplexityRow, 'name' | 'total_count'>

interface BadgeCell {
  key: BadgeKey
  label: string
  color: string
}

const BADGE_CELLS: BadgeCell[] = [
  { key: 'vlowcount',    label: 'Very Low', color: BADGE['Very Low']  },
  { key: 'lowcount',     label: 'Low',      color: BADGE['Low']       },
  { key: 'mediumcount',  label: 'Medium',   color: BADGE['Medium']    },
  { key: 'highcount',    label: 'High',     color: BADGE['High']      },
  { key: 'complexcount', label: 'Complex',  color: BADGE['Complex']   },
]

const TOTAL_KEYS: (keyof ComplexityRow)[] = ['total_count', 'vlowcount', 'lowcount', 'mediumcount', 'highcount', 'complexcount']

export default function AssessmentDashboard() {
  const { dbId } = useParams<{ dbId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<AssessmentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    assessmentService.getData(dbId ?? 1)
      .then(setData)
      .finally(() => setLoading(false))
  }, [dbId])

  if (loading) return (
    <Layout title="Assessment Dashboard">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#64748B' }}>
        <i className="material-icons" style={{ fontSize: 36, marginRight: 10, color: '#0070AD' }}>hourglass_top</i>
        Loading assessment data...
      </div>
    </Layout>
  )

  const s: Partial<AssessmentSummary> = data?.summary ?? {}
  const rows: ComplexityRow[] = data?.complexity ?? []

  return (
    <Layout title="Assessment Dashboard">
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => navigate('/')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: '1.5px solid #B5D4F4', borderRadius: 7, padding: '6px 14px', fontSize: 12.5, fontWeight: 600, color: '#0070AD', cursor: 'pointer' }}>
          <i className="material-icons" style={{ fontSize: 16 }}>arrow_back</i> Back to Dashboard
        </button>
      </div>

      <PageTitle title={data?.dbname ?? 'Assessment Dashboard'} badge="Assessment" />

      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        {CARDS.slice(0, 4).map(c => (
          <StatCard key={c.key} card={c} value={c.key === 'dbSum' ? fmtMB(s[c.key] ?? 0) : fmt(s[c.key] ?? 0)} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {CARDS.slice(4).map(c => (
          <StatCard key={c.key} card={c} value={c.key === 'dbSum' ? fmtMB(s[c.key] ?? 0) : fmt(s[c.key] ?? 0)} />
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #DDE8F4', boxShadow: '0 4px 20px rgba(18,35,79,.08)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg,#12234F,#0070AD)', padding: '14px 22px' }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>
            {data?.dbname} — Complexity Analysis
          </h4>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name', 'Total Count', 'Very Low', 'Low', 'Medium', 'High', 'Complex'].map(h => (
                  <th key={h} style={{ background: '#F0F4F8', color: '#12234F', fontSize: 12, fontWeight: 700, borderBottom: '2px solid #0070AD', padding: '10px 14px', textAlign: h === 'Name' ? 'left' : 'center', letterSpacing: '.3px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.name} style={{ background: i % 2 === 0 ? '#F7FAFD' : '#fff' }}>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#12234F', borderBottom: '1px solid #EAF0F8', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="material-icons" style={{ fontSize: 16, color: '#0070AD' }}>
                      {row.name === 'Tables' ? 'table_chart' : row.name === 'Views' ? 'visibility' : row.name === 'Functions' ? 'functions' : row.name === 'Procedures' ? 'code' : 'flash_on'}
                    </i>
                    {row.name}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: '#1E293B', textAlign: 'center', borderBottom: '1px solid #EAF0F8' }}>{row.total_count}</td>
                  {BADGE_CELLS.map(({ key, color }) => (
                    <td key={key} style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid #EAF0F8' }}>
                      <span style={{ background: `${color}18`, color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block', minWidth: 36 }}>
                        {row[key]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#EEF3F9' }}>
                <td style={{ padding: '10px 14px', fontSize: 12.5, fontWeight: 700, color: '#12234F', borderTop: '2px solid #0070AD' }}>Total</td>
                {TOTAL_KEYS.map(k => (
                  <td key={String(k)} style={{ padding: '10px 14px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#12234F', borderTop: '2px solid #0070AD' }}>
                    {rows.reduce((acc, r) => acc + ((r[k] as number) || 0), 0)}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Layout>
  )
}
