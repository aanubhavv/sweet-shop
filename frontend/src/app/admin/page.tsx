"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Sweet } from "@/types/sweet";
import { getToken } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  // -----------------------------
  // Fetch sweets
  // -----------------------------
  const fetchSweets = async () => {
    try {
      const res = await api.get<Sweet[]>("/api/sweets");
      setSweets(res.data);
    } catch {
      setError("Unauthorized access");
    }
  };

  // -----------------------------
  // Create sweet
  // -----------------------------
  const createSweet = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/api/sweets", {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });

    setForm({ name: "", category: "", price: "", quantity: "" });
    fetchSweets();
  };

  // -----------------------------
  // Delete sweet
  // -----------------------------
  const deleteSweet = async (id: string) => {
    await api.delete(`/api/sweets/${id}`);
    fetchSweets();
  };

  // -----------------------------
  // Restock sweet
  // -----------------------------
  const restockSweet = async (id: string) => {
    const quantity = prompt("Enter restock quantity:");
    if (!quantity) return;

    await api.post(`/api/sweets/${id}/restock`, {
      quantity: Number(quantity),
    });

    fetchSweets();
  };

  // -----------------------------
  // Auth guard
  // -----------------------------
  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    fetchSweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // UI
  // -----------------------------
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Create Sweet */}
      <form
        onSubmit={createSweet}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          className="border p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          className="border p-2"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          className="border p-2"
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <button className="bg-black text-white p-2 col-span-1 md:col-span-4">
          Add Sweet
        </button>
      </form>

      {/* Sweet List */}
      <div className="space-y-4">
        {sweets.map((sweet) => (
          <div
            key={sweet._id}
            className="border p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold">{sweet.name}</h2>
              <p>
                ₹{sweet.price} | Stock: {sweet.quantity}
              </p>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => restockSweet(sweet._id)}
                className="px-3 py-1 bg-blue-600 text-white"
              >
                Restock
              </button>

              <button
                onClick={() => deleteSweet(sweet._id)}
                className="px-3 py-1 bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
