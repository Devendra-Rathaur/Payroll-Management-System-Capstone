import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function PayrollManagementPage() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newRun, setNewRun] = useState({ year: "", month: "" });
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    fetchRuns();
  }, []);

  async function fetchRuns() {
    try {
      setLoading(true);
      const res = await api.get("/payroll/payroll-runs");
      setRuns(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load payroll runs");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRun(e) {
    e.preventDefault();
    try {
      await api.post(`/payroll/runs`, null, {
        params: { year: newRun.year, month: newRun.month },
      });
      alert("Payroll run created");
      setNewRun({ year: "", month: "" });
      fetchRuns();
    } catch (err) {
      console.error(err);
      alert("Failed to create payroll run");
    }
  }

  async function handleProcess(id) {
    try {
      await api.post(`/payroll/runs/${id}/process`);
      alert("Payroll run processed");
      fetchRuns();
    } catch (err) {
      console.error(err);
      alert("Failed to process payroll run");
    }
  }

  async function handleLock(id) {
    try {
      await api.post(`/payroll/runs/${id}/lock`);
      alert("Payroll run locked");
      fetchRuns();
    } catch (err) {
      console.error(err);
      alert("Failed to lock payroll run");
    }
  }

  async function viewItems(id) {
    try {
      setLoadingItems(true);
      setSelectedRunId(id);
      const res = await api.get(`/payroll/runs/${id}/items`);
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load payroll items");
    } finally {
      setLoadingItems(false);
    }
  }

  return (
    <div className="container mt-4">
      <h3>Payroll Management</h3>
      <hr />

      {/* Create Run Form */}
      <form className="row g-2 mb-4" onSubmit={handleCreateRun}>
        <div className="col-md-3">
          <input
            type="number"
            placeholder="Year"
            className="form-control"
            value={newRun.year}
            onChange={(e) => setNewRun({ ...newRun, year: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            placeholder="Month"
            className="form-control"
            value={newRun.month}
            onChange={(e) => setNewRun({ ...newRun, month: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Create Run</button>
        </div>
      </form>

      {/* Payroll Runs Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Year</th>
              <th>Month</th>
              <th>Locked</th>
              <th>Processed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id}>
                <td>{run.id}</td>
                <td>{run.year}</td>
                <td>{run.month}</td>
                <td>{run.locked ? "Yes" : "No"}</td>
                <td>
                  {run.processedAt
                    ? new Date(run.processedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-1"
                    onClick={() => viewItems(run.id)}
                  >
                    View Items
                  </button>
                  {!run.locked && (
                    <>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => handleProcess(run.id)}
                      >
                        Process
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleLock(run.id)}
                      >
                        Lock
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {runs.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No payroll runs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Payroll Items */}
      {selectedRunId && (
        <div className="mt-4">
          <h5>Payroll Items for Run #{selectedRunId}</h5>
          {loadingItems ? (
            <p>Loading items...</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Basic + HRA</th>
                  <th>Allowances</th>
                  <th>Total Deductions</th>
                  <th>Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.employeeName}</td>
                    <td>{item.basicSalary}</td>
                    <td>{item.allowances}</td>
                    <td>{item.deductions}</td>
                    <td>{item.netSalary}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No payroll items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
