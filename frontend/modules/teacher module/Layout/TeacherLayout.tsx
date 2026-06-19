import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/TeacherSidebar";
import { Toaster } from "react-hot-toast";

export default function TeacherLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-0 left-0 h-screen w-[278px] z-40">
        <Sidebar />
      </aside>

      <main className="ml-[278px] w-full">
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}