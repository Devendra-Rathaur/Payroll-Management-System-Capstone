import React, { useState } from "react";
import api from "../api/axios";

export default function MyPayroll() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchPayroll(e) {
    e.preventDefault();
    if (!year || !month) {
      alert("Please select year and month");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPayroll(null);

      const res = await api.get(`/payroll/my/${year}/${month}`);
      setPayroll(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load payroll");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <h3>My Payroll</h3>
      <hr />

      {/* Payroll Search Form */}
      <form className="row g-2 mb-4" onSubmit={fetchPayroll}>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Search</button>
        </div>
      </form>

      {/* Loading / Error */}
      {loading && <p>Loading payroll...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Payroll Display */}
      {payroll && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {payroll.employee?.firstName} {payroll.employee?.lastName}
              </td>
              <td>{payroll.basicSalary}</td>
              <td>{payroll.allowances}</td>
              <td>{payroll.deductions}</td>
              <td>{payroll.netSalary}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
