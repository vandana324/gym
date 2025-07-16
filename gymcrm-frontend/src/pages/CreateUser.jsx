import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CreateUser() {
    const { token, user } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "trainer",
        phone: "",
        dob: "",
        gender: "male"
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            ...(user.role === "gymadmin" ? { businessId: user.businessId } : {})
        };

        const res = await fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            setMessage(`✅ ${form.role} created!`);
            setForm({
                name: "",
                email: "",
                password: "",
                role: "trainer",
                phone: "",
                dob: "",
                gender: "male"
            });
        } else {
            setMessage(`❌ ${data.error || "Something went wrong"}`);
        }
    };


    const roleOptions = user.role === "superadmin"
        ? ["gymadmin"]
        : ["trainer", "member"];

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Create {user.role === "superadmin" ? "Gym Admin" : "Trainer/Member"}</h2>
            {message && <p className="mb-3 text-sm text-blue-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
                <input name="dob" type="date" value={form.dob} onChange={handleChange} className="w-full p-2 border rounded" />
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
                    {roleOptions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
                <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
                    Create User
                </button>
            </form>
        </div>
    );
}
