import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { user, logout, token } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "male",
    role: "gymadmin",
  });

  const [message, setMessage] = useState("");
  const [gymAdmins, setGymAdmins] = useState([]);
  const isSuperAdmin = user?.role === "superadmin";

  // ✅ Fetch all gym admins if superadmin
  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users?role=gymadmin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setGymAdmins(data.users || []);
    } catch (err) {
      console.error("Error loading gym admins", err);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) fetchAdmins();
  }, [token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${form.role} created successfully`);
        setForm({
          name: "",
          email: "",
          password: "",
          phone: "",
          dob: "",
          gender: "male",
          role: "gymadmin",
        });
        fetchAdmins();
      } else {
        setMessage(`❌ ${data?.error || "Failed to create user"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Admin deleted");
        fetchAdmins();
      } else {
        setMessage(`❌ ${data.message || "Failed to delete"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error while deleting");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Superadmin Dashboard</h1>
            <p className="text-sm text-gray-600">Email: {user?.email} | Role: {user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {message && (
          <div className="mb-4 text-sm font-medium text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
            {message}
          </div>
        )}

        {/* Add Admin Form */}
        <div className="bg-gray-50 p-6 rounded-md border mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">➕ Create New Gym Admin</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="p-2 border rounded" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required className="p-2 border rounded" />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required className="p-2 border rounded" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" />
            <select name="gender" value={form.gender} onChange={handleChange} className="p-2 border rounded">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input name="dob" value={form.dob} onChange={handleChange} type="date" className="p-2 border rounded" />
            <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Create Gym Admin
            </button>
          </form>
        </div>

        {/* Admins List */}
        <div className="bg-gray-50 p-6 rounded-md border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📋 Registered Gym Admins</h2>
          {gymAdmins.length === 0 ? (
            <p className="text-gray-500">No gym admins found.</p>
          ) : (
            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">DOB</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gymAdmins.map((admin) => (
                  <tr key={admin._id} className="border-t">
                    <td className="p-2">{admin.name}</td>
                    <td className="p-2">{admin.email}</td>
                    <td className="p-2">{admin.phone}</td>
                    <td className="p-2">{admin.dob}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
