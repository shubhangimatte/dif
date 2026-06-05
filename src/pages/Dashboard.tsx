import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import { dashboardService, DatabaseSummary, DatabaseComplexity, Database } from '../services/dashboardService'

const fmt = (n: number): string =>
  n >= 1e9 ? (n / 1e9).toFixed(1) + ' B' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' M' : n >= 1e3 ? (n / 1e3).toFixed(1) + ' K' : String(n)

const fmtMB = (n: number): string => {
  const v = parseFloat(String(n))
  return v >= 1048576 ? (v / 1048576).toFixed(1) + ' TB' : v >= 1024 ? (v / 1024).toFixed(1) + ' GB' : Math.round(v) + ' MB'
}

interface CardDef {
  key: keyof DatabaseSummary
  icon: string
  label: string
  accent: string
  iconBg: string
  iconColor: string
  border: string
}

interface ComplexityDef {
  label: string
  key: keyof DatabaseComplexity
  color: string
}

const CARDS: CardDef[] = [
  { key: 'dbCount',        icon: 'dns',         label: 'Databases',    accent: '#3730A3', iconBg: '#EDE9FE', iconColor: '#3730A3', border: '#C4B5FD' },
  { key: 'tablesCount',    icon: 'table_chart', label: 'Tables',       accent: '#0F766E', iconBg: '#CCFBF1', iconColor: '#0F766E', border: '#99F6E4' },
  { key: 'fieldCount',     icon: 'view_column', label: 'Fields',       accent: '#047857', iconBg: '#D1FAE5', iconColor: '#047857', border: '#6EE7B7' },
  { key: 'datatypeCount',  icon: 'category',    label: 'Data Types',   accent: '#B45309', iconBg: '#FEF3C7', iconColor: '#B45309', border: '#FCD34D' },
  { key: 'storedproCount', icon: 'code',        label: 'Stored Procs', accent: '#7C3AED', iconBg: '#EDE9FE', iconColor: '#7C3AED', border: '#C4B5FD' },
  { key: 'funCount',       icon: 'functions',   label: 'Functions',    accent: '#BE185D', iconBg: '#FCE7F3', iconColor: '#BE185D', border: '#F9A8D4' },
  { key: 'rowSum',         icon: 'format_list_numbered', label: 'DB Records', accent: '#0891B2', iconBg: '#CFFAFE', iconColor: '#0891B2', border: '#67E8F9' },
  { key: 'dbSum',          icon: 'storage',     label: 'DB Size',      accent: '#475569', iconBg: '#F1F5F9', iconColor: '#475569', border: '#CBD5E1' },
]

const DB_GRADIENTS = [
  'linear-gradient(135deg,#3730A3,#4F46E5)',
  'linear-gradient(135deg,#0F766E,#0D9488)',
  'linear-gradient(135deg,#047857,#059669)',
  'linear-gradient(135deg,#7C3AED,#8B5CF6)',
]

const COMPLEXITY: ComplexityDef[] = [
  { label: 'Very Low',  key: 'vlowcount',    color: '#0891B2' },
  { label: 'Low',       key: 'lowcount',     color: '#0F766E' },
  { label: 'Medium',    key: 'mediumcount',  color: '#B45309' },
  { label: 'High',      key: 'highcount',    color: '#BE185D' },
  { label: 'Complex',   key: 'complexcount', color: '#7C3AED' },
]

interface LocalStatCardProps {
  data: Partial<DatabaseSummary>
  card: CardDef
}

function StatCard({ data, card }: LocalStatCardProps) {
  const raw = data[card.key] ?? 0
  const value = card.key === 'dbSum' ? fmtMB(raw) : fmt(raw)
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
      {/* Icon */}
      <div style={{ width: 46, height: 46, borderRadius: 11, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className="material-icons" style={{ fontSize: 24, color: card.iconColor }}>{card.icon}</i>
      </div>
      {/* Value + label */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', letterSpacing: '-.5px', lineHeight: 1.15 }}>{value}</div>
        <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.label}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<Partial<DatabaseSummary>>({})
  const [complexity, setComplexity] = useState<Partial<DatabaseComplexity>>({})
  const [databases, setDatabases] = useState<Database[]>([])
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [visible, setVisible] = useState(10)

  useEffect(() => {
    dashboardService.getSummary().then(setSummary)
    dashboardService.getComplexity().then(setComplexity)
    dashboardService.getDatabases().then(setDatabases)
  }, [])

  const toggle = (id: number) => setExpanded(p => ({ ...p, [id]: !p[id] }))
  const maxBar = Math.max(1, ...COMPLEXITY.map(c => complexity[c.key] ?? 0))

  return (
    <Layout title="Assessment Dashboard">
      <PageTitle title="ProjectAlpha" />

      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        {CARDS.slice(0, 4).map(c => <StatCard key={c.key} data={summary} card={c} />)}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        {CARDS.slice(4).map(c => <StatCard key={c.key} data={summary} card={c} />)}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,.06)', padding: '16px 18px 14px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 12 }}>Database Complexity Overview</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 80 }}>
          {COMPLEXITY.map(c => {
            const val = complexity[c.key] ?? 0
            const h = Math.round((val / maxBar) * 70)
            return (
              <div key={c.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#334155' }}>{val}</div>
                <div style={{ width: '100%', height: h, background: c.color, borderRadius: '3px 3px 0 0', opacity: .85 }} />
                <div style={{ fontSize: 8.5, color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>{c.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 10 }}>Database Listings</div>

      {databases.slice(0, visible).map((db, i) => (
        <div key={db.id} style={{ borderRadius: 10, border: '1.5px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,.06)', overflow: 'hidden', marginBottom: 10, background: '#fff' }}>
          <div style={{ background: DB_GRADIENTS[i % DB_GRADIENTS.length], display: 'flex', alignItems: 'center', padding: '11px 14px', gap: 9 }}>
            <i className="material-icons" style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', cursor: 'pointer' }}>delete</i>
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{db.name}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,.9)', background: 'rgba(255,255,255,.15)', border: '0.5px solid rgba(255,255,255,.3)', borderRadius: 20, padding: '3px 10px' }}>{db.complexity} Complexity</span>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/assessment/${db.id}`) }}
              style={{ fontSize: 10, fontWeight: 600, padding: '4px 11px', background: 'rgba(255,255,255,.18)', border: '0.5px solid rgba(255,255,255,.4)', borderRadius: 5, color: '#fff', cursor: 'pointer' }}>
              Details
            </button>
            <i
              className="material-icons"
              onClick={() => toggle(db.id)}
              style={{ color: 'rgba(255,255,255,.5)', fontSize: 22, cursor: 'pointer', padding: '2px 4px', borderRadius: 4, transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{expanded[db.id] ? 'expand_less' : 'expand_more'}</i>
          </div>
          {expanded[db.id] && (
            <div style={{ background: '#F8FAFC', padding: 14, borderTop: '0.5px solid #E2E8F0' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {(
                  [
                    ['table_chart', db.tables,         'Tables',   '#EDE9FE', '#3730A3'],
                    ['visibility',  db.viewcount,       'Views',    '#CCFBF1', '#0F766E'],
                    ['functions',   db.functions,       'Func LOC', '#FCE7F3', '#BE185D'],
                    ['code',        db.storedprocedure, 'SP LOC',   '#D1FAE5', '#047857'],
                    ['storage',     db.dbsize,          'DB Size',  '#F1F5F9', '#475569'],
                  ] as [string, string | number, string, string, string][]
                ).map(([ico, val, lbl, bg, col]) => (
                  <div key={lbl} style={{ flex: 1, minWidth: 80, display: 'flex', alignItems: 'flex-start', gap: 7, padding: '8px 9px', borderRadius: 8, border: '0.5px solid #E2E8F0', background: '#fff' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 7, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="material-icons" style={{ fontSize: 16, color: col }}>{ico}</i>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{val}</div>
                      <div style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>{lbl}</div>
                    </div>
                  </div>
                ))}
              </div>
              {db.dbsummary?.complex_datatype && (
                <ul style={{ background: '#F0F9FF', borderLeft: '4px solid #0891B2', borderRadius: '0 7px 7px 0', padding: '10px 14px', listStyle: 'none' }}>
                  {[
                    <><b style={{ color: '#0891B2' }}>({db.dbsummary.complex_datatype})</b> columns using complex data types.</>,
                    <><b style={{ color: '#0891B2' }}>{db.dbsummary.tbl_lowcomplexity}</b> low, <b style={{ color: '#0891B2' }}>{db.dbsummary.tbl_mediumcomplexity}</b> medium, <b style={{ color: '#0891B2' }}>{db.dbsummary.tbl_highcomplexity}</b> high complexity.</>,
                    <>Top 10 tables: <b style={{ color: '#0891B2' }}>{db.dbsummary.dashboardtop10}</b> data volume.</>
                  ].map((txt, j) => (
                    <li key={j} style={{ fontSize: 11.5, color: '#334155', lineHeight: 1.8, paddingLeft: 14, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 2, color: '#0891B2', fontWeight: 700, fontSize: 13 }}>›</span>{txt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}

      {visible < databases.length && (
        <button className="btn-primary" style={{ display: 'block', margin: '16px auto' }} onClick={() => setVisible(v => v + 10)}>
          <i className="material-icons">expand_more</i> Load More
        </button>
      )}
    </Layout>
  )
}
