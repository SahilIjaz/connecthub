// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//    const router = useRouter();
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     interests: [] as string[], // will store selected IDs
//   });

//   const [interests, setInterests] = useState<{ _id: string; name: string }[]>(
//     []
//   );

//   // Fetch interests on mount
//   useEffect(() => {
//     const fetchInterests = async () => {
//       const res = await fetch("/api/interests");
//       const data = await res.json();
//       if (data.success) {
//         setInterests(data.data);
//       }
//     };
//     fetchInterests();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch("/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     const data = await res.json();

//     alert(data.message || data.error);
//     //  if (res.ok) {
//     //   alert("Registration successful!");
//     //   router.push("/home"); // 👈 redirect to home page
//     // } else {
//     //   alert(data.error || "Something went wrong");
//     // }
//   };
//   };

//   const handleInterestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selected = Array.from(
//       e.target.selectedOptions,
//       (option) => option.value
//     );
//     setForm({ ...form, interests: selected });
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-black-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-balck p-6 rounded-xl shadow-md w-96 space-y-4"
//       >
//         <h2 className="text-2xl font-bold text-center">Register</h2>
//         <input
//           className="w-full p-2 border rounded"
//           placeholder="Username"
//           value={form.username}
//           onChange={(e) => setForm({ ...form, username: e.target.value })}
//         />
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
//         {/* Dropdown for selecting interests */}
//         <select
//           multiple
//           className="w-full p-2 border rounded"
//           value={form.interests}
//           onChange={handleInterestChange}
//         >
//           {interests.map((interest) => (
//             <option key={interest._id} value={interest._id}>
//               {interest.name}
//             </option>
//           ))}
//         </select>
//         <button
//           type="submit"
//           className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Register
//         </button>

//       </form>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 👈 import router

export default function RegisterPage() {
  const router = useRouter(); // 👈 initialize router

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    interests: [] as string[], // will store selected IDs
  });

  const [interests, setInterests] = useState<{ _id: string; name: string }[]>(
    []
  );

  // Fetch interests on mount
  useEffect(() => {
    const fetchInterests = async () => {
      const res = await fetch("/api/interests");
      const data = await res.json();
      if (data.success) {
        setInterests(data.data);
      }
    };
    fetchInterests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      alert("Registration successful!");
      router.push("/home"); // 👈 redirect to home page
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setForm({ ...form, interests: selected });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black-100">
      <form
        onSubmit={handleSubmit}
        className="bg-balck p-6 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          className="w-full p-2 border rounded"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
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
        {/* Dropdown for selecting interests */}
        <select
          multiple
          className="w-full p-2 border rounded"
          value={form.interests}
          onChange={handleInterestChange}
        >
          {interests.map((interest) => (
            <option key={interest._id} value={interest._id}>
              {interest.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
