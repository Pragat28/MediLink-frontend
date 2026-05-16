import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const patientToken = localStorage.getItem("patientToken");
  const doctorToken = localStorage.getItem("doctorToken");

  // ✅ Decide token based on role
  let token = null;

  if (role === "patient") {
    token = patientToken;
  } else if (role === "doctor") {
    token = doctorToken;
  }

  // ❌ No token → block immediately (NO FLASH)
  if (!token) {
    return <Navigate to={`/${role}/login`} replace />;
  }

  return children;
};

export default ProtectedRoute;