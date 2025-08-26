// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // For navigation to chat page

// interface User {
//   _id: string;
//   username: string;
// }

// interface Post {
//   _id: string;
//   text: string;
//   creator: User;
// }

// export default function FriendsSuggestionsPage() {
//   const router = useRouter();
//   const [users, setUsers] = useState<User[]>([]);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchType, setSearchType] = useState<"users" | "posts">("users");

//   // Fetch suggested friends on page load
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("/api/friendSuggestion", {
//           credentials: "include",
//         });
//         const data = await res.json();
//         if (res.ok) setUsers(data.users);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Handle Search
//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;

//     setLoading(true);
//     try {
//       const apiUrl =
//         searchType === "users"
//           ? `/api/search/users?q=${encodeURIComponent(searchQuery)}`
//           : `/api/search/posts?q=${encodeURIComponent(searchQuery)}`;

//       const res = await fetch(apiUrl, { credentials: "include" });
//       const data = await res.json();

//       if (res.ok) {
//         if (searchType === "users") setUsers(data.users);
//         else setPosts(data.posts);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate to chat page
//   const handleStartChat = (userId: string, username: string) => {
//     router.push(`/chat/${userId}?username=${encodeURIComponent(username)}`);
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Suggested Friends</h1>

//       {/* Search Section */}
//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder={`Search ${searchType}...`}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="flex-1 p-2 border rounded"
//         />
//         <select
//           value={searchType}
//           onChange={(e) => setSearchType(e.target.value as "users" | "posts")}
//           className="p-2 border rounded"
//         >
//           <option value="users">Users</option>
//           <option value="posts">Posts</option>
//         </select>
//         <button
//           onClick={handleSearch}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Search
//         </button>
//       </div>

//       {/* Display Search Results or Suggested Friends */}
//       {searchType === "users" ? (
//         users.length === 0 ? (
//           <p className="text-gray-600">
//             No users found with the same interests as you.
//           </p>
//         ) : (
//           users.map((u) => (
//             <div
//               key={u._id}
//               className="p-2 border rounded mb-2 flex justify-between items-center"
//             >
//               <span>{u.username}</span>
//               <button
//                 onClick={() => handleStartChat(u._id, u.username)}
//                 className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//               >
//                 Chat
//               </button>
//             </div>
//           ))
//         )
//       ) : posts.length === 0 ? (
//         <p className="text-gray-600">No posts found matching your query.</p>
//       ) : (
//         posts.map((p) => (
//           <div key={p._id} className="p-2 border rounded mb-2">
//             <p className="font-semibold">{p.creator?.username}</p>
//             <p>{p.text}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For navigation to chat page

interface User {
  _id: string;
  username: string;
}

interface Post {
  _id: string;
  text: string;
  creator: User;
}

export default function FriendsSuggestionsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"users" | "posts">("users");

  // Fetch suggested friends on page load
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/friendSuggestion", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setUsers(data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const apiUrl =
        searchType === "users"
          ? `/api/search/users?q=${encodeURIComponent(searchQuery)}`
          : `/api/search/posts?q=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(apiUrl, { credentials: "include" });
      const data = await res.json();

      if (res.ok) {
        if (searchType === "users") setUsers(data.users);
        else setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to chat page
  const handleStartChat = (userId: string, username: string) => {
    // Navigate to dynamic route /chat/[userId]?username=...
    router.push(`/chat/${userId}?username=${encodeURIComponent(username)}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suggested Friends</h1>

      {/* Search Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={`Search ${searchType}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "users" | "posts")}
          className="p-2 border rounded"
        >
          <option value="users">Users</option>
          <option value="posts">Posts</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Display Search Results or Suggested Friends */}
      {searchType === "users" ? (
        users.length === 0 ? (
          <p className="text-gray-600">
            No users found with the same interests as you.
          </p>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="p-2 border rounded mb-2 flex justify-between items-center"
            >
              <span>{u.username}</span>
              <button
                onClick={() => handleStartChat(u._id, u.username)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Chat
              </button>
            </div>
          ))
        )
      ) : posts.length === 0 ? (
        <p className="text-gray-600">No posts found matching your query.</p>
      ) : (
        posts.map((p) => (
          <div key={p._id} className="p-2 border rounded mb-2">
            <p className="font-semibold">{p.creator?.username}</p>
            <p>{p.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
