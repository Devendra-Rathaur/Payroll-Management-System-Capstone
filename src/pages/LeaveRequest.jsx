import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function LeaveRequestPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newLeave, setNewLeave] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [refresh, setRefresh] = useState(false);

  // Fetch my leaves
  useEffect(() => {
    fetchLeaves();
  }, [refresh]);

  async function fetchLeaves() {
    try {
      setLoading(true);
      const role = localStorage.getItem("role");
      const endpoint = role === "ROLE_EMPLOYEE" ? "/leaves/my" : "/leaves";
      const res = await api.get(endpoint);
      setLeaves(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to load leaves", err);
      setError("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  }

  // Apply for leave
  async function handleApply(e) {
    e.preventDefault();
    try {
      await api.post("/leaves", {
        fromDate: newLeave.startDate, // Match backend
        toDate: newLeave.endDate,     // Match backend
        reason: newLeave.reason,
        type: "CASUAL" // Or replace with a selected type
      });
      alert("Leave request submitted successfully");
      setNewLeave({ startDate: "", endDate: "", reason: "" });
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error applying for leave", err);
      alert(err?.response?.data?.message || "Failed to apply for leave");
    }
  }

  return (
    <div className="container mt-4">
      <h3>Leave Management</h3>
      <hr />

      {/* Apply Leave Form */}
      <form className="mb-4" onSubmit={handleApply}>
        <h5>Apply for Leave</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={newLeave.startDate}
              onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={newLeave.endDate}
              onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Reason"
              value={newLeave.reason}
              onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100">Apply</button>
          </div>
        </div>
      </form>

      {/* Leaves Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.fromDate}</td>
                <td>{leave.toDate}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
