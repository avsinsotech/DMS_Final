import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }


  .page { padding: 28px; min-height: 100vh; background: var(--bg-main); }
  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .page-title { font-size: 26px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px; }
  .page-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; display: flex; align-items: center; gap: 14px; transition: border-color .2s, transform .2s; }
  .stat-card:hover { border-color: var(--border-light); transform: translateY(-2px); }
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
  .data-table td { padding: 12px 16px; font-size: 13px; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
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

  /* customer avatar */
  .cust-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }

  /* client+branch chip */
  .link-chip { display: inline-flex; align-items: center; gap: 5px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 6px; padding: 3px 9px; font-size: 11px; color: var(--text-secondary); }
  .link-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

  /* status toggle */
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
  .modal { background: var(--bg-modal); border: 1px solid var(--border-light); border-radius: 14px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow); animation: slideUp 0.2s ease; }
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
  .confirm-icon { font-size: 40px; text-align: center; margin-bottom: 12px; }
  .confirm-text { text-align: center; color: var(--text-secondary); font-size: 14px; line-height: 1.6; }
  .confirm-name { color: var(--text-primary); font-weight: 600; }

  /* Customer type toggle */
.ctype-wrap { display:flex; gap:10px; margin-bottom:4px; }
.ctype-btn {
  flex:1; padding:10px 14px; border-radius:8px; cursor:pointer;
  border:1.5px solid var(--border); background:var(--bg-input);
  font-size:13px; font-weight:600; color:var(--ts);
  font-family:var(--font); transition:all .15s; text-align:center;
}
.ctype-btn.active {
  border-color:var(--accent-blue,#2563eb);
  background:#eff4ff;
  color:#2563eb;
}
.ctype-btn:hover:not(.active) { border-color:#c8d8ec; color:var(--tp); }
.ctype-icon { font-size:16px; display:block; margin-bottom:3px; }

/* Customer type toggle - animated */
.ctype-wrap { display:flex; gap:10px; margin-bottom:4px; }
.ctype-btn {
  flex:1; padding:14px; border-radius:10px; cursor:pointer;
  border:1.5px solid #d8e4f0; background:#f8faff;
  font-size:13px; font-weight:600; color:#8a9ab8;
  font-family:var(--font); transition:all .2s ease;
  text-align:center; position:relative; overflow:hidden;
}
.ctype-btn::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(135deg,#eff4ff,#dbeafe);
  opacity:0; transition:opacity .2s ease;
}
.ctype-btn:hover::before { opacity:1; }
.ctype-btn:hover {
  border-color:#2563eb; color:#2563eb;
  transform:translateY(-2px);
  box-shadow:0 6px 20px rgba(37,99,235,0.15);
}
.ctype-btn.active {
  border-color:#2563eb; background:linear-gradient(135deg,#eff4ff,#dbeafe);
  color:#2563eb; box-shadow:0 4px 16px rgba(37,99,235,0.18);
  transform:translateY(-1px);
}
.ctype-btn.active::after {
  content:'✓'; position:absolute; top:8px; right:10px;
  width:18px; height:18px; border-radius:50%;
  background:#2563eb; color:#fff;
  font-size:10px; font-weight:800;
  display:flex; align-items:center; justify-content:center;
  line-height:18px;
}
.ctype-icon { font-size:24px; display:block; margin-bottom:5px; position:relative; z-index:1; }
.ctype-label { font-size:13px; font-weight:700; position:relative; z-index:1; }
.ctype-desc  { font-size:10.5px; opacity:.7; margin-top:2px; position:relative; z-index:1; }

/* Customer ID preview badge */
.cust-id-preview {
  display:inline-flex; align-items:center; gap:8px;
  background:#eff4ff; border:1.5px dashed #93c5fd;
  border-radius:8px; padding:10px 14px;
  font-family:'JetBrains Mono',monospace; font-size:13px;
  font-weight:700; color:#2563eb; margin-bottom:2px;
  width:100%;
}
.cust-id-preview-label {
  font-family:'DM Sans',sans-serif; font-size:11px;
  font-weight:600; color:#8a9ab8; text-transform:uppercase;
  letter-spacing:.5px; margin-right:4px;
}

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
`;

const AVATAR_COLORS = ["#3d8ef0","#2ec08b","#f5933a","#9b6ef5","#f5c842","#f05a5a","#26c6da"];
const CUSTOMER_API  = "http://localhost:5000/api/customers";
const CLIENT_API    = "http://localhost:5000/api/clients";
const BRANCH_API    = "http://localhost:5000/api/branches";

export default function CustomerMaster() {
  const [customers,     setCustomers]     = useState([]);
  const [clients,       setClients]       = useState([]);
  const [branches,      setBranches]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [clientFilter,  setClientFilter]  = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");
  const [showForm,      setShowForm]      = useState(false);
  const [editCustomer,  setEditCustomer]  = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [toast,         setToast]         = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [cuRes, clRes, brRes] = await Promise.all([
        fetch(CUSTOMER_API),
        fetch(CLIENT_API),
        fetch(BRANCH_API),
      ]);
      const cuData = await cuRes.json();
      const clData = await clRes.json();
      const brData = await brRes.json();
      setCustomers(Array.isArray(cuData) ? cuData : []);
      setClients(Array.isArray(clData) ? clData : []);
      setBranches(Array.isArray(brData) ? brData : []);
    } catch {
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const getClient = id => clients.find(c => c.id === Number(id));
  const getBranch = id => branches.find(b => b.id === Number(id));

  const filtered = customers.filter(c =>
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.code.toLowerCase().includes(search.toLowerCase()) ||
     (c.mobile || "").includes(search)) &&
    (!clientFilter || String(c.clientId) === clientFilter) &&
    (!statusFilter || (statusFilter === "active" ? c.status : !c.status))
  );

  const activeCount = customers.filter(c => c.status).length;

  // ── CREATE or EDIT ──
  const saveCustomer = async (data) => {
    try {
      if (editCustomer) {
        const res = await fetch(`${CUSTOMER_API}/${editCustomer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) { showToast(result.message, "error"); return; }
        setCustomers(prev => prev.map(c => c.id === editCustomer.id ? { ...c, ...result.data } : c));
        setShowForm(false);
        showToast(`✅ "${result.data.name}" updated successfully`);
      } else {
        const res = await fetch(CUSTOMER_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) { showToast(result.message, "error"); return; }
        setCustomers(prev => [...prev, result.data]);
        setShowForm(false);
        showToast(`✅ Customer "${result.data.name}" created successfully`);
      }
    } catch {
      showToast("API Error — could not save customer", "error");
    }
  };

  // ── TOGGLE STATUS ──
  const toggleStatus = async (customer) => {
    setActionLoading(customer.id);
    try {
      const res = await fetch(`${CUSTOMER_API}/${customer.id}/toggle-status`, { method: "PATCH" });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }
      setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: result.data.status } : c));
      showToast(`Status changed to ${result.data.status ? "Active" : "Inactive"} for "${customer.name}"`);
    } catch {
      showToast("API Error — could not toggle status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── SOFT DELETE ──
  const doDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      const res = await fetch(`${CUSTOMER_API}/${deleteTarget.id}/deactivate`, { method: "PATCH" });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); setDeleteTarget(null); return; }
      setCustomers(prev => prev.map(c => c.id === deleteTarget.id ? { ...c, status: false } : c));
      showToast(`🗑 "${deleteTarget.name}" deactivated`);
      setDeleteTarget(null);
    } catch {
      showToast("API Error — could not deactivate", "error");
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
            <div className="page-title">Customer Master</div>
            <div className="page-subtitle">Manage customers linked to clients and branches</div>
          </div>
          <button className="btn btn-gold" onClick={() => { setEditCustomer(null); setShowForm(true); }}>
            + Add New Customer
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <StatCard icon="👥" val={customers.length}             label="Total Customers"  trend={`${activeCount} active`}       bg="#3d8ef0" />
          <StatCard icon="✅" val={activeCount}                   label="Active"           trend="Operational"                   bg="#2ec08b" />
          <StatCard icon="🚫" val={customers.length - activeCount} label="Inactive"       trend="Restricted"                    bg="#f05a5a" />
          <StatCard icon="🏢" val={new Set(customers.map(c => c.clientId)).size} label="Linked Clients" trend="Across all branches" bg="#9b6ef5" />
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input
            className="filter-input"
            placeholder="Search by name, code or mobile..."
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
              <div className="table-title">Customer Directory</div>
              <div className="table-sub">{filtered.length} record{filtered.length !== 1 ? "s" : ""} found</div>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <span className="spinner" style={{ marginRight: 8 }} />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Loading customers...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>No customers match your filters</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Code</th>
                  <th>Mobile</th>
                  <th>Account No.</th>
                  <th>Client</th>
                  <th>Branch</th>
                  <th>DOB</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const client = getClient(c.clientId);
                  const branch = getBranch(c.branchId);
                  const color  = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  return (
                    <tr key={c.id}>
                      <td className="primary">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="cust-avatar" style={{ background: color }}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{c.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.email || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="mono">{c.code}</span></td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{c.mobile}</td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{c.accountNo || "—"}</td>
                      <td>
                        {client
                          ? <div className="link-chip"><div className="link-dot" style={{ background: "#3d8ef0" }} />{client.name}</div>
                          : <span style={{ color: "var(--text-muted)" }}>—</span>}
                      </td>
                      <td>
                        {branch
                          ? <div className="link-chip"><div className="link-dot" style={{ background: "#2ec08b" }} />{branch.name}</div>
                          : <span style={{ color: "var(--text-muted)" }}>—</span>}
                      </td>
                      <td style={{ fontSize: 12 }}>{c.dob || "—"}</td>
                      <td>
                        <button
                          className={`status-toggle ${c.status ? "active" : "inactive"}`}
                          onClick={() => toggleStatus(c)}
                          disabled={actionLoading === c.id}
                          title={c.status ? "Click to Deactivate" : "Click to Activate"}
                        >
                          {actionLoading === c.id
                            ? <span className="spinner" />
                            : <span className="toggle-dot" />}
                          {c.status ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn" title="Edit" onClick={() => { setEditCustomer(c); setShowForm(true); }}>✏️</button>
                          <button className="action-btn danger" title="Deactivate" onClick={() => setDeleteTarget(c)} disabled={actionLoading === c.id}>🗑</button>
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
        <CustomerFormModal
          customer={editCustomer}
          clients={clients.filter(c => c.status)}
          branches={branches.filter(b => b.status)}
          onSave={saveCustomer}
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
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
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

/* ── Customer Form Modal ── */
function CustomerFormModal({ customer, clients, branches, onSave, onClose }) {
  const isEdit = !!customer;
  const [form, setForm] = useState({
    customerType: customer?.customerType || "Individual",
    name:      customer?.name      || "",
    mobile:    customer?.mobile    || "",
    email:     customer?.email     || "",
    dob:       customer?.dob       || "",
    accountNo: customer?.accountNo || "",
    address:   customer?.address   || "",
    clientId:  customer?.clientId  || (clients[0]?.id || ""),
    branchId:  customer?.branchId  || "",
    status:    customer?.status    !== undefined ? customer.status : true,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Filter branches by selected client
  const filteredBranches = branches.filter(b => String(b.clientId) === String(form.clientId));

  // Reset branchId when client changes
  const handleClientChange = (val) => {
    set("clientId", val);
    set("branchId", "");
  };

  const handleSubmit = () => {
    if (!form.name.trim())   return alert("Customer Name is required.");
    if (!form.mobile.trim()) return alert("Mobile No. is required.");
    if (form.mobile.length !== 10) return alert("Mobile must be 10 digits.");
    if (!form.clientId)      return alert("Please select a Client.");
    onSave({
      customerType: form.customerType,
      name:      form.name,
      mobile:    form.mobile,
      email:     form.email,
      dob:       form.dob,
      accountNo: form.accountNo,
      address:   form.address,
      clientId:  Number(form.clientId),
      branchId:  form.branchId ? Number(form.branchId) : null,
      status:    form.status,
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-title">{isEdit ? "Edit Customer" : "Add New Customer"}</div>
            <div className="modal-sub">
              {isEdit ? `Editing: ${customer.code}` : "Register a new customer under a client & branch"}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">

            {/* ── Basic Info ── */}
            {/* //<div className="form-section-title">Basic Information</div> */}

<div className="form-section-title">Basic Information</div>

{/* ── Customer ID Preview ── */}
{!isEdit && (
  <div className="form-group full">
    <label className="form-label">Customer ID</label>
    <div className="cust-id-preview">
      <span className="cust-id-preview-label">Auto ID:</span>
      CUST-001
    </div>
    <span className="form-hint">
      Auto-generated on save — cannot be modified
    </span>
  </div>
)}
{isEdit && (
  <div className="form-group">
    <label className="form-label">Customer Code</label>
    <input className="form-input" value={customer.code} disabled />
    <span className="form-hint">Auto-generated — cannot be modified</span>
  </div>
)}

{/* ── Customer Type ── */}
<div className="form-group full">
  <label className="form-label">Customer Type <span className="req">*</span></label>
  <div className="ctype-wrap">
    <button
      type="button"
      className={`ctype-btn${form.customerType === "Individual" ? " active" : ""}`}
      onClick={() => set("customerType", "Individual")}
    >
      <span className="ctype-icon">👤</span>
      <span className="ctype-label">Individual</span>
      <span className="ctype-desc">Personal customer / account holder</span>
    </button>
    <button
      type="button"
      className={`ctype-btn${form.customerType === "Legal" ? " active" : ""}`}
      onClick={() => set("customerType", "Legal")}
    >
      <span className="ctype-icon">🏛</span>
      <span className="ctype-label">Legal Entity</span>
      <span className="ctype-desc">Company / Society / Trust</span>
    </button>
  </div>
</div>

{/* ── Full Name ── */}
<div className="form-group full">
  <label className="form-label">
    {form.customerType === "Individual" ? "Full Name" : "Entity Name"}
    <span className="req">*</span>
  </label>
  <input
    className="form-input"
    placeholder={form.customerType === "Individual" ? "Customer full name" : "Company / Society / Trust name"}
    value={form.name}
    onChange={e => set("name", e.target.value)}
  />
</div>

            {isEdit && (
              <div className="form-group">
                <label className="form-label">Customer Code</label>
                <input className="form-input" value={customer.code} disabled />
                <span className="form-hint">Auto-generated — cannot be modified</span>
              </div>
            )}

            {/* <div className={`form-group${isEdit ? "" : " full"}`}>
              <label className="form-label">Full Name <span className="req">*</span></label>
              <input className="form-input" placeholder="Customer full name" value={form.name} onChange={e => set("name", e.target.value)} />
            </div> */}

            <div className="form-group">
              <label className="form-label">Mobile <span className="req">*</span></label>
              <input className="form-input" placeholder="10-digit mobile" value={form.mobile} onChange={e => set("mobile", e.target.value)} maxLength={10} />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="customer@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>

           {/* ── DOB or Date of Incorporation based on type ── */}
<div className="form-group">
  <label className="form-label">
    {form.customerType === "Individual" ? "Date of Birth" : "Date of Incorporation"}
  </label>
  <input
    className="form-input"
    type="date"
    value={form.dob}
    onChange={e => set("dob", e.target.value)}
  />
  <span className="form-hint">
    {form.customerType === "Individual"
      ? "Customer's date of birth"
      : "Company/Society registration date"}
  </span>
</div>

            <div className="form-group">
              <label className="form-label">Account No.</label>
              <input className="form-input" placeholder="Bank account number" value={form.accountNo} onChange={e => set("accountNo", e.target.value)} />
            </div>

            <div className="form-group full">
              <label className="form-label">Address</label>
              <textarea className="form-textarea" placeholder="Full address" value={form.address} onChange={e => set("address", e.target.value)} />
            </div>

            {/* ── Linkage ── */}
            <hr className="form-divider" />
            <div className="form-section-title">Client & Branch Linkage</div>

            <div className="form-group">
              <label className="form-label">Client <span className="req">*</span></label>
              <select className="form-select" value={form.clientId} onChange={e => handleClientChange(e.target.value)}>
                {clients.length === 0
                  ? <option value="">— No active clients —</option>
                  : <>
                      <option value="">— Select Client —</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}
                    </>
                }
              </select>
              <span className="form-hint">Only active clients shown</span>
            </div>

            <div className="form-group">
              <label className="form-label">Branch</label>
              <select className="form-select" value={form.branchId} onChange={e => set("branchId", e.target.value)}>
                <option value="">— Select Branch —</option>
                {filteredBranches.map(b => <option key={b.id} value={b.id}>{b.code} – {b.name}</option>)}
              </select>
              <span className="form-hint">Filtered by selected client</span>
            </div>

            {/* ── Status ── */}
            <hr className="form-divider" />
            <div className="form-section-title">Status</div>

            <div className="form-group">
              <label className="form-label">Customer Status</label>
              <div className="toggle-wrap">
                <button className={`toggle${form.status ? " on" : ""}`} onClick={() => set("status", !form.status)} />
                <span className={`toggle-label ${form.status ? "on" : "off"}`}>{form.status ? "Active" : "Inactive"}</span>
              </div>
            </div>

          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? "💾 Save Changes" : "✅ Create Customer"}
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
            Deactivate customer <span className="confirm-name">"{name}"</span>?<br />
            Marked as <b style={{ color: "var(--accent-red)" }}>Inactive</b>. Records retained <b>(soft delete)</b>.
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
