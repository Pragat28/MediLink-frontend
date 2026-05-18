import { Link, Outlet, useNavigate } from "react-router-dom";

function DoctorLayout() {
  const navigate = useNavigate();

  /* SAFE LOCALSTORAGE PARSE */
  let doctorData = null;

  try {
    const storedData = localStorage.getItem("doctorData");
    doctorData = storedData ? JSON.parse(storedData) : null;
  } catch (err) {
    doctorData = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorData");
    navigate("/doctor/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: "220px",
          background: "#1e293b",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3>Doctor Panel</h3>
        <hr />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link to="/doctor/appointments" style={{ color: "white" }}>Appointments</Link>
          <Link to="/doctor/calendar" style={{ color: "white" }}>Calendar</Link>
          <Link to="/doctor/profile" style={{ color: "white" }}>Profile</Link>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "8px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        <div
          style={{
            height: "60px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 20px",
            background: "#f8fafc",
            gap: "10px"
          }}
        >
          <span>{doctorData?.name || "Doctor"}</span>

          <img
            src={
              doctorData?.photo
                ? `https://medilink-j44r.onrender.com${doctorData.photo}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Doctor"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
        </div>

        {/* PAGE CONTENT */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            background: "#f1f5f9"
          }}
        >
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default DoctorLayout;