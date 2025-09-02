import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "EMPLOYEE",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // ✅ Send JSON body instead of params
    const res = await axios.post(`${API_BASE_URL}/auth/register`, form, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setMessage("✅ " + res.data.message || "User registered successfully");
  } catch (err) {
    setMessage("❌ " + (err.response?.data || "Registration failed"));
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="ADMIN">Admin</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}
