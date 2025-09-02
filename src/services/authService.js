// src/services/authService.js
import api from "../api/axios";

export async function login(username, password) {
  const { data } = await api.post("/auth/login", { username, password });

  // Accept either `accessToken` or `token`
  const accessToken = data.accessToken || data.token;
  if (!accessToken) {
    throw new Error("Login response missing token");
  }

  // Try to resolve a role from common fields
  let role =
    data.role ||
    (Array.isArray(data.roles) ? data.roles[0] : null) ||
    (Array.isArray(data.authorities) ? data.authorities[0]?.authority : null);

  // Default (only if nothing is provided)
  if (!role) role = "ROLE_EMPLOYEE";
  if (!role.startsWith("ROLE_")) role = `ROLE_${role}`;

  const uname = data.username || username;

  localStorage.setItem("token", accessToken);
  localStorage.setItem("role", role);
  localStorage.setItem("username", uname);

  return { username: uname, role };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
}

export function getRole() {
  return localStorage.getItem("role");
}
