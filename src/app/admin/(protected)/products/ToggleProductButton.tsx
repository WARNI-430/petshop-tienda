"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ToggleProductButton({ id, active }: { id: string; active: boolean }) {
  const [loading, setLoading] = useState(false);
  const [optimistic, setOptimistic] = useState(active);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    setOptimistic((v) => !v);
    await fetch(`/api/admin/products/${id}/toggle`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-11 h-6 rounded-full transition-all duration-200 relative outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        optimistic ? "bg-indigo-600" : "bg-white/10"
      } disabled:opacity-40`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          optimistic ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
