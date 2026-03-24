import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Navbar  from "./components/Navbar";
import Login   from "./pages/Login";
import { can } from "./config/permissions";

import Dashboard      from "./pages/Dashboard";
import ClientList     from "./pages/ClientList";

import ClientMaster   from "./pages/ClientMaster";
import Branches       from "./pages/Branches";
import CustomerMaster from "./pages/Customermaster";
import DocumentMaster from "./pages/DocumentMaster";
import ImageUpload    from "./pages/ImageUpload";
import ImageView      from "./pages/ImageView";
import UserList       from "./pages/UserList";
import UserGroups     from "./pages/UserGroups";
import UploadLog      from "./pages/Uploadlog";
import AuditLog       from "./pages/Auditlog";

// Session timeout = 8 hours (matches JWT expiry)
const SESSION_TIMEOUT_MS  = 8 * 60 * 60 * 1000;
// Warning shown 5 minutes before expiry
const SESSION_WARNING_MS  = 5 * 60 * 1000;

const appCss = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg-main:#eef2f8;--bg-card:#ffffff;--bg-input:#f0f4fb;--bg-modal:#ffffff;
    --border:#e2eaf4;--border-light:#c8d8ec;
    --tp:#0f1c33;--ts:#4a5e80;--tm:#8a9ab8;
    --gold:#b8860b;--blue:#2563eb;--green:#16a34a;
    --red:#dc2626;--orange:#c2410c;--purple:#7c3aed;
    --font:'DM Sans',sans-serif;--mono:'JetBrains Mono',monospace;
    --radius:10px;--shadow:0 2px 12px rgba(15,28,51,0.08);
  }
  html,body,#root{height:100%;font-family:'DM Sans',sans-serif;}
  body{background:#eef2f8;color:#0f1c33;}
  .dms-app{display:flex;min-height:100vh;}
  .dms-main{margin-left:210px;flex:1;display:flex;flex-direction:column;min-height:100vh;background:#eef2f8;}
  .dms-content{flex:1;overflow-y:auto;}

  /* ── Session Warning Banner ── */
  .session-warning-banner {
    position:fixed; top:0; left:0; right:0; z-index:9999;
    background:linear-gradient(90deg,#c2410c,#dc2626);
    color:#fff; padding:10px 20px;
    display:flex; align-items:center; justify-content:space-between;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
    box-shadow:0 4px 20px rgba(220,38,38,0.4);
    animation:slideDown .3s ease;
  }
  @keyframes slideDown{from{transform:translateY(-100%);}to{transform:translateY(0);}}
  .swb-left{display:flex;align-items:center;gap:10px;}
  .swb-timer{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;background:rgba(0,0,0,0.2);padding:3px 10px;border-radius:6px;}
  .swb-btn{padding:6px 16px;border-radius:7px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;}
  .swb-extend{background:#fff;color:#dc2626;}
  .swb-extend:hover{background:#fef2f2;}
  .swb-logout{background:rgba(0,0,0,0.2);color:#fff;margin-left:8px;}
  .swb-logout:hover{background:rgba(0,0,0,0.35);}

  /* ── Session Expired Modal ── */
  .session-expired-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:10000;}
  .session-expired-card{background:#fff;border-radius:16px;padding:40px;text-align:center;max-width:400px;width:100%;box-shadow:0 24px 80px rgba(0,0,0,0.3);}
  .sec-icon{font-size:52px;margin-bottom:16px;}
  .sec-title{font-size:20px;font-weight:800;color:#0f1c33;margin-bottom:8px;}
  .sec-sub{font-size:13px;color:#8a9ab8;margin-bottom:24px;line-height:1.6;}
  .sec-btn{width:100%;padding:13px;background:#2563eb;color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;}
  .sec-btn:hover{filter:brightness(1.08);}

  /* ── Access Denied ── */
  .access-denied{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:70vh;text-align:center;padding:40px;}
  .ad-icon{font-size:72px;margin-bottom:20px;}
  .ad-title{font-size:24px;font-weight:800;color:#0f1c33;margin-bottom:8px;}
  .ad-sub{font-size:14px;color:#8a9ab8;margin-bottom:20px;line-height:1.7;max-width:380px;}
  .ad-role-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 16px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:20px;}
  .ad-allowed{background:#f8faff;border:1px solid #e2eaf4;border-radius:10px;padding:16px 20px;margin-bottom:24px;text-align:left;max-width:360px;width:100%;}
  .ad-allowed-title{font-size:11px;font-weight:700;color:#8a9ab8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;}
  .ad-allowed-item{display:flex;align-items:center;gap:8px;font-size:12px;color:#4a5e80;padding:4px 0;}
  .ad-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;border-radius:8px;font-size:13px;font-weight:700;background:#2563eb;color:#fff;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;}
  .ad-btn:hover{filter:brightness(1.08);transform:translateY(-1px);}

  /* Light theme overrides */
  .dms-content .page{background:#eef2f8!important;}
  .dms-content .stat-card,.dms-content .table-card,.dms-content .card,
  .dms-content .search-card,.dms-content .upload-layout .card,
  .dms-content .form-card{background:#ffffff!important;border-color:#e2eaf4!important;box-shadow:0 2px 12px rgba(15,28,51,0.06)!important;}
  .dms-content .data-table th{background:#f5f8ff!important;color:#8a9ab8!important;border-color:#e2eaf4!important;}
  .dms-content .data-table td{border-color:#f0f4fb!important;color:#4a5e80!important;}
  .dms-content .data-table td.pr,.dms-content .data-table td.primary{color:#0f1c33!important;}
  .dms-content .data-table tr:hover td{background:#f5f8ff!important;color:#0f1c33!important;}
  .dms-content .page-title{color:#0f1c33!important;}
  .dms-content .page-subtitle{color:#8a9ab8!important;}
  .dms-content .table-header,.dms-content .tcard-head,.dms-content .card-head{border-color:#e2eaf4!important;}
  .dms-content .table-title,.dms-content .tc-title,.dms-content .card-title{color:#0f1c33!important;}
  .dms-content .table-sub,.dms-content .tc-sub,.dms-content .card-sub{color:#8a9ab8!important;}
  .dms-content .filter-input,.dms-content .filter-select,.dms-content .fsel,
  .dms-content .finput,.dms-content .fi,.dms-content .fs,
  .dms-content .form-input,.dms-content .form-select,.dms-content .form-textarea,
  .dms-content .remarks-area,.dms-content .ftarea{background:#f0f4fb!important;border-color:#d8e4f0!important;color:#0f1c33!important;}
  .dms-content .filter-input::placeholder,.dms-content .form-input::placeholder,
  .dms-content .finput::placeholder,.dms-content .fi::placeholder,
  .dms-content .remarks-area::placeholder{color:#8a9ab8!important;}
  .dms-content .filter-input:focus,.dms-content .filter-select:focus,
  .dms-content .fsel:focus,.dms-content .finput:focus,
  .dms-content .form-input:focus,.dms-content .form-select:focus{border-color:#2563eb!important;}
  .dms-content .stat-val{color:#0f1c33!important;}
  .dms-content .stat-label{color:#4a5e80!important;}
  .dms-content .stat-trend{color:#16a34a!important;}
  .dms-content .pagination{border-color:#e2eaf4!important;}
  .dms-content .page-info{color:#8a9ab8!important;}
  .dms-content .page-btn{background:#f0f4fb!important;border-color:#d8e4f0!important;color:#4a5e80!important;}
  .dms-content .page-btn.active,.dms-content .page-btn:hover{background:#2563eb!important;border-color:#2563eb!important;color:#fff!important;}
  .dms-content .form-label,.dms-content .flabel{color:#4a5e80!important;}
  .dms-content .form-hint,.dms-content .fhint{color:#8a9ab8!important;}
  .dms-content .form-section-title,.dms-content .fsect{color:#2563eb!important;border-color:#e2eaf4!important;}
  .dms-content .form-divider,.dms-content .fdiv{border-color:#e2eaf4!important;}
  .dms-content .mono{color:#2563eb!important;background:#eff4ff!important;}
  .dms-content .empty-state{color:#8a9ab8!important;}
  .dms-content .btn-outline{background:#ffffff!important;border-color:#d8e4f0!important;color:#4a5e80!important;}
  .dms-content .btn-outline:hover{border-color:#2563eb!important;color:#2563eb!important;}
  .dms-content .drop-zone{border-color:#d8e4f0!important;background:#f5f8ff!important;}
  .dms-content .drop-zone:hover,.dms-content .drop-zone.dragging{border-color:#2563eb!important;background:#eff4ff!important;}
  .dms-content .dz-title{color:#0f1c33!important;}
  .dms-content .dz-sub{color:#8a9ab8!important;}
  .dms-content .file-item{background:#f5f8ff!important;border-color:#e2eaf4!important;}
  .dms-content .file-item.valid{border-color:#16a34a44!important;}
  .dms-content .file-item.invalid{border-color:#dc262644!important;background:#fff5f5!important;}
  .dms-content .file-name{color:#0f1c33!important;}
  .dms-content .file-meta{color:#8a9ab8!important;}
  .dms-content .doctype-info{background:#eff4ff!important;border-color:#c7d9f8!important;}
  .dms-content .di-label{color:#8a9ab8!important;}
  .dms-content .di-val{color:#0f1c33!important;}
  .dms-content .session-bar{background:#f0f4fb!important;border-color:#d8e4f0!important;color:#4a5e80!important;}
  .dms-content .link-chip,.dms-content .client-chip{background:#f0f4fb!important;border-color:#d8e4f0!important;}
  .dms-content .chip-name{color:#4a5e80!important;}
  .modal-overlay{z-index:500!important;}
  .modal{background:#ffffff!important;border-color:#e2eaf4!important;}
  .modal-head{background:#ffffff!important;border-color:#e2eaf4!important;}
  .modal-title{color:#0f1c33!important;}
  .modal-sub{color:#8a9ab8!important;}
  .modal-footer{background:#ffffff!important;border-color:#e2eaf4!important;}
  .close-btn{background:#f0f4fb!important;color:#4a5e80!important;}
  .close-btn:hover{background:#fef2f2!important;color:#dc2626!important;}
  .toggle{background:#d8e4f0!important;}
  .toggle.on{background:#16a34a!important;}
  .toggle-label.off,.toggle-lbl.off{color:#8a9ab8!important;}
  .fmt-check-btn{background:#f0f4fb!important;border-color:#d8e4f0!important;color:#4a5e80!important;}
  .info-box{background:#eff4ff!important;border-color:#c7d9f8!important;color:#2563eb!important;}
  .perm-grid{border-color:#e2eaf4!important;}
  .perm-head{background:#f5f8ff!important;border-color:#e2eaf4!important;}
  .perm-row-label{color:#4a5e80!important;border-color:#e2eaf4!important;}
  .perm-cell{border-color:#e2eaf4!important;}
  .reset-info{background:#fffbeb!important;border-color:#fde68a!important;color:#92400e!important;}
  .dms-content::-webkit-scrollbar{width:6px;}
  .dms-content::-webkit-scrollbar-track{background:transparent;}
  .dms-content::-webkit-scrollbar-thumb{background:#d8e4f0;border-radius:3px;}
`;

const ROLE_COLORS = {
  Admin:"#b8860b", Manager:"#2563eb", Officer:"#16a34a",
  DataEntry:"#c2410c", Viewer:"#7c3aed",
};

const ROLE_ALLOWED_PAGES = {
  Admin:     ["Dashboard","Client Master","Branches","Customer Master","Document Master","Image Upload","Image View","User Management","User Groups","Reports"],
  Manager:   ["Dashboard","Customer Master","Document Master","Image Upload","Image View","Reports"],
  Officer:   ["Dashboard","Customer Master","Image Upload","Image View","Reports"],
  DataEntry: ["Dashboard","Image Upload"],
  Viewer:    ["Dashboard","Image View","Reports"],
};

// ── Access Denied ──
function AccessDenied({ role }) {
  const color   = ROLE_COLORS[role] || "#8a9ab8";
  const allowed = ROLE_ALLOWED_PAGES[role] || [];
  return (
    <div className="access-denied">
      <div className="ad-icon">🔒</div>
      <div className="ad-title">Access Restricted</div>
      <div className="ad-sub">You don't have permission to view this page.<br/>Contact your Administrator to request access.</div>
      <div className="ad-role-badge" style={{ background:`${color}15`, color, border:`1px solid ${color}33` }}>
        👤 Logged in as: <b>{role}</b>
      </div>
      <div className="ad-allowed">
        <div className="ad-allowed-title">Pages you can access</div>
        {allowed.map(p => (
          <div key={p} className="ad-allowed-item">
            <span style={{ color:"#16a34a", fontWeight:700 }}>✓</span> {p}
          </div>
        ))}
      </div>
      <button className="ad-btn" onClick={() => window.history.back()}>← Go Back</button>
    </div>
  );
}

function Guard({ role, permission, children }) {
  return can(role, permission) ? children : <AccessDenied role={role} />;
}

function getStoredUser() {
  try { const u = localStorage.getItem("dms_user"); return u ? JSON.parse(u) : null; }
  catch { return null; }
}

function getLoginTime() {
  try { return parseInt(localStorage.getItem("dms_login_time") || "0"); }
  catch { return 0; }
}

// ── Session Warning Banner ──
function SessionWarning({ remaining, onExtend, onLogout }) {
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const timeStr = `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
  return (
    <div className="session-warning-banner">
      <div className="swb-left">
        <span>⚠️</span>
        <span>Your session expires in</span>
        <span className="swb-timer">{timeStr}</span>
      </div>
      <div>
        <button className="swb-btn swb-extend" onClick={onExtend}>🔄 Extend Session</button>
        <button className="swb-btn swb-logout" onClick={onLogout}>Logout Now</button>
      </div>
    </div>
  );
}

// ── Session Expired Modal ──
function SessionExpiredModal({ onLogin }) {
  return (
    <div className="session-expired-overlay">
      <div className="session-expired-card">
        <div className="sec-icon">⏰</div>
        <div className="sec-title">Session Expired</div>
        <div className="sec-sub">
          Your session has expired for security reasons.<br/>
          Please log in again to continue.
        </div>
        <button className="sec-btn" onClick={onLogin}>🔐 Login Again</button>
      </div>
    </div>
  );
}

export default function App() {
  const { dark, toggleTheme } = useTheme();
  const [user,           setUser]           = useState(getStoredUser);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showWarning,    setShowWarning]    = useState(false);
  const [remaining,      setRemaining]      = useState(SESSION_TIMEOUT_MS);

  // ── Logout helper ──
  const doLogout = useCallback((expired = false) => {
    const u = JSON.parse(localStorage.getItem("dms_user") || "{}");
    fetch("http://localhost:5000/api/auth/logout", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ username: u.username }),
    }).catch(() => {});
    localStorage.removeItem("dms_token");
    localStorage.removeItem("dms_user");
    localStorage.removeItem("dms_login_time");
    setUser(null);
    setShowWarning(false);
    if (expired) setSessionExpired(true);
  }, []);

  // ── Session timer ──
  useEffect(() => {
    if (!user) return;

    const loginTime = getLoginTime() || Date.now();
    if (!getLoginTime()) localStorage.setItem("dms_login_time", Date.now().toString());

    const tick = () => {
      const elapsed = Date.now() - loginTime;
      const left    = SESSION_TIMEOUT_MS - elapsed;

      if (left <= 0) {
        doLogout(true);
        return;
      }

      setRemaining(left);
      setShowWarning(left <= SESSION_WARNING_MS);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [user, doLogout]);

  // ── Extend session ──
  const extendSession = () => {
    // Re-call login with stored token to get fresh JWT
    const newTime = Date.now();
    localStorage.setItem("dms_login_time", newTime.toString());
    setRemaining(SESSION_TIMEOUT_MS);
    setShowWarning(false);
  };

  const handleLogin = (loggedInUser) => {
    localStorage.setItem("dms_login_time", Date.now().toString());
    setUser(loggedInUser);
    setSessionExpired(false);
  };

  const handleLogout = () => doLogout(false);

  // ── Session expired → show modal ──
  if (sessionExpired) {
    return (
      <>
        <style>{appCss}</style>
        <SessionExpiredModal onLogin={() => { setSessionExpired(false); }} />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  // ── Not logged in ──
  if (!user) {
    return (<><style>{appCss}</style><Login onLogin={handleLogin} /></>);
  }

  const role = user.role;

  return (
    <>
      <style>{appCss}</style>

      {/* Session warning banner — shows 5 min before expiry */}
      {showWarning && (
        <SessionWarning
          remaining={remaining}
          onExtend={extendSession}
          onLogout={() => doLogout(false)}
        />
      )}

      {/* Push content down when banner is shown */}
      <div className="dms-app" style={{ marginTop: showWarning ? 48 : 0 }}>
        <Sidebar onLogout={handleLogout} user={user} />
        <div className="dms-main">
          <Navbar dark={dark} onToggle={toggleTheme} user={user} onLogout={handleLogout} />
          <div className="dms-content">
            <Routes>
              {/* Dashboard — all */}
              <Route path="/" element={<Dashboard />} />

              {/* Client/Branch — Admin only */}
              <Route path="/clients"       element={<Guard role={role} permission="clientBranchCRUD"><ClientList /></Guard>} />
              
              <Route path="/client-master" element={<Guard role={role} permission="clientBranchCRUD"><ClientMaster /></Guard>} />
              <Route path="/branches"      element={<Guard role={role} permission="clientBranchCRUD"><Branches /></Guard>} />

              {/* Customer Master — Admin, Manager, Officer */}
              <Route path="/customer-master" element={<Guard role={role} permission="customerMaster"><CustomerMaster /></Guard>} />

              {/* Document Master — Admin, Manager */}
              <Route path="/document-master" element={<Guard role={role} permission="documentMaster"><DocumentMaster /></Guard>} />

              {/* Image Upload — Admin, Manager, Officer, DataEntry */}
              <Route path="/image-upload" element={<Guard role={role} permission="imageUpload"><ImageUpload /></Guard>} />

              {/* Image View — Admin, Manager, Officer, Viewer */}
              <Route path="/image-view" element={<Guard role={role} permission="imageView"><ImageView /></Guard>} />

              {/* User Management — Admin only */}
              <Route path="/users/list"   element={<Guard role={role} permission="createEditUsers"><UserList /></Guard>} />
              <Route path="/users/add"    element={<Guard role={role} permission="createEditUsers"><UserList /></Guard>} />
              <Route path="/user-groups"  element={<Guard role={role} permission="createEditUsers"><UserGroups /></Guard>} />

              {/* Reports — Admin, Manager, Officer, Viewer */}
              <Route path="/upload-log" element={<Guard role={role} permission="viewReports"><UploadLog /></Guard>} />
<Route path="/audit-log"  element={<Guard role={role} permission="createEditUsers"><AuditLog /></Guard>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
