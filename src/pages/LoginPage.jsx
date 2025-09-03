import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login(username, password);
      if (user.role === "ROLE_ADMIN") navigate("/admin/dashboard");
      else navigate("/employee/dashboard");
    } catch (err) {
      console.error("Login error:", err.response || err);
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        backgroundImage: "url('/payroll-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "white",
          padding: "15px 30px",
          fontSize: "20px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Payroll Management System</span>
        <button
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </nav>

      {/* Login Form */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 60px)",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h3>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="form-control mb-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="btn btn-primary w-100"
              disabled={busy}
              style={{ padding: "10px", fontSize: "16px" }}
            >
              {busy ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
