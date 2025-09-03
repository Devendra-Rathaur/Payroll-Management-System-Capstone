import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import SalaryManagement from "./pages/SalaryManagement";

import EmployeeManagement from "./pages/EmployeeManagement.jsx";
import PayrollManagement from "./pages/PayrollManagement.jsx";
import Reports from "./pages/Reports.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LeaveRequest from "./pages/LeaveRequest.jsx";
import SalarySlip from "./pages/SalarySlip.jsx";
import MyPayroll from "./pages/MyPayroll.jsx";
import LeaveApproval from "./pages/LeaveApproval.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ New imports for dashboard home pages
import AdminHome from "./pages/AdminHome.jsx";
import EmployeeHome from "./pages/EmployeeHome.jsx";

// ✅ Import DepartmentManagement
import DepartmentManagement from "./pages/DepartmentManagement.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Dashboard with nested routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            {/* Default landing for admin */}
            <Route index element={<AdminHome />} />
          </Route>

          {/* Admin other pages */}
          <Route
            path="/admin/salary-management"
            element={<SalaryManagement />}
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <EmployeeManagement />
              </ProtectedRoute>
            }
          />
          {/* ✅ New route for Department Management */}
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <DepartmentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <PayrollManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leave-approval"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <LeaveApproval />
              </ProtectedRoute>
            }
          />

          {/* Employee Dashboard with nested routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute roles={["ROLE_EMPLOYEE"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          >
            {/* Default landing for employee */}
            <Route index element={<EmployeeHome />} />
          </Route>

          {/* Employee other pages */}
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute roles={["ROLE_EMPLOYEE"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leave"
            element={
              <ProtectedRoute roles={["ROLE_EMPLOYEE"]}>
                <LeaveRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/salary-slip"
            element={
              <ProtectedRoute roles={["ROLE_EMPLOYEE"]}>
                <SalarySlip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/payroll"
            element={
              <ProtectedRoute roles={["ROLE_EMPLOYEE"]}>
                <MyPayroll />
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route index element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Route>
      </Routes>

      {/* ✅ Toast notifications container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}
