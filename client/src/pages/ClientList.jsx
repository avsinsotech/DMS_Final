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
  .badge-type { background: #3d8ef022; color: var(--accent-blue); border: 1px solid #3d8ef033; }

  .client-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .action-btns { display: flex; gap: 6px; }
  .action-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-secondary); font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .action-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
  .action-btn.danger:hover { border-color: var(--accent-red); color: var(--accent-red); }
  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Status toggle button ── */
  .status-toggle {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 4px 10px 4px 6px; border-radius: 20px; font-size: 11px; font-weight: 600;
    cursor: pointer; border: none; font-family: var(--font); transition: all 0.2s;
  }
  .status-toggle.active {
    background: #2ec08b22; color: var(--accent-green); border: 1px solid #2ec08b44;
  }
  .status-toggle.active:hover {
    background: #f05a5a22; color: var(--accent-red); border-color: #f05a5a44;
  }
  .status-toggle.inactive {
    background: #f05a5a22; color: var(--accent-red); border: 1px solid #f05a5a44;
  }
  .status-toggle.inactive:hover {
    background: #2ec08b22; color: var(--accent-green); border-color: #2ec08b44;
  }
  .status-toggle:disabled { opacity: 0.5; cursor: not-allowed; }
  .toggle-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--border); }
  .page-info { font-size: 12px; color: var(--text-muted); }
  .page-btns { display: flex; gap: 6px; }
  .page-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-secondary); font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .page-btn:hover, .page-btn.active { background: var(--accent-blue); border-color: var(--accent-blue); color: #fff; }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.4; }

  /* loading spinner */
  .spinner { width: 16px; height: 16px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* toast */
  .toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 2000;
    padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 9px;
    animation: slideInRight 0.25s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .toast.success { background: #2ec08b22; color: var(--accent-green); border: 1px solid #2ec08b44; }
  .toast.error   { background: #f05a5a22; color: var(--accent-red);   border: 1px solid #f05a5a44; }
  @keyframes slideInRight { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; animation: fadeIn 0.15s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--bg-modal); border: 1px solid var(--border-light); border-radius: 14px; width: 100%; max-width: 660px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow); animation: slideUp 0.2s ease; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-head { padding: 22px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: var(--bg-modal); z-index: 1; }
  .modal-title { font-size: 17px; font-weight: 700; color: var(--text-primary); }
  .modal-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .modal-body { padding: 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; background: var(--bg-modal); position: sticky; bottom: 0; }
  .close-btn { width: 32px; height: 32px; border-radius: 8px; background: #ffffff10; border: none; color: var(--text-secondary); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .close-btn:hover { background: #f05a5a33; color: var(--accent-red); }

  /* Form */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .form-group { display: flex; flex-direction: column; gap: 7px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.6px; }
  .form-label .req { color: var(--accent-red); margin-left: 3px; }
  .form-input, .form-select, .form-textarea { background: var(--bg-input); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 13px; color: var(--text-primary); font-family: var(--font); outline: none; transition: border-color 0.15s; width: 100%; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent-blue); }
  .form-input::placeholder { color: var(--text-muted); }
  .form-input:disabled { opacity: 0.5; cursor: not-allowed; }
  .form-textarea { resize: vertical; min-height: 80px; }
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
  .upload-area { border: 2px dashed var(--border-light); border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; transition: border-color 0.15s; color: var(--text-muted); font-size: 13px; }
  .upload-area:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
  .upload-area .uicon { font-size: 26px; margin-bottom: 6px; }
  .confirm-icon { font-size: 40px; text-align: center; margin-bottom: 12px; }
  .confirm-text { text-align: center; color: var(--text-secondary); font-size: 14px; line-height: 1.6; }
  .confirm-name { color: var(--text-primary); font-weight: 600; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
`;

const CLIENT_TYPES = ["Co-op Bank", "Society", "NBFC", "Corporate"];
const COLORS = ["#3d8ef0", "#2ec08b", "#f5933a", "#9b6ef5", "#f5c842", "#f05a5a"];
const API = "http://localhost:5000/api/clients";

export default function ClientList() {
  const [clients,      setClients]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setTypeFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm,     setShowForm]     = useState(false);
  const [editClient,   setEditClient]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // tracks which client id is loading
 

  // ── show toast for 3 seconds ──
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── fetch all clients on mount ──
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      // add color for avatar based on index
      const withColors = data.map((c, i) => ({
        ...c,
        color: COLORS[i % COLORS.length],
      }));
      setClients(withColors);
    } catch (err) {
      showToast("Failed to fetch clients", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = clients.filter(c =>
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.code.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter   === "" || c.type === typeFilter) &&
    (statusFilter === "" || (statusFilter === "active" ? c.status : !c.status))
  );

  const activeCount   = clients.filter(c => c.status).length;
  const inactiveCount = clients.filter(c => !c.status).length;

  // ── CREATE client ──
 const saveClient = async (data) => {
  try {
    // ── EDIT: call PUT /:id ──
    if (editClient) {
      const res = await fetch(`${API}/${editClient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }

      // Update only that client in state — no new client created
      setClients(prev =>
        prev.map(c => c.id === editClient.id ? { ...c, ...result.data } : c)
      );
      setShowForm(false);
      showToast(`✅ "${result.data.name}" updated successfully`);

    // ── CREATE: call POST ──
    } else {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }

      const color = COLORS[clients.length % COLORS.length];
      setClients(prev => [...prev, { ...result.data, color }]);
      setShowForm(false);
      showToast(`✅ "${result.data.name}" created successfully`);
    }

  } catch (err) {
    showToast("API Error — could not save client", "error");
  }
};

  // ── TOGGLE STATUS (Active ↔ Inactive) ──
  const toggleStatus = async (client) => {
    setActionLoading(client.id);
    try {
      const res = await fetch(`${API}/${client.id}/toggle-status`, {
        method: "PATCH",
      });
      const result = await res.json();

      if (!res.ok) {
        showToast(result.message, "error");
        return;
      }

      // Update only that client in state — no new client created
      setClients(prev =>
        prev.map(c =>
          c.id === client.id
            ? { ...c, status: result.data.status }
            : c
        )
      );

      const newStatus = result.data.status ? "Active" : "Inactive";
      showToast(`Status changed to ${newStatus} for "${client.name}"`);
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
      const res = await fetch(`${API}/${deleteTarget.id}/deactivate`, {
        method: "PATCH",
      });
      const result = await res.json();

      if (!res.ok) {
        showToast(result.message, "error");
        setDeleteTarget(null);
        return;
      }

      // Mark client as inactive in state — record is retained (soft delete)
      setClients(prev =>
        prev.map(c =>
          c.id === deleteTarget.id ? { ...c, status: false } : c
        )
      );

      showToast(`🗑 "${deleteTarget.name}" deactivated (soft delete)`);
      setDeleteTarget(null);
    } catch (err) {
      showToast("API Error — could not deactivate client", "error");
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
            <div className="page-title">Client List</div>
            <div className="page-subtitle">Manage all registered organisations (FR-CM-01 / FR-CM-02)</div>
          </div>
          <button className="btn btn-gold" onClick={() => { setEditClient(null); setShowForm(true); }}>
            + Add New Client
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <StatCard icon="🏢" val={clients.length} label="Total Clients"  trend={`${activeCount} active`}   bg="#3d8ef0" />
          <StatCard icon="✅" val={activeCount}     label="Active"         trend="Operational"                bg="#2ec08b" />
          <StatCard icon="🚫" val={inactiveCount}   label="Inactive"       trend="Cannot upload"              bg="#f05a5a" />
          <StatCard icon="📋" val={CLIENT_TYPES.length} label="Client Types" trend="Supported"               bg="#9b6ef5" />
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input
            className="filter-input"
            placeholder="Search by name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            {CLIENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn btn-outline btn-sm" onClick={fetchClients}>🔄 Refresh</button>
          <button className="btn btn-outline btn-sm">📥 Export</button>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-header">
            <div>
              <div className="table-title">Client Directory</div>
              <div className="table-sub">{filtered.length} record{filtered.length !== 1 ? "s" : ""} found</div>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                <span className="spinner" style={{ marginRight: 8 }} />
                Loading clients...
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <p>No clients match your filters</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Reg. No.</th>
                  <th>Contact Person</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td className="primary">
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                       <div
  className="client-avatar"
  style={{
    background: c.color,
    overflow: "hidden",
    padding: 0,
  }}
>
  {c.logo ? (
    <img
      src={c.logo}
      alt={c.name}
      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
    />
  ) : (
    c.name.charAt(0)
  )}
</div>
                        <div>
                          <div>{c.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            {c.address?.split(",")[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="mono">{c.code}</span></td>
                    <td><span className="badge badge-type">{c.type}</span></td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{c.regNo}</td>
                    <td>{c.contact?.name}</td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{c.contact?.mobile}</td>
                    <td style={{ fontSize: 12 }}>{c.contact?.email}</td>

                    {/* ── Clickable Status Toggle ── */}
                  <td>
  <button
    onClick={async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/clients/${c.id}/toggle-status`,
          { method: "PATCH" }
        );
        const result = await res.json();
        if (!res.ok) { alert(result.message); return; }
        setClients(prev =>
          prev.map(x =>
            x.id === c.id ? { ...x, status: result.data.status } : x
          )
        );
      } catch (err) {
        alert("API Error");
      }
    }}
    style={{
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      cursor: "pointer",
      border: c.status ? "1px solid #2ec08b44" : "1px solid #f05a5a44",
      background: c.status ? "#2ec08b22" : "#f05a5a22",
      color: c.status ? "#2ec08b" : "#f05a5a",
    }}
  >
    ● {c.status ? "Active" : "Inactive"}
  </button>
</td>

                    {/* ── Actions ── */}
                    <td>
                      <div className="action-btns">
                        <button
                          className="action-btn"
                          title="Edit"
                          onClick={() => { setEditClient(c); setShowForm(true); }}
                        >
                          ✏️
                        </button>
                        <button
  className="action-btn danger"
  onClick={async () => {
    if (!window.confirm(`Deactivate "${c.name}"?`)) return;
    const res = await fetch(
      `http://localhost:5000/api/clients/${c.id}/deactivate`,
      { method: "PATCH" }
    );
    const result = await res.json();
    if (!res.ok) { alert(result.message); return; }
    setClients(prev =>
      prev.map(x => x.id === c.id ? { ...x, status: false } : x)
    );
  }}
>
  🗑
</button>
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
        <ClientFormModal
          client={editClient}
          onSave={saveClient}
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

      {/* Toast */}
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

/* ── Client Form Modal ── */
function ClientFormModal({ client, onSave, onClose }) {
  const isEdit = !!client;

  const [logoPreview, setLogoPreview] = useState(client?.logo || null);
  const [form, setForm] = useState({
    name:          client?.name              || "",
    type:          client?.type              || "Co-op Bank",
    regNo:         client?.regNo             || "",
    address:       client?.address           || "",
    contactName:   client?.contact?.name     || "",
    contactMobile: client?.contact?.mobile   || "",
    contactEmail:  client?.contact?.email    || "",
    status:        client?.status !== undefined ? client.status : true,
    logo:          client?.logo              || null,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim())  return alert("Client Name is required.");
    if (!form.regNo.trim()) return alert("Registration No. is required.");
    onSave({
      name: form.name, type: form.type, regNo: form.regNo, address: form.address,
      contact: { name: form.contactName, mobile: form.contactMobile, email: form.contactEmail },
      status: form.status,
      logo: form.logo || null, 
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-title">{isEdit ? "Edit Client" : "Add New Client"}</div>
            <div className="modal-sub">
              {isEdit ? `Editing: ${client.code} — Code cannot be changed` : "FR-CM-01: Register a new client organisation"}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-section-title">Basic Information</div>

            {isEdit && (
              <div className="form-group">
                <label className="form-label">Client Code</label>
                <input className="form-input" value={client.code} disabled />
                <span className="form-hint">Auto-generated — cannot be modified</span>
              </div>
            )}

            <div className={`form-group${isEdit ? "" : " full"}`}>
              <label className="form-label">Client Name <span className="req">*</span></label>
              <input className="form-input" placeholder="Full legal name (max 200 chars)" value={form.name} onChange={e => set("name", e.target.value)} maxLength={200} />
            </div>

            <div className="form-group">
              <label className="form-label">Client Type <span className="req">*</span></label>
              <select className="form-select" value={form.type} onChange={e => set("type", e.target.value)}>
                {CLIENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Registration No. <span className="req">*</span></label>
              <input className="form-input" placeholder="MCS / RCS / CIN number" value={form.regNo} onChange={e => set("regNo", e.target.value)} />
            </div>

            {/* <div className="form-group full">
              <label className="form-label">Address</label>
              <textarea className="form-textarea" placeholder="Full registered address" value={form.address} onChange={e => set("address", e.target.value)} />
            </div> */}

            <hr className="form-divider" />
            <div className="form-section-title">Contact Person</div>

            <div className="form-group full">
              <label className="form-label">Contact Name</label>
              <input className="form-input" placeholder="Primary contact full name" value={form.contactName} onChange={e => set("contactName", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile</label>
              <input className="form-input" placeholder="10-digit mobile number" value={form.contactMobile} onChange={e => set("contactMobile", e.target.value)} maxLength={10} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="contact@example.com" value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} />
            </div>

            <hr className="form-divider" />
            <div className="form-section-title">Settings & Media</div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="toggle-wrap">
                <button className={`toggle${form.status ? " on" : ""}`} onClick={() => set("status", !form.status)} />
                <span className={`toggle-label ${form.status ? "on" : "off"}`}>{form.status ? "Active" : "Inactive"}</span>
              </div>
              {!form.status && <span className="form-hint" style={{ color: "var(--accent-red)" }}>Inactive clients cannot upload documents</span>}
            </div>


      


<div className="form-group">
  <label className="form-label">Logo</label>
  <div
    className="upload-area"
    onClick={() => document.getElementById("logo-upload").click()}
  >
    {logoPreview ? (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <img
          src={logoPreview}
          alt="Logo preview"
          style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover" }}
        />
        <span style={{ fontSize: 11, color: "var(--accent-green)" }}>✅ Image selected</span>
        <span
          style={{ fontSize: 11, color: "var(--accent-red)", cursor: "pointer" }}
          onClick={e => { e.stopPropagation(); setLogoPreview(null); set("logo", null); }}
        >
          ✕ Remove
        </span>
      </div>
    ) : (
      <>
        <div className="uicon">🖼</div>
        <div>Click to upload PNG / JPG (max 1 MB)</div>
        <div style={{ fontSize: 11, marginTop: 4 }}>Displayed on client portal</div>
      </>
    )}
  </div>
  <input
    id="logo-upload"
    type="file"
    accept="image/png, image/jpeg"
    style={{ display: "none" }}
    onChange={e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 1 * 1024 * 1024) {
        alert("File size must be under 1 MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);  // base64 string
        set("logo", reader.result);     // save in form state
      };
      reader.readAsDataURL(file);
    }}
  />
</div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? "💾 Save Changes" : "✅ Create Client"}
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
            Deactivate <span className="confirm-name">"{name}"</span>?<br />
            The client will be marked <b style={{ color: "var(--accent-red)" }}>Inactive</b>.
            All records are retained <b>(soft delete)</b>.<br /><br />
            <span style={{ color: "var(--accent-orange)", fontSize: 12 }}>
              Blocked if client has active branches or documents.
            </span>
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
