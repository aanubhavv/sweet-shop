import api from "@/lib/api";

export default async function Home() {
  try {
    const res = await api.get("/api/sweets");
    console.log(res.data);
  } catch (err) {
    console.error("Backend not reachable", err);
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">
        Sweet Shop Frontend
      </h1>
    </main>
  );
}
