import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import VerifyAccount from "./pages/VerifyAccount";
import SelectRole from "./pages/SelectRole";
import ConfirmRole from "./pages/ConfirmRole";
import StudentDetails from "./pages/StudentDetails";
import TeacherVerification from "./pages/TeacherVerification";
import ParentVerification from "./pages/ParentVerification";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/confirm-role" element={<ConfirmRole />} />
        <Route path="/student-details" element={<StudentDetails />} />
        <Route path="/parent-verification" element={<ParentVerification />} />
        <Route path="/teacher-verification" element={<TeacherVerification />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;