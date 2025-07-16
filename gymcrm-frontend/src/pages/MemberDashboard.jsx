// src/pages/MemberDashboard.jsx
import { useAuth } from "../context/AuthContext";

export default function MemberDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome Member</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Phone: {user?.phone}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
