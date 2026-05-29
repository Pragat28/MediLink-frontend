import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Landing Page */
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/admin/adminLogin";

/* Patient */
import PatientRegister from "./pages/patient/Register";
import PatientLogin from "./pages/patient/Login";
import SearchDoctors from "./pages/patient/SearchDoctors";
import MyAppointments from "./pages/patient/MyAppointments";
import DoctorProfile from "./pages/patient/DoctorProfile";
import PatientProfile from "./pages/patient/Profile";

/* Doctor */
import DoctorRegister from "./pages/doctor/Register";
import DoctorLogin from "./pages/doctor/Login";
import DoctorProfilePanel from "./pages/doctor/Profile";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorCalendar from "./pages/doctor/Calendar";

/* Layouts */
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";

/* Protected */
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";



/* Toast */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
          <Route path="search" element={<SearchDoctors />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="doctor/:id" element={<DoctorProfile />} />
        </Route>

        {/* DOCTOR AUTH */}
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
