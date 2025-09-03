import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function EmployeeHome() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <h5>
        Welcome,{" "}
        {profile
          ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
          : user?.username}
      </h5>
      <p>
        From here you can view your profile, apply for leave, and check your
        salary slips.
      </p>
    </>
  );
}
