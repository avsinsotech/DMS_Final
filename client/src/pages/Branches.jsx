import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }


  .page { padding: 28px; min-height: 100vh; background: var(--bg-main); }
  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .page-title { font-size: 26px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px; }
  .page-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; display: flex; align-items: center; gap: 14px; }
  .stat-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .stat-val { font-size: 24px; font-weight: 700; font-family: var(--mono); line-height: 1; }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 3px; }
  .stat-trend { font-size: 11px; color: var(--accent-green); margin-top: 4px; }

  .btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: var(--font); transition: all 0.15s; white-space: nowrap; }
  .btn-gold { background: var(--accent-gold); color: #0f1623; }
  .btn-gold:hover { background: #ffd44a; transform: translateY(-1px); }
  .btn-outline { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-light); }
  .btn-outline:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
  .btn-primary { background: var(--accent-blue); color: #fff; }
  .btn-primary:hover { background: #5aa0f7; transform: translateY(-1px); }
  .btn-danger { background: #f05a5a22; color: var(--accent-red); border: 1px solid #f05a5a44; }
  .btn-danger:hover { background: #f05a5a33; }
  .btn-sm { padding: 5px 12px; font-size: 12px; }

  .filter-bar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
  .filter-input { flex: 1; min-width: 200px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 8px; padding: 9px 14px; font-size: 13px; color: var(--text-primary); font-family: var(--font); outline: none; }
  .filter-input:focus { border-color: var(--accent-blue); }
  .filter-select { background: var(--bg-input); border: 1px solid var(--border); border-radius: 8px; padding: 9px 14px; font-size: 13px; color: var(--text-secondary); font-family: var(--font); outline: none; cursor: pointer; }
  .filter-select:focus { border-color: var(--accent-blue); color: var(--text-primary); }

  .table-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .table-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid var(--border); }
  .table-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
  .table-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th { padding: 11px 16px; font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; text-align: left; border-bottom: 1px solid var(--border); background: #f5f8ff; }
  .data-table td { padding: 13px 16px; font-size: 13px; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: #ffffff04; color: var(--text-primary); }
  .data-table td.primary { color: var(--text-primary); font-weight: 500; }

  .mono { font-family: var(--mono); font-size: 11px; color: var(--accent-blue); background: #3d8ef011; padding: 2px 6px; border-radius: 4px; }
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
  .badge-active { background: #2ec08b22; color: var(--accent-green); border: 1px solid #2ec08b33; }
  .badge-active .badge-dot { background: var(--accent-green); }
  .badge-inactive { background: #f05a5a22; color: var(--accent-red); border: 1px solid #f05a5a33; }
  .badge-inactive .badge-dot { background: var(--accent-red); }

  .client-chip { display: inline-flex; align-items: center; gap: 7px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 6px; padding: 4px 10px; }
  .chip-avatar { width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; }
  .chip-name { font-size: 12px; color: var(--text-secondary); }

  /* Status toggle button */
  .status-toggle { display: inline-flex; align-items: center; gap: 7px; padding: 4px 10px 4px 6px; border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; border: none; font-family: var(--font); transition: all 0.2s; }
  .status-toggle.active { background: #2ec08b22; color: var(--accent-green); border: 1px solid #2ec08b44; }
  .status-toggle.active:hover { background: #f05a5a22; color: var(--accent-red); border-color: #f05a5a44; }
  .status-toggle.inactive { background: #f05a5a22; color: var(--accent-red); border: 1px solid #f05a5a44; }
  .status-toggle.inactive:hover { background: #2ec08b22; color: var(--accent-green); border-color: #2ec08b44; }
  .status-toggle:disabled { opacity: 0.5; cursor: not-allowed; }
  .toggle-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  .action-btns { display: flex; gap: 6px; }
  .action-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-secondary); font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .action-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
  .action-btn.danger:hover { border-color: var(--accent-red); color: var(--accent-red); }
  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--border); }
  .page-info { font-size: 12px; color: var(--text-muted); }
  .page-btns { display: flex; gap: 6px; }
  .page-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-secondary); font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .page-btn:hover, .page-btn.active { background: var(--accent-blue); border-color: var(--accent-blue); color: #fff; }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.4; }

  .spinner { width: 16px; height: 16px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .toast { position: fixed; bottom: 28px; right: 28px; z-index: 2000; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 9px; animation: slideInRight 0.25s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
  .toast.success { background: #2ec08b22; color: var(--accent-green); border: 1px solid #2ec08b44; }
  .toast.error   { background: #f05a5a22; color: var(--accent-red);   border: 1px solid #f05a5a44; }
  @keyframes slideInRight { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; animation: fadeIn 0.15s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--bg-modal); border: 1px solid var(--border-light); border-radius: 14px; width: 100%; max-width: 620px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow); animation: slideUp 0.2s ease; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-head { padding: 22px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: var(--bg-modal); z-index: 1; }
  .modal-title { font-size: 17px; font-weight: 700; color: var(--text-primary); }
  .modal-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .modal-body { padding: 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; background: var(--bg-modal); position: sticky; bottom: 0; }
  .close-btn { width: 32px; height: 32px; border-radius: 8px; background: #ffffff10; border: none; color: var(--text-secondary); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .close-btn:hover { background: #f05a5a33; color: var(--accent-red); }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .form-group { display: flex; flex-direction: column; gap: 7px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.6px; }
  .form-label .req { color: var(--accent-red); margin-left: 3px; }
  .form-input, .form-select, .form-textarea { background: var(--bg-input); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 13px; color: var(--text-primary); font-family: var(--font); outline: none; transition: border-color 0.15s; width: 100%; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent-blue); }
  .form-input::placeholder { color: var(--text-muted); }
  .form-input:disabled { opacity: 0.5; cursor: not-allowed; }
  .form-textarea { resize: vertical; min-height: 72px; }
  .form-hint { font-size: 11px; color: var(--text-muted); }
  .form-divider { grid-column: 1 / -1; border: none; border-top: 1px solid var(--border); margin: 4px 0; }
  .form-section-title { grid-column: 1 / -1; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-blue); padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .toggle-wrap { display: flex; align-items: center; gap: 12px; }
  .toggle { width: 40px; height: 22px; background: var(--border-light); border-radius: 11px; position: relative; cursor: pointer; transition: background 0.2s; border: none; }
  .toggle.on { background: var(--accent-green); }
  .toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
  .toggle.on::after { transform: translateX(18px); }
  .toggle-label { font-size: 13px; font-weight: 600; }
  .toggle-label.on { color: var(--accent-green); }
  .toggle-label.off { color: var(--text-muted); }
  .info-box { grid-column: 1 / -1; background: #3d8ef011; border: 1px solid #3d8ef025; border-radius: 8px; padding: 11px 15px; font-size: 12px; color: var(--accent-blue); line-height: 1.6; }
  .confirm-icon { font-size: 40px; text-align: center; margin-bottom: 12px; }
  .confirm-text { text-align: center; color: var(--text-secondary); font-size: 14px; line-height: 1.6; }
  .confirm-name { color: var(--text-primary); font-weight: 600; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
`;

const MANAGERS = ["Jayant Kulkarni", "Pravin Patil", "Yogesh Vagare", "Suresh Kadam", "Anita Joshi", "Priya Patil", "Walmik Darade"];
const CL_COLORS = { 1: "#3d8ef0", 2: "#2ec08b", 3: "#f5933a", 4: "#9b6ef5" };

const BRANCH_API = "http://localhost:5000/api/branches";
const CLIENT_API = "http://localhost:5000/api/clients";

export default function Branches() {
  const [branches,       setBranches]       = useState([]);
  const [clients,        setClients]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState("");
  const [clientFilter,   setClientFilter]   = useState("");
  const [statusFilter,   setStatusFilter]   = useState("");
  const [showForm,       setShowForm]       = useState(false);
  const [editBranch,     setEditBranch]     = useState(null);
  const [deleteTarget,   setDeleteTarget]   = useState(null);
  const [toast,          setToast]          = useState(null);
  const [actionLoading,  setActionLoading]  = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch branches and clients on mount ──
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [brRes, clRes] = await Promise.all([
        fetch(BRANCH_API),
        fetch(CLIENT_API),
      ]);
      const brData = await brRes.json();
      const clData = await clRes.json();
      setBranches(Array.isArray(brData) ? brData : []);
      setClients(Array.isArray(clData) ? clData : []);
    } catch (err) {
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const getClient = (id) => clients.find(c => c.id === id);

  const filtered = branches.filter(b =>
    (b.name.toLowerCase().includes(search.toLowerCase()) ||
     b.code.toLowerCase().includes(search.toLowerCase())) &&
    (!clientFilter || String(b.clientId) === clientFilter) &&
    (!statusFilter || (statusFilter === "active" ? b.status : !b.status))
  );

  const activeCount   = branches.filter(b => b.status).length;
  const inactiveCount = branches.filter(b => !b.status).length;
  const clientCount   = new Set(branches.map(b => b.clientId)).size;

  // ── CREATE or EDIT branch ──
  const saveBranch = async (data) => {
    try {
      // EDIT → PUT
      if (editBranch) {
        const res = await fetch(`${BRANCH_API}/${editBranch.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) { showToast(result.message, "error"); return; }

        setBranches(prev =>
          prev.map(b => b.id === editBranch.id ? { ...b, ...result.data } : b)
        );
        setShowForm(false);
        showToast(`✅ "${result.data.name}" updated successfully`);

      // CREATE → POST
      } else {
        const res = await fetch(BRANCH_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) { showToast(result.message, "error"); return; }

        setBranches(prev => [...prev, result.data]);
        setShowForm(false);
        showToast(`✅ Branch "${result.data.name}" created successfully`);
      }
    } catch (err) {
      showToast("API Error — could not save branch", "error");
    }
  };

  // ── TOGGLE STATUS (Active ↔ Inactive) ──
  const toggleStatus = async (branch) => {
    setActionLoading(branch.id);
    try {
      const res = await fetch(`${BRANCH_API}/${branch.id}/toggle-status`, {
        method: "PATCH",
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }

      setBranches(prev =>
        prev.map(b => b.id === branch.id ? { ...b, status: result.data.status } : b)
      );
      const newStatus = result.data.status ? "Active" : "Inactive";
      showToast(`Status changed to ${newStatus} for "${branch.name}"`);
    } catch (err) {
      showToast("API Error — could not toggle status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── SOFT DELETE (deactivate) ──
  const doDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      const res = await fetch(`${BRANCH_API}/${deleteTarget.id}/deactivate`, {
        method: "PATCH",
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); setDeleteTarget(null); return; }

      setBranches(prev =>
        prev.map(b => b.id === deleteTarget.id ? { ...b, status: false } : b)
      );
      showToast(`🗑 "${deleteTarget.name}" deactivated (soft delete)`);
      setDeleteTarget(null);
    } catch (err) {
      showToast("API Error — could not deactivate branch", "error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="page-title">Branch Management</div>
            <div className="page-subtitle">Manage branches across all clients (FR-CM-03 / FR-CM-04)</div>
          </div>
          <button className="btn btn-gold" onClick={() => { setEditBranch(null); setShowForm(true); }}>
            + Add New Branch
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <StatCard icon="🌿" val={branches.length}  label="Total Branches"  trend={`Across ${clientCount} clients`} bg="#3d8ef0" />
          <StatCard icon="✅" val={activeCount}       label="Active"          trend="Operational"                     bg="#2ec08b" />
          <StatCard icon="🚫" val={inactiveCount}     label="Inactive"        trend="Not operational"                 bg="#f05a5a" />
          <StatCard icon="🏢" val={clientCount}       label="Linked Clients"  trend="1:N relationship"                bg="#9b6ef5" />
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input
            className="filter-input"
            placeholder="Search by branch name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="filter-select" value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
            <option value="">All Clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn btn-outline btn-sm" onClick={fetchAll}>🔄 Refresh</button>
          <button className="btn btn-outline btn-sm">📥 Export</button>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-header">
            <div>
              <div className="table-title">Branch Directory</div>
              <div className="table-sub">{filtered.length} record{filtered.length !== 1 ? "s" : ""} found</div>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                <span className="spinner" style={{ marginRight: 8 }} />
                Loading branches...
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌿</div>
              <p>No branches match your filters</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Branch Name</th>
                  <th>Code</th>
                  <th>Parent Client</th>
                  <th>Branch Manager</th>
                  <th>Contact No.</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const client = getClient(b.clientId);
                  const color  = CL_COLORS[b.clientId] || "#7a90b0";
                  return (
                    <tr key={b.id}>
                      <td className="primary">{b.name}</td>
                      <td><span className="mono">{b.code}</span></td>
                      <td>
                        {client ? (
                          <div className="client-chip">
                            <div className="chip-avatar" style={{ background: color }}>
                              {client.name.charAt(0)}
                            </div>
                            <span className="chip-name">{client.name}</span>
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td>{b.manager || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{b.contact}</td>
                      <td style={{ fontSize: 12 }}>{b.address || "—"}</td>

                      {/* ── Clickable Status Toggle ── */}
                      <td>
                        <button
                          className={`status-toggle ${b.status ? "active" : "inactive"}`}
                          onClick={() => toggleStatus(b)}
                          disabled={actionLoading === b.id}
                          title={b.status ? "Click to Deactivate" : "Click to Activate"}
                        >
                          {actionLoading === b.id
                            ? <span className="spinner" />
                            : <span className="toggle-dot" />
                          }
                          {b.status ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* ── Actions ── */}
                      <td>
                        <div className="action-btns">
                          <button
                            className="action-btn"
                            title="Edit"
                            onClick={() => { setEditBranch(b); setShowForm(true); }}
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn danger"
                            title="Soft Delete"
                            onClick={() => setDeleteTarget(b)}
                            disabled={actionLoading === b.id}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {showForm && (
        <BranchFormModal
          branch={editBranch}
          clients={clients.filter(c => c.status)}
          onSave={saveBranch}
          onClose={() => setShowForm(false)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={doDelete}
          onClose={() => setDeleteTarget(null)}
          loading={actionLoading === deleteTarget?.id}
        />
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}
    </>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, val, label, trend, bg }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${bg}22` }}>{icon}</div>
      <div>
        <div className="stat-val">{val}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-trend">▲ {trend}</div>
      </div>
    </div>
  );
}

/* ── Branch Form Modal ── */
function BranchFormModal({ branch, clients, onSave, onClose }) {
  const isEdit = !!branch;
  const [form, setForm] = useState({
    name:     branch?.name     || "",
    clientId: branch?.clientId || (clients[0]?.id || ""),
    address:  branch?.address  || "",
    manager:  branch?.manager  || "",
    contact:  branch?.contact  || "",
    status:   branch?.status   !== undefined ? branch.status : true,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim())    return alert("Branch Name is required.");
    if (!form.contact.trim()) return alert("Contact No. is required.");
    if (form.contact.length !== 10) return alert("Contact must be 10 digits.");
    onSave({ ...form, clientId: Number(form.clientId) });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-title">{isEdit ? "Edit Branch" : "Add New Branch"}</div>
            <div className="modal-sub">
              {isEdit ? `Editing: ${branch.code}` : "FR-CM-03: Create a new branch under a client"}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-section-title">Branch Details</div>

            {isEdit && (
              <div className="form-group">
                <label className="form-label">Branch Code</label>
                <input className="form-input" value={branch.code} disabled />
                <span className="form-hint">Auto-generated — cannot be modified</span>
              </div>
            )}

            <div className={`form-group${isEdit ? "" : " full"}`}>
              <label className="form-label">Branch Name <span className="req">*</span></label>
              <input
                className="form-input"
                placeholder="e.g. Nashik HO, Niphad Branch"
                value={form.name}
                onChange={e => set("name", e.target.value)}
              />
            </div>

            <div className="form-group full">
  <label className="form-label">Parent Client <span className="req">*</span></label>
  <select
    className="form-select"
    value={form.clientId}
    onChange={e => set("clientId", e.target.value)}
  >
    {clients.length === 0 ? (
      <option value="">— No active clients found —</option>
    ) : (
      <>
        <option value="">— Select Client —</option>
        {clients.map(c => (
          <option key={c.id} value={c.id}>{c.code} – {c.name}</option>
        ))}
      </>
    )}
  </select>
  {clients.length === 0 && (
    <span className="form-hint" style={{ color: "var(--accent-red)" }}>
      ⚠️ Please add active clients first from the Client List page
    </span>
  )}
</div>

            <div className="form-group full">
              <label className="form-label">Branch Address</label>
              <textarea
                className="form-textarea"
                placeholder="Full branch address"
                value={form.address}
                onChange={e => set("address", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Branch Manager</label>
              <select className="form-select" value={form.manager} onChange={e => set("manager", e.target.value)}>
                <option value="">— Select Manager —</option>
                {MANAGERS.map(m => <option key={m}>{m}</option>)}
              </select>
              <span className="form-hint">From User Master (Manager role)</span>
            </div>

            <div className="form-group">
              <label className="form-label">Contact No. <span className="req">*</span></label>
              <input
                className="form-input"
                placeholder="10-digit mobile number"
                value={form.contact}
                onChange={e => set("contact", e.target.value)}
                maxLength={10}
              />
            </div>

            <hr className="form-divider" />
            <div className="form-section-title">Status</div>

            <div className="form-group">
              <label className="form-label">Branch Status</label>
              <div className="toggle-wrap">
                <button
                  className={`toggle${form.status ? " on" : ""}`}
                  onClick={() => set("status", !form.status)}
                />
                <span className={`toggle-label ${form.status ? "on" : "off"}`}>
                  {form.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="info-box">
              ℹ️ All image uploads will be tagged with both <b>Client ID</b> and <b>Branch ID</b> for full traceability (FR-CM-04).
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? "💾 Save Changes" : "✅ Create Branch"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm ── */
function DeleteModal({ name, onConfirm, onClose, loading }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-head">
          <div className="modal-title">Confirm Deactivation</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="confirm-icon">⚠️</div>
          <div className="confirm-text">
            Deactivate branch <span className="confirm-name">"{name}"</span>?<br />
            It will be marked <b style={{ color: "var(--accent-red)" }}>Inactive</b>.
            All records are retained <b>(soft delete)</b>.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="spinner" /> : "🗑"} Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}