import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { entityRelationshipService, ERSummary, ERRow } from '../services/entityRelationshipService'

interface CardDef { key: keyof ERSummary; icon: string; label: string }

const CARDS: CardDef[] = [
  { key: 'totalFK',          icon: 'share',          label: 'Total FK Constraints'  },
  { key: 'tablesWithFK',     icon: 'table_chart',    label: 'Tables with FK'        },
  { key: 'referencedTables', icon: 'link',           label: 'Referenced Tables'     },
  { key: 'orphanTables',     icon: 'link_off',       label: 'Orphan Tables'         },
]

const COLS: Column[] = [
  { key: 'Constraint_Name',  label: 'Constraint Name'   },
  { key: 'Source_Table',     label: 'Source Table'      },
  { key: 'Source_Column',    label: 'Source Column'     },
  { key: 'Referenced_Table', label: 'Referenced Table'  },
  { key: 'Referenced_Column',label: 'Referenced Column' },
]

export default function EntityRelationship() {
  const [summary, setSummary] = useState<Partial<ERSummary>>({})
  const [rows, setRows]       = useState<ERRow[]>([])

  useEffect(() => {
    entityRelationshipService.getSummary().then(setSummary)
    entityRelationshipService.getTableData().then(setRows)
  }, [])

  return (
    <Layout title="Entity Relationship">
      <PageTitle title="Entity Relationship" badge="Assessment" />

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
        <div className="cap-card-header"><h4>Foreign Key Relationships</h4></div>
        <div className="cap-card-body">
          <DataTable columns={COLS} data={rows as Record<string, unknown>[]} title="Entity-Relationship" />
        </div>
      </div>
    </Layout>
  )
}
