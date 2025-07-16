import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error

    try {
      const user = await login(form.email, form.password);

    if (user.role === "superadmin") {
  navigate("/admin");
} else if (user.role === "gymadmin") {
  navigate("/gymadminpage");
} else if (user.role === "trainer") {
  navigate("/trainer/dashboard");
} else {
  navigate("/member/dashboard");
}

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans">
      {/* LEFT SIDE - Login Form */}
      <div className="flex flex-col justify-center items-center bg-white px-6 py-10">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

          {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Decoration */}
      <div className="relative bg-[#1E3A8A] flex items-center justify-center overflow-hidden">
        <div className="absolute top-8 right-8 w-24 h-24 bg-orange-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-8 left-8 w-48 h-48 bg-green-400 rounded-full opacity-60 rotate-12"></div>
        <div className="z-10 text-white text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Welcome Back</h1>
          <p className="text-lg max-w-md">
            Log in to manage your gym, track members, and take control of your business.
          </p>
        </div>
      </div>
    </div>
  );
}

