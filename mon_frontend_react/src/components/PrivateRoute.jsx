import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getTabId } from "../utils/tabId";

const PrivateRoute = ({ allowedRoles = [] }) => {
  const tabId = getTabId();
  const token = sessionStorage.getItem(`token_${tabId}`);
  const userData = sessionStorage.getItem(`user_${tabId}`);

  if (!token || !userData) return <Navigate to="/login" replace />;

  let user;
  try {
    user = JSON.parse(userData);
  } catch {
    return <Navigate to="/login" replace />;
  }

  const role = user.nomrole?.toLowerCase();
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    // Redirection vers le dashboard correct si rôle différent
    switch (role) {
      case "apprenant":
        return <Navigate to="/apprenant/dashboard" replace />;
      case "formateur":
        return <Navigate to="/formateur/dashboard" replace />;
      case "administrateur":
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
