import { useNavigate } from "react-router-dom";
import useBackRedirect from "../hooks/useBackRedirect";

function LandingPage() {
  useBackRedirect(null, true);

  const navigate = useNavigate();

  return (
    <div style={{
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>

      {/* HEADER */}
      <div style={{
        padding: "16px 30px",
        textAlign: "center",
        background: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)"
      }}>
        <h1 style={{ margin: 0, color: "#1e3a8a", fontSize: "26px" }}>MediCo</h1>
        <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "13px" }}>
          Smart Healthcare Appointment & Prediction System
        </p>
      </div>

      {/* HERO */}
      <div style={{
        flex: 1,
        textAlign: "center",
        padding: "20px 20px 10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <h2 style={{ fontSize: "26px", color: "#0f172a", margin: "0 0 8px" }}>
          Your Health, Simplified
        </h2>

        <p style={{
          maxWidth: "520px",
          margin: "0 auto 24px",
          color: "#475569",
          lineHeight: "1.5",
          fontSize: "14px"
        }}>
          Book appointments, consult doctors, and get AI-powered health insights —
          all in one place.
        </p>

        {/* CARDS */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap",
          alignItems: "flex-start"
        }}>

          {/* PATIENT CARD */}
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            width: "260px",
            boxShadow: "0 8px 24px rgba(37,99,235,0.12)",
            boxSizing: "border-box",
            border: "1.5px solid #bfdbfe"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "12px"
            }}>
              <h3 style={{ color: "white", margin: 0, fontSize: "18px" }}>🧑‍⚕️ Patient</h3>
            </div>
            <p style={{ color: "#475569", fontSize: "13px", margin: "0 0 14px" }}>
              Book appointments, predict conditions, and manage your health.
            </p>

            <button
              style={{
                width: "100%",
                padding: "9px",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px"
              }}
              onClick={() => navigate("/patient/login")}
            >
              Login
            </button>

            <button
              style={{
                width: "100%",
                padding: "9px",
                marginTop: "8px",
                background: "#eff6ff",
                color: "#2563eb",
                border: "1.5px solid #bfdbfe",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px"
              }}
              onClick={() => navigate("/patient/register")}
            >
              Register
            </button>
          </div>

          {/* DOCTOR CARD */}
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            width: "260px",
            boxShadow: "0 8px 24px rgba(22,163,74,0.12)",
            boxSizing: "border-box",
            border: "1.5px solid #bbf7d0"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "12px"
            }}>
              <h3 style={{ color: "white", margin: 0, fontSize: "18px" }}>👨‍⚕️ Doctor</h3>
            </div>
            <p style={{ color: "#475569", fontSize: "13px", margin: "0 0 14px" }}>
              Manage patients, appointments, and availability easily.
            </p>

            <button
              style={{
                width: "100%",
                padding: "9px",
                background: "linear-gradient(135deg, #16a34a, #22c55e)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px"
              }}
              onClick={() => navigate("/doctor/login")}
            >
              Login
            </button>

            <button
              style={{
                width: "100%",
                padding: "9px",
                marginTop: "8px",
                background: "#f0fdf4",
                color: "#16a34a",
                border: "1.5px solid #bbf7d0",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px"
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
        padding: "10px",
        background: "white",
        fontSize: "12px",
        color: "#94a3b8"
      }}>
        © 2026 MediCo — Smart Healthcare
      </div>

    </div>
  );
}

export default LandingPage;
