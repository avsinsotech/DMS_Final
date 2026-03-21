import { useState, useEffect } from "react";

const css = `
  .page{padding:28px;min-height:100vh;}
  .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;}
  .page-title{font-size:26px;font-weight:800;color:#0f1c33;letter-spacing:-.5px;}
  .page-subtitle{font-size:13px;color:#8a9ab8;margin-top:4px;}

  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px;}
  .stat-card{background:#fff;border:1px solid #e2eaf4;border-radius:12px;padding:18px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 10px rgba(15,28,51,0.05);transition:transform .2s,box-shadow .2s;}
  .stat-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(15,28,51,0.08);}
  .stat-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;}
  .stat-val{font-size:24px;font-weight:800;color:#0f1c33;font-family:'JetBrains Mono',monospace;line-height:1;}
  .stat-label{font-size:12px;color:#4a5e80;margin-top:3px;}

  /* Main grid */
  .groups-layout{display:grid;grid-template-columns:1fr 380px;gap:18px;}

  /* Card */
  .card{background:#fff;border:1px solid #e2eaf4;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(15,28,51,0.05);}
  .card-head{padding:16px 20px;border-bottom:1px solid #f0f4fb;display:flex;align-items:center;justify-content:space-between;}
  .card-title{font-size:15px;font-weight:700;color:#0f1c33;}
  .card-sub{font-size:12px;color:#8a9ab8;margin-top:2px;}
  .card-body{padding:20px;}

  /* Group list */
  .group-list{display:flex;flex-direction:column;gap:10px;}
  .group-item{border:1.5px solid #e2eaf4;border-radius:10px;padding:14px 16px;cursor:pointer;transition:all .15s;background:#fafcff;}
  .group-item:hover{border-color:#2563eb;background:#eff4ff;}
  .group-item.selected{border-color:#2563eb;background:#eff4ff;box-shadow:0 0 0 3px rgba(37,99,235,0.08);}
  .gi-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
  .gi-name{font-size:14px;font-weight:700;color:#0f1c33;}
  .gi-code{font-family:'JetBrains Mono',monospace;font-size:10px;color:#2563eb;background:#eff4ff;padding:2px 7px;border-radius:4px;border:1px solid #c7d9f8;}
  .gi-client{font-size:11px;color:#8a9ab8;margin-bottom:8px;}
  .gi-desc{font-size:12px;color:#4a5e80;margin-bottom:10px;line-height:1.5;}
  .gi-footer{display:flex;align-items:center;justify-content:space-between;}
  .gi-count{display:flex;align-items:center;gap:5px;font-size:12px;color:#4a5e80;}
  .gi-count-dot{width:6px;height:6px;border-radius:50%;background:#2563eb;}
  .gi-actions{display:flex;gap:6px;}
  .gi-btn{width:26px;height:26px;border-radius:6px;border:1px solid #e2eaf4;background:#f0f4fb;color:#4a5e80;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
  .gi-btn:hover{border-color:#2563eb;color:#2563eb;}
  .gi-btn.danger:hover{border-color:#dc2626;color:#dc2626;}

  /* Members panel */
  .members-panel{display:flex;flex-direction:column;height:100%;}
  .no-group-selected{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center;color:#8a9ab8;}
  .ngs-icon{font-size:48px;opacity:.3;margin-bottom:12px;}

  /* Member list */
  .member-list{display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto;}
  .member-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #f0f4fb;border-radius:8px;background:#fafcff;}
  .member-avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;}
  .member-info{flex:1;min-width:0;}
  .member-name{font-size:13px;font-weight:600;color:#0f1c33;}
  .member-meta{font-size:11px;color:#8a9ab8;margin-top:1px;}
  .member-remove{width:24px;height:24px;border-radius:5px;border:1px solid #e2eaf4;background:#f0f4fb;color:#8a9ab8;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .15s;}
  .member-remove:hover{border-color:#dc2626;color:#dc2626;background:#fff5f5;}

  /* Add member dropdown */
  .add-member-wrap{margin-top:14px;padding-top:14px;border-top:1px solid #f0f4fb;}
  .add-member-title{font-size:11px;font-weight:700;color:#8a9ab8;text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;}
  .add-member-row{display:flex;gap:8px;}

  /* Buttons */
  .btn{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all .15s;white-space:nowrap;}
  .btn-primary{background:#2563eb;color:#fff;}
  .btn-primary:hover{filter:brightness(1.08);transform:translateY(-1px);}
  .btn-gold{background:#b8860b;color:#fff;}
  .btn-gold:hover{filter:brightness(1.1);transform:translateY(-1px);}
  .btn-outline{background:#fff;color:#4a5e80;border:1px solid #d8e4f0;}
  .btn-outline:hover{border-color:#2563eb;color:#2563eb;}
  .btn-danger{background:#fff5f5;color:#dc2626;border:1px solid #fca5a5;}
  .btn-danger:hover{background:#fef2f2;}
  .btn-sm{padding:5px 12px;font-size:12px;}
  .btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important;}

  /* Filter bar */
  .filter-bar{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;}
  .fi{flex:1;min-width:160px;background:#f0f4fb;border:1px solid #e2eaf4;border-radius:8px;padding:9px 13px;font-size:13px;color:#0f1c33;font-family:'DM Sans',sans-serif;outline:none;}
  .fi:focus{border-color:#2563eb;}
  .fs{background:#f0f4fb;border:1px solid #e2eaf4;border-radius:8px;padding:9px 13px;font-size:13px;color:#4a5e80;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer;}

  /* Form inputs */
  .fsel,.finput{background:#f0f4fb;border:1.5px solid #e2eaf4;border-radius:8px;padding:9px 13px;font-size:13px;color:#0f1c33;font-family:'DM Sans',sans-serif;outline:none;width:100%;transition:border-color .15s;}
  .fsel:focus,.finput:focus{border-color:#2563eb;background:#eff4ff;}
  .finput::placeholder{color:#8a9ab8;}
  .ftarea{background:#f0f4fb;border:1.5px solid #e2eaf4;border-radius:8px;padding:9px 13px;font-size:13px;color:#0f1c33;font-family:'DM Sans',sans-serif;outline:none;width:100%;resize:vertical;min-height:64px;}
  .ftarea:focus{border-color:#2563eb;}

  .fg{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
  .fg:last-child{margin-bottom:0;}
  .flabel{font-size:11px;font-weight:700;color:#4a5e80;text-transform:uppercase;letter-spacing:.6px;}
  .flabel .req{color:#dc2626;margin-left:3px;}
  .fhint{font-size:11px;color:#8a9ab8;}

  /* Role badge */
  .role-badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;}

  /* Empty state */
  .empty-state{text-align:center;padding:40px 20px;color:#8a9ab8;}

  /* Toast */
  .toast{position:fixed;bottom:28px;right:28px;z-index:2000;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:9px;animation:slideIn .25s ease;box-shadow:0 4px 20px rgba(0,0,0,.15);}
  .toast.success{background:#f0fdf4;color:#16a34a;border:1px solid #86efac;}
  .toast.error{background:#fff5f5;color:#dc2626;border:1px solid #fca5a5;}
  @keyframes slideIn{from{transform:translateX(80px);opacity:0;}to{transform:translateX(0);opacity:1;}}

  /* Modal */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;}
  .modal{background:#fff;border:1px solid #e2eaf4;border-radius:14px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(15,28,51,0.15);animation:slideUp .2s ease;}
  @keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
  .modal-head{padding:20px 24px;border-bottom:1px solid #f0f4fb;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:1;}
  .modal-title{font-size:16px;font-weight:700;color:#0f1c33;}
  .modal-sub{font-size:12px;color:#8a9ab8;margin-top:2px;}
  .modal-body{padding:24px;}
  .modal-footer{padding:14px 24px;border-top:1px solid #f0f4fb;display:flex;justify-content:flex-end;gap:10px;background:#fff;position:sticky;bottom:0;}
  .close-btn{width:30px;height:30px;border-radius:7px;background:#f0f4fb;border:none;color:#4a5e80;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;}
  .close-btn:hover{background:#fef2f2;color:#dc2626;}

  .spinner{width:16px;height:16px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite;display:inline-block;}
  @keyframes spin{to{transform:rotate(360deg);}}
`;

const USER_API   = "http://localhost:5000/api/users";
const GROUP_API  = "http://localhost:5000/api/user-groups";
const CLIENT_API = "http://localhost:5000/api/clients";

const ROLE_COLORS = {
  Admin:"#b8860b", Manager:"#2563eb", Officer:"#16a34a",
  DataEntry:"#c2410c", Viewer:"#7c3aed",
};
const AVATAR_COLORS = ["#3d8ef0","#2ec08b","#f5933a","#9b6ef5","#f5c842","#f05a5a"];

export default function UserGroups() {
  const [groups,        setGroups]        = useState([]);
  const [users,         setUsers]         = useState([]);
  const [clients,       setClients]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [search,        setSearch]        = useState("");
  const [clientFilter,  setClientFilter]  = useState("");
  const [showForm,      setShowForm]      = useState(false);
  const [editGroup,     setEditGroup]     = useState(null);
  const [addUserId,     setAddUserId]     = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [gRes, uRes, cRes] = await Promise.all([
        fetch(GROUP_API),
        fetch(USER_API),
        fetch(CLIENT_API),
      ]);
      const gData = await gRes.json();
      const uData = await uRes.json();
      const cData = await cRes.json();
      setGroups(Array.isArray(gData) ? gData : []);
      setUsers(Array.isArray(uData)  ? uData  : []);
      setClients(Array.isArray(cData) ? cData : []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const getUser   = (id) => users.find(u => u.id === Number(id));
  const getClient = (id) => clients.find(c => c.id === Number(id));

  // Refresh selected group after changes
  const refreshGroup = async (groupId) => {
    try {
      const res  = await fetch(`${GROUP_API}/${groupId}`);
      const data = await res.json();
      setGroups(prev => prev.map(g => g.id === groupId ? data : g));
      setSelectedGroup(data);
    } catch {}
  };

  // ── Create / Edit group ──
  const saveGroup = async (data) => {
    try {
      setActionLoading(true);
      if (editGroup) {
        // No PUT endpoint — simulate local update
        setGroups(prev => prev.map(g => g.id === editGroup.id ? { ...g, ...data } : g));
        if (selectedGroup?.id === editGroup.id) setSelectedGroup(g => ({ ...g, ...data }));
        showToast(`✅ Group "${data.name}" updated`);
      } else {
        const res    = await fetch(GROUP_API, {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) { showToast(result.message, "error"); return; }
        setGroups(prev => [...prev, result.data]);
        showToast(`✅ Group "${result.data.name}" created`);
      }
      setShowForm(false);
      setEditGroup(null);
    } catch { showToast("API Error", "error"); }
    finally  { setActionLoading(false); }
  };

  // ── Add user to group ──
  const addMember = async () => {
    if (!addUserId || !selectedGroup) return;
    const alreadyIn = (selectedGroup.userIds || []).includes(Number(addUserId));
    if (alreadyIn) { showToast("User already in this group", "error"); return; }

    try {
      setActionLoading(true);
      const res    = await fetch(`${GROUP_API}/${selectedGroup.id}/add-user`, {
        method:"PATCH", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId: Number(addUserId) }),
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }
      await refreshGroup(selectedGroup.id);
      setAddUserId("");
      const u = getUser(addUserId);
      showToast(`✅ ${u?.fullName || "User"} added to group`);
    } catch { showToast("API Error", "error"); }
    finally  { setActionLoading(false); }
  };

  // ── Remove user from group ──
  const removeMember = async (userId) => {
    if (!selectedGroup) return;
    try {
      setActionLoading(true);
      const res = await fetch(`${GROUP_API}/${selectedGroup.id}/remove-user`, {
        method:"PATCH", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId }),
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }
      await refreshGroup(selectedGroup.id);
      const u = getUser(userId);
      showToast(`🗑 ${u?.fullName || "User"} removed from group`);
    } catch { showToast("API Error", "error"); }
    finally  { setActionLoading(false); }
  };

  // Filtered groups
  const filtered = groups.filter(g =>
    (!search      || g.name.toLowerCase().includes(search.toLowerCase())) &&
    (!clientFilter || String(g.clientId) === clientFilter)
  );

  // Users not yet in selected group
  const availableUsers = users.filter(u =>
    !(selectedGroup?.userIds || []).includes(u.id)
  );

  const selectedGroupMembers = (selectedGroup?.userIds || [])
    .map(id => getUser(id))
    .filter(Boolean);

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="page-title">User Groups</div>
            <div className="page-subtitle">FR-UM-04 — Create and manage user groups for bulk access provisioning</div>
          </div>
          <button className="btn btn-gold" onClick={() => { setEditGroup(null); setShowForm(true); }}>
            + Create New Group
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <StatCard icon="👥" val={groups.length}     label="Total Groups"   bg="#3d8ef0" />
          <StatCard icon="👤" val={users.length}      label="Total Users"    bg="#2ec08b" />
          <StatCard icon="🏢" val={new Set(groups.filter(g=>g.clientId).map(g=>g.clientId)).size} label="Linked Clients" bg="#f5933a" />
          <StatCard icon="🔗" val={groups.reduce((a,g) => a + (g.userIds?.length||0), 0)} label="Total Memberships" bg="#9b6ef5" />
        </div>

        {/* Main layout */}
        <div className="groups-layout">

          {/* Left — Group List */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Group Directory</div>
                <div className="card-sub">{filtered.length} group{filtered.length !== 1 ? "s" : ""}</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={fetchAll}>🔄 Refresh</button>
            </div>
            <div className="card-body">
              <div className="filter-bar">
                <input className="fi" placeholder="Search groups..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="fs" value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
                  <option value="">All Clients</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {loading ? (
                <div className="empty-state"><span className="spinner" /> Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div style={{fontSize:40,opacity:.3,marginBottom:10}}>👥</div>
                  <p>No groups found. Create your first group!</p>
                </div>
              ) : (
                <div className="group-list">
                  {filtered.map(g => (
                    <div
                      key={g.id}
                      className={`group-item${selectedGroup?.id === g.id ? " selected" : ""}`}
                      onClick={() => setSelectedGroup(g)}
                    >
                      <div className="gi-top">
                        <div className="gi-name">{g.name}</div>
                        <span className="gi-code">GRP-{String(g.id).padStart(3,"0")}</span>
                      </div>
                      {g.clientId && (
                        <div className="gi-client">🏢 {getClient(g.clientId)?.name || "—"}</div>
                      )}
                      {g.description && <div className="gi-desc">{g.description}</div>}
                      <div className="gi-footer">
                        <div className="gi-count">
                          <div className="gi-count-dot"/>
                          {g.userIds?.length || 0} member{(g.userIds?.length || 0) !== 1 ? "s" : ""}
                        </div>
                        <div className="gi-actions" onClick={e => e.stopPropagation()}>
                          <button className="gi-btn" title="Edit" onClick={() => { setEditGroup(g); setShowForm(true); }}>✏️</button>
                          <button className="gi-btn" title="Select & Manage Members" onClick={() => setSelectedGroup(g)}>👤</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Members Panel */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">
                  {selectedGroup ? `Members — ${selectedGroup.name}` : "Group Members"}
                </div>
                <div className="card-sub">
                  {selectedGroup
                    ? `${selectedGroupMembers.length} member${selectedGroupMembers.length !== 1 ? "s" : ""} in this group`
                    : "Select a group to manage members"}
                </div>
              </div>
              {selectedGroup && (
                <span style={{fontSize:10,fontWeight:700,background:"#eff4ff",color:"#2563eb",padding:"3px 9px",borderRadius:20,border:"1px solid #c7d9f8"}}>
                  GRP-{String(selectedGroup.id).padStart(3,"0")}
                </span>
              )}
            </div>
            <div className="card-body">
              {!selectedGroup ? (
                <div className="no-group-selected">
                  <div className="ngs-icon">👈</div>
                  <p>Click a group on the left to view and manage its members</p>
                </div>
              ) : (
                <>
                  {/* Client assigned */}
                  {selectedGroup.clientId && (
                    <div style={{background:"#eff4ff",border:"1px solid #c7d9f8",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:12,color:"#2563eb",display:"flex",alignItems:"center",gap:8}}>
                      🏢 Assigned to: <b>{getClient(selectedGroup.clientId)?.name}</b>
                    </div>
                  )}

                  {/* Members list */}
                  {selectedGroupMembers.length === 0 ? (
                    <div className="empty-state" style={{padding:"24px 20px"}}>
                      <div style={{fontSize:32,opacity:.3,marginBottom:8}}>👤</div>
                      <p style={{fontSize:13}}>No members yet — add users below</p>
                    </div>
                  ) : (
                    <div className="member-list">
                      {selectedGroupMembers.map((u, i) => (
                        <div key={u.id} className="member-item">
                          <div className="member-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                            {u.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="member-info">
                            <div className="member-name">{u.fullName}</div>
                            <div className="member-meta">
                              @{u.username} ·
                              <span className="role-badge" style={{ marginLeft:4, background:`${ROLE_COLORS[u.role]}18`, color:ROLE_COLORS[u.role], border:`1px solid ${ROLE_COLORS[u.role]}33` }}>
                                {u.role}
                              </span>
                            </div>
                          </div>
                          <button
                            className="member-remove"
                            title="Remove from group"
                            onClick={() => removeMember(u.id)}
                            disabled={actionLoading}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add member */}
                  <div className="add-member-wrap">
                    <div className="add-member-title">Add Member</div>
                    <div className="add-member-row">
                      <select className="fsel" value={addUserId} onChange={e => setAddUserId(e.target.value)} style={{ flex:1 }}>
                        <option value="">— Select user to add —</option>
                        {availableUsers.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.fullName} ({u.role}) — @{u.username}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={addMember}
                        disabled={!addUserId || actionLoading}
                      >
                        {actionLoading ? <span className="spinner"/> : "+ Add"}
                      </button>
                    </div>
                    {availableUsers.length === 0 && (
                      <p style={{fontSize:11,color:"#8a9ab8",marginTop:6}}>All users are already members of this group</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Create/Edit Group Modal */}
      {showForm && (
        <GroupFormModal
          group={editGroup}
          clients={clients}
          onSave={saveGroup}
          onClose={() => { setShowForm(false); setEditGroup(null); }}
          loading={actionLoading}
        />
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </>
  );
}

function StatCard({ icon, val, label, bg }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background:`${bg}22` }}>{icon}</div>
      <div>
        <div className="stat-val">{val}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function GroupFormModal({ group, clients, onSave, onClose, loading }) {
  const isEdit = !!group;
  const [form, setForm] = useState({
    name:        group?.name        || "",
    description: group?.description || "",
    clientId:    group?.clientId    || "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Group name is required");
    onSave({
      name:        form.name,
      description: form.description,
      clientId:    form.clientId ? Number(form.clientId) : null,
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-title">{isEdit ? "Edit Group" : "Create New Group"}</div>
            <div className="modal-sub">FR-UM-04: {isEdit ? "Update group details" : "Define a new user group"}</div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">

          <div className="fg">
            <label className="flabel">Group Name <span className="req">*</span></label>
            <input className="finput" placeholder="e.g. Nashik KYC Team" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>

          <div className="fg">
            <label className="flabel">Description</label>
            <textarea className="ftarea" placeholder="What is this group for?" value={form.description} onChange={e => set("description", e.target.value)} />
          </div>

          <div className="fg">
            <label className="flabel">Assign to Client</label>
            <select className="fsel" value={form.clientId} onChange={e => set("clientId", e.target.value)}>
              <option value="">— No specific client (global group) —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}
            </select>
            <span className="fhint">Assigning to a client restricts bulk access provisioning to that client only</span>
          </div>

          <div style={{background:"#eff4ff",border:"1px solid #c7d9f8",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#2563eb",marginTop:4}}>
            ℹ️ After creating the group, you can add users from the Members panel on the right.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner"/> : isEdit ? "💾 Save Changes" : "✅ Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
