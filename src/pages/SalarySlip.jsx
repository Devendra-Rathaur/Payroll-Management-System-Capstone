import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

export default function SalarySlip() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [salarySlip, setSalarySlip] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchSlip(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/payroll/my/${year}/${month}`);

      // Default values
      const slip = {
        ...res.data,
        bonus: res.data?.bonus ?? 0,
        payDate: res.data?.payDate || res.data?.processedDate || "N/A",
      };

      setSalarySlip(slip);
      toast.success("✅ Salary slip fetched");
    } catch (err) {
      console.error("Error fetching salary slip:", err.response || err);
      toast.error(
        err?.response?.data?.message || "❌ No salary slip found for this month"
      );
      setSalarySlip(null);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Download as PDF
  function downloadPDF() {
    if (!salarySlip) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Salary Slip", 20, 20);

    doc.setFontSize(12);
    doc.text(`Month: ${month}/${year}`, 20, 35);
    doc.text(`Pay Date: ${salarySlip.payDate}`, 20, 45);

    let y = 65;
    const rows = [
      ["Basic Salary", salarySlip.basicSalary],
      ["Deductions", salarySlip.deductions],
      ["Bonus", salarySlip.bonus],
      ["Net Salary", salarySlip.netSalary],
    ];

    rows.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 20, y);
      y += 10;
    });

    doc.save(`SalarySlip_${month}_${year}.pdf`);
  }

  return (
    <div className="container mt-4">
      <h3>My Salary Slip</h3>
      <hr />

      {/* Form to select year & month */}
      <form className="row g-2 mb-3" onSubmit={fetchSlip}>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            required
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          >
            <option value="">Select Month</option>
            {[
              "January","February","March","April","May","June",
              "July","August","September","October","November","December"
            ].map((m, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Loading..." : "View Slip"}
          </button>
        </div>
      </form>

      {/* Salary Slip Details */}
      {salarySlip && (
        <div className="card p-4 shadow-sm">
          <h5>Salary Slip - {month}/{year}</h5>
          <table className="table table-bordered mt-3">
            <tbody>
              <tr>
                <th>Basic Salary</th>
                <td>{salarySlip.basicSalary}</td>
              </tr>
              <tr>
                <th>Deductions</th>
                <td>{salarySlip.deductions}</td>
              </tr>
              <tr>
                <th>Bonus</th>
                <td>{salarySlip.bonus}</td>
              </tr>
              <tr>
                <th>Net Salary</th>
                <td><strong>{salarySlip.netSalary}</strong></td>
              </tr>
              <tr>
                <th>Pay Date</th>
                <td>{salarySlip.payDate}</td>
              </tr>
            </tbody>
          </table>

          {/* ✅ Download PDF button */}
          <button className="btn btn-success mt-2" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
