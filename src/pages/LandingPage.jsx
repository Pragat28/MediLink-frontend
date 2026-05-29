import { useNavigate } from "react-router-dom";
import useBackRedirect from "../hooks/useBackRedirect";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #fff;
    display: flex;
    flex-direction: column;
  }

  .lp-header {
    padding: 16px 40px;
    display: flex;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.07);
  }
  .lp-logo-icon {
    width: 36px; height: 36px;
    background: #2d5a4e;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    margin-right: 10px;
    flex-shrink: 0;
  }
  .lp-logo-name {
    font-size: 17px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -.02em;
  }
  .lp-logo-tagline {
    font-size: 11.5px;
    color: #9ca3af;
    font-weight: 400;
  }

  .lp-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 56px 20px 64px;
    text-align: center;
  }

  .lp-heading {
    font-size: 46px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -.04em;
    line-height: 1.1;
    margin-bottom: 16px;
  }
  .lp-heading em {
    font-style: normal;
    color: #2d5a4e;
  }

  .lp-sub {
    font-size: 15px;
    color: #6b7280;
    line-height: 1.65;
    max-width: 380px;
    margin-bottom: 52px;
  }

  .lp-cards {
    display: flex;
    gap: 18px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .lp-card {
    background: #fff;
    border: 1.5px solid rgba(0,0,0,0.09);
    border-radius: 18px;
    padding: 28px 24px 24px;
    width: 256px;
    text-align: left;
    transition: box-shadow .2s, transform .18s;
  }
  .lp-card:hover {
    box-shadow: 0 16px 48px rgba(0,0,0,0.11);
    transform: translateY(-3px);
  }

  .lp-card-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .05em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
    margin-bottom: 16px;
  }
  .lp-card-badge.blue  { background: #eff6ff; color: #1d4ed8; }
  .lp-card-badge.green { background: #eaf2ef; color: #2d5a4e; }
  .lp-card-badge-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: currentColor;
  }

  .lp-card-emoji {
    font-size: 36px;
    margin-bottom: 12px;
    display: block;
    line-height: 1;
  }

  .lp-card-title {
    font-size: 17px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 6px;
    letter-spacing: -.02em;
  }
  .lp-card-desc {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.55;
    margin-bottom: 22px;
    min-height: 52px;
  }

  .lp-btn {
    display: block;
    width: 100%;
    padding: 10px 0;
    border-radius: 9px;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
    text-align: center;
    letter-spacing: -.01em;
  }
  .lp-btn:hover  { opacity: .85; }
  .lp-btn:active { transform: scale(.98); }
  .lp-btn + .lp-btn { margin-top: 8px; }

  .lp-btn-blue        { background: #1d4ed8; color: #fff; }
  .lp-btn-blue-ghost  { background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; }
  .lp-btn-green       { background: #2d5a4e; color: #fff; }
  .lp-btn-green-ghost { background: #eaf2ef; color: #2d5a4e; border: 1.5px solid #a7d4c8; }

  .lp-footer {
    text-align: center;
    padding: 14px;
    border-top: 1px solid rgba(0,0,0,0.07);
    font-size: 12px;
    color: #cbd5e1;
  }

  @media (max-width: 600px) {
    .lp-heading { font-size: 32px; }
    .lp-header  { padding: 14px 20px; }
    .lp-card    { width: 100%; max-width: 320px; }
  }
`;

function LandingPage() {
  useBackRedirect(null, true);
  const navigate = useNavigate();

  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-root">

        <header className="lp-header">
          <div className="lp-logo-icon">🏥</div>
          <div>
            <div className="lp-logo-name">MediCo</div>
            <div className="lp-logo-tagline">Smart Healthcare</div>
          </div>
        </header>

        <main className="lp-hero">
          <h1 className="lp-heading">
            Healthcare that<br /><em>actually works.</em>
          </h1>
          <p className="lp-sub">
            Book appointments, consult doctors, and manage your health — all in one place.
          </p>

          <div className="lp-cards">

            {/* Patient */}
            <div className="lp-card">
              <span className="lp-card-badge blue">
                <span className="lp-card-badge-dot" /> For patients
              </span>
              <span className="lp-card-emoji">🙋</span>
              <p className="lp-card-title">Patient</p>
              <p className="lp-card-desc">Book appointments, get health predictions, and manage your records.</p>
              <button className="lp-btn lp-btn-blue" onClick={() => navigate("/patient/login")}>
                Login
              </button>
              <button className="lp-btn lp-btn-blue-ghost" onClick={() => navigate("/patient/register")}>
                Create account
              </button>
            </div>

            {/* Doctor */}
            <div className="lp-card">
              <span className="lp-card-badge green">
                <span className="lp-card-badge-dot" /> For doctors
              </span>
              <span className="lp-card-emoji">🩺</span>
              <p className="lp-card-title">Doctor</p>
              <p className="lp-card-desc">Manage patients, handle appointments, and set your availability.</p>
              <button className="lp-btn lp-btn-green" onClick={() => navigate("/doctor/login")}>
                Login
              </button>
              <button className="lp-btn lp-btn-green-ghost" onClick={() => navigate("/doctor/register")}>
                Create account
              </button>
            </div>

          </div>
        </main>

        <footer className="lp-footer">
          © 2026 MediCo — Smart Healthcare
        </footer>

      </div>
    </>
  );
}

export default LandingPage;
