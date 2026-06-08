import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import { clientService, Client, ClientCredentials, ClientProject } from '../services/clientService'

type ModalState =
  | { kind: 'cred';    clientId: number }
  | { kind: 'project'; clientId: number; clientName: string }
  | null

export default function ClientDetails() {
  const [clients, setClients]     = useState<Client[]>([])
  const [modal, setModal]         = useState<ModalState>(null)
  const [credData, setCredData]   = useState<ClientCredentials | null>(null)
  const [projData, setProjData]   = useState<ClientProject[]>([])
  const [modalLoad, setModalLoad] = useState(false)
  const [msg, setMsg]             = useState<{ type: 'success' | 'info'; text: string } | null>(null)

  useEffect(() => { clientService.getClients().then(setClients) }, [])

  const openCred = async (id: number) => {
    setModal({ kind: 'cred', clientId: id })
    setCredData(null)
    setModalLoad(true)
    try { setCredData(await clientService.getCredentials(id)) }
    finally { setModalLoad(false) }
  }

  const openProject = async (id: number, name: string) => {
    setModal({ kind: 'project', clientId: id, clientName: name })
    setProjData([])
    setModalLoad(true)
    try { setProjData(await clientService.getProjects(id)) }
    finally { setModalLoad(false) }
  }

  const toggleStatus = async (client: Client) => {
    const newStatus: 0 | 1 = client.is_active ? 0 : 1
    await clientService.changeStatus(client.id, newStatus)
    setClients(cs => cs.map(c => c.id === client.id ? { ...c, is_active: !c.is_active } : c))
    setMsg({ type: newStatus === 1 ? 'success' : 'info', text: `Client "${client.client_name}" has been ${newStatus === 1 ? 'enabled' : 'disabled'}.` })
  }

  const closeModal = () => setModal(null)

  return (
    <Layout title="Client Details">
      <PageTitle title="Client Details" badge="Admin" />

      {msg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 8, marginBottom: 14,
          background: msg.type === 'success' ? '#D1FAE5' : '#E0F2FE',
          border: `1px solid ${msg.type === 'success' ? '#6EE7B7' : '#7DD3FC'}`,
          color: msg.type === 'success' ? '#065F46' : '#0C4A6E',
        }}>
          <i className="material-icons" style={{ fontSize: 18 }}>{msg.type === 'success' ? 'check_circle' : 'info'}</i>
          <span style={{ flex: 1, fontSize: 13 }}>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <i className="material-icons" style={{ fontSize: 16 }}>close</i>
          </button>
        </div>
      )}

      <div className="cap-card">
        <div className="cap-card-header"><h4>Client Details</h4></div>
        <div className="cap-card-body" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table className="cap-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Client Name</th>
                  <th>Opportunity</th>
                  <th>Account PoC</th>
                  <th style={{ textAlign: 'center' }}>Project Details</th>
                  <th style={{ textAlign: 'center' }}>Credentials</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>Records not found</td></tr>
                ) : clients.map((c, i) => (
                  <tr key={c.id} style={{ background: i % 2 === 0 ? '#F7FAFD' : '#fff' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className="material-icons" style={{ fontSize: 14, color: '#0070AD' }}>business</i>
                        </div>
                        <span style={{ fontWeight: 600, color: '#12234F' }}>{c.client_name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#475569' }}>{c.client_opportunity}</td>
                    <td style={{ color: '#475569' }}>{c.account_poc}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => openProject(c.id, c.client_name)}
                        style={{ background: '#0070AD', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >...</button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => openCred(c.id)}
                        style={{ background: 'linear-gradient(135deg,#12234F,#0070AD)', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >...</button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: c.is_active ? '#D1FAE5' : '#F1F5F9',
                        color: c.is_active ? '#065F46' : '#64748B',
                      }}>
                        {c.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          disabled={!c.is_active}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '4px 10px', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: c.is_active ? 'pointer' : 'not-allowed',
                            background: c.is_active ? '#0070AD' : '#E2E8F0', color: c.is_active ? '#fff' : '#94A3B8',
                          }}
                        >
                          <i className="material-icons" style={{ fontSize: 13 }}>edit</i> Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(c)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '4px 10px', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            background: c.is_active ? '#FEE2E2' : '#D1FAE5', color: c.is_active ? '#991B1B' : '#065F46',
                          }}
                        >
                          <i className="material-icons" style={{ fontSize: 13 }}>{c.is_active ? 'block' : 'check_circle'}</i>
                          {c.is_active ? 'DISABLE' : 'ENABLE'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Credentials Modal ── */}
      {modal?.kind === 'cred' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 560, boxShadow: '0 20px 60px rgba(0,0,0,.25)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg,#12234F,#0070AD)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="material-icons" style={{ color: '#fff', fontSize: 20 }}>lock</i>
              <h5 style={{ color: '#fff', margin: 0, fontSize: 14, fontWeight: 700 }}>Client Credentials</h5>
              <button onClick={closeModal} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', borderRadius: 6, cursor: 'pointer', padding: '2px 8px', display: 'flex', alignItems: 'center' }}>
                <i className="material-icons" style={{ fontSize: 18 }}>close</i>
              </button>
            </div>
            <div style={{ padding: 20 }}>
              {modalLoad ? (
                <div style={{ textAlign: 'center', padding: 32, color: '#0070AD' }}>
                  <i className="material-icons" style={{ fontSize: 32 }}>refresh</i>
                  <div style={{ marginTop: 6 }}>Loading...</div>
                </div>
              ) : credData && (
                <table className="cap-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Client PoC</th>
                      <th style={{ textAlign: 'left' }}>Primary</th>
                      <th style={{ textAlign: 'left' }}>Secondary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600, color: '#12234F' }}>{credData.client_poc}</td>
                      <td>
                        <div style={{ fontSize: 12, color: '#64748B' }}>Username</div>
                        <div style={{ fontWeight: 600, color: '#12234F' }}>{credData.primary_username}</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 6 }}>Password</div>
                        <div style={{ fontWeight: 600, color: '#12234F', letterSpacing: 2 }}>{credData.primary_password}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12, color: '#64748B' }}>Username</div>
                        <div style={{ fontWeight: 600, color: '#12234F' }}>{credData.secondary_username}</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 6 }}>Password</div>
                        <div style={{ fontWeight: 600, color: '#12234F', letterSpacing: 2 }}>{credData.secondary_password}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            <div style={{ padding: '10px 20px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={closeModal} style={{ padding: '6px 20px', background: '#12234F', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Project Details Modal ── */}
      {modal?.kind === 'project' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 640, boxShadow: '0 20px 60px rgba(0,0,0,.25)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg,#12234F,#0070AD)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="material-icons" style={{ color: '#fff', fontSize: 20 }}>folder_open</i>
              <h5 style={{ color: '#fff', margin: 0, fontSize: 14, fontWeight: 700 }}>Project Details</h5>
              <button onClick={closeModal} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', borderRadius: 6, cursor: 'pointer', padding: '2px 8px', display: 'flex', alignItems: 'center' }}>
                <i className="material-icons" style={{ fontSize: 18 }}>close</i>
              </button>
            </div>
            <div style={{ padding: 20 }}>
              {modalLoad ? (
                <div style={{ textAlign: 'center', padding: 32, color: '#0070AD' }}>
                  <i className="material-icons" style={{ fontSize: 32 }}>refresh</i>
                  <div style={{ marginTop: 6 }}>Loading...</div>
                </div>
              ) : (
                <table className="cap-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Client Name</th>
                      <th style={{ textAlign: 'left' }}>Project Name</th>
                      <th style={{ textAlign: 'left' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projData.length === 0 ? (
                      <tr><td colSpan={3} style={{ textAlign: 'center', padding: 24, color: '#94A3B8' }}>Data not found</td></tr>
                    ) : projData.map((p, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#F7FAFD' : '#fff' }}>
                        <td style={{ fontWeight: 600, color: '#12234F' }}>{p.client_name}</td>
                        <td style={{ color: '#0070AD', fontWeight: 600 }}>{p.project_name}</td>
                        <td style={{ color: '#475569' }}>{p.project_description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div style={{ padding: '10px 20px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={closeModal} style={{ padding: '6px 20px', background: '#12234F', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
