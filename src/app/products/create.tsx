"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProductCreatePage() {
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Product created!");
        setForm({ name: "", price: "", description: "" });
      } else {
        toast.error(data.message || "Product creation failed");
      }
    } catch {
      toast.error("Product creation failed");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold mb-2">Create Product</h1>
        <input name="name" type="text" placeholder="Product Name" value={form.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="w-full p-2 border rounded" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </main>
  );
}
