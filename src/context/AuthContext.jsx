import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const login = (token, role) => {

    // Save general token
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // Save role‑specific tokens (useful for APIs)
    if (role === "patient") {
      localStorage.setItem("patientToken", token);
    }

    if (role === "doctor") {
      localStorage.setItem("doctorToken", token);
    }

    setToken(token);
    setRole(role);
  };

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("patientToken");
    localStorage.removeItem("doctorToken");

    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};