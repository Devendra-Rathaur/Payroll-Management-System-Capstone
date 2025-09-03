import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newDept, setNewDept] = useState({
    name: "",
    description: "",
  });
  const [refresh, setRefresh] = useState(false);

  // Fetch departments
  useEffect(() => {
    setLoading(true);
    api
      .get("/departments")
      .then((res) => {
        setDepartments(res.data);
        setError("");
      })
      .catch(() => setError("Failed to load departments"))
      .finally(() => setLoading(false));
  }, [refresh]);

  // Add new department
  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api.post("/departments", newDept);
      toast.success("✅ Department added successfully");

      setNewDept({ name: "", description: "" });
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error adding department:", err.response || err);
      toast.error(
        err?.response?.data?.message || "❌ Failed to add department"
      );
    }
  }

  return (
    <div className="container mt-4">
      <h3>Department Management</h3>
      <hr />

      {/* Add Department */}
      <form className="mb-4" onSubmit={handleAdd}>
        <h5>Add New Department</h5>
        <div className="row g-2 mb-2">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Department Name"
              value={newDept.name}
              onChange={(e) =>
                setNewDept({ ...newDept, name: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Description"
              value={newDept.description}
              onChange={(e) =>
                setNewDept({ ...newDept, description: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100">Add</button>
          </div>
        </div>
      </form>

      {/* Department Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.description}</td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center">
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
