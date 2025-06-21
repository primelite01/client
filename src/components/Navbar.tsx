"use client";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="w-full bg-white shadow p-4 flex gap-4 items-center">
      <Link href="/" className="font-bold text-lg text-blue-700">TrustBuy</Link>
      <Link href="/products" className="text-gray-700">Browse</Link>
      {user?.role === "seller" || user?.role === "merchant" ? (
        <Link href="/products/create" className="text-gray-700">Add Product</Link>
      ) : null}
      {user?.role === "admin" && (
        <Link href="/admin" className="text-gray-700">Admin</Link>
      )}
      {user && <Link href="/orders" className="text-gray-700">Orders</Link>}
      {user && <Link href="/chat" className="text-gray-700">Chat</Link>}
      {user ? (
        <Link href="/profile" className="ml-auto text-blue-700">Profile</Link>
      ) : (
        <Link href="/auth/login" className="ml-auto text-blue-700">Login</Link>
      )}
    </nav>
  );
}
