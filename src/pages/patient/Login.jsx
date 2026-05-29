import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pl-login-root {
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #0a0f1e;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ── Orbs ── */
  .pl-login-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  .pl-login-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: pl-orb-float 10s ease-in-out infinite;
  }
  .pl-login-orb-1 { width: 500px; height: 500px; background: #1d4ed8; top: -120px; left: -100px; animation-delay: 0s; }
  .pl-login-orb-2 { width: 400px; height: 400px; background: #2d5a4e; bottom: -100px; right: -80px; animation-delay: -4s; }
  .pl-login-orb-3 { width: 280px; height: 280px; background: #7c3aed; top: 40%; left: 55%; animation-delay: -7s; }
  @keyframes pl-orb-float {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-40px) scale(1.05); }
    66%      { transform: translate(-20px,20px) scale(0.97); }
  }

  /* ── Header ── */
  .pl-login-header {
    position: relative; z-index: 10;
    padding: 14px 32px;
    display: flex; align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
    cursor: pointer;
  }
  .pl-login-logo-mark {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #2d5a4e, #3d8b77);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; margin-right: 9px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
  }
  .pl-login-logo-name {
    font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -.03em;
  }
  .pl-login-logo-name span { color: #4ade80; }

  /* ── Main ── */
  .pl-login-main {
    position: relative; z-index: 10;
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 20px;
  }

  /* ── Pill ── */
  .pl-login-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #93c5fd;
    font-size: 11px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 20px;
    margin-bottom: 20px;
  }
  .pl-login-pill-dot {
    width: 6px; height: 6px; background: #3b82f6;
    border-radius: 50%; box-shadow: 0 0 8px #3b82f6;
    animation: pl-pdot 2s ease-in-out infinite;
  }
  @keyframes pl-pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

  .pl-login-heading {
    font-size: 32px; font-weight: 800; color: #fff;
    letter-spacing: -.04em; line-height: 1.1;
    margin-bottom: 8px; text-align: center;
  }
  .pl-login-heading .blue { color: #60a5fa; }

  .pl-login-sub {
    font-size: 13px; color: rgba(255,255,255,0.38);
    margin-bottom: 32px; text-align: center;
  }

  /* ── Card ── */
  .pl-login-card {
    width: 100%; max-width: 400px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 20px;
    padding: 28px 28px 24px;
    backdrop-filter: blur(12px);
  }

  /* ── Form ── */
  .pl-login-form {
    display: flex; flex-direction: column;
    gap: 14px;
  }

  .pl-login-field {
    display: flex; flex-direction: column;
    gap: 6px;
  }
  .pl-login-label {
    font-size: 11.5px; font-weight: 600;
    letter-spacing: .04em; text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .pl-login-input {
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
  .pl-login-input::placeholder { color: rgba(255,255,255,0.22); }
  .pl-login-input:focus {
    border-color: rgba(59,130,246,0.55);
    background: rgba(59,130,246,0.07);
  }

  /* ── Button ── */
  .pl-login-btn {
    margin-top: 6px;
    padding: 12px 0;
    background: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    letter-spacing: -.01em;
    transition: opacity .15s, transform .1s;
  }
  .pl-login-btn:hover:not(:disabled) { opacity: .85; }
  .pl-login-btn:active:not(:disabled) { transform: scale(.98); }
  .pl-login-btn:disabled { opacity: .5; cursor: not-allowed; }

  /* ── Divider ── */
  .pl-login-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 20px 0 0;
  }
  .pl-login-divider-line {
    flex: 1; height: 1px; background: rgba(255,255,255,0.08);
  }
  .pl-login-divider-text {
    font-size: 11px; color: rgba(255,255,255,0.2);
  }

  /* ── Register link ── */
  .pl-login-register {
    margin-top: 14px; text-align: center;
    font-size: 13px; color: rgba(255,255,255,0.35);
  }
  .pl-login-register-link {
    color: #60a5fa; font-weight: 600; cursor: pointer;
    transition: color .15s;
  }
  .pl-login-register-link:hover { color: #93c5fd; }

  /* ── Back link ── */
  .pl-login-back {
    margin-top: 22px;
    font-size: 12px; color: rgba(255,255,255,0.2);
    cursor: pointer; transition: color .15s;
    display: flex; align-items: center; gap: 5px;
  }
  .pl-login-back:hover { color: rgba(255,255,255,0.45); }

  /* ── Footer ── */
  .pl-login-footer {
    position: relative; z-index: 10;
    text-align: center; padding: 10px;
    border-top: 1px solid rgba(255,255,255,0.05);
    font-size: 11px; color: rgba(255,255,255,0.15);
    flex-shrink: 0;
  }
`;

const PatientLogin = () => {
  useBackRedirect("/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter email and password");
    }
    try {
      setLoading(true);
      console.log("Sending login request:", { email, password });
      const res = await api.post("/auth/login", { email, password });
      console.log("LOGIN RESPONSE:", res.data);
      localStorage.setItem("patientToken", res.data.token);
      toast.success(res.data.message || "Logged in successfully");
      navigate("/patient/profile");
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("ERROR RESPONSE:", err.response);
      toast.error(
        err.response?.data?.message || err.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="pl-login-root">

        {/* Orbs */}
        <div className="pl-login-bg">
          <div className="pl-login-orb pl-login-orb-1" />
          <div className="pl-login-orb pl-login-orb-2" />
          <div className="pl-login-orb pl-login-orb-3" />
        </div>

        {/* Header */}
        <header className="pl-login-header" onClick={() => navigate("/")}>
          <div className="pl-login-logo-mark">🔗</div>
          <div className="pl-login-logo-name">Medi<span>Link</span></div>
        </header>

        {/* Main */}
        <main className="pl-login-main">

          <div className="pl-login-pill">
            <span className="pl-login-pill-dot" />
            Patient Portal
          </div>

          <h1 className="pl-login-heading">
            Welcome <span className="blue">back</span>
          </h1>
          <p className="pl-login-sub">Sign in to manage your appointments</p>

          <div className="pl-login-card">
            <form className="pl-login-form" onSubmit={handleSubmit}>

              <div className="pl-login-field">
                <label className="pl-login-label">Email</label>
                <input
                  className="pl-login-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="pl-login-field">
                <label className="pl-login-label">Password</label>
                <input
                  className="pl-login-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="pl-login-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>

            </form>

            <div className="pl-login-divider">
              <div className="pl-login-divider-line" />
              <span className="pl-login-divider-text">or</span>
              <div className="pl-login-divider-line" />
            </div>

            <p className="pl-login-register">
              Not a member?{" "}
              <span
                className="pl-login-register-link"
                onClick={() => navigate("/patient/register")}
              >
                Create account
              </span>
            </p>
          </div>

          <span className="pl-login-back" onClick={() => navigate("/")}>
            ← Back to home
          </span>

        </main>

        {/* Footer */}
        <footer className="pl-login-footer">
          © 2026 MediLink — Smart Healthcare Platform
        </footer>

      </div>
    </>
  );
};

export default PatientLogin;
