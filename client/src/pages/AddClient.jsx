import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CLIENT_API = "http://localhost:5000/api/clients";

const css = `
  .page { padding: 28px; min-height: 100vh; }
  .page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; }
  .page-title { font-size:26px; font-weight:800; color:#0f1c33; letter-spacing:-.5px; }
  .page-subtitle { font-size:13px; color:#8a9ab8; margin-top:4px; }

  .form-card {
    background:#ffffff; border:1px solid #e2eaf4;
    border-radius:12px; box-shadow:0 2px 12px rgba(15,28,51,0.06);
    overflow:hidden; max-width:820px;
  }
  .form-card-head {
    padding:18px 24px; border-bottom:1px solid #f0f4fb;
    display:flex; align-items:center; justify-content:space-between;
  }
  .fch-title { font-size:15px; font-weight:700; color:#0f1c33; }
  .fch-sub   { font-size:12px; color:#8a9ab8; margin-top:2px; }
  .form-card-body { padding:24px; }

  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .fg { display:flex; flex-direction:column; gap:6px; }
  .fg.full { grid-column:1/-1; }
  .flabel { font-size:11px; font-weight:700; color:#4a5e80; text-transform:uppercase; letter-spacing:.6px; }
  .flabel .req { color:#dc2626; margin-left:3px; }
  .finput, .fsel, .ftarea {
    background:#f0f4fb; border:1.5px solid #e2eaf4;
    border-radius:8px; padding:10px 14px;
    font-size:13px; color:#0f1c33;
    font-family:'DM Sans',sans-serif; outline:none; width:100%;
    transition:border-color .15s, background .15s;
  }
  .finput:focus, .fsel:focus, .ftarea:focus {
    border-color:#2563eb; background:#eff4ff;
  }
  .finput::placeholder, .ftarea::placeholder { color:#8a9ab8; }
  .ftarea { resize:vertical; min-height:80px; }
  .fhint { font-size:11px; color:#8a9ab8; }

  .fsect {
    grid-column:1/-1; font-size:11px; font-weight:700;
    text-transform:uppercase; letter-spacing:1px;
    color:#2563eb; padding-bottom:8px;
    border-bottom:1px solid #e2eaf4; margin-top:4px;
  }

  /* Status toggle */
  .toggle-wrap { display:flex; align-items:center; gap:10px; }
  .toggle {
    width:40px; height:22px; background:#d8e4f0;
    border-radius:11px; position:relative;
    cursor:pointer; transition:background .2s; border:none;
  }
  .toggle.on { background:#16a34a; }
  .toggle::after {
    content:''; position:absolute; top:3px; left:3px;
    width:16px; height:16px; border-radius:50%;
    background:#fff; transition:transform .2s;
  }
  .toggle.on::after { transform:translateX(18px); }
  .toggle-lbl { font-size:13px; font-weight:600; }
  .toggle-lbl.on  { color:#16a34a; }
  .toggle-lbl.off { color:#8a9ab8; }

  /* Buttons */
  .form-footer {
    padding:16px 24px; border-top:1px solid #f0f4fb;
    display:flex; justify-content:flex-end; gap:10px;
    background:#fafcff;
  }
  .btn { display:inline-flex; align-items:center; gap:7px; padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:none; font-family:'DM Sans',sans-serif; transition:all .15s; }
  .btn-primary { background:#2563eb; color:#fff; }
  .btn-primary:hover { filter:brightness(1.08); transform:translateY(-1px); box-shadow:0 4px 16px rgba(37,99,235,0.3); }
  .btn-primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
  .btn-outline { background:#fff; color:#4a5e80; border:1px solid #d8e4f0; }
  .btn-outline:hover { border-color:#2563eb; color:#2563eb; }

  /* Toast */
  .toast { position:fixed; bottom:28px; right:28px; z-index:2000; padding:12px 20px; border-radius:10px; font-size:13px; font-weight:600; display:flex; align-items:center; gap:9px; animation:slideIn .25s ease; box-shadow:0 4px 20px rgba(0,0,0,.15); }
  .toast.success { background:#f0fdf4; color:#16a34a; border:1px solid #86efac; }
  .toast.error   { background:#fff5f5; color:#dc2626; border:1px solid #fca5a5; }
  @keyframes slideIn { from{transform:translateX(80px);opacity:0;} to{transform:translateX(0);opacity:1;} }

  .spinner { width:15px; height:15px; border:2px solid currentColor; border-top-color:transparent; border-radius:50%; animation:spin .6s linear infinite; display:inline-block; }
  @keyframes spin { to{transform:rotate(360deg);} }

  /* Breadcrumb */
  .breadcrumb { font-size:13px; color:#8a9ab8; margin-bottom:6px; }
  .breadcrumb span { color:#0f1c33; font-weight:600; }
`;

export default function AddClient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:          "",
    type:          "Co-op Bank",
    regNo:         "",
    address:       "",
    contactName:   "",
    contactMobile: "",
    contactEmail:  "",
    status:        true,
  });
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())  return showToast("Client Name is required", "error");
    if (!form.regNo.trim()) return showToast("Registration No is required", "error");
    if (form.contactMobile && form.contactMobile.length !== 10)
      return showToast("Mobile must be 10 digits", "error");

    setLoading(true);
    try {
      const res    = await fetch(CLIENT_API, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:    form.name,
          type:    form.type,
          regNo:   form.regNo,
          address: form.address,
          contact: {
            name:   form.contactName,
            mobile: form.contactMobile,
            email:  form.contactEmail,
          },
          status: form.status,
        }),
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message, "error"); return; }
      showToast(`✅ Client "${result.data.name}" created — ${result.data.code}`);
      setTimeout(() => navigate("/clients"), 1200);
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="breadcrumb">
              Home / Client Master / <span>Add New Client</span>
            </div>
            <div className="page-title">Add New Client</div>
            <div className="page-subtitle">Register a new client organisation in the system</div>
          </div>
          <button className="btn btn-outline" onClick={() => navigate("/clients")}>
            ← Back to Clients
          </button>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <div className="form-card-head">
            <div>
              <div className="fch-title">Client Registration Form</div>
              <div className="fch-sub">Fields marked <span style={{color:"#dc2626"}}>*</span> are required</div>
            </div>
            <div style={{fontSize:11,fontWeight:700,background:"#eff4ff",color:"#2563eb",padding:"3px 10px",borderRadius:20,border:"1px solid #c7d9f8"}}>
              Auto Code: CLT-XXX
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-card-body">
              <div className="form-grid">

                {/* ── Organisation Info ── */}
                <div className="fsect">Organisation Information</div>

                <div className="fg full">
                  <label className="flabel">Client Name <span className="req">*</span></label>
                  <input className="finput" placeholder="e.g. Nashik District Co-op Bank"
                    value={form.name} onChange={e => set("name", e.target.value)} />
                </div>

                <div className="fg">
                  <label className="flabel">Organisation Type <span className="req">*</span></label>
                  <select className="fsel" value={form.type} onChange={e => set("type", e.target.value)}>
                    <option>Co-op Bank</option>
                    <option>Society</option>
                    <option>NBFC</option>
                    <option>Corporate</option>
                  </select>
                </div>

                <div className="fg">
                  <label className="flabel">Registration No <span className="req">*</span></label>
                  <input className="finput" placeholder="e.g. MCS/2003/141"
                    value={form.regNo} onChange={e => set("regNo", e.target.value)} />
                </div>

                <div className="fg full">
                  <label className="flabel">Address</label>
                  <textarea className="ftarea" placeholder="Full address of organisation"
                    value={form.address} onChange={e => set("address", e.target.value)} />
                </div>

                {/* ── Contact Info ── */}
                <div className="fsect">Contact Information</div>

                <div className="fg">
                  <label className="flabel">Contact Person Name</label>
                  <input className="finput" placeholder="e.g. Ramesh Shinde"
                    value={form.contactName} onChange={e => set("contactName", e.target.value)} />
                </div>

                <div className="fg">
                  <label className="flabel">Mobile Number</label>
                  <input className="finput" placeholder="10-digit mobile number" maxLength={10}
                    value={form.contactMobile} onChange={e => set("contactMobile", e.target.value.replace(/\D/,""))} />
                  <span className="fhint">Used for notifications and alerts</span>
                </div>

                <div className="fg full">
                  <label className="flabel">Email Address</label>
                  <input className="finput" type="email" placeholder="contact@organisation.com"
                    value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} />
                </div>

                {/* ── Status ── */}
                <div className="fsect">Status</div>

                <div className="fg">
                  <label className="flabel">Client Status</label>
                  <div className="toggle-wrap">
                    <button type="button" className={`toggle${form.status ? " on" : ""}`}
                      onClick={() => set("status", !form.status)} />
                    <span className={`toggle-lbl ${form.status ? "on" : "off"}`}>
                      {form.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {!form.status && (
                    <span className="fhint" style={{color:"#dc2626"}}>
                      Inactive clients will not appear in dropdowns
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="form-footer">
              <button type="button" className="btn btn-outline" onClick={() => navigate("/clients")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner"/> : "✅"}
                {loading ? "Saving..." : "Create Client"}
              </button>
            </div>
          </form>
        </div>

      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </>
  );
}
