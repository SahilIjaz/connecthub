// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import InterestFeed from "@/app/postsPage/interestFeed";

// export default function HomePage() {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [editForm, setEditForm] = useState({ name: "", bio: "" });
//   const [posts, setPosts] = useState<any[]>([]);
//   const [newPost, setNewPost] = useState({ text: "", image: "" });
//   const [postId, setPostId] = useState("");
//   const [singlePost, setSinglePost] = useState<any>(null);

//   // ================= USER =================
//   const getCurrentUser = async () => {
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch("/api/auth/me", {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setUser(data);
//         setEditForm({
//           name: data.username || "",
//           bio: data.bio || "",
//         });
//       } else {
//         setMessage(data.message || "Failed to fetch user");
//       }
//     } catch (err) {
//       setMessage("Error fetching user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch("/api/profile", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(editForm),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setUser(data);
//         setMessage("Profile updated successfully!");
//       } else {
//         setMessage(data.message || "Failed to update profile");
//       }
//     } catch (err) {
//       setMessage("Error updating profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= POSTS =================
//   const createPost = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch("/api/posts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(newPost),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage("Post created successfully!");
//         setPosts([data, ...posts]); // add to feed
//         setNewPost({ text: "", image: "" });
//       } else {
//         setMessage(data.error || "Failed to create post");
//       }
//     } catch (err) {
//       setMessage("Error creating post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAllPosts = async () => {
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch("/api/posts?page=1&limit=10");
//       const data = await res.json();
//       if (res.ok) {
//         setPosts(data);
//       } else {
//         setMessage("Failed to load posts");
//       }
//     } catch (err) {
//       setMessage("Error loading posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const getPostById = async () => {
//   //   if (!postId) return;
//   //   setLoading(true);
//   //   setMessage("");
//   //   try {
//   //     const res = await fetch(`/api/posts/${postId}`);
//   //     const data = await res.json();
//   //     if (res.ok) {
//   //       setSinglePost(data);
//   //     } else {
//   //       setMessage("Post not found");
//   //     }
//   //   } catch (err) {
//   //     setMessage("Error fetching post");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const getPostByText = async (text: string) => {
//     if (!text) return;
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch(`/api/posts?text=${encodeURIComponent(text)}`);
//       const data = await res.json();
//       if (res.ok) {
//         // If data is an array, pick the first one (or handle multiple)
//         setSinglePost(Array.isArray(data) ? data[0] : data);
//       } else {
//         setMessage("Post not found");
//         setSinglePost(null);
//       }
//     } catch (err) {
//       setMessage("Error fetching post");
//       setSinglePost(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deletePost = async (id: string) => {
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch(`/api/posts/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage("Post deleted!");
//         setPosts(posts.filter((p) => p._id !== id));
//       } else {
//         setMessage(data.error || "Failed to delete post");
//       }
//     } catch (err) {
//       setMessage("Error deleting post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= UI =================
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black-100 p-6">
//       <h1 className="text-3xl font-bold">Welcome Home 🎉</h1>

//       {/* User actions */}
//       <div className="flex gap-4">
//         <button
//           onClick={getCurrentUser}
//           className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
//         >
//           Get Current User
//         </button>
//       </div>

//       {/* Loading + Messages */}
//       {loading && <p className="text-gray-600">Loading...</p>}
//       {message && <p className="text-red-500">{message}</p>}

//       {/* User Info + Edit */}
//       {user && (
//         <div className="mt-6 p-6 border rounded-xl bg-white shadow-lg w-96">
//           <h2 className="font-semibold text-xl mb-4 text-gray-800">
//             User Profile
//           </h2>
//           <p>
//             <span className="font-medium">Name:</span> {user.username}
//           </p>
//           <p>
//             <span className="font-medium">Email:</span> {user.email}
//           </p>
//           <p>
//             <span className="font-medium">Bio:</span> {user.bio}
//           </p>

//           <form onSubmit={updateProfile} className="mt-4 space-y-3">
//             <input
//               className="w-full p-2 border rounded"
//               placeholder="Name"
//               value={editForm.name}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, name: e.target.value })
//               }
//             />
//             <input
//               className="w-full p-2 border rounded"
//               placeholder="Bio"
//               value={editForm.bio}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, bio: e.target.value })
//               }
//             />
//             <button
//               type="submit"
//               className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Save Changes
//             </button>
//           </form>
//         </div>
//       )}

//       {/* POSTS SECTION */}
//       <div className="w-full max-w-xl bg-blue p-6 rounded shadow space-y-6">
//         <h2 className="text-xl font-bold">Posts</h2>

//         {/* Create Post */}
//         <form onSubmit={createPost} className="space-y-3">
//           <textarea
//             className="w-full p-2 border rounded"
//             placeholder="What's on your mind?"
//             value={newPost.text}
//             onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
//             maxLength={280}
//           />
//           <input
//             className="w-full p-2 border rounded"
//             placeholder="Image URL (optional)"
//             value={newPost.image}
//             onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
//           />
//           <button
//             type="submit"
//             className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Create Post
//           </button>
//         </form>

//         {/* Get All Posts */}
//         <button
//           onClick={getAllPosts}
//           className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
//         >
//           Load All Posts
//         </button>

//         {/* Get Post By ID */}
//         {/* <div className="flex gap-2">
//           <input
//             className="flex-1 p-2 border rounded"
//             placeholder="Enter Post ID"
//             value={postId}
//             onChange={(e) => setPostId(e.target.value)}
//           />
//           <button
//             onClick={getPostById}
//             className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//           >
//             Get Post
//           </button>
//         </div> */}

//         <div>
//           {/* Other content */}
//           <button
//             onClick={() => router.push("/all-posts")}
//             className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//           >
//             Interact with All Posts
//           </button>
//         </div>

//         {posts.map((post) => (
//           <div
//             key={post._id || Math.random()}
//             className="p-4 border rounded space-y-2"
//           >
//             <p className="font-semibold">
//               {post.creator?.username || "Unknown"}
//             </p>
//             <p className="text-gray-800">{post.text || "No content"}</p>
//             {post.image && <img src={post.image} className="rounded mt-2" />}

//             <button
//               onClick={() => getPostByText(post.text)}
//               className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               View Post
//             </button>
//           </div>
//         ))}

//         {singlePost && (
//           <div className="mt-6 p-4 border rounded bg-gray-50">
//             <p className="font-semibold">
//               {singlePost.creator?.username || "Unknown"}
//             </p>
//             <p>{singlePost.text}</p>
//             {singlePost.image && (
//               <img src={singlePost.image} className="rounded mt-2" />
//             )}
//           </div>
//         )}

//         {/* Display single post if fetched */}
//         {singlePost && (
//           <div className="mt-6 p-4 border rounded bg-gray-50">
//             <p className="font-semibold">
//               {singlePost.creator?.username || "Unknown"}
//             </p>
//             <p>{singlePost.text}</p>
//             {singlePost.image && (
//               <img src={singlePost.image} className="rounded mt-2" />
//             )}
//           </div>
//         )}

//         {/* Single Post */}
//         {singlePost && (
//           <div className="p-4 border rounded bg-gray-50">
//             <p>{singlePost.text}</p>
//             {singlePost.image && (
//               <img src={singlePost.image} className="rounded mt-2" />
//             )}
//           </div>
//         )}

//         {/**\ */}

//         {/* <button
//           onClick={() => router.push("/interests")}
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//         >
//           View Interests
//         </button> */}
//         <div className="max-w-4xl mx-auto mt-10 p-6">
//           <h1 className="text-3xl font-bold mb-6">
//             Posts From People With Your Interests
//           </h1>
//           <InterestFeed />
//         </div>
//         {/* Posts Feed */}
//         <div className="space-y-4">
//           {posts.map((post) => (
//             <div key={post._id} className="p-4 border rounded">
//               <p>{post.text}</p>
//               {post.image && <img src={post.image} className="rounded mt-2" />}
//               <button
//                 onClick={() => deletePost(post._id)}
//                 className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 Delete
//               </button>
//               <h1>Created by you</h1>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InterestFeed from "@/app/postsPage/interestFeed";

interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  interests?: string[];
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editForm, setEditForm] = useState({ name: "", bio: "" });
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ text: "", image: "" });
  const [singlePost, setSinglePost] = useState<any>(null);

  // ======== NEW: Friends Suggestions ========
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);

  // ================= USER =================
  const getCurrentUser = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setEditForm({
          name: data.username || "",
          bio: data.bio || "",
        });
      } else {
        setMessage(data.message || "Failed to fetch user");
      }
    } catch (err) {
      setMessage("Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (err) {
      setMessage("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // ================= POSTS =================
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Post created successfully!");
        setPosts([data, ...posts]);
        setNewPost({ text: "", image: "" });
      } else {
        setMessage(data.error || "Failed to create post");
      }
    } catch (err) {
      setMessage("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  const getAllPosts = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/posts?page=1&limit=10");
      const data = await res.json();
      if (res.ok) setPosts(data);
      else setMessage("Failed to load posts");
    } catch (err) {
      setMessage("Error loading posts");
    } finally {
      setLoading(false);
    }
  };

  const getPostByText = async (text: string) => {
    if (!text) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/posts?text=${encodeURIComponent(text)}`);
      const data = await res.json();
      if (res.ok) setSinglePost(Array.isArray(data) ? data[0] : data);
      else {
        setMessage("Post not found");
        setSinglePost(null);
      }
    } catch (err) {
      setMessage("Error fetching post");
      setSinglePost(null);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setPosts(posts.filter((p) => p._id !== id));
      else setMessage(data.error || "Failed to delete post");
    } catch (err) {
      setMessage("Error deleting post");
    } finally {
      setLoading(false);
    }
  };

  // ================= FRIENDS SUGGESTIONS =================
  const fetchSuggestedUsers = async () => {
    if (!user) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/friendsSuggestion", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setSuggestedUsers(data.users);
      else setMessage(data.error || "Failed to fetch suggested users");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching suggested users");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black-100 p-6">
      <h1 className="text-3xl font-bold">Welcome Home 🎉</h1>

      {/* User actions */}
      <div className="flex gap-4">
        <button
          onClick={getCurrentUser}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Get Current User
        </button>

        {/* NEW BUTTON */}
        {/* <button
          onClick={fetchSuggestedUsers}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          Show Friends Suggestions
        </button> */}

        <button
          onClick={() => router.push("/people")}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          Show Friends Suggestions
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {message && <p className="text-red-500">{message}</p>}

      {/* Display suggested users */}
      {suggestedUsers.length > 0 && (
        <div className="mt-4 w-full max-w-md p-4 border rounded bg-white shadow space-y-2">
          <h2 className="text-xl font-semibold mb-2">Suggested Friends:</h2>
          {suggestedUsers.map((u) => (
            <div key={u._id} className="p-2 border rounded">
              <p className="font-medium">{u.username}</p>
            </div>
          ))}
        </div>
      )}

      {/* ================= EXISTING HOME PAGE CONTENT ================= */}
      {user && (
        <div className="mt-6 p-6 border rounded-xl bg-white shadow-lg w-96">
          <h2 className="font-semibold text-xl mb-4 text-gray-800">
            User Profile
          </h2>
          <p>
            <span className="font-medium">Name:</span> {user.username}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Bio:</span> {user.bio}
          </p>

          <form onSubmit={updateProfile} className="mt-4 space-y-3">
            <input
              className="w-full p-2 border rounded"
              placeholder="Name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Bio"
              value={editForm.bio}
              onChange={(e) =>
                setEditForm({ ...editForm, bio: e.target.value })
              }
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      <div className="w-full max-w-xl bg-blue p-6 rounded shadow space-y-6">
        {/* Posts Feed */}
        <form onSubmit={createPost} className="space-y-3">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="What's on your mind?"
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
            maxLength={280}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Image URL (optional)"
            value={newPost.image}
            onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Post
          </button>
        </form>

        <button
          onClick={getAllPosts}
          className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Load All Posts
        </button>

        {posts.map((post) => (
          <div
            key={post._id || Math.random()}
            className="p-4 border rounded space-y-2"
          >
            <p className="font-semibold">
              {post.creator?.username || "Unknown"}
            </p>
            <p className="text-gray-800">{post.text || "No content"}</p>
            {post.image && <img src={post.image} className="rounded mt-2" />}

            <button
              onClick={() => getPostByText(post.text)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View Post
            </button>
          </div>
        ))}

        {singlePost && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <p className="font-semibold">
              {singlePost.creator?.username || "Unknown"}
            </p>
            <p>{singlePost.text}</p>
            {singlePost.image && (
              <img src={singlePost.image} className="rounded mt-2" />
            )}
          </div>
        )}

        <div className="max-w-4xl mx-auto mt-10 p-6">
          <h1 className="text-3xl font-bold mb-6">
            Posts From People With Your Interests
          </h1>
          <InterestFeed />
        </div>
      </div>
    </div>
  );
}
