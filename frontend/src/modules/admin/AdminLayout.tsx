import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import UserManagement from "./pages/UserManagement/UserManagement";
import ManageProfile from "./pages/ManageProfile/ManageProfile";

/** Wraps all /admin/* routes.
 *  Reads authentication state from localStorage set by Login.tsx. */
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userEmail] = useState(
    () => localStorage.getItem("userEmail") || ""
  );
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Derive active tab from the URL segment after /admin/
  const segments = location.pathname.split("/").filter(Boolean);
  const activeTab = segments[1] || "dashboard"; // e.g. /admin/users → "users"

  const [highlightedTab, setHighlightedTab] = useState(activeTab);
  const highlightOnlyTabs = new Set(["dashboard", "roles", "reports", "settings"]);

  useEffect(() => {
    setHighlightedTab(activeTab);
  }, [activeTab]);

  const setActiveTab = (tab: string) => {
    setHighlightedTab(tab);

    if (highlightOnlyTabs.has(tab)) {
      return;
    }

    navigate(`/admin/${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("full_name");
    localStorage.removeItem("name");
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
      case "profile":
        return (
          <ManageProfile
            setActiveTab={setActiveTab}
            userEmail={userEmail}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
        );
      case "users":
      default:
        return <UserManagement setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout
      activeTab={highlightedTab}
      setActiveTab={setActiveTab}
      handleLogout={handleLogout}
      userEmail={userEmail}
      profileImage={profileImage}
      setProfileImage={setProfileImage}
    >
      {/* Render via local switch OR let nested <Outlet> handle sub-routes */}
      {renderPage()}
      <Outlet />
    </Layout>
  );
}
