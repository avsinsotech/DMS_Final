import { useState, useEffect, useRef, useCallback } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }


  .page{padding:28px;min-height:100vh;}
  .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;}
  .page-title{font-size:26px;font-weight:700;color:var(--tp);letter-spacing:-.5px;}
  .page-subtitle{font-size:13px;color:var(--tm);margin-top:4px;}

  /* ── Two-column layout ── */
  .upload-layout{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px;}

  /* ── Card ── */
  .card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
  .card-head{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
  .card-title{font-size:14px;font-weight:700;color:var(--tp);}
  .card-sub{font-size:12px;color:var(--tm);margin-top:2px;}
  .card-body{padding:20px;}

  /* ── Step badge ── */
  .step-badge{width:26px;height:26px;border-radius:50%;background:var(--blue);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .step-head{display:flex;align-items:center;gap:10px;}

  /* ── Form elements ── */
  .fg{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
  .fg:last-child{margin-bottom:0;}
  .flabel{font-size:11px;font-weight:700;color:var(--ts);text-transform:uppercase;letter-spacing:.6px;}
  .flabel .req{color:var(--red);margin-left:3px;}
  .fsel,.finput{background:var(--bg-input);border:1px solid var(--border);border-radius:8px;padding:9px 13px;font-size:13px;color:var(--tp);font-family:var(--font);outline:none;width:100%;}
  .fsel:focus,.finput:focus{border-color:var(--blue);}
  .fsel:disabled{opacity:.5;cursor:not-allowed;}
  .fhint{font-size:11px;color:var(--tm);}

  /* doc type info box */
  .doctype-info{background:#3d8ef011;border:1px solid #3d8ef025;border-radius:8px;padding:11px 14px;margin-top:6px;display:flex;gap:16px;flex-wrap:wrap;}
  .di-item{display:flex;flex-direction:column;gap:2px;}
  .di-label{font-size:10px;color:var(--tm);text-transform:uppercase;letter-spacing:.6px;}
  .di-val{font-size:12px;font-weight:600;color:var(--tp);font-family:var(--mono);}

  /* ── Drop zone ── */
  .drop-zone{
    border:2px dashed var(--border-light);border-radius:10px;
    padding:32px 20px;text-align:center;cursor:pointer;
    transition:all .2s;position:relative;
    background:var(--bg-input);
  }
  .drop-zone:hover,.drop-zone.dragging{border-color:var(--blue);background:#3d8ef010;}
  .drop-zone.has-files{border-color:var(--green);background:#2ec08b08;}
  .drop-zone.error-zone{border-color:var(--red);background:#f05a5a08;}
  .dz-icon{font-size:36px;margin-bottom:10px;}
  .dz-title{font-size:14px;font-weight:600;color:var(--tp);margin-bottom:4px;}
  .dz-sub{font-size:12px;color:var(--tm);}
  .dz-input{display:none;}

  /* ── File list ── */
  .file-list{display:flex;flex-direction:column;gap:10px;margin-top:16px;}
  .file-item{background:var(--bg-input);border:1px solid var(--border);border-radius:9px;padding:12px 14px;display:flex;align-items:center;gap:12px;}
  .file-item.valid{border-color:#2ec08b44;}
  .file-item.invalid{border-color:#f05a5a44;background:#f05a5a08;}
  .file-item.warn{border-color:#f5c84244;background:#f5c84208;}
  .file-thumb{width:44px;height:44px;border-radius:7px;object-fit:cover;flex-shrink:0;border:1px solid var(--border);}
  .file-thumb-pdf{width:44px;height:44px;border-radius:7px;background:#f05a5a22;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
  .file-thumb-generic{width:44px;height:44px;border-radius:7px;background:#3d8ef022;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
  .file-info{flex:1;min-width:0;}
  .file-name{font-size:13px;font-weight:600;color:var(--tp);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .file-meta{font-size:11px;color:var(--tm);margin-top:2px;font-family:var(--mono);}
  .file-status{font-size:11px;font-weight:600;margin-top:3px;}
  .file-status.ok{color:var(--green);}
  .file-status.err{color:var(--red);}
  .file-status.warn{color:var(--gold);}
  .file-remove{width:26px;height:26px;border-radius:6px;border:1px solid var(--border);background:var(--bg-input);color:var(--ts);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
  .file-remove:hover{border-color:var(--red);color:var(--red);}

  /* ── Progress bar ── */
  .progress-wrap{margin-top:10px;}
  .progress-label{display:flex;justify-content:space-between;font-size:11px;color:var(--ts);margin-bottom:5px;}
  .progress-track{background:var(--bg-input);border-radius:4px;height:6px;overflow:hidden;}
  .progress-bar{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--blue),var(--green));transition:width .3s ease;}

  /* ── Remarks ── */
  .remarks-area{background:var(--bg-input);border:1px solid var(--border);border-radius:8px;padding:10px 13px;font-size:13px;color:var(--tp);font-family:var(--font);outline:none;width:100%;resize:vertical;min-height:72px;}
  .remarks-area:focus{border-color:var(--blue);}

  /* ── Buttons ── */
  .btn{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:var(--font);transition:all .15s;white-space:nowrap;}
  .btn-gold{background:var(--gold);color:#0f1623;}
  .btn-gold:hover{filter:brightness(1.1);transform:translateY(-1px);}
  .btn-blue{background:var(--blue);color:#fff;}
  .btn-blue:hover{filter:brightness(1.1);transform:translateY(-1px);}
  .btn-outline{background:transparent;color:var(--ts);border:1px solid var(--border-light);}
  .btn-outline:hover{border-color:var(--blue);color:var(--blue);}
  .btn-danger{background:#f05a5a22;color:var(--red);border:1px solid #f05a5a44;}
  .btn-sm{padding:5px 12px;font-size:12px;}
  .btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important;}

  /* session timer */
  .session-bar{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ts);background:var(--bg-input);border:1px solid var(--border);border-radius:8px;padding:6px 12px;width:fit-content;}
  .session-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:pulse 2s infinite;}
  .session-bar.expiring .session-dot{background:var(--red);}
  .session-bar.expiring{border-color:#f05a5a44;color:var(--red);}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}

  /* ── History table ── */
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
  .drn-badge{font-family:var(--mono);font-size:10px;color:var(--gold);background:#f5c84215;border:1px solid #f5c84230;padding:2px 7px;border-radius:4px;}
  .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;}
  .badge-dot{width:5px;height:5px;border-radius:50%;}
  .badge-ok{background:#2ec08b22;color:var(--green);border:1px solid #2ec08b33;}
  .badge-ok .badge-dot{background:var(--green);}
  .badge-dup{background:#f5c84222;color:var(--gold);border:1px solid #f5c84233;}
  .badge-dup .badge-dot{background:var(--gold);}
  .action-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:var(--bg-input);color:var(--ts);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
  .action-btn:hover{border-color:var(--blue);color:var(--blue);}
  .action-btns{display:flex;gap:5px;}

  .spinner{width:16px;height:16px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite;display:inline-block;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .toast{position:fixed;bottom:28px;right:28px;z-index:2000;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:9px;animation:slideIn .25s ease;box-shadow:0 4px 20px rgba(0,0,0,.4);}
  .toast.success{background:#2ec08b22;color:var(--green);border:1px solid #2ec08b44;}
  .toast.error{background:#f05a5a22;color:var(--red);border:1px solid #f05a5a44;}
  .toast.warn{background:#f5c84222;color:var(--gold);border:1px solid #f5c84244;}
  @keyframes slideIn{from{transform:translateX(80px);opacity:0;}to{transform:translateX(0);opacity:1;}}

  .empty-state{text-align:center;padding:40px 20px;color:var(--tm);}
  .filter-bar{display:flex;gap:9px;margin-bottom:14px;flex-wrap:wrap;}
  .fi{flex:1;min-width:160px;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;padding:8px 13px;font-size:13px;color:var(--tp);font-family:var(--font);outline:none;}
  .fi:focus{border-color:var(--blue);}
  .fs{background:var(--bg-input);border:1px solid var(--border);border-radius:8px;padding:8px 13px;font-size:13px;color:var(--ts);font-family:var(--font);outline:none;cursor:pointer;}

  ::-webkit-scrollbar{width:6px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:var(--border-light);border-radius:3px;}
`;

const CLIENT_API   = "http://localhost:5000/api/clients";
const BRANCH_API   = "http://localhost:5000/api/branches";
const CUSTOMER_API = "http://localhost:5000/api/customers";
const DOCTYPE_API  = "http://localhost:5000/api/document-types";
const UPLOAD_API   = "http://localhost:5000/api/uploads";

// ── MD5-like hash (simple for demo — use crypto in production) ──
async function hashFile(file) {
  const buf = await file.arrayBuffer();
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  const arr = Array.from(new Uint8Array(hashBuf));
  return arr.map(b => b.toString(16).padStart(2,"0")).join("").slice(0, 16).toUpperCase();
}

function formatBytes(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024*1024)  return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/(1024*1024)).toFixed(2)} MB`;
}

export default function ImageUpload() {
  const [clients,      setClients]      = useState([]);
  const [branches,     setBranches]     = useState([]);
  const [customers,    setCustomers]    = useState([]);
  const [docTypes,     setDocTypes]     = useState([]);
  const [uploads,      setUploads]      = useState([]);

  const [selClient,    setSelClient]    = useState("");
  const [selBranch,    setSelBranch]    = useState("");
  const [selCustomer,  setSelCustomer]  = useState("");
  const [selDocType,   setSelDocType]   = useState("");
  const [remarks,      setRemarks]      = useState("");

  const [files,        setFiles]        = useState([]);   // {file, preview, hash, status, error}
  const [uploading,    setUploading]    = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [dragging,     setDragging]     = useState(false);
  const [toast,        setToast]        = useState(null);
  const [sessionSecs,  setSessionSecs]  = useState(30 * 60);

  const [histSearch,   setHistSearch]   = useState("");
  const [histClient,   setHistClient]   = useState("");

  const fileInputRef = useRef(null);
  const sessionRef   = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Session timer (30 min) ──
  useEffect(() => {
    sessionRef.current = setInterval(() => {
      setSessionSecs(s => {
        if (s <= 1) { clearInterval(sessionRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(sessionRef.current);
  }, []);

  const resetSession = () => setSessionSecs(30 * 60);
  const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // ── Fetch master data ──
  useEffect(() => {
    Promise.all([
      fetch(CLIENT_API).then(r => r.json()),
      fetch(BRANCH_API).then(r => r.json()),
      fetch(CUSTOMER_API).then(r => r.json()),
      fetch(DOCTYPE_API).then(r => r.json()),
      fetch(UPLOAD_API).then(r => r.json()),
    ]).then(([cl, br, cu, dt, up]) => {
      setClients(Array.isArray(cl) ? cl.filter(c => c.status) : []);
      setBranches(Array.isArray(br) ? br.filter(b => b.status) : []);
      setCustomers(Array.isArray(cu) ? cu.filter(c => c.status) : []);
      setDocTypes(Array.isArray(dt) ? dt.filter(d => d.status) : []);
      setUploads(Array.isArray(up) ? up : []);
    }).catch(() => showToast("Failed to load master data", "error"));
  }, []);

  // ── Filtered dropdowns ──
  const filtBranches  = branches.filter(b => String(b.clientId) === selClient);
  const filtCustomers = customers.filter(c =>
    String(c.clientId) === selClient &&
    (!selBranch || String(c.branchId) === selBranch)
  );
  const selDocTypeObj   = docTypes.find(d => String(d.id) === selDocType);
  const selCustomerObj  = customers.find(c => String(c.id) === selCustomer);

  // ── Handle file selection ──
  const handleFiles = useCallback(async (rawFiles) => {
    if (!selDocTypeObj) { showToast("Please select a Document Type first", "error"); return; }
    resetSession();

    const processed = await Promise.all(Array.from(rawFiles).map(async (file) => {
      const ext      = file.name.split(".").pop().toUpperCase();
      const sizeMB   = file.size / (1024 * 1024);
      const hash     = await hashFile(file);
      const allowed  = selDocTypeObj.allowedFormats || [];
      const maxMB    = selDocTypeObj.maxFileSizeMB  || 5;

      let status = "valid", error = "";

      if (!allowed.includes(ext)) {
        status = "invalid";
        error  = `Format ${ext} not allowed. Allowed: ${allowed.join(", ")}`;
      } else if (sizeMB > maxMB) {
        status = "invalid";
        error  = `File too large (${sizeMB.toFixed(1)} MB). Max: ${maxMB} MB`;
      }

      // Duplicate check
      const isDuplicate = uploads.some(
        u => u.hash === hash &&
             String(u.customerId) === selCustomer &&
             String(u.docTypeId)  === selDocType
      );
      if (isDuplicate && status === "valid") {
        status = "warn";
        error  = "⚠️ Duplicate detected: same file already uploaded for this customer + document type";
      }

      // Preview
      let preview = null;
      if (["JPG","JPEG","PNG"].includes(ext)) {
        preview = URL.createObjectURL(file);
      }

      return { file, preview, hash, status, error, ext, sizeMB: sizeMB.toFixed(2) };
    }));

    setFiles(prev => [...prev, ...processed]);
  }, [selDocTypeObj, selCustomer, selDocType, uploads]);

  // ── Drag & drop ──
  const onDragOver  = e => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop      = e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); };
  const onFileInput = e => handleFiles(e.target.files);
  const removeFile  = idx => setFiles(prev => prev.filter((_, i) => i !== idx));

  // ── Submit upload ──
  const handleUpload = async () => {
    if (!selClient || !selCustomer || !selDocType) {
      showToast("Please select Client, Customer and Document Type", "error"); return;
    }
    const validFiles = files.filter(f => f.status === "valid");
    if (validFiles.length === 0) {
      showToast("No valid files to upload", "error"); return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const results = [];
      for (let i = 0; i < validFiles.length; i++) {
        const f = validFiles[i];

        // Convert to base64
        const base64 = await new Promise((res) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result);
          reader.readAsDataURL(f.file);
        });

        const payload = {
          clientId:   Number(selClient),
          branchId:   selBranch   ? Number(selBranch)   : null,
          customerId: Number(selCustomer),
          docTypeId:  Number(selDocType),
          fileName:   f.file.name,
          fileExt:    f.ext,
          fileSizeMB: Number(f.sizeMB),
          hash:       f.hash,
          remarks,
          fileData:   base64,
          uploadedBy: "Walmik Darade",
        };

        const res    = await fetch(UPLOAD_API, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        results.push(result.data);

        setProgress(Math.round(((i + 1) / validFiles.length) * 100));
      }

      setUploads(prev => [...results, ...prev]);
      setFiles([]);
      setRemarks("");
      showToast(`✅ ${validFiles.length} file(s) uploaded successfully`);
      resetSession();
    } catch (err) {
      showToast(`Upload failed: ${err.message}`, "error");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  // ── History filter ──
  const filtUploads = uploads.filter(u =>
    (!histSearch || u.fileName?.toLowerCase().includes(histSearch.toLowerCase()) ||
     u.drn?.toLowerCase().includes(histSearch.toLowerCase())) &&
    (!histClient || String(u.clientId) === histClient)
  );

  const getClientName  = id => clients.find(c => c.id === Number(id))?.name  || "—";
  const getCustomerName= id => customers.find(c => c.id === Number(id))?.name || "—";
  const getDocTypeName = id => docTypes.find(d => d.id === Number(id))?.name  || "—";

  const validCount   = files.filter(f => f.status === "valid").length;
  const invalidCount = files.filter(f => f.status === "invalid").length;
  const warnCount    = files.filter(f => f.status === "warn").length;

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* ── Header ── */}
        <div className="page-header">
          <div>
            <div className="page-title">Image Upload</div>
            <div className="page-subtitle">FR-IM-03 — Upload documents linked to customer and document type</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className={`session-bar${sessionSecs < 300 ? " expiring" : ""}`}>
              <div className="session-dot" />
              Session: {fmtTime(sessionSecs)}
              {sessionSecs < 300 && " — expiring soon!"}
            </div>
            <button className="btn btn-outline btn-sm" onClick={resetSession}>🔄 Reset Session</button>
          </div>
        </div>

        <div className="upload-layout">

          {/* ── Step 1: Selection ── */}
          <div className="card">
            <div className="card-head">
              <div className="step-head">
                <div className="step-badge">1</div>
                <div>
                  <div className="card-title">Select Customer & Document Type</div>
                  <div className="card-sub">Client → Branch → Customer → Document Type</div>
                </div>
              </div>
            </div>
            <div className="card-body">

              {/* Client */}
              <div className="fg">
                <label className="flabel">Client <span className="req">*</span></label>
                <select className="fsel" value={selClient} onChange={e => { setSelClient(e.target.value); setSelBranch(""); setSelCustomer(""); }}>
                  <option value="">— Select Client —</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}
                </select>
              </div>

              {/* Branch */}
              <div className="fg">
                <label className="flabel">Branch</label>
                <select className="fsel" value={selBranch} onChange={e => { setSelBranch(e.target.value); setSelCustomer(""); }} disabled={!selClient}>
                  <option value="">— All Branches —</option>
                  {filtBranches.map(b => <option key={b.id} value={b.id}>{b.code} – {b.name}</option>)}
                </select>
                {selClient && filtBranches.length === 0 && <span className="fhint" style={{color:"var(--red)"}}>No active branches for this client</span>}
              </div>

              {/* Customer */}
              <div className="fg">
                <label className="flabel">Customer <span className="req">*</span></label>
                <select className="fsel" value={selCustomer} onChange={e => setSelCustomer(e.target.value)} disabled={!selClient}>
                  <option value="">— Select Customer —</option>
                  {filtCustomers.map(c => <option key={c.id} value={c.id}>{c.code} – {c.name} ({c.mobile})</option>)}
                </select>
                {selCustomerObj && (
                  <div style={{ fontSize: 11, color: "var(--ts)", marginTop: 4 }}>
                    📋 A/C: {selCustomerObj.accountNo || "—"} &nbsp;|&nbsp; 📍 {clients.find(c => c.id === selCustomerObj.clientId)?.name}
                  </div>
                )}
              </div>

              {/* Document Type */}
              <div className="fg">
                <label className="flabel">Document Type <span className="req">*</span></label>
                <select className="fsel" value={selDocType} onChange={e => { setSelDocType(e.target.value); setFiles([]); }} disabled={!selCustomer}>
                  <option value="">— Select Document Type —</option>
                  {docTypes.map(d => <option key={d.id} value={d.id}>{d.icon} {d.name} {d.isMandatory ? "(Required)" : "(Optional)"}</option>)}
                </select>
                {selDocTypeObj && (
                  <div className="doctype-info">
                    <div className="di-item">
                      <span className="di-label">Formats</span>
                      <span className="di-val">{selDocTypeObj.allowedFormats?.join(", ")}</span>
                    </div>
                    <div className="di-item">
                      <span className="di-label">Max Size</span>
                      <span className="di-val">{selDocTypeObj.maxFileSizeMB} MB</span>
                    </div>
                    <div className="di-item">
                      <span className="di-label">Category</span>
                      <span className="di-val">{selDocTypeObj.category}</span>
                    </div>
                    <div className="di-item">
                      <span className="di-label">Mandatory</span>
                      <span className="di-val" style={{color: selDocTypeObj.isMandatory ? "var(--orange)" : "var(--blue)"}}>
                        {selDocTypeObj.isMandatory ? "⚠️ Yes" : "🔵 No"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Remarks */}
              <div className="fg">
                <label className="flabel">Remarks / Notes</label>
                <textarea
                  className="remarks-area"
                  placeholder="Optional notes about this upload..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>

            </div>
          </div>

          {/* ── Step 2: File Upload ── */}
          <div className="card">
            <div className="card-head">
              <div className="step-head">
                <div className="step-badge">2</div>
                <div>
                  <div className="card-title">Upload Files</div>
                  <div className="card-sub">
                    {files.length === 0
                      ? "Drag & drop or click to select files"
                      : `${files.length} file(s) — ${validCount} valid${invalidCount ? `, ${invalidCount} invalid` : ""}${warnCount ? `, ${warnCount} duplicate` : ""}`}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">

              {/* Drop zone */}
              <div
                className={`drop-zone${dragging ? " dragging" : ""}${files.length > 0 && invalidCount === 0 ? " has-files" : ""}${invalidCount > 0 ? " error-zone" : ""}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => selDocType ? fileInputRef.current.click() : showToast("Select a Document Type first", "error")}
              >
                <div className="dz-icon">{files.length > 0 ? "📦" : "📂"}</div>
                <div className="dz-title">
                  {dragging ? "Drop files here!" : files.length > 0 ? "Drop more files" : "Drag & drop files here"}
                </div>
                <div className="dz-sub">
                  {selDocTypeObj
                    ? `Allowed: ${selDocTypeObj.allowedFormats?.join(", ")} · Max ${selDocTypeObj.maxFileSizeMB} MB per file · Multiple files allowed`
                    : "Select a document type first to see upload rules"}
                </div>
                <input
                  ref={fileInputRef}
                  className="dz-input"
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.tiff,.tif"
                  onChange={onFileInput}
                />
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="file-list">
                  {files.map((f, i) => (
                    <div key={i} className={`file-item ${f.status}`}>
                      {/* Thumbnail */}
                      {f.preview
                        ? <img src={f.preview} alt="" className="file-thumb" />
                        : f.ext === "PDF"
                          ? <div className="file-thumb-pdf">📄</div>
                          : <div className="file-thumb-generic">📁</div>
                      }
                      <div className="file-info">
                        <div className="file-name">{f.file.name}</div>
                        <div className="file-meta">{f.ext} · {f.sizeMB} MB · Hash: {f.hash}</div>
                        {f.error
                          ? <div className={`file-status ${f.status === "warn" ? "warn" : "err"}`}>{f.error}</div>
                          : <div className="file-status ok">✅ Ready to upload</div>
                        }
                      </div>
                      <button className="file-remove" onClick={() => removeFile(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress bar */}
              {(uploading || progress > 0) && (
                <div className="progress-wrap">
                  <div className="progress-label">
                    <span>{uploading ? "Uploading..." : "Done!"}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button
                  className="btn btn-gold"
                  style={{ flex: 1 }}
                  disabled={uploading || validCount === 0 || !selCustomer || !selDocType}
                  onClick={handleUpload}
                >
                  {uploading ? <><span className="spinner" /> Uploading...</> : `⬆ Upload ${validCount > 0 ? validCount : ""} File${validCount !== 1 ? "s" : ""}`}
                </button>
                {files.length > 0 && (
                  <button className="btn btn-outline btn-sm" onClick={() => setFiles([])}>🗑 Clear All</button>
                )}
              </div>

              {/* Stats */}
              {files.length > 0 && (
                <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                  {validCount > 0   && <span style={{ fontSize: 12, color: "var(--green)" }}>✅ {validCount} valid</span>}
                  {invalidCount > 0 && <span style={{ fontSize: 12, color: "var(--red)" }}>❌ {invalidCount} invalid</span>}
                  {warnCount > 0    && <span style={{ fontSize: 12, color: "var(--gold)" }}>⚠️ {warnCount} duplicate</span>}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── Upload History ── */}
        <div className="table-card">
          <div className="tcard-head">
            <div>
              <div className="tc-title">Upload History</div>
              <div className="tc-sub">{filtUploads.length} record{filtUploads.length !== 1 ? "s" : ""} — this session and previous</div>
            </div>
            <button className="btn btn-outline btn-sm">📥 Export</button>
          </div>

          {/* History filters */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <div className="filter-bar" style={{ margin: 0 }}>
              <input className="fi" placeholder="Search by filename or DRN..." value={histSearch} onChange={e => setHistSearch(e.target.value)} />
              <select className="fs" value={histClient} onChange={e => setHistClient(e.target.value)}>
                <option value="">All Clients</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {filtUploads.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 36, opacity: .35, marginBottom: 8 }}>📂</div>
              <p style={{ fontSize: 13 }}>No uploads yet — select a customer and upload files above</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>DRN</th>
                  <th>File Name</th>
                  <th>Document Type</th>
                  <th>Customer</th>
                  <th>Client</th>
                  <th>Size</th>
                  <th>Hash</th>
                  <th>Uploaded By</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtUploads.map(u => (
                  <tr key={u.id}>
                    <td><span className="drn-badge">{u.drn}</span></td>
                    <td className="pr">
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span>{u.fileExt === "PDF" ? "📄" : "🖼"}</span>
                        <span style={{ fontSize: 12, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.fileName}</span>
                      </div>
                    </td>
                    <td>{getDocTypeName(u.docTypeId)}</td>
                    <td>{getCustomerName(u.customerId)}</td>
                    <td style={{ fontSize: 12 }}>{getClientName(u.clientId)}</td>
                   
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{parseFloat(u.fileSizeMB).toFixed(2)} MB</td>
                    <td><span className="mono">{u.hash}</span></td>
                    <td style={{ fontSize: 12 }}>{u.uploadedBy}</td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{new Date(u.uploadedAt).toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`badge ${u.isDuplicate ? "badge-dup" : "badge-ok"}`}>
                        <span className="badge-dot" />
                        {u.isDuplicate ? "Duplicate" : "OK"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : toast.type === "warn" ? "⚠️" : "❌"} {toast.msg}
        </div>
      )}
    </>
  );
}
