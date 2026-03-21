import { useState } from "react";

// ─── Shared styles ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  /* ── Variable aliases so ClientMaster matches App.jsx theme ── */
.page {
  --accent-blue:    #2563eb;
  --accent-green:   #16a34a;
  --accent-red:     #dc2626;
  --accent-orange:  #c2410c;
  --accent-purple:  #7c3aed;
  --accent-gold:    #b8860b;
  --text-primary:   #0f1c33;
  --text-secondary: #4a5e80;
  --text-muted:     #8a9ab8;
  --bg-card:        #ffffff;
  --bg-input:       #f0f4fb;
  --bg-modal:       #ffffff;
  --border:         #e2eaf4;
  --border-light:   #c8d8ec;
  --font:           'DM Sans', sans-serif;
  --mono:           'JetBrains Mono', monospace;
  --radius:         10px;
  --shadow:         0 2px 12px rgba(15,28,51,0.08);
}
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }


  .dms-shell { display: flex; height: 100vh; overflow: hidden; }

  /* ── Sidebar ── */
  .sidebar {
    width: 220px; min-width: 220px;
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 0 0 16px;
    overflow-y: auto;
  }
  .sidebar-logo {
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 2px;
  }
  .logo-title { font-size: 22px; font-weight: 700; color: var(--accent-gold); letter-spacing: 1px; }
  .logo-sub { font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; }
  .version-badge {
    margin: 10px 20px 0;
    display: inline-block; padding: 2px 8px;
    background: linear-gradient(135deg,#f5c84222,#f5c84244);
    border: 1px solid #f5c84255;
    border-radius: 4px;
    font-size: 10px; color: var(--accent-gold); font-family: var(--mono);
    width: fit-content;
  }
  .nav-section { padding: 18px 20px 6px; font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 20px; font-size: 13px; font-weight: 500;
    color: var(--text-secondary); cursor: pointer; border-radius: 0;
    transition: all 0.15s; position: relative;
  }
  .nav-item:hover { color: var(--text-primary); background: #ffffff08; }
  .nav-item.active {
    color: var(--accent-gold); background: var(--sidebar-active);
    border-right: 3px solid var(--accent-gold);
  }
  .nav-item .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-gold); position: absolute; right: 14px; }
  .nav-sub { padding: 6px 20px 6px 44px; font-size: 12px; color: var(--text-secondary); cursor: pointer; transition: color 0.15s; }
  .nav-sub:hover { color: var(--text-primary); }
  .nav-sub.active { color: var(--accent-gold); }
  .nav-icon { font-size: 15px; width: 18px; text-align: center; }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg-main); }

  .topbar {
    height: 56px; min-height: 56px;
    background: var(--bg-sidebar);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px;
  }
  .breadcrumb { font-size: 13px; color: var(--text-muted); }
  .breadcrumb span { color: var(--text-secondary); }
  .breadcrumb b { color: var(--text-primary); }
  .topbar-right { display: flex; align-items: center; gap: 14px; }
  .search-bar {
    display: flex; align-items: center; gap: 8px;
    background: var(--bg-input); border: 1px solid var(--border);
    border-radius: 8px; padding: 6px 14px;
    font-size: 13px; color: var(--text-secondary);
    width: 200px;
  }
  .search-bar input { background: none; border: none; outline: none; color: var(--text-primary); font-size: 13px; width: 100%; font-family: var(--font); }
  .avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff;
  }
  .user-info { display: flex; flex-direction: column; }
  .user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .user-role { font-size: 10px; color: var(--accent-gold); background: #f5c84222; padding: 1px 6px; border-radius: 3px; width: fit-content; margin-top: 1px; }

  /* ── Content ── */
  .content { flex: 1; overflow-y: auto; padding: 28px; }

  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .page-title { font-size: 28px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px; }
  .page-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; font-family: var(--font);
    transition: all 0.15s; white-space: nowrap;
  }
  .btn-primary { background: var(--accent-blue); color: #fff; }
  .btn-primary:hover { background: #5aa0f7; transform: translateY(-1px); box-shadow: 0 4px 16px #3d8ef055; }
  .btn-gold { background: var(--accent-gold); color: #0f1623; }
  .btn-gold:hover { background: #ffd44a; transform: translateY(-1px); }
  .btn-outline {
    background: transparent; color: var(--text-secondary);
    border: 1px solid var(--border-light);
  }
  .btn-outline:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
  .btn-danger { background: #f05a5a22; color: var(--accent-red); border: 1px solid #f05a5a44; }
  .btn-danger:hover { background: #f05a5a33; }
  .btn-sm { padding: 5px 12px; font-size: 12px; }
  .btn-icon { padding: 7px; border-radius: 7px; }

  /* ── Tabs ── */
  .tabs { display: flex; gap: 4px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 4px; margin-bottom: 24px; width: fit-content; }
  .tab {
    padding: 8px 20px; border-radius: 7px; font-size: 13px; font-weight: 500;
    cursor: pointer; color: var(--text-secondary); transition: all 0.15s;
  }
  .tab.active { background: var(--accent-blue); color: #fff; }
  .tab:hover:not(.active) { color: var(--text-primary); background: #ffffff08; }

  /* ── Stats row ── */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px;
    display: flex; align-items: center; gap: 16px;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border-light); }
  .stat-icon {
    width: 44px; height: 44px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .stat-val { font-size: 26px; font-weight: 700; font-family: var(--mono); color: var(--text-primary); line-height: 1; }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 3px; }
  .stat-trend { font-size: 11px; margin-top: 4px; }
  .trend-up { color: var(--accent-green); }
  .trend-down { color: var(--accent-red); }

  /* ── Table card ── */
  .table-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .table-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px; border-bottom: 1px solid var(--border);
  }
  .table-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
  .table-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .table-actions { display: flex; gap: 8px; align-items: center; }

  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th {
    padding: 11px 16px; font-size: 11px; font-weight: 600;
    color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px;
    text-align: left; border-bottom: 1px solid var(--border);
    background: #f5f8ff;
  }
  .data-table td { padding: 13px 16px; font-size: 13px; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: #ffffff04; color: var(--text-primary); }
  .data-table td.primary { color: var(--text-primary); font-weight: 500; }
  .data-table td .mono { font-family: var(--mono); font-size: 11px; color: var(--accent-blue); background: #3d8ef011; padding: 2px 6px; border-radius: 4px; }

  /* ── Badges ── */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
  }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
  .badge-active { background: #2ec08b22; color: var(--accent-green); border: 1px solid #2ec08b33; }
  .badge-active .badge-dot { background: var(--accent-green); }
  .badge-inactive { background: #f05a5a22; color: var(--accent-red); border: 1px solid #f05a5a33; }
  .badge-inactive .badge-dot { background: var(--accent-red); }
  .badge-type { background: #3d8ef022; color: var(--accent-blue); border: 1px solid #3d8ef033; }

  /* ── Search / filter bar ── */
  .filter-bar { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
  .filter-input {
    flex: 1; min-width: 200px;
    background: var(--bg-input); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 14px;
    font-size: 13px; color: var(--text-primary); font-family: var(--font);
    outline: none;
  }
  .filter-input:focus { border-color: var(--accent-blue); }
  .filter-select {
    background: var(--bg-input); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 14px;
    font-size: 13px; color: var(--text-secondary); font-family: var(--font);
    outline: none; cursor: pointer;
  }
  .filter-select:focus { border-color: var(--accent-blue); color: var(--text-primary); }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 20px;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--bg-modal); border: 1px solid var(--border-light);
    border-radius: 14px; width: 100%; max-width: 660px;
    max-height: 90vh; overflow-y: auto;
    box-shadow: var(--shadow);
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-head {
    padding: 22px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: var(--bg-modal); z-index: 1;
  }
  .modal-title { font-size: 17px; font-weight: 700; color: var(--text-primary); }
  .modal-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .modal-body { padding: 24px; }
  .modal-footer {
    padding: 16px 24px; border-top: 1px solid var(--border);
    display: flex; justify-content: flex-end; gap: 10px;
    background: var(--bg-modal);
    position: sticky; bottom: 0;
  }
  .close-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: #ffffff10; border: none; color: var(--text-secondary);
    cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .close-btn:hover { background: #f05a5a33; color: var(--accent-red); }

  /* ── Form ── */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .form-group { display: flex; flex-direction: column; gap: 7px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.6px; }
  .form-label .req { color: var(--accent-red); margin-left: 3px; }
  .form-input, .form-select, .form-textarea {
    background: var(--bg-input); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 14px;
    font-size: 13px; color: var(--text-primary); font-family: var(--font);
    outline: none; transition: border-color 0.15s;
    width: 100%;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent-blue); }
  .form-input::placeholder { color: var(--text-muted); }
  .form-input:disabled { opacity: 0.5; cursor: not-allowed; }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-hint { font-size: 11px; color: var(--text-muted); }
  .form-divider { grid-column: 1 / -1; border: none; border-top: 1px solid var(--border); margin: 4px 0; }

  /* Toggle */
  .toggle-wrap { display: flex; align-items: center; gap: 12px; }
  .toggle {
    width: 40px; height: 22px; background: var(--border-light);
    border-radius: 11px; position: relative; cursor: pointer; transition: background 0.2s; border: none;
  }
  .toggle.on { background: var(--accent-green); }
  .toggle::after {
    content: ''; position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%; background: #fff;
    transition: transform 0.2s;
  }
  .toggle.on::after { transform: translateX(18px); }
  .toggle-label { font-size: 13px; font-weight: 600; }
  .toggle-label.on { color: var(--accent-green); }
  .toggle-label.off { color: var(--text-muted); }

  /* Upload area */
  .upload-area {
    border: 2px dashed var(--border-light); border-radius: 8px;
    padding: 20px; text-align: center; cursor: pointer;
    transition: border-color 0.15s; color: var(--text-muted); font-size: 13px;
  }
  .upload-area:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
  .upload-area .icon { font-size: 28px; margin-bottom: 8px; }

  /* Section heading inside form */
  .form-section-title {
    grid-column: 1 / -1;
    font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    color: var(--accent-blue); padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  /* Delete confirm modal */
  .confirm-icon { font-size: 40px; text-align: center; margin-bottom: 12px; }
  .confirm-text { text-align: center; color: var(--text-secondary); font-size: 14px; line-height: 1.6; }
  .confirm-name { color: var(--text-primary); font-weight: 600; }

  /* Pagination */
  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--border); }
  .page-info { font-size: 12px; color: var(--text-muted); }
  .page-btns { display: flex; gap: 6px; }
  .page-btn {
    width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border);
    background: var(--bg-input); color: var(--text-secondary); font-size: 12px;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  }
  .page-btn:hover, .page-btn.active { background: var(--accent-blue); border-color: var(--accent-blue); color: #fff; }

  /* Tooltip for actions */
  .action-btns { display: flex; gap: 6px; }
  .action-btn {
    width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border);
    background: var(--bg-input); color: var(--text-secondary); font-size: 13px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .action-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
  .action-btn.danger:hover { border-color: var(--accent-red); color: var(--accent-red); }

  /* Client avatar */
  .client-avatar {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
  }

  /* Empty state */
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
  .empty-state .icon { font-size: 48px; margin-bottom: 12px; opacity: 0.4; }
  .empty-state p { font-size: 14px; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const INITIAL_CLIENTS = [
  { id: 1, code: "CLT-001", name: "Nashik District Co-op Bank", type: "Co-op Bank", regNo: "MCS/2003/141", address: "123, Main Road, Nashik, MH 422001", contact: { name: "Ramesh Shinde", mobile: "9876543210", email: "ramesh@ndcb.in" }, status: true, color: "#3d8ef0" },
  { id: 2, code: "CLT-002", name: "Ballaleshwar Patpedhi Society", type: "Society", regNo: "RCS/2010/0892", address: "45, Gandhi Chowk, Ahmednagar, MH 414001", contact: { name: "Suresh Kadam", mobile: "9823100234", email: "suresh@bps.co.in" }, status: true, color: "#2ec08b" },
  { id: 3, code: "CLT-003", name: "Vridhi NBFC Ltd", type: "NBFC", regNo: "NBFC/RBI/2015/5512", address: "7, Peth Road, Pune, MH 411001", contact: { name: "Anita Joshi", mobile: "9900112233", email: "anita@vridhi.com" }, status: false, color: "#f5933a" },
  { id: 4, code: "CLT-004", name: "Sunrise Corporate Solutions", type: "Corporate", regNo: "CIN/U74140/2018", address: "Plot 9, MIDC, Aurangabad, MH 431001", contact: { name: "Priya Patil", mobile: "9812345678", email: "priya@sunrise.in" }, status: true, color: "#9b6ef5" },
];

const INITIAL_BRANCHES = [
  { id: 1, code: "BR-001", name: "Nashik HO", clientId: 1, address: "Main Road, Nashik", manager: "Jayant Kulkarni", contact: "9876543210", status: true },
  { id: 2, code: "BR-002", name: "Niphad Branch", clientId: 1, address: "Niphad, Nashik Dist.", manager: "Pravin Patil", contact: "9823456789", status: true },
  { id: 3, code: "BR-003", name: "Yeola Branch", clientId: 1, address: "Yeola, Nashik Dist.", manager: "Yogesh Vagare", contact: "9012345678", status: true },
  { id: 4, code: "BR-004", name: "Ahmednagar HO", clientId: 2, address: "Gandhi Chowk, Ahmednagar", manager: "Suresh Kadam", contact: "9823100234", status: true },
  { id: 5, code: "BR-005", name: "Pune Office", clientId: 3, address: "Peth Road, Pune", manager: "Anita Joshi", contact: "9900112233", status: false },
  { id: 6, code: "BR-006", name: "Aurangabad HQ", clientId: 4, address: "MIDC, Aurangabad", manager: "Priya Patil", contact: "9812345678", status: true },
];

const CLIENT_TYPES = ["Co-op Bank", "Society", "NBFC", "Corporate"];
const MANAGERS = ["Jayant Kulkarni", "Pravin Patil", "Yogesh Vagare", "Suresh Kadam", "Anita Joshi", "Priya Patil", "Walmik Darade"];
const COLORS = ["#3d8ef0", "#2ec08b", "#f5933a", "#9b6ef5", "#f5c842", "#f05a5a"];

let clientSeq = 5;
let branchSeq = 7;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ClientMaster() {
  const [activeTab, setActiveTab] = useState("clients");
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");

  // Modals
  const [showClientForm, setShowClientForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Client CRUD ──
  const openNewClient = () => { setEditClient(null); setShowClientForm(true); };
  const openEditClient = (c) => { setEditClient(c); setShowClientForm(true); };
  const saveClient = (data) => {
    if (editClient) {
      setClients(prev => prev.map(c => c.id === editClient.id ? { ...c, ...data } : c));
    } else {
      setClients(prev => [...prev, { ...data, id: clientSeq++, code: `CLT-00${clientSeq - 1}`, color: COLORS[(clientSeq - 2) % COLORS.length] }]);
    }
    setShowClientForm(false);
  };
  const confirmDelete = (type, item) => setDeleteTarget({ type, item });
  const doDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "client") {
      const hasBranches = branches.some(b => b.clientId === deleteTarget.item.id && b.status);
      if (hasBranches) { alert("Cannot delete: client has active branches."); setDeleteTarget(null); return; }
      setClients(prev => prev.map(c => c.id === deleteTarget.item.id ? { ...c, status: false } : c));
    } else {
      setBranches(prev => prev.map(b => b.id === deleteTarget.item.id ? { ...b, status: false } : b));
    }
    setDeleteTarget(null);
  };

  // ── Branch CRUD ──
  const openNewBranch = () => { setEditBranch(null); setShowBranchForm(true); };
  const openEditBranch = (b) => { setEditBranch(b); setShowBranchForm(true); };
  const saveBranch = (data) => {
    if (editBranch) {
      setBranches(prev => prev.map(b => b.id === editBranch.id ? { ...b, ...data } : b));
    } else {
      setBranches(prev => [...prev, { ...data, id: branchSeq++, code: `BR-00${branchSeq - 1}` }]);
    }
    setShowBranchForm(false);
  };

  // ── Filtered data ──
  const filteredClients = clients.filter(c =>
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === "" || c.type === typeFilter) &&
    (statusFilter === "" || (statusFilter === "active" ? c.status : !c.status))
  );
  const filteredBranches = branches.filter(b =>
    (b.name.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase())) &&
    (clientFilter === "" || String(b.clientId) === clientFilter) &&
    (statusFilter === "" || (statusFilter === "active" ? b.status : !b.status))
  );

  const activeClients = clients.filter(c => c.status).length;
  const activeBranches = branches.filter(b => b.status).length;

  // ✅ REPLACE the return in ClientMaster with:
return (
  <>
    <style>{css}</style>
    <div className="page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <div className="page-title">Client Master</div>
          <div className="page-subtitle">Manage organisations and their associated branches</div>
        </div>
        <button className="btn btn-gold" onClick={activeTab === "clients" ? openNewClient : openNewBranch}>
          + {activeTab === "clients" ? "Add New Client" : "Add New Branch"}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <StatCard icon="🏢" val={clients.length} label="Total Clients" trend={`▲ ${activeClients} active`} color="#3d8ef0" />
        <StatCard icon="🌿" val={branches.length} label="Total Branches" trend={`▲ ${activeBranches} active`} color="#2ec08b" />
        <StatCard icon="✅" val={activeClients} label="Active Clients" trend="Operational" color="#f5c842" />
        <StatCard icon="📍" val={activeBranches} label="Active Branches" trend="Across all clients" color="#9b6ef5" />
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className={`tab${activeTab === "clients" ? " active" : ""}`} onClick={() => setActiveTab("clients")}>🏢 Clients</div>
        <div className={`tab${activeTab === "branches" ? " active" : ""}`} onClick={() => setActiveTab("branches")}>🌿 Branches</div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <input className="filter-input" placeholder={`Search ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} />
        {activeTab === "clients" ? (
          <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            {CLIENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        ) : (
          <select className="filter-select" value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
            <option value="">All Clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {activeTab === "clients" ? (
        <ClientTable clients={filteredClients} onEdit={openEditClient} onDelete={c => confirmDelete("client", c)} />
      ) : (
        <BranchTable branches={filteredBranches} clients={clients} onEdit={openEditBranch} onDelete={b => confirmDelete("branch", b)} />
      )}
    </div>

    {/* Modals */}
    {showClientForm && <ClientFormModal client={editClient} onSave={saveClient} onClose={() => setShowClientForm(false)} />}
    {showBranchForm && <BranchFormModal branch={editBranch} clients={clients.filter(c => c.status)} onSave={saveBranch} onClose={() => setShowBranchForm(false)} />}
    {deleteTarget && <DeleteModal name={deleteTarget.item.name} type={deleteTarget.type} onConfirm={doDelete} onClose={() => setDeleteTarget(null)} />}
  </>
);

  // return (
  //   <>
  //     <style>{css}</style>
  //     <div className="dms-shell">
  //       {/* ── Sidebar ── */}
  //       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

  //       {/* ── Main ── */}
  //       <div className="main">
  //         {/* Topbar */}
  //         <div className="topbar">
  //           <div className="breadcrumb">
  //             Home / <span>Client Master</span> / <b>{activeTab === "clients" ? "Client List" : "Branch List"}</b>
  //           </div>
  //           <div className="topbar-right">
  //             <div className="search-bar">
  //               <span>🔍</span>
  //               <input placeholder="Search..." />
  //             </div>
  //             <div className="avatar">WD</div>
  //             <div className="user-info">
  //               <span className="user-name">Walmik Darade</span>
  //               <span className="user-role">Admin</span>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Content */}
  //         <div className="content">
  //           {/* Page header */}
  //           <div className="page-header">
  //             <div>
  //               <div className="page-title">Client Master</div>
  //               <div className="page-subtitle">Manage organisations and their associated branches</div>
  //             </div>
  //             <button className="btn btn-gold" onClick={activeTab === "clients" ? openNewClient : openNewBranch}>
  //               + {activeTab === "clients" ? "Add New Client" : "Add New Branch"}
  //             </button>
  //           </div>

  //           {/* Stats */}
  //           <div className="stats-row">
  //             <StatCard icon="🏢" val={clients.length} label="Total Clients" trend={`▲ ${activeClients} active`} color="#3d8ef0" />
  //             <StatCard icon="🌿" val={branches.length} label="Total Branches" trend={`▲ ${activeBranches} active`} color="#2ec08b" />
  //             <StatCard icon="✅" val={activeClients} label="Active Clients" trend="Operational" color="#f5c842" />
  //             <StatCard icon="📍" val={activeBranches} label="Active Branches" trend="Across all clients" color="#9b6ef5" />
  //           </div>

  //           {/* Tabs */}
  //           <div className="tabs">
  //             <div className={`tab${activeTab === "clients" ? " active" : ""}`} onClick={() => setActiveTab("clients")}>🏢 Clients</div>
  //             <div className={`tab${activeTab === "branches" ? " active" : ""}`} onClick={() => setActiveTab("branches")}>🌿 Branches</div>
  //           </div>

  //           {/* Filter bar */}
  //           <div className="filter-bar">
  //             <input className="filter-input" placeholder={`Search ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} />
  //             {activeTab === "clients" ? (
  //               <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
  //                 <option value="">All Types</option>
  //                 {CLIENT_TYPES.map(t => <option key={t}>{t}</option>)}
  //               </select>
  //             ) : (
  //               <select className="filter-select" value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
  //                 <option value="">All Clients</option>
  //                 {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
  //               </select>
  //             )}
  //             <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
  //               <option value="">All Status</option>
  //               <option value="active">Active</option>
  //               <option value="inactive">Inactive</option>
  //             </select>
  //           </div>

  //           {/* Table */}
  //           {activeTab === "clients" ? (
  //             <ClientTable clients={filteredClients} onEdit={openEditClient} onDelete={c => confirmDelete("client", c)} />
  //           ) : (
  //             <BranchTable branches={filteredBranches} clients={clients} onEdit={openEditBranch} onDelete={b => confirmDelete("branch", b)} />
  //           )}
  //         </div>
  //       </div>
  //     </div>

  //     {/* ── Modals ── */}
  //     {showClientForm && (
  //       <ClientFormModal
  //         client={editClient}
  //         onSave={saveClient}
  //         onClose={() => setShowClientForm(false)}
  //       />
  //     )}
  //     {showBranchForm && (
  //       <BranchFormModal
  //         branch={editBranch}
  //         clients={clients.filter(c => c.status)}
  //         onSave={saveBranch}
  //         onClose={() => setShowBranchForm(false)}
  //       />
  //     )}
  //     {deleteTarget && (
  //       <DeleteModal
  //         name={deleteTarget.item.name}
  //         type={deleteTarget.type}
  //         onConfirm={doDelete}
  //         onClose={() => setDeleteTarget(null)}
  //       />
  //     )}
  //   </>
  // );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// function Sidebar({ activeTab, setActiveTab }) {
//   return (
//     <div className="sidebar">
//       <div className="sidebar-logo">
//         <div className="logo-title">DMS</div>
//         <div className="logo-sub">Document Management System</div>
//         <div className="version-badge">AVS InSoTech v1.0</div>
//       </div>
//       <div className="nav-section">Navigation</div>
//       <div className="nav-item"><span className="nav-icon">⊞</span> Dashboard</div>
//       <div className="nav-section">User Management</div>
//       <div className="nav-item"><span className="nav-icon">👤</span> Users</div>
//       <div className="nav-sub">User List</div>
//       <div className="nav-sub">Add User</div>
//       <div className="nav-section">Client Master</div>
//       <div className={`nav-item active`} onClick={() => setActiveTab("clients")}>
//         <span className="nav-icon">🏢</span> Clients <div className="dot"></div>
//       </div>
//       <div className={`nav-sub${activeTab === "clients" ? " active" : ""}`} onClick={() => setActiveTab("clients")}>Client List</div>
//       <div className={`nav-sub${activeTab === "branches" ? " active" : ""}`} onClick={() => setActiveTab("branches")}>Branches</div>
//       <div className="nav-section">Image Module</div>
//       <div className="nav-item"><span className="nav-icon">👥</span> Customer Master</div>
//       <div className="nav-item"><span className="nav-icon">📄</span> Document Master</div>
//       <div className="nav-item"><span className="nav-icon">📤</span> Image Upload</div>
//       <div className="nav-item"><span className="nav-icon">🖼</span> Image View</div>
//       <div className="nav-section">Reports</div>
//       <div className="nav-item"><span className="nav-icon">📋</span> Upload Log</div>
//       <div className="nav-item"><span className="nav-icon">📝</span> Audit Log</div>
//       <div style={{ flex: 1 }} />
//       <div className="nav-item"><span className="nav-icon">⚙️</span> Settings</div>
//       <div className="nav-item" style={{ color: "var(--accent-red)" }}><span className="nav-icon">🚪</span> Logout</div>
//     </div>
//   );
// }

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, val, label, trend, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}22` }}>{icon}</div>
      <div>
        <div className="stat-val">{val}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-trend trend-up">{trend}</div>
      </div>
    </div>
  );
}

// ─── Client Table ─────────────────────────────────────────────────────────────
function ClientTable({ clients, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <div className="table-title">Client Directory</div>
          <div className="table-sub">Total {clients.length} record{clients.length !== 1 ? "s" : ""} found</div>
        </div>
        <div className="table-actions">
          <button className="btn btn-outline btn-sm">📥 Export</button>
        </div>
      </div>
      {clients.length === 0 ? (
        <div className="empty-state"><div className="icon">🏢</div><p>No clients found</p></div>
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td className="primary">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="client-avatar" style={{ background: c.color }}>{c.name.charAt(0)}</div>
                    <div>
                      <div>{c.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.address?.split(",")[0]}</div>
                    </div>
                  </div>
                </td>
                <td><span className="mono">{c.code}</span></td>
                <td><span className="badge badge-type">{c.type}</span></td>
                <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{c.regNo}</td>
                <td>{c.contact?.name}</td>
                <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{c.contact?.mobile}</td>
                <td>
                  <span className={`badge ${c.status ? "badge-active" : "badge-inactive"}`}>
                    <span className="badge-dot"></span>{c.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn" title="Edit" onClick={() => onEdit(c)}>✏️</button>
                    <button className="action-btn danger" title="Deactivate" onClick={() => onDelete(c)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <div className="page-info">Showing 1–{clients.length} of {clients.length}</div>
        <div className="page-btns">
          <button className="page-btn">‹</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">›</button>
        </div>
      </div>
    </div>
  );
}

// ─── Branch Table ─────────────────────────────────────────────────────────────
function BranchTable({ branches, clients, onEdit, onDelete }) {
  const getClient = id => clients.find(c => c.id === id);
  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <div className="table-title">Branch Directory</div>
          <div className="table-sub">Total {branches.length} record{branches.length !== 1 ? "s" : ""} found</div>
        </div>
        <div className="table-actions">
          <button className="btn btn-outline btn-sm">📥 Export</button>
        </div>
      </div>
      {branches.length === 0 ? (
        <div className="empty-state"><div className="icon">🌿</div><p>No branches found</p></div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Branch</th>
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
            {branches.map(b => {
              const client = getClient(b.clientId);
              return (
                <tr key={b.id}>
                  <td className="primary">{b.name}</td>
                  <td><span className="mono">{b.code}</span></td>
                  <td>
                    {client && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="client-avatar" style={{ background: client.color, width: 24, height: 24, fontSize: 10, borderRadius: 5 }}>{client.name.charAt(0)}</div>
                        <span style={{ fontSize: 12 }}>{client.name}</span>
                      </div>
                    )}
                  </td>
                  <td>{b.manager}</td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{b.contact}</td>
                  <td style={{ fontSize: 12 }}>{b.address}</td>
                  <td>
                    <span className={`badge ${b.status ? "badge-active" : "badge-inactive"}`}>
                      <span className="badge-dot"></span>{b.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" title="Edit" onClick={() => onEdit(b)}>✏️</button>
                      <button className="action-btn danger" title="Deactivate" onClick={() => onDelete(b)}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <div className="page-info">Showing 1–{branches.length} of {branches.length}</div>
        <div className="page-btns">
          <button className="page-btn">‹</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">›</button>
        </div>
      </div>
    </div>
  );
}

// ─── Client Form Modal ────────────────────────────────────────────────────────
function ClientFormModal({ client, onSave, onClose }) {
  const isEdit = !!client;
  const [form, setForm] = useState({
    name: client?.name || "",
    type: client?.type || "Co-op Bank",
    regNo: client?.regNo || "",
    address: client?.address || "",
    contactName: client?.contact?.name || "",
    contactMobile: client?.contact?.mobile || "",
    contactEmail: client?.contact?.email || "",
    status: client?.status !== undefined ? client.status : true,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.regNo) return alert("Client Name and Registration No. are required.");
    onSave({
      name: form.name,
      type: form.type,
      regNo: form.regNo,
      address: form.address,
      contact: { name: form.contactName, mobile: form.contactMobile, email: form.contactEmail },
      status: form.status,
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-title">{isEdit ? "Edit Client" : "Add New Client"}</div>
            <div className="modal-sub">{isEdit ? `Editing: ${client.code}` : "Fill in the details to register a new client"}</div>
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
                <span className="form-hint">Auto-generated, cannot be changed</span>
              </div>
            )}

            <div className={`form-group${isEdit ? "" : " full"}`}>
              <label className="form-label">Client Name <span className="req">*</span></label>
              <input className="form-input" placeholder="Full legal name" value={form.name} onChange={e => set("name", e.target.value)} maxLength={200} />
            </div>

            <div className="form-group">
              <label className="form-label">Client Type <span className="req">*</span></label>
              <select className="form-select" value={form.type} onChange={e => set("type", e.target.value)}>
                {CLIENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Registration No. <span className="req">*</span></label>
              <input className="form-input" placeholder="MCS/RCS/CIN number" value={form.regNo} onChange={e => set("regNo", e.target.value)} />
            </div>

            <div className="form-group full">
              <label className="form-label">Address</label>
              <textarea className="form-textarea" placeholder="Full registered address" value={form.address} onChange={e => set("address", e.target.value)} />
            </div>

            <hr className="form-divider" />
            <div className="form-section-title">Contact Person</div>

            <div className="form-group full">
              <label className="form-label">Contact Name</label>
              <input className="form-input" placeholder="Primary contact name" value={form.contactName} onChange={e => set("contactName", e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile</label>
              <input className="form-input" placeholder="10-digit mobile" value={form.contactMobile} onChange={e => set("contactMobile", e.target.value)} maxLength={10} />
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
                <span className={`toggle-label${form.status ? " on" : " off"}`}>{form.status ? "Active" : "Inactive"}</span>
              </div>
              {!form.status && <span className="form-hint" style={{ color: "var(--accent-red)" }}>Inactive clients cannot upload documents</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Logo</label>
              <div className="upload-area">
                <div className="icon">🖼</div>
                <div>Click to upload PNG/JPG (max 1 MB)</div>
              </div>
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

// ─── Branch Form Modal ────────────────────────────────────────────────────────
function BranchFormModal({ branch, clients, onSave, onClose }) {
  const isEdit = !!branch;
  const [form, setForm] = useState({
    name: branch?.name || "",
    clientId: branch?.clientId || (clients[0]?.id || ""),
    address: branch?.address || "",
    manager: branch?.manager || "",
    contact: branch?.contact || "",
    status: branch?.status !== undefined ? branch.status : true,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.clientId || !form.contact) return alert("Branch Name, Parent Client, and Contact are required.");
    onSave({ ...form, clientId: Number(form.clientId) });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-title">{isEdit ? "Edit Branch" : "Add New Branch"}</div>
            <div className="modal-sub">{isEdit ? `Editing: ${branch.code}` : "Create a new branch under a client"}</div>
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
              </div>
            )}

            <div className={`form-group${isEdit ? "" : " full"}`}>
              <label className="form-label">Branch Name <span className="req">*</span></label>
              <input className="form-input" placeholder="e.g. Nashik HO" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>

            <div className="form-group full">
              <label className="form-label">Parent Client <span className="req">*</span></label>
              <select className="form-select" value={form.clientId} onChange={e => set("clientId", e.target.value)}>
                {clients.map(c => <option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}
              </select>
              <span className="form-hint">Branch will be linked to this client permanently</span>
            </div>

            <div className="form-group full">
              <label className="form-label">Branch Address</label>
              <textarea className="form-textarea" placeholder="Branch full address" value={form.address} onChange={e => set("address", e.target.value)} style={{ minHeight: 64 }} />
            </div>

            <div className="form-group">
              <label className="form-label">Branch Manager</label>
              <select className="form-select" value={form.manager} onChange={e => set("manager", e.target.value)}>
                <option value="">— Select Manager —</option>
                {MANAGERS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Contact No. <span className="req">*</span></label>
              <input className="form-input" placeholder="10-digit mobile" value={form.contact} onChange={e => set("contact", e.target.value)} maxLength={10} />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="toggle-wrap">
                <button className={`toggle${form.status ? " on" : ""}`} onClick={() => set("status", !form.status)} />
                <span className={`toggle-label${form.status ? " on" : " off"}`}>{form.status ? "Active" : "Inactive"}</span>
              </div>
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

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ name, type, onConfirm, onClose }) {
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
            Are you sure you want to deactivate <span className="confirm-name">"{name}"</span>?<br />
            This {type} will be marked as <b style={{ color: "var(--accent-red)" }}>Inactive</b>. Records will be retained.
            {type === "client" && <><br /><br /><span style={{ color: "var(--accent-orange)", fontSize: 12 }}>Note: Deletion is blocked if the client has active branches.</span></>}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>🗑 Deactivate</button>
        </div>
      </div>
    </div>
  );
}
