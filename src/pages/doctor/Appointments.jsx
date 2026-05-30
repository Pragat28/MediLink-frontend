import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .ap-root {
    --accent:     #2d5a4e;
    --accent-bg:  #eaf2ef;
    --danger:     #b91c1c;
    --danger-bg:  #fef2f2;
    --warn:       #92400e;
    --warn-bg:    #fffbeb;
    --info:       #1e40af;
    --info-bg:    #eff6ff;
    --success:    #166534;
    --success-bg: #f0fdf4;
    --neutral-bg: #f9f9f8;
    --border:     rgba(0,0,0,0.08);
    --border-md:  rgba(0,0,0,0.13);
    --text:       #111;
    --muted:      #6b7280;
    --surface:    #fff;
    --page-bg:    #f4f3f0;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--page-bg);
    min-height: 100vh;
    padding: 28px 16px 80px;
  }

  .ap-wrap {
    max-width: 860px;
    margin: 0 auto;
  }

  .ap-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 20px;
    color: var(--text);
  }

  .ap-summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }
  .ap-stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
  }
  .ap-stat-num {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 2px;
    color: var(--text);
  }
  .ap-stat-num.warn    { color: var(--warn); }
  .ap-stat-num.accent  { color: var(--accent); }
  .ap-stat-num.success { color: var(--success); }
  .ap-stat-label {
    font-size: 12px;
    color: var(--muted);
    margin: 0;
  }

  .ap-tabs {
    display: flex;
    gap: 2px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 16px;
  }
  .ap-tab {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 7px;
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition: background .15s, color .15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .ap-tab:hover { background: var(--neutral-bg); color: var(--text); }
  .ap-tab.active { background: var(--accent); color: #fff; }
  .ap-tab-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    font-size: 11px;
    font-weight: 600;
    background: var(--border);
    color: var(--muted);
  }
  .ap-tab.active .ap-tab-count {
    background: rgba(255,255,255,0.25);
    color: #fff;
  }
  .ap-tab.active .ap-tab-count.urgent {
    background: #fff;
    color: var(--warn);
  }

  .ap-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 18px;
    margin-bottom: 10px;
    transition: border-color .15s;
  }
  .ap-card:hover { border-color: var(--border-md); }
  .ap-card.is-pending  { border-left: 3px solid #d97706; }
  .ap-card.is-accepted { border-left: 3px solid var(--accent); }
  .ap-card.is-history  { opacity: 0.72; }
  .ap-card.is-history:hover { opacity: 1; }

  .ap-card-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .ap-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: var(--accent-bg);
    color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-weight: 600;
    font-size: 13px;
    flex-shrink: 0;
    letter-spacing: .03em;
  }
  .ap-card-info { flex: 1; min-width: 0; }
  .ap-card-name {
    font-weight: 600;
    font-size: 14px;
    margin: 0 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ap-card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .ap-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--muted);
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    padding: 2px 7px;
    border-radius: 5px;
  }
  .ap-chip strong { color: var(--text); font-weight: 500; }
  .ap-chip i { font-size: 12px; }

  .ap-mode-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 5px;
    background: var(--info-bg);
    color: var(--info);
    border: 1px solid rgba(30,64,175,0.12);
  }
  .ap-mode-chip i { font-size: 12px; }

  .ap-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 5px;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: .03em;
    text-transform: uppercase;
  }
  .ap-badge-pending   { background: var(--warn-bg);    color: var(--warn); }
  .ap-badge-accepted  { background: var(--accent-bg);  color: var(--accent); }
  .ap-badge-rejected  { background: var(--danger-bg);  color: var(--danger); }
  .ap-badge-completed { background: var(--success-bg); color: var(--success); }
  .ap-badge-cancelled { background: var(--neutral-bg); color: var(--muted); border: 1px solid var(--border); }

  .ap-actions {
    display: flex;
    gap: 6px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
    align-items: center;
  }

  .ap-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px;
    border-radius: 7px;
    border: 1px solid transparent;
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
    white-space: nowrap;
    line-height: 1;
  }
  .ap-btn:hover  { opacity: .82; }
  .ap-btn:active { transform: scale(.97); }
  .ap-btn i { font-size: 14px; }

  .ap-btn-accept  { background: var(--accent);    color: #fff; border-color: var(--accent); }
  .ap-btn-reject  { background: var(--danger-bg); color: var(--danger); border-color: rgba(185,28,28,0.2); }
  .ap-btn-verify  { background: var(--accent);    color: #fff; border-color: var(--accent); }
  .ap-btn-cancel  { background: transparent;      color: var(--muted); border-color: var(--border-md); }
  .ap-btn-confirm { background: var(--accent);    color: #fff; border-color: var(--accent); }
  .ap-btn-ghost   { background: transparent;      color: var(--muted); border-color: var(--border-md); }

  .ap-verify-box {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    padding: 10px 12px;
    background: var(--neutral-bg);
    border: 1px solid var(--border-md);
    border-radius: 8px;
    flex-wrap: wrap;
  }
  .ap-verify-box label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
  }
  .ap-verify-box input {
    flex: 1;
    min-width: 140px;
    padding: 6px 10px;
    border: 1px solid var(--border-md);
    border-radius: 6px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    outline: none;
    background: #fff;
    transition: border-color .15s;
  }
  .ap-verify-box input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-bg); }

  .ap-rating {
    margin-top: 10px;
    padding: 8px 10px;
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    border-radius: 7px;
    font-size: 12.5px;
  }
  .ap-rating .stars  { color: #ca8a04; font-weight: 600; margin-bottom: 2px; }
  .ap-rating .review { color: var(--muted); font-style: italic; margin: 0; }

  /* ✅ NEW — complete hint box */
  .ap-complete-hint {
    margin-top: 8px;
    padding: 8px 10px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 7px;
    font-size: 12px;
    color: #78350f;
    line-height: 1.5;
  }

  .ap-empty {
    text-align: center;
    padding: 48px 20px;
    color: var(--muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .ap-empty i { font-size: 32px; display: block; margin-bottom: 10px; color: var(--accent); opacity: .5; }
  .ap-empty p { margin: 0; font-size: 13.5px; }

  .ap-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 40vh; color: var(--muted); font-size: 13px; gap: 10px;
  }
  .ap-spinner {
    width: 18px; height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: ap-spin .7s linear infinite;
  }
  @keyframes ap-spin { to { transform: rotate(360deg); } }

  @media (max-width: 600px) {
    .ap-summary { grid-template-columns: repeat(2, 1fr); }
    .ap-tab span { display: none; }
  }
`;

const initials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const statusClass = (s) => ({
  pending:   "ap-badge-pending",
  accepted:  "ap-badge-accepted",
  rejected:  "ap-badge-rejected",
  completed: "ap-badge-completed",
  cancelled: "ap-badge-cancelled",
}[s] || "ap-badge-cancelled");

const Stars = ({ rating }) => (
  <span className="stars">
    {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))} {rating}/5
  </span>
);

const Appointments = () => {
  useBackRedirect("/doctor/profile");

  const [data, setData]                   = useState([]);
  const [loading, setLoading]             = useState(false);
  const [tab, setTab]                     = useState("pending");
  const [showVerifyBox, setShowVerifyBox] = useState(null);
  const [enteredCode, setEnteredCode]     = useState("");

  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    const id = "ap-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const fetchAppointments = async () => {
    if (!token) { toast.error("Not logged in. Please log in again."); return; }
    try {
      setLoading(true);
      const res = await axios.get(
        "https://medilink-j44r.onrender.com/api/doctor-appointments/appointments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (err) {
      if (!err.response) toast.error("Network error — check your connection.");
      else if (err.response.status === 401) toast.error("Session expired. Please log in again.");
      else toast.error(err.response?.data?.message || "Failed to load appointments.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleAction = async (id, action) => {
    if (!token) { toast.error("Not logged in."); return; }
    try {
      const res = await axios.put(
        `https://medilink-j44r.onrender.com/api/doctor-appointments/appointments/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (action === "approve") {
        if (res.data.mode === "online")
          toast.info(
            `Appointment confirmed — please send the meeting link 2-3 hours before the slot to ${res.data.patientEmail} so the patient can join on time.`,
            { autoClose: 8000 }
          );
        else
          toast.success("Appointment accepted.");
      } else if (action === "reject") {
        toast.success("Appointment rejected.");
      } else if (action === "cancel") {
        toast.success("Appointment cancelled.");
      }
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed. Please try again.");
    }
  };

  const handleVerify = async (appointmentId) => {
    if (!enteredCode.trim()) { toast.error("Enter the patient code first."); return; }
    if (!token) { toast.error("Not logged in."); return; }
    try {
      await axios.put(
        "https://medilink-j44r.onrender.com/api/doctor-appointments/verify",
        { appointmentId, code: enteredCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Marked as completed.");
      setShowVerifyBox(null); setEnteredCode("");
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed. Check the code.");
    }
  };

  const allFlat = useMemo(() => {
    const flat = [];
    data.forEach(group => {
      group.requests.forEach(req => {
        flat.push({ ...req, patient: group.patient });
      });
    });
    flat.sort((a, b) => new Date(a.date) - new Date(b.date));
    return flat;
  }, [data]);

  const pending  = useMemo(() => allFlat.filter(r => r.status === "pending"),  [allFlat]);
  const upcoming = useMemo(() => allFlat.filter(r => r.status === "accepted"), [allFlat]);
  const history  = useMemo(() => allFlat.filter(r => ["completed","rejected","cancelled"].includes(r.status)), [allFlat]);

  const current = { pending, upcoming, history }[tab] || [];
  const counts  = { pending: pending.length, upcoming: upcoming.length, history: history.length };
  const totalCompleted = allFlat.filter(r => r.status === "completed").length;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  if (loading) return (
    <div className="ap-root">
      <div className="ap-loading"><div className="ap-spinner" /> Loading appointments…</div>
    </div>
  );

  return (
    <div className="ap-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />

      <div className="ap-wrap">

        <h1 className="ap-title">Appointments</h1>

        <div className="ap-summary">
          <div className="ap-stat">
            <p className={`ap-stat-num${counts.pending > 0 ? " warn" : ""}`}>{counts.pending}</p>
            <p className="ap-stat-label">Awaiting response</p>
          </div>
          <div className="ap-stat">
            <p className="ap-stat-num accent">{counts.upcoming}</p>
            <p className="ap-stat-label">Upcoming</p>
          </div>
          <div className="ap-stat">
            <p className="ap-stat-num success">{totalCompleted}</p>
            <p className="ap-stat-label">Completed</p>
          </div>
          <div className="ap-stat">
            <p className="ap-stat-num">{allFlat.length}</p>
            <p className="ap-stat-label">Total all time</p>
          </div>
        </div>

        <div className="ap-tabs">
          {["pending","upcoming","history"].map(t => (
            <button key={t} className={`ap-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
              {counts[t] > 0 && (
                <span className={`ap-tab-count${tab === t && t === "pending" ? " urgent" : ""}`}>
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        {current.length === 0 ? (
          <div className="ap-empty">
            <i className={`ti ${tab === "pending" ? "ti-circle-check" : tab === "upcoming" ? "ti-calendar-off" : "ti-history"}`} aria-hidden="true" />
            <p>
              {tab === "pending"  && "No pending requests — you're all caught up."}
              {tab === "upcoming" && "No upcoming appointments scheduled."}
              {tab === "history"  && "No past appointments yet."}
            </p>
          </div>
        ) : (
          current.map(req => (
            <div
              key={req.appointmentId}
              className={`ap-card${req.status === "pending" ? " is-pending" : req.status === "accepted" ? " is-accepted" : " is-history"}`}
            >
              <div className="ap-card-top">
                <div className="ap-avatar">{initials(req.patient?.name)}</div>
                <div className="ap-card-info">
                  <p className="ap-card-name">{req.patient?.name || "Unknown Patient"}</p>
                  <div className="ap-card-meta">
                    <span className="ap-chip">
                      <i className="ti ti-calendar" aria-hidden="true" />
                      <strong>{formatDate(req.date)}</strong>
                    </span>
                    <span className="ap-chip">
                      <i className="ti ti-clock" aria-hidden="true" />
                      <strong>{req.slotTime}</strong>
                    </span>
                    {req.mode && (
                      <span className="ap-mode-chip">
                        <i className={`ti ${req.mode === "online" ? "ti-video" : "ti-building-hospital"}`} aria-hidden="true" />
                        {req.mode === "online" ? "Online" : "In-clinic"}
                      </span>
                    )}
                    {tab === "history" && (
                      <span className={`ap-badge ${statusClass(req.status)}`}>{req.status}</span>
                    )}
                  </div>
                </div>
              </div>

              {req.status === "completed" && req.rated && (
                <div className="ap-rating">
                  <Stars rating={req.rating} />
                  {req.review && <p className="review">{req.review}</p>}
                </div>
              )}

              {req.status === "pending" && (
                <div className="ap-actions">
                  <button className="ap-btn ap-btn-accept" onClick={() => handleAction(req.appointmentId, "approve")}>
                    <i className="ti ti-check" aria-hidden="true" /> Accept
                  </button>
                  <button className="ap-btn ap-btn-reject" onClick={() => handleAction(req.appointmentId, "reject")}>
                    <i className="ti ti-x" aria-hidden="true" /> Reject
                  </button>
                </div>
              )}

              {req.status === "accepted" && (
                <>
                  <div className="ap-actions">
                    <button className="ap-btn ap-btn-verify" onClick={() => setShowVerifyBox(req.appointmentId)}>
                      <i className="ti ti-shield-check" aria-hidden="true" /> Mark as Completed
                    </button>
                    <button className="ap-btn ap-btn-cancel" onClick={() => handleAction(req.appointmentId, "cancel")}>
                      Cancel appointment
                    </button>
                  </div>
                  {/* ✅ ONLY CHANGE — hint description */}
                  <div className="ap-complete-hint">
                    ⚠️ <strong>How to mark as completed:</strong> After the appointment is done, ask the patient for their <strong>Patient ID</strong> shown on their dashboard. Click <em>Mark as Completed</em> and enter that ID to confirm. This allows the patient to rate you and updates your profile rating.
                  </div>
                </>
              )}

              {showVerifyBox === req.appointmentId && (
                <div className="ap-verify-box">
                  <label>Patient code</label>
                  <input
                    type="text"
                    placeholder="Enter code shown to patient"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify(req.appointmentId)}
                  />
                  <button className="ap-btn ap-btn-confirm" onClick={() => handleVerify(req.appointmentId)}>
                    <i className="ti ti-check" aria-hidden="true" /> Confirm
                  </button>
                  <button className="ap-btn ap-btn-ghost" onClick={() => { setShowVerifyBox(null); setEnteredCode(""); }}>
                    Cancel
                  </button>
                </div>
              )}

            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Appointments;
