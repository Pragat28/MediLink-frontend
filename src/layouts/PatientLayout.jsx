import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

/* ─── Injected Styles ─────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .pl-root {
    --accent:        #3b6b9e;
    --accent-light:  #4d7daf;
    --accent-bg:     #eef3f9;
    --accent-border: rgba(59,107,158,0.18);
    --neutral-bg:    #f4f6f9;
    --border:        rgba(0,0,0,0.07);
    --border-md:     rgba(0,0,0,0.11);
    --text:          #1a1f2e;
    --text-sec:      #3d4a5c;
    --muted:         #697586;
    --surface:       #fff;
    --page-bg:       #edf0f5;
    --danger:        #ef4444;
    --sidebar-bg:    #111827;
    --sidebar-text:  #e2e8f0;
    --sidebar-muted: #94a3b8;
    --sidebar-hover: rgba(255,255,255,0.06);
    --sidebar-active: rgba(59,107,158,0.25);
    --sidebar-active-border: #3b6b9e;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Layout ── */
  .pl-layout {
    display: flex;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .pl-sidebar {
    width: 240px;
    background: var(--sidebar-bg);
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    z-index: 100;
    border-right: 1px solid rgba(255,255,255,0.05);
  }

  /* Brand */
  .pl-brand {
    padding: 22px 20px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .pl-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 21px;
    font-weight: 400;
    color: #fff;
    margin: 0 0 2px;
    letter-spacing: 0.01em;
  }
  .pl-brand-sub {
    font-size: 11px;
    color: var(--sidebar-muted);
    margin: 0;
    letter-spacing: 0.03em;
  }

  /* Patient ID card */
  .pl-id-card {
    margin: 14px 14px 0;
    background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%);
    border-radius: 10px;
    padding: 12px 14px;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .pl-id-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #93c5fd;
    margin: 0 0 6px;
  }
  .pl-id-code {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 4px;
    color: #fff;
    margin: 0 0 6px;
    font-variant-numeric: tabular-nums;
  }
  .pl-id-hint {
    font-size: 10px;
    color: #bfdbfe;
    margin: 0;
    line-height: 1.4;
  }

  /* Nav */
  .pl-nav {
    flex: 1;
    padding: 18px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .pl-nav-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--sidebar-muted);
    padding: 0 10px;
    margin: 0 0 6px;
  }

  .pl-nav-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 12px;
    border-radius: 8px;
    color: var(--sidebar-text);
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 500;
    transition: background 0.15s, color 0.15s;
    border-left: 2px solid transparent;
  }
  .pl-nav-link:hover {
    background: var(--sidebar-hover);
    color: #fff;
  }
  .pl-nav-link.active {
    background: var(--sidebar-active);
    color: #fff;
    border-left-color: var(--sidebar-active-border);
    font-weight: 600;
  }

  .pl-nav-link-inner {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pl-nav-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--danger);
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(239,68,68,0.6);
  }

  /* Logout */
  .pl-logout-wrap {
    padding: 12px 10px 20px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .pl-logout-btn {
    width: 100%;
    padding: 9px 12px;
    border-radius: 8px;
    border: 1px solid rgba(239,68,68,0.25);
    background: rgba(239,68,68,0.08);
    color: #fca5a5;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pl-logout-btn:hover {
    background: rgba(239,68,68,0.16);
    color: #fecaca;
  }

  /* ── Main content ── */
  .pl-main {
    margin-left: 240px;
    width: calc(100% - 240px);
    min-height: 100vh;
    background: var(--page-bg);
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    .pl-sidebar { width: 200px; }
    .pl-main { margin-left: 200px; width: calc(100% - 200px); }
  }
`;

function PatientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("patientToken");
  const [patientCode, setPatientCode] = useState("");
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  const latestStatusesRef = useRef(null);

  /* ── inject styles ── */
  useEffect(() => {
    const sid = "pl-styles";
    if (!document.getElementById(sid)) {
      const tag = document.createElement("style");
      tag.id = sid; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("appointmentStatuses");
    navigate("/patient/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://medilink-j44r.onrender.com/api/patient/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPatientCode(res.data.patientCode);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const checkAppointmentStatuses = async () => {
      try {
        const res = await axios.get(
          "https://medilink-j44r.onrender.com/api/appointments/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const appointments = res.data.appointments;
        if (!appointments || !Array.isArray(appointments)) return;

        const current = {};
        appointments.forEach((appt) => { current[appt._id] = appt.status; });
        latestStatusesRef.current = current;

        const saved = localStorage.getItem("appointmentStatuses");
        if (saved) {
          const previous = JSON.parse(saved);
          const changed = Object.keys(current).some(
            (id) => previous[id] && previous[id] !== current[id]
          );
          if (changed) { setHasNewUpdate(true); return; }
        }
        localStorage.setItem("appointmentStatuses", JSON.stringify(current));
      } catch (err) {
        console.log(err);
      }
    };

    checkAppointmentStatuses();
    const interval = setInterval(checkAppointmentStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAppointmentsClick = () => {
    if (hasNewUpdate) {
      setHasNewUpdate(false);
      if (latestStatusesRef.current) {
        localStorage.setItem("appointmentStatuses", JSON.stringify(latestStatusesRef.current));
      }
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="pl-root">
      <div className="pl-layout">

        {/* ── Sidebar ── */}
        <aside className="pl-sidebar">

          {/* Brand */}
          <div className="pl-brand">
            <p className="pl-brand-name">MediLink</p>
            <p className="pl-brand-sub">Patient Portal</p>
          </div>

          {/* Patient ID */}
          {patientCode && (
            <div className="pl-id-card">
              <p className="pl-id-label">Your Patient ID</p>
              <p className="pl-id-code">{patientCode}</p>
              <p className="pl-id-hint">Show this to your doctor for verification</p>
            </div>
          )}

          {/* Nav */}
          <nav className="pl-nav">
            <p className="pl-nav-label">Menu</p>

            <Link
              to="/patient/search"
              className={`pl-nav-link${isActive("/patient/search") ? " active" : ""}`}
            >
              <span className="pl-nav-link-inner">Search Doctors</span>
            </Link>

            <Link
              to="/patient/appointments"
              className={`pl-nav-link${isActive("/patient/appointments") ? " active" : ""}`}
              onClick={handleAppointmentsClick}
            >
              <span className="pl-nav-link-inner">My Appointments</span>
              {hasNewUpdate && <span className="pl-nav-dot" />}
            </Link>

            <Link
              to="/patient/profile"
              className={`pl-nav-link${isActive("/patient/profile") ? " active" : ""}`}
            >
              <span className="pl-nav-link-inner">Profile</span>
            </Link>
          </nav>

          {/* Logout */}
          <div className="pl-logout-wrap">
            <button className="pl-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

        </aside>

        {/* ── Main ── */}
        <main className="pl-main">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default PatientLayout;
