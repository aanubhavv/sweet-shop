"use client";

import { useState } from "react";
import api from "@/lib/api";
import { LoginRequest, AuthResponse } from "@/types/user";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await api.post<AuthResponse>(
      "/api/auth/login",
      form
    );

    setToken(res.data.access_token);
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <h1 className="text-2xl font-bold">Login</h1>

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
          Login
        </button>
      </form>
    </main>
  );
}
