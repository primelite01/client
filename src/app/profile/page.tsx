"use client";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return <div className="p-8 text-center">You must be logged in to view your profile.</div>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <div className="mb-2"><b>Email:</b> {user.email}</div>
        <div className="mb-2"><b>Role:</b> {user.role}</div>
        <button onClick={logout} className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition mt-4">Logout</button>
      </div>
    </main>
  );
}
