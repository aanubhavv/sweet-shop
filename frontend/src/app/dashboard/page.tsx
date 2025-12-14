"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Sweet } from "@/types/sweet";
import SweetCard from "@/components/SweetCard";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const router = useRouter();

  const fetchSweets = async () => {
    try {
      const res = await api.get<Sweet[]>("/api/sweets");
      setSweets(res.data);
    } catch (err) {
      console.error("Failed to fetch sweets", err);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    fetchSweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Available Sweets</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sweets.map((sweet) => (
          <SweetCard
            key={sweet._id}
            sweet={sweet}
            onPurchased={fetchSweets}
          />
        ))}
      </div>
    </main>
  );
}
