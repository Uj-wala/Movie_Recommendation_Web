import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/TeacherSidebar";

export default function TeacherLayout() {
  const location = useLocation();
  const currentTab = location.pathname.split("/").filter(Boolean)[1] || "dashboard";
  const [highlightedTab, setHighlightedTab] = useState(currentTab);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-0 left-0 h-screen w-[278px] z-40">
        <Sidebar activeTab={highlightedTab} setActiveTab={setHighlightedTab} />
      </aside>

      <main className="ml-[278px] w-full">
        <Outlet />
      </main>
    </div>
  );
}
