"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";

type Chat = { id: string; user: string; lastMessage: string; flagged: boolean };

const scamKeywords = [
  "whatsapp", "telegram", "off-platform", "send money", "gift card", "crypto", "btc", "pay outside", "contact me"
];
function containsScam(content: string) {
  return scamKeywords.some(word => content.toLowerCase().includes(word));
}

export default function ChatDashboardPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchChats() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/chat/list");
        const data = await res.json();
        setChats(data.chats || []);
      } catch {
        setError("Failed to load chats");
      }
      setLoading(false);
    }
    fetchChats();

    // Real-time updates
    const socket = io();
    socket.on("chat_update", (updatedChat: Chat) => {
      setChats((prev) => {
        const idx = prev.findIndex((c) => c.id === updatedChat.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = updatedChat;
          if (updatedChat.flagged) {
            toast.error("Scam/fraud warning: flagged message detected in chat.");
          } else {
            toast.success("New message received.");
          }
          return updated;
        }
        if (updatedChat.flagged) {
          toast.error("Scam/fraud warning: flagged message detected in chat.");
        } else {
          toast.success("New message received.");
        }
        return [updatedChat, ...prev];
      });
    });
    return () => { socket.disconnect(); };
  }, []);

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">In-App Chat</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="space-y-4">
        {chats.map((chat) => (
          <div key={chat.id} className="bg-white rounded shadow p-4 flex flex-col">
            <div className="font-semibold text-lg mb-1">{chat.user}</div>
            <div className="text-gray-700 mb-1">{chat.lastMessage}</div>
            {(chat.flagged || containsScam(chat.lastMessage)) && (
              <div className="text-red-600 font-bold">Warning: Possible scam/fraud detected</div>
            )}
            <button className="bg-blue-600 text-white rounded p-2 mt-2 hover:bg-blue-700 transition">Open Chat</button>
          </div>
        ))}
      </div>
    </main>
  );
}
