"use client";

import { useState } from "react";
import api from "@/lib/api";
import { RegisterRequest } from "@/types/user";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterRequest>({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/api/auth/register", form);
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <h1 className="text-2xl font-bold">Register</h1>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="bg-black text-white p-2 w-full">
          Register
        </button>
      </form>
    </main>
  );
}
