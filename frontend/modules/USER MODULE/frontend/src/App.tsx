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
import Home from "./pages/Home";

// Landing Pages
import FirstPage from "./pages/Landing pages/FirstPage";
import SecondPage from "./pages/Landing pages/SecondPage";
import BecomeInstructor from "./pages/Landing pages/BecomeInstructor";
import StudentTestimonials from "./pages/Landing pages/StudentTestimonials";
import LatestNews from "./pages/Landing pages/LatestNews";
import Footer from "./pages/Landing pages/Footer";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Role Selection */}
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/confirm-role" element={<ConfirmRole />} />
        <Route path="/student-details" element={<StudentDetails />} />
        <Route path="/parent-verification" element={<ParentVerification />} />
        <Route path="/teacher-verification" element={<TeacherVerification />} />

        {/* Landing Pages */}
        <Route path="/first-page" element={<FirstPage />} />
        <Route path="/second-page" element={<SecondPage />} />
        <Route path="/become-instructor" element={<BecomeInstructor />} />
        <Route
          path="/student-testimonials"
          element={<StudentTestimonials />}
        />
        <Route path="/latest-news" element={<LatestNews />} />
        <Route path="/footer" element={<Footer />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;