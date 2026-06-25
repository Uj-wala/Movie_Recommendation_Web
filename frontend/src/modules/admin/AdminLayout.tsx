import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import UserManagement from "./pages/UserManagement/UserManagement";

const HIGHLIGHT_ONLY_TABS = new Set(["dashboard", "roles", "reports", "settings"]);

/** Wraps all /admin/* routes.
 *  Reads authentication state from localStorage set by Login.tsx. */
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userEmail] = useState(
    () => localStorage.getItem("userEmail") || ""
  );

  // Derive active tab from the URL segment after /admin/
  const segments = location.pathname.split("/").filter(Boolean);
  const activeTab = segments[1] || "users"; // e.g. /admin/users -> "users"

  const [highlightedTab, setHighlightedTab] = useState(activeTab);

  useEffect(() => {
    const syncTab = window.setTimeout(() => setHighlightedTab(activeTab), 0);

    return () => window.clearTimeout(syncTab);
  }, [activeTab]);

  const setActiveTab = (tab: string) => {
    setHighlightedTab(tab);
    if (HIGHLIGHT_ONLY_TABS.has(tab)) return;
    navigate(`/admin/${tab}`);
  };

  // Dashboard/roles/reports/settings are highlight-only; keep the current page visible.
  const renderPage = () => {
    return <UserManagement setActiveTab={setActiveTab} />;
  };

  return (
    <Layout
      activeTab={highlightedTab}
      setActiveTab={setActiveTab}
      userEmail={userEmail}
    >
      {renderPage()}
      <Outlet />
    </Layout>
  );
}
