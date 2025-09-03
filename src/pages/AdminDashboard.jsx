import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Admin Dashboard</h3>
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
            <Link className="list-group-item" to="/admin/employees">
              Employees
            </Link>
            {/* ✅ Changed from disabled span to active link */}
            <Link className="list-group-item" to="/admin/departments">
              Departments
            </Link>
            <Link className="list-group-item" to="/admin/payroll">
              Payroll Runs
            </Link>
            <Link className="list-group-item" to="/admin/reports">
              Reports
            </Link>
            <Link className="list-group-item" to="/admin/leave-approval">
              Leave Approvals
            </Link>
            <Link className="list-group-item" to="/admin/salary-management">
              Salary Management
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9">
          <div className="card p-4 shadow-sm">
            <h5>
              Welcome, {user?.role === "ROLE_ADMIN" ? "Admin" : user?.username}
            </h5>
            <p>
              From here you can manage employees, run payrolls, approve leaves,
              and view reports.
            </p>
            <hr />
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
