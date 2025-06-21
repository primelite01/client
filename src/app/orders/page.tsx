"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

type Order = { id: string; product: string; status: string; escrowStatus: string };

export default function OrderTrackingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch {
        setError("Failed to load orders");
      }
      setLoading(false);
    }
    fetchOrders();

    // Real-time updates
    const socket = io();
    socket.on("order_update", (updatedOrder: Order) => {
      setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    });
    return () => { socket.disconnect(); };
  }, []);

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded shadow p-4 flex flex-col">
            <div className="font-semibold text-lg mb-1">{order.product}</div>
            <div className="text-gray-700 mb-1">Order Status: {order.status}</div>
            <div className="text-blue-600 font-bold mb-1">Escrow: {order.escrowStatus}</div>
            <button className="bg-blue-600 text-white rounded p-2 mt-2 hover:bg-blue-700 transition">View Details</button>
          </div>
        ))}
      </div>
    </main>
  );
}
