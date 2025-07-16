// trainer.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function TrainerPage() {
  const { token, user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "male",
  });
  const [message, setMessage] = useState("");
  const [trainers, setTrainers] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchTrainers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users?role=trainer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setTrainers(data.users);
    } catch (err) {
      console.error("Failed to load trainers", err);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        role: "trainer",
        businessId: user.businessId,
      };
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Trainer added successfully");
        setForm({ name: "", email: "", password: "", phone: "", dob: "", gender: "male" });
        fetchTrainers();
      } else {
        setMessage(`❌ ${data.error || "Something went wrong"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">👨‍🏫 Manage Trainers</h1>

      {message && (
        <div className="mb-4 text-sm font-medium text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          {message}
        </div>
      )}

      {/* Add Trainer Form */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">➕ Add New Trainer</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="p-2 border rounded" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="p-2 border rounded" />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="p-2 border rounded" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" />
          <select name="gender" value={form.gender} onChange={handleChange} className="p-2 border rounded">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input name="dob" type="date" value={form.dob} onChange={handleChange} className="p-2 border rounded" />
          <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Add Trainer
          </button>
        </form>
      </div>

      {/* Trainer List */}
      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-lg font-semibold mb-4">📋 Registered Trainers</h2>
        {trainers.length === 0 ? (
          <p className="text-gray-500">No trainers found.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">DOB</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => (
                <tr key={trainer._id} className="border-t">
                  <td className="p-2">{trainer.name}</td>
                  <td className="p-2">{trainer.email}</td>
                  <td className="p-2">{trainer.phone}</td>
                  <td className="p-2">{trainer.dob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
