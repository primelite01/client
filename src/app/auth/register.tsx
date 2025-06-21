"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "buyer" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registration successful! Please login.");
        toast.success("Registration successful! Please login.");
      } else {
        setMessage(data.message || "Registration failed");
        toast.error(data.message || "Registration failed");
      }
    } catch {
      setMessage("Registration failed");
      toast.error("Registration failed");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="buyer">Buyer</option>
          <option value="seller">Individual Seller</option>
          <option value="merchant">Merchant</option>
        </select>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="text-sm text-center">Already have an account? <Link href="/auth/login" className="text-blue-600">Login</Link></p>
        {message && <div className="text-center text-red-500 mt-2">{message}</div>}
      </form>
    </main>
  );
}
