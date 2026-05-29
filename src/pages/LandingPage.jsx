import { useNavigate } from "react-router-dom";
import useBackRedirect from "../hooks/useBackRedirect";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #f8f7f4;
    display: flex;
    flex-direction: column;
  }

  .lp-header {
    padding: 18px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.07);
  }
  .lp-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .lp-logo-icon {
    width: 34px; height: 34px;
    background: #2d5a4e;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px;
  }
  .lp-logo-text {
    font-size: 18px;
    font-weight: 700;
    color: #111;
    letter-spacing: -.02em;
  }
  .lp-logo-sub {
    font-size: 12px;
    color: #6b7280;
    font-weight: 400;
  }

  .lp-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 20px 60px;
    text-align: center;
  }

  .lp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eaf2ef;
    color: #2d5a4e;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .04em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
  .lp-eyebrow-dot {
    width: 6px; height: 6px;
    background: #2d5a4e;
    border-radius: 50%;
  }

  .lp-heading {
    font-size: 40px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -.03em;
    line-height: 1.15;
    margin-bottom: 14px;
    max-width: 500px;
  }
  .lp-heading span { color: #2d5a4e; }

  .lp-sub {
    font-size: 15px;
    color: #6b7280;
    line-height: 1.6;
    max-width: 420px;
    margin-bottom: 48px;
  }

  .lp-cards {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .lp-card {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 16px;
    padding: 28px 24px;
    width: 260px;
    text-align: left;
    transition: box-shadow .2s, transform .2s;
  }
  .lp-card:hover {
    box-shadow: 0 12px 40px rgba(0,0,0,0.10);
    transform: translateY(-2px);
  }

  .lp-card-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin-bottom: 14px;
  }
  .lp-card-icon.blue { background: #eff6ff; }
  .lp-card-icon.green { background: #eaf2ef; }

  .lp-card-title {
    font-size: 16px;
    font-weight: 600;
    color: #111;
    margin-bottom: 6px;
  }
  .lp-card-desc {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.55;
    margin-bottom: 20px;
  }

  .lp-divider {
    height: 1px;
    background: rgba(0,0,0,0.07);
    margin-bottom: 16px;
  }

  .lp-btn {
    display: block;
    width: 100%;
    padding: 9px 0;
    border-radius: 8px;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
    text-align: center;
  }
  .lp-btn:hover  { opacity: .87; }
  .lp-btn:active { transform: scale(.98); }
  .lp-btn + .lp-btn { margin-top: 8px; }

  .lp-btn-primary-blue  { background: #1d4ed8; color: #fff; }
  .lp-btn-outline-blue  { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
  .lp-btn-primary-green { background: #2d5a4e; color: #fff; }
  .lp-btn-outline-green { background: #eaf2ef; color: #2d5a4e; border: 1px solid #a7d4c8; }

  .lp-footer {
    text-align: center;
    padding: 16px;
    background: #fff;
    border-top: 1px solid rgba(0,0,0,0.07);
    font-size: 12px;
    color: #9ca3af;
  }

  @media (max-width: 600px) {
    .lp-heading { font-size: 28px; }
    .lp-header  { padding: 16px 20px; }
  }
`;

function LandingPage() {
  useBackRedirect(null, true);
  const navigate = useNavigate();

  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-root">

        {/* Header */}
        <header className="lp-header">
          <div className="lp-logo">
            <div className="lp-logo-icon">🏥</div>
            <div>
              <div className="lp-logo-text">MediCo</div>
              <div className="lp-logo-sub">Smart Healthcare</div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <main className="lp-hero">
          <div className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            AI-Powered Healthcare
          </div>

          <h1 className="lp-heading">
            Your health,<br /><span>simplified.</span>
          </h1>

          <p className="lp-sub">
            Book appointments, consult doctors, and get AI-powered health insights — all in one place.
          </p>

          <div className="lp-cards">

            {/* Patient card */}
            <div className="lp-card">
              <div className="lp-card-icon blue">🧑‍⚕️</div>
              <p className="lp-card-title">Patient</p>
              <p className="lp-card-desc">Book appointments, predict conditions, and manage your health records.</p>
              <div className="lp-divider" />
              <button className="lp-btn lp-btn-primary-blue" onClick={() => navigate("/patient/login")}>
                Login
              </button>
              <button className="lp-btn lp-btn-outline-blue" onClick={() => navigate("/patient/register")}>
                Create account
              </button>
            </div>

            {/* Doctor card */}
            <div className="lp-card">
              <div className="lp-card-icon green">👨‍⚕️</div>
              <p className="lp-card-title">Doctor</p>
              <p className="lp-card-desc">Manage patients, appointments, and your availability with ease.</p>
              <div className="lp-divider" />
              <button className="lp-btn lp-btn-primary-green" onClick={() => navigate("/doctor/login")}>
                Login
              </button>
              <button className="lp-btn lp-btn-outline-green" onClick={() => navigate("/doctor/register")}>
                Create account
              </button>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="lp-footer">
          © 2026 MediCo — Smart Healthcare
        </footer>

      </div>
    </>
  );
}

export default LandingPage;
