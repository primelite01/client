"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

const sampleProduct = {
  id: 1,
  name: "iPhone 15 Pro",
  price: 1200,
  seller: "John Doe",
  description: "Brand new iPhone 15 Pro, 256GB, Space Black. Sealed box.",
};

export default function ProductDetailPage() {
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (res.ok) setForm({ name: data.name, price: data.price, description: data.description });
      } catch {}
    }
    if (productId) fetchProduct();
  }, [productId]);

  const handleBuy = async () => {
    setBuying(true);
    setMessage("");
    try {
      // Replace with real API call
      const res = await fetch("/api/escrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: sampleProduct.id, sellerId: "SELLER_ID", amount: sampleProduct.price }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Escrow funded! Order placed. Track in your dashboard.");
        toast.success("Escrow funded! Order placed.");
      } else {
        setMessage(data.message || "Escrow funding failed");
        toast.error(data.message || "Escrow funding failed");
      }
    } catch {
      setMessage("Escrow funding failed");
      toast.error("Escrow funding failed");
    }
    setBuying(false);
  };

  const handleEdit = () => setEditMode(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuying(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Product updated!");
        setEditMode(false);
      } else {
        toast.error(data.message || "Product update failed");
      }
    } catch {
      toast.error("Product update failed");
    }
    setBuying(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        {!editMode ? (
          <>
            <h1 className="text-2xl font-bold mb-2">{form.name}</h1>
            <div className="text-gray-700 mb-1">Seller: {sampleProduct.seller}</div>
            <div className="text-blue-600 font-bold mb-2">${form.price}</div>
            <p className="mb-4">{form.description}</p>
            <button onClick={handleEdit} className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition mb-2">
              Edit Product
            </button>
            <button onClick={handleBuy} disabled={buying} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
              {buying ? "Processing..." : "Buy via Escrow"}
            </button>
            {message && <div className="text-center text-green-600 mt-2">{message}</div>}
          </>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input name="name" type="text" placeholder="Product Name" value={form.name} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="w-full p-2 border rounded" />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="w-full p-2 border rounded" />
            <button type="submit" disabled={buying} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
              {buying ? "Updating..." : "Update Product"}
            </button>
            <button type="button" onClick={() => setEditMode(false)} className="w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500 transition">
              Cancel
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
