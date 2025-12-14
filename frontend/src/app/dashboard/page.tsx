"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Sweet } from "@/types/sweet";
import SweetCard from "@/components/SweetCard";
import { useToast } from "@/components/Toast";
import CustomSelect from "@/components/CustomSelect";

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // -----------------------------
  // State
  // -----------------------------
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // -----------------------------
  // Fetch all sweets
  // -----------------------------
  const fetchSweets = async () => {
    try {
      setLoading(true);
      const res = await api.get<Sweet[]>("/api/sweets");
      setSweets(res.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(res.data.map(s => s.category))];
      setCategories(uniqueCategories);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        showToast("Session expired. Please login again.", "error");
        router.push("/login");
      } else {
        showToast("Failed to load sweets", "error");
      }
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
      
      if (res.data.length === 0) {
        showToast("No sweets found matching your criteria", "info");
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        showToast("Unauthorized", "error");
      } else {
        showToast("Search failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Clear filters
  // -----------------------------
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    fetchSweets();
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
  // Stats
  // -----------------------------
  const totalSweets = sweets.length;
  const inStock = sweets.filter(s => s.quantity > 0).length;
  const outOfStock = sweets.filter(s => s.quantity === 0).length;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="bg-linear-to-r from-primary/10 via-transparent to-secondary/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">🍬</span>
                Available Sweets
              </h1>
              <p className="text-muted mt-1">Browse and purchase your favorite treats</p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-4">
              <div className="bg-card-bg rounded-xl px-4 py-3 shadow-sm border border-border">
                <p className="text-2xl font-bold text-primary">{totalSweets}</p>
                <p className="text-xs text-muted">Total Items</p>
              </div>
              <div className="bg-card-bg rounded-xl px-4 py-3 shadow-sm border border-border">
                <p className="text-2xl font-bold text-success">{inStock}</p>
                <p className="text-xs text-muted">In Stock</p>
              </div>
              <div className="bg-card-bg rounded-xl px-4 py-3 shadow-sm border border-border">
                <p className="text-2xl font-bold text-error">{outOfStock}</p>
                <p className="text-xs text-muted">Out of Stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search / Filter Controls */}
        <div className="bg-card-bg rounded-xl shadow-lg border border-border transition-all duration-300 hover:shadow-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h2 className="font-semibold">Search & Filter</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <input
                className="input pr-10"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchSweets()}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>

            <div className="relative">
              <CustomSelect
                options={[
                  { value: "", label: "All Categories" },
                  ...categories.map((cat) => ({ value: cat, label: cat })),
                ]}
                value={category}
                onChange={setCategory}
                placeholder="All Categories"
              />
            </div>

            <div className="relative">
              <input
                className="input pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Min price"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-sm font-medium">
                ₹
              </span>
            </div>

            <div className="relative">
              <input
                className="input pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Max price"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-sm font-medium">
                ₹
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={searchSweets}
                className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              <button
                onClick={clearFilters}
                className="py-3 px-4 rounded-lg border-2 border-border text-muted font-medium hover:border-primary hover:text-primary transition-all duration-200"
                title="Clear filters"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin w-12 h-12 text-primary mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-muted">Loading delicious sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/10 flex items-center justify-center">
              <span className="text-4xl">🍭</span>
            </div>
            <h3 className="text-xl font-bold mb-2">No sweets found</h3>
            <p className="text-muted mb-6">Try adjusting your search filters or check back later.</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchased={fetchSweets}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
