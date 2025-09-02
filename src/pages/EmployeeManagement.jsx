import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);

  // Hardcoded department list with IDs matching backend DB
  const departmentMap = {
    HR: 1,
    Finance: 2,
    Admin: 3,
    IT: 4,
    Marketing: 5,
    Operations: 6,
    Sales: 7
  };
  const departmentOptions = Object.keys(departmentMap);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newEmp, setNewEmp] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    department: "",
  });
  const [refresh, setRefresh] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Fetch employees
  useEffect(() => {
    setLoading(true);
    api.get("/employees")
      .then((res) => {
        setEmployees(res.data);
        setError("");
      })
      .catch(() => setError("Failed to load employees"))
      .finally(() => setLoading(false));
  }, [refresh]);

  // Create Employee
  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api.post(
        `/users/create-employee?username=${encodeURIComponent(newEmp.username)}&email=${encodeURIComponent(newEmp.email)}&password=${encodeURIComponent(newEmp.password)}&firstName=${encodeURIComponent(newEmp.firstName)}&lastName=${encodeURIComponent(newEmp.lastName)}&departmentId=${departmentMap[newEmp.department]}`
      );

      toast.success("✅ Employee created successfully");

      // Reset form
      setNewEmp({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        department: "",
      });

      // Refresh list so department shows up immediately
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error creating employee:", err.response || err);
      toast.error(err?.response?.data?.message || "❌ Failed to create employee");
    }
  }

  // Delete Employee
  async function handleDelete(employeeId, userId) {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${employeeId}`);
      await api.delete(`/users/${userId}`);
      toast.success("🗑 Employee and user deleted successfully");
      setRefresh(!refresh);
    } catch (err) {
      console.error("Delete failed:", err.response || err);
      toast.error(err?.response?.data?.message || "❌ Failed to delete employee/user");
    }
  }

  // Start Editing
  function startEdit(emp) {
    setEditingId(emp.id);
    setEditData({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      email: emp.user?.email || "",
      department: emp.department?.name || "",
    });
  }

  // Update Employee
  async function handleUpdate(id, userId) {
    try {
      await api.put(`/employees/${id}`, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        department: { id: departmentMap[editData.department] },
        user: {
          id: userId,
          email: editData.email,
        },
      });
      toast.success("✏ Employee updated");
      setEditingId(null);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Update failed:", err.response || err);
      toast.error(err?.response?.data?.message || "❌ Failed to update employee");
    }
  }

  // Search
  const filteredEmployees = employees.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.firstName?.toLowerCase().includes(term) ||
      e.lastName?.toLowerCase().includes(term) ||
      e.user?.username?.toLowerCase().includes(term) ||
      e.user?.email?.toLowerCase().includes(term) ||
      e.employeeCode?.toLowerCase().includes(term) ||
      e.department?.name?.toLowerCase().includes(term)
    );
  });

  // Sort
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let valA, valB;
    switch (sortConfig.key) {
      case "name":
        valA = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
        valB = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
        break;
      case "email":
        valA = a.user?.email?.toLowerCase() || "";
        valB = b.user?.email?.toLowerCase() || "";
        break;
      case "username":
        valA = a.user?.username?.toLowerCase() || "";
        valB = b.user?.username?.toLowerCase() || "";
        break;
      case "code":
        valA = a.employeeCode?.toLowerCase() || "";
        valB = b.employeeCode?.toLowerCase() || "";
        break;
      default:
        return 0;
    }
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / pageSize);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function changePage(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  function handleSort(key) {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  }

  return (
    <div className="container mt-4">
      <h3>Employee Management</h3>
      <hr />

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Add Employee */}
      <form className="mb-4" onSubmit={handleAdd}>
        <h5>Add New Employee</h5>
        <div className="row g-2 mb-2">
          <div className="col-md-3">
            <input className="form-control" placeholder="First Name" value={newEmp.firstName} onChange={(e) => setNewEmp({ ...newEmp, firstName: e.target.value })} required />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Last Name" value={newEmp.lastName} onChange={(e) => setNewEmp({ ...newEmp, lastName: e.target.value })} required />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Username" value={newEmp.username} onChange={(e) => setNewEmp({ ...newEmp, username: e.target.value })} required />
          </div>
          <div className="col-md-3">
            <input className="form-control" type="email" placeholder="Email" value={newEmp.email} onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })} required />
          </div>
        </div>
        <div className="row g-2 mb-2">
          <div className="col-md-3">
            <input className="form-control" type="password" placeholder="Password" value={newEmp.password} onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })} required />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={newEmp.department} onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })} required>
              <option value="">Select Department</option>
              {departmentOptions.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100">Add</button>
          </div>
        </div>
      </form>

      {/* Employee Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th onClick={() => handleSort("code")} style={{ cursor: "pointer" }}>
                  Code {sortConfig.key === "code" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                  Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th>Department</th>
                <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                  Email {sortConfig.key === "email" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("username")} style={{ cursor: "pointer" }}>
                  Username {sortConfig.key === "username" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((e) => (
                <tr key={e.id}>
                  <td>{e.employeeCode}</td>
                  <td>
                    {editingId === e.id ? (
                      <>
                        <input className="form-control mb-1" value={editData.firstName} onChange={(ev) => setEditData({ ...editData, firstName: ev.target.value })} />
                        <input className="form-control" value={editData.lastName} onChange={(ev) => setEditData({ ...editData, lastName: ev.target.value })} />
                      </>
                    ) : (
                      `${e.firstName} ${e.lastName}`
                    )}
                  </td>
                  <td>
                    {editingId === e.id ? (
                      <select className="form-select" value={editData.department} onChange={(ev) => setEditData({ ...editData, department: ev.target.value })}>
                        <option value="">Select Department</option>
                        {departmentOptions.map((dept, idx) => (
                          <option key={idx} value={dept}>{dept}</option>
                        ))}
                      </select>
                    ) : (
                      e.department?.name || "No Department"
                    )}
                  </td>
                  <td>
                    {editingId === e.id ? (
                      <input className="form-control" type="email" value={editData.email} onChange={(ev) => setEditData({ ...editData, email: ev.target.value })} />
                    ) : (
                      e.user?.email
                    )}
                  </td>
                  <td>{e.user?.username}</td>
                  <td>
                    {editingId === e.id ? (
                      <>
                        <button className="btn btn-sm btn-success me-1" onClick={() => handleUpdate(e.id, e.user?.id)}>Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-warning me-1" onClick={() => startEdit(e)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(e.id, e.user?.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => changePage(currentPage - 1)}>Previous</button>
                </li>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <li key={idx} className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => changePage(idx + 1)}>{idx + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => changePage(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
