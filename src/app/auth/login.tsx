"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login({ ...data.user, token: data.token });
        toast.success("Login successful! Redirecting...");
        setTimeout(() => router.push("/"), 1000);
      } else {
        setMessage(data.message || "Login failed");
        toast.error(data.message || "Login failed");
      }
    } catch {
      setMessage("Login failed");
      toast.error("Login failed");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center">Don't have an account? <Link href="/auth/register" className="text-blue-600">Register</Link></p>
        {message && <div className="text-center text-red-500 mt-2">{message}</div>}
      </form>
    </main>
  );
}
