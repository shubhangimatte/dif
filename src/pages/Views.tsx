import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { viewService, ViewComplexity, ViewColumn } from '../services/viewService'

const DBG = (i: number) =>
  i % 2 === 0 ? 'linear-gradient(135deg, #12234F, #0070AD)' : 'linear-gradient(135deg, #0D1F47, #005C91)'

const complexityColors: Record<string, string> = {
  'Very Low': '#0891B2', Low: '#0F766E', Medium: '#B45309', High: '#BE185D', Complex: '#7C3AED'
}

interface CardDef { key: keyof ViewComplexity; icon: string; label: string }

const CARDS: CardDef[] = [
  { key: 'vlowcount',    icon: 'trending_down', label: 'Very Low' },
  { key: 'lowcount',     icon: 'trending_down', label: 'Low'      },
  { key: 'mediumcount',  icon: 'trending_flat', label: 'Medium'   },
  { key: 'highcount',    icon: 'trending_up',   label: 'High'     },
  { key: 'complexcount', icon: 'warning',       label: 'Complex'  },
]

const VIEW_COLS: Column[] = [
  { key: 'Column_Name', label: 'Column Name' },
  { key: 'Datatype',    label: 'Data Type'   },
  { key: 'Is_Nullable', label: 'Nullable', render: v => {
    const yes = String(v ?? '').toLowerCase() === 'yes'
    return <span style={{ color: yes ? '#28A745' : '#E40521', fontWeight: 600 }}>{yes ? 'Yes' : 'No'}</span>
  }},
]

export default function Views() {
  const [complexity, setComplexity] = useState<Partial<ViewComplexity>>({})
  const [views, setViews]           = useState<Record<string, unknown>[]>([])
  const [expanded, setExpanded]     = useState<Record<string, boolean>>({})
  const [cols, setCols]             = useState<Record<string, ViewColumn[]>>({})
  const [loading, setLoading]       = useState<Record<string, boolean>>({})

  useEffect(() => {
    viewService.getComplexity().then(r => setComplexity(Array.isArray(r) ? r[0] : r))
    viewService.getTableData().then(setViews)
  }, [])

  const toggle = async (name: string) => {
    setExpanded(p => ({ ...p, [name]: !p[name] }))
    if (!cols[name]) {
      setLoading(p => ({ ...p, [name]: true }))
      try {
        const data = await viewService.getViewColumns(name)
        setCols(p => ({ ...p, [name]: data.map((r, i) => ({ ...r, sr: i + 1 })) }))
      } catch { setCols(p => ({ ...p, [name]: [] })) }
      finally { setLoading(p => ({ ...p, [name]: false })) }
    }
  }

  return (
    <Layout title="Views">
      <PageTitle title="Views" badge="Assessment" />

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
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 3 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {views.map((v, i) => {
        const name = String(v.View_Name ?? '')
        const cplx = String(v.Complexity ?? '')
        const cColor = complexityColors[cplx] ?? '#64748B'
        return (
          <div key={name} style={{ borderRadius: 10, border: '1.5px solid #DDE8F4', boxShadow: '0 2px 12px rgba(18,35,79,.08)', overflow: 'hidden', marginBottom: 12 }}>
            <div onClick={() => toggle(name)} style={{ background: DBG(i), display: 'flex', alignItems: 'center', padding: '11px 16px', gap: 10, cursor: 'pointer' }}>
              <i className="material-icons" style={{ fontSize: 18, color: 'rgba(255,255,255,.7)' }}>visibility</i>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{name}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,.9)', background: 'rgba(255,255,255,.15)', border: '0.5px solid rgba(255,255,255,.3)', borderRadius: 20, padding: '3px 10px' }}>
                {v.Column_Count} cols · {v.Line_Count} lines
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, background: cColor + '22', color: '#fff', borderRadius: 20, padding: '3px 9px', border: `0.5px solid ${cColor}` }}>{cplx}</span>
              <i className="material-icons" style={{ color: 'rgba(255,255,255,.5)', fontSize: 20 }}>{expanded[name] ? 'expand_less' : 'expand_more'}</i>
            </div>
            {expanded[name] && (
              <div style={{ background: '#F8FBFE', padding: 16, borderTop: '0.5px solid #E4EDF8' }}>
                {loading[name]
                  ? <div style={{ textAlign: 'center', padding: 20, color: '#0070AD' }}>
                      <i className="material-icons" style={{ fontSize: 30 }}>refresh</i>
                      <div>Loading columns...</div>
                    </div>
                  : <div style={{ background: '#fff', border: '1px solid #DDE8F4', borderRadius: 8, padding: 14 }}>
                      <DataTable columns={VIEW_COLS} data={(cols[name] ?? []) as Record<string, unknown>[]} pageSize={10} title={`${name}-Columns`} />
                    </div>
                }
              </div>
            )}
          </div>
        )
      })}
    </Layout>
  )
}
