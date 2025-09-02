import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  // Fetch profile on load
  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await api.get("/users/me");
      setProfile(res.data);
      setForm({
        firstName: res.data.employee?.firstName || "",
        lastName: res.data.employee?.lastName || "",
        email: res.data.email || "",
        department: res.data.employee?.department || "",
        jobTitle: res.data.employee?.jobTitle || "",
      });
      setError("");
    } catch (err) {
      console.error("Failed to load profile", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      // Adjust API endpoint if your backend update path differs
      await api.put(`/employees/${profile.employee.id}`, {
        ...profile.employee,
        ...form,
      });
      alert("Profile updated successfully");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error("Update failed", err);
      alert(err?.response?.data?.message || "Failed to update profile");
    }
  }

  if (loading) return <p>Loading profile...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h3>My Profile</h3>
      <hr />

      {!editMode ? (
        <div>
          <p><strong>First Name:</strong> {profile.employee?.firstName}</p>
          <p><strong>Last Name:</strong> {profile.employee?.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Employee Code:</strong> {profile.employee?.employeeCode}</p>
          <p><strong>Department:</strong> {profile.employee?.department}</p>
          <p><strong>Job Title:</strong> {profile.employee?.jobTitle}</p>
          <button
            className="btn btn-primary"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              className="form-control"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              className="form-control"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              className="form-control"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Job Title</label>
            <input
              className="form-control"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-success me-2">
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
