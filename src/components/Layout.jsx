import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation(); // to check current path
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  // If we are on login page, just render the Outlet (no navbar)
  if (location.pathname === "/login") {
    return <Outlet />;
  }

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Payroll</span>
          <div className="d-flex align-items-center gap-3">
            {role === "ROLE_ADMIN" && (
              <>
                <Link className="nav-link" to="/admin/dashboard">Admin</Link>
                <Link className="nav-link" to="/admin/employees">Employees</Link>
                <Link className="nav-link" to="/admin/payroll">Payroll</Link>
                <Link className="nav-link" to="/admin/reports">Reports</Link>
              </>
            )}
            {role === "ROLE_EMPLOYEE" && (
              <>
                <Link className="nav-link" to="/employee/dashboard">Dashboard</Link>
                <Link className="nav-link" to="/employee/profile">Profile</Link>
                <Link className="nav-link" to="/employee/leave">Leave</Link>
              </>
            )}
            <span className="me-2">Hi, {username}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
