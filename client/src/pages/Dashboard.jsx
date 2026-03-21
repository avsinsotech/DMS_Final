import { useState, useEffect } from "react";

const css = `
  .dash { padding: 28px; min-height: 100vh; background: #eef2f8; font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .anim   { animation: fadeUp .35s ease both; }
  .anim-1 { animation-delay: .04s; }
  .anim-2 { animation-delay: .08s; }
  .anim-3 { animation-delay: .12s; }
  .anim-4 { animation-delay: .16s; }
  .anim-5 { animation-delay: .20s; }

  /* ── Skeleton loader ── */
  .skeleton { background: linear-gradient(90deg, #e2eaf4 25%, #f0f4fb 50%, #e2eaf4 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* ── Page header ── */
  .ph { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:22px; }
  .ph-title { font-size:28px; font-weight:800; color:#0f1c33; letter-spacing:-.5px; }
  .ph-sub   { font-size:13px; color:#8a9ab8; margin-top:4px; }
  .ph-right { display:flex; align-items:center; gap:8px; }

  .period-tabs { display:flex; background:#ffffff; border:1px solid #e2eaf4; border-radius:9px; overflow:hidden; }
  .pt-btn { padding:7px 16px; font-size:12.5px; font-weight:600; cursor:pointer; border:none; background:none; color:#8a9ab8; font-family:'DM Sans',sans-serif; transition:all .15s; }
  .pt-btn.active { background:#2563eb; color:#fff; }
  .pt-btn:hover:not(.active) { color:#0f1c33; }

  .btn-quick { display:inline-flex; align-items:center; gap:7px; padding:8px 18px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:none; font-family:'DM Sans',sans-serif; background:#2563eb; color:#fff; transition:all .15s; }
  .btn-quick:hover { filter:brightness(1.1); transform:translateY(-1px); }

  /* ── Stat cards ── */
  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:20px; }
  .stat-card { background:#ffffff; border:1px solid #e2eaf4; border-radius:12px; padding:22px 20px; display:flex; align-items:center; gap:16px; box-shadow:0 2px 10px rgba(15,28,51,0.05); transition:border-color .2s,transform .2s,box-shadow .2s; cursor:default; }
  .stat-card:hover { border-color:#c8d8ec; transform:translateY(-3px); box-shadow:0 6px 24px rgba(15,28,51,0.09); }
  .stat-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
  .stat-val  { font-size:28px; font-weight:800; color:#0f1c33; line-height:1; font-family:'JetBrains Mono',monospace; letter-spacing:-1px; }
  .stat-label { font-size:12.5px; color:#4a5e80; margin-top:4px; font-weight:500; }
  .stat-trend { font-size:11px; margin-top:5px; font-weight:600; }
  .trend-up   { color:#16a34a; }
  .trend-neu  { color:#2563eb; }

  /* ── Main grid ── */
  .main-grid { display:grid; grid-template-columns:1fr 360px; gap:18px; margin-bottom:18px; }

  /* ── Card ── */
  .card { background:#ffffff; border:1px solid #e2eaf4; border-radius:12px; box-shadow:0 2px 10px rgba(15,28,51,0.05); overflow:hidden; }
  .card-head { padding:18px 20px; border-bottom:1px solid #f0f4fb; display:flex; align-items:center; justify-content:space-between; }
  .card-title { font-size:15px; font-weight:700; color:#0f1c33; }
  .card-sub   { font-size:12px; color:#8a9ab8; margin-top:2px; }
  .card-body  { padding:20px; }

  .chart-tabs { display:flex; gap:6px; }
  .ct-btn { padding:5px 12px; font-size:12px; font-weight:600; border-radius:7px; cursor:pointer; border:1px solid #e2eaf4; background:#f5f8ff; color:#8a9ab8; font-family:'DM Sans',sans-serif; transition:all .15s; }
  .ct-btn.active { background:#2563eb; border-color:#2563eb; color:#fff; }
  .ct-btn:hover:not(.active) { border-color:#c8d8ec; color:#4a5e80; }

  .btn-sm { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:7px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid #e2eaf4; background:#f5f8ff; color:#4a5e80; font-family:'DM Sans',sans-serif; transition:all .15s; }
  .btn-sm:hover { border-color:#c8d8ec; color:#0f1c33; }
  .btn-view { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:7px; font-size:12px; font-weight:700; cursor:pointer; border:none; background:#0f1c33; color:#fff; font-family:'DM Sans',sans-serif; transition:all .15s; }
  .btn-view:hover { background:#1d3461; }

  /* ── Chart ── */
  .chart-legend { display:flex; align-items:center; gap:18px; margin-top:14px; }
  .leg-item { display:flex; align-items:center; gap:6px; font-size:12px; color:#4a5e80; font-weight:500; }
  .leg-dot  { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

  .chart-stats { display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid #f0f4fb; margin-top:16px; }
  .cs-item { padding:14px 16px; }
  .cs-item:not(:last-child) { border-right:1px solid #f0f4fb; }
  .cs-val   { font-size:22px; font-weight:800; color:#0f1c33; font-family:'JetBrains Mono',monospace; letter-spacing:-1px; }
  .cs-val.green  { color:#16a34a; }
  .cs-val.orange { color:#f5933a; }
  .cs-label { font-size:11.5px; color:#8a9ab8; margin-top:3px; }

  /* ── Activity ── */
  .activity-list { display:flex; flex-direction:column; }
  .act-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #f0f4fb; align-items:flex-start; }
  .act-item:last-child { border-bottom:none; }
  .act-dot  { width:10px; height:10px; border-radius:50%; flex-shrink:0; margin-top:4px; }
  .act-body { flex:1; min-width:0; }
  .act-text { font-size:12.5px; color:#0f1c33; line-height:1.5; }
  .act-meta { display:flex; align-items:center; gap:8px; margin-top:4px; flex-wrap:wrap; }
  .act-time   { font-size:11px; color:#8a9ab8; }
  .act-branch { font-size:11px; color:#4a5e80; }
  .act-badge  { font-size:10px; font-weight:700; padding:2px 8px; border-radius:5px; }
  .badge-upload  { background:#dbeafe; color:#1d4ed8; }
  .badge-create  { background:#d1fae5; color:#065f46; }
  .badge-config  { background:#f3e8ff; color:#6d28d9; }
  .badge-login   { background:#fef3c7; color:#92400e; }
  .badge-delete  { background:#fee2e2; color:#991b1b; }
  .badge-default { background:#f0f4fb; color:#4a5e80; }

  /* ── Bottom grid ── */
  .bottom-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:18px; }

  /* Doc type rows */
  .doctype-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid #f5f8ff; }
  .doctype-row:last-child { border-bottom:none; }
  .dt-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
  .dt-info { flex:1; min-width:0; }
  .dt-name  { font-size:12.5px; font-weight:600; color:#0f1c33; }
  .dt-count { font-size:11px; color:#8a9ab8; margin-top:1px; }
  .dt-bar-wrap  { width:80px; }
  .dt-bar-track { background:#f0f4fb; border-radius:4px; height:5px; }
  .dt-bar-fill  { height:5px; border-radius:4px; }
  .dt-pct { font-size:11px; font-weight:700; margin-top:3px; text-align:right; }

  /* Quick actions */
  .qa-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .qa-btn { display:flex; flex-direction:column; align-items:flex-start; gap:4px; padding:14px; border-radius:10px; cursor:pointer; border:1.5px solid #e2eaf4; background:#f8faff; transition:all .15s; text-align:left; }
  .qa-btn:hover { border-color:#2563eb; background:#eff4ff; transform:translateY(-2px); box-shadow:0 4px 16px rgba(37,99,235,0.1); }
  .qa-icon  { font-size:20px; }
  .qa-label { font-size:12px; font-weight:700; color:#0f1c33; }
  .qa-desc  { font-size:10.5px; color:#8a9ab8; }

  /* Storage */
  .storage-track { background:#f0f4fb; border-radius:6px; height:10px; overflow:hidden; }
  .storage-fill  { height:10px; border-radius:6px; background:linear-gradient(90deg,#2563eb,#3b82f6); transition:width .8s ease; }
  .storage-labels { display:flex; justify-content:space-between; font-size:11px; color:#8a9ab8; margin-top:6px; }
  .storage-row { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid #f5f8ff; }
  .storage-row:last-child { border-bottom:none; }
  .sr-label { font-size:12px; color:#4a5e80; display:flex; align-items:center; gap:6px; }
  .sr-dot   { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  .sr-val   { font-size:12px; font-weight:700; color:#0f1c33; font-family:'JetBrains Mono',monospace; }

  /* Mini stats */
  .mini-stat { background:#f8faff; border:1px solid #e2eaf4; border-radius:9px; padding:12px 14px; }
  .mini-val   { font-size:20px; font-weight:800; font-family:'JetBrains Mono',monospace; }
  .mini-label { font-size:11.5px; color:#8a9ab8; margin-top:3px; }

  /* Role breakdown */
  .role-row { display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f5f8ff; }
  .role-row:last-child { border-bottom:none; }
  .role-name-wrap { display:flex; align-items:center; gap:7px; font-size:12px; color:#4a5e80; }
  .role-dot  { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .role-count { font-size:13px; font-weight:700; color:#0f1c33; font-family:'JetBrains Mono',monospace; }

  /* Health */
  .health-row { display:flex; justify-content:space-between; align-items:center; padding:5px 0; }
  .health-val { font-size:12px; font-weight:700; }

  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#d8e4f0; border-radius:3px; }
`;

//const API = "http://localhost:5000/api";

const API = `${import.meta.env.VITE_API_URL}/api`;

// ── SVG line chart ──
function LineChart({ data, labels, avg }) {
  if (!data || data.length < 2) return (
    <div style={{height:160,display:"flex",alignItems:"center",justifyContent:"center",color:"#8a9ab8",fontSize:13}}>
      No upload data yet
    </div>
  );
  const pad  = { t:20, r:20, b:36, l:38 };
  const W    = 640; const H = 160;
  const iW   = W - pad.l - pad.r;
  const iH   = H - pad.t - pad.b;
  const maxV = Math.max(...data, 1) * 1.2;
  const xs   = data.map((_, i) => pad.l + (i / (data.length - 1)) * iW);
  const ys   = data.map(v => pad.t + iH - (v / maxV) * iH);
  const poly = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const area = `M${xs[0]},${ys[0]} ${xs.map((x,i)=>`L${x},${ys[i]}`).join(" ")} L${xs[xs.length-1]},${pad.t+iH} L${xs[0]},${pad.t+iH} Z`;
  const avgY = pad.t + iH - ((avg||0) / maxV) * iH;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto"}}>
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity=".18"/>
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0.25,0.5,0.75,1].map((r,i) => (
        <line key={i} x1={pad.l} y1={pad.t+iH*(1-r)} x2={pad.l+iW} y2={pad.t+iH*(1-r)} stroke="#f0f4fb" strokeWidth="1"/>
      ))}
      {[0, Math.round(maxV*0.5), Math.round(maxV*0.8)].map((v,i) => (
        <text key={i} x={pad.l-6} y={pad.t+iH-(v/maxV)*iH+4} textAnchor="end" fontSize="10" fill="#8a9ab8">{v}</text>
      ))}
      <path d={area} fill="url(#ag)"/>
      {avg > 0 && <line x1={pad.l} y1={avgY} x2={pad.l+iW} y2={avgY} stroke="#f5c842" strokeWidth="1.5" strokeDasharray="5,4" opacity=".7"/>}
      <polyline points={poly} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {xs.map((x,i) => <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#fff" stroke="#2563eb" strokeWidth="2"/>)}
      {xs.length > 0 && <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="5" fill="#f5c842" stroke="#fff" strokeWidth="2"/>}
      {labels && labels.map((l,i) => (
        <text key={i} x={xs[i]} y={pad.t+iH+18} textAnchor="middle" fontSize="9.5" fill="#8a9ab8">{l}</text>
      ))}
    </svg>
  );
}

// ── Donut chart ──
function Donut({ segments, size=70 }) {
  const r    = 28; const cx = size/2; const cy = size/2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((a,s) => a + s.value, 0);
  if (total === 0) return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f4fb" strokeWidth="10"/>
    </svg>
  );
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f4fb" strokeWidth="10"/>
      {segments.map((s, i) => {
        const dash = circ * (s.value / total);
        const el   = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

const ROLE_COLORS = { Admin:"#b8860b", Manager:"#2563eb", Officer:"#16a34a", DataEntry:"#c2410c", Viewer:"#7c3aed" };
const DOC_COLORS  = ["#2563eb","#16a34a","#f5c842","#f5933a","#9b6ef5","#26c6da","#f05a5a"];
const ACTION_MAP  = {
  LOGIN:          { color:"#f5c842", badge:"badge-login",  label:"Login"   },
  LOGOUT:         { color:"#8a9ab8", badge:"badge-default",label:"Logout"  },
  UPLOAD:         { color:"#2563eb", badge:"badge-upload", label:"Upload"  },
  CREATE_CLIENT:  { color:"#16a34a", badge:"badge-create", label:"Create"  },
  CREATE_USER:    { color:"#16a34a", badge:"badge-create", label:"Create"  },
  UPDATE_USER:    { color:"#9b6ef5", badge:"badge-config", label:"Update"  },
  DELETE:         { color:"#dc2626", badge:"badge-delete", label:"Delete"  },
  CREATE_GROUP:   { color:"#16a34a", badge:"badge-create", label:"Group"   },
  RESET_PASSWORD: { color:"#f5933a", badge:"badge-config", label:"Reset"   },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return "Just now";
  if (m < 60)  return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h} hr${h>1?"s":""} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d>1?"s":""} ago`;
}

export default function Dashboard() {
  const [period,   setPeriod]   = useState("Month");
  const [chartTab, setChartTab] = useState("Daily");
  const [loading,  setLoading]  = useState(true);

  // Live data
  const [stats,     setStats]     = useState({ clients:0, documents:0, customers:0, uploadsToday:0 });
  const [chartData, setChartData] = useState({ data:[], labels:[], avg:0, week:0, dailyAvg:0, month:0, successRate:0 });
  const [activity,  setActivity]  = useState([]);
  const [docTypes,  setDocTypes]  = useState([]);
  const [users,     setUsers]     = useState([]);
  const [uploads,   setUploads]   = useState([]);
  const [serverOk,  setServerOk]  = useState(true);
  const [pingMs,    setPingMs]    = useState(null);

  const user      = (() => { try { return JSON.parse(localStorage.getItem("dms_user")||"{}"); } catch { return {}; } })();
  const today     = new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const firstName = user?.fullName?.split(" ")[0] || "User";

  useEffect(() => { fetchAll(); }, [period, chartTab]);

  const fetchAll = async () => {
    setLoading(true);
    const t0 = Date.now();
    try {
      const [clientsRes, customersRes, uploadsRes, docTypesRes, usersRes, auditRes] = await Promise.all([
        fetch(`${API}/clients`).then(r=>r.json()),
        fetch(`${API}/customers`).then(r=>r.json()),
        fetch(`${API}/uploads`).then(r=>r.json()),
        fetch(`${API}/document-types`).then(r=>r.json()),
        fetch(`${API}/users`).then(r=>r.json()),
        fetch(`${API}/audit-log`).then(r=>r.json()),
      ]);
      setPingMs(Date.now() - t0);
      setServerOk(true);

      const clients   = Array.isArray(clientsRes)   ? clientsRes   : [];
      const customers = Array.isArray(customersRes) ? customersRes : [];
      const ups       = Array.isArray(uploadsRes)   ? uploadsRes   : [];
      const dts       = Array.isArray(docTypesRes)  ? docTypesRes  : [];
      const usrs      = Array.isArray(usersRes)     ? usersRes     : [];
      const audit     = Array.isArray(auditRes)     ? auditRes     : [];

      setUploads(ups);
      setUsers(usrs);

      // ── Stats ──
      const todayStr    = new Date().toISOString().slice(0,10);
      const uploadsToday = ups.filter(u => u.uploadedAt?.slice(0,10) === todayStr).length;
      setStats({
        clients:      clients.filter(c => c.status).length,
        documents:    ups.length,
        customers:    customers.length,
        uploadsToday,
      });

      // ── Chart data (last 14 days) ──
      const days = 14;
      const dayLabels = [];
      const dayData   = [];
      for (let i = days-1; i >= 0; i--) {
        const d   = new Date(); d.setDate(d.getDate() - i);
        const str = d.toISOString().slice(0,10);
        dayLabels.push(d.getDate().toString().padStart(2,"0"));
        dayData.push(ups.filter(u => u.uploadedAt?.slice(0,10) === str).length);
      }
      const weekUps  = dayData.slice(-7).reduce((a,b)=>a+b,0);
      const dailyAvg = dayData.length > 0 ? parseFloat((dayData.reduce((a,b)=>a+b,0)/dayData.length).toFixed(1)) : 0;
      const monthUps = ups.filter(u => {
        const d = new Date(u.uploadedAt);
        const now = new Date();
        return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
      }).length;
      const successRate = ups.length > 0 ? Math.round((ups.filter(u=>!u.isDuplicate).length / ups.length)*100) : 100;

      setChartData({ data:dayData, labels:dayLabels, avg:dailyAvg, week:weekUps, dailyAvg, month:monthUps, successRate });

      // ── Document types with upload counts ──
      const dtWithCounts = dts.filter(d=>d.status).map(dt => ({
        ...dt,
        uploadCount: ups.filter(u => u.docTypeId === dt.id || String(u.docTypeId)===String(dt.id)).length,
      })).sort((a,b) => b.uploadCount - a.uploadCount).slice(0,5);
      setDocTypes(dtWithCounts);

      // ── Recent activity from audit log ──
      setActivity(audit.slice(0,8));

    } catch {
      setServerOk(false);
      setPingMs(null);
    } finally {
      setLoading(false);
    }
  };

  // User role counts
  const roleCounts = ["Admin","Manager","Officer","DataEntry","Viewer"].map(r => ({
    role:r, count: users.filter(u=>u.role===r).length
  }));

  // Storage calculation
  const totalSizeMB  = uploads.reduce((a,u) => a + (parseFloat(u.fileSizeMB)||0), 0);
  const totalSizeGB  = (totalSizeMB / 1024).toFixed(2);
  const storagePct   = Math.min((totalSizeMB / (100*1024)) * 100, 100).toFixed(1);

  const SkeletonStat = () => (
    <div className="stat-card">
      <div className="skeleton" style={{width:48,height:48,borderRadius:12,flexShrink:0}}/>
      <div style={{flex:1}}>
        <div className="skeleton" style={{height:28,width:"60%",marginBottom:8}}/>
        <div className="skeleton" style={{height:14,width:"80%",marginBottom:6}}/>
        <div className="skeleton" style={{height:11,width:"50%"}}/>
      </div>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="dash">

        {/* ── Header ── */}
        <div className="ph anim anim-1">
          <div>
            <div style={{fontSize:13,color:"#8a9ab8",marginBottom:4}}>
              Home / <span style={{color:"#0f1c33",fontWeight:600}}>Dashboard</span>
            </div>
            <div className="ph-title">Overview Dashboard</div>
            <div className="ph-sub">{today} · Welcome back, <b style={{color:"#0f1c33"}}>{firstName}</b></div>
          </div>
          <div className="ph-right">
            <div className="period-tabs">
              {["Today","This Week","Month","Year"].map(p => (
                <button key={p} className={`pt-btn${period===p?" active":""}`} onClick={() => setPeriod(p)}>{p}</button>
              ))}
            </div>
            <button className="btn-quick" onClick={() => window.location.href="/image-upload"}>
              ⬆ Quick Upload →
            </button>
            <button className="btn-sm" onClick={fetchAll} title="Refresh data">🔄</button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="stats-row anim anim-2">
          {loading ? (
            [1,2,3,4].map(i => <SkeletonStat key={i}/>)
          ) : (
            <>
              <StatCard icon="🏢" iconBg="#dbeafe" val={stats.clients.toLocaleString()}    label="Active Clients"   trend={<span className="trend-up">▲ Live from DB</span>} />
              <StatCard icon="📁" iconBg="#fef3c7" val={stats.documents.toLocaleString()}  label="Total Documents"  trend={<span className="trend-up">▲ {stats.uploadsToday} uploaded today</span>} />
              <StatCard icon="👥" iconBg="#d1fae5" val={stats.customers.toLocaleString()}  label="Total Customers"  trend={<span className="trend-up">▲ All branches</span>} />
              <StatCard icon="⬆" iconBg="#f3e8ff" val={stats.uploadsToday.toLocaleString()} label="Uploads Today"  trend={<span className="trend-neu">↔ Avg {chartData.dailyAvg}/day</span>} />
            </>
          )}
        </div>

        {/* ── Main Grid ── */}
        <div className="main-grid anim anim-3">

          {/* Upload Activity Chart */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Upload Activity</div>
                <div className="card-sub">Daily uploads — last 14 days (live data)</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button className="btn-sm">📥 Export</button>
                <div className="chart-tabs">
                  {["Daily","Weekly","Monthly"].map(t => (
                    <button key={t} className={`ct-btn${chartTab===t?" active":""}`} onClick={() => setChartTab(t)}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-body" style={{paddingBottom:0}}>
              {loading ? (
                <div className="skeleton" style={{height:160,borderRadius:8}}/>
              ) : (
                <LineChart data={chartData.data} labels={chartData.labels} avg={chartData.avg} />
              )}
              <div className="chart-legend">
                <div className="leg-item"><div className="leg-dot" style={{background:"#2563eb"}}/> Uploads</div>
                <div className="leg-item"><div className="leg-dot" style={{background:"#f5c842"}}/> Daily Avg ({chartData.dailyAvg})</div>
              </div>
            </div>
            <div className="chart-stats">
              <div className="cs-item">
                <div className="cs-val">{loading ? "—" : chartData.week}</div>
                <div className="cs-label">This Week</div>
              </div>
              <div className="cs-item">
                <div className="cs-val">{loading ? "—" : chartData.dailyAvg}</div>
                <div className="cs-label">Daily Avg</div>
              </div>
              <div className="cs-item">
                <div className="cs-val green">{loading ? "—" : chartData.month}</div>
                <div className="cs-label">This Month</div>
              </div>
              <div className="cs-item">
                <div className="cs-val orange">{loading ? "—" : chartData.successRate + "%"}</div>
                <div className="cs-label">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Recent Activity</div>
                <div className="card-sub">Live audit log events</div>
              </div>
              <button className="btn-view" onClick={() => window.location.href="/audit-log"}>View All →</button>
            </div>
            <div className="card-body" style={{padding:0}}>
              {loading ? (
                <div style={{padding:"0 20px"}}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{display:"flex",gap:10,padding:"12px 0",borderBottom:"1px solid #f0f4fb"}}>
                      <div className="skeleton" style={{width:10,height:10,borderRadius:"50%",marginTop:4,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div className="skeleton" style={{height:13,width:"85%",marginBottom:6}}/>
                        <div className="skeleton" style={{height:10,width:"55%"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activity.length === 0 ? (
                <div style={{padding:32,textAlign:"center",color:"#8a9ab8",fontSize:13}}>No activity yet</div>
              ) : (
                <div className="activity-list" style={{padding:"0 20px"}}>
                  {activity.map((a, i) => {
                    const am = ACTION_MAP[a.action] || { color:"#8a9ab8", badge:"badge-default", label:a.action };
                    return (
                      <div key={i} className="act-item">
                        <div className="act-dot" style={{background:am.color}}/>
                        <div className="act-body">
                          <div className="act-text" style={{fontSize:12}}>{a.detail || a.action}</div>
                          <div className="act-meta">
                            <span className="act-time">{timeAgo(a.created_at)}</span>
                            <span className="act-branch">· {a.by_user}</span>
                            <span className={`act-badge ${am.badge}`}>{am.label}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Grid ── */}
        <div className="bottom-grid anim anim-4">

          {/* Documents by Type */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Documents by Type</div>
                <div className="card-sub">Upload distribution across doc types</div>
              </div>
              <Donut size={64} segments={docTypes.map((d,i) => ({ color:DOC_COLORS[i%DOC_COLORS.length], value:d.uploadCount||0 }))} />
            </div>
            <div className="card-body" style={{paddingTop:8}}>
              {loading ? (
                [1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{height:38,borderRadius:6,marginBottom:8}}/>)
              ) : docTypes.length === 0 ? (
                <div style={{textAlign:"center",color:"#8a9ab8",fontSize:13,padding:20}}>No document types yet</div>
              ) : (
                docTypes.map((d, i) => {
                  const color = DOC_COLORS[i % DOC_COLORS.length];
                  const maxCount = docTypes[0]?.uploadCount || 1;
                  const pct = maxCount > 0 ? Math.round((d.uploadCount / maxCount) * 100) : 0;
                  const bg = color + "18";
                  return (
                    <div key={d.id} className="doctype-row">
                      <div className="dt-icon" style={{background:bg}}>{d.icon||"📄"}</div>
                      <div className="dt-info">
                        <div className="dt-name">{d.name}</div>
                        <div className="dt-count">{d.uploadCount} file{d.uploadCount!==1?"s":""}</div>
                      </div>
                      <div className="dt-bar-wrap">
                        <div className="dt-bar-track">
                          <div className="dt-bar-fill" style={{width:`${pct}%`,background:color}}/>
                        </div>
                        <div className="dt-pct" style={{color}}>{pct}%</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* User Overview + Quick Actions */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">User Overview</div>
                <div className="card-sub">Role breakdown · {users.length} total</div>
              </div>
            </div>
            <div className="card-body">
              {/* Role breakdown */}
              {loading ? (
                [1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{height:26,borderRadius:6,marginBottom:6}}/>)
              ) : (
                roleCounts.map(r => (
                  <div key={r.role} className="role-row">
                    <div className="role-name-wrap">
                      <div className="role-dot" style={{background:ROLE_COLORS[r.role]}}/>
                      {r.role}
                    </div>
                    <div className="role-count">{r.count}</div>
                  </div>
                ))
              )}

              {/* Quick Actions */}
              <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #f0f4fb"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#8a9ab8",textTransform:"uppercase",letterSpacing:".8px",marginBottom:10}}>Quick Actions</div>
                <div className="qa-grid">
                  {[
                    { icon:"📤", label:"Upload Docs",    desc:"Upload now",        href:"/image-upload"    },
                    { icon:"👥", label:"Add Customer",   desc:"New customer",      href:"/customer-master" },
                    { icon:"🔍", label:"View Docs",      desc:"Search & view",     href:"/image-view"      },
                    { icon:"📊", label:"Audit Log",      desc:"View activity",     href:"/audit-log"       },
                  ].map((a,i) => (
                    <button key={i} className="qa-btn" onClick={() => window.location.href=a.href}>
                      <span className="qa-icon">{a.icon}</span>
                      <span className="qa-label">{a.label}</span>
                      <span className="qa-desc">{a.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Storage & Health */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Storage & Health</div>
                <div className="card-sub">Live system status</div>
              </div>
              <span style={{fontSize:11,fontWeight:700,background:serverOk?"#d1fae5":"#fee2e2",color:serverOk?"#065f46":"#991b1b",padding:"3px 9px",borderRadius:20}}>
                {serverOk ? "● Healthy" : "● Offline"}
              </span>
            </div>
            <div className="card-body">
              {/* Storage bar */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12.5,fontWeight:700,color:"#0f1c33"}}>Storage Used</span>
                <span style={{fontSize:12,fontWeight:800,color:"#2563eb",fontFamily:"'JetBrains Mono',monospace"}}>
                  {loading ? "—" : `${totalSizeGB} GB`}
                </span>
              </div>
              <div className="storage-track">
                <div className="storage-fill" style={{width: loading ? "0%" : `${Math.max(parseFloat(storagePct),0.5)}%`}}/>
              </div>
              <div className="storage-labels">
                <span>0 GB</span>
                <span>{loading?"…":`${totalSizeGB} GB used`}</span>
                <span>100 GB</span>
              </div>

              {/* File breakdown */}
              <div style={{marginTop:14}}>
                {[
                  { label:"Images (JPG/PNG)",  color:"#2563eb", exts:["JPG","JPEG","PNG"] },
                  { label:"PDFs",              color:"#f5c842", exts:["PDF"]              },
                  { label:"TIFF Files",        color:"#16a34a", exts:["TIFF","TIF"]       },
                  { label:"Other",             color:"#f5933a", exts:[]                   },
                ].map((s, i, arr) => {
                  const known = arr.slice(0,3).flatMap(x=>x.exts);
                  const count = i < 3
                    ? uploads.filter(u => s.exts.includes((u.fileExt||"").toUpperCase())).length
                    : uploads.filter(u => !known.includes((u.fileExt||"").toUpperCase())).length;
                  return (
                    <div key={s.label} className="storage-row">
                      <span className="sr-label"><span className="sr-dot" style={{background:s.color}}/>{s.label}</span>
                      <span className="sr-val">{loading ? "—" : count}</span>
                    </div>
                  );
                })}
              </div>

              {/* System health */}
              <div style={{marginTop:16,padding:"12px 14px",background:"#f8faff",border:"1px solid #e2eaf4",borderRadius:9}}>
                <div style={{fontSize:12,fontWeight:700,color:"#0f1c33",marginBottom:8}}>System Health</div>
                {[
                  { label:"API Response", val: loading?"…":pingMs?`${pingMs}ms`:"—",    color: pingMs&&pingMs<500?"#16a34a":"#f5933a" },
                  { label:"DB Status",    val: serverOk?"Connected":"Offline",           color: serverOk?"#16a34a":"#dc2626"           },
                  { label:"Total Records",val: loading?"…":(stats.clients+stats.customers+stats.documents).toLocaleString(), color:"#2563eb" },
                ].map((h,i) => (
                  <div key={i} className="health-row">
                    <span style={{fontSize:11.5,color:"#8a9ab8"}}>{h.label}</span>
                    <span className="health-val" style={{color:h.color,fontSize:12}}>{h.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function StatCard({ icon, iconBg, val, label, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{background:iconBg}}>{icon}</div>
      <div>
        <div className="stat-val">{val}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-trend">{trend}</div>
      </div>
    </div>
  );
}
