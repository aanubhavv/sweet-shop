"use client";

import { useState } from "react";
import { Sweet } from "@/types/sweet";
import api from "@/lib/api";
import { useToast } from "@/components/Toast";

interface Props {
  sweet: Sweet;
  onPurchased: () => void;
}

export default function SweetCard({ sweet, onPurchased }: Props) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handlePurchase = async () => {
    if (sweet.quantity === 0) {
      showToast("Out of stock", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/api/sweets/${sweet._id}/purchase`);
      showToast(`Purchased "${sweet.name}" successfully!`, "success");
      onPurchased();
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { detail?: string } } };
      if (err.response?.status === 400) {
        showToast("Out of stock", "error");
      } else if (err.response?.status === 401) {
        showToast("Unauthorized - Please login", "error");
      } else if (err.response?.status === 404) {
        showToast("Sweet not found", "error");
      } else {
        showToast(err.response?.data?.detail || "Purchase failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;

  return (
    <div className={`card group cursor-pointer ${isOutOfStock ? 'opacity-75' : 'hover:border-primary'}`}>
      {/* Image/Icon Area */}
      <div className="relative h-40 bg-linear-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <span className={`text-6xl transition-transform duration-300 ${!isOutOfStock && 'group-hover:scale-110'}`}>
          🍬
        </span>
        {/* Stock Badge */}
        {isOutOfStock && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-error text-white">
            Out of Stock
          </span>
        )}
        {isLowStock && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-warning text-white">
            Low Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary mb-3">
          {sweet.category}
        </span>

        {/* Name */}
        <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {sweet.name}
        </h2>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-bold text-primary">
            ₹{sweet.price}
          </p>
          <p className={`text-sm font-medium ${
            isOutOfStock 
              ? "text-error" 
              : isLowStock 
              ? "text-warning" 
              : "text-success"
          }`}>
            {isOutOfStock ? "Out of stock" : `${sweet.quantity} in stock`}
          </p>
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isOutOfStock || loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isOutOfStock
              ? "bg-gray-200 text-gray-500 cursor-not-allowed! dark:bg-gray-700 dark:text-gray-400"
              : loading
              ? "bg-primary/70 text-white cursor-wait!"
              : "bg-primary text-white hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 transform hover:-translate-y-0.5"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : isOutOfStock ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Out of Stock
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Purchase
            </>
          )}
        </button>
      </div>
    </div>
  );
}
