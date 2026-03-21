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
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
  .badge-active   { background: #2ec08b22; color: var(--accent-green);  border: 1px solid #2ec08b33; }
  .badge-active .badge-dot { background: var(--accent-green); }
  .badge-inactive { background: #f05a5a22; color: var(--accent-red);    border: 1px solid #f05a5a33; }
  .badge-inactive .badge-dot { background: var(--accent-red); }
  .badge-yes { background: #f5933a22; color: var(--accent-orange); border: 1px solid #f5933a33; }
  .badge-no  { background: #3d8ef022; color: var(--accent-blue);   border: 1px solid #3d8ef033; }

  /* format tag chips */
  .fmt-chips { display: flex; gap: 4px; flex-wrap: wrap; }
  .fmt-chip { padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 700; font-family: var(--mono); background: #9b6ef522; color: var(--accent-purple); border: 1px solid #9b6ef533; }

  /* doc icon */
  .doc-icon-box { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }

  /* status toggle */
  .status-toggle { display: inline-flex; align-items: center; gap: 7px; padding: 4px 10px 4px 6px; border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; border: none; font-family: var(--font); transition: all 0.2s; }
  .status-toggle.active   { background: #2ec08b22; color: var(--accent-green); border: 1px solid #2ec08b44; }
  .status-toggle.active:hover { background: #f05a5a22; color: var(--accent-red); border-color: #f05a5a44; }
  .status-toggle.inactive { background: #f05a5a22; color: var(--accent-red);   border: 1px solid #f05a5a44; }
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
  .form-hint { font-size: 11px; color: var(--text-muted); }
  .form-divider { grid-column: 1 / -1; border: none; border-top: 1px solid var(--border); margin: 4px 0; }
  .form-section-title { grid-column: 1 / -1; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-blue); padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .toggle-wrap { display: flex; align-items: center; gap: 12px; }
  .toggle { width: 40px; height: 22px; background: var(--border-light); border-radius: 11px; position: relative; cursor: pointer; transition: background 0.2s; border: none; }
  .toggle.on { background: var(--accent-green); }
  .toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
  .toggle.on::after { transform: translateX(18px); }
  .toggle-label { font-size: 13px; font-weight: 600; }
  .toggle-label.on  { color: var(--accent-green); }
  .toggle-label.off { color: var(--text-muted); }
  .confirm-icon { font-size: 40px; text-align: center; margin-bottom: 12px; }
  .confirm-text { text-align: center; color: var(--text-secondary); font-size: 14px; line-height: 1.6; }
  .confirm-name { color: var(--text-primary); font-weight: 600; }

  /* Format multi-select checkboxes */
  .fmt-checks { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
  .fmt-check-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 7px; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; font-family: var(--mono);
    border: 1px solid var(--border); background: var(--bg-input); color: var(--text-secondary);
  }
  .fmt-check-btn.selected { background: #9b6ef522; color: var(--accent-purple); border-color: #9b6ef555; }
  .fmt-check-btn:hover:not(.selected) { border-color: var(--accent-blue); color: var(--accent-blue); }
  .fmt-check-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
`;

const CATEGORIES      = ["KYC", "Loan", "Collateral", "Others"];
const ALLOWED_FORMATS = ["JPG", "PNG", "PDF", "TIFF"];
const DOC_API         = "http://localhost:5000/api/document-types";

export default function DocumentMaster() {
  const [docs,          setDocs]          = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [catFilter,     setCatFilter]     = useState("");
  const [mandFilter,    setMandFilter]    = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");
  const [showForm,      setShowForm]      = useState(false);
  const [editDoc,       setEditDoc]       = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [toast,         setToast]         = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res  = await fetch(DOC_API);
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to fetch document types", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = docs.filter(d =>
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.code.toLowerCase().includes(search.toLowerCase())) &&
    (!catFilter    || d.category === catFilter) &&
    (!mandFilter   || (mandFilter === "yes" ? d.isMandatory : !d.isMandatory)) &&
    (!statusFilter || (statusFilter === "active" ? d.status : !d.status))
  );

  const activeCount    = docs.filter(d => d.status).length;
  const mandatoryCount = docs.filter(d => d.isMandatory).length;

  // ── CREATE or EDIT ──
  const saveDoc = async (data) => {
    try {
      if (editDoc) {
        const res = await fetch(`${DOC_API}/${editDoc.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) { showToast(result.message, "error"); return; }
        setDocs(prev => prev.map(d => d.id === editDoc.id ? { ...d, ...result.data } : d));
        setShowForm(false);
        showToast(`✅ "${result.data.name}" updated successfully`);
      } else {
        const res = await fetch(DOC_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) { showToast(result.message, "error"); return; }
        setDocs(prev => [...prev, result.data]);
        setShowForm(false);
        showToast(`✅ "${result.data.name}" created successfully`);
      }
    } catch {
      showToast("API Error — could not save document type", "error");
    }
  };

  // ── TOGGLE STATUS ──
  const toggleStatus = async (doc) => {
    setActionLoading(doc.id);
    try {
      const res    = await fetch(`${DOC_API}/${doc.id}/toggle-status`, { method: "PATCH" });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: result.data.status } : d));
      showToast(`Status → ${result.data.status ? "Active" : "Inactive"} for "${doc.name}"`);
    } catch {
      showToast("API Error", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── SOFT DELETE ──
  const doDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      const res    = await fetch(`${DOC_API}/${deleteTarget.id}/deactivate`, { method: "PATCH" });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); setDeleteTarget(null); return; }
      setDocs(prev => prev.map(d => d.id === deleteTarget.id ? { ...d, status: false } : d));
      showToast(`🗑 "${deleteTarget.name}" deactivated`);
      setDeleteTarget(null);
    } catch {
      showToast("API Error", "error");
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
            <div className="page-title">Document Master</div>
            <div className="page-subtitle">FR-IM-02 — Define document types, formats and upload rules</div>
          </div>
          <button className="btn btn-gold" onClick={() => { setEditDoc(null); setShowForm(true); }}>
            + Add Document Type
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <StatCard icon="📄" val={docs.length}         label="Total Types"  trend={`${activeCount} active`}       bg="#3d8ef0" />
          <StatCard icon="✅" val={activeCount}          label="Active"       trend="In use for uploads"            bg="#2ec08b" />
          <StatCard icon="⚠️" val={mandatoryCount}       label="Mandatory"    trend="Required in checklist"         bg="#f5933a" />
          <StatCard icon="🔵" val={docs.length - mandatoryCount} label="Optional" trend="Non-mandatory uploads"    bg="#9b6ef5" />
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input
            className="filter-input"
            placeholder="Search by name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={mandFilter} onChange={e => setMandFilter(e.target.value)}>
            <option value="">Mandatory / Optional</option>
            <option value="yes">Mandatory</option>
            <option value="no">Optional</option>
          </select>
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn btn-outline btn-sm" onClick={fetchDocs}>🔄 Refresh</button>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-header">
            <div>
              <div className="table-title">Document Type Directory</div>
              <div className="table-sub">{filtered.length} record{filtered.length !== 1 ? "s" : ""} found</div>
            </div>
            <button className="btn btn-outline btn-sm">📥 Export</button>
          </div>

          {loading ? (
            <div className="empty-state">
              <span className="spinner" style={{ marginRight: 8 }} />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Loading...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <p>No document types found</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Code</th>
                  <th>Category</th>
                  <th>Allowed Formats</th>
                  <th>Max Size</th>
                  <th>Is Mandatory</th>
                  <th>Retention</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id}>
                    {/* Document Name */}
                    <td className="primary">
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="doc-icon-box" style={{ background: `${d.color || "#3d8ef0"}22` }}>
                          {d.icon || "📄"}
                        </div>
                        <div>{d.name}</div>
                      </div>
                    </td>

                    {/* Code */}
                    <td><span className="mono">{d.code}</span></td>

                    {/* Category */}
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                        background: "#f5c84222", color: "var(--accent-gold)",
                        border: "1px solid #f5c84233",
                      }}>
                        {d.category}
                      </span>
                    </td>

                    {/* Allowed Formats */}
                    <td>
                      <div className="fmt-chips">
                        {(d.allowedFormats || []).map(f => (
                          <span key={f} className="fmt-chip">{f}</span>
                        ))}
                      </div>
                    </td>

                    {/* Max File Size */}
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
                      {d.maxFileSizeMB} MB
                    </td>

                    {/* Is Mandatory */}
                    <td>
                      <span className={`badge ${d.isMandatory ? "badge-yes" : "badge-no"}`}>
                        {d.isMandatory ? "⚠️ Yes" : "🔵 No"}
                      </span>
                    </td>

                    {/* Retention Period */}
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
                      {d.retentionYears ? `${d.retentionYears} yr${d.retentionYears > 1 ? "s" : ""}` : "—"}
                    </td>

                    {/* Status Toggle */}
                    <td>
                      <button
                        className={`status-toggle ${d.status ? "active" : "inactive"}`}
                        onClick={() => toggleStatus(d)}
                        disabled={actionLoading === d.id}
                        title={d.status ? "Click to Deactivate" : "Click to Activate"}
                      >
                        {actionLoading === d.id
                          ? <span className="spinner" />
                          : <span className="toggle-dot" />}
                        {d.status ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-btns">
                        <button className="action-btn" title="Edit" onClick={() => { setEditDoc(d); setShowForm(true); }}>✏️</button>
                        <button className="action-btn danger" title="Deactivate" onClick={() => setDeleteTarget(d)} disabled={actionLoading === d.id}>🗑</button>
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

      {showForm && (
        <DocFormModal
          doc={editDoc}
          onSave={saveDoc}
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

/* ── Document Form Modal ── */
function DocFormModal({ doc, onSave, onClose }) {
  const isEdit = !!doc;

  const [form, setForm] = useState({
    name:            doc?.name            || "",
    category:        doc?.category        || "KYC",
    allowedFormats:  doc?.allowedFormats  || ["JPG", "PNG", "PDF"],
    maxFileSizeMB:   doc?.maxFileSizeMB   || 5,
    isMandatory:     doc?.isMandatory     !== undefined ? doc.isMandatory : true,
    retentionYears:  doc?.retentionYears  || "",
    icon:            doc?.icon            || "📄",
    color:           doc?.color           || "#3d8ef0",
    status:          doc?.status          !== undefined ? doc.status : true,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Toggle format selection
  const toggleFormat = (fmt) => {
    setForm(f => ({
      ...f,
      allowedFormats: f.allowedFormats.includes(fmt)
        ? f.allowedFormats.filter(x => x !== fmt)
        : [...f.allowedFormats, fmt],
    }));
  };

  const ICON_OPTIONS  = ["📄","📋","📑","🪪","📜","📃","🗂","📁","🏦","⚖️","🔐","📊","🖊","📝","🗒","📂"];
  const COLOR_OPTIONS = ["#3d8ef0","#2ec08b","#f5c842","#9b6ef5","#f5933a","#f05a5a","#26c6da","#ff6b9d"];

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Document Name is required.");
    if (form.allowedFormats.length === 0) return alert("Select at least one allowed format.");
    if (form.maxFileSizeMB < 1) return alert("Max file size must be at least 1 MB.");
    onSave({
      name:           form.name,
      category:       form.category,
      allowedFormats: form.allowedFormats,
      maxFileSizeMB:  Number(form.maxFileSizeMB),
      isMandatory:    form.isMandatory,
      retentionYears: form.retentionYears ? Number(form.retentionYears) : null,
      icon:           form.icon,
      color:          form.color,
      status:         form.status,
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-title">{isEdit ? "Edit Document Type" : "Add Document Type"}</div>
            <div className="modal-sub">
              {isEdit ? `Editing: ${doc.code}` : "FR-IM-02: Define a new document type"}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-grid">

            {/* ── Section 1: Basic ── */}
            <div className="form-section-title">Basic Information</div>

            {isEdit && (
              <div className="form-group">
                <label className="form-label">Document Code</label>
                <input className="form-input" value={doc.code} disabled />
                <span className="form-hint">Auto-generated — cannot be modified</span>
              </div>
            )}

            {/* Field 2: Document Name */}
            <div className={`form-group${isEdit ? "" : " full"}`}>
              <label className="form-label">Document Name <span className="req">*</span></label>
              <input
                className="form-input"
                placeholder="e.g. Aadhaar Card, PAN Card, Passbook"
                value={form.name}
                onChange={e => set("name", e.target.value)}
              />
            </div>

            {/* Field 3: Document Category */}
            <div className="form-group">
              <label className="form-label">Document Category <span className="req">*</span></label>
              <select className="form-select" value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="form-hint">KYC / Loan / Collateral / Others</span>
            </div>

            {/* ── Section 2: Upload Rules ── */}
            <hr className="form-divider" />
            <div className="form-section-title">Upload Validation Rules</div>

            {/* Field 4: Allowed Formats */}
            <div className="form-group full">
              <label className="form-label">Allowed Formats <span className="req">*</span></label>
              <div className="fmt-checks">
                {ALLOWED_FORMATS.map(fmt => (
                  <div
                    key={fmt}
                    className={`fmt-check-btn${form.allowedFormats.includes(fmt) ? " selected" : ""}`}
                    onClick={() => toggleFormat(fmt)}
                  >
                    {form.allowedFormats.includes(fmt) && <span className="fmt-check-dot" />}
                    {fmt}
                  </div>
                ))}
              </div>
              <span className="form-hint">Select all formats accepted for this document type</span>
            </div>

            {/* Field 5: Max File Size */}
            <div className="form-group">
              <label className="form-label">Max File Size (MB) <span className="req">*</span></label>
              <input
                className="form-input"
                type="number"
                min="1"
                max="50"
                placeholder="Default: 5"
                value={form.maxFileSizeMB}
                onChange={e => set("maxFileSizeMB", e.target.value)}
              />
              <span className="form-hint">Per-document size limit (1–50 MB)</span>
            </div>

            {/* Field 7: Retention Period */}
            <div className="form-group">
              <label className="form-label">Retention Period (Years)</label>
              <input
                className="form-input"
                type="number"
                min="1"
                placeholder="e.g. 7"
                value={form.retentionYears}
                onChange={e => set("retentionYears", e.target.value)}
              />
              <span className="form-hint">For archival automation — leave blank if no limit</span>
            </div>

            {/* ── Section 3: Settings ── */}
            <hr className="form-divider" />
            <div className="form-section-title">Settings</div>

            {/* Field 6: Is Mandatory */}
            <div className="form-group">
              <label className="form-label">Is Mandatory</label>
              <div className="toggle-wrap">
                <button
                  className={`toggle${form.isMandatory ? " on" : ""}`}
                  onClick={() => set("isMandatory", !form.isMandatory)}
                />
                <span className={`toggle-label ${form.isMandatory ? "on" : "off"}`}>
                  {form.isMandatory ? "⚠️ Yes — Mandatory" : "🔵 No — Optional"}
                </span>
              </div>
              <span className="form-hint">Used in upload checklist validation</span>
            </div>

            {/* Field 8: Status */}
            <div className="form-group">
              <label className="form-label">Status</label>
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

            {/* Icon & Colour */}
            <hr className="form-divider" />
            <div className="form-section-title">Icon & Colour (UI Display)</div>

            <div className="form-group full">
              <label className="form-label">Select Icon</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                {ICON_OPTIONS.map(ico => (
                  <div
                    key={ico}
                    onClick={() => set("icon", ico)}
                    style={{
                      width: 36, height: 36, borderRadius: 8, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, border: `1px solid ${form.icon === ico ? "var(--accent-blue)" : "var(--border)"}`,
                      background: form.icon === ico ? "#3d8ef022" : "var(--bg-input)",
                      transition: "all 0.15s",
                    }}
                  >
                    {ico}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group full">
              <label className="form-label">Select Colour</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                {COLOR_OPTIONS.map(c => (
                  <div
                    key={c}
                    onClick={() => set("color", c)}
                    style={{
                      width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer",
                      border: form.color === c ? "3px solid #fff" : "3px solid transparent",
                      boxShadow: form.color === c ? `0 0 0 2px ${c}` : "none",
                      transition: "all 0.15s",
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? "💾 Save Changes" : "✅ Create Document Type"}
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
            Marked <b style={{ color: "var(--accent-red)" }}>Inactive</b>. Records retained <b>(soft delete)</b>.
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
