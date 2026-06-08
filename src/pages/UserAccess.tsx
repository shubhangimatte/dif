import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import { userAccessService, AccessClient } from '../services/userAccessService'

type Tab = 'assessment' | 'detail' | 'validation'

interface MenuItem  { name: string; label: string; disabled?: boolean }
interface MenuGroup { title: string; icon: string; items: MenuItem[] }

// ── Tab 1: Assessment Menu ──────────────────────────────────────────────────
const ASSESS_GROUPS: MenuGroup[] = [
  { title: 'Data Load Utility',  icon: 'cloud_upload', items: [
    { name: 'Importdboutput',     label: 'Import Output Extract' },
    { name: 'RealtimeExtraction', label: 'Realtime Extraction'   },
  ]},
  { title: 'Analysis', icon: 'bar_chart', items: [
    { name: 'TechnicalDebt', label: 'Technical Debt (Unused Objects)' },
  ]},
  { title: 'CRUD', icon: 'table_view', items: [
    { name: 'Crudreport',           label: 'CRUD Report (Core)'      },
    { name: 'CrudReportFramework',  label: 'CRUD Report (Framework)' },
    { name: 'CrudreportSP',         label: 'SP Business Analysis'    },
  ]},
]
const ASSESS_STANDALONE: MenuItem[] = [
  { name: 'Dashboard',                 label: 'Dashboard',                  disabled: true },
  { name: 'business_logic_extraction', label: 'Business Logic Extraction'   },
]

// ── Tab 2: Detail Assessment Menu ───────────────────────────────────────────
const DETAIL_GROUPS: MenuGroup[] = [
  { title: 'Assessment Reports', icon: 'assignment', items: [
    { name: 'DataVolume',          label: 'Data Volume'                       },
    { name: 'UserTable',           label: 'User Tables'                       },
    { name: 'TableFieldListing',   label: 'Table Field Listing'               },
    { name: 'Views',               label: 'Views'                             },
    { name: 'Datatype',            label: 'Datatype'                          },
    { name: 'StoredProcedures',    label: 'Stored Procedures'                 },
    { name: 'spchart',             label: 'Stored Procedure Chart'            },
    { name: 'Functions',           label: 'Functions'                         },
    { name: 'Indexes',             label: 'Indexes'                           },
    { name: 'Triggers',            label: 'Triggers'                          },
    { name: 'EntityRelationship',  label: 'Entity Relationship'               },
    { name: 'chart',               label: 'Entity Relationship Chart'         },
    { name: 'IOTransaction',       label: 'Input Output Transaction Report'   },
    { name: 'Techoverheads',       label: 'Technical Overheads'               },
  ]},
  { title: 'Estimation Summary', icon: 'summarize', items: [
    { name: 'Summary',             label: 'Summary'              },
    { name: 'DetailedEstimations', label: 'Detailed Estimations' },
  ]},
]
const DETAIL_STANDALONE: MenuItem[] = [
  { name: 'Assdashboard', label: 'Dashboard', disabled: true },
]

// ── Tab 3: Validation Menu ───────────────────────────────────────────────────
const VALID_GROUPS: MenuGroup[] = [
  { title: 'Setup Migration', icon: 'settings', items: [
    { name: 'Setupdbinstance',     label: 'Setup DB Instance'          },
    { name: 'Importdboutputreport',label: 'Import Output Extract'      },
    { name: 'MigrationProject',    label: 'Create Validation Project'  },
    { name: 'ConfigConnView',      label: 'Configure Connection'       },
  ]},
  { title: 'Schema Validation', icon: 'fact_check', items: [
    { name: 'schemaValidation',    label: 'Schema Validation'          },
    { name: 'tablemapping',        label: 'Table Mapping'              },
    { name: 'FieldMapping',        label: 'Field Mapping'              },
    { name: 'RealtimeValidation',  label: 'Real Time Extraction'       },
    { name: 'comparecount',        label: 'Schema Comparison'          },
    { name: 'structureComparison', label: 'Table Structure Comparison' },
    { name: 'ScheduleValidation',  label: 'Schedule Validation'        },
  ]},
  { title: 'Data Validation', icon: 'compare_arrows', items: [
    { name: 'datacomparison',    label: 'Table Data Comparison' },
    { name: 'datavalidation',    label: 'Table Validation'      },
    { name: 'SqlValidation',     label: 'SQL Validation'        },
    { name: 'sqlbulkvalidation', label: 'Sql Validation Bulk'   },
  ]},
  { title: 'NoSQL Migration and Validation', icon: 'storage', items: [
    { name: 'Mongovalidation',          label: 'NoSQL Table Structure'       },
    { name: 'realtimedata',             label: 'Realtime Data Migration'     },
    { name: 'datavalidation_mongo',     label: 'NoSQL Collection Validation' },
    { name: 'MongoScheduleValidation',  label: 'Change Schedule Job'         },
  ]},
]
const VALID_STANDALONE: MenuItem[] = [
  { name: 'validation_Dashboard', label: 'Dashboard', disabled: true },
]

// ── Collapsible group component ──────────────────────────────────────────────
function MenuSection({ group, checked, toggle }: { group: MenuGroup; checked: Set<string>; toggle: (n: string) => void }) {
  const [open, setOpen] = useState(true)
  const allChecked = group.items.every(i => checked.has(i.name))
  const toggleAll  = () => group.items.forEach(i => { if (!i.disabled) toggle(i.name) })
  return (
    <div style={{ marginBottom: 8, border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: '#F0F4F8', cursor: 'pointer', userSelect: 'none' }}
      >
        <input type="checkbox" checked={allChecked} onChange={toggleAll}
          onClick={e => e.stopPropagation()}
          style={{ width: 14, height: 14, cursor: 'pointer', accentColor: '#0070AD' }} />
        <i className="material-icons" style={{ fontSize: 15, color: '#0070AD' }}>{group.icon}</i>
        <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: '#12234F' }}>{group.title}</span>
        <i className="material-icons" style={{ fontSize: 16, color: '#94A3B8' }}>{open ? 'expand_more' : 'arrow_right'}</i>
      </div>
      {open && (
        <div style={{ padding: '8px 14px 10px 40px', display: 'flex', flexDirection: 'column', gap: 6, background: '#fff' }}>
          {group.items.map(item => (
            <label key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: item.disabled ? 'default' : 'pointer' }}>
              <input
                type="checkbox"
                checked={checked.has(item.name)}
                disabled={item.disabled}
                onChange={() => { if (!item.disabled) toggle(item.name) }}
                style={{ width: 14, height: 14, accentColor: '#0070AD', cursor: item.disabled ? 'default' : 'pointer' }}
              />
              <span style={{ fontSize: 12.5, color: item.disabled ? '#94A3B8' : '#334155' }}>{item.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function StandaloneItem({ item, checked, toggle }: { item: MenuItem; checked: Set<string>; toggle: (n: string) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: '#F7FAFD', borderRadius: 8, marginBottom: 8, cursor: item.disabled ? 'default' : 'pointer', border: '1px solid #EEF3F9' }}>
      <input
        type="checkbox"
        checked={item.disabled ? true : checked.has(item.name)}
        disabled={item.disabled}
        onChange={() => { if (!item.disabled) toggle(item.name) }}
        style={{ width: 14, height: 14, accentColor: '#0070AD' }}
      />
      <i className="material-icons" style={{ fontSize: 14, color: '#0070AD' }}>dashboard</i>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#12234F' }}>{item.label}</span>
      {item.disabled && <span style={{ fontSize: 9, color: '#94A3B8', marginLeft: 4, fontStyle: 'italic' }}>always on</span>}
    </label>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function UserAccess() {
  const [clients, setClients]   = useState<AccessClient[]>([])
  const [selected, setSelected] = useState<number>(0)
  const [tab, setTab]           = useState<Tab>('assessment')
  const [checked, setChecked]   = useState<Set<string>>(new Set())
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState<string | null>(null)

  useEffect(() => { userAccessService.getClients().then(setClients) }, [])

  const handleClientChange = async (id: number) => {
    setSelected(id)
    if (id) {
      const pages = await userAccessService.getAccess(id)
      setChecked(new Set(pages))
    } else {
      setChecked(new Set())
    }
  }

  const toggle = (name: string) => setChecked(prev => {
    const next = new Set(prev)
    next.has(name) ? next.delete(name) : next.add(name)
    return next
  })

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await userAccessService.saveAccess(selected, [...checked])
      setMsg('Access permissions saved successfully.')
    } catch { setMsg('Failed to save. Please try again.') }
    finally { setSaving(false) }
  }

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'assessment', label: 'Assessment Menu',         icon: 'dashboard'    },
    { key: 'detail',     label: 'Detail Assessment Menu',  icon: 'analytics'    },
    { key: 'validation', label: 'Validation Menu',         icon: 'fact_check'   },
  ]

  return (
    <Layout title="User Access">
      <PageTitle title="User Access" badge="Admin" />

      {msg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 8, marginBottom: 14, background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46' }}>
          <i className="material-icons" style={{ fontSize: 18 }}>check_circle</i>
          <span style={{ flex: 1, fontSize: 13 }}>{msg}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <i className="material-icons" style={{ fontSize: 16 }}>close</i>
          </button>
        </div>
      )}

      <div className="cap-card">
        <div className="cap-card-header"><h4>User Access Management</h4><p>Configure page-level access per client</p></div>
        <div className="cap-card-body">

          {/* Client selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '14px 16px', background: '#F7FAFD', borderRadius: 10, border: '1px solid #DDE8F4' }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#12234F', whiteSpace: 'nowrap' }}>
              <i className="material-icons" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4, color: '#0070AD' }}>storage</i>
              Select Client:
            </label>
            <select
              className="form-control"
              style={{ maxWidth: 320 }}
              value={selected}
              onChange={e => handleClientChange(Number(e.target.value))}
            >
              <option value={0} disabled>Select Client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.client_name}</option>)}
            </select>
          </div>

          {selected > 0 && (
            <>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '2px solid #DDE8F4', marginBottom: 16, gap: 0 }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px',
                      border: 'none', borderBottom: tab === t.key ? '2px solid #0070AD' : '2px solid transparent',
                      marginBottom: -2, background: 'none', cursor: 'pointer',
                      fontSize: 12.5, fontWeight: tab === t.key ? 700 : 500,
                      color: tab === t.key ? '#0070AD' : '#64748B',
                    }}>
                    <i className="material-icons" style={{ fontSize: 15 }}>{t.icon}</i>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div style={{ maxWidth: 640 }}>
                {tab === 'assessment' && (
                  <>
                    {ASSESS_STANDALONE.map(i => <StandaloneItem key={i.name} item={i} checked={checked} toggle={toggle} />)}
                    {ASSESS_GROUPS.map(g => <MenuSection key={g.title} group={g} checked={checked} toggle={toggle} />)}
                    <StandaloneItem item={{ name: 'business_logic_extraction', label: 'Business Logic Extraction' }} checked={checked} toggle={toggle} />
                  </>
                )}
                {tab === 'detail' && (
                  <>
                    {DETAIL_STANDALONE.map(i => <StandaloneItem key={i.name} item={i} checked={checked} toggle={toggle} />)}
                    {DETAIL_GROUPS.map(g => <MenuSection key={g.title} group={g} checked={checked} toggle={toggle} />)}
                  </>
                )}
                {tab === 'validation' && (
                  <>
                    {VALID_STANDALONE.map(i => <StandaloneItem key={i.name} item={i} checked={checked} toggle={toggle} />)}
                    {VALID_GROUPS.map(g => <MenuSection key={g.title} group={g} checked={checked} toggle={toggle} />)}
                  </>
                )}
              </div>

              {/* Save button */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #EEF3F9' }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 24px', background: 'linear-gradient(135deg,#12234F,#0070AD)', color: '#fff', border: 'none', borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  <i className="material-icons" style={{ fontSize: 16 }}>{saving ? 'hourglass_top' : 'save'}</i>
                  {saving ? 'Saving...' : 'Add / Save Access'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
