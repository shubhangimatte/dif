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
}

export default function DataTable({ columns, data, pageSize = 25 }: DataTableProps) {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: '#6B7A8D' }}>
          Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
        </span>
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
