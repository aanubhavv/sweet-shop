"use client";

import { Sweet } from "@/types/sweet";
import api from "@/lib/api";

interface Props {
  sweet: Sweet;
  onPurchased: () => void;
}

export default function SweetCard({ sweet, onPurchased }: Props) {
  const handlePurchase = async () => {
    await api.post(`/api/sweets/${sweet._id}/purchase`);
    onPurchased();
  };

  return (
    <div className="border rounded p-4 space-y-2">
      <h2 className="text-xl font-bold">{sweet.name}</h2>
      <p>Category: {sweet.category}</p>
      <p>Price: ₹{sweet.price}</p>
      <p>Stock: {sweet.quantity}</p>

      <button
        onClick={handlePurchase}
        disabled={sweet.quantity === 0}
        className={`w-full p-2 text-white ${
          sweet.quantity === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black"
        }`}
      >
        Purchase
      </button>
    </div>
  );
}
