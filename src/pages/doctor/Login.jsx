import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    overflow-y: auto !important;
    height: auto !important;
  }

  .dl-login-root {
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #0a0f1e;
    display: flex;
    flex-direction: column;
  }

  /* ── Orbs ── */
  .dl-login-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .dl-login-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: dl-orb-float 10s ease-in-out infinite;
  }
  .dl-login-orb-1 { width: 500px; height: 500px; background: #2d5a4e; top: -120px; left: -100px; animation-delay: 0s; }
  .dl-login-orb-2 { width: 400px; height: 400px; background: #065f46; bottom: -100px; right: -80px; animation-delay: -4s; }
  .dl-login-orb-3 { width: 280px; height: 280px; background: #0f766e; top: 40%; left: 55%; animation-delay: -7s; }
  @keyframes dl-orb-float {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-40px) scale(1.05); }
    66%      { transform: translate(-20px,20px) scale(0.97); }
  }

  /* ── Header ── */
  .dl-login-header {
    position: relative; z-index: 10;
    padding: 14px 32px;
    display: flex; align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
    cursor: pointer;
  }
  .dl-login-logo-mark {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #2d5a4e, #3d8b77);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; margin-right: 9px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
  }
  .dl-login-logo-name {
    font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -.03em;
  }
  .dl-login-logo-name span { color: #4ade80; }

  /* ── Main ── */
  .dl-login-main {
    position: relative; z-index: 10;
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 20px;
  }

  /* ── Pill ── */
  .dl-login-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #a3e6ca;
    font-size: 11px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 20px;
    margin-bottom: 20px;
  }
  .dl-login-pill-dot {
    width: 6px; height: 6px; background: #4ade80;
    border-radius: 50%; box-shadow: 0 0 8px #4ade80;
    animation: dl-pdot 2s ease-in-out infinite;
  }
  @keyframes dl-pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

  .dl-login-heading {
    font-size: 32px; font-weight: 800; color: #fff;
    letter-spacing: -.04em; line-height: 1.1;
    margin-bottom: 8px; text-align: center;
  }
  .dl-login-heading .green { color: #4ade80; }

  .dl-login-sub {
    font-size: 13px; color: rgba(255,255,255,0.38);
    margin-bottom: 32px; text-align: center;
  }

  /* ── Card ── */
  .dl-login-card {
    width: 100%; max-width: 400px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 20px;
    padding: 28px 28px 24px;
    backdrop-filter: blur(12px);
  }

  /* ── Form ── */
  .dl-login-form {
    display: flex; flex-direction: column;
    gap: 14px;
  }

  .dl-login-field {
    display: flex; flex-direction: column;
    gap: 6px;
  }
  .dl-login-label {
    font-size: 11.5px; font-weight: 600;
    letter-spacing: .04em; text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .dl-login-input {
    padding: 11px 14px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color .2s, background .2s;
  }
  .dl-login-input::placeholder { color: rgba(255,255,255,0.22); }
  .dl-login-input:focus {
    border-color: rgba(74,222,128,0.5);
    background: rgba(74,222,128,0.06);
  }

  /* ── Button ── */
  .dl-login-btn {
    margin-top: 6px;
    padding: 12px 0;
    background: #2d5a4e;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    letter-spacing: -.01em;
    transition: opacity .15s, transform .1s, background .2s;
  }
  .dl-login-btn:hover:not(:disabled) { background: #3d7a66; }
  .dl-login-btn:active:not(:disabled) { transform: scale(.98); }
  .dl-login-btn:disabled { opacity: .5; cursor: not-allowed; }

  /* ── Divider ── */
  .dl-login-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 20px 0 0;
  }
  .dl-login-divider-line {
    flex: 1; height: 1px; background: rgba(255,255,255,0.08);
  }
  .dl-login-divider-text {
    font-size: 11px; color: rgba(255,255,255,0.2);
  }

  /* ── Register link ── */
  .dl-login-register {
    margin-top: 14px; text-align: center;
    font-size: 13px; color: rgba(255,255,255,0.35);
  }
  .dl-login-register-link {
    color: #4ade80; font-weight: 600; cursor: pointer;
    transition: color .15s;
  }
  .dl-login-register-link:hover { color: #86efac; }

  /* ── Back link ── */
  .dl-login-back {
    margin-top: 22px;
    font-size: 12px; color: rgba(255,255,255,0.2);
    cursor: pointer; transition: color .15s;
    display: flex; align-items: center; gap: 5px;
  }
  .dl-login-back:hover { color: rgba(255,255,255,0.45); }

  /* ── Footer ── */
  .dl-login-footer {
    position: relative; z-index: 10;
    text-align: center; padding: 10px;
    border-top: 1px solid rgba(255,255,255,0.05);
    font-size: 11px; color: rgba(255,255,255,0.15);
    flex-shrink: 0;
  }
`;

const DoctorLogin = () => {
  useBackRedirect("/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("doctorToken");
    if (token) navigate("/doctor/profile");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter email and password");
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://medilink-j44r.onrender.com/api/doctor-auth/login",
        { email: email.trim(), password }
      );
      localStorage.setItem("doctorToken", res.data.token);
      localStorage.setItem("doctorData", JSON.stringify(res.data.doctor));
      toast.success("Login successful");
      navigate("/doctor/profile");
    } catch (err) {
      const message = err.response?.data?.message;
      if (message === "Account not approved yet") {
        toast.warning("Your account is under admin verification.");
      } else if (message === "Invalid credentials") {
        toast.error("Invalid email or password");
      } else {
        toast.error(message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="dl-login-root">

        {/* Orbs */}
        <div className="dl-login-bg">
          <div className="dl-login-orb dl-login-orb-1" />
          <div className="dl-login-orb dl-login-orb-2" />
          <div className="dl-login-orb dl-login-orb-3" />
        </div>

        {/* Header */}
        <header className="dl-login-header" onClick={() => navigate("/")}>
          <div className="dl-login-logo-mark">🔗</div>
          <div className="dl-login-logo-name">Medi<span>Link</span></div>
        </header>

        {/* Main */}
        <main className="dl-login-main">

          <div className="dl-login-pill">
            <span className="dl-login-pill-dot" />
            Doctor Portal
          </div>

          <h1 className="dl-login-heading">
            Welcome <span className="green">back</span>
          </h1>
          <p className="dl-login-sub">Sign in to manage your appointments</p>

          <div className="dl-login-card">
            <form className="dl-login-form" onSubmit={handleSubmit}>

              <div className="dl-login-field">
                <label className="dl-login-label">Email</label>
                <input
                  className="dl-login-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="dl-login-field">
                <label className="dl-login-label">Password</label>
                <input
                  className="dl-login-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="dl-login-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>

            </form>

            <div className="dl-login-divider">
              <div className="dl-login-divider-line" />
              <span className="dl-login-divider-text">or</span>
              <div className="dl-login-divider-line" />
            </div>

            <p className="dl-login-register">
              Not registered?{" "}
              <span
                className="dl-login-register-link"
                onClick={() => navigate("/doctor/register")}
              >
                Create account
              </span>
            </p>
          </div>

          <span className="dl-login-back" onClick={() => navigate("/")}>
            ← Back to home
          </span>

        </main>

        {/* Footer */}
        <footer className="dl-login-footer">
          © 2026 MediLink — Smart Healthcare Platform
        </footer>

      </div>
    </>
  );
};

export default DoctorLogin;
