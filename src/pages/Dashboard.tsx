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
}

const CARDS: CardDef[] = [
  { key: 'dbCount',        icon: 'dns',         label: 'Databases',    accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'tablesCount',    icon: 'table_chart', label: 'Tables',       accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'fieldCount',     icon: 'view_column', label: 'Fields',       accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'datatypeCount',  icon: 'category',    label: 'Data Types',   accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'storedproCount', icon: 'code',        label: 'Stored Procs', accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'funCount',       icon: 'functions',   label: 'Functions',    accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'rowSum',         icon: 'format_list_numbered', label: 'DB Records', accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
  { key: 'dbSum',          icon: 'storage',     label: 'DB Size',      accent: '#0070AD', iconBg: '#E6F1FB', iconColor: '#0070AD', border: '#DDE8F4' },
]

const DB_GRADIENTS = [
  'linear-gradient(135deg, #12234F, #0070AD)',
  'linear-gradient(135deg, #0D1F47, #005C91)',
]

const COMPLEXITY: ComplexityDef[] = [
  { label: 'Very Low', key: 'vlowcount'    },
  { label: 'Low',      key: 'lowcount'     },
  { label: 'Medium',   key: 'mediumcount'  },
  { label: 'High',     key: 'highcount'    },
  { label: 'Complex',  key: 'complexcount' },
]

function ComplexityBarChart({ data }: { data: { label: string; value: number }[] }) {
  const maxVal = Math.max(1, ...data.map(d => d.value))
  const svgH = 160, svgW = 350
  const padL = 24, padR = 6, padT = 20, padB = 26
  const chartW = svgW - padL - padR
  const chartH = svgH - padT - padB
  const bandW  = chartW / data.length
  const barW   = bandW * 0.55
  const ticks  = Array.from({ length: 5 }, (_, i) => Math.round((maxVal / 4) * i))

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="capBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0070AD" stopOpacity="1"   />
          <stop offset="100%" stopColor="#12234F" stopOpacity="0.88" />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines + Y labels */}
      {ticks.map(t => {
        const y = padT + chartH - (t / maxVal) * chartH
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={svgW - padR} y2={y}
              stroke={t === 0 ? '#CBD5E1' : '#EEF3F9'}
              strokeWidth={t === 0 ? 1.5 : 1}
              strokeDasharray={t === 0 ? undefined : '4 3'}
            />
            <text x={padL - 4} y={y + 3.5} textAnchor="end" fontSize={8} fill="#94A3B8" fontFamily="inherit">{t}</text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const barH = Math.max(4, (d.value / maxVal) * chartH)
        const x    = padL + i * bandW + (bandW - barW) / 2
        const y    = padT + chartH - barH
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} fill="url(#capBarGrad)" rx={4} />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={8} fontWeight="700" fill="#12234F" fontFamily="inherit">{d.value}</text>
            <text x={x + barW / 2} y={svgH - 3} textAnchor="middle" fontSize={8} fill="#64748B" fontWeight="600" fontFamily="inherit">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

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

  return (
    <Layout title="Assessment Dashboard">
      <PageTitle title="ProjectAlpha" />

      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        {CARDS.slice(0, 4).map(c => <StatCard key={c.key} data={summary} card={c} />)}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        {CARDS.slice(4).map(c => <StatCard key={c.key} data={summary} card={c} />)}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #DDE8F4', boxShadow: '0 2px 10px rgba(0,0,0,.06)', padding: '16px 18px 8px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <i className="material-icons" style={{ fontSize: 16, color: '#0070AD' }}>bar_chart</i>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#12234F', textTransform: 'uppercase', letterSpacing: '.8px' }}>Database Complexity Overview</span>
        </div>
        <ComplexityBarChart data={COMPLEXITY.map(c => ({ label: c.label, value: complexity[c.key] ?? 0 }))} />
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
