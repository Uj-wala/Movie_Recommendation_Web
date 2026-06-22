import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ── Auth / Landing pages (User Module) ──────────────────────────────────────
import Login             from "./pages/Login";
import ForgotPassword    from "./pages/ForgotPassword";
import Register          from "./pages/Register";
import VerifyOTP         from "./pages/VerifyOTP";
import ResetPassword     from "./pages/ResetPassword";
import VerifyAccount     from "./pages/VerifyAccount";
import SelectRole        from "./pages/SelectRole";
import ConfirmRole       from "./pages/ConfirmRole";
import StudentDetails    from "./pages/StudentDetails";
import TeacherVerification from "./pages/TeacherVerification";
import ParentVerification  from "./pages/ParentVerification";
import Home              from "./modules/landing/Home";
import SocialAuthCallback from "./pages/SocialAuthCallback";

// ── Landing section pages ───────────────────────────────────────────────────
import FirstPage           from "./modules/landing/FirstPage";
import SecondPage          from "./modules/landing/SecondPage";
import BecomeInstructor    from "./modules/landing/BecomeInstructor";
import StudentTestimonials from "./modules/landing/StudentTestimonials";
import LatestNews          from "./modules/landing/LatestNews";
import Footer              from "./modules/landing/Footer";

// ── Teacher module ──────────────────────────────────────────────────────────
import TeacherLayout    from "./modules/teacher/Layout/TeacherLayout";
import TeacherDashboard from "./modules/teacher/Dashboard/Dashboard";
import MyCourses        from "./modules/teacher/courses/MyCourses";
import Students         from "./modules/teacher/students/Students";
import Assignments      from "./modules/teacher/assignments/Assignments";
import TeacherSettings  from "./modules/teacher/settings/Settings";
import UpdateProfile    from "./modules/teacher/UpdateProfile/UpdateProfile";

// ── Parent module ───────────────────────────────────────────────────────────
import ParentDashboard from "./modules/parent/ParentDashboard";
import ParentProfile   from "./modules/parent/ParentProfile";

// ── Admin module ────────────────────────────────────────────────────────────
import AdminLayout from "./modules/admin/AdminLayout";

// ── Route guards ─────────────────────────────────────────────────────────────
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import ProtectedRoute     from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>

        {/* ── Home / Landing ────────────────────────────────────────────── */}
        <Route path="/"                    element={<Home />} />
        <Route path="/first-page"          element={<FirstPage />} />
        <Route path="/second-page"         element={<SecondPage />} />
        <Route path="/become-instructor"   element={<BecomeInstructor />} />
        <Route path="/student-testimonials" element={<StudentTestimonials />} />
        <Route path="/latest-news"         element={<LatestNews />} />
        <Route path="/footer"              element={<Footer />} />

        {/* ── Auth ──────────────────────────────────────────────────────── */}
        <Route path="/login"              element={<Login />} />
        <Route path="/auth/social/callback" element={<SocialAuthCallback />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/forgot-password"    element={<ForgotPassword />} />
        <Route path="/verify-otp"         element={<VerifyOTP />} />
        <Route path="/verify-account"     element={<VerifyAccount />} />
        <Route path="/reset-password"     element={<ResetPassword />} />

        {/* ── Role selection (post-register) ────────────────────────────── */}
        <Route path="/select-role"          element={<SelectRole />} />
        <Route path="/confirm-role"         element={<ConfirmRole />} />
        <Route path="/student-details"      element={<StudentDetails />} />
        <Route path="/parent-verification"  element={<ParentVerification />} />
        <Route path="/teacher-verification" element={<TeacherVerification />} />

        {/* ── Admin module (/admin/*) ────────────────────────────────────── */}
        <Route
          path="/admin/*"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminLayout />
            </RoleProtectedRoute>
          }
        />

        {/* ── Teacher module (/teacher/*) ────────────────────────────────── */}
        <Route
          path="/teacher"
          element={
            <RoleProtectedRoute allowedRole="teacher">
              <TeacherLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<TeacherDashboard />} />
          <Route path="courses"      element={<MyCourses />} />
          <Route path="students"     element={<Students />} />
          <Route path="assignments"  element={<Assignments />} />
          <Route path="settings"     element={<TeacherSettings />} />
          <Route path="profile"      element={<UpdateProfile />} />
          <Route path="profile-update" element={<UpdateProfile />} />
        </Route>

        {/* ── Parent module (/parent/*) ─────────────────────────────────── */}
        <Route
          path="/parent"
          element={
            <RoleProtectedRoute allowedRole="parent">
              <ParentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route path="/parent/dashboard" element={
          <RoleProtectedRoute allowedRole="parent">
            <ParentDashboard />
          </RoleProtectedRoute>
        } />
        <Route path="/parent/profile" element={
          <RoleProtectedRoute allowedRole="parent">
            <ParentProfile />
          </RoleProtectedRoute>
        } />

        {/* ── Legacy parent paths (from ParentDashboard navigate() calls) ── */}
        <Route path="/ParentDashboard" element={
          <ProtectedRoute>
            <Navigate to="/parent/dashboard" replace />
          </ProtectedRoute>
        } />
        <Route path="/parentprofile" element={
          <ProtectedRoute>
            <Navigate to="/parent/profile" replace />
          </ProtectedRoute>
        } />

        {/* ── Generic /dashboard redirect based on role ─────────────────── */}
        <Route path="/dashboard" element={<RoleDashboardRedirect />} />

        {/* ── 404 fallback ──────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

/** Reads user_role from localStorage and redirects to the correct dashboard. */
function RoleDashboardRedirect() {
  const role = localStorage.getItem("user_role");
  const token = localStorage.getItem("access_token");

  if (!token) return <Navigate to="/login" replace />;

  switch (role) {
    case "admin":   return <Navigate to="/admin/dashboard"  replace />;
    case "teacher": return <Navigate to="/teacher/dashboard" replace />;
    case "parent":  return <Navigate to="/parent/dashboard"  replace />;
    default:        return <Navigate to="/"                  replace />;
  }
}

export default App;
