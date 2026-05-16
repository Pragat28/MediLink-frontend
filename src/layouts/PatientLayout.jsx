import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PatientLayout() {

  const navigate = useNavigate();
  const token = localStorage.getItem("patientToken");

  const [patientCode, setPatientCode] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    navigate("/patient/login");
  };

  // ✅ FETCH PATIENT PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/patient/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setPatientCode(res.data.patientCode);

      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

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

        {/* ✅ UPDATED ID UI */}
        {patientCode && (
          <div style={{
            marginTop: "12px",
            padding: "10px",
            background: "#1e40af",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{
              fontSize: "11px",
              color: "#bfdbfe",
              marginBottom: "3px"
            }}>
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

            <p style={{
              fontSize: "10px",
              marginTop: "4px",
              color: "#dbeafe"
            }}>
              Show this to doctor for verification
            </p>
          </div>
        )}

        <nav
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}
        >

          <Link to="/patient/search" style={{ color: "white" }}>
            Search Doctors
          </Link>

          <Link to="/patient/predict" style={{ color: "white" }}>
            Diagnose
          </Link>

          <Link to="/patient/appointments" style={{ color: "white" }}>
            My Appointments
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
      <div
        style={{
          marginLeft: "220px",
          width: "100%",
          height: "100vh",
          overflowY: "auto",
          padding: "30px"
        }}
      >
        <Outlet />
      </div>

    </div>
  );
}

export default PatientLayout;