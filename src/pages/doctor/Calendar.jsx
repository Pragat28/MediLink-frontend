import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .dc-root {
    --bg:        #f5f4f0;
    --surface:   #ffffff;
    --border:    #e2e0d8;
    --text:      #1a1a1a;
    --muted:     #787167;
    --accent:    #2d5a4e;
    --accent-lt: #e8f0ee;
    --danger:    #c0392b;
    --radius:    10px;
    --shadow:    0 2px 16px rgba(0,0,0,0.07);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--bg);
    min-height: 100vh;
    padding: 40px 20px 80px;
  }

  .dc-card {
    max-width: 980px;
    margin: 0 auto;
    background: var(--surface);
    border-radius: 16px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  /* Header */
  .dc-header {
    background: var(--accent);
    padding: 32px 40px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .dc-header-icon {
    width: 44px; height: 44px;
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .dc-header-icon svg { width: 22px; height: 22px; stroke: #fff; fill: none; }
  .dc-header h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: #fff;
    margin: 0;
  }
  .dc-header p { color: rgba(255,255,255,0.65); margin: 2px 0 0; font-size: 13px; }

  .dc-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  /* Left: calendar pane */
  .dc-cal-pane {
    padding: 32px 32px 32px 40px;
    border-right: 1.5px solid var(--border);
  }
  .dc-cal-pane h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    font-weight: 400;
    color: var(--accent);
    margin: 0 0 20px;
    padding-bottom: 10px;
    border-bottom: 1.5px solid var(--border);
  }

  /* Right: appointments pane */
  .dc-appt-pane {
    padding: 32px 40px 32px 32px;
  }
  .dc-appt-pane h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    font-weight: 400;
    color: var(--accent);
    margin: 0 0 6px;
    padding-bottom: 10px;
    border-bottom: 1.5px solid var(--border);
  }
  .dc-date-subtitle {
    font-size: 12px;
    color: var(--muted);
    margin: 0 0 18px;
    font-weight: 500;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  /* Legend */
  .dc-legend {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    font-size: 12px;
    color: var(--muted);
  }
  .dc-legend-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }

  /* Override react-calendar to match design */
  .dc-cal-pane .react-calendar {
    width: 100%;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    background: #fff;
    box-shadow: none;
    padding: 8px;
  }
  .dc-cal-pane .react-calendar__navigation {
    margin-bottom: 8px;
  }
  .dc-cal-pane .react-calendar__navigation button {
    font-family: 'DM Serif Display', serif;
    font-size: 15px;
    color: var(--text);
    background: none;
    border: none;
    border-radius: 6px;
    min-width: 36px;
  }
  .dc-cal-pane .react-calendar__navigation button:hover {
    background: var(--accent-lt);
  }
  .dc-cal-pane .react-calendar__navigation__label {
    font-weight: 400;
    font-family: 'DM Serif Display', serif;
    font-size: 16px;
  }
  .dc-cal-pane .react-calendar__month-view__weekdays {
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .05em;
  }
  .dc-cal-pane .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
  }
  .dc-cal-pane .react-calendar__tile {
    border-radius: 7px;
    font-size: 13px;
    padding: 8px 4px;
    color: var(--text);
    transition: background .12s;
  }
  .dc-cal-pane .react-calendar__tile:hover {
    background: var(--accent-lt) !important;
    color: var(--accent) !important;
  }
  .dc-cal-pane .react-calendar__tile--now {
    background: #f0fdf4;
    color: var(--accent);
    font-weight: 600;
  }
  .dc-cal-pane .react-calendar__tile--active,
  .dc-cal-pane .react-calendar__tile--active:hover {
    background: var(--accent) !important;
    color: #fff !important;
    font-weight: 600;
  }

  /* Appointment dot tile */
  .dc-cal-pane .appointment-day {
    position: relative;
    font-weight: 600;
  }
  .dc-cal-pane .appointment-day::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
  }
  .dc-cal-pane .react-calendar__tile--active.appointment-day::after {
    background: rgba(255,255,255,0.7);
  }

  /* Appointment cards */
  .dc-appt-card {
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 16px;
    margin-bottom: 10px;
    background: #fafaf8;
    transition: border-color .15s;
  }
  .dc-appt-card:hover { border-color: var(--accent); }
  .dc-appt-card:last-child { margin-bottom: 0; }

  .dc-appt-name {
    font-weight: 600;
    font-size: 14px;
    margin: 0 0 6px;
    color: var(--text);
  }

  .dc-appt-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .dc-appt-meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12.5px;
    color: var(--muted);
  }
  .dc-appt-meta-item svg {
    width: 13px; height: 13px;
    stroke: currentColor; fill: none;
  }

  /* Status badge */
  .dc-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .03em;
    text-transform: uppercase;
  }
  .dc-badge-pending   { background: #fef3c7; color: #92400e; }
  .dc-badge-accepted  { background: var(--accent-lt); color: var(--accent); }
  .dc-badge-completed { background: #e0f2e9; color: #166534; }
  .dc-badge-cancelled { background: #f3f4f6; color: #6b7280; }
  .dc-badge-rejected  { background: #fdf1f0; color: var(--danger); }

  /* Empty state */
  .dc-empty {
    text-align: center;
    padding: 40px 16px;
    color: var(--muted);
  }
  .dc-empty-icon {
    width: 48px; height: 48px;
    background: var(--accent-lt);
    border-radius: 50%;
    margin: 0 auto 14px;
    display: flex; align-items: center; justify-content: center;
  }
  .dc-empty-icon svg { width: 22px; height: 22px; stroke: var(--accent); fill: none; }
  .dc-empty p { font-size: 13px; margin: 0; }

  /* Loading */
  .dc-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 40vh;
    color: var(--muted);
    font-size: 13px;
    gap: 10px;
  }
  .dc-spinner {
    width: 20px; height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: dc-spin .7s linear infinite;
  }
  @keyframes dc-spin { to { transform: rotate(360deg); } }

  @media (max-width: 720px) {
    .dc-body { grid-template-columns: 1fr; }
    .dc-cal-pane { border-right: none; border-bottom: 1.5px solid var(--border); padding: 24px 20px; }
    .dc-appt-pane { padding: 24px 20px; }
    .dc-header { padding: 22px 20px; }
  }
`;

/* ─── Icons ─── */
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
const IconUser = () => (
  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const badgeClass = (s) => ({
  pending:   "dc-badge-pending",
  accepted:  "dc-badge-accepted",
  completed: "dc-badge-completed",
  cancelled: "dc-badge-cancelled",
  rejected:  "dc-badge-rejected",
}[s] || "dc-badge-cancelled");

/* ─── Main component ─── */
function DoctorCalendar() {
  useBackRedirect("/doctor/profile");

  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  const token = localStorage.getItem("doctorToken");

  /* Inject styles once */
  useEffect(() => {
    const id = "dc-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          "https://medilink-j44r.onrender.com/api/doctor-appointments/appointments/calendar",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAppointments(res.data);
        // Show today's appointments on load
        const todayAppts = res.data.filter(
          a => new Date(a.date).toDateString() === new Date().toDateString()
        );
        setSelectedDayAppointments(todayAppts);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        toast.error("Failed to load calendar data.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchAppointments();
  }, [token]);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    const filtered = appointments.filter(
      a => new Date(a.date).toDateString() === selectedDate.toDateString()
    );
    setSelectedDayAppointments(filtered);
  };

  const tileClassName = ({ date: tileDate, view }) => {
    if (view === "month") {
      const has = appointments.some(
        a => new Date(a.date).toDateString() === tileDate.toDateString()
      );
      if (has) return "appointment-day";
    }
    return null;
  };

  const formattedDate = date.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  if (fetchLoading) return (
    <div className="dc-root">
      <div className="dc-loading">
        <div className="dc-spinner" />
        Loading calendar…
      </div>
    </div>
  );

  return (
    <div className="dc-root">
      <div className="dc-card">

        {/* Header */}
        <div className="dc-header">
          <div className="dc-header-icon">
            <IconCalendar />
          </div>
          <div>
            <h1>Calendar</h1>
            <p>View your confirmed appointments by date</p>
          </div>
        </div>

        <div className="dc-body">

          {/* Left — Calendar */}
          <div className="dc-cal-pane">
            <h2>Select a Date</h2>
            <Calendar
              onChange={handleDateChange}
              value={date}
              tileClassName={tileClassName}
            />
            <div className="dc-legend">
              <span className="dc-legend-dot" />
              <span>Date has appointments</span>
            </div>
          </div>

          {/* Right — Appointment list */}
          <div className="dc-appt-pane">
            <h2>Appointments</h2>
            <p className="dc-date-subtitle">{formattedDate}</p>

            {selectedDayAppointments.length === 0 ? (
              <div className="dc-empty">
                <div className="dc-empty-icon"><IconCalendar /></div>
                <p>No confirmed appointments on this date.</p>
              </div>
            ) : (
              selectedDayAppointments.map(appt => (
                <div className="dc-appt-card" key={appt._id}>
                  <p className="dc-appt-name">{appt.patient?.name || "Unknown Patient"}</p>
                  <div className="dc-appt-meta">
                    <span className="dc-appt-meta-item">
                      <IconClock />
                      {appt.slotTime}
                    </span>
                    <span className="dc-appt-meta-item">
                      <IconUser />
                      {appt.patient?.name}
                    </span>
                    <span className={`dc-badge ${badgeClass(appt.status)}`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default DoctorCalendar;
