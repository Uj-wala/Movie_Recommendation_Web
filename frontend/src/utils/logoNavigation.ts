const ROLE_DASHBOARD_ROUTES: Record<string, string> = {
  admin: "/admin/users",
  parent: "/parent/dashboard",
  teacher: "/teacher/dashboard",
};

export const getLogoDestination = () => {
  const token = localStorage.getItem("access_token");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const role = (localStorage.getItem("user_role") || "").toLowerCase();

  if ((token || isAuthenticated) && role && ROLE_DASHBOARD_ROUTES[role]) {
    return ROLE_DASHBOARD_ROUTES[role];
  }

  return "/";
};

export const shouldScrollLogoDestinationToTop = (destination: string) => destination === "/";
