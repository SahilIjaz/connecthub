"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      {/* App Name */}
      <h1 className="text-5xl font-extrabold text-gray-900 mb-8">ConnectHub</h1>

      {/* Buttons */}
      <div className="flex gap-6">
        <button
          onClick={() => router.push("/register")}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          Register
        </button>

        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 rounded-2xl bg-gray-800 text-white font-semibold shadow hover:bg-gray-900 transition"
        >
          Login
        </button>
      </div>
    </main>
  );
}
