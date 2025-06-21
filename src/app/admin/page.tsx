"use client";
import { useEffect, useState } from "react";

type KycUser = { id: string; email: string; kycStatus: string };
type Dispute = { id: string; buyer: string; seller: string; status: string };
type FlaggedMessage = { id: string; user: string; content: string; flagged: boolean };
type Transaction = { id: string; buyer: string; seller: string; amount: number; status: string };

export default function AdminDashboardPage() {
  const [pendingKyc, setPendingKyc] = useState<KycUser[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [kycRes, disputesRes, flaggedRes, txRes] = await Promise.all([
          fetch("/api/admin/kyc/pending"),
          fetch("/api/admin/disputes"),
          fetch("/api/admin/messages/flagged"),
          fetch("/api/admin/transactions"),
        ]);
        setPendingKyc((await kycRes.json()).users || []);
        setDisputes((await disputesRes.json()).disputes || []);
        setFlaggedMessages((await flaggedRes.json()).messages || []);
        setTransactions((await txRes.json()).escrows || []);
      } catch (err) {
        setError("Failed to load admin data");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Approve/Reject KYC
  const handleKyc = async (userId: string, status: string) => {
    await fetch("/api/kyc/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status }),
    });
    setPendingKyc(pendingKyc.filter((u) => u.id !== userId));
  };

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pending KYC</h2>
        <div className="space-y-2">
          {pendingKyc.map((u) => (
            <div key={u.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
              <span>{u.email}</span>
              <span className="text-yellow-600 font-bold">{u.kycStatus}</span>
              <button onClick={() => handleKyc(u.id, "approved")} className="bg-green-600 text-white rounded px-3 py-1 hover:bg-green-700 transition">Approve</button>
              <button onClick={() => handleKyc(u.id, "rejected")} className="bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700 transition">Reject</button>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Disputes</h2>
        <div className="space-y-2">
          {disputes.map((d) => (
            <div key={d.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
              <span>{d.buyer} vs {d.seller}</span>
              <span className="text-red-600 font-bold">{d.status}</span>
              <button className="bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700 transition">Resolve</button>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Flagged Messages</h2>
        <div className="space-y-2">
          {flaggedMessages.map((m) => (
            <div key={m.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
              <span>{m.user}: {m.content}</span>
              <span className="text-red-600 font-bold">Flagged</span>
              <button className="bg-gray-600 text-white rounded px-3 py-1 hover:bg-gray-700 transition">Review</button>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Transactions</h2>
        <div className="space-y-2">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
              <span>{t.buyer} → {t.seller}</span>
              <span className="text-blue-600 font-bold">${t.amount}</span>
              <span className="text-green-600 font-bold">{t.status}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
