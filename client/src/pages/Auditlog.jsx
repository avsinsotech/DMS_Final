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
  .btn-blue:hover   { filter: brightness(1.08); }
  .btn-sm { padding: 5px 12px; font-size: 12px; }
  .btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }

  .admin-badge { display: inline-flex; align-items: center; gap: 6px; background: #dc262615; border: 1px solid #dc262630; color: #dc2626; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
  .retention-badge { display: inline-flex; align-items: center; gap: 6px; background: #f5c84215; border: 1px solid #f5c84230; color: #b8860b; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }

  /* Action breakdown */
  .action-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 18px; }
  .action-mini { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; text-align: center; cursor: pointer; transition: border-color .15s; }
  .action-mini:hover { border-color: var(--accent-blue); }
  .action-mini.active { border-color: var(--accent-blue); background: #eff4ff; }
  .action-mini-icon { font-size: 20px; margin-bottom: 4px; }
  .action-mini-val { font-size: 18px; font-weight: 700; font-family: var(--mono); color: var(--text-primary); }
  .action-mini-label { font-size: 9px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }

  .filter-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; margin-bottom: 16px; }
  .filter-card-title { font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; }
  .filter-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .fg { display: flex; flex-direction: column; gap: 5px; }
  .flabel { font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .7px; }
  .fsel, .finput { background: var(--bg-input); border: 1px solid var(--border); border-radius: 7px; padding: 8px 11px; font-size: 12.5px; color: var(--text-primary); font-family: var(--font); outline: none; width: 100%; transition: border-color .15s; }
  .fsel:focus, .finput:focus { border-color: var(--accent-blue); }
  .finput::placeholder { color: var(--text-muted); }

  .table-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .tcard-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); gap: 12px; flex-wrap: wrap; }
  .tc-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
  .tc-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .export-row { display: flex; gap: 8px; }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th { padding: 10px 12px; font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .7px; text-align: left; border-bottom: 1px solid var(--border); background: #f5f8ff; white-space: nowrap; }
  .data-table td { padding: 10px 12px; font-size: 12px; color: var(--text-secondary); border-bottom: 1px solid var(--border); vertical-align: top; }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: #f5f8ff; color: var(--text-primary); }
  .data-table td.pr { color: var(--text-primary); font-weight: 500; }

  .mono { font-family: var(--mono); font-size: 11px; color: var(--accent-blue); background: #3d8ef011; padding: 2px 6px; border-radius: 4px; }

  /* Action type badges */
  .ab { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 10.5px; font-weight: 700; white-space: nowrap; }
  .ab-login    { background: #fef3c7; color: #92400e; }
  .ab-logout   { background: #f1f5f9; color: #64748b; }
  .ab-upload   { background: #dbeafe; color: #1d4ed8; }
  .ab-create   { background: #d1fae5; color: #065f46; }
  .ab-update   { background: #f3e8ff; color: #6d28d9; }
  .ab-delete   { background: #fee2e2; color: #991b1b; }
  .ab-view     { background: #e0f2fe; color: #0369a1; }
  .ab-export   { background: #fce7f3; color: #9d174d; }
  .ab-default  { background: #f0f4fb; color: #4a5e80; }

  /* Role badge */
  .role-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
  .rb-admin     { background: #f5c84222; color: #b8860b; }
  .rb-manager   { background: #3d8ef022; color: #2563eb; }
  .rb-officer   { background: #2ec08b22; color: #16a34a; }
  .rb-dataentry { background: #f5933a22; color: #c2410c; }
  .rb-viewer    { background: #9b6ef522; color: #7c3aed; }
  .rb-default   { background: #f0f4fb;   color: #4a5e80; }

  /* Status badge */
  .sb-success { background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
  .sb-failed  { background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }

  .val-cell { font-size: 11px; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-muted); }
  .val-cell.has-val { color: var(--text-secondary); }
  .detail-cell { font-size: 11.5px; color: var(--text-secondary); max-width: 220px; line-height: 1.5; }

  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 13px 20px; border-top: 1px solid var(--border); }
  .page-info { font-size: 12px; color: var(--text-muted); }
  .page-btns { display: flex; gap: 5px; }
  .page-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-secondary); font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
  .page-btn.active, .page-btn:hover { background: var(--accent-blue); border-color: var(--accent-blue); color: #fff; }
  .page-btn:disabled { opacity: .4; cursor: not-allowed; }

  .info-strip { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 14px; font-size: 12px; color: var(--text-muted); }
  .info-strip b { color: var(--text-primary); }

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

const API       = "http://localhost:5000/api";
const PAGE_SIZE = 25;

const ACTION_MAP = {
  LOGIN:            { cls:"ab-login",  icon:"🔐", label:"Login"       },
  LOGOUT:           { cls:"ab-logout", icon:"🚪", label:"Logout"      },
  UPLOAD:           { cls:"ab-upload", icon:"📤", label:"Upload"      },
  VIEW:             { cls:"ab-view",   icon:"👁",  label:"View Doc"    },
  CREATE_CLIENT:    { cls:"ab-create", icon:"🏢", label:"Create"      },
  CREATE_USER:      { cls:"ab-create", icon:"👤", label:"Create"      },
  CREATE_GROUP:     { cls:"ab-create", icon:"👥", label:"Create"      },
  UPDATE_USER:      { cls:"ab-update", icon:"✏️",  label:"Edit"        },
  ACTIVATE_USER:    { cls:"ab-create", icon:"✅", label:"Activate"    },
  DEACTIVATE_USER:  { cls:"ab-delete", icon:"🚫", label:"Deactivate"  },
  DELETE:           { cls:"ab-delete", icon:"🗑",  label:"Delete"      },
  RESET_PASSWORD:   { cls:"ab-update", icon:"🔑", label:"Reset Pwd"   },
  UNLOCK_USER:      { cls:"ab-update", icon:"🔓", label:"Unlock"      },
  GROUP_ADD_USER:   { cls:"ab-create", icon:"➕", label:"Add Member"  },
  GROUP_REMOVE_USER:{ cls:"ab-delete", icon:"➖", label:"Rem Member"  },
  DOWNLOAD:         { cls:"ab-export", icon:"⬇",  label:"Download"    },
  EXPORT:           { cls:"ab-export", icon:"📥", label:"Export"      },
  PERMISSION_CHANGE:{ cls:"ab-update", icon:"🔐", label:"Perm Change" },
};

const ACTION_TYPES = Object.keys(ACTION_MAP);

const ROLE_CLS = {
  Admin:"rb-admin", Manager:"rb-manager", Officer:"rb-officer",
  DataEntry:"rb-dataentry", Viewer:"rb-viewer",
};

function fmtDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit" });
}

function ActionBadge({ action }) {
  const s = ACTION_MAP[action] || { cls:"ab-default", icon:"📝", label: action };
  return <span className={`ab ${s.cls}`}>{s.icon} {action}</span>;
}

function RoleBadge({ role }) {
  if (!role || role === "—") return <span style={{color:"var(--text-muted)"}}>—</span>;
  return <span className={`role-badge ${ROLE_CLS[role] || "rb-default"}`}>{role}</span>;
}

export default function AuditLog() {
  const [data,      setData]      = useState([]);
  const [summary,   setSummary]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState(null);
  const [page,      setPage]      = useState(1);
  const [exporting, setExporting] = useState("");
  const [activeAction, setActiveAction] = useState("");

  const [fDateFrom,  setFDateFrom]  = useState("");
  const [fDateTo,    setFDateTo]    = useState("");
  const [fUser,      setFUser]      = useState("");
  const [fAction,    setFAction]    = useState("");
  const [fModule,    setFModule]    = useState("");
  const [fIP,        setFIP]        = useState("");
  const [fStatus,    setFStatus]    = useState("");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const currentUser = JSON.parse(localStorage.getItem("dms_user") || "{}");
const logExport = (format, count) => {
  fetch("http://localhost:5000/api/reports/log-export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exportedBy:  currentUser.username || "Unknown",
      role:        currentUser.role     || null,
      reportType:  "Audit Log",
      format,
      recordCount: count,
      filters: { fDateFrom, fDateTo, fUser, fAction, fModule, fIP, fStatus },
    }),
  }).catch(() => {});
};

  useEffect(() => { runReport(); }, []);

  const buildParams = () => {
    const p = new URLSearchParams();
    if (fDateFrom) p.set("dateFrom", fDateFrom);
    if (fDateTo)   p.set("dateTo", fDateTo);
    if (fUser)     p.set("user", fUser);
    if (fAction || activeAction) p.set("action", fAction || activeAction);
    if (fModule)   p.set("entity", fModule);
    if (fIP)       p.set("ipAddress", fIP);
    if (fStatus)   p.set("status", fStatus);
    return p;
  };

  const runReport = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/reports/audit-log?${buildParams()}`);
      const json = await res.json();
      setData(json.data || []);
      setSummary(json.summary || null);
      setPage(1);
    } catch { showToast("Failed to load audit log", "error"); }
    finally  { setLoading(false); }
  };

  /* Unique values for filter dropdowns */
  const uniqueUsers   = [...new Set(data.map(l => l.user).filter(Boolean))];
  const uniqueModules = [...new Set(data.map(l => l.module).filter(b => b && b !== "—"))];
  const uniqueIPs     = [...new Set(data.map(l => l.ipAddress).filter(b => b && b !== "—"))];

  /* Action breakdown top rows */
  const actionCounts = summary?.actionBreakdown || {};
  const topActions   = Object.entries(actionCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = data.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* ── PDF ── */
  const exportPDF = () => {
    const rows = data.map((l, i) => `<tr>
      <td>${l.id}</td>
      <td style="font-size:8.5px;white-space:nowrap">${fmtDate(l.timestamp)}</td>
      <td>${l.user || "—"}</td>
      <td style="font-size:9px">${l.role || "—"}</td>
      <td><span style="font-size:9px;background:#f0f4fb;padding:1px 5px;border-radius:4px">${l.module || "—"}</span></td>
      <td style="font-size:9px;font-weight:600">${l.action}</td>
      <td style="font-family:monospace;font-size:8.5px">${l.recordId || "—"}</td>
      <td style="font-size:8.5px;color:#666;max-width:80px;overflow:hidden;text-overflow:ellipsis">${l.oldVal || "—"}</td>
      <td style="font-size:8.5px;color:#666;max-width:80px;overflow:hidden;text-overflow:ellipsis">${l.newVal || "—"}</td>
      <td style="font-family:monospace;font-size:8.5px">${l.ipAddress || "—"}</td>
      <td style="font-weight:700;color:${l.status === "failed" ? "#dc2626" : "#16a34a"}">${l.status || "success"}</td>
    </tr>`).join("");

    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <title>Audit / Activity Log Report — DMS</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:9px;margin:16px;color:#0f1c33}
        h2{font-size:15px;margin-bottom:3px}
        .meta{color:#666;font-size:9px;margin-bottom:10px}
        .sum{display:flex;gap:24px;background:#eef2f8;padding:8px 12px;border-radius:6px;margin-bottom:8px}
        .si label{display:block;font-size:8px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
        .si span{font-size:14px;font-weight:700;font-family:monospace}
        .warn{background:#fff3cd;border:1px solid #ffc107;border-radius:6px;padding:6px 10px;font-size:9px;color:#856404;margin-bottom:8px}
        table{width:100%;border-collapse:collapse}
        th{background:#0f1c33;color:#fff;padding:4px 6px;font-size:8px;text-align:left;text-transform:uppercase;letter-spacing:.4px}
        td{padding:3px 6px;border-bottom:1px solid #e2eaf4;font-size:8.5px}
        tr:nth-child(even) td{background:#f8faff}
        .foot{margin-top:12px;font-size:7.5px;color:#999;text-align:center}
        @media print{button{display:none!important}}
      </style>
    </head><body>
      <button onclick="window.print()" style="padding:6px 16px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;margin-bottom:12px;font-size:11px;font-weight:700">🖨 Print / Save PDF</button>
      <h2>🔍 System Audit / Activity Log Report</h2>
      <div class="meta">Generated: ${new Date().toLocaleString("en-IN")} &nbsp;|&nbsp; Admin Only — Confidential</div>
      <div class="warn">⚠️ This report contains sensitive system activity data. Retention: 7 Years (IT Act 2000 / RBI Guidelines)</div>
      <div class="sum">
        <div class="si"><label>Total Entries</label><span>${summary?.total ?? data.length}</span></div>
        <div class="si"><label>Unique Users</label><span>${summary?.uniqueUsers ?? 0}</span></div>
        <div class="si"><label>Retention</label><span>${summary?.retentionYears ?? 7} yrs</span></div>
      </div>
      <table>
        <thead><tr>
          <th>Log ID</th><th>Timestamp</th><th>User</th><th>Role</th>
          <th>Module</th><th>Action</th><th>Record ID</th>
          <th>Old Value</th><th>New Value</th><th>IP Address</th><th>Status</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="foot">DMS — AVS InSoTech Pvt. Ltd. &nbsp;|&nbsp; FR-RP-02 System Audit Log &nbsp;|&nbsp; CONFIDENTIAL — Admin Access Only</div>
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
        ["System Audit / Activity Log Report — DMS AVS InSoTech"],
        [`Generated: ${new Date().toLocaleString("en-IN")} | Admin Only | Confidential`],
        [`Retention: ${summary?.retentionYears ?? 7} Years (IT Act 2000 / RBI Guidelines)`],
        [],
        ["SUMMARY"],
        ["Total Entries",  summary?.total ?? data.length],
        ["Unique Users",   summary?.uniqueUsers ?? 0],
        [],
        ["Log ID","Timestamp","User","Role","Module","Action","Record ID","Old Value","New Value","IP Address","Detail","Status"],
        ...data.map(l => [
          l.id, fmtDate(l.timestamp), l.user, l.role || "—",
          l.module || "—", l.action, l.recordId || "—",
          l.oldVal || "—", l.newVal || "—",
          l.ipAddress || "—", l.detail || "", l.status || "success",
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [8,20,14,12,12,18,10,18,18,16,32,10].map(w => ({ wch: w }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Audit Log");
      XLSX.writeFile(wb, `audit-log-${new Date().toISOString().slice(0,10)}.xlsx`);
      showToast(`✅ Exported ${data.length} records as Excel`);
      logExport("Excel", data.length);
    } catch { showToast("Excel export failed", "error"); }
    finally  { setExporting(""); }
  };

  /* ── CSV (server-side full export) ── */
  const exportCSV = () => {
    window.location.href = `${API}/reports/audit-log/export/csv`;
    showToast("✅ Full CSV export started");
    logExport("CSV", data.length);
  };

  /* Action mini click — quick filter */
  const handleActionMini = (action) => {
    const next = activeAction === action ? "" : action;
    setActiveAction(next);
    setFAction(next);
  };

  return (
    <>
      <style>{css}</style>
      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-title">🔍 Audit / Activity Log</div>
            <div className="page-subtitle">FR-RP-02 — System-wide activity log for compliance, governance and security audit</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span className="admin-badge">🔒 Admin Only</span>
            <span className="retention-badge">📅 Retention: 7 Years</span>
            <button className="btn btn-blue btn-sm" onClick={runReport} disabled={loading}>
              {loading ? <span className="spinner"/> : "🔍"} Run Report
            </button>
          </div>
        </div>

        <div className="stats-row">
          <StatCard icon="📝" val={summary?.total ?? "—"}        label="Total Log Entries" trend="Current filter" bg="#3d8ef0" />
          <StatCard icon="👤" val={summary?.uniqueUsers ?? "—"}  label="Unique Users"      trend="System-wide"   bg="#2ec08b" />
          <StatCard icon="🔐" val={actionCounts["LOGIN"] ?? "—"} label="Login Events"      trend="All time"      bg="#f5933a" />
          <StatCard icon="📤" val={actionCounts["UPLOAD"] ?? "—"}label="Upload Events"     trend="All time"      bg="#9b6ef5" />
        </div>

        {/* Action breakdown quick-filter pills */}
        {topActions.length > 0 && (
          <div className="action-grid">
            {topActions.map(([action, count]) => {
              const s = ACTION_MAP[action] || { icon:"📝", label: action };
              return (
                <div key={action} className={`action-mini${activeAction===action?" active":""}`}
                  onClick={() => handleActionMini(action)}>
                  <div className="action-mini-icon">{s.icon}</div>
                  <div className="action-mini-val">{count}</div>
                  <div className="action-mini-label">{s.label || action}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filters — FR-RP-02: Date Range | User | Module | Action Type | IP Address | Status */}
        <div className="filter-card">
          <div className="filter-card-title">🔍 Filter Parameters <span style={{fontSize:11,fontWeight:400,color:"var(--text-muted)"}}>— set filters then click Run Report</span></div>
          <div className="filter-grid">
            <div className="fg">
              <label className="flabel">Date Range From</label>
              <input type="date" className="finput" value={fDateFrom} onChange={e => setFDateFrom(e.target.value)} />
            </div>
            <div className="fg">
              <label className="flabel">Date Range To</label>
              <input type="date" className="finput" value={fDateTo} onChange={e => setFDateTo(e.target.value)} />
            </div>
            <div className="fg">
              <label className="flabel">User</label>
              <select className="fsel" value={fUser} onChange={e => setFUser(e.target.value)}>
                <option value="">All Users</option>
                {uniqueUsers.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="flabel">Action Type</label>
              <select className="fsel" value={fAction} onChange={e => { setFAction(e.target.value); setActiveAction(e.target.value); }}>
                <option value="">All Actions</option>
                {ACTION_TYPES.map(a => (
                  <option key={a} value={a}>{ACTION_MAP[a]?.icon} {a}</option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label className="flabel">Module</label>
              <select className="fsel" value={fModule} onChange={e => setFModule(e.target.value)}>
                <option value="">All Modules</option>
                {uniqueModules.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="flabel">IP Address</label>
              <select className="fsel" value={fIP} onChange={e => setFIP(e.target.value)}>
                <option value="">All IPs</option>
                {uniqueIPs.map(ip => <option key={ip}>{ip}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="flabel">Status</label>
              <select className="fsel" value={fStatus} onChange={e => setFStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="fg" style={{justifyContent:"flex-end",flexDirection:"row",alignItems:"flex-end",gap:8}}>
              <button className="btn btn-outline btn-sm"
                onClick={() => { setFDateFrom(""); setFDateTo(""); setFUser(""); setFAction(""); setFModule(""); setFIP(""); setFStatus(""); setActiveAction(""); }}
                style={{height:35}}>✕ Clear</button>
              <button className="btn btn-blue" onClick={runReport} disabled={loading} style={{height:35}}>
                {loading ? <span className="spinner"/> : "🔍"} Run
              </button>
            </div>
          </div>
        </div>

        {/* Info strip */}
        <div className="info-strip">
          <span>📊 Showing <b>{data.length}</b> entries</span>
          <span>·</span>
          <span>👤 <b>{summary?.uniqueUsers ?? 0}</b> unique users</span>
          <span>·</span>
          <span>🗂 <b>{Object.keys(actionCounts).length}</b> action types</span>
          <span style={{marginLeft:"auto",fontSize:11}}>ℹ️ Audit log retention: <b>7 years</b> per IT Act 2000 &amp; RBI guidelines applicable to co-operative sector</span>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="tcard-head">
            <div>
              <div className="tc-title">Activity Log Entries</div>
              <div className="tc-sub">{data.length > 0 ? `${data.length} record${data.length!==1?"s":""} · Page ${safePage} of ${totalPages}` : "Run report to load entries"}</div>
            </div>
            <div className="export-row">
              <button className="btn btn-outline btn-sm" onClick={exportCSV}   disabled={data.length===0}>📄 CSV (Full)</button>
              <button className="btn btn-green btn-sm"   onClick={exportExcel} disabled={data.length===0||!!exporting}>
                {exporting==="xlsx" ? <span className="spinner"/> : "📊"} Excel
              </button>
              <button className="btn btn-red btn-sm"     onClick={exportPDF}   disabled={data.length===0}>🖨 PDF</button>
            </div>
          </div>

          {loading ? (
            <div className="empty-state"><span className="spinner" style={{marginRight:8}}/> Loading audit log...</div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <div style={{fontSize:44,opacity:.3,marginBottom:12}}>🔍</div>
              <p>Set filters and click <b>Run Report</b></p>
            </div>
          ) : (
            <div style={{overflowX:"auto"}}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Module</th>
                    <th>Action</th>
                    <th>Record ID</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                    <th>IP Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map(l => (
                    <tr key={l.id}>
                      <td><span className="mono">{l.id}</span></td>
                      <td style={{fontFamily:"var(--mono)",fontSize:10.5,whiteSpace:"nowrap"}}>{fmtDate(l.timestamp)}</td>
                      <td className="pr" style={{whiteSpace:"nowrap"}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <div style={{width:26,height:26,borderRadius:"50%",background:"#3d8ef022",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#2563eb",flexShrink:0}}>
                            {(l.user||"?").charAt(0).toUpperCase()}
                          </div>
                          {l.user || "—"}
                        </div>
                      </td>
                      <td><RoleBadge role={l.role}/></td>
                      <td>
                        {l.module && l.module !== "—"
                          ? <span style={{fontSize:11,padding:"2px 7px",borderRadius:4,background:"#f0f4fb",color:"#4a5e80",border:"1px solid #e2eaf4",fontWeight:600}}>{l.module}</span>
                          : <span style={{color:"var(--text-muted)"}}>—</span>}
                      </td>
                      <td><ActionBadge action={l.action}/></td>
                      <td style={{fontFamily:"var(--mono)",fontSize:10.5}}>{l.recordId || "—"}</td>
                      <td>
                        <div className={`val-cell${l.oldVal && l.oldVal!=="—"?" has-val":""}`} title={l.oldVal}>
                          {l.oldVal && l.oldVal !== "—" ? l.oldVal : <span style={{color:"var(--text-muted)"}}>—</span>}
                        </div>
                      </td>
                      <td>
                        <div className={`val-cell${l.newVal && l.newVal!=="—"?" has-val":""}`} title={l.newVal}>
                          {l.newVal && l.newVal !== "—" ? l.newVal : <span style={{color:"var(--text-muted)"}}>—</span>}
                        </div>
                      </td>
                      <td style={{fontFamily:"var(--mono)",fontSize:10.5}}>{l.ipAddress || "—"}</td>
                      <td>
                        <span className={l.status === "failed" ? "sb-failed" : "sb-success"}>
                          {l.status === "failed" ? "Failed" : "Success"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
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
