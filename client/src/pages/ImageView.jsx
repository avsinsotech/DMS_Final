import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 

  .page{padding:28px;min-height:100vh;}
  .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;}
  .page-title{font-size:26px;font-weight:700;color:var(--tp);letter-spacing:-.5px;}
  .page-subtitle{font-size:13px;color:var(--tm);margin-top:4px;}

  /* stats */
  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px;}
  .stat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;display:flex;align-items:center;gap:14px;transition:border-color .2s,transform .2s;}
  .stat-card:hover{border-color:var(--border-light);transform:translateY(-2px);}
  .stat-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;}
  .stat-val{font-size:24px;font-weight:700;font-family:var(--mono);line-height:1;}
  .stat-label{font-size:12px;color:var(--ts);margin-top:3px;}
  .stat-trend{font-size:11px;color:var(--green);margin-top:4px;}

  /* search panel */
  .search-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:20px;}
  .search-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
  .search-grid-wide{grid-template-columns:repeat(4,1fr);}
  .fg{display:flex;flex-direction:column;gap:6px;}
  .flabel{font-size:11px;font-weight:700;color:var(--ts);text-transform:uppercase;letter-spacing:.6px;}
  .fsel,.finput{background:var(--bg-input);border:1px solid var(--border);border-radius:8px;padding:9px 13px;font-size:13px;color:var(--tp);font-family:var(--font);outline:none;width:100%;}
  .fsel:focus,.finput:focus{border-color:var(--blue);}

  /* view toggle */
  .view-toggle{display:flex;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;overflow:hidden;}
  .vt-btn{padding:7px 14px;font-size:13px;cursor:pointer;border:none;background:none;color:var(--ts);font-family:var(--font);transition:all .15s;}
  .vt-btn.active{background:var(--blue);color:#fff;}
  .vt-btn:hover:not(.active){color:var(--tp);}

  /* grid view */
  .results-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-bottom:24px;}
  .doc-card{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;overflow:hidden;cursor:pointer;transition:border-color .2s,transform .2s;}
  .doc-card:hover{border-color:var(--blue);transform:translateY(-3px);}
  .doc-thumb{width:100%;height:140px;object-fit:cover;display:block;background:var(--bg-input);}
  .doc-thumb-pdf{width:100%;height:140px;background:#f05a5a15;display:flex;align-items:center;justify-content:center;font-size:44px;}
  .doc-thumb-generic{width:100%;height:140px;background:#3d8ef015;display:flex;align-items:center;justify-content:center;font-size:44px;}
  .doc-card-body{padding:12px;}
  .doc-card-name{font-size:13px;font-weight:600;color:var(--tp);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .doc-card-meta{font-size:11px;color:var(--tm);margin-top:4px;}
  .doc-card-drn{font-family:var(--mono);font-size:10px;color:var(--gold);background:#f5c84215;padding:2px 6px;border-radius:4px;display:inline-block;margin-top:4px;}

  /* list view table */
  .table-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
  .tcard-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border);}
  .tc-title{font-size:15px;font-weight:600;color:var(--tp);}
  .tc-sub{font-size:12px;color:var(--tm);margin-top:2px;}
  .data-table{width:100%;border-collapse:collapse;}
  .data-table th{padding:10px 16px;font-size:11px;font-weight:600;color:#8a9ab8;text-transform:uppercase;letter-spacing:.8px;text-align:left;border-bottom:1px solid #e2eaf4;background:#f5f8ff;}
  .data-table td{padding:11px 16px;font-size:13px;color:#4a5e80;border-bottom:1px solid #f0f4fb;}
  .data-table tr:last-child td{border-bottom:none;}
  .data-table tr:hover td{background:#f5f8ff;color:#0f1c33;}
  .data-table td.pr{color:var(--tp);font-weight:500;}
  .mono{font-family:var(--mono);font-size:11px;color:var(--blue);background:#3d8ef011;padding:2px 6px;border-radius:4px;}
  .drn{font-family:var(--mono);font-size:10px;color:var(--gold);background:#f5c84215;border:1px solid #f5c84230;padding:2px 7px;border-radius:4px;}
  .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;}
  .badge-ok{background:#2ec08b22;color:var(--green);border:1px solid #2ec08b33;}

  .action-btns{display:flex;gap:5px;}
  .action-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:var(--bg-input);color:var(--ts);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
  .action-btn:hover{border-color:var(--blue);color:var(--blue);}
  .action-btn.danger:hover{border-color:var(--red);color:var(--red);}

  .btn{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:var(--font);transition:all .15s;white-space:nowrap;}
  .btn-blue{background:var(--blue);color:#fff;}
  .btn-blue:hover{filter:brightness(1.1);}
  .btn-outline{background:transparent;color:var(--ts);border:1px solid var(--border-light);}
  .btn-outline:hover{border-color:var(--blue);color:var(--blue);}
  .btn-sm{padding:5px 12px;font-size:12px;}
  .btn-danger{background:#f05a5a22;color:var(--red);border:1px solid #f05a5a44;}
  .btn-danger:hover{background:#f05a5a33;}

  .empty-state{text-align:center;padding:52px 20px;color:var(--tm);}
  .pagination{display:flex;align-items:center;justify-content:space-between;padding:13px 20px;border-top:1px solid var(--border);}
  .page-info{font-size:12px;color:var(--tm);}
  .page-btns{display:flex;gap:5px;}
  .page-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:var(--bg-input);color:var(--ts);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
  .page-btn.active,.page-btn:hover{background:var(--blue);border-color:var(--blue);color:#fff;}

  /* ── Image Viewer Modal ── */
  .viewer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:2000;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:fadeIn .2s ease;}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  .viewer-toolbar{position:absolute;top:0;left:0;right:0;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);}
  .viewer-info{display:flex;flex-direction:column;}
  .viewer-filename{font-size:14px;font-weight:600;color:var(--tp);}
  .viewer-meta{font-size:11px;color:var(--ts);margin-top:2px;font-family:var(--mono);}
  .viewer-actions{display:flex;gap:8px;align-items:center;}
  .viewer-img-wrap{position:relative;max-width:90vw;max-height:80vh;display:flex;align-items:center;justify-content:center;}
  .viewer-img{max-width:100%;max-height:80vh;border-radius:8px;object-fit:contain;transition:transform .3s ease;user-select:none;}
  .watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;}
  .watermark-text{font-size:22px;font-weight:900;color:rgba(255,255,255,0.12);transform:rotate(-35deg);white-space:nowrap;letter-spacing:4px;text-transform:uppercase;font-family:var(--mono);}
  .viewer-controls{position:absolute;bottom:0;left:0;right:0;padding:14px 20px;display:flex;align-items:center;justify-content:center;gap:10px;background:rgba(0,0,0,.7);}
  .vc-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);font-family:var(--font);transition:all .15s;}
  .vc-btn:hover{background:rgba(255,255,255,.15);color:#fff;}
  .vc-btn.active{background:var(--blue);border-color:var(--blue);color:#fff;}
  .zoom-display{font-size:13px;font-weight:600;color:rgba(255,255,255,.7);font-family:var(--mono);min-width:52px;text-align:center;}

  .toast{position:fixed;bottom:28px;right:28px;z-index:3000;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:9px;animation:slideIn .25s ease;box-shadow:0 4px 20px rgba(0,0,0,.4);}
  .toast.success{background:#2ec08b22;color:var(--green);border:1px solid #2ec08b44;}
  .toast.error{background:#f05a5a22;color:var(--red);border:1px solid #f05a5a44;}
  @keyframes slideIn{from{transform:translateX(80px);opacity:0;}to{transform:translateX(0);opacity:1;}}
  .spinner{width:16px;height:16px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite;display:inline-block;}
  @keyframes spin{to{transform:rotate(360deg);}}

  ::-webkit-scrollbar{width:6px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:var(--border-light);border-radius:3px;}
`;

const CLIENT_API   = "http://localhost:5000/api/clients";
const BRANCH_API   = "http://localhost:5000/api/branches";
const CUSTOMER_API = "http://localhost:5000/api/customers";
const DOCTYPE_API  = "http://localhost:5000/api/document-types";
const UPLOAD_API   = "http://localhost:5000/api/uploads";

// Simulated user role — in real app comes from auth context
const USER_ROLE = "Admin"; // "Admin" | "Manager" | "Viewer"
const CAN_DOWNLOAD = ["Admin", "Manager"].includes(USER_ROLE);

export default function ImageView() {
  const [uploads,    setUploads]    = useState([]);
  const [clients,    setClients]    = useState([]);
  const [customers,  setCustomers]  = useState([]);
  const [docTypes,   setDocTypes]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [viewMode,   setViewMode]   = useState("grid"); // "grid" | "list"
  const [viewer,     setViewer]     = useState(null);   // selected upload for viewer
  const [zoom,       setZoom]       = useState(1);
  const [rotation,   setRotation]   = useState(0);
  const [toast,      setToast]      = useState(null);

  // Search filters
  const [srchName,   setSrchName]   = useState("");
  const [srchAcct,   setSrchAcct]   = useState("");
  const [srchDocType,setSrchDocType]= useState("");
  const [srchClient, setSrchClient] = useState("");
  const [srchDateFrom,setSrchDateFrom] = useState("");
  const [srchDateTo,  setSrchDateTo]   = useState("");
  const [srchUploadedBy,setSrchUploadedBy] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(UPLOAD_API).then(r => r.json()),
      fetch(CLIENT_API).then(r => r.json()),
      fetch(CUSTOMER_API).then(r => r.json()),
      fetch(DOCTYPE_API).then(r => r.json()),
    ]).then(([up, cl, cu, dt]) => {
      setUploads(Array.isArray(up) ? up : []);
      setClients(Array.isArray(cl) ? cl : []);
      setCustomers(Array.isArray(cu) ? cu : []);
      setDocTypes(Array.isArray(dt) ? dt : []);
    }).catch(() => showToast("Failed to load data", "error"))
      .finally(() => setLoading(false));
  }, []);

  const getCustomer  = id => customers.find(c => c.id === Number(id));
  const getClient    = id => clients.find(c => c.id === Number(id));
  const getDocType   = id => docTypes.find(d => d.id === Number(id));

  // ── Filter uploads ──
  const filtered = uploads.filter(u => {
    const cust = getCustomer(u.customerId);
    const matchName = !srchName || cust?.name?.toLowerCase().includes(srchName.toLowerCase()) ||
                      String(u.customerId).includes(srchName);
    const matchAcct = !srchAcct || cust?.accountNo?.includes(srchAcct);
    const matchDoc  = !srchDocType || String(u.docTypeId) === srchDocType;
    const matchCl   = !srchClient  || String(u.clientId)  === srchClient;
    const matchBy   = !srchUploadedBy || u.uploadedBy?.toLowerCase().includes(srchUploadedBy.toLowerCase());
    const uDate = new Date(u.uploadedAt);
    const matchFrom = !srchDateFrom || uDate >= new Date(srchDateFrom);
    const matchTo   = !srchDateTo   || uDate <= new Date(srchDateTo + "T23:59:59");
    return matchName && matchAcct && matchDoc && matchCl && matchBy && matchFrom && matchTo;
  });

  const clearSearch = () => {
    setSrchName(""); setSrchAcct(""); setSrchDocType(""); setSrchClient("");
    setSrchDateFrom(""); setSrchDateTo(""); setSrchUploadedBy("");
  };

  // ── Viewer actions ──
  const openViewer = async (upload) => {
  fetch(`${UPLOAD_API}/${upload.id}/view`, { method: "POST" }).catch(() => {});
  
  // Fetch full file data for viewer
  try {
    const res  = await fetch(`${UPLOAD_API}/${upload.id}/file`);
    const data = await res.json();
    setViewer({ ...upload, fileData: data.fileData });
  } catch {
    setViewer(upload); // fallback
  }

  setZoom(1);
  setRotation(0);
};
  const closeViewer  = ()  => setViewer(null);
  const zoomIn       = ()  => setZoom(z => Math.min(z + 0.25, 4));
  const zoomOut      = ()  => setZoom(z => Math.max(z - 0.25, 0.25));
  const resetZoom    = ()  => { setZoom(1); setRotation(0); };
  const rotate       = ()  => setRotation(r => (r + 90) % 360);

  const handleDownload = (u) => {
    if (!CAN_DOWNLOAD) { showToast("Download restricted to Manager and Admin roles only", "error"); return; }
    if (!u.fileData) { showToast("File data not available", "error"); return; }
    const a = document.createElement("a");
    a.href = u.fileData;
    a.download = u.fileName;
    a.click();
    showToast(`✅ Downloading ${u.fileName}`);
  };

  const handleSoftDelete = async (u) => {
    if (!["Admin", "Manager"].includes(USER_ROLE)) {
      showToast("Only Admin and Manager can delete documents", "error"); return;
    }
    if (!window.confirm(`Soft-delete "${u.fileName}"? Record will be archived, metadata retained.`)) return;
    try {
      const res = await fetch(`${UPLOAD_API}/${u.id}/delete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Deleted by Admin", deletedBy: "Walmik Darade" }),
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }
      setUploads(prev => prev.filter(x => x.id !== u.id));
      showToast(`🗑 "${u.fileName}" archived (soft delete)`);
    } catch {
      showToast("API Error", "error");
    }
  };

  // ✅ Parse each value to float first
  const totalSize = uploads.reduce((a, u) => a + (parseFloat(u.fileSizeMB) || 0), 0).toFixed(2);
  const uploaders = [...new Set(uploads.map(u => u.uploadedBy))];

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="page-title">Image View</div>
            <div className="page-subtitle">FR-IM-04 — Search, view and manage uploaded documents</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="view-toggle">
  <button
    className={`vt-btn${viewMode === "grid" ? " active" : ""}`}
    onClick={() => setViewMode("grid")}
  >
    ⊞ Grid
  </button>
  <button
    className={`vt-btn${viewMode === "list" ? " active" : ""}`}
    onClick={() => setViewMode("list")}
  >
    ☰ List
  </button>
</div>
            <button className="btn btn-outline btn-sm">📥 Export</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <StatCard icon="🖼"  val={uploads.length}  label="Total Uploads"   trend="All documents"            bg="#3d8ef0" />
          <StatCard icon="👥"  val={new Set(uploads.map(u => u.customerId)).size} label="Customers" trend="With documents" bg="#2ec08b" />
          <StatCard icon="💾"  val={`${totalSize}`}  label="Total Size (MB)" trend="Storage used"             bg="#f5933a" />
          <StatCard icon="📋"  val={new Set(uploads.map(u => u.docTypeId)).size}  label="Doc Types" trend="Categories"    bg="#9b6ef5" />
        </div>

        {/* Search Panel */}
        <div className="search-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ font: "700 14px var(--font)", color: "var(--tp)" }}>🔍 Search & Filter</div>
            <button className="btn btn-outline btn-sm" onClick={clearSearch}>✕ Clear All</button>
          </div>
          <div className="search-grid search-grid-wide">
            <div className="fg">
              <label className="flabel">Customer Name / ID</label>
              <input className="finput" placeholder="Search by name or ID..." value={srchName} onChange={e => setSrchName(e.target.value)} />
            </div>
            <div className="fg">
              <label className="flabel">Account No.</label>
              <input className="finput" placeholder="Account number..." value={srchAcct} onChange={e => setSrchAcct(e.target.value)} />
            </div>
            <div className="fg">
              <label className="flabel">Document Type</label>
              <select className="fsel" value={srchDocType} onChange={e => setSrchDocType(e.target.value)}>
                <option value="">All Types</option>
                {docTypes.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="flabel">Client</label>
              <select className="fsel" value={srchClient} onChange={e => setSrchClient(e.target.value)}>
                <option value="">All Clients</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="flabel">Date From</label>
              <input type="date" className="finput" value={srchDateFrom} onChange={e => setSrchDateFrom(e.target.value)} />
            </div>
            <div className="fg">
              <label className="flabel">Date To</label>
              <input type="date" className="finput" value={srchDateTo} onChange={e => setSrchDateTo(e.target.value)} />
            </div>
            <div className="fg">
              <label className="flabel">Uploaded By</label>
              <select className="fsel" value={srchUploadedBy} onChange={e => setSrchUploadedBy(e.target.value)}>
                <option value="">All Users</option>
                {uploaders.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--ts)" }}>
            Showing <b style={{ color: "var(--tp)" }}>{filtered.length}</b> of <b style={{ color: "var(--tp)" }}>{uploads.length}</b> records
            {!CAN_DOWNLOAD && <span style={{ marginLeft: 12, color: "var(--orange)" }}>⚠️ Download restricted (Viewer role)</span>}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--tm)" }}>
            <span className="spinner" /> Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 44, opacity: .35, marginBottom: 12 }}>🖼</div>
            <p>No documents match your search</p>
          </div>
        ) : viewMode === "grid" ? (

          /* ── Grid View ── */
          <div className="results-grid">
            {filtered.map(u => {
              const cust    = getCustomer(u.customerId);
              const docType = getDocType(u.docTypeId);
              const isImg   = ["JPG","JPEG","PNG"].includes(u.fileExt?.toUpperCase());
              const isPdf   = u.fileExt?.toUpperCase() === "PDF";
              return (
                <div key={u.id} className="doc-card" onClick={() => openViewer(u)}>
                  {isImg && u.fileData && u.fileData !== "HAS_DATA"
  ? <img src={u.fileData} alt={u.fileName} className="doc-thumb" />
  : isPdf
    ? <div className="doc-thumb-pdf">📄</div>
    : <div className="doc-thumb-generic">📁</div>
}
                  <div className="doc-card-body">
                    <div className="doc-card-name">{u.fileName}</div>
                    <div className="doc-card-meta">
                      👤 {cust?.name || "—"}<br />
                      📋 {docType?.name || "—"}<br />
                      🕐 {new Date(u.uploadedAt).toLocaleDateString("en-IN")}
                    </div>
                    <div className="doc-card-drn">{u.drn}</div>
                  </div>
                </div>
              );
            })}
          </div>

        ) : (

          /* ── List View ── */
          <div className="table-card">
            <div className="tcard-head">
              <div>
                <div className="tc-title">Document List</div>
                <div className="tc-sub">{filtered.length} records found</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>DRN</th>
                  <th>File</th>
                  <th>Document Type</th>
                  <th>Customer</th>
                  <th>Account No.</th>
                  <th>Client</th>
                  <th>Size</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const cust    = getCustomer(u.customerId);
                  const docType = getDocType(u.docTypeId);
                  const client  = getClient(u.clientId);
                  const isImg   = ["JPG","JPEG","PNG"].includes(u.fileExt?.toUpperCase());
                  return (
                    <tr key={u.id}>
                      <td><span className="drn">{u.drn}</span></td>
                      <td className="pr">
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                         {isImg && u.fileData && u.fileData !== "HAS_DATA"
  ? <img src={u.fileData} alt="" style={{ width:32, height:32, borderRadius:6, objectFit:"cover", border:"1px solid var(--border)" }} />
  : <span style={{ fontSize: 20 }}>{u.fileExt === "PDF" ? "📄" : "📁"}</span>
}
                          <span style={{ fontSize: 12 }}>{u.fileName}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span>{docType?.icon}</span>
                          <span style={{ fontSize: 12 }}>{docType?.name || "—"}</span>
                        </div>
                      </td>
                      <td>{cust?.name || "—"}</td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{cust?.accountNo || "—"}</td>
                      <td style={{ fontSize: 12 }}>{client?.name || "—"}</td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{u.fileSizeMB} MB</td>
                      <td style={{ fontSize: 12 }}>{u.uploadedBy}</td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{new Date(u.uploadedAt).toLocaleDateString("en-IN")}</td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn" title="View" onClick={() => openViewer(u)}>👁</button>
                          {CAN_DOWNLOAD && <button className="action-btn" title="Download" onClick={() => handleDownload(u)}>⬇</button>}
                          {["Admin","Manager"].includes(USER_ROLE) && <button className="action-btn danger" title="Archive" onClick={() => handleSoftDelete(u)}>🗑</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="pagination">
              <div className="page-info">Showing 1–{filtered.length} of {filtered.length}</div>
              <div className="page-btns">
                <button className="page-btn">‹</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">›</button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Image Viewer Modal ── */}
      {viewer && (
        <div className="viewer-overlay" onClick={closeViewer}>
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

            {/* Toolbar */}
            <div className="viewer-toolbar">
              <div className="viewer-info">
                <div className="viewer-filename">{viewer.fileName}</div>
                <div className="viewer-meta">DRN: {viewer.drn} · {viewer.fileSizeMB} MB · {viewer.uploadedBy} · {new Date(viewer.uploadedAt).toLocaleString("en-IN")}</div>
              </div>
              <div className="viewer-actions">
                {CAN_DOWNLOAD && (
                  <button className="vc-btn" onClick={() => handleDownload(viewer)}>⬇ Download</button>
                )}
                <button className="vc-btn" onClick={closeViewer}>✕ Close</button>
              </div>
            </div>

            {/* Image */}
            <div className="viewer-img-wrap">
              {["JPG","JPEG","PNG"].includes(viewer.fileExt?.toUpperCase()) && viewer.fileData ? (
                <>
                  <img
                    src={viewer.fileData}
                    alt={viewer.fileName}
                    className="viewer-img"
                    style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                  />
                  <div className="watermark">
                    <div className="watermark-text">CONFIDENTIAL – DMS</div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", color: "var(--ts)" }}>
                  <div style={{ fontSize: 80 }}>{viewer.fileExt === "PDF" ? "📄" : "📁"}</div>
                  <div style={{ marginTop: 12, fontSize: 14 }}>{viewer.fileName}</div>
                  <div style={{ fontSize: 12, marginTop: 6, color: "var(--tm)" }}>Preview not available for {viewer.fileExt} files</div>
                  {CAN_DOWNLOAD && <button className="btn btn-blue" style={{ marginTop: 16 }} onClick={() => handleDownload(viewer)}>⬇ Download to View</button>}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="viewer-controls">
              <button className="vc-btn" onClick={zoomOut}>🔍−</button>
              <span className="zoom-display">{Math.round(zoom * 100)}%</span>
              <button className="vc-btn" onClick={zoomIn}>🔍+</button>
              <button className="vc-btn" onClick={rotate}>↻ Rotate</button>
              <button className="vc-btn" onClick={resetZoom}>⊙ Reset</button>
            </div>

          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </>
  );
}

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
