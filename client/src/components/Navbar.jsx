import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  .dms-navbar {
    height: 56px; background: #0B1820;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center;
    padding: 0 20px 0 24px; gap: 16px;
    position: sticky; top: 0; z-index: 90;
    font-family: 'DM Sans', sans-serif;
  }

  /* Breadcrumb */
  .nb-breadcrumb { flex: 1; display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #4a6080; }
  .nb-bc-item    { color: #4a6080; }
  .nb-bc-sep     { font-size: 10px; opacity: .5; }
  .nb-bc-current { color: #c8d8f0; font-weight: 600; }

  /* Search */
  .nb-search-wrap { position: relative; }
 .nb-search {
  display: flex; align-items: center; gap: 8px;
  background: rgba(37,99,235,0.12); border: 1px solid rgba(37,99,235,0.35);
  border-radius: 8px; padding: 6px 12px; width: 240px; transition: all .2s;
}
.nb-search:focus-within { border-color: rgba(61,142,240,0.8); width: 300px; background: rgba(37,99,235,0.18); }
.nb-search input { background: none; border: none; outline: none; font-size: 12.5px; color: #c8d8f0; font-family: 'DM Sans', sans-serif; width: 100%; }
.nb-search input::placeholder { color: #60a5fa; }
.nb-search-icon { font-size: 12px; opacity: .8; flex-shrink: 0; color: #60a5fa; }

  /* Search results dropdown */
  .nb-search-results {
    position: absolute; top: calc(100% + 8px); left: 0;
    width: 340px; background: #131c2e;
    border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5); z-index: 300;
    animation: dropIn .15s ease; overflow: hidden; max-height: 380px; overflow-y: auto;
  }
  .nsr-section { padding: 8px 12px 4px; font-size: 10px; font-weight: 700; color: #3a5070; text-transform: uppercase; letter-spacing: 1px; }
  .nsr-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 14px; cursor: pointer; transition: background .15s;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .nsr-item:last-child { border-bottom: none; }
  .nsr-item:hover { background: rgba(255,255,255,0.06); }
  .nsr-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
  .nsr-name { font-size: 12.5px; color: #c8d8f0; font-weight: 600; }
  .nsr-meta { font-size: 11px; color: #4a6080; margin-top: 1px; }
  .nsr-badge { font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-left: auto; flex-shrink: 0; }
  .nsr-empty { padding: 20px; text-align: center; color: #3a5070; font-size: 13px; }
  .nsr-spinner { padding: 16px; text-align: center; color: #4a6080; font-size: 12px; }

  /* Action buttons */
  .nb-actions { display: flex; align-items: center; gap: 6px; }
  .nb-icon-btn {
    width: 34px; height: 34px; border-radius: 8px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
    color: #7a90b0; font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all .15s;
  }
  .nb-icon-btn:hover { background: rgba(255,255,255,0.12); color: #c8d8f0; }

  /* Bell */
  .nb-bell-wrap { position: relative; }
  .nb-bell-badge {
    position: absolute; top: -4px; right: -4px;
    min-width: 16px; height: 16px; border-radius: 8px;
    background: #dc2626; color: #fff; font-size: 9px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #0B1820; padding: 0 3px;
  }

  /* Notifications dropdown */
  .nb-notif-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0;
    width: 320px; background: #131c2e;
    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5); z-index: 200;
    animation: dropIn .15s ease; overflow: hidden;
  }
  .notif-head {
    padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: space-between;
  }
  .notif-head-title { font-size: 13px; font-weight: 700; color: #c8d8f0; }
  .notif-mark-all { font-size: 11px; color: #3d8ef0; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .notif-mark-all:hover { color: #7eb8f0; }
  .notif-list { max-height: 320px; overflow-y: auto; }
  .notif-item {
    padding: 11px 16px; border-bottom: 1px solid rgba(255,255,255,0.04);
    cursor: pointer; transition: background .15s; position: relative;
  }
  .notif-item:hover { background: rgba(255,255,255,0.04); }
  .notif-item:last-child { border-bottom: none; }
  .notif-item.unread { background: rgba(37,99,235,0.06); }
  .notif-item.unread::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:#2563eb; }
  .notif-row { display: flex; align-items: flex-start; gap: 10px; }
  .notif-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
  .notif-body { flex: 1; }
  .notif-text { font-size: 12px; color: #8aaac8; line-height: 1.5; }
  .notif-text b { color: #c8d8f0; }
  .notif-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
  .notif-time { font-size: 10px; color: #3a5070; }
  .notif-tag { font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 4px; }
  .notif-empty { padding: 28px; text-align: center; color: #3a5070; font-size: 13px; }
  .notif-footer { padding: 10px 16px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
  .notif-footer-btn { font-size: 12px; color: #3d8ef0; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; }

  /* Divider */
  .nb-divider { width: 1px; height: 22px; background: rgba(255,255,255,0.08); margin: 0 4px; }

  /* User dropdown */
  .nb-user-wrap { position: relative; }
  .nb-user { display: flex; align-items: center; gap: 9px; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background .15s; }
  .nb-user:hover { background: rgba(255,255,255,0.06); }
  .nb-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#2563eb,#3d8ef0); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .nb-user-name { font-size: 12.5px; font-weight: 700; color: #c8d8f0; line-height: 1.2; }
  .nb-user-role { display: inline-flex; background: rgba(37,99,235,0.2); border: 1px solid rgba(37,99,235,0.3); color: #60a5fa; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; margin-top: 1px; }
  .nb-chevron { font-size: 9px; color: #3a5070; margin-left: 2px; transition: transform .15s; }
  .nb-chevron.open { transform: rotate(180deg); }

  .nb-user-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0;
    width: 220px; background: #131c2e;
    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5); z-index: 200;
    animation: dropIn .15s ease; overflow: hidden;
  }
  .nb-dd-head { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .nb-dd-name  { font-size: 13px; font-weight: 700; color: #c8d8f0; }
  .nb-dd-email { font-size: 11px; color: #4a6080; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .nb-dd-role  { display: inline-flex; margin-top: 5px; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
  .nb-dd-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0; }
  .nb-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 16px; cursor: pointer; font-size: 13px;
    color: #7a90b0; transition: all .15s;
    border: none; background: none; width: 100%;
    font-family: 'DM Sans', sans-serif; text-align: left;
  }
  .nb-dd-item:hover { background: rgba(255,255,255,0.05); color: #c8d8f0; }
  .nb-dd-item .dd-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  .nb-dd-item.logout { color: #f05a5a; }
  .nb-dd-item.logout:hover { background: rgba(240,90,90,0.1); }
  .nb-dd-item.logout .dd-icon { background: rgba(240,90,90,0.15); }
  .nb-dd-item .dd-icon.blue   { background: rgba(37,99,235,0.15); }
  .nb-dd-item .dd-icon.green  { background: rgba(22,163,74,0.15); }
  .nb-dd-item .dd-icon.purple { background: rgba(124,58,237,0.15); }

  @keyframes dropIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

  /* Change Password Modal */
  .nb-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.65);
    backdrop-filter: blur(4px); display: flex; align-items: center;
    justify-content: center; z-index: 1000; padding: 20px;
    animation: fadeIn .15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .nb-modal {
    background: #fff; border: 1px solid #e2eaf4; border-radius: 14px;
    width: 100%; max-width: 440px; overflow: hidden;
    box-shadow: 0 24px 60px rgba(15,28,51,0.2); animation: slideUp .2s ease;
  }
  @keyframes slideUp { from { transform:translateY(20px);opacity:0; } to { transform:translateY(0);opacity:1; } }
  .nb-modal-head { padding: 20px 24px; border-bottom: 1px solid #f0f4fb; display: flex; align-items: center; justify-content: space-between; }
  .nb-modal-title { font-size: 16px; font-weight: 700; color: #0f1c33; }
  .nb-modal-sub   { font-size: 12px; color: #8a9ab8; margin-top: 2px; }
  .nb-modal-body  { padding: 24px; }
  .nb-modal-footer { padding: 14px 24px; border-top: 1px solid #f0f4fb; display: flex; justify-content: flex-end; gap: 10px; background: #fafcff; }
  .nb-close { width: 30px; height: 30px; border-radius: 7px; background: #f0f4fb; border: none; color: #4a5e80; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; }
  .nb-close:hover { background: #fef2f2; color: #dc2626; }

  .nb-fg { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .nb-fg:last-child { margin-bottom: 0; }
  .nb-label { font-size: 11px; font-weight: 700; color: #4a5e80; text-transform: uppercase; letter-spacing: .6px; }
  .nb-input-wrap { position: relative; }
  .nb-input {
    width: 100%; background: #f0f4fb; border: 1.5px solid #e2eaf4;
    border-radius: 8px; padding: 10px 40px 10px 14px;
    font-size: 13px; color: #0f1c33; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color .15s;
  }
  .nb-input:focus { border-color: #2563eb; background: #eff4ff; }
  .nb-input::placeholder { color: #8a9ab8; }
  .nb-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #8a9ab8; font-size: 13px; }
  .nb-eye:hover { color: #4a5e80; }
  .nb-hint { font-size: 11px; color: #8a9ab8; }
  .nb-hint.error { color: #dc2626; }
  .nb-hint.success { color: #16a34a; }

  .nb-strength { display: flex; gap: 4px; margin-top: 6px; }
  .nb-strength-bar { height: 3px; flex: 1; border-radius: 2px; background: #e2eaf4; transition: background .3s; }

  .nb-btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; transition: all .15s; }
  .nb-btn-primary { background: #2563eb; color: #fff; }
  .nb-btn-primary:hover { filter: brightness(1.08); }
  .nb-btn-primary:disabled { opacity: .6; cursor: not-allowed; }
  .nb-btn-outline { background: #fff; color: #4a5e80; border: 1px solid #d8e4f0; }
  .nb-btn-outline:hover { border-color: #2563eb; color: #2563eb; }

  /* Profile modal */
  .nb-profile-row { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .nb-profile-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,#2563eb,#3d8ef0); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .nb-profile-name { font-size: 17px; font-weight: 700; color: #0f1c33; }
  .nb-profile-role { display: inline-flex; margin-top: 4px; font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 20px; }
  .nb-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .nb-info-item { background: #f8faff; border: 1px solid #e2eaf4; border-radius: 8px; padding: 10px 14px; }
  .nb-info-label { font-size: 10px; font-weight: 700; color: #8a9ab8; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px; }
  .nb-info-val { font-size: 13px; color: #0f1c33; font-weight: 500; }
  .nb-info-item.full { grid-column: 1/-1; }

  .nb-spinner { width: 14px; height: 14px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin .6s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const BREADCRUMBS = {
  "/":                ["Home", "Dashboard"],
  "/clients":         ["Home", "Client Master", "Client List"],
  "/add-client":      ["Home", "Client Master", "Add Client"],
  "/branches":        ["Home", "Client Master", "Branches"],
  "/customer-master": ["Home", "Image Module", "Customer Master"],
  "/document-master": ["Home", "Image Module", "Document Master"],
  "/image-upload":    ["Home", "Image Module", "Image Upload"],
  "/image-view":      ["Home", "Image Module", "Image View"],
  "/upload-log":      ["Home", "Reports", "Upload Log"],
  "/audit-log":       ["Home", "Reports", "Audit Log"],
  "/settings":        ["Home", "Settings"],
  "/users/list":      ["Home", "User Management", "User List"],
  "/users/add":       ["Home", "User Management", "Add User"],
  "/user-groups":     ["Home", "User Management", "User Groups"],
};

const ROLE_COLORS = { Admin:"#b8860b", Manager:"#2563eb", Officer:"#16a34a", DataEntry:"#c2410c", Viewer:"#7c3aed" };

const API_BASE = "http://localhost:5000/api";

// ── Password strength ──
function getStrength(pwd) {
  let s = 0;
  if (pwd.length >= 8)          s++;
  if (/[A-Z]/.test(pwd))        s++;
  if (/[0-9]/.test(pwd))        s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s; // 0–4
}
const STRENGTH_COLORS = ["#e2eaf4","#dc2626","#f5933a","#f5c842","#16a34a"];
const STRENGTH_LABELS = ["","Weak","Fair","Good","Strong"];

export default function Navbar({ dark, onToggle, user, onLogout }) {
  const { pathname } = useLocation();
  const navigate     = useNavigate();

  const [showNotif,  setShowNotif]  = useState(false);
  const [showUser,   setShowUser]   = useState(false);
  const [showPwdModal,   setShowPwdModal]   = useState(false);
  const [showProfile,    setShowProfile]    = useState(false);

  // Search
  const [search,       setSearch]       = useState("");
  const [searchRes,    setSearchRes]    = useState(null);
  const [searching,    setSearching]    = useState(false);
  const [showSearchDD, setShowSearchDD] = useState(false);
  const searchRef  = useRef(null);
  const searchTimer = useRef(null);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id:1, text:<><b>Pravin Patil</b> uploaded 3 KYC documents</>, time:"2 min ago",  color:"#2563eb", tag:"Upload",  tagColor:"#dbeafe:#1d4ed8", unread:true  },
    { id:2, text:<><b>Jayant Kulkarni</b> created new customer <b>Sunita Mane</b></>,   time:"14 min ago",color:"#16a34a",tag:"Create",  tagColor:"#d1fae5:#065f46", unread:true  },
    { id:3, text:<>4 documents pending <b>KYC verification</b></>,                       time:"1 hr ago",  color:"#f5933a",tag:"Action",  tagColor:"#ffedd5:#c2410c", unread:true  },
    { id:4, text:<><b>Admin</b> created branch <b>Yeola Branch</b></>,                   time:"2 hrs ago", color:"#9b6ef5",tag:"Config",  tagColor:"#f3e8ff:#6d28d9", unread:false },
    { id:5, text:<><b>Yogesh Vagare</b> exported Upload Log Report (48 pages)</>,         time:"Yesterday", color:"#f5c842",tag:"Export",  tagColor:"#fef3c7:#92400e", unread:false },
  ]);
  const unreadCount = notifications.filter(n => n.unread).length;

  // Change password
  const [pwd,     setPwd]     = useState({ current:"", newPwd:"", confirm:"" });
  const [pwdShow, setPwdShow] = useState({ current:false, newPwd:false, confirm:false });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg,     setPwdMsg]     = useState(null);

  const crumbs   = BREADCRUMBS[pathname] || ["Home"];
  const initials = user?.fullName?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() || "U";
  const roleColor = ROLE_COLORS[user?.role] || "#8a9ab8";

  // ── Live search ──
  useEffect(() => {
    if (!search.trim()) { setSearchRes(null); setShowSearchDD(false); return; }
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      setShowSearchDD(true);
      try {
        const [clients, customers, docTypes] = await Promise.all([
          fetch(`${API_BASE}/clients`).then(r=>r.json()),
          fetch(`${API_BASE}/customers`).then(r=>r.json()),
          fetch(`${API_BASE}/document-types`).then(r=>r.json()),
        ]);
        const q = search.toLowerCase();
        const results = {
          clients:   (Array.isArray(clients)   ? clients   : []).filter(c => c.name?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q)).slice(0,3),
          customers: (Array.isArray(customers) ? customers : []).filter(c => c.name?.toLowerCase().includes(q) || c.mobile?.includes(q) || c.code?.toLowerCase().includes(q)).slice(0,3),
          docTypes:  (Array.isArray(docTypes)  ? docTypes  : []).filter(d => d.name?.toLowerCase().includes(q) || d.code?.toLowerCase().includes(q)).slice(0,3),
        };
        setSearchRes(results);
      } catch { setSearchRes(null); }
      finally { setSearching(false); }
    }, 350);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => { if (!searchRef.current?.contains(e.target)) setShowSearchDD(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchNav = (path) => { setSearch(""); setShowSearchDD(false); navigate(path); };
  const markAllRead     = () => setNotifications(prev => prev.map(n => ({ ...n, unread:false })));
  const markRead        = (id) => setNotifications(prev => prev.map(n => n.id===id ? {...n, unread:false} : n));

  // ── Change Password ──
  const handleChangePwd = async () => {
    setPwdMsg(null);
    if (!pwd.current.trim())  return setPwdMsg({ type:"error", text:"Enter current password" });
    if (pwd.newPwd.length < 8) return setPwdMsg({ type:"error", text:"New password must be at least 8 characters" });
    if (pwd.newPwd !== pwd.confirm) return setPwdMsg({ type:"error", text:"Passwords do not match" });

    setPwdLoading(true);
    try {
      // Verify current password by attempting login
      const verifyRes = await fetch(`${API_BASE}/auth/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ username: user.username, password: pwd.current }),
      });
      if (!verifyRes.ok) {
        setPwdMsg({ type:"error", text:"Current password is incorrect" });
        setPwdLoading(false);
        return;
      }

      // Reset password
      const resetRes = await fetch(`${API_BASE}/users/${user.id}/reset-password`, {
        method:"PATCH", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ newPassword: pwd.newPwd }),
      });
      const result = await resetRes.json();
      if (!resetRes.ok) { setPwdMsg({ type:"error", text: result.message }); return; }

      setPwdMsg({ type:"success", text:"✅ Password changed successfully! Please login again." });
      setPwd({ current:"", newPwd:"", confirm:"" });
      setTimeout(() => { setShowPwdModal(false); setPwdMsg(null); onLogout(); }, 2000);
    } catch {
      setPwdMsg({ type:"error", text:"Server error — try again" });
    } finally { setPwdLoading(false); }
  };

  const strength      = getStrength(pwd.newPwd);
  const strengthColor = STRENGTH_COLORS[strength];

  return (
    <>
      <style>{css}</style>
      <div className="dms-navbar">

        {/* Breadcrumb */}
        <div className="nb-breadcrumb">
          {crumbs.map((c, i) => (
            <span key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
              {i > 0 && <span className="nb-bc-sep">›</span>}
              <span className={i === crumbs.length - 1 ? "nb-bc-current" : "nb-bc-item"}>{c}</span>
            </span>
          ))}
        </div>

          <div style={{
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  }}>
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: "linear-gradient(135deg,#2563eb,#3d8ef0)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
    }}>
      {initials}
    </div>
    <span style={{
      fontSize: 13, fontWeight: 700, color: "#c8d8f0",
      letterSpacing: "0.3px",
    }}>
      {user?.fullName || "User"}
    </span>
    <span style={{
      fontSize: 9, fontWeight: 700,
      background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)",
      color: "#60a5fa", padding: "2px 7px", borderRadius: 4,
    }}>
      {user?.role}
    </span>
  </div>

        {/* ── Live Search ── */}
        <div className="nb-search-wrap" ref={searchRef}>
          <div className="nb-search">
            <span className="nb-search-icon">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => search && setShowSearchDD(true)}
              placeholder="Search clients, customers, documents..."
            />
            {search && (
              <span style={{cursor:"pointer",opacity:.4,fontSize:11}} onClick={() => { setSearch(""); setShowSearchDD(false); }}>✕</span>
            )}
          </div>

          {showSearchDD && (
            <div className="nb-search-results">
              {searching ? (
                <div className="nsr-spinner">🔍 Searching...</div>
              ) : !searchRes || (searchRes.clients.length + searchRes.customers.length + searchRes.docTypes.length === 0) ? (
                <div className="nsr-empty">No results for "<b>{search}</b>"</div>
              ) : (
                <>
                  {searchRes.clients.length > 0 && (
                    <>
                      <div className="nsr-section">Clients</div>
                      {searchRes.clients.map(c => (
                        <div key={c.id} className="nsr-item" onClick={() => handleSearchNav("/clients")}>
                          <div className="nsr-icon" style={{background:"#dbeafe"}}>🏢</div>
                          <div style={{flex:1}}>
                            <div className="nsr-name">{c.name}</div>
                            <div className="nsr-meta">{c.code} · {c.type}</div>
                          </div>
                          <span className="nsr-badge" style={{background:"#dbeafe",color:"#1d4ed8"}}>{c.status ? "Active":"Inactive"}</span>
                        </div>
                      ))}
                    </>
                  )}
                  {searchRes.customers.length > 0 && (
                    <>
                      <div className="nsr-section">Customers</div>
                      {searchRes.customers.map(c => (
                        <div key={c.id} className="nsr-item" onClick={() => handleSearchNav("/customer-master")}>
                          <div className="nsr-icon" style={{background:"#d1fae5"}}>👤</div>
                          <div style={{flex:1}}>
                            <div className="nsr-name">{c.name}</div>
                            <div className="nsr-meta">{c.code} · {c.mobile}</div>
                          </div>
                          <span className="nsr-badge" style={{background:"#d1fae5",color:"#065f46"}}>{c.customerType}</span>
                        </div>
                      ))}
                    </>
                  )}
                  {searchRes.docTypes.length > 0 && (
                    <>
                      <div className="nsr-section">Document Types</div>
                      {searchRes.docTypes.map(d => (
                        <div key={d.id} className="nsr-item" onClick={() => handleSearchNav("/document-master")}>
                          <div className="nsr-icon" style={{background:"#f3e8ff"}}>{d.icon || "📄"}</div>
                          <div style={{flex:1}}>
                            <div className="nsr-name">{d.name}</div>
                            <div className="nsr-meta">{d.code} · {d.category}</div>
                          </div>
                          <span className="nsr-badge" style={{background:"#f3e8ff",color:"#6d28d9"}}>{d.allowedFormats?.join(", ")}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="nb-actions">

          {/* Theme toggle */}
          <button className="nb-icon-btn" onClick={onToggle} title={dark ? "Switch to Light" : "Switch to Dark"}>
            {dark ? "☀️" : "🌙"}
          </button>

          {/* Notifications */}
          <div className="nb-bell-wrap">
            <button className="nb-icon-btn" style={{fontSize:15}} onClick={() => { setShowNotif(v=>!v); setShowUser(false); }} title="Notifications">
              🔔
              {unreadCount > 0 && <span className="nb-bell-badge">{unreadCount}</span>}
            </button>
            {showNotif && (
              <div className="nb-notif-dropdown" onClick={e => e.stopPropagation()}>
                <div className="notif-head">
                  <span className="notif-head-title">🔔 Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
                  {unreadCount > 0 && <button className="notif-mark-all" onClick={markAllRead}>Mark all read</button>}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">No notifications</div>
                  ) : notifications.map(n => {
                    const [bg, tc] = (n.tagColor || "#e2eaf4:#4a5e80").split(":");
                    return (
                      <div key={n.id} className={`notif-item${n.unread?" unread":""}`} onClick={() => markRead(n.id)}>
                        <div className="notif-row">
                          <div className="notif-dot" style={{background:n.color}}/>
                          <div className="notif-body">
                            <div className="notif-text">{n.text}</div>
                            <div className="notif-meta">
                              <span className="notif-time">{n.time}</span>
                              <span className="notif-tag" style={{background:bg,color:tc}}>{n.tag}</span>
                              {n.unread && <span style={{fontSize:9,color:"#2563eb",fontWeight:700}}>● New</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="notif-footer">
                  <button className="notif-footer-btn" onClick={() => { setShowNotif(false); navigate("/audit-log"); }}>
                    View All Activity →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="nb-divider" />

          {/* User dropdown */}
          <div className="nb-user-wrap">
            <div className="nb-user" onClick={() => { setShowUser(v=>!v); setShowNotif(false); }}>
              <div className="nb-avatar">{initials}</div>
              <div>
                <div className="nb-user-name">{user?.fullName || "User"}</div>
                <div className="nb-user-role">{user?.role}</div>
              </div>
              <span className={`nb-chevron${showUser?" open":""}`}>▾</span>
            </div>

            {showUser && (
              <div className="nb-user-dropdown" onClick={e => e.stopPropagation()}>
                <div className="nb-dd-head">
                  <div className="nb-dd-name">{user?.fullName}</div>
                  <div className="nb-dd-email">{user?.email}</div>
                  <div className="nb-dd-role" style={{background:`${roleColor}20`,color:roleColor,border:`1px solid ${roleColor}33`}}>
                    {user?.role}
                  </div>
                </div>
                <hr className="nb-dd-divider"/>

                <button className="nb-dd-item" onClick={() => { setShowUser(false); setShowProfile(true); }}>
                  <div className="dd-icon blue">👤</div>
                  My Profile
                </button>

                <button className="nb-dd-item" onClick={() => { setShowUser(false); setShowPwdModal(true); }}>
                  <div className="dd-icon green">🔑</div>
                  Change Password
                </button>

                <button className="nb-dd-item" onClick={() => { setShowUser(false); navigate("/settings"); }}>
                  <div className="dd-icon purple">⚙️</div>
                  Settings
                </button>

                <hr className="nb-dd-divider"/>
                <button className="nb-dd-item logout" onClick={() => { setShowUser(false); onLogout(); }}>
                  <div className="dd-icon" style={{background:"rgba(240,90,90,0.15)"}}>⏻</div>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click-away overlay */}
      {(showNotif || showUser) && (
        <div style={{position:"fixed",inset:0,zIndex:89}} onClick={() => { setShowNotif(false); setShowUser(false); }} />
      )}

      {/* ── Change Password Modal ── */}
      {showPwdModal && (
        <div className="nb-modal-overlay" onClick={e => e.target===e.currentTarget && setShowPwdModal(false)}>
          <div className="nb-modal">
            <div className="nb-modal-head">
              <div>
                <div className="nb-modal-title">🔑 Change Password</div>
                <div className="nb-modal-sub">Update your account password securely</div>
              </div>
              <button className="nb-close" onClick={() => { setShowPwdModal(false); setPwdMsg(null); setPwd({current:"",newPwd:"",confirm:""}); }}>✕</button>
            </div>
            <div className="nb-modal-body">

              {pwdMsg && (
                <div style={{padding:"10px 14px",borderRadius:8,marginBottom:16,fontSize:13,fontWeight:600,
                  background: pwdMsg.type==="success" ? "#f0fdf4" : "#fff5f5",
                  color:      pwdMsg.type==="success" ? "#16a34a" : "#dc2626",
                  border:     `1px solid ${pwdMsg.type==="success" ? "#86efac" : "#fca5a5"}`
                }}>
                  {pwdMsg.text}
                </div>
              )}

              {/* Current password */}
              <div className="nb-fg">
                <label className="nb-label">Current Password</label>
                <div className="nb-input-wrap">
                  <input className="nb-input" type={pwdShow.current?"text":"password"} placeholder="Enter current password"
                    value={pwd.current} onChange={e => setPwd(p=>({...p,current:e.target.value}))} />
                  <button className="nb-eye" type="button" onClick={() => setPwdShow(s=>({...s,current:!s.current}))}>
                    {pwdShow.current ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="nb-fg">
                <label className="nb-label">New Password</label>
                <div className="nb-input-wrap">
                  <input className="nb-input" type={pwdShow.newPwd?"text":"password"} placeholder="Minimum 8 characters"
                    value={pwd.newPwd} onChange={e => setPwd(p=>({...p,newPwd:e.target.value}))} />
                  <button className="nb-eye" type="button" onClick={() => setPwdShow(s=>({...s,newPwd:!s.newPwd}))}>
                    {pwdShow.newPwd ? "🙈" : "👁"}
                  </button>
                </div>
                {pwd.newPwd && (
                  <>
                    <div className="nb-strength">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="nb-strength-bar" style={{background: i<=strength ? strengthColor : "#e2eaf4"}}/>
                      ))}
                    </div>
                    <span className="nb-hint" style={{color:strengthColor}}>
                      {STRENGTH_LABELS[strength]} password
                      {strength < 3 && " — add uppercase, numbers or symbols"}
                    </span>
                  </>
                )}
              </div>

              {/* Confirm password */}
              <div className="nb-fg">
                <label className="nb-label">Confirm New Password</label>
                <div className="nb-input-wrap">
                  <input className="nb-input" type={pwdShow.confirm?"text":"password"} placeholder="Re-enter new password"
                    value={pwd.confirm} onChange={e => setPwd(p=>({...p,confirm:e.target.value}))} />
                  <button className="nb-eye" type="button" onClick={() => setPwdShow(s=>({...s,confirm:!s.confirm}))}>
                    {pwdShow.confirm ? "🙈" : "👁"}
                  </button>
                </div>
                {pwd.confirm && pwd.newPwd && (
                  <span className={`nb-hint ${pwd.newPwd===pwd.confirm?"success":"error"}`}>
                    {pwd.newPwd===pwd.confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </span>
                )}
              </div>

            </div>
            <div className="nb-modal-footer">
              <button className="nb-btn nb-btn-outline" onClick={() => { setShowPwdModal(false); setPwdMsg(null); setPwd({current:"",newPwd:"",confirm:""}); }}>
                Cancel
              </button>
              <button className="nb-btn nb-btn-primary" onClick={handleChangePwd} disabled={pwdLoading}>
                {pwdLoading ? <span className="nb-spinner"/> : "🔑"} {pwdLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── My Profile Modal ── */}
      {showProfile && (
        <div className="nb-modal-overlay" onClick={e => e.target===e.currentTarget && setShowProfile(false)}>
          <div className="nb-modal" style={{maxWidth:480}}>
            <div className="nb-modal-head">
              <div>
                <div className="nb-modal-title">👤 My Profile</div>
                <div className="nb-modal-sub">Your account information</div>
              </div>
              <button className="nb-close" onClick={() => setShowProfile(false)}>✕</button>
            </div>
            <div className="nb-modal-body">
              <div className="nb-profile-row">
                <div className="nb-profile-avatar">{initials}</div>
                <div>
                  <div className="nb-profile-name">{user?.fullName}</div>
                  <div className="nb-profile-role" style={{background:`${roleColor}18`,color:roleColor,border:`1px solid ${roleColor}33`}}>
                    {user?.role}
                  </div>
                </div>
              </div>
              <div className="nb-info-grid">
                <div className="nb-info-item">
                  <div className="nb-info-label">Username</div>
                  <div className="nb-info-val" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>@{user?.username}</div>
                </div>
                <div className="nb-info-item">
                  <div className="nb-info-label">Role</div>
                  <div className="nb-info-val" style={{color:roleColor,fontWeight:700}}>{user?.role}</div>
                </div>
                <div className="nb-info-item full">
                  <div className="nb-info-label">Email</div>
                  <div className="nb-info-val">{user?.email || "—"}</div>
                </div>
                <div className="nb-info-item">
                  <div className="nb-info-label">Mobile</div>
                  <div className="nb-info-val" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{user?.mobile || "—"}</div>
                </div>
                <div className="nb-info-item">
                  <div className="nb-info-label">Last Login</div>
                  <div className="nb-info-val" style={{fontSize:12}}>
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString("en-IN") : "—"}
                  </div>
                </div>
                {user?.assignedClientId && (
                  <div className="nb-info-item full">
                    <div className="nb-info-label">Assigned Client</div>
                    <div className="nb-info-val">Client ID: {user.assignedClientId}</div>
                  </div>
                )}
                <div className="nb-info-item full">
                  <div className="nb-info-label">Account Status</div>
                  <div className="nb-info-val" style={{color:"#16a34a",fontWeight:700}}>● Active</div>
                </div>
              </div>
            </div>
            <div className="nb-modal-footer">
              <button className="nb-btn nb-btn-outline" onClick={() => setShowProfile(false)}>Close</button>
              <button className="nb-btn nb-btn-primary" onClick={() => { setShowProfile(false); setShowPwdModal(true); }}>🔑 Change Password</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
