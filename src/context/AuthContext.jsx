// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { logout as doLogout } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    return username && role ? { username, role } : null;
  });

  // Keep state in sync with localStorage updates (e.g., across tabs)
  useEffect(() => {
    function onStorage() {
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role");
      setUser(username && role ? { username, role } : null);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = () => {
    doLogout();
    setUser(null);
  };

  const setAuthUser = (u) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, setAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
