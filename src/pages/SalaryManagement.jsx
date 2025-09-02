import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function SalaryManagement() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [hra, setHra] = useState("");
  const [allowances, setAllowances] = useState("");
  const [deductions, setDeductions] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all employees for the dropdown
  useEffect(() => {
    api
      .get("/employees") // your backend must expose this list
      .then((res) => setEmployees(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load employees");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    setLoading(true);

    try {
      await api.post("/salaries", {
        employee: { id: parseInt(selectedEmployee, 10) },
        basicSalary: parseFloat(basicSalary),
        hra: parseFloat(hra),
        allowances: parseFloat(allowances),
        deductions: parseFloat(deductions),
        effectiveFrom: new Date().toISOString().split("T")[0], // today's date in YYYY-MM-DD
      });

      toast.success("Salary record saved successfully");

      // reset form
      setBasicSalary("");
      setHra("");
      setAllowances("");
      setDeductions("");
      setSelectedEmployee("");
    } catch (err) {
      console.error("Error saving salary", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to save salary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Salary Management</h3>
      <form className="row g-3" onSubmit={handleSubmit}>
        {/* Employee Selector */}
        <div className="col-md-4">
          <label className="form-label">Select Employee</label>
          <select
            className="form-select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Basic Salary */}
        <div className="col-md-4">
          <label className="form-label">Basic Salary</label>
          <input
            type="number"
            className="form-control"
            value={basicSalary}
            onChange={(e) => setBasicSalary(e.target.value)}
            required
          />
        </div>

        {/* HRA */}
        <div className="col-md-4">
          <label className="form-label">HRA</label>
          <input
            type="number"
            className="form-control"
            value={hra}
            onChange={(e) => setHra(e.target.value)}
            required
          />
        </div>

        {/* Allowances */}
        <div className="col-md-4">
          <label className="form-label">Allowances</label>
          <input
            type="number"
            className="form-control"
            value={allowances}
            onChange={(e) => setAllowances(e.target.value)}
            required
          />
        </div>

        {/* Deductions */}
        <div className="col-md-4">
          <label className="form-label">Deductions</label>
          <input
            type="number"
            className="form-control"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Salary"}
          </button>
        </div>
      </form>
    </div>
  );
}
