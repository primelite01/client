"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function ProductListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setError("Failed to load products");
      }
      setLoading(false);
    }
    fetchProducts();

    // Real-time updates
    const socket = io();
    socket.on("product_update", (updatedProduct: any) => {
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === updatedProduct.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = updatedProduct;
          return updated;
        }
        return [updatedProduct, ...prev];
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  function containsScam(content: string) {
    const scamKeywords = [
      "whatsapp",
      "telegram",
      "off-platform",
      "send money",
      "gift card",
      "crypto",
      "btc",
      "pay outside",
      "contact me",
    ];
    return scamKeywords.some((word) => content.toLowerCase().includes(word));
  }

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Browse Listings</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded shadow p-4 flex flex-col"
          >
            <div className="font-semibold text-lg mb-2">{p.name}</div>
            <div className="text-gray-700 mb-1">Seller: {p.seller}</div>
            <div className="text-blue-600 font-bold mb-2">${p.price}</div>
            {p.description && containsScam(p.description) && (
              <div className="text-red-600 font-bold">
                Warning: Possible scam/fraud detected in description
              </div>
            )}
            <button className="bg-green-600 text-white rounded p-2 hover:bg-green-700 transition">
              View & Buy
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
