import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .page { padding: 28px; min-height: 100vh; background: var(--bg-main); }
  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .page-title { font-size: 26px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px; }
  .page-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 22px; }
  .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; display: flex; align-items: center; gap: 14px; transition: border-color .2s, transform .2s; }
  .stat-card:hover { border-color: var(--border-light); transform: translateY(-2px); }
  .stat-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .stat-val { font-size: 24px; font-weight: 700; font-family: var(--mono); line-height: 1; color: var(--text-primary); }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 3px; }
  .stat-trend { font-size: 11px; color: var(--accent-green); margin-top: 4px; }

  .btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: var(--font); transition: all 0.15s; white-space: nowrap; }
  .btn-outline { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-light); }
  .btn-outline:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
  .btn-green  { background: #16a34a; color: #fff; }
  .btn-green:hover  { filter: brightness(1.08); transform: translateY(-1px); }
  .btn-red    { background: #dc2626; color: #fff; }
  .btn-red:hover    { filter: brightness(1.08); }
  .btn-blue   { background: var(--accent-blue); color: #fff; }
  .btn-blue:hover   { filter: brightness(1.08); transform: translateY(-1px); }
  .btn-gold   { background: #b8860b; color: #fff; }
  .btn-gold:hover   { filter: brightness(1.1); }
  .btn-sm { padding: 5px 12px; font-size: 12px; }
  .btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }

  .filter-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; margin-bottom: 16px; }
  .filter-card-title { font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; }
  .filter-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .fg { display: flex; flex-direction: column; gap: 5px; }
  .flabel { font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .7px; }
  .fsel, .finput { background: var(--bg-input); border: 1px solid var(--border); border-radius: 7px; padding: 8px 11px; font-size: 12.5px; color: var(--text-primary); font-family: var(--font); outline: none; width: 100%; transition: border-color .15s; }
  .fsel:focus, .finput:focus { border-color: var(--accent-blue); }
  .finput::placeholder { color: var(--text-muted); }

  /* Summary row cards */
  .summary-cards { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 16px; }
  .sum-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 14px 18px; }
  .sum-card-title { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 8px; }
  .sum-card-val { font-size: 22px; font-weight: 700; font-family: var(--mono); color: var(--text-primary); margin-bottom: 2px; }
  .sum-card-sub { font-size: 11px; color: var(--text-muted); }
  .dt-row { display: flex; align-items: center; gap: 8px; margin-top: 6px; font-size: 11.5px; }
  .dt-name { color: var(--text-secondary); display: flex; align-items: center; gap: 5px; flex: 0 0 auto; min-width: 100px; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dt-bar-wrap { flex: 1; }
  .dt-bar-track { background: var(--bg-input); border-radius: 3px; height: 4px; }
  .dt-bar-fill { height: 4px; border-radius: 3px; transition: width .4s ease; }
  .dt-count { font-weight: 700; font-family: var(--mono); color: var(--text-primary); font-size: 12px; flex-shrink: 0; min-width: 28px; text-align: right; }

  .table-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .tcard-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); gap: 12px; flex-wrap: wrap; }
  .tc-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
  .tc-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .export-row { display: flex; gap: 8px; }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th { padding: 10px 13px; font-size: 10.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .7px; text-align: left; border-bottom: 1px solid var(--border); background: #f5f8ff; white-space: nowrap; }
  .data-table td { padding: 11px 13px; font-size: 12.5px; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: #f5f8ff; color: var(--text-primary); }
  .data-table td.pr { color: var(--text-primary); font-weight: 500; }
  .sum-trow td { background: #eef2f8 !important; font-weight: 700 !important; color: var(--text-primary) !important; border-top: 2px solid #c8d8ec !important; font-size: 12px !important; font-family: var(--mono) !important; }

  .drn-badge { font-family: var(--mono); font-size: 10px; color: #b8860b; background: #f5c84215; border: 1px solid #f5c84230; padding: 2px 7px; border-radius: 4px; white-space: nowrap; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 10.5px; font-weight: 600; }
  .badge-ok  { background: #2ec08b22; color: var(--accent-green); border: 1px solid #2ec08b33; }
  .badge-dup { background: #f5c84222; color: #b8860b; border: 1px solid #f5c84233; }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* Schedule modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
  .modal { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; width: 100%; max-width: 460px; overflow: hidden; animation: slideUp .2s ease; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-head { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; }
  .modal-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
  .modal-sub { font-size: 11px; color: var(--text-muted); margin-top: 3px; }
  .modal-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; }
  .modal-footer { padding: 14px 22px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; }
  .close-btn { width: 28px; height: 28px; border-radius: 7px; background: var(--bg-input); border: none; color: var(--text-secondary); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
  .close-btn:hover { background: #fef2f2; color: #dc2626; }
  .toggle-wrap { display: flex; align-items: center; gap: 10px; }
  .toggle { width: 38px; height: 20px; background: var(--border-light); border-radius: 10px; position: relative; cursor: pointer; transition: background .2s; border: none; flex-shrink: 0; }
  .toggle.on { background: #16a34a; }
  .toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .2s; }
  .toggle.on::after { transform: translateX(18px); }
  .toggle-lbl { font-size: 12.5px; font-weight: 600; }
  .toggle-lbl.on { color: #16a34a; }
  .toggle-lbl.off { color: var(--text-muted); }
  .info-box { background: #eff4ff; border: 1px solid #c7d9f8; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #2563eb; line-height: 1.6; }

  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 13px 20px; border-top: 1px solid var(--border); }
  .page-info { font-size: 12px; color: var(--text-muted); }
  .page-btns { display: flex; gap: 5px; }
  .page-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-secondary); font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
  .page-btn.active, .page-btn:hover { background: var(--accent-blue); border-color: var(--accent-blue); color: #fff; }
  .page-btn:disabled { opacity: .4; cursor: not-allowed; }

  .empty-state { text-align: center; padding: 52px 20px; color: var(--text-muted); }
  .spinner { width: 16px; height: 16px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin .6s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .toast { position: fixed; bottom: 28px; right: 28px; z-index: 2000; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 9px; animation: toastIn .25s ease; box-shadow: 0 4px 20px rgba(0,0,0,.4); }
  .toast.success { background: #2ec08b22; color: var(--accent-green); border: 1px solid #2ec08b44; }
  .toast.error   { background: #f05a5a22; color: var(--accent-red);   border: 1px solid #f05a5a44; }
  @keyframes toastIn { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
`;

const API        = "http://localhost:5000/api";
const PAGE_SIZE  = 20;
const DT_COLORS  = ["#2563eb","#16a34a","#f5c842","#9b6ef5","#f5933a","#f05a5a","#26c6da"];

function fmtDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}
function fmtMB(mb) {
  const n = parseFloat(mb) || 0;
  return n < 1 ? `${(n * 1024).toFixed(0)} KB` : `${n.toFixed(2)} MB`;
}

export default function UploadLog() {
  const [data,       setData]       = useState([]);
  const [summary,    setSummary]    = useState(null);
  const [clients,    setClients]    = useState([]);
  const [branches,   setBranches]   = useState([]);
  const [docTypes,   setDocTypes]   = useState([]);
  const [uploaders,  setUploaders]  = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [toast,      setToast]      = useState(null);
  const [page,       setPage]       = useState(1);
  const [exporting,  setExporting]  = useState("");
  const [showSched,  setShowSched]  = useState(false);
  const [schedOn,    setSchedOn]    = useState(false);
  const [schedFreq,  setSchedFreq]  = useState("daily");
  const [schedEmail, setSchedEmail] = useState("");

  const [fDateFrom,   setFDateFrom]   = useState("");
  const [fDateTo,     setFDateTo]     = useState("");
  const [fClient,     setFClient]     = useState("");
  const [fBranch,     setFBranch]     = useState("");
  const [fDocType,    setFDocType]    = useState("");
  const [fUploadedBy, setFUploadedBy] = useState("");
  const [fStatus,     setFStatus]     = useState("");


  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const currentUser = JSON.parse(localStorage.getItem("dms_user") || "{}");
const logExport = (format, count) => {
  fetch("http://localhost:5000/api/reports/log-export", {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exportedBy:  currentUser.username || "Unknown",
      role:        currentUser.role     || null,
      reportType:  "Upload Log",
      format,
      recordCount: count,
      filters: { fDateFrom, fDateTo, fClient, fBranch, fDocType, fUploadedBy, fStatus },
    }),
  }).catch(() => {});
};

  useEffect(() => {
    Promise.all([
      fetch(`${API}/clients`).then(r => r.json()),
      fetch(`${API}/branches`).then(r => r.json()),
      fetch(`${API}/document-types`).then(r => r.json()),
      fetch(`${API}/users`).then(r => r.json()),
    ]).then(([cl, br, dt, us]) => {
      setClients(Array.isArray(cl) ? cl : []);
      setBranches(Array.isArray(br) ? br : []);
      setDocTypes(Array.isArray(dt) ? dt : []);
      setUploaders([...new Set((Array.isArray(us) ? us : []).map(u => u.fullName).filter(Boolean))]);
    }).catch(() => {});
    runReport();
  }, []);

  const buildParams = () => {
    const p = new URLSearchParams();
    if (fDateFrom)   p.set("dateFrom", fDateFrom);
    if (fDateTo)     p.set("dateTo", fDateTo);
    if (fClient)     p.set("clientId", fClient);
    if (fBranch)     p.set("branchId", fBranch);
    if (fDocType)    p.set("docTypeId", fDocType);
    if (fUploadedBy) p.set("uploadedBy", fUploadedBy);
    if (fStatus)     p.set("status", fStatus);
    return p;
  };

  const runReport = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/reports/upload-log?${buildParams()}`);
      const json = await res.json();
      setData(json.data || []);
      setSummary(json.summary || null);
      setPage(1);
    } catch { showToast("Failed to load report", "error"); }
    finally  { setLoading(false); }
  };

  const filtBranches = fClient ? branches.filter(b => String(b.clientId) === fClient) : branches;

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = data.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const byDocType  = summary?.byDocType || {};
  const maxDT      = Math.max(1, ...Object.values(byDocType));
  const dtEntries  = Object.entries(byDocType).sort((a, b) => b[1] - a[1]).slice(0, 6);

  /* ── PDF ── */
  const exportPDF = () => {
    const filterDesc = [
      fDateFrom && `From: ${fDateFrom}`, fDateTo && `To: ${fDateTo}`,
      fClient   && `Client: ${clients.find(c => String(c.id) === fClient)?.name}`,
      fBranch   && `Branch: ${branches.find(b => String(b.id) === fBranch)?.name}`,
      fDocType  && `Doc Type: ${docTypes.find(d => String(d.id) === fDocType)?.name}`,
      fUploadedBy && `By: ${fUploadedBy}`, fStatus && `Status: ${fStatus}`,
    ].filter(Boolean).join(" | ") || "All records";

    const dtSummary = dtEntries.map(([n, c]) => `<b>${n}</b>: ${c}`).join(" &nbsp;|&nbsp; ");

    const rows = data.map((u, i) => `<tr>
      <td>${i + 1}</td>
      <td style="font-family:monospace;font-size:9px">${u.drn}</td>
      <td>${u.customerName || "—"}</td>
      <td style="font-family:monospace;font-size:9px">${u.accountNo || "—"}</td>
      <td>${u.docTypeName || "—"}</td>
      <td style="font-family:monospace">${fmtMB(u.fileSizeMB)}</td>
      <td style="font-size:9px;white-space:nowrap">${fmtDate(u.uploadedAt)}</td>
      <td>${u.uploadedBy || "—"}</td>
      <td>${u.branchName || "—"}</td>
      <td style="font-weight:700;color:${u.isDuplicate ? "#b8860b" : "#16a34a"}">${u.isDuplicate ? "Duplicate" : "OK"}</td>
    </tr>`).join("");

    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <title>Upload Log Report — DMS</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:10px;margin:20px;color:#0f1c33}
        h2{font-size:16px;margin-bottom:3px}
        .meta{color:#666;font-size:10px;margin-bottom:10px}
        .sum{display:flex;gap:28px;background:#eef2f8;padding:10px 14px;border-radius:6px;margin-bottom:10px}
        .si label{display:block;font-size:8px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
        .si span{font-size:16px;font-weight:700;font-family:monospace}
        .dtsum{font-size:9px;margin-bottom:10px;color:#333}
        table{width:100%;border-collapse:collapse}
        th{background:#0f1c33;color:#fff;padding:5px 7px;font-size:8.5px;text-align:left;text-transform:uppercase;letter-spacing:.5px}
        td{padding:4px 7px;border-bottom:1px solid #e2eaf4;font-size:9.5px}
        tr:nth-child(even) td{background:#f8faff}
        .sumrow td{background:#eef2f8!important;font-weight:700;border-top:2px solid #c8d8ec}
        .foot{margin-top:14px;font-size:8px;color:#999;text-align:center}
        @media print{button{display:none!important}}
      </style>
    </head><body>
      <button onclick="window.print()" style="padding:7px 18px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;margin-bottom:14px;font-size:12px;font-weight:700">🖨 Print / Save PDF</button>
      <h2>📋 Image Upload Log Report</h2>
      <div class="meta">Generated: ${new Date().toLocaleString("en-IN")} &nbsp;|&nbsp; Filters: ${filterDesc}</div>
      <div class="sum">
        <div class="si"><label>Total Uploads</label><span>${summary?.total ?? data.length}</span></div>
        <div class="si"><label>Total File Size</label><span>${(summary?.totalSizeMB ?? 0).toFixed(2)} MB</span></div>
        <div class="si"><label>Duplicates</label><span>${summary?.duplicates ?? 0}</span></div>
      </div>
      <div class="dtsum"><b>Count by Document Type:</b> &nbsp; ${dtSummary || "—"}</div>
      <table>
        <thead><tr><th>#</th><th>DRN</th><th>Customer Name</th><th>Acc. No.</th><th>Document Type</th><th>File Size</th><th>Upload Date-Time</th><th>Uploaded By</th><th>Branch</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr class="sumrow">
          <td colspan="5" style="text-align:right;padding:5px 7px">Summary →</td>
          <td>${(summary?.totalSizeMB ?? 0).toFixed(2)} MB</td>
          <td colspan="3"></td>
          <td>${data.length} total · ${summary?.duplicates ?? 0} dup</td>
        </tr></tfoot>
      </table>
      <div class="foot">DMS — AVS InSoTech Pvt. Ltd. &nbsp;|&nbsp; CONFIDENTIAL — Authorised use only &nbsp;|&nbsp; FR-RP-01 &nbsp;|&nbsp; Retention: 7 Years (IT Act 2000 / RBI)</div>
    </body></html>`);
    win.document.close();
    showToast("✅ PDF opened — use browser Print › Save as PDF");
    logExport("PDF", data.length);
  };

  /* ── Excel ── */
  const exportExcel = async () => {
    setExporting("xlsx");
    try {
      if (!window.XLSX) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const XLSX = window.XLSX;
      const wsData = [
        ["Image Upload Log Report — DMS AVS InSoTech"],
        [`Generated: ${new Date().toLocaleString("en-IN")}`],
        [],
        ["SUMMARY"],
        ["Total Uploads",    summary?.total ?? data.length],
        ["Total File Size (MB)", summary?.totalSizeMB ?? 0],
        ["Duplicates",       summary?.duplicates ?? 0],
        [],
        ["Count by Document Type"],
        ...dtEntries.map(([n, c]) => [n, c]),
        [],
        ["#","DRN","Customer Name","Acc. No.","Document Type","File Size (MB)","Upload Date-Time","Uploaded By","Branch","Client","Status"],
        ...data.map((u, i) => [
          i + 1, u.drn, u.customerName || "", u.accountNo || "",
          u.docTypeName || "", parseFloat(u.fileSizeMB).toFixed(2),
          fmtDate(u.uploadedAt), u.uploadedBy || "",
          u.branchName || "", u.clientName || "",
          u.isDuplicate ? "Duplicate" : "OK",
        ]),
        [],
        ["TOTAL", "", "", "", "", (summary?.totalSizeMB ?? 0).toFixed(2), "", "", "", "", `${data.length} records`],
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [4,16,22,14,20,14,20,16,16,20,10].map(w => ({ wch: w }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Upload Log");
      XLSX.writeFile(wb, `upload-log-${new Date().toISOString().slice(0,10)}.xlsx`);
      showToast(`✅ Exported ${data.length} records as Excel`);
      logExport("Excel", data.length);
    } catch { showToast("Excel export failed", "error"); }
    finally  { setExporting(""); }
  };

  /* ── CSV ── */
  const exportCSV = () => {
    window.location.href = `${API}/reports/upload-log/export/csv`;
    
    showToast("✅ CSV download started");
    logExport("CSV", data.length);
  };

  return (
    <>
      <style>{css}</style>
      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-title">📋 Upload Log Report</div>
            <div className="page-subtitle">FR-RP-01 — Image upload activity log · Available to Admin, Manager, Officer</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-outline btn-sm" onClick={() => setShowSched(true)}>📅 Schedule / Auto-email</button>
            <button className="btn btn-blue btn-sm" onClick={runReport} disabled={loading}>
              {loading ? <span className="spinner"/> : "🔍"} Run Report
            </button>
          </div>
        </div>

        <div className="stats-row">
          <StatCard icon="📁" val={summary?.total ?? "—"}                        label="Total Uploads"    trend="Current filter" bg="#3d8ef0" />
          <StatCard icon="💾" val={summary ? `${summary.totalSizeMB} MB` : "—"} label="Total File Size"  trend="Current filter" bg="#2ec08b" />
          <StatCard icon="⚠️" val={summary?.duplicates ?? "—"}                   label="Duplicates"       trend="Detected"       bg="#f5933a" />
          <StatCard icon="📋" val={Object.keys(byDocType).length || "—"}         label="Document Types"   trend="In results"     bg="#9b6ef5" />
        </div>

        {/* Filters */}
        <div className="filter-card">
          <div className="filter-card-title">🔍 Filter Parameters <span style={{fontSize:11,fontWeight:400,color:"var(--text-muted)"}}>— set filters then click Run Report</span></div>
          <div className="filter-grid">
            <div className="fg">
              <label className="flabel">Date From</label>
              <input type="date" className="finput" value={fDateFrom} onChange={e => setFDateFrom(e.target.value)} />
            </div>
            <div className="fg">
              <label className="flabel">Date To</label>
              <input type="date" className="finput" value={fDateTo} onChange={e => setFDateTo(e.target.value)} />
            </div>
            <div className="fg">
              <label className="flabel">Client</label>
              <select className="fsel" value={fClient} onChange={e => { setFClient(e.target.value); setFBranch(""); }}>
                <option value="">All Clients</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="flabel">Branch</label>
              <select className="fsel" value={fBranch} onChange={e => setFBranch(e.target.value)}>
                <option value="">All Branches</option>
                {filtBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="flabel">Document Type</label>
              <select className="fsel" value={fDocType} onChange={e => setFDocType(e.target.value)}>
                <option value="">All Types</option>
                {docTypes.map(d => <option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="flabel">Uploaded By</label>
              <select className="fsel" value={fUploadedBy} onChange={e => setFUploadedBy(e.target.value)}>
                <option value="">All Users</option>
                {uploaders.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="flabel">Status</label>
              <select className="fsel" value={fStatus} onChange={e => setFStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="ok">OK</option>
                <option value="dup">Duplicate</option>
              </select>
            </div>
            <div className="fg" style={{justifyContent:"flex-end",flexDirection:"row",alignItems:"flex-end",gap:8}}>
              <button className="btn btn-outline btn-sm" onClick={() => { setFDateFrom(""); setFDateTo(""); setFClient(""); setFBranch(""); setFDocType(""); setFUploadedBy(""); setFStatus(""); }} style={{height:35}}>✕ Clear</button>
              <button className="btn btn-blue" onClick={runReport} disabled={loading} style={{height:35}}>
                {loading ? <span className="spinner"/> : "🔍"} Run
              </button>
            </div>
          </div>
        </div>

        {/* Summary Row */}
        {summary && (
          <div className="summary-cards">
            <div className="sum-card">
              <div className="sum-card-title">📊 Total Uploads</div>
              <div className="sum-card-val">{summary.total.toLocaleString()}</div>
              <div className="sum-card-sub">{summary.duplicates} duplicate{summary.duplicates !== 1 ? "s" : ""} detected</div>
            </div>
            <div className="sum-card">
              <div className="sum-card-title">💾 Total File Size</div>
              <div className="sum-card-val">{summary.totalSizeMB} MB</div>
              <div className="sum-card-sub">{(summary.totalSizeMB / 1024).toFixed(3)} GB equivalent</div>
            </div>
            <div className="sum-card">
              <div className="sum-card-title">📋 Count by Document Type</div>
              {dtEntries.length === 0
                ? <span style={{fontSize:12,color:"var(--text-muted)"}}>No data</span>
                : dtEntries.map(([name, count], i) => (
                  <div key={name} className="dt-row">
                    <div className="dt-name">
                      <div style={{width:8,height:8,borderRadius:"50%",background:DT_COLORS[i%DT_COLORS.length],flexShrink:0}}/>
                      {name}
                    </div>
                    <div className="dt-bar-wrap">
                      <div className="dt-bar-track">
                        <div className="dt-bar-fill" style={{width:`${(count/maxDT)*100}%`,background:DT_COLORS[i%DT_COLORS.length]}}/>
                      </div>
                    </div>
                    <div className="dt-count">{count}</div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* Table */}
        <div className="table-card">
          <div className="tcard-head">
            <div>
              <div className="tc-title">Upload Log</div>
              <div className="tc-sub">{data.length > 0 ? `${data.length} record${data.length !== 1 ? "s" : ""} · Page ${safePage} of ${totalPages}` : "Run report to load data"}</div>
            </div>
            <div className="export-row">
              <button className="btn btn-outline btn-sm" onClick={exportCSV}     disabled={data.length === 0}>📄 CSV</button>
              <button className="btn btn-green btn-sm"   onClick={exportExcel}   disabled={data.length === 0 || !!exporting}>
                {exporting === "xlsx" ? <span className="spinner"/> : "📊"} Excel
              </button>
              <button className="btn btn-red btn-sm"     onClick={exportPDF}     disabled={data.length === 0}>🖨 PDF</button>
            </div>
          </div>

          {loading ? (
            <div className="empty-state"><span className="spinner" style={{marginRight:8}}/> Loading report...</div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <div style={{fontSize:44,opacity:.3,marginBottom:12}}>📋</div>
              <p>Set filters and click <b>Run Report</b> to load data</p>
            </div>
          ) : (
            <div style={{overflowX:"auto"}}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th><th>DRN</th><th>Customer Name</th><th>Acc. No.</th>
                    <th>Document Type</th><th>File Size</th><th>Upload Date-Time</th>
                    <th>Uploaded By</th><th>Branch</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((u, i) => (
                    <tr key={u.id}>
                      <td style={{color:"var(--text-muted)",fontSize:11}}>{(safePage-1)*PAGE_SIZE+i+1}</td>
                      <td><span className="drn-badge">{u.drn}</span></td>
                      <td className="pr">{u.customerName || "—"}</td>
                      <td style={{fontFamily:"var(--mono)",fontSize:11}}>{u.accountNo || "—"}</td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span>{u.docTypeIcon || "📄"}</span>
                          <span style={{fontSize:12}}>{u.docTypeName || "—"}</span>
                        </div>
                      </td>
                      <td style={{fontFamily:"var(--mono)",fontSize:11}}>{fmtMB(u.fileSizeMB)}</td>
                      <td style={{fontFamily:"var(--mono)",fontSize:11,whiteSpace:"nowrap"}}>{fmtDate(u.uploadedAt)}</td>
                      <td style={{fontSize:12}}>{u.uploadedBy || "—"}</td>
                      <td style={{fontSize:12}}>{u.branchName || "—"}</td>
                      <td>
                        <span className={`badge ${u.isDuplicate ? "badge-dup" : "badge-ok"}`}>
                          <span className="badge-dot"/>
                          {u.isDuplicate ? "Duplicate" : "OK"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {data.length > 0 && (
                  <tfoot>
                    <tr className="sum-trow">
                      <td colSpan={5} style={{textAlign:"right",fontFamily:"var(--font)",fontWeight:700}}>Summary →</td>
                      <td>{(summary?.totalSizeMB ?? 0).toFixed(2)} MB</td>
                      <td colSpan={3}/>
                      <td>{data.length} total · {summary?.duplicates ?? 0} dup</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}

          {data.length > PAGE_SIZE && (
            <div className="pagination">
              <div className="page-info">Showing {(safePage-1)*PAGE_SIZE+1}–{Math.min(safePage*PAGE_SIZE,data.length)} of {data.length}</div>
              <div className="page-btns">
                <button className="page-btn" onClick={() => setPage(1)} disabled={safePage===1}>«</button>
                <button className="page-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage===1}>‹</button>
                {Array.from({length:Math.min(5,totalPages)},(_,i) => {
                  const start = Math.max(1, Math.min(safePage-2, totalPages-4));
                  const pg = start+i;
                  return <button key={pg} className={`page-btn${safePage===pg?" active":""}`} onClick={() => setPage(pg)}>{pg}</button>;
                })}
                <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage===totalPages}>›</button>
                <button className="page-btn" onClick={() => setPage(totalPages)} disabled={safePage===totalPages}>»</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule modal */}
      {showSched && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowSched(false)}>
          <div className="modal">
            <div className="modal-head">
              <div>
                <div className="modal-title">📅 Schedule / Auto-email Report</div>
                <div className="modal-sub">FR-RP-01 — Optional daily/weekly email to Admin and Manager</div>
              </div>
              <button className="close-btn" onClick={() => setShowSched(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="fg">
                <label className="flabel">Auto-email Status</label>
                <div className="toggle-wrap">
                  <button className={`toggle${schedOn?" on":""}`} onClick={() => setSchedOn(v => !v)}/>
                  <span className={`toggle-lbl ${schedOn?"on":"off"}`}>
                    {schedOn ? "Enabled — report will be auto-emailed" : "Disabled"}
                  </span>
                </div>
              </div>
              {schedOn && (
                <>
                  <div className="fg">
                    <label className="flabel">Frequency</label>
                    <select className="fsel" value={schedFreq} onChange={e => setSchedFreq(e.target.value)}>
                      <option value="daily">Daily — sent at 7:00 AM</option>
                      <option value="weekly">Weekly — every Monday 7:00 AM</option>
                    </select>
                  </div>
                  <div className="fg">
                    <label className="flabel">Recipient Emails</label>
                    <input className="finput" placeholder="admin@org.com, manager@org.com"
                      value={schedEmail} onChange={e => setSchedEmail(e.target.value)} />
                    <span style={{fontSize:11,color:"var(--text-muted)"}}>Comma-separated. Admin and Manager always included.</span>
                  </div>
                  <div className="info-box">
                    ℹ️ Report will be generated with current active filters and sent as an Excel (.xlsx) attachment. Ensure the server has SMTP configured for email delivery.
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setShowSched(false)}>Cancel</button>
              <button className="btn btn-blue btn-sm" onClick={() => { setShowSched(false); showToast(schedOn ? `✅ ${schedFreq} schedule enabled` : "Schedule disabled"); }}>
                💾 Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type==="success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </>
  );
}

function StatCard({ icon, val, label, trend, bg }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{background:`${bg}22`}}>{icon}</div>
      <div>
        <div className="stat-val">{val}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-trend">▲ {trend}</div>
      </div>
    </div>
  );
}
