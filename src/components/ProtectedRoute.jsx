import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token =
    role === "patient"
      ? localStorage.getItem("patientToken") || localStorage.getItem("token")
      : localStorage.getItem("doctorToken");

  if (!token) {
    return <Navigate to={`/${role}/login`} replace />;
  }

  return children;
};

export default ProtectedRoute;