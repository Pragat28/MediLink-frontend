import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

function PatientLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("patientToken");
  const [patientCode, setPatientCode] = useState("");
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  const lastStatusesRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("appointmentStatuses");
    navigate("/patient/login");
  };

  // ✅ FETCH PATIENT PROFILE
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

  // ✅ POLLING LOGIC — checks every 30 seconds for status changes
  useEffect(() => {
    const checkAppointmentStatuses = async () => {
      try {
        const res = await axios.get(
          "https://medilink-j44r.onrender.com/api/appointments/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const current = {};
        res.data.forEach((appt) => {
          current[appt._id] = appt.status;
        });

        const saved = localStorage.getItem("appointmentStatuses");

        if (saved) {
          const previous = JSON.parse(saved);
          const changed = Object.keys(current).some(
            (id) => previous[id] && previous[id] !== current[id]
          );
          if (changed) {
            setHasNewUpdate(true);
          }
        }

        // ✅ FIXED — always save statuses so first load works correctly
        localStorage.setItem("appointmentStatuses", JSON.stringify(current));
        lastStatusesRef.current = current;

      } catch (err) {
        console.log(err);
      }
    };

    // Run once immediately, then every 30 seconds
    checkAppointmentStatuses();
    const interval = setInterval(checkAppointmentStatuses, 30000);
    return () => clearInterval(interval);
  }, [hasNewUpdate]);

  // ✅ When patient clicks Appointments tab — clear the dot and update saved statuses
  const handleAppointmentsClick = async () => {
    if (hasNewUpdate) {
      setHasNewUpdate(false);
      try {
        const res = await axios.get(
          "https://medilink-j44r.onrender.com/api/appointments/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const current = {};
        res.data.forEach((appt) => {
          current[appt._id] = appt.status;
        });
        localStorage.setItem("appointmentStatuses", JSON.stringify(current));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#1e293b",
          color: "white",
          padding: "20px",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0
        }}
      >
        <h2>Patient Panel</h2>

        {patientCode && (
          <div style={{
            marginTop: "12px",
            padding: "10px",
            background: "#1e40af",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "11px", color: "#bfdbfe", marginBottom: "3px" }}>
              Your ID
            </p>
            <div style={{
              fontSize: "20px",
              fontWeight: "600",
              letterSpacing: "3px",
              color: "white"
            }}>
              {patientCode}
            </div>
            <p style={{ fontSize: "10px", marginTop: "4px", color: "#dbeafe" }}>
              Show this to doctor for verification
            </p>
          </div>
        )}

        <nav style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link to="/patient/search" style={{ color: "white" }}>
            Search Doctors
          </Link>
          <Link to="/patient/predict" style={{ color: "white" }}>
            Diagnose
          </Link>

          {/* ✅ My Appointments with badge dot */}
          <Link
            to="/patient/appointments"
            onClick={handleAppointmentsClick}
            style={{ color: "white", display: "flex", alignItems: "center", gap: "8px" }}
          >
            My Appointments
            {hasNewUpdate && (
              <span style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#ef4444",
                display: "inline-block",
                flexShrink: 0
              }} />
            )}
          </Link>

          <Link to="/patient/profile" style={{ color: "white" }}>
            Profile
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "30px",
            padding: "10px",
            width: "100%",
            background: "#ef4444",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: "220px",
        width: "100%",
        height: "100vh",
        overflowY: "auto",
        padding: "30px"
      }}>
        <Outlet />
      </div>
    </div>
  );
}

export default PatientLayout;
