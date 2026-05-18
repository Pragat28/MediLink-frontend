import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Landing Page */
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/admin/adminLogin";

/* Patient */
import PatientRegister from "./pages/patient/Register";
import PatientLogin from "./pages/patient/Login";
import Predict from "./pages/patient/Predict";
import SearchDoctors from "./pages/patient/SearchDoctors";
import MyAppointments from "./pages/patient/MyAppointments";
import DoctorProfile from "./pages/patient/DoctorProfile";
import PatientProfile from "./pages/patient/Profile";
import PatientVerifyOtp from "./pages/patient/VerifyOtp"; // ✅ ADD THIS

/* Doctor */
import DoctorRegister from "./pages/doctor/Register";
import DoctorLogin from "./pages/doctor/Login";
import DoctorProfilePanel from "./pages/doctor/Profile";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorCalendar from "./pages/doctor/Calendar";
import DoctorVerifyOtp from "./pages/doctor/VerifyOtp";

/* Layouts */
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";

/* Protected */
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyForgotOtp from "./pages/auth/VerifyForgotOtp";
import ResetPassword from "./pages/auth/ResetPassword";

/* Toast */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <Routes>

        {/* LANDING */}
        <Route path="/" element={<LandingPage />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PATIENT AUTH */}
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/login" element={<PatientLogin />} />

        {/* ✅ PATIENT OTP ROUTE */}
        <Route path="/patient/verify" element={<PatientVerifyOtp />} />

        {/* PATIENT PANEL */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute role="patient">
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SearchDoctors />} />
          <Route path="predict" element={<Predict />} />
          <Route path="search" element={<SearchDoctors />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="doctor/:id" element={<DoctorProfile />} />
        </Route>

        {/* DOCTOR AUTH */}
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />

        {/* ✅ FIXED DOCTOR OTP ROUTE */}
        <Route path="/doctor/verify" element={<DoctorVerifyOtp />} />

        {/* DOCTOR PANEL */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="calendar" element={<DoctorCalendar />} />
          <Route path="profile" element={<DoctorProfilePanel />} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-forgot-otp" element={<VerifyForgotOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
