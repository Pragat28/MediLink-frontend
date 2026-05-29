import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  html, body {
    overflow-y: auto !important;
    height: auto !important;
  }

  .dl-root {
    --accent:               #2d5a4e;
    --accent-light:         #3a7362;
    --accent-bg:            #e8f0ee;
    --accent-border:        rgba(45,90,78,0.18);
    --page-bg:              #f0f4f2;
    --border:               rgba(0,0,0,0.07);
    --text:                 #1a1a1a;
    --muted:                #787167;
    --surface:              #fff;
    --danger:               #c0392b;
    --sidebar-bg:           #111827;
    --sidebar-text:         #e2e8f0;
    --sidebar-muted:        #94a3b8;
    --sidebar-hover:        rgba(255,255,255,0.06);
    --sidebar-active:       rgba(45,90,78,0.30);
    --sidebar-active-border:#2d5a4e;
    font-family: 'DM Sans', sans-serif;
  }

  .dl-layout {
    display: flex;
    min-height: 100vh;
  }

  .dl-sidebar {
    width: 240px;
    background: var(--sidebar-bg);
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    z-index: 100;
    border-right: 1px solid rgba(255,255,255,0.05);
    overflow: hidden;
  }

  .dl-brand {
    padding: 22px 20px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .dl-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 21px;
    font-weight: 400;
    color: #fff;
    margin: 0 0 2px;
    letter-spacing: 0.01em;
  }
  .dl-brand-sub {
    font-size: 11px;
    color: var(--sidebar-muted);
    margin: 0;
    letter-spacing: 0.03em;
  }

  .dl-doctor-card {
    margin: 14px 14px 0;
    background: linear-gradient(135deg, #1a3a2e 0%, #2d5a4e 100%);
    border-radius: 10px;
    padding: 12px 14px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .dl-doctor-info { flex: 1; min-width: 0; }
  .dl-doctor-role {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #6ee7b7;
    margin: 0 0 3px;
  }
  .dl-doctor-name {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dl-nav {
    flex: 1;
    padding: 18px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .dl-nav-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--sidebar-muted);
    padding: 0 10px;
    margin: 0 0 6px;
  }
  .dl-nav-link {
    display: flex;
    align-items: center;
    padding: 9px 12px;
    border-radius: 8px;
    color: var(--sidebar-text);
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 500;
    transition: background 0.15s, color 0.15s;
    border-left: 2px solid transparent;
    gap: 10px;
  }
  .dl-nav-link:hover {
    background: var(--sidebar-hover);
    color: #fff;
  }
  .dl-nav-link.active {
    background: var(--sidebar-active);
    color: #fff;
    border-left-color: var(--sidebar-active-border);
    font-weight: 600;
  }

  .dl-logout-wrap {
    padding: 12px 10px 20px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .dl-logout-btn {
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
  .dl-logout-btn:hover {
    background: rgba(239,68,68,0.16);
    color: #fecaca;
  }

  .dl-main {
    margin-left: 240px;
    width: calc(100% - 240px);
    min-height: 100vh;
    background: var(--page-bg);
  }

  @media (max-width: 768px) {
    .dl-sidebar { width: 200px; }
    .dl-main { margin-left: 200px; width: calc(100% - 200px); }
  }
`;

// ✅ same as SearchDoctors.jsx
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='76' height='76'%3E%3Crect width='76' height='76' fill='%23d9e5f3'/%3E%3Ccircle cx='38' cy='30' r='13' fill='%236a94bc'/%3E%3Cellipse cx='38' cy='65' rx='20' ry='15' fill='%236a94bc'/%3E%3C/svg%3E";

function DoctorLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sid = "dl-styles";
    if (!document.getElementById(sid)) {
      const tag = document.createElement("style");
      tag.id = sid;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  let doctorData = null;
  try {
    const storedData = localStorage.getItem("doctorData");
    doctorData = storedData ? JSON.parse(storedData) : null;
  } catch {
    doctorData = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorData");
    navigate("/doctor/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  // ✅ same photo logic as SearchDoctors.jsx
  const getPhoto = () => {
    const photo = doctorData?.photo;
    if (photo && photo.trim() !== "") {
      return photo.startsWith("http")
        ? photo
        : `https://medilink-j44r.onrender.com${photo}`;
    }
    return PLACEHOLDER;
  };

  return (
    <div className="dl-root">
      <div className="dl-layout">

        <aside className="dl-sidebar">

          <div className="dl-brand">
            <p className="dl-brand-name">MediLink</p>
            <p className="dl-brand-sub">Doctor Portal</p>
          </div>

          <div className="dl-doctor-card">
            {/* ✅ CHANGED — proper photo with fallback */}
            <img
              src={getPhoto()}
              alt="Doctor"
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />
            <div className="dl-doctor-info">
              <p className="dl-doctor-role">Signed in as</p>
              <p className="dl-doctor-name">{doctorData?.name || "Doctor"}</p>
            </div>
          </div>

          <nav className="dl-nav">
            <p className="dl-nav-label">Menu</p>
            <Link to="/doctor/appointments" className={`dl-nav-link${isActive("/doctor/appointments") ? " active" : ""}`}>
              Appointments
            </Link>
            <Link to="/doctor/calendar" className={`dl-nav-link${isActive("/doctor/calendar") ? " active" : ""}`}>
              Calendar
            </Link>
            <Link to="/doctor/profile" className={`dl-nav-link${isActive("/doctor/profile") ? " active" : ""}`}>
              Profile
            </Link>
          </nav>

          <div className="dl-logout-wrap">
            <button className="dl-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

        </aside>

        <main className="dl-main">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DoctorLayout;
