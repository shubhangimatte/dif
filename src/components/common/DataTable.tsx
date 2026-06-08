import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'

export interface Column {
  key: string
  label: string
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  pageSize?: number
  title?: string
}

function exportCSV(columns: Column[], data: Record<string, unknown>[], title: string) {
  const header = columns.map(c => `"${c.label}"`).join(',')
  const rows = data.map(row =>
    columns.map(c => {
      const v = row[c.key]
      const s = v == null ? '' : String(v).replace(/"/g, '""')
      return `"${s}"`
    }).join(',')
  )
  const csv = [header, ...rows].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  a.download = `${title || 'export'}.csv`
  a.click()
}

function exportPDF(columns: Column[], data: Record<string, unknown>[], title: string) {
  const win = window.open('', '_blank')
  if (!win) return
  const thCells = columns.map(c => `<th style="background:#12234F;color:#fff;padding:8px 12px;text-align:left;font-size:11px;letter-spacing:.4px">${c.label}</th>`).join('')
  const bodyRows = data.map((row, i) => {
    const tds = columns.map(c => `<td style="padding:6px 12px;font-size:11px;border-bottom:1px solid #e2e8f0">${row[c.key] == null ? '' : String(row[c.key])}</td>`).join('')
    return `<tr style="background:${i % 2 === 0 ? '#f7fafd' : '#fff'}">${tds}</tr>`
  }).join('')
  win.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>body{font-family:Arial,sans-serif;margin:20px} h2{color:#12234F;font-size:15px;margin-bottom:12px} table{border-collapse:collapse;width:100%} @media print{@page{size:landscape}}</style>
    </head><body>
    <h2>${title}</h2>
    <table><thead><tr>${thCells}</tr></thead><tbody>${bodyRows}</tbody></table>
    <script>window.onload=function(){window.print()}<\/script>
    </body></html>`)
  win.document.close()
}

export default function DataTable({ columns, data, pageSize = 25, title = 'Export' }: DataTableProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<{ col: string | null; dir: 'asc' | 'desc' }>({ col: null, dir: 'asc' })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter(row =>
      columns.some(c => String(row[c.key] ?? '').toLowerCase().includes(q))
    )
  }, [data, search, columns])

  const sorted = useMemo(() => {
    if (!sort.col) return filtered
    const col = sort.col
    return [...filtered].sort((a, b) => {
      const v1 = a[col], v2 = b[col]
      return sort.dir === 'asc' ? (v1 > v2 ? 1 : -1) : (v1 < v2 ? 1 : -1)
    })
  }, [filtered, sort])

  const total = sorted.length
  const pages = Math.ceil(total / pageSize)
  const rows = sorted.slice((page - 1) * pageSize, page * pageSize)

  const toggleSort = (col: string) =>
    setSort(s => ({ col, dir: s.col === col && s.dir === 'asc' ? 'desc' : 'asc' }))

  return (
    <div>
      {/* Toolbar: export buttons + search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Excel */}
          <button
            onClick={() => exportCSV(columns, sorted, title)}
            title="Download Excel (CSV)"
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: '#1D6F42', color: '#fff', border: 'none', borderRadius: 5, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}
          >
            <i className="material-icons" style={{ fontSize: 14 }}>grid_on</i>
            Excel
          </button>
          {/* PDF */}
          <button
            onClick={() => exportPDF(columns, sorted, title)}
            title="Export to PDF"
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: '#12234F', color: '#fff', border: 'none', borderRadius: 5, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}
          >
            <i className="material-icons" style={{ fontSize: 14 }}>picture_as_pdf</i>
            PDF
          </button>
          <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 4 }}>
            {total} record{total !== 1 ? 's' : ''}
          </span>
        </div>
        <input
          className="form-control"
          style={{ width: 200, padding: '6px 10px', fontSize: 12 }}
          placeholder="Search..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      <div className="table-wrapper">
        <table className="cap-table">
          <thead>
            <tr>
              {columns.map(c => (
                <th key={c.key} onClick={() => toggleSort(c.key)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  {c.label}
                  {sort.col === c.key && <span style={{ marginLeft: 4 }}>{sort.dir === 'asc' ? '▲' : '▼'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0
              ? <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 20, color: '#8A95A3' }}>No data found</td></tr>
              : rows.map((row, i) => (
                  <tr key={i}>
                    {columns.map(c => (
                      <td key={c.key}>{c.render ? c.render(row[c.key], row) : row[c.key] as ReactNode}</td>
                    ))}
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', marginTop: 10 }}>
          <button className="btn-primary" style={{ padding: '5px 10px', fontSize: 11 }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ padding: '5px 10px', fontSize: 11, background: p === page ? '#0070AD' : '#fff', color: p === page ? '#fff' : '#0070AD', border: '1px solid #B5D4F4', borderRadius: 5, cursor: 'pointer' }}>
              {p}
            </button>
          ))}
          <button className="btn-primary" style={{ padding: '5px 10px', fontSize: 11 }} disabled={page === pages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}
    </div>
  )
}
