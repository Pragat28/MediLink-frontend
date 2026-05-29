import { useNavigate } from "react-router-dom";
import useBackRedirect from "../hooks/useBackRedirect";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #0a0f1e;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .lp-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  .lp-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: orb-float 10s ease-in-out infinite;
  }
  .lp-orb-1 { width: 500px; height: 500px; background: #2d5a4e; top: -120px; left: -100px; animation-delay: 0s; }
  .lp-orb-2 { width: 400px; height: 400px; background: #1d4ed8; bottom: -100px; right: -80px; animation-delay: -4s; }
  .lp-orb-3 { width: 280px; height: 280px; background: #7c3aed; top: 35%; left: 52%; animation-delay: -7s; }
  @keyframes orb-float {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-40px) scale(1.05); }
    66%      { transform: translate(-20px,20px) scale(0.97); }
  }

  /* HEADER */
  .lp-header {
    position: relative; z-index: 10;
    padding: 14px 32px;
    display: flex; align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }
  .lp-logo-mark {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #2d5a4e, #3d8b77);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; margin-right: 9px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
  }
  .lp-logo-name {
    font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -.03em;
  }
  .lp-logo-name span { color: #4ade80; }

  /* HERO */
  .lp-hero {
    position: relative; z-index: 10;
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 20px 20px 24px;
    text-align: center;
    gap: 0;
  }

  .lp-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #a3e6ca;
    font-size: 11px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 20px;
    margin-bottom: 16px;
  }
  .lp-pill-dot {
    width: 6px; height: 6px; background: #4ade80;
    border-radius: 50%; box-shadow: 0 0 8px #4ade80;
    animation: pdot 2s ease-in-out infinite;
  }
  @keyframes pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

  .lp-heading {
    font-size: 36px; font-weight: 800; color: #fff;
    letter-spacing: -.04em; line-height: 1.1;
    margin-bottom: 10px;
  }
  .lp-heading .green { color: #4ade80; }

  .lp-sub {
    font-size: 13.5px; color: rgba(255,255,255,0.4);
    line-height: 1.6; max-width: 360px;
    margin-bottom: 28px;
  }

  /* CARDS */
  .lp-cards {
    display: flex; gap: 16px;
    justify-content: center; flex-wrap: wrap;
    width: 100%; max-width: 580px;
  }

  .lp-card {
    flex: 1; min-width: 240px; max-width: 272px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 18px;
    padding: 22px 20px 20px;
    text-align: left;
    backdrop-filter: blur(12px);
    transition: border-color .2s, background .2s, transform .18s;
  }
  .lp-card:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.16);
    transform: translateY(-3px);
  }

  .lp-card-top {
    display: flex; align-items: center; gap: 11px;
    margin-bottom: 10px;
  }
  .lp-card-icon {
    width: 42px; height: 42px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .lp-card-icon.blue  { background: rgba(59,130,246,0.18); border: 1px solid rgba(59,130,246,0.25); }
  .lp-card-icon.green { background: rgba(45,90,78,0.45);   border: 1px solid rgba(74,222,128,0.2); }

  .lp-card-label {
    font-size: 10.5px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase; margin-bottom: 1px;
  }
  .lp-card-label.blue  { color: #93c5fd; }
  .lp-card-label.green { color: #4ade80; }
  .lp-card-title {
    font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -.02em;
  }

  .lp-card-desc {
    font-size: 12.5px; color: rgba(255,255,255,0.38);
    line-height: 1.55; margin-bottom: 16px;
  }

  .lp-btn {
    display: block; width: 100%;
    padding: 10px 0; border-radius: 9px; border: none;
    font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
    text-align: center; letter-spacing: -.01em;
  }
  .lp-btn:hover  { opacity: .84; }
  .lp-btn:active { transform: scale(.98); }
  .lp-btn + .lp-btn { margin-top: 7px; }

  .lp-btn-blue   { background: #3b82f6; color: #fff; }
  .lp-btn-blue-o { background: transparent; color: #93c5fd; border: 1px solid rgba(59,130,246,0.35); }
  .lp-btn-green  { background: #2d5a4e; color: #fff; }
  .lp-btn-green-o{ background: transparent; color: #4ade80; border: 1px solid rgba(74,222,128,0.28); }

  /* FOOTER */
  .lp-footer {
    position: relative; z-index: 10;
    text-align: center; padding: 10px;
    border-top: 1px solid rgba(255,255,255,0.05);
    font-size: 11px; color: rgba(255,255,255,0.15);
    flex-shrink: 0;
  }

  @media (max-width: 560px) {
    .lp-heading { font-size: 28px; }
    .lp-card    { min-width: 100%; max-width: 100%; }
    .lp-hero    { justify-content: flex-start; padding-top: 28px; overflow-y: auto; }
    .lp-root    { height: auto; overflow: visible; }
  }
`;

function LandingPage() {
  useBackRedirect(null, true);
  const navigate = useNavigate();

  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-root">

        <div className="lp-bg">
          <div className="lp-orb lp-orb-1" />
          <div className="lp-orb lp-orb-2" />
          <div className="lp-orb lp-orb-3" />
        </div>

        <header className="lp-header">
          <div className="lp-logo-mark">🔗</div>
          <div className="lp-logo-name">Medi<span>Link</span></div>
        </header>

        <main className="lp-hero">

          <div className="lp-pill">
            <span className="lp-pill-dot" />
            Smart Healthcare Platform
          </div>

          <h1 className="lp-heading">
            Connect. Consult.<br />
            <span className="green">Get Better.</span>
          </h1>

          <p className="lp-sub">
            Book appointments with verified doctors and get the care you deserve — fast.
          </p>

          <div className="lp-cards">

            <div className="lp-card">
              <div className="lp-card-top">
                <div className="lp-card-icon blue">🙋</div>
                <div>
                  <p className="lp-card-label blue">Patient</p>
                  <p className="lp-card-title">I need care</p>
                </div>
              </div>
              <p className="lp-card-desc">Find doctors, book slots, and manage your appointments in minutes.</p>
              <button className="lp-btn lp-btn-blue" onClick={() => navigate("/patient/login")}>
                Login
              </button>
              <button className="lp-btn lp-btn-blue-o" onClick={() => navigate("/patient/register")}>
                Create account
              </button>
            </div>

            <div className="lp-card">
              <div className="lp-card-top">
                <div className="lp-card-icon green">🩺</div>
                <div>
                  <p className="lp-card-label green">Doctor</p>
                  <p className="lp-card-title">I provide care</p>
                </div>
              </div>
              <p className="lp-card-desc">Manage your schedule, patients, and appointments all in one dashboard.</p>
              <button className="lp-btn lp-btn-green" onClick={() => navigate("/doctor/login")}>
                Login
              </button>
              <button className="lp-btn lp-btn-green-o" onClick={() => navigate("/doctor/register")}>
                Create account
              </button>
            </div>

          </div>
        </main>

        <footer className="lp-footer">
          © 2026 MediLink — Smart Healthcare Platform
        </footer>

      </div>
    </>
  );
}

export default LandingPage;
