import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DataTable from '../components/common/DataTable'
import type { Column } from '../components/common/DataTable'
import { tableFieldService, TableRow, TableField } from '../services/tableFieldService'

const COLS: Column[] = [
  { key: 'sr',          label: 'Sr.No' },
  { key: 'Column_Name', label: 'Field Name' },
  { key: 'Datatype',    label: 'Data Type' },
  { key: 'Max_Length',  label: 'Length' },
  { key: 'Constraint',  label: 'Constraint' },
  { key: 'Is_Nullable', label: 'IsNull', render: v => {
    const val = String(v ?? '')
    const yes = val.trim() === '1' || val.trim() === 'Y' || val.toUpperCase().trim() === 'YES'
    return <span style={{ color: yes ? '#28A745' : '#E40521', fontWeight: 600 }}>{yes ? 'Yes' : 'No'}</span>
  }},
]

const DBG = (i: number) =>
  i % 2 === 0 ? 'linear-gradient(135deg,#12234F,#1A3A6E)' : 'linear-gradient(60deg,#2d5a87,#1b324a)'

export default function TableFieldListing() {
  const [tables, setTables] = useState<TableRow[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [fields, setFields] = useState<Record<string, TableField[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  useEffect(() => { tableFieldService.getTables().then(setTables) }, [])

  const toggle = async (name: string) => {
    setExpanded(p => ({ ...p, [name]: !p[name] }))
    if (!fields[name]) {
      setLoading(p => ({ ...p, [name]: true }))
      try {
        const data = await tableFieldService.getTableFields(name)
        setFields(p => ({ ...p, [name]: data.map((r, i) => ({ ...r, sr: i + 1, Constraint: 'Constraint' })) }))
      } catch { setFields(p => ({ ...p, [name]: [] })) }
      finally { setLoading(p => ({ ...p, [name]: false })) }
    }
  }

  const downloadCSV = async () => {
    const data = await tableFieldService.printAllData()
    if (!data?.length) return
    const headers = ['Table_Name', 'Column_Name', 'Datatype', 'Max_Length', 'Constraint', 'Is_Nullable']
    const csv = [headers.join(','), ...data.map(r => headers.map(h => `"${String(r[h] ?? '')}"`).join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'table_fields.csv'
    a.click()
  }

  return (
    <Layout title="Table Field Listing">
      <PageTitle title="Table Field Listing" badge="Schema" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
        <button className="btn-primary" onClick={() => window.print()}>
          <i className="material-icons" style={{ fontSize: 16 }}>print</i> Print All
        </button>
        <button className="btn-success" onClick={downloadCSV}>
          <i className="material-icons" style={{ fontSize: 16 }}>download</i> Download CSV
        </button>
      </div>

      {tables.map((t, i) => (
        <div key={t.Table_Name} style={{ borderRadius: 10, border: '1.5px solid #B5D4F4', boxShadow: '0 2px 12px rgba(18,35,79,.08)', overflow: 'hidden', marginBottom: 12 }}>
          <div
            onClick={() => toggle(t.Table_Name)}
            style={{ background: DBG(i), display: 'flex', alignItems: 'center', padding: '11px 16px', gap: 10, cursor: 'pointer' }}
          >
            <i className="material-icons" style={{ fontSize: 18, color: 'rgba(255,255,255,.7)' }}>table_chart</i>
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{t.Table_Name}</span>
            <i className="material-icons" style={{ color: 'rgba(255,255,255,.5)', fontSize: 20 }}>
              {expanded[t.Table_Name] ? 'expand_less' : 'expand_more'}
            </i>
          </div>
          {expanded[t.Table_Name] && (
            <div style={{ background: '#F8FBFE', padding: 16, borderTop: '0.5px solid #E4EDF8' }}>
              {loading[t.Table_Name]
                ? <div style={{ textAlign: 'center', padding: 20, color: '#0070AD' }}>
                    <i className="material-icons" style={{ fontSize: 30, animation: 'spin 1s linear infinite' }}>refresh</i>
                    <div>Loading fields...</div>
                  </div>
                : <div style={{ background: '#fff', border: '1px solid #DDE8F4', borderRadius: 8, padding: 14 }}>
                    <DataTable columns={COLS} data={(fields[t.Table_Name] ?? []) as Record<string, unknown>[]} pageSize={10} title={`${t.Table_Name}-Fields`} />
                  </div>
              }
            </div>
          )}
        </div>
      ))}
    </Layout>
  )
}
