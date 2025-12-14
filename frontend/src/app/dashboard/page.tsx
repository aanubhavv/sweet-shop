"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Sweet } from "@/types/sweet";
import SweetCard from "@/components/SweetCard";

export default function DashboardPage() {
  const router = useRouter();

  // -----------------------------
  // State
  // -----------------------------
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Fetch all sweets
  // -----------------------------
  const fetchSweets = async () => {
    try {
      setLoading(true);
      const res = await api.get<Sweet[]>("/api/sweets");
      setSweets(res.data);
    } catch (err) {
      console.error("Failed to fetch sweets", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Search sweets
  // -----------------------------
  const searchSweets = async () => {
    try {
      setLoading(true);

      const params: Record<string, string> = {};
      if (search) params.name = search;
      if (category) params.category = category;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;

      const res = await api.get<Sweet[]>("/api/sweets/search", {
        params,
      });

      setSweets(res.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Auth guard + initial fetch
  // -----------------------------
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    fetchSweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Available Sweets</h1>

      {/* Search / Filter Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          className="border p-2"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Min price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Max price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button
          onClick={searchSweets}
          className="bg-black text-white p-2"
        >
          Search
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : sweets.length === 0 ? (
        <p>No sweets found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              onPurchased={fetchSweets}
            />
          ))}
        </div>
      )}
    </main>
  );
}
