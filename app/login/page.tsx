// "use client";
// import { useState } from "react";

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('In the logIn page');
//     const res = await fetch("/api/auth/logIn", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     const data = await res.json();
//     alert(data.message || data.error);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-xl shadow-md w-96 space-y-4"
//       >
//         <h2 className="text-2xl font-bold text-center">Login</h2>

//         <input
//           className="w-full p-2 border rounded"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />

//         <input
//           className="w-full p-2 border rounded"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />

//         <button
//           type="submit"
//           className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 import router

export default function LoginPage() {
  const router = useRouter(); // 👈 initialize router

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('In the logIn page');
    const res = await fetch("/api/auth/logIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      alert("Login successful!");
      router.push("/home"); // 👈 redirect to home page
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-6 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Login
        </button>
      </form>
    </div>
  );
}

