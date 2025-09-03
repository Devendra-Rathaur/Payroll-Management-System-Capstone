import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminHome() {
  const { user } = useAuth();

  return (
    <div>
      <h5>Welcome, {user?.username || "Admin"}</h5>
      <p>
        From here you can manage employees, run payrolls, approve
        leaves, and view reports.
      </p>
    </div>
  );
}
