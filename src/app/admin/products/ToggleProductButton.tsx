"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ToggleProductButton({ id, active }: { id: string; active: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/products/${id}/toggle`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-10 h-5 rounded-full transition-colors relative ${active ? "bg-green-500" : "bg-gray-300"} disabled:opacity-50`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}
