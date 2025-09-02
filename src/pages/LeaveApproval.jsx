import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function LeaveApproval() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  async function fetchLeaves() {
    try {
      setLoading(true);
      const res = await api.get("/leaves");
      setLeaves(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to load leaves", err);
      setError("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(leaveId, status) {
    try {
      await api.post(`/leaves/${leaveId}/status?status=${status}`);
      toast.success(`Leave ${status.toLowerCase()} successfully`);
      fetchLeaves(); // refresh after update
    } catch (err) {
      console.error("Error updating leave status", err);
      toast.error("Failed to update leave status");
    }
  }

  const pendingLeaves = leaves.filter((leave) => leave.status === "PENDING");

  return (
    <div className="container mt-4">
      <h3>Pending Leave Requests</h3>
      <hr />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {pendingLeaves.length === 0 ? (
            <p>No pending leave requests</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.id}</td>
                    <td>
                      {leave.employee
                        ? `${leave.employee.firstName} ${leave.employee.lastName}`
                        : "Unknown"}
                    </td>
                    <td>{leave.fromDate}</td>
                    <td>{leave.toDate}</td>
                    <td>{leave.reason}</td>
                    <td>{leave.type}</td>
                    <td>{leave.status}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => updateStatus(leave.id, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(leave.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
