import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import { estimationSummaryService, EstimationData } from '../services/estimationSummaryService'

const patternColor = (p: string) => p === 'Automated' ? '#0F766E' : '#B45309'

export default function EstimationSummary() {
  const [data, setData] = useState<EstimationData | null>(null)

  useEffect(() => { estimationSummaryService.getData().then(setData) }, [])

  return (
    <Layout title="Estimation Summary">
      <PageTitle title="Estimation Summary" badge="Assessment" />

      <div className="cap-card">
        <div className="cap-card-header">
          <h4>Migration Effort Summary</h4>
          <p>Estimated person-days (PD) per object type with migration pattern and automation level</p>
        </div>
        <div className="cap-card-body" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table className="cap-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Object Type</th>
                  <th>Migration Pattern</th>
                  <th>Automation %</th>
                  <th style={{ textAlign: 'right' }}>Migration Efforts (PD)</th>
                </tr>
              </thead>
              <tbody>
                {(data?.rows ?? []).map((row, i) => {
                  const pc = patternColor(row.Migration_Pattern)
                  return (
                    <tr key={row.Object_Type} style={{ background: i % 2 === 0 ? '#F7FAFD' : '#fff' }}>
                      <td style={{ fontWeight: 600, color: '#12234F', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="material-icons" style={{ fontSize: 16, color: '#0070AD' }}>
                          {row.Object_Type === 'Tables'           ? 'table_chart'
                           : row.Object_Type === 'Triggers'       ? 'flash_on'
                           : row.Object_Type === 'Views'          ? 'visibility'
                           : row.Object_Type === 'Stored Procedure' ? 'code'
                           : 'functions'}
                        </i>
                        {row.Object_Type}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ background: pc + '18', color: pc, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                          {row.Migration_Pattern}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: '#0070AD' }}>
                        {row.Automation_Pct}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#1E293B', fontSize: 14 }}>
                        {row.Efforts_PD.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: '#EEF3F9' }}>
                  <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700, color: '#12234F', borderTop: '2px solid #0070AD', fontSize: 13 }}>
                    Total Migration Efforts
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#12234F', borderTop: '2px solid #0070AD', fontSize: 15 }}>
                    {(data?.total ?? 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
