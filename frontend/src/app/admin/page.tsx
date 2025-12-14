"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Sweet } from "@/types/sweet";
import { getToken, isAdmin } from "@/lib/auth";
import { useToast } from "@/components/Toast";

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [editForm, setEditForm] = useState({
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
      setLoading(true);
      const res = await api.get<Sweet[]>("/api/sweets");
      setSweets(res.data);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        showToast("Unauthorized access", "error");
        router.push("/login");
      } else {
        showToast("Failed to fetch sweets", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Create sweet
  // -----------------------------
  const createSweet = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("create");

    try {
      await api.post("/api/sweets", {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });

      setForm({ name: "", category: "", price: "", quantity: "" });
      showToast("Sweet added successfully!", "success");
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { detail?: string } } };
      if (err.response?.status === 401) {
        showToast("Unauthorized - Admin access required", "error");
      } else if (err.response?.status === 403) {
        showToast("Forbidden - You don't have permission", "error");
      } else {
        showToast(err.response?.data?.detail || "Failed to add sweet", "error");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // -----------------------------
  // Delete sweet
  // -----------------------------
  const deleteSweet = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setActionLoading(id);
    try {
      await api.delete(`/api/sweets/${id}`);
      showToast(`"${name}" deleted successfully`, "success");
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        showToast("Unauthorized", "error");
      } else if (err.response?.status === 403) {
        showToast("Forbidden - Admin access required", "error");
      } else {
        showToast("Failed to delete sweet", "error");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // -----------------------------
  // Update sweet
  // -----------------------------
  const openEditModal = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setEditForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
    });
  };

  const closeEditModal = () => {
    setEditingSweet(null);
    setEditForm({ name: "", category: "", price: "", quantity: "" });
  };

  const updateSweet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSweet) return;

    setActionLoading("edit");
    try {
      await api.put(`/api/sweets/${editingSweet._id}`, {
        name: editForm.name,
        category: editForm.category,
        price: Number(editForm.price),
        quantity: Number(editForm.quantity),
      });

      showToast("Sweet updated successfully!", "success");
      closeEditModal();
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { detail?: string } } };
      if (err.response?.status === 401) {
        showToast("Unauthorized - Admin access required", "error");
      } else if (err.response?.status === 403) {
        showToast("Forbidden - You don't have permission", "error");
      } else {
        showToast(err.response?.data?.detail || "Failed to update sweet", "error");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // -----------------------------
  // Restock sweet
  // -----------------------------
  const restockSweet = async (id: string, name: string) => {
    const quantity = prompt(`Enter restock quantity for "${name}":`);
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      if (quantity !== null) {
        showToast("Please enter a valid quantity", "warning");
      }
      return;
    }

    setActionLoading(id);
    try {
      await api.post(`/api/sweets/${id}/restock`, {
        quantity: Number(quantity),
      });
      showToast(`Restocked "${name}" with ${quantity} units`, "success");
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        showToast("Unauthorized", "error");
      } else if (err.response?.status === 403) {
        showToast("Forbidden - Admin access required", "error");
      } else {
        showToast("Failed to restock", "error");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // -----------------------------
  // Auth guard
  // -----------------------------
  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    
    // Check if user is admin (frontend only - backend will still enforce)
    if (!isAdmin()) {
      showToast("Admin access required", "error");
      router.push("/dashboard");
      return;
    }
    
    fetchSweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // Stats
  // -----------------------------
  const totalSweets = sweets.length;
  const totalStock = sweets.reduce((sum, s) => sum + s.quantity, 0);
  const lowStock = sweets.filter(s => s.quantity > 0 && s.quantity <= 5).length;
  const outOfStock = sweets.filter(s => s.quantity === 0).length;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="bg-linear-to-r from-secondary/10 via-transparent to-primary/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <span className="p-2 rounded-xl bg-secondary/10">
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Admin Dashboard
              </h1>
              <p className="text-muted mt-1">Manage your sweet inventory</p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-card-bg rounded-xl px-4 py-3 shadow-sm border border-border">
                <p className="text-2xl font-bold text-primary">{totalSweets}</p>
                <p className="text-xs text-muted">Products</p>
              </div>
              <div className="bg-card-bg rounded-xl px-4 py-3 shadow-sm border border-border">
                <p className="text-2xl font-bold text-secondary">{totalStock}</p>
                <p className="text-xs text-muted">Total Stock</p>
              </div>
              <div className="bg-card-bg rounded-xl px-4 py-3 shadow-sm border border-border">
                <p className="text-2xl font-bold text-warning">{lowStock}</p>
                <p className="text-xs text-muted">Low Stock</p>
              </div>
              <div className="bg-card-bg rounded-xl px-4 py-3 shadow-sm border border-border">
                <p className="text-2xl font-bold text-error">{outOfStock}</p>
                <p className="text-xs text-muted">Out of Stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Add New Sweet Form */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-success/10">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Add New Sweet</h2>
          </div>

          <form onSubmit={createSweet} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                className="input"
                placeholder="e.g., Chocolate Truffle"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                className="input"
                placeholder="e.g., Chocolate"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price (₹)</label>
              <input
                className="input"
                placeholder="0.00"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                className="input"
                placeholder="0"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                disabled={actionLoading === "create"}
                className="w-full md:w-auto px-8 py-3 rounded-lg bg-success text-white font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading === "create" ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Sweet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Inventory Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Inventory</h2>
              <span className="ml-auto text-sm text-muted">{sweets.length} items</span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="animate-spin w-10 h-10 text-primary mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-muted">Loading inventory...</p>
            </div>
          ) : sweets.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/10 flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="font-bold mb-2">No sweets in inventory</h3>
              <p className="text-muted text-sm">Add your first sweet using the form above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr className="text-left text-sm text-muted">
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sweets.map((sweet) => (
                    <tr key={sweet._id} className="hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-lg">🍬</span>
                          </div>
                          <span className="font-medium">{sweet.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                          {sweet.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">₹{sweet.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sweet.quantity === 0
                            ? "bg-error/10 text-error"
                            : sweet.quantity <= 5
                            ? "bg-warning/10 text-warning"
                            : "bg-success/10 text-success"
                        }`}>
                          {sweet.quantity === 0 ? "Out of stock" : `${sweet.quantity} units`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(sweet)}
                            disabled={actionLoading === sweet._id}
                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => restockSweet(sweet._id, sweet.name)}
                            disabled={actionLoading === sweet._id}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
                            title="Restock"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteSweet(sweet._id, sweet.name)}
                            disabled={actionLoading === sweet._id}
                            className="p-2 rounded-lg text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {actionLoading === sweet._id ? (
                              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingSweet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card-bg rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Edit Sweet</h2>
              </div>
              <button
                onClick={closeEditModal}
                className="p-2 rounded-lg hover:bg-background transition-colors"
                disabled={actionLoading === "edit"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={updateSweet} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  className="input"
                  placeholder="e.g., Chocolate Truffle"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  className="input"
                  placeholder="e.g., Chocolate"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price (₹)</label>
                <input
                  className="input"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  className="input"
                  placeholder="0"
                  type="number"
                  min="0"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                  required
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={actionLoading === "edit"}
                  className="flex-1 py-3 px-4 rounded-lg border-2 border-border font-medium hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "edit"}
                  className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed! flex items-center justify-center gap-2"
                >
                  {actionLoading === "edit" ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Sweet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
