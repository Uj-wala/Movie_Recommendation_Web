import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";

// ── Auth / Landing pages (User Module) ──────────────────────────────────────
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Register = lazy(() => import("./pages/Register"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyAccount = lazy(() => import("./pages/VerifyAccount"));
const SelectRole = lazy(() => import("./pages/SelectRole"));
const ConfirmRole = lazy(() => import("./pages/ConfirmRole"));
const StudentDetails = lazy(() => import("./pages/StudentDetails"));
const TeacherVerification = lazy(() => import("./pages/TeacherVerification"));
const ParentVerification = lazy(() => import("./pages/ParentVerification"));
const Home = lazy(() => import("./modules/landing/Home"));
const SocialAuthCallback = lazy(() => import("./pages/SocialAuthCallback"));

// ── Landing section pages ───────────────────────────────────────────────────
const FirstPage = lazy(() => import("./modules/landing/FirstPage"));
const SecondPage = lazy(() => import("./modules/landing/SecondPage"));
const BecomeInstructor = lazy(() => import("./modules/landing/BecomeInstructor"));
const StudentTestimonials = lazy(() => import("./modules/landing/StudentTestimonials"));
const LatestNews = lazy(() => import("./modules/landing/LatestNews"));
const Footer = lazy(() => import("./modules/landing/Footer"));

// ── Teacher module ──────────────────────────────────────────────────────────
const TeacherLayout = lazy(() => import("./modules/teacher/Layout/TeacherLayout"));
const TeacherDashboard = lazy(() => import("./modules/teacher/Dashboard/Dashboard"));
const MyCourses = lazy(() => import("./modules/teacher/courses/MyCourses"));
const Students = lazy(() => import("./modules/teacher/students/Students"));
const Assignments = lazy(() => import("./modules/teacher/assignments/Assignments"));
const TeacherSettings = lazy(() => import("./modules/teacher/settings/Settings"));
const UpdateProfile = lazy(() => import("./modules/teacher/UpdateProfile/UpdateProfile"));

// ── Parent module ───────────────────────────────────────────────────────────
const ParentDashboard = lazy(() => import("./modules/parent/ParentDashboard"));
const ParentProfile = lazy(() => import("./modules/parent/ParentProfile"));

// ── Admin module ────────────────────────────────────────────────────────────
const AdminLayout = lazy(() => import("./modules/admin/AdminLayout"));

// ── Route guards ─────────────────────────────────────────────────────────────
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        containerStyle={{
          top: 76,
          right: 32,
        }}
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            width: "min(360px, calc(100vw - 48px))",
            minHeight: 64,
            padding: "16px 18px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.5,
          },
        }}
      />
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <Routes>

        {/* ── Home / Landing ────────────────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/first-page" element={<FirstPage />} />
        <Route path="/second-page" element={<SecondPage />} />
        <Route path="/become-instructor" element={<BecomeInstructor />} />
        <Route path="/student-testimonials" element={<StudentTestimonials />} />
        <Route path="/latest-news" element={<LatestNews />} />
        <Route path="/footer" element={<Footer />} />

        {/* ── Auth ──────────────────────────────────────────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/social/callback" element={<SocialAuthCallback />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ── Role selection (post-register) ────────────────────────────── */}
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/confirm-role" element={<ConfirmRole />} />
        <Route path="/student-details" element={<StudentDetails />} />
        <Route path="/parent-verification" element={<ParentVerification />} />
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
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="students" element={<Students />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="settings" element={<TeacherSettings />} />
          <Route path="profile" element={<UpdateProfile />} />
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
      </Suspense>
    </Router>
  );
}

/** Reads user_role from localStorage and redirects to the correct dashboard. */
function RoleDashboardRedirect() {
  const role = localStorage.getItem("user_role");
  const token = localStorage.getItem("access_token");

  if (!token) return <Navigate to="/login" replace />;

  switch (role) {
    case "admin": return <Navigate to="/admin/users" replace />;
    case "teacher": return <Navigate to="/teacher/dashboard" replace />;
    case "parent": return <Navigate to="/parent/dashboard" replace />;
    default: return <Navigate to="/" replace />;
  }
}

export default App;
