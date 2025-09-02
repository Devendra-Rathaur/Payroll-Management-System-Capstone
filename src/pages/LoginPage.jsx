
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
    <div className="container" style={{ maxWidth: 420, marginTop: 80 }}>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
        <input className="form-control mb-3" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-primary w-100" disabled={busy}>{busy ? "Logging in..." : "Login"}</button>
      </form>
    </div>
  );
}
