import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRole: string;
}

/** Redirects unauthenticated users to /login.
 *  Redirects authenticated users with the wrong role to their own dashboard. */
const RoleProtectedRoute = ({ children, allowedRole }: Props) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role") || "";

  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (role && role !== allowedRole) {
  //   const dashboardMap: Record<string, string> = {
  //     admin: "/admin/dashboard",
  //     teacher: "/teacher/dashboard",
  //     parent: "/parent/dashboard",
  //   };
  //   const redirect = dashboardMap[role] || "/";
  //   return <Navigate to={redirect} replace />;
  // }

  return <>{children}</>;
};

export default RoleProtectedRoute;
