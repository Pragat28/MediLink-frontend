import React, { useEffect, useState } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

/* ─── Shared design-system styles ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .ap-root {
    --bg:        #f5f4f0;
    --surface:   #ffffff;
    --border:    #e2e0d8;
    --text:      #1a1a1a;
    --muted:     #787167;
    --accent:    #2d5a4e;
    --accent-lt: #e8f0ee;
    --danger:    #c0392b;
    --danger-lt: #fdf1f0;
    --warn:      #92400e;
    --warn-lt:   #fef3c7;
    --info:      #1e3a5f;
    --info-lt:   #dbeafe;
    --radius:    10px;
    --shadow:    0 2px 16px rgba(0,0,0,0.07);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--bg);
    min-height: 100vh;
    padding: 40px 20px 80px;
  }

  .ap-card {
    max-width: 980px;
    margin: 0 auto;
    background: var(--surface);
    border-radius: 16px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  /* Header */
  .ap-header {
    background: var(--accent);
    padding: 32px 40px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .ap-header-icon {
    width: 44px; height: 44px;
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .ap-header-icon svg { width: 22px; height: 22px; stroke: #fff; fill: none; }
  .ap-header h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: #fff;
    margin: 0;
  }
  .ap-header p { color: rgba(255,255,255,0.65); margin: 2px 0 0; font-size: 13px; }

  .ap-body { padding: 32px 40px; }

  /* Empty state */
  .ap-empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
  }
  .ap-empty-icon {
    width: 56px; height: 56px;
    background: var(--accent-lt);
    border-radius: 50%;
    margin: 0 auto 16px;
    display: flex; align-items: center; justify-content: center;
  }
  .ap-empty-icon svg { width: 26px; height: 26px; stroke: var(--accent); fill: none; }
  .ap-empty h3 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: 20px;
    color: var(--text);
    margin: 0 0 6px;
  }
  .ap-empty p { font-size: 13px; margin: 0; }

  /* Patient group card */
  .ap-group {
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 20px;
    overflow: hidden;
  }
  .ap-group-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: #fafaf8;
    border-bottom: 1.5px solid var(--border);
  }
  .ap-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 600;
    font-size: 16px;
    flex-shrink: 0;
    font-family: 'DM Serif Display', serif;
  }
  .ap-group-name { font-weight: 600; font-size: 15px; margin: 0 0 2px; }
  .ap-group-email { font-size: 12px; color: var(--muted); margin: 0; }

  /* Appointment row */
  .ap-request {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }
  .ap-request:last-child { border-bottom: none; }

  .ap-meta {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .ap-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--muted);
  }
  .ap-meta-item svg { width: 14px; height: 14px; stroke: currentColor; fill: none; flex-shrink: 0; }
  .ap-meta-item strong { color: var(--text); font-weight: 500; }

  /* Status badge */
  .ap-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: .03em;
    text-transform: uppercase;
  }
  .ap-badge-pending  { background: var(--warn-lt);   color: var(--warn); }
  .ap-badge-accepted { background: var(--accent-lt); color: var(--accent); }
  .ap-badge-rejected { background: var(--danger-lt); color: var(--danger); }
  .ap-badge-completed{ background: #e0f2e9;          color: #166534; }
  .ap-badge-cancelled{ background: #f3f4f6;          color: #6b7280; }

  /* Mode badge */
  .ap-mode {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11.5px;
    font-weight: 500;
    background: var(--info-lt);
    color: var(--info);
  }
  .ap-mode svg { width: 12px; height: 12px; stroke: currentColor; fill: none; }

  /* Rating block */
  .ap-rating {
    margin-top: 12px;
    padding: 12px 14px;
    background: #fafaf8;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 13px;
  }
  .ap-rating .stars { color: #ca8a04; font-weight: 600; margin-bottom: 4px; font-size: 13.5px; }
  .ap-rating .review { color: var(--muted); font-style: italic; margin: 0; }

  /* Action row */
  .ap-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; align-items: center; }

  /* Buttons */
  .ap-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 14px;
    border-radius: 7px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
    white-space: nowrap;
  }
  .ap-btn:hover  { opacity: .85; }
  .ap-btn:active { transform: scale(.97); }
  .ap-btn svg    { width: 14px; height: 14px; stroke: currentColor; fill: none; }

  .ap-btn-accept  { background: var(--accent);    color: #fff; }
  .ap-btn-reject  { background: var(--danger-lt); color: var(--danger); }
  .ap-btn-verify  { background: var(--info-lt);   color: var(--info); border: 1.5px solid #bfdbfe; }
  .ap-btn-cancel  { background: #f3f4f6;          color: #374151; }
  .ap-btn-confirm { background: var(--accent);    color: #fff; }
  .ap-btn-ghost   { background: transparent;      color: var(--muted); border: 1.5px solid var(--border); }

  /* Verify box */
  .ap-verify-box {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 12px 14px;
    background: var(--info-lt);
    border: 1.5px solid #bfdbfe;
    border-radius: 8px;
    flex-wrap: wrap;
  }
  .ap-verify-box label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: var(--info);
    white-space: nowrap;
  }
  .ap-verify-box input {
    flex: 1;
    min-width: 140px;
    padding: 7px 10px;
    border: 1.5px solid #bfdbfe;
    border-radius: 7px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    background: #fff;
    transition: border-color .15s;
  }
  .ap-verify-box input:focus { border-color: var(--info); }

  /* Loading */
  .ap-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 40vh;
    color: var(--muted);
    font-size: 13px;
    gap: 10px;
  }
  .ap-spinner {
    width: 20px; height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: ap-spin .7s linear infinite;
  }
  @keyframes ap-spin { to { transform: rotate(360deg); } }

  /* Divider label */
  .ap-count-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
  }

  @media (max-width: 640px) {
    .ap-body   { padding: 20px; }
    .ap-header { padding: 22px 20px; }
  }
`;

/* ─── Helpers ─── */
const initials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const statusClass = (s) => ({
  pending:   "ap-badge-pending",
  accepted:  "ap-badge-accepted",
  rejected:  "ap-badge-rejected",
  completed: "ap-badge-completed",
  cancelled: "ap-badge-cancelled",
}[s] || "ap-badge-cancelled");

/* ─── SVG icons ─── */
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconList = () => (
  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IconWifi = () => (
  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18"/><line x1="9" y1="21" x2="9" y2="3"/>
    <line x1="15" y1="21" x2="15" y2="3"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ─── Star rendering ─── */
const Stars = ({ rating }) => {
  const filled = Math.round(rating);
  return (
    <span className="stars">
      {"★".repeat(filled)}{"☆".repeat(5 - filled)} {rating}/5
    </span>
  );
};

/* ─── Main component ─── */
const Appointments = () => {
  useBackRedirect("/doctor/profile");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVerifyBox, setShowVerifyBox] = useState(null);
  const [enteredCode, setEnteredCode] = useState("");

  const token = localStorage.getItem("doctorToken");

  /* Inject styles once */
  useEffect(() => {
    const id = "ap-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const fetchAppointments = async () => {
    if (!token) { toast.error("You are not logged in. Please log in again."); return; }
    try {
      setLoading(true);
      const res = await axios.get(
        "https://medilink-j44r.onrender.com/api/doctor-appointments/appointments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (err) {
      if (!err.response) toast.error("Network error — please check your internet connection.");
      else if (err.response.status === 401) toast.error("Session expired. Please log in again.");
      else toast.error(err.response?.data?.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleAction = async (id, action) => {
    if (!token) { toast.error("You are not logged in. Please log in again."); return; }
    try {
      const res = await axios.put(
        `https://medilink-j44r.onrender.com/api/doctor-appointments/appointments/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (action === "approve") {
        if (res.data.mode === "online") {
          toast.info(`Please send the meeting link to: ${res.data.patientEmail}`, { autoClose: 8000 });
        } else {
          toast.success("Appointment accepted successfully.");
        }
      } else if (action === "reject") {
        toast.success("Appointment rejected.");
      } else if (action === "cancel") {
        toast.success("Appointment cancelled.");
      }
      fetchAppointments();
    } catch (err) {
      if (!err.response) toast.error("Network error — could not perform action. Please try again.");
      else toast.error(err.response?.data?.message || "Action failed. Please try again.");
    }
  };

  const handleVerify = async (appointmentId) => {
    if (!enteredCode.trim()) { toast.error("Please enter the patient code before verifying."); return; }
    if (!token) { toast.error("You are not logged in. Please log in again."); return; }
    try {
      await axios.put(
        "https://medilink-j44r.onrender.com/api/doctor-appointments/verify",
        { appointmentId, code: enteredCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment verified and marked as completed.");
      setShowVerifyBox(null);
      setEnteredCode("");
      fetchAppointments();
    } catch (err) {
      if (!err.response) toast.error("Network error — verification failed. Please try again.");
      else toast.error(err.response?.data?.message || "Verification failed. Please check the code and try again.");
    }
  };

  if (loading) return (
    <div className="ap-root">
      <div className="ap-loading">
        <div className="ap-spinner" />
        Loading appointments…
      </div>
    </div>
  );

  const totalRequests = data.reduce((acc, g) => acc + g.requests.length, 0);

  return (
    <div className="ap-root">
      <div className="ap-card">

        {/* Header */}
        <div className="ap-header">
          <div className="ap-header-icon">
            <IconList />
          </div>
          <div>
            <h1>Appointments</h1>
            <p>Review and manage all patient appointment requests</p>
          </div>
        </div>

        <div className="ap-body">

          {data.length === 0 ? (
            <div className="ap-empty">
              <div className="ap-empty-icon"><IconList /></div>
              <h3>No Appointments Yet</h3>
              <p>When patients book with you, their requests will appear here.</p>
            </div>
          ) : (
            <>
              <p className="ap-count-label">
                {totalRequests} appointment{totalRequests !== 1 ? "s" : ""} across {data.length} patient{data.length !== 1 ? "s" : ""}
              </p>

              {data.map((group, index) => (
                <div className="ap-group" key={index}>

                  {/* Patient header */}
                  <div className="ap-group-header">
                    <div className="ap-avatar">{initials(group.patient?.name)}</div>
                    <div>
                      <p className="ap-group-name">{group.patient?.name || "Unknown Patient"}</p>
                      <p className="ap-group-email">{group.patient?.email || ""}</p>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
                      {group.requests.length} request{group.requests.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Appointment rows */}
                  {group.requests.map(req => (
                    <div className="ap-request" key={req.appointmentId}>

                      {/* Meta row */}
                      <div className="ap-meta">
                        <span className="ap-meta-item">
                          <IconCalendar />
                          <strong>{new Date(req.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</strong>
                        </span>
                        <span className="ap-meta-item">
                          <IconClock />
                          <strong>{req.slotTime}</strong>
                        </span>
                        {req.mode && (
                          <span className={`ap-mode`}>
                            {req.mode === "online" ? <IconWifi /> : <IconBuilding />}
                            {req.mode === "online" ? "Online" : "In-clinic"}
                          </span>
                        )}
                        <span className={`ap-badge ${statusClass(req.status)}`}>
                          {req.status}
                        </span>
                      </div>

                      {/* Rating block */}
                      {req.status === "completed" && req.rated && (
                        <div className="ap-rating">
                          <Stars rating={req.rating} />
                          {req.review && <p className="review">{req.review}</p>}
                        </div>
                      )}

                      {/* Actions */}
                      {req.status === "pending" && (
                        <div className="ap-actions">
                          <button className="ap-btn ap-btn-accept" onClick={() => handleAction(req.appointmentId, "approve")}>
                            <IconCheck /> Accept
                          </button>
                          <button className="ap-btn ap-btn-reject" onClick={() => handleAction(req.appointmentId, "reject")}>
                            <IconX /> Reject
                          </button>
                        </div>
                      )}

                      {req.status === "accepted" && (
                        <div className="ap-actions">
                          <button className="ap-btn ap-btn-verify" onClick={() => setShowVerifyBox(req.appointmentId)}>
                            <IconShield /> Verify &amp; Complete
                          </button>
                          <button className="ap-btn ap-btn-cancel" onClick={() => handleAction(req.appointmentId, "cancel")}>
                            <IconX /> Cancel
                          </button>
                        </div>
                      )}

                      {/* Verify box */}
                      {showVerifyBox === req.appointmentId && (
                        <div className="ap-verify-box">
                          <label>Patient Code</label>
                          <input
                            type="text"
                            placeholder="Enter code from patient"
                            value={enteredCode}
                            onChange={(e) => setEnteredCode(e.target.value)}
                          />
                          <button className="ap-btn ap-btn-confirm" onClick={() => handleVerify(req.appointmentId)}>
                            <IconCheck /> Verify
                          </button>
                          <button className="ap-btn ap-btn-ghost" onClick={() => { setShowVerifyBox(null); setEnteredCode(""); }}>
                            Cancel
                          </button>
                        </div>
                      )}

                    </div>
                  ))}

                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Appointments;
