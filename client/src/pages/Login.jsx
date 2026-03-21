import { useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg,
      #ddeeff 0%,
      #eef4ff 25%,
      #f5f0ff 50%,
      #fce8f0 75%,
      #fde8e8 100%
    );
    position: relative;
    overflow: hidden;
  }

  /* Subtle noise texture overlay */
  .lp-page::before {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.4;
  }

  /* Card */
  .lp-card {
    position: relative; z-index: 10;
    width: 100%; max-width: 380px;
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 24px;
    padding: 44px 40px 36px;
    box-shadow:
      0 2px 4px rgba(0,0,0,0.04),
      0 8px 24px rgba(0,0,0,0.06),
      0 32px 64px rgba(100,130,200,0.10);
    backdrop-filter: blur(20px);
    animation: cardIn .4s ease;
  }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(20px) scale(.98); }
    to   { opacity:1; transform:translateY(0)    scale(1); }
  }

  /* Logo */
  .lp-logo-wrap {
    display: flex; flex-direction: column; align-items: center;
    margin-bottom: 28px;
  }
  .lp-logo-svg {
    width: 120px; height: 52px; margin-bottom: 4px;
  }
  .lp-logo-tagline {
    font-size: 13px; font-weight: 700;
    color: #2ab8b8;
    letter-spacing: .5px;
    font-style: italic;
  }

  /* Title */
  .lp-title {
    text-align: center;
    font-size: 26px; font-weight: 900;
    color: #1a2340;
    letter-spacing: .5px;
    margin-bottom: 6px;
    font-style: italic;
  }
  .lp-sub {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-bottom: 32px;
  }
  .lp-sub-line {
    flex: 1; max-width: 50px; height: 1px;
    background: linear-gradient(90deg, transparent, #2563eb88);
  }
  .lp-sub-line.right {
    background: linear-gradient(90deg, #2563eb88, transparent);
  }
  .lp-sub-text {
    font-size: 9px; font-weight: 700; color: #2563eb;
    letter-spacing: 2.5px; text-transform: uppercase;
  }

  /* Fields */
  .lp-form { display: flex; flex-direction: column; gap: 16px; }

  .lp-field-label {
    font-size: 9.5px; font-weight: 700; color: #6b7ea0;
    letter-spacing: 1.5px; text-transform: uppercase;
    margin-bottom: 6px; display: block;
  }
  .lp-field-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 6px;
  }
  .lp-forgot {
    font-size: 9.5px; font-weight: 700; color: #6b7ea0;
    letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer; text-decoration: none;
    transition: color .15s;
  }
  .lp-forgot:hover { color: #2563eb; }

  .lp-input-wrap { position: relative; }
  .lp-input {
    width: 100%;
    background: #f0f4fc;
    border: 1.5px solid transparent;
    border-radius: 10px;
    padding: 13px 44px 13px 44px;
    font-size: 14px; color: #1a2340;
    font-family: 'DM Sans', sans-serif;
    outline: none; transition: all .2s;
    letter-spacing: .3px;
  }
  .lp-input:focus {
    border-color: #2563eb44;
    background: #eef3ff;
    box-shadow: 0 0 0 3px #2563eb12;
  }
  .lp-input::placeholder { color: #b0bdd8; font-size: 13px; }
  .lp-input-icon-left {
    position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
    color: #b0bdd8; font-size: 15px; pointer-events: none;
    display: flex; align-items: center;
  }
  .lp-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    color: #b0bdd8; background: none; border: none; cursor: pointer;
    font-size: 14px; transition: color .15s; display: flex; align-items: center;
  }
  .lp-eye:hover { color: #6b7ea0; }

  /* Error */
  .lp-error {
    background: #fff0f0; border: 1px solid #fca5a5;
    border-radius: 8px; padding: 10px 14px;
    font-size: 12px; color: #dc2626; text-align: center;
    animation: shake .3s ease;
  }
  @keyframes shake {
    0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)}
  }
  .lp-success {
    background: #f0fdf4; border: 1px solid #86efac;
    border-radius: 8px; padding: 10px 14px;
    font-size: 12px; color: #16a34a; text-align: center;
  }

  /* Attempt bar */
  .lp-attempt-bar {
    display: flex; align-items: center; gap: 6px;
    background: #fff7ed; border: 1px solid #fed7aa;
    border-radius: 8px; padding: 8px 12px;
    font-size: 11px; color: #c2410c;
  }

  /* Button */
  .lp-btn {
    width: 100%; padding: 15px;
    background: linear-gradient(90deg, #2563eb, #3b82f6);
    border: none; border-radius: 10px;
    font-size: 12px; font-weight: 800; color: #fff;
    letter-spacing: 2.5px; text-transform: uppercase;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all .2s;
    box-shadow: 0 4px 20px rgba(37,99,235,0.35);
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-top: 8px;
  }
  .lp-btn:hover:not(:disabled) {
    filter: brightness(1.08);
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(37,99,235,0.4);
  }
  .lp-btn:active:not(:disabled) { transform: translateY(0); }
  .lp-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .lp-btn-arrow { font-size: 16px; font-weight: 300; }

  /* Footer */
  .lp-footer {
    margin-top: 28px;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .lp-verified {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 600; color: #6b7ea0;
    letter-spacing: .8px;
  }
  .lp-verified-dot {
    width: 14px; height: 14px; border-radius: 50%;
    background: #dcfce7; border: 1.5px solid #22c55e;
    display: flex; align-items: center; justify-content: center;
    font-size: 8px;
  }
  .lp-authorized {
    font-size: 9px; font-weight: 600; color: #9baabf;
    letter-spacing: 1.2px; text-transform: uppercase;
  }

  .lp-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const AUTH_API = "http://localhost:5000/api/auth/login";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked,   setLocked]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (locked) return;
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res    = await fetch(AUTH_API, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
      });
      const result = await res.json();

      if (!res.ok) {
        const newAtt = attempts + 1;
        setAttempts(newAtt);
        if (newAtt >= 5) {
          setLocked(true);
          setError("Account locked after 5 failed attempts. Try again in 30 minutes.");
          setTimeout(() => { setLocked(false); setAttempts(0); }, 30 * 60 * 1000);
        } else {
          setError(`${result.message} · ${5 - newAtt} attempt${5 - newAtt !== 1 ? "s" : ""} remaining`);
        }
        return;
      }

      setSuccess(`Access granted — Welcome, ${result.user.fullName}`);
      setAttempts(0);
      localStorage.setItem("dms_token", result.token);
      localStorage.setItem("dms_user",  JSON.stringify(result.user));
      if (onLogin) onLogin(result.user);
      setTimeout(() => navigate("/"), 900);
    } catch {
      setError("Cannot connect to server. Make sure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="lp-page">
        <div className="lp-card">

          {/* Logo */}
          <div className="lp-logo-wrap">
            <svg className="lp-logo-svg" viewBox="0 0 200 70" xmlns="http://www.w3.org/2000/svg">
              {/* AVS stylized logo */}
              <defs>
                <linearGradient id="avs-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2ab8b8"/>
                  <stop offset="100%" stopColor="#1a9090"/>
                </linearGradient>
              </defs>
              {/* A */}
              <polygon points="10,55 30,10 38,10 48,35 40,35 30,15 22,55" fill="url(#avs-grad)"/>
              <rect x="17" y="38" width="22" height="6" fill="url(#avs-grad)"/>
              {/* V */}
              <polygon points="52,10 62,10 72,42 82,10 92,10 77,55 67,55" fill="url(#avs-grad)"/>
              {/* S */}
              <path d="M98,13 Q116,8 122,18 Q128,28 115,33 Q128,38 125,48 Q122,58 104,57 L100,51 Q114,52 117,46 Q120,40 107,37 L103,34 Q90,30 93,20 Q96,13 98,13 Z"
                fill="url(#avs-grad)"/>
              {/* Decorative lines on A */}
              <line x1="14" y1="30" x2="26" y2="30" stroke="#2ab8b8" strokeWidth="2.5" opacity=".4"/>
              <line x1="12" y1="44" x2="24" y2="44" stroke="#2ab8b8" strokeWidth="2"   opacity=".3"/>
            </svg>
            <div className="lp-logo-tagline">In-so-Tech Pvt.Ltd.</div>
          </div>

          {/* Title */}
          <div className="lp-title">SIGN IN</div>
          <div className="lp-sub">
            <div className="lp-sub-line" />
            <span className="lp-sub-text">Secure Access Point</span>
            <div className="lp-sub-line right" />
          </div>

          {/* Form */}
          <form className="lp-form" onSubmit={handleLogin}>

            {locked && (
              <div className="lp-error">🔒 Account locked — too many failed attempts</div>
            )}
            {error   && !locked && <div className="lp-error">❌ {error}</div>}
            {success && <div className="lp-success">✅ {success}</div>}
            {attempts > 0 && !locked && !error && (
              <div className="lp-attempt-bar">
                ⚠ {attempts} failed attempt{attempts > 1 ? "s" : ""} — {5 - attempts} remaining
              </div>
            )}

            {/* Username */}
            <div>
              <label className="lp-field-label">Username</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bdd8" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </span>
                <input
                  className="lp-input"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={locked || loading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="lp-field-row">
                <label className="lp-field-label" style={{margin:0}}>Password</label>
                <a className="lp-forgot" href="#">Forgot Key?</a>
              </div>
              <div className="lp-input-wrap">
                <span className="lp-input-icon-left">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b0bdd8" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="lp-input"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={locked || loading}
                  autoComplete="current-password"
                />
                <button type="button" className="lp-eye" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="lp-btn" disabled={loading || locked}>
              {loading ? (
                <span className="lp-spinner" />
              ) : (
                <>
                  <span>Initialize Entrance</span>
                  <span className="lp-btn-arrow">›</span>
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="lp-footer">
            <div className="lp-verified">
              <div className="lp-verified-dot">✓</div>
              Verified Enterprise Node
            </div>
            <div className="lp-authorized">
              Authorized Use Only · AVS InSoTech V2.4
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
