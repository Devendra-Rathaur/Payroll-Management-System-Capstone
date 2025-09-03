// src/pages/EmployeeDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.role === "ROLE_EMPLOYEE") {
      api
        .get("/users/me")
        .then((res) => setProfile(res.data))
        .catch(() => {});
    }
  }, [user]);

  // Decide the display name
  const displayName =
    profile && (profile.firstName || profile.lastName)
      ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
      : user?.username;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Employee Dashboard</h3>
        <div>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="list-group">
            <Link className="list-group-item" to="/employee/profile">
              My Profile
            </Link>
            <Link className="list-group-item" to="/employee/leave">
              Leave Requests
            </Link>
            <Link className="list-group-item" to="/employee/salary-slip">
              Salary Slips
            </Link>
            <Link
              className="list-group-item list-group-item-action"
              to="/employee/payroll"
            >
              My Payroll
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9">
          <div className="card p-4 shadow-sm">
            <h5>Welcome, {displayName}</h5>
            <p>
              From here you can view your profile, apply for leave, and check your
              salary slips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
