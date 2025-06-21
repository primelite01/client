"use client";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("(Demo) Settings saved!");
  };

  if (!user) return <div className="p-8 text-center">You must be logged in to view settings.</div>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSave} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <input name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Save</button>
        {message && <div className="text-center text-green-600 mt-2">{message}</div>}
      </form>
    </main>
  );
}
