import { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import UserManagement from "./pages/UserManagement/UserManagement";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import RolesPermissions from "./pages/RolesPermissions";
import ManageProfile from "./pages/ManageProfile/ManageProfile";

/** Wraps all /admin/* routes.
 *  Reads authentication state from localStorage set by Login.tsx. */
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated] = useState(() => {
    const role = localStorage.getItem("user_role");
    return (
      localStorage.getItem("isAuthenticated") === "true" &&
      (role === "admin" || localStorage.getItem("access_token") === "admin-local-session")
    );
  });

  const [userEmail] = useState(
    () => localStorage.getItem("userEmail") || ""
  );
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Derive active tab from the URL segment after /admin/
  const segments = location.pathname.split("/").filter(Boolean);
  const activeTab = segments[1] || "dashboard"; // e.g. /admin/users → "users"

  const setActiveTab = (tab: string) => {
    navigate(`/admin/${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    // navigate("/login");
  };

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // Render the correct page component based on activeTab
  const renderPage = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement setActiveTab={setActiveTab} />;
      case "roles":
        return <RolesPermissions />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      case "profile":
        return (
          <ManageProfile
            setActiveTab={setActiveTab}
            userEmail={userEmail}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleLogout={handleLogout}
      userEmail={userEmail}
      profileImage={profileImage}
      setProfileImage={setProfileImage}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "Poppins",
            fontWeight: 500,
            color: "#0F172A",
            padding: "16px",
            borderRadius: "8px",
          },
          success: {
            iconTheme: {
              primary: "#238B45",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
      {/* Render via local switch OR let nested <Outlet> handle sub-routes */}
      {renderPage()}
      <Outlet />
    </Layout>
  );
}
