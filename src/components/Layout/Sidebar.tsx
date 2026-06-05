import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'

// ── Collapsible section ───────────────────────────────────────────────────────

interface CollapseProps {
  icon: string
  label: string
  badge?: string
  defaultOpen?: boolean
  depth?: number   // 0 = top-level, 1 = nested inside another Collapse
  children: ReactNode
}

function Collapse({ icon, label, badge, defaultOpen = false, depth = 0, children }: CollapseProps) {
  const [open, setOpen] = useState(defaultOpen)
  const extraPl = depth > 0 ? depth * 18 : 0

  return (
    <div>
      <button
        className="sb-collapse-btn"
        onClick={() => setOpen(o => !o)}
        style={extraPl ? { paddingLeft: 10 + extraPl } : undefined}
      >
        <i className="material-icons" style={{ fontSize: depth > 0 ? 16 : 18 }}>{icon}</i>
        <span style={{ flex: 1 }}>{label}</span>
        {badge && (
          <span style={{ fontSize: 8, fontWeight: 700, color: '#00AEEF', background: 'rgba(0,174,239,.15)', borderRadius: 4, padding: '1px 5px', letterSpacing: '.3px', marginRight: 4 }}>
            {badge}
          </span>
        )}
        <i className="material-icons" style={{ fontSize: 15, color: 'rgba(255,255,255,.3)', flexShrink: 0 }}>
          {open ? 'expand_more' : 'arrow_right'}
        </i>
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

// ── Active nav link ───────────────────────────────────────────────────────────

interface SubLinkProps {
  to: string
  icon: string
  label: string
  depth?: number
  end?: boolean
}

function SubLink({ to, icon, label, depth = 1, end = false }: SubLinkProps) {
  const pl = 14 + depth * 20
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `sb-sub-link${isActive ? ' active' : ''}`}
      style={{ paddingLeft: pl }}
    >
      <i className="material-icons" style={{ fontSize: depth > 1 ? 14 : 15, flexShrink: 0 }}>{icon}</i>
      <span style={{ flex: 1 }}>{label}</span>
    </NavLink>
  )
}

// ── Disabled / coming-soon item ───────────────────────────────────────────────

function ComingSoon({ icon, label, depth = 1 }: { icon: string; label: string; depth?: number }) {
  const pl = 14 + depth * 20
  return (
    <div className="sb-disabled-link" style={{ paddingLeft: pl }}>
      <i className="material-icons" style={{ fontSize: depth > 1 ? 14 : 15, flexShrink: 0 }}>{icon}</i>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ fontSize: 8, color: 'rgba(255,255,255,.2)', fontStyle: 'italic', whiteSpace: 'nowrap' }}>soon</span>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const isAdmin = user?.role === 'admin'

  // auto-open helpers
  const inDataLoad    = ['/import-report', '/realtime-extraction'].includes(pathname)
  const inAssessReports = ['/data-volume', '/user-table', '/table-fields'].some(p => pathname.startsWith(p))
  const inAssessment  = pathname.startsWith('/assessment') || inAssessReports

  return (
    <div className="cap-sidebar">

      {/* Logo */}
      <NavLink to="/" className="sb-logo" style={{ textDecoration: 'none' }}>
        <div className="sb-logo-box">
          <span style={{ fontSize: 10, fontWeight: 700, color: '#0070AD' }}>CAP</span>
        </div>
        <div className="sb-logo-text">
          <span className="sb-name">Definitiv</span>
          <span className="sb-sub">Database Assessment</span>
        </div>
      </NavLink>

      {/* User chip */}
      {user && (
        <div style={{
          margin: '8px 10px 2px', padding: '7px 10px', borderRadius: 7,
          background: isAdmin ? 'rgba(0,174,239,.12)' : 'rgba(255,255,255,.06)',
          border: `1px solid ${isAdmin ? 'rgba(0,174,239,.25)' : 'rgba(255,255,255,.08)'}`,
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <i className="material-icons" style={{ fontSize: 15, color: isAdmin ? '#00AEEF' : 'rgba(255,255,255,.5)' }}>
            {isAdmin ? 'admin_panel_settings' : 'person'}
          </i>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{user.username}</div>
            <div style={{ fontSize: 9.5, color: isAdmin ? '#00AEEF' : 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>
              {user.role}
            </div>
          </div>
        </div>
      )}

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="sb-section">Main</div>

      <NavLink to="/" end className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`} style={{ textDecoration: 'none' }}>
        <i className="material-icons">dashboard</i>
        Dashboard
      </NavLink>

      {/* Print Dashboard — context-aware, shown only on home */}
      {pathname === '/' && (
        <button
          className="sb-item sb-item-action"
          style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}
          onClick={() => window.print()}
        >
          <i className="material-icons">print</i>
          Print Dashboard
        </button>
      )}

      {/* ── Admin: Client Setup ──────────────────────────────── */}
      {isAdmin && (
        <>
          <div className="sb-section">Administration</div>

          <Collapse icon="manage_accounts" label="Client Setup" badge="ADMIN" defaultOpen={false}>
            <ComingSoon icon="person_add" label="Setup New Client" />
            <ComingSoon icon="folder_open" label="Setup Project" />
            <ComingSoon icon="list_alt" label="Client Details" />
            <ComingSoon icon="settings_accessibility" label="User Access" />
          </Collapse>

          <div className="sb-disabled-link" style={{ paddingLeft: 12 }}>
            <i className="material-icons" style={{ fontSize: 18, flexShrink: 0 }}>content_paste</i>
            <span style={{ flex: 1 }}>Estimation</span>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,.2)', fontStyle: 'italic' }}>soon</span>
          </div>
        </>
      )}

      {/* ── Data Load Utility ────────────────────────────────── */}
      <div className="sb-section">Data Load Utility</div>

      <Collapse icon="cloud_upload" label="Data Load Utility" defaultOpen={inDataLoad}>
        <SubLink to="/import-report"       icon="upload_file" label="Import Output Extract" />
        <SubLink to="/realtime-extraction" icon="cable"       label="Realtime Extraction" />
      </Collapse>

      {/* ── Assessment — only shown when on an assessment detail page ── */}
      {inAssessment && (
        <>
          <div className="sb-section">Assessment</div>

          <Collapse icon="analytics" label="Assessment Dashboard" defaultOpen>
            <SubLink to="/assessment/1" icon="home" label="Dashboard" />

            {/* Nested: Assessment Reports */}
            <Collapse
              icon="assignment"
              label="Assessment Reports"
              depth={1}
              defaultOpen={inAssessReports}
            >
              <SubLink to="/data-volume"  icon="storage"     label="Data Volume"         depth={2} />
              <SubLink to="/user-table"   icon="table_chart" label="User Tables"         depth={2} />
              <SubLink to="/table-fields" icon="view_list"   label="Table Field Listing" depth={2} />
              <ComingSoon icon="category"   label="Datatype"            depth={2} />
              <ComingSoon icon="visibility" label="Views"               depth={2} />
              <ComingSoon icon="code"       label="Stored Procedures"   depth={2} />
              <ComingSoon icon="functions"  label="Functions"           depth={2} />
              <ComingSoon icon="device_hub" label="Indexes"             depth={2} />
              <ComingSoon icon="flash_on"   label="Triggers"            depth={2} />
              <ComingSoon icon="share"      label="Entity Relationship" depth={2} />
              <ComingSoon icon="swap_horiz" label="IO Transaction"      depth={2} />
            </Collapse>

            {/* Nested: Estimation Summary */}
            <Collapse icon="summarize" label="Estimation Summary" depth={1} defaultOpen={false}>
              <ComingSoon icon="assignment" label="Summary"              depth={2} />
              <ComingSoon icon="view_list"  label="Detailed Estimations" depth={2} />
            </Collapse>
          </Collapse>
        </>
      )}

      {/* ── Analysis ─────────────────────────────────────────── */}
      <div className="sb-section">Analysis</div>

      <Collapse icon="bar_chart" label="Analysis" defaultOpen={false}>
        <ComingSoon icon="dns"        label="Technical Debt (Unused Objects)" />
        <ComingSoon icon="recommend"  label="Recommendations" />
      </Collapse>

      {/* ── CRUD Report ──────────────────────────────────────── */}
      <div className="sb-section">Reports</div>

      <Collapse icon="table_view" label="CRUD Report" defaultOpen={false}>
        <ComingSoon icon="view_list" label="CRUD Report (Core)" />
        <ComingSoon icon="grid_view" label="CRUD Report (Framework)" />
        <ComingSoon icon="business_center" label="SP Business Analysis" />
      </Collapse>

    </div>
  )
}
