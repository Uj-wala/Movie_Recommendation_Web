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
import TeacherLayout from "./Layout/TeacherLayout";
import MyCourses from "./modules/teacher/courses/MyCourses";
import UpdateProfile from "./modules/teacher/UpdateProfile/UpdateProfile";
import MyStudents from "./modules/teacher/students/Students";
import MySettings from "./modules/teacher/settings/Settings";
import TeacherDashboard from "./modules/teacher/Dashboard/Dashboard";
import Assignments from "./modules/teacher/assignments/Assignments";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/profile-update" element={<UpdateProfile />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<MyCourses />} />
          <Route path="/teacher/students" element={<MyStudents />} />
          <Route path="/teacher/assignments" element={<Assignments />} />
          <Route path="/teacher/settings" element={<MySettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;