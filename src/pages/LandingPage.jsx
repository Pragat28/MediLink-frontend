import { useNavigate } from "react-router-dom";
import useBackRedirect from "../hooks/useBackRedirect";
import { toast } from "react-toastify";

function LandingPage() {
  useBackRedirect(null, true);

  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(to right, #e0f2fe, #f8fafc)",
      display: "flex",
      flexDirection: "column"
    }}>

      {/* HEADER */}
      <div style={{
        padding: "20px", // reduced
        textAlign: "center",
        background: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}>
        <h1 style={{ margin: 0, color: "#1e3a8a" }}>MediCo</h1>
        <p style={{ color: "#64748b" }}>
          Smart Healthcare Appointment & Prediction System
        </p>
      </div>

      {/* HERO */}
      <div style={{
        flex: "0 1 auto", // 🔥 key fix
        textAlign: "center",
        padding: "30px 20px 20px 20px" // reduced top spacing
      }}>
        <h2 style={{ fontSize: "32px", color: "#0f172a" }}>
          Your Health, Simplified
        </h2>

        <p style={{
          maxWidth: "600px",
          margin: "10px auto",
          color: "#475569",
          lineHeight: "1.6"
        }}>
          Book appointments, consult doctors, and get AI-powered health insights —
          all in one place.
        </p>

        {/* CARDS */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "20px", // 🔥 reduced
          flexWrap: "wrap"
        }}>

          {/* PATIENT CARD */}
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            width: "280px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#2563eb" }}>Patient</h3>
            <p style={{ color: "#475569" }}>
              Book appointments, predict conditions, and manage your health.
            </p>

            <button
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "15px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => navigate("/patient/login")}
            >
              Login
            </button>

            <button
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                background: "#e2e8f0",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => navigate("/patient/register")}
            >
              Register
            </button>
          </div>

          {/* DOCTOR CARD */}
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            width: "280px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#16a34a" }}>Doctor</h3>
            <p style={{ color: "#475569" }}>
              Manage patients, appointments, and availability easily.
            </p>

            <button
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "15px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => navigate("/doctor/login")}
            >
              Login
            </button>

            <button
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                background: "#e2e8f0",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => navigate("/doctor/register")}
            >
              Register
            </button>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: "center",
        padding: "15px",
        background: "white",
        fontSize: "13px",
        color: "#64748b",
        marginTop: "auto"
      }}>
        © 2026 MediCo
      </div>

    </div>
  );
}

export default LandingPage;