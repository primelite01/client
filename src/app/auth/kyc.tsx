"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function KycPage() {
  const [nin, setNin] = useState("");
  const [bvn, setBvn] = useState("");
  const [docs, setDocs] = useState<FileList | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("nin", nin);
    formData.append("bvn", bvn);
    if (docs) Array.from(docs).forEach((file) => formData.append("docs", file));
    if (selfie) formData.append("selfie", selfie);
    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("KYC submitted! Awaiting review.");
        toast.success("KYC submitted! Awaiting review.");
      } else {
        setMessage(data.message || "KYC submission failed");
        toast.error(data.message || "KYC submission failed");
      }
    } catch {
      setMessage("KYC submission failed");
      toast.error("KYC submission failed");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4" encType="multipart/form-data">
        <h1 className="text-2xl font-bold mb-2">KYC Verification</h1>
        <input type="text" placeholder="NIN" value={nin} onChange={e => setNin(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="BVN" value={bvn} onChange={e => setBvn(e.target.value)} required className="w-full p-2 border rounded" />
        <label className="block">Upload Documents (PDF/JPG/PNG, max 5):
          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={e => setDocs(e.target.files)} className="mt-1" />
        </label>
        <label className="block">Upload Selfie:
          <input type="file" accept="image/*" onChange={e => setSelfie(e.target.files?.[0] || null)} className="mt-1" />
        </label>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          {loading ? "Submitting..." : "Submit KYC"}
        </button>
        {message && <div className="text-center text-green-600 mt-2">{message}</div>}
      </form>
    </main>
  );
}
