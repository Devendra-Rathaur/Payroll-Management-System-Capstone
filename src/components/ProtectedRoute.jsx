import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Usage:
 *  <ProtectedRoute roles={['ROLE_ADMIN']}>...</ProtectedRoute>
 *  or
 *  <ProtectedRoute role="ROLE_EMPLOYEE">...</ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles, role }) {
  const token = localStorage.getItem("token");
  const myRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (Array.isArray(roles) && roles.length > 0) {
    if (!myRole || !roles.includes(myRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  } else if (role) {
    if (!myRole || myRole !== role) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
