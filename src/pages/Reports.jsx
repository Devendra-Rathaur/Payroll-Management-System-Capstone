// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Reports() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [summary, setSummary] = useState(null);
  const [deptCosts, setDeptCosts] = useState([]);
  const [salarySummary, setSalarySummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, [year, month]);

  async function fetchReports() {
    setLoading(true);
    setError("");
    try {
      // ✅ Payroll Summary
      const summaryRes = await api.get("/reports/payroll-summary", {
        params: { year, month },
      });

      // ✅ Department Cost
      const deptRes = await api.get("/reports/department-cost", {
        params: { year, month },
      });

      // ✅ Salary Summary (all runs)
      const salaryRes = await api.get("/reports/salary-summary");

      setSummary(summaryRes.data);
      setDeptCosts(deptRes.data);
      setSalarySummary(salaryRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <h3>Reports</h3>
      <hr />

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            min="1"
            max="12"
            className="form-control"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary" onClick={fetchReports}>
            Load Reports
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {/* Payroll Summary */}
          {summary && (
            <div className="mb-4">
              <h5>Payroll Summary</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Year</th>
                    <td>{summary.year}</td>
                  </tr>
                  <tr>
                    <th>Month</th>
                    <td>{summary.month}</td>
                  </tr>
                  <tr>
                    <th>Total Gross Salary</th>
                    <td>{summary.totalGross}</td>
                  </tr>
                  <tr>
                    <th>Total Net Salary</th>
                    <td>{summary.totalNet}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Department Costs */}
          {deptCosts.length > 0 && (
            <div className="mb-4">
              <h5>Department Cost</h5>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {deptCosts.map((d, i) => (
                    <tr key={i}>
                      <td>{d.department}</td>
                      <td>{d.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Salary Summary for All Runs */}
          {salarySummary.length > 0 && (
            <div>
              <h5>Salary Summary (All Payroll Runs)</h5>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Total Employees</th>
                    <th>Total Gross</th>
                    <th>Total Net</th>
                  </tr>
                </thead>
                <tbody>
                  {salarySummary.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.year}</td>
                      <td>{row.month}</td>
                      <td>{row.totalEmployees}</td>
                      <td>{row.totalGross}</td>
                      <td>{row.totalNet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
