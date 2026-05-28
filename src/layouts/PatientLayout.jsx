import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

function PatientLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("patientToken");
  const [patientCode, setPatientCode] = useState("");
  const [hasNewUpdate, setHasNewUpdate] = useState(false);

  // ✅ Store latest fetched statuses in memory — don't write to localStorage until patient visits
  const latestStatusesRef = useRef(null);

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

  // ✅ FIX: Empty dependency array — runs once, no re-trigger on hasNewUpdate change
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
        appointments.forEach((appt) => {
          current[appt._id] = appt.status;
        });

        // ✅ Always keep latest in memory
        latestStatusesRef.current = current;

        const saved = localStorage.getItem("appointmentStatuses");

        if (saved) {
          const previous = JSON.parse(saved);
          const changed = Object.keys(current).some(
            (id) => previous[id] && previous[id] !== current[id]
          );
          if (changed) {
            setHasNewUpdate(true);
            // ✅ FIX: DO NOT save to localStorage here — wait until patient visits the page
            return;
          }
        }

        // ✅ Only save when there's no pending unacknowledged change
        localStorage.setItem("appointmentStatuses", JSON.stringify(current));

      } catch (err) {
        console.log(err);
      }
    };

    checkAppointmentStatuses();
    const interval = setInterval(checkAppointmentStatuses, 30000);
    return () => clearInterval(interval);
  }, []); // ✅ empty deps — critical fix

  // ✅ FIX: No extra API call needed — use what we already have in memory
  const handleAppointmentsClick = () => {
    if (hasNewUpdate) {
      setHasNewUpdate(false);
      if (latestStatusesRef.current) {
        localStorage.setItem(
          "appointmentStatuses",
          JSON.stringify(latestStatusesRef.current)
        );
      }
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{
        width: "220px", background: "#1e293b", color: "white",
        padding: "20px", position: "fixed", height: "100vh", left: 0, top: 0
      }}>
        <h2>Patient Panel</h2>

        {patientCode && (
          <div style={{
            marginTop: "12px", padding: "10px", background: "#1e40af",
            borderRadius: "8px", textAlign: "center"
          }}>
            <p style={{ fontSize: "11px", color: "#bfdbfe", marginBottom: "3px" }}>Your ID</p>
            <div style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "3px", color: "white" }}>
              {patientCode}
            </div>
            <p style={{ fontSize: "10px", marginTop: "4px", color: "#dbeafe" }}>
              Show this to doctor for verification
            </p>
          </div>
        )}

        <nav style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link to="/patient/search" style={{ color: "white" }}>Search Doctors</Link>
          <Link to="/patient/predict" style={{ color: "white" }}>Diagnose</Link>

          <Link
            to="/patient/appointments"
            onClick={handleAppointmentsClick}
            style={{ color: "white", display: "flex", alignItems: "center", gap: "8px" }}
          >
            My Appointments
            {hasNewUpdate && (
              <span style={{
                width: "9px", height: "9px", borderRadius: "50%",
                background: "#ef4444", display: "inline-block", flexShrink: 0
              }} />
            )}
          </Link>

          <Link to="/patient/profile" style={{ color: "white" }}>Profile</Link>
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "30px", padding: "10px", width: "100%",
            background: "#ef4444", border: "none", color: "white",
            borderRadius: "5px", cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginLeft: "220px", width: "100%", height: "100vh", overflowY: "auto", padding: "30px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default PatientLayout;
