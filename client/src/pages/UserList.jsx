import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .page{padding:28px;min-height:100vh;}
  .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;}
  .page-title{font-size:26px;font-weight:700;color:var(--tp);letter-spacing:-.5px;}
  .page-subtitle{font-size:13px;color:var(--tm);margin-top:4px;}

  .stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:22px;}
  .stat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;display:flex;align-items:center;gap:12px;transition:border-color .2s,transform .2s;}
  .stat-card:hover{border-color:var(--border-light);transform:translateY(-2px);}
  .stat-icon{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;}
  .stat-val{font-size:22px;font-weight:700;font-family:var(--mono);line-height:1;}
  .stat-label{font-size:11px;color:var(--ts);margin-top:2px;}

  .btn{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:var(--font);transition:all .15s;white-space:nowrap;}
  .btn-gold{background:var(--gold);color:#0f1623;}
  .btn-gold:hover{filter:brightness(1.1);transform:translateY(-1px);}
  .btn-primary{background:var(--blue);color:#fff;}
  .btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px);}
  .btn-outline{background:transparent;color:var(--ts);border:1px solid var(--border-light);}
  .btn-outline:hover{border-color:var(--blue);color:var(--blue);}
  .btn-danger{background:#f05a5a22;color:var(--red);border:1px solid #f05a5a44;}
  .btn-danger:hover{background:#f05a5a33;}
  .btn-sm{padding:5px 12px;font-size:12px;}
  .btn:disabled{opacity:.5;cursor:not-allowed;}

  .filter-bar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center;}
  .fi{flex:1;min-width:180px;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;padding:9px 13px;font-size:13px;color:var(--tp);font-family:var(--font);outline:none;}
  .fi:focus{border-color:var(--blue);}
  .fs{background:var(--bg-input);border:1px solid var(--border);border-radius:8px;padding:9px 13px;font-size:13px;color:var(--ts);font-family:var(--font);outline:none;cursor:pointer;}

  .table-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
  .tcard-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border);}
  .tc-title{font-size:15px;font-weight:600;color:var(--tp);}
  .tc-sub{font-size:12px;color:var(--tm);margin-top:2px;}
  .data-table{width:100%;border-collapse:collapse;}
  .data-table th{padding:10px 16px;font-size:11px;font-weight:600;color:var(--tm);text-transform:uppercase;letter-spacing:.8px;text-align:left;border-bottom:1px solid var(--border);background:#f5f8ff;}
  .data-table td{padding:12px 16px;font-size:13px;color:var(--ts);border-bottom:1px solid var(--border);}
  .data-table tr:last-child td{border-bottom:none;}
  .data-table tr:hover td{background:#ffffff04;color:var(--tp);}
  .data-table td.pr{color:var(--tp);font-weight:500;}

  .mono{font-family:var(--mono);font-size:11px;color:var(--blue);background:#3d8ef011;padding:2px 6px;border-radius:4px;}

  /* Role badges */
  .role-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;}
  .role-admin   {background:#f5c84222;color:var(--gold);   border:1px solid #f5c84244;}
  .role-manager {background:#3d8ef022;color:var(--blue);   border:1px solid #3d8ef044;}
  .role-officer {background:#2ec08b22;color:var(--green);  border:1px solid #2ec08b44;}
  .role-dataentry{background:#f5933a22;color:var(--orange);border:1px solid #f5933a44;}
  .role-viewer  {background:#9b6ef522;color:var(--purple); border:1px solid #9b6ef544;}

  /* Status toggle */
  .status-toggle{display:inline-flex;align-items:center;gap:6px;padding:3px 10px 3px 6px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:none;font-family:var(--font);transition:all .2s;}
  .status-toggle.active{background:#2ec08b22;color:var(--green);border:1px solid #2ec08b44;}
  .status-toggle.active:hover{background:#f05a5a22;color:var(--red);border-color:#f05a5a44;}
  .status-toggle.inactive{background:#f05a5a22;color:var(--red);border:1px solid #f05a5a44;}
  .status-toggle.inactive:hover{background:#2ec08b22;color:var(--green);border-color:#2ec08b44;}
  .status-toggle:disabled{opacity:.5;cursor:not-allowed;}
  .sdot{width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0;}

  /* User avatar */
  .u-avatar{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;}

  /* Locked badge */
  .locked-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;color:var(--red);background:#f05a5a15;padding:2px 7px;border-radius:4px;border:1px solid #f05a5a33;}

  .action-btns{display:flex;gap:5px;}
  .action-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:var(--bg-input);color:var(--ts);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
  .action-btn:hover{border-color:var(--blue);color:var(--blue);}
  .action-btn.danger:hover{border-color:var(--red);color:var(--red);}

  .pagination{display:flex;align-items:center;justify-content:space-between;padding:13px 20px;border-top:1px solid var(--border);}
  .page-info{font-size:12px;color:var(--tm);}
  .page-btns{display:flex;gap:5px;}
  .page-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:var(--bg-input);color:var(--ts);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
  .page-btn.active,.page-btn:hover{background:var(--blue);border-color:var(--blue);color:#fff;}

  .empty-state{text-align:center;padding:52px 20px;color:var(--tm);}

  .spinner{width:16px;height:16px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite;display:inline-block;}
  @keyframes spin{to{transform:rotate(360deg);}}

  .toast{position:fixed;bottom:28px;right:28px;z-index:2000;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:9px;animation:slideIn .25s ease;box-shadow:0 4px 20px rgba(0,0,0,.4);}
  .toast.success{background:#2ec08b22;color:var(--green);border:1px solid #2ec08b44;}
  .toast.error{background:#f05a5a22;color:var(--red);border:1px solid #f05a5a44;}
  @keyframes slideIn{from{transform:translateX(80px);opacity:0;}to{transform:translateX(0);opacity:1;}}

  /* Modal */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;animation:fadeIn .15s ease;}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  .modal{background:var(--bg-modal);border:1px solid var(--border-light);border-radius:14px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow);animation:slideUp .2s ease;}
  @keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
  .modal-sm{max-width:440px;}
  .modal-head{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--bg-modal);z-index:1;}
  .modal-title{font-size:16px;font-weight:700;color:var(--tp);}
  .modal-sub{font-size:12px;color:var(--tm);margin-top:2px;}
  .modal-body{padding:24px;}
  .modal-footer{padding:14px 24px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:10px;background:var(--bg-modal);position:sticky;bottom:0;}
  .close-btn{width:30px;height:30px;border-radius:7px;background:#ffffff10;border:none;color:var(--ts);cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;}
  .close-btn:hover{background:#f05a5a33;color:var(--red);}

  /* Form */
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .fg{display:flex;flex-direction:column;gap:6px;}
  .fg.full{grid-column:1/-1;}
  .flabel{font-size:11px;font-weight:700;color:var(--ts);text-transform:uppercase;letter-spacing:.6px;}
  .flabel .req{color:var(--red);margin-left:3px;}
  .finput,.fsel{background:var(--bg-input);border:1px solid var(--border);border-radius:8px;padding:9px 13px;font-size:13px;color:var(--tp);font-family:var(--font);outline:none;width:100%;transition:border-color .15s;}
  .finput:focus,.fsel:focus{border-color:var(--blue);}
  .finput::placeholder{color:var(--tm);}
  .finput:disabled{opacity:.5;cursor:not-allowed;}
  .fhint{font-size:11px;color:var(--tm);}
  .fsect{grid-column:1/-1;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--blue);padding-bottom:7px;border-bottom:1px solid var(--border);}
  .fdiv{grid-column:1/-1;border:none;border-top:1px solid var(--border);margin:2px 0;}

  /* Permission matrix */
  .perm-grid{display:grid;grid-template-columns:1fr repeat(5,auto);gap:0;border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-top:8px;}
  .perm-head{padding:8px 12px;font-size:10px;font-weight:700;color:var(--tm);text-transform:uppercase;letter-spacing:.7px;background:#f5f8ff;border-bottom:1px solid var(--border);text-align:center;}
  .perm-head:first-child{text-align:left;}
  .perm-row-label{padding:8px 12px;font-size:12px;color:var(--ts);border-bottom:1px solid var(--border);border-right:1px solid var(--border);}
  .perm-cell{padding:8px 12px;text-align:center;border-bottom:1px solid var(--border);font-size:13px;}
  .perm-row-label:last-of-type,.perm-cell:last-of-type{border-bottom:none;}

  /* Toggle wrap */
  .toggle-wrap{display:flex;align-items:center;gap:10px;}
  .toggle{width:38px;height:21px;background:var(--border-light);border-radius:11px;position:relative;cursor:pointer;transition:background .2s;border:none;}
  .toggle.on{background:var(--green);}
  .toggle::after{content:'';position:absolute;top:3px;left:3px;width:15px;height:15px;border-radius:50%;background:#fff;transition:transform .2s;}
  .toggle.on::after{transform:translateX(17px);}
  .toggle-lbl{font-size:13px;font-weight:600;}
  .toggle-lbl.on{color:var(--green);}
  .toggle-lbl.off{color:var(--tm);}

  /* Reset pwd modal */
  .reset-info{background:#f5c84215;border:1px solid #f5c84233;border-radius:8px;padding:12px 16px;font-size:12px;color:var(--gold);line-height:1.6;}
  .confirm-icon{font-size:38px;text-align:center;margin-bottom:10px;}
  .confirm-text{text-align:center;color:var(--ts);font-size:14px;line-height:1.6;}
  .confirm-name{color:var(--tp);font-weight:600;}

  ::-webkit-scrollbar{width:6px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:var(--border-light);border-radius:3px;}
`;

const ROLES = [
  { id: "Admin",     label: "Admin",      color: "#f5c842" },
  { id: "Manager",   label: "Manager",    color: "#3d8ef0" },
  { id: "Officer",   label: "Officer",    color: "#2ec08b" },
  { id: "DataEntry", label: "Data Entry", color: "#f5933a" },
  { id: "Viewer",    label: "Viewer",     color: "#9b6ef5" },
];

const PERMISSIONS = [
  { feature: "Create / Edit Users",    Admin:true,  Manager:false, Officer:false, DataEntry:false, Viewer:false },
  { feature: "Assign Roles",           Admin:true,  Manager:false, Officer:false, DataEntry:false, Viewer:false },
  { feature: "Client / Branch CRUD",   Admin:true,  Manager:false, Officer:false, DataEntry:false, Viewer:false },
  { feature: "Customer Master",        Admin:true,  Manager:true,  Officer:true,  DataEntry:false, Viewer:false },
  { feature: "Document Master",        Admin:true,  Manager:true,  Officer:false, DataEntry:false, Viewer:false },
  { feature: "Image Upload",           Admin:true,  Manager:true,  Officer:true,  DataEntry:true,  Viewer:false },
  { feature: "Image View",             Admin:true,  Manager:true,  Officer:true,  DataEntry:false, Viewer:true  },
  { feature: "Delete Image",           Admin:true,  Manager:true,  Officer:false, DataEntry:false, Viewer:false },
  { feature: "View Reports",           Admin:true,  Manager:true,  Officer:true,  DataEntry:false, Viewer:true  },
  { feature: "Export Reports",         Admin:true,  Manager:true,  Officer:false, DataEntry:false, Viewer:false },
];

const AVATAR_COLORS = ["#3d8ef0","#2ec08b","#f5933a","#9b6ef5","#f5c842","#f05a5a"];

const USER_API   = "http://localhost:5000/api/users";
const CLIENT_API = "http://localhost:5000/api/clients";
const BRANCH_API = "http://localhost:5000/api/branches";

export default function UserList() {
  const [users,         setUsers]         = useState([]);
  const [clients,       setClients]       = useState([]);
  const [branches,      setBranches]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [roleFilter,    setRoleFilter]    = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");
  const [showForm,      setShowForm]      = useState(false);
  const [editUser,      setEditUser]      = useState(null);
  const [showReset,     setShowReset]     = useState(null);
  const [showMatrix,    setShowMatrix]    = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [uRes, cRes, bRes] = await Promise.all([
        fetch(USER_API),
        fetch(CLIENT_API),
        fetch(BRANCH_API),
      ]);
      setUsers(Array.isArray(await uRes.json()) ? await fetch(USER_API).then(r=>r.json()) : []);
      setClients(Array.isArray(await cRes.json()) ? await fetch(CLIENT_API).then(r=>r.json()) : []);
      setBranches(Array.isArray(await bRes.json()) ? await fetch(BRANCH_API).then(r=>r.json()) : []);
    } catch {
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Reload just users
  const reloadUsers = async () => {
    const res  = await fetch(USER_API);
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  const filtered = users.filter(u =>
    (u.fullName.toLowerCase().includes(search.toLowerCase()) ||
     u.username.toLowerCase().includes(search.toLowerCase()) ||
     u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter   || u.role === roleFilter) &&
    (!statusFilter || (statusFilter === "active" ? u.status : !u.status))
  );

  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r.id] = users.filter(u => u.role === r.id).length;
    return acc;
  }, {});

  // ── CREATE or EDIT ──
  const saveUser = async (data) => {
    try {
      if (editUser) {
        const res    = await fetch(`${USER_API}/${editUser.id}`, {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) { showToast(result.message, "error"); return; }
        setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...result.data } : u));
        setShowForm(false);
        showToast(`✅ "${result.data.fullName}" updated`);
      } else {
        const res    = await fetch(USER_API, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) { showToast(result.message, "error"); return; }
        setUsers(prev => [...prev, result.data]);
        setShowForm(false);
        showToast(`✅ User "${result.data.fullName}" created`);
      }
    } catch {
      showToast("API Error — could not save user", "error");
    }
  };

  // ── TOGGLE STATUS ──
  const toggleStatus = async (user) => {
    setActionLoading(user.id);
    try {
      const res    = await fetch(`${USER_API}/${user.id}/toggle-status`, { method: "PATCH" });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: result.data.status } : u));
      showToast(`Status → ${result.data.status ? "Active" : "Inactive"} for "${user.fullName}"`);
    } catch {
      showToast("API Error", "error");
    } finally { setActionLoading(null); }
  };

  // ── UNLOCK USER ──
  const unlockUser = async (user) => {
    setActionLoading(user.id);
    try {
      const res    = await fetch(`${USER_API}/${user.id}/unlock`, { method: "PATCH" });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isLocked: false, failedAttempts: 0 } : u));
      showToast(`🔓 "${user.fullName}" unlocked`);
    } catch {
      showToast("API Error", "error");
    } finally { setActionLoading(null); }
  };

  // ── RESET PASSWORD ──
  const resetPassword = async (userId, newPassword) => {
    try {
      const res    = await fetch(`${USER_API}/${userId}/reset-password`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ newPassword }),
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }
      showToast(`🔑 Password reset for "${showReset.fullName}"`);
      setShowReset(null);
    } catch {
      showToast("API Error", "error");
    }
  };

  const getRoleBadgeClass = (role) => {
    const map = { Admin:"role-admin", Manager:"role-manager", Officer:"role-officer", DataEntry:"role-dataentry", Viewer:"role-viewer" };
    return map[role] || "";
  };
  const getRoleLabel = (role) => ROLES.find(r => r.id === role)?.label || role;
  const getClient = (id) => clients.find(c => c.id === Number(id))?.name || "—";
  const getBranch = (id) => branches.find(b => b.id === Number(id))?.name || "—";

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="page-title">User Management</div>
            <div className="page-subtitle">FR-UM-01/02 — Manage users, roles and access control</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setShowMatrix(true)}>
              📋 Permission Matrix
            </button>
            <button className="btn btn-gold" onClick={() => { setEditUser(null); setShowForm(true); }}>
              + Add New User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {ROLES.map((r, i) => (
            <div className="stat-card" key={r.id}>
              <div className="stat-icon" style={{ background: `${r.color}22` }}>
                {["👑","🏢","👔","📝","👁"][i]}
              </div>
              <div>
                <div className="stat-val">{roleCounts[r.id] || 0}</div>
                <div className="stat-label">{r.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input className="fi" placeholder="Search by name, username or email..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="fs" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
          <select className="fs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn btn-outline btn-sm" onClick={reloadUsers}>🔄 Refresh</button>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="tcard-head">
            <div>
              <div className="tc-title">User Directory</div>
              <div className="tc-sub">{filtered.length} user{filtered.length !== 1 ? "s" : ""} found</div>
            </div>
            <button className="btn btn-outline btn-sm">📥 Export</button>
          </div>

          {loading ? (
            <div className="empty-state"><span className="spinner" style={{marginRight:8}}/> Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{fontSize:40,opacity:.3,marginBottom:10}}>👤</div>
              <p>No users found</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Assigned Client</th>
                  <th>Assigned Branch</th>
                  <th>Mobile</th>
                  <th>Login Attempts</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td className="pr">
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div className="u-avatar" style={{background:AVATAR_COLORS[i%AVATAR_COLORS.length]}}>
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{u.fullName}</div>
                          <div style={{fontSize:11,color:"var(--tm)"}}>{u.email}</div>
                          {u.isLocked && <span className="locked-badge">🔒 Locked</span>}
                        </div>
                      </div>
                    </td>
                    <td><span className="mono">{u.username}</span></td>
                    <td><span className={`role-badge ${getRoleBadgeClass(u.role)}`}>{getRoleLabel(u.role)}</span></td>
                    <td style={{fontSize:12}}>{getClient(u.assignedClientId)}</td>
                    <td style={{fontSize:12}}>{getBranch(u.assignedBranchId)}</td>
                    <td style={{fontFamily:"var(--mono)",fontSize:12}}>{u.mobile || "—"}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontFamily:"var(--mono)",fontSize:12,color:u.failedAttempts >= 3 ? "var(--red)" : "var(--ts)"}}>
                          {u.failedAttempts || 0}/5
                        </span>
                        {u.isLocked && (
                          <button className="btn btn-sm" style={{padding:"2px 7px",fontSize:10,background:"#f5c84222",color:"var(--gold)",border:"1px solid #f5c84244"}}
                            onClick={() => unlockUser(u)} disabled={actionLoading === u.id}>
                            🔓 Unlock
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        className={`status-toggle ${u.status ? "active" : "inactive"}`}
                        onClick={() => toggleStatus(u)}
                        disabled={actionLoading === u.id}
                      >
                        {actionLoading === u.id ? <span className="spinner"/> : <span className="sdot"/>}
                        {u.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn" title="Edit" onClick={() => { setEditUser(u); setShowForm(true); }}>✏️</button>
                        <button className="action-btn" title="Reset Password" onClick={() => setShowReset(u)}>🔑</button>
                        <button className="action-btn danger" title="Deactivate" onClick={() => toggleStatus(u)} disabled={actionLoading === u.id}>🚫</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="pagination">
            <div className="page-info">Showing 1–{filtered.length} of {filtered.length}</div>
            <div className="page-btns">
              <button className="page-btn">‹</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">›</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <UserFormModal
          user={editUser}
          clients={clients.filter(c => c.status)}
          branches={branches.filter(b => b.status)}
          onSave={saveUser}
          onClose={() => setShowForm(false)}
        />
      )}
      {showReset && (
        <ResetPasswordModal
          user={showReset}
          onConfirm={resetPassword}
          onClose={() => setShowReset(null)}
        />
      )}
      {showMatrix && (
        <PermissionMatrixModal onClose={() => setShowMatrix(false)} />
      )}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </>
  );
}

/* ── User Form Modal ── */
function UserFormModal({ user, clients, branches, onSave, onClose }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    fullName:         user?.fullName         || "",
    username:         user?.username         || "",
    email:            user?.email            || "",
    mobile:           user?.mobile           || "",
    password:         "",
    role:             user?.role             || "Viewer",
    assignedClientId: user?.assignedClientId || "",
    assignedBranchId: user?.assignedBranchId || "",
    status:           user?.status           !== undefined ? user.status : true,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtBranches = branches.filter(b => String(b.clientId) === String(form.assignedClientId));

  const handleSubmit = () => {
    if (!form.fullName.trim()) return alert("Full Name is required.");
    if (!form.username.trim()) return alert("Username is required.");
    if (!form.email.trim())    return alert("Email is required.");
    if (!isEdit && !form.password.trim()) return alert("Password is required for new users.");
    const data = {
      fullName:         form.fullName,
      username:         form.username,
      email:            form.email,
      mobile:           form.mobile,
      role:             form.role,
      assignedClientId: form.assignedClientId ? Number(form.assignedClientId) : null,
      assignedBranchId: form.assignedBranchId ? Number(form.assignedBranchId) : null,
      status:           form.status,
    };
    if (!isEdit) data.password = form.password;
    onSave(data);
  };

  const selectedRole = ROLES.find(r => r.id === form.role);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-title">{isEdit ? "Edit User" : "Add New User"}</div>
            <div className="modal-sub">{isEdit ? `Editing: ${user.username}` : "FR-UM-01: Create a new system user"}</div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">

            <div className="fsect">Personal Information</div>

            <div className="fg">
              <label className="flabel">Full Name <span className="req">*</span></label>
              <input className="finput" placeholder="e.g. Ramesh Shinde" value={form.fullName} onChange={e => set("fullName", e.target.value)} />
            </div>
            <div className="fg">
              <label className="flabel">Username <span className="req">*</span></label>
              <input className="finput" placeholder="e.g. ramesh.shinde" value={form.username} onChange={e => set("username", e.target.value)} disabled={isEdit} />
              {isEdit && <span className="fhint">Username cannot be changed after creation</span>}
            </div>
            <div className="fg">
              <label className="flabel">Email <span className="req">*</span></label>
              <input className="finput" type="email" placeholder="user@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div className="fg">
              <label className="flabel">Mobile</label>
              <input className="finput" placeholder="10-digit mobile" value={form.mobile} onChange={e => set("mobile", e.target.value)} maxLength={10} />
            </div>

            {!isEdit && (
              <div className="fg full">
                <label className="flabel">Password <span className="req">*</span></label>
                <input className="finput" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={e => set("password", e.target.value)} />
                <span className="fhint">User should change this on first login</span>
              </div>
            )}

            <hr className="fdiv" />
            <div className="fsect">Role & Access</div>

            <div className="fg full">
              <label className="flabel">Role <span className="req">*</span></label>
              <select className="fsel" value={form.role} onChange={e => set("role", e.target.value)}>
                {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
              {selectedRole && (
                <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                  {PERMISSIONS.filter(p => p[form.role]).map(p => (
                    <span key={p.feature} style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:`${selectedRole.color}18`,color:selectedRole.color,border:`1px solid ${selectedRole.color}33`,fontWeight:600}}>
                      ✓ {p.feature}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="fg">
              <label className="flabel">Assigned Client</label>
              <select className="fsel" value={form.assignedClientId} onChange={e => { set("assignedClientId", e.target.value); set("assignedBranchId", ""); }}>
                <option value="">— All Clients —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}
              </select>
              <span className="fhint">Restricts access to this client's data</span>
            </div>
            <div className="fg">
              <label className="flabel">Assigned Branch</label>
              <select className="fsel" value={form.assignedBranchId} onChange={e => set("assignedBranchId", e.target.value)} disabled={!form.assignedClientId}>
                <option value="">— All Branches —</option>
                {filtBranches.map(b => <option key={b.id} value={b.id}>{b.code} – {b.name}</option>)}
              </select>
            </div>

            <hr className="fdiv" />
            <div className="fsect">Status</div>

            <div className="fg">
              <label className="flabel">User Status</label>
              <div className="toggle-wrap">
                <button className={`toggle${form.status ? " on" : ""}`} onClick={() => set("status", !form.status)} />
                <span className={`toggle-lbl ${form.status ? "on" : "off"}`}>{form.status ? "Active" : "Inactive"}</span>
              </div>
              {!form.status && <span className="fhint" style={{color:"var(--red)"}}>Inactive users cannot log in</span>}
            </div>

          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? "💾 Save Changes" : "✅ Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Reset Password Modal ── */
function ResetPasswordModal({ user, onConfirm, onClose }) {
  const [pwd,  setPwd]  = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!pwd.trim())      return alert("Enter new password.");
    if (pwd.length < 8)   return alert("Password must be at least 8 characters.");
    if (pwd !== pwd2)     return alert("Passwords do not match.");
    setLoading(true);
    await onConfirm(user.id, pwd);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-head">
          <div><div className="modal-title">Reset Password</div><div className="modal-sub">FR-UM-02: Force password reset</div></div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="reset-info" style={{marginBottom:16}}>
            🔑 Resetting password for <b>{user.fullName}</b> ({user.username})<br/>
            The user will be required to log in with the new password.
          </div>
          <div className="form-grid">
            <div className="fg full">
              <label className="flabel">New Password <span className="req">*</span></label>
              <input className="finput" type="password" placeholder="Minimum 8 characters" value={pwd} onChange={e => setPwd(e.target.value)} />
            </div>
            <div className="fg full">
              <label className="flabel">Confirm Password <span className="req">*</span></label>
              <input className="finput" type="password" placeholder="Re-enter password" value={pwd2} onChange={e => setPwd2(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner"/> : "🔑"} Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Permission Matrix Modal ── */
function PermissionMatrixModal({ onClose }) {
  const roles = ["Admin","Manager","Officer","DataEntry","Viewer"];
  const labels = ["Admin","Manager","Officer","Data Entry","Viewer"];
  const colors = ["#f5c842","#3d8ef0","#2ec08b","#f5933a","#9b6ef5"];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{maxWidth:760}}>
        <div className="modal-head">
          <div><div className="modal-title">📋 Permission Matrix</div><div className="modal-sub">Role-Based Access Control — all 5 roles</div></div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="perm-grid">
            <div className="perm-head">Feature / Action</div>
            {labels.map((l,i) => (
              <div key={l} className="perm-head" style={{color:colors[i]}}>{l}</div>
            ))}
            {PERMISSIONS.map((p, pi) => (
              <>
                <div key={`l${pi}`} className="perm-row-label" style={{background: pi%2===0 ? "transparent" : "#ffffff03"}}>{p.feature}</div>
                {roles.map(r => (
                  <div key={`${pi}${r}`} className="perm-cell" style={{background: pi%2===0 ? "transparent" : "#ffffff03"}}>
                    {p[r]
                      ? <span style={{color:"var(--green)",fontWeight:700}}>✔</span>
                      : <span style={{color:"var(--border-light)"}}>✘</span>
                    }
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
