import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { can } from "../config/permissions";

const css = `
  .dms-sidebar {
    width:210px; min-width:210px; height:100vh;
    background:#0B1820;
    display:flex; flex-direction:column;
    position:fixed; left:0; top:0; z-index:100;
    overflow-y:auto; overflow-x:hidden;
    font-family:'DM Sans',sans-serif;
  }
  .dms-sidebar::-webkit-scrollbar { width:0; }

  /* Brand */
  .sb-brand { padding:16px 14px 12px; border-bottom:1px solid rgba(255,255,255,0.06); }
  .sb-brand-row { display:flex; align-items:center; gap:9px; margin-bottom:8px; }
  .sb-logo-box { width:32px; height:32px; background:linear-gradient(135deg,#1d3461,#2563eb); border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:900; color:#f5c842; letter-spacing:-1px; flex-shrink:0; }
  .sb-brand-name { font-size:17px; font-weight:800; color:#f5c842; letter-spacing:1px; line-height:1; }
  .sb-brand-sub  { font-size:9px; color:#7a90b0; margin-top:1px; }
  .sb-badge { display:inline-flex; align-items:center; background:rgba(37,99,235,0.18); border:1px solid rgba(37,99,235,0.3); color:#60a5fa; font-size:9.5px; font-weight:600; padding:3px 8px; border-radius:20px; }

  /* User strip */
  .sb-user-strip { display:flex; align-items:center; gap:8px; padding:10px 14px; border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02); }
  .sb-user-avatar { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#2563eb,#3d8ef0); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#fff; flex-shrink:0; }
  .sb-user-name { font-size:12px; font-weight:600; color:#c8d8f0; line-height:1.2; }
  .sb-user-role { font-size:9px; font-weight:700; padding:1px 5px; border-radius:4px; display:inline-block; margin-top:1px; }

  /* Access strip */
  .sb-perm-strip { margin:8px 10px; padding:8px 10px; background:rgba(37,99,235,0.08); border:1px solid rgba(37,99,235,0.15); border-radius:7px; }
  .sb-perm-title { font-size:9px; font-weight:700; color:#3d6aaa; text-transform:uppercase; letter-spacing:.8px; margin-bottom:4px; }
  .sb-perm-item  { font-size:10px; color:#4a6a8a; display:flex; align-items:center; gap:5px; }

  /* Section label */
  .sb-section { font-size:9px; font-weight:700; letter-spacing:1.3px; color:#2e4560; text-transform:uppercase; padding:12px 14px 4px; }

  /* ── Parent item (clickable group header) ── */
  .sb-parent {
    display:flex; align-items:center; gap:8px;
    padding:7px 12px; margin:1px 7px; border-radius:7px;
    cursor:pointer; transition:all .15s;
    color:#6a8aaa; font-size:12.5px; font-weight:500;
    user-select:none; border:none; background:none;
    width:calc(100% - 14px); font-family:'DM Sans',sans-serif;
    text-align:left;
  }
  .sb-parent:hover { background:rgba(255,255,255,0.05); color:#b0c8e8; }
  .sb-parent.open  { color:#c8d8f0; }
  .sb-parent.has-active { color:#dceeff; font-weight:600; }
  .sb-parent.locked { opacity:.3; cursor:not-allowed; }

  .sb-ico  { width:17px; font-size:13px; text-align:center; flex-shrink:0; }
  .sb-lbl  { flex:1; }
  .sb-lock { font-size:9px; opacity:.6; }

  /* Chevron arrow */
  .sb-arrow {
    font-size:10px; color:#3a5070; flex-shrink:0;
    transition:transform .2s ease;
    display:inline-block;
  }
  .sb-arrow.open { transform:rotate(90deg); color:#60a5fa; }

  /* ── Sub items container ── */
  .sb-sub-list {
    overflow:hidden;
    max-height:0;
    transition:max-height .25s ease, opacity .2s ease;
    opacity:0;
  }
  .sb-sub-list.open {
    max-height:400px;
    opacity:1;
  }

  /* Sub item */
  .sb-sub {
    display:flex; align-items:center; gap:7px;
    padding:6px 12px 6px 36px; margin:0 7px 1px;
    border-radius:6px; cursor:pointer;
    text-decoration:none; transition:all .15s;
    color:#4a6080; font-size:12px; font-weight:500;
    position:relative;
  }
  .sb-sub::before {
    content:''; position:absolute; left:20px; top:50%;
    transform:translateY(-50%);
    width:5px; height:5px; border-radius:50%;
    background:currentColor; opacity:.4;
  }
  .sb-sub:hover { background:rgba(255,255,255,0.05); color:#8aaac8; text-decoration:none; }
  .sb-sub.active {
    background:rgba(37,99,235,0.14); color:#7eb8f0;
    font-weight:600; text-decoration:none;
  }
  .sb-sub.active::before { background:#3d8ef0; opacity:1; }
  .sb-sub.locked { opacity:.3; cursor:not-allowed; pointer-events:none; }

  /* Single nav item (no children) */
  .sb-item {
    display:flex; align-items:center; gap:8px;
    padding:7px 12px; margin:1px 7px; border-radius:7px;
    cursor:pointer; text-decoration:none; transition:all .15s;
    color:#6a8aaa; font-size:12.5px; font-weight:500; position:relative;
  }
  .sb-item:hover { background:rgba(255,255,255,0.05); color:#b0c8e8; text-decoration:none; }
  .sb-item.active { background:rgba(37,99,235,0.16); color:#dceeff; font-weight:600; }
  .sb-item.active::before { content:''; position:absolute; left:-7px; top:50%; transform:translateY(-50%); width:3px; height:55%; background:#3d8ef0; border-radius:0 2px 2px 0; }
  .sb-item.locked { opacity:.3; cursor:not-allowed; pointer-events:none; }
  .sb-dot { width:6px; height:6px; border-radius:50%; background:#3d8ef0; flex-shrink:0; }

  /* Footer */
  .sb-footer { padding:10px 7px; border-top:1px solid rgba(255,255,255,0.06); margin-top:auto; }
  .sb-logout { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:7px; cursor:pointer; color:#4a6080; font-size:12.5px; font-weight:500; transition:all .15s; background:none; border:none; width:100%; font-family:'DM Sans',sans-serif; }
  .sb-logout:hover { background:rgba(240,90,90,0.1); color:#f05a5a; }

  .sb-nav { flex:1; padding:6px 0 10px; }
`;

const ROLE_COLORS  = { Admin:"#f5c842", Manager:"#3d8ef0", Officer:"#2ec08b", DataEntry:"#f5933a", Viewer:"#9b6ef5" };
const ROLE_SUMMARY = { Admin:"Full system access", Manager:"Branch operations", Officer:"Upload & customers", DataEntry:"Upload only", Viewer:"Read-only access" };

export default function Sidebar({ onLogout, user }) {
  const { pathname } = useLocation();
  const role      = user?.role || "Viewer";
  const roleColor = ROLE_COLORS[role] || "#8a9ab8";
  const initials  = user?.fullName?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() || "U";

  const isActive = (to) => to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

  // Which group has an active child
  const hasActiveChild = (paths) => paths.some(p => isActive(p));

  // Expand state — auto-open group if its child is active
  const [open, setOpen] = useState(() => ({
    users:    hasActiveChild(["/users/list", "/users/add", "/user-groups"]),
    clients:  hasActiveChild(["/clients", "/add-client", "/client-master", "/branches"]),
    images:   hasActiveChild(["/customer-master", "/document-master", "/image-upload", "/image-view"]),
    reports:  hasActiveChild(["/upload-log", "/audit-log"]),
    settings: hasActiveChild(["/settings"]),
  }));

  const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Sub item ──
  const SubItem = ({ to, label, permission }) => {
    const allowed = can(role, permission);
    return (
      <Link
        to={allowed ? to : "#"}
        className={`sb-sub${isActive(to) ? " active" : ""}${!allowed ? " locked" : ""}`}
        title={!allowed ? "Access restricted for your role" : label}
      >
        {label}
        {!allowed && <span style={{fontSize:9,marginLeft:"auto",opacity:.5}}>🔒</span>}
      </Link>
    );
  };

  // ── Parent group button ──
  const ParentBtn = ({ groupKey, icon, label, permission, childPaths }) => {
    const allowed    = can(role, permission);
    const isOpen     = open[groupKey];
    const childActive = hasActiveChild(childPaths);
    return (
      <button
        className={`sb-parent${isOpen?" open":""}${childActive?" has-active":""}${!allowed?" locked":""}`}
        onClick={() => allowed && toggle(groupKey)}
        title={!allowed ? "Access restricted" : label}
      >
        <span className="sb-ico">{icon}</span>
        <span className="sb-lbl">{label}</span>
        {!allowed
          ? <span className="sb-lock">🔒</span>
          : <span className={`sb-arrow${isOpen?" open":""}`}>›</span>
        }
      </button>
    );
  };

  return (
    <>
      <style>{css}</style>
      <div className="dms-sidebar">

        {/* Brand */}
        <div className="sb-brand">
          <div className="sb-brand-row">
            <div className="sb-logo-box">DMS</div>
            <div>
              <div className="sb-brand-name">DMS</div>
              <div className="sb-brand-sub">Document Management System</div>
            </div>
          </div>
          <span className="sb-badge">AVS InSoTech v1.0</span>
        </div>

        {/* User strip */}
        {user && (
          <div className="sb-user-strip">
            <div className="sb-user-avatar">{initials}</div>
            <div>
              <div className="sb-user-name">{user.fullName}</div>
              <div className="sb-user-role" style={{background:`${roleColor}22`,color:roleColor,border:`1px solid ${roleColor}33`}}>
                {role}
              </div>
            </div>
          </div>
        )}

        {/* Access level */}
        <div className="sb-perm-strip">
          <div className="sb-perm-title">Access Level</div>
          <div className="sb-perm-item" style={{color:roleColor}}>
            <span>●</span> {ROLE_SUMMARY[role] || "Limited access"}
          </div>
        </div>

        {/* Navigation */}
        <div className="sb-nav">

          {/* ── Dashboard ── */}
          <div className="sb-section">Navigation</div>
          <Link to="/" className={`sb-item${isActive("/") ? " active" : ""}`}>
            <span className="sb-ico">⊞</span>
            <span className="sb-lbl">Dashboard</span>
            {isActive("/") && <span className="sb-dot"/>}
          </Link>

          {/* ── User Management ── */}
          <div className="sb-section">User Management</div>
          <ParentBtn
            groupKey="users" icon="👤" label="Users"
            permission="createEditUsers"
            childPaths={["/users/list","/users/add","/user-groups"]}
          />
          <div className={`sb-sub-list${open.users ? " open" : ""}`}>
            <SubItem to="/users/list"  label="User List"   permission="createEditUsers" />
            <SubItem to="/users/add"   label="Add User"    permission="createEditUsers" />
            <SubItem to="/user-groups" label="User Groups" permission="createEditUsers" />
          </div>

          {/* ── Client Master ── */}
          <div className="sb-section">Client Master</div>
          <ParentBtn
            groupKey="clients" icon="🏢" label="Clients"
            permission="clientBranchCRUD"
            childPaths={["/clients","/add-client","/branches"]}
          />
          <div className={`sb-sub-list${open.clients ? " open" : ""}`}>
            <SubItem to="/clients"    label="Client List"  permission="clientBranchCRUD" />
            <SubItem to="/add-client" label="Add Client"   permission="clientBranchCRUD" />
            <SubItem to="/branches"   label="Branches"     permission="clientBranchCRUD" />
          </div>

          {/* ── Image Module ── */}
          <div className="sb-section">Image Module</div>
          <ParentBtn
            groupKey="images" icon="🗂️" label="Documents"
            permission={null}
            childPaths={["/customer-master","/document-master","/image-upload","/image-view"]}
          />
          <div className={`sb-sub-list${open.images ? " open" : ""}`}>
            <SubItem to="/customer-master" label="Customer Master" permission="customerMaster" />
            <SubItem to="/document-master" label="Document Master" permission="documentMaster" />
            <SubItem to="/image-upload"    label="Image Upload"    permission="imageUpload"    />
            <SubItem to="/image-view"      label="Image View"      permission="imageView"      />
          </div>

          {/* ── Reports ── */}
          <div className="sb-section">Reports</div>
          <ParentBtn
            groupKey="reports" icon="📊" label="Reports"
            permission="viewReports"
            childPaths={["/upload-log","/audit-log"]}
          />
          <div className={`sb-sub-list${open.reports ? " open" : ""}`}>
            <SubItem to="/upload-log" label="Upload Log" permission="viewReports" />
            <SubItem to="/audit-log"  label="Audit Log"  permission="viewReports" />
          </div>

          {/* ── Settings ── */}
          <div className="sb-section">Settings</div>
          <ParentBtn
            groupKey="settings" icon="⚙️" label="Settings"
            permission={null}
            childPaths={["/settings","/profile"]}
          />
          <div className={`sb-sub-list${open.settings ? " open" : ""}`}>
            <SubItem to="/settings" label="System Settings" permission={null} />
            <SubItem to="/profile"  label="My Profile"      permission={null} />
          </div>

        </div>

        {/* Logout */}
        <div className="sb-footer">
          <button className="sb-logout" onClick={onLogout}>
            <span style={{fontSize:14}}>⏻</span>
            <span>Logout</span>
          </button>
        </div>

      </div>
    </>
  );
}
