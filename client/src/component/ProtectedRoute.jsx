import { Navigate, useLocation } from "react-router-dom";

const getRoleHome = (role) => {
  if (role === "admin") return "/admin";
  return "/user"; // user, recruiter, hiringmanager all use /user
};

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const home = getRoleHome(user.role);

  if (user.role === "admin") {
    return location.pathname.startsWith("/admin")
      ? children
      : <Navigate to="/admin" replace />;
  }

  // user, recruiter, hiringmanager — all routed through /user
  return location.pathname.startsWith("/user")
    ? children
    : <Navigate to="/user" replace />;
};

export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  return token ? (
    <Navigate
      to={getRoleHome(user?.role)}
      replace
      state={{ from: location }}
    />
  ) : (
    children
  );
};