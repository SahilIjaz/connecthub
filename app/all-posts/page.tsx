// "use client";

// import { useEffect, useState } from "react";

// interface User {
//   _id: string;
//   username: string;
// }

// interface Comment {
//   _id: string;
//   text: string;
//   user: User;
// }

// interface Post {
//   _id: string;
//   text: string;
//   image?: string;
//   creator: User;
//   likes?: string[]; // array of user IDs as strings
//   comments?: Comment[];
// }

// export default function AllPostsPage() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
//     {}
//   );
//   const [user, setUser] = useState<User | null>(null);

//   // Fetch current user
//   const getCurrentUser = async () => {
//     try {
//       const res = await fetch("/api/auth/me", { credentials: "include" });
//       const data = await res.json();
//       if (res.ok) setUser(data);
//     } catch (err) {
//       console.error("Error fetching user");
//     }
//   };

//   // Fetch all posts
//   const getAllPosts = async () => {
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch("/api/posts?page=1&limit=50");
//       const data = await res.json();
//       if (res.ok) {
//         // Convert ObjectId likes to string if needed
//         const formattedPosts = data.map((p: any) => ({
//           ...p,
//           likes: (p.likes || []).map((id: any) => id.toString()),
//         }));
//         setPosts(formattedPosts);
//       } else setMessage("Failed to load posts");
//     } catch (err) {
//       setMessage("Error loading posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getCurrentUser();
//     getAllPosts();
//   }, []);

//   const toggleLike = async (postId: string) => {
//     if (!user) return;
//     try {
//       const res = await fetch(`/api/likePost?postId=${postId}`, {
//         method: "POST",
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setPosts((prevPosts) =>
//           prevPosts.map((p) =>
//             p._id === postId
//               ? {
//                   ...p,
//                   likes: data.liked
//                     ? [...(p.likes || []), user._id]
//                     : (p.likes || []).filter((id) => id !== user._id),
//                 }
//               : p
//           )
//         );
//       } else {
//         console.error(data.error);
//       }
//     } catch (err) {
//       console.error("Error toggling like", err);
//     }
//   };

//   // Add comment
//   //   const addComment = async (e: React.FormEvent, postId: string) => {
//   //     e.preventDefault();
//   //     const text = commentInputs[postId]?.trim();
//   //     if (!text || !user) return;

//   //     try {
//   //       const res = await fetch(`/api/commentPost/${postId}/comments`, {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         credentials: "include",
//   //         body: JSON.stringify({ text }),
//   //       });
//   //       const data = await res.json();
//   //       if (res.ok) {
//   //         setPosts((prevPosts) =>
//   //           prevPosts.map((p) =>
//   //             p._id === postId
//   //               ? { ...p, comments: [...(p.comments || []), data.comment] }
//   //               : p
//   //           )
//   //         );
//   //         setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
//   //       } else {
//   //         console.error(data.error);
//   //       }
//   //     } catch (err) {
//   //       console.error("Error adding comment");
//   //     }
//   //   };

//   const addComment = async (e: React.FormEvent, postId: string) => {
//     e.preventDefault();
//     const text = commentInputs[postId]?.trim();
//     if (!text || !user) return;

//     try {
//       // Send postId as query param
//       const res = await fetch(`/api/commentPost?postId=${postId}`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setPosts((prevPosts) =>
//           prevPosts.map((p) =>
//             p._id === postId
//               ? { ...p, comments: [...(p.comments || []), data.comment] }
//               : p
//           )
//         );

//         setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
//       } else {
//         console.error(data.error);
//       }
//     } catch (err) {
//       console.error("Error adding comment", err);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-black-100">
//       <h1 className="text-3xl font-bold mb-6">All Posts</h1>

//       {loading && <p>Loading...</p>}
//       {message && <p className="text-red-500">{message}</p>}

//       <div className="space-y-4">
//         {posts.map((post) => (
//           <div key={post._id} className="p-4 border rounded bg-blue shadow">
//             <p className="font-semibold">
//               {post.creator?.username || "Unknown"}
//             </p>
//             <p>{post.text}</p>
//             {post.image && <img src={post.image} className="rounded mt-2" />}

//             {/* Like button */}
//             <div className="mt-2 flex gap-2">
//               <button
//                 onClick={() => toggleLike(post._id)}
//                 className={`px-3 py-1 rounded ${
//                   post.likes?.includes(user?._id || "")
//                     ? "bg-red-500 text-white"
//                     : "bg-gray-300"
//                 }`}
//               >
//                 {post.likes?.length || 0} ❤️
//               </button>
//             </div>

//             {/* Comment form */}
//             <div className="mt-2">
//               <form
//                 onSubmit={(e) => addComment(e, post._id)}
//                 className="flex gap-2"
//               >
//                 <input
//                   type="text"
//                   placeholder="Add a comment..."
//                   value={commentInputs[post._id] || ""}
//                   onChange={(e) =>
//                     setCommentInputs((prev) => ({
//                       ...prev,
//                       [post._id]: e.target.value,
//                     }))
//                   }
//                   className="flex-1 p-2 border rounded"
//                 />
//                 <button
//                   type="submit"
//                   className="px-3 py-1 bg-blue-500 text-white rounded"
//                 >
//                   Comment
//                 </button>
//               </form>

//               {/* Display comments */}
//               <div className="mt-2 space-y-1">
//                 {post.comments?.map((c) => (
//                   <div key={c._id}>
//                     <span className="font-bold">{c.user.username}</span>:{" "}
//                     {c.text}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
}

interface Comment {
  _id: string;
  text: string;
  user: User;
}

interface Post {
  _id: string;
  text: string;
  image?: string;
  creator: User;
  likes?: string[]; // array of user IDs as strings
  comments?: Comment[];
}

export default function AllPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const [user, setUser] = useState<User | null>(null);

  // Fetch current user
  const getCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (res.ok) setUser(data);
    } catch (err) {
      console.error("Error fetching user");
    }
  };

  // Fetch all posts
  const getAllPosts = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/posts?page=1&limit=50");
      const data = await res.json();
      if (res.ok) {
        const formattedPosts = data.map((p: any) => ({
          ...p,
          likes: (p.likes || []).map((id: any) => id.toString()),
        }));
        setPosts(formattedPosts);
      } else setMessage("Failed to load posts");
    } catch (err) {
      setMessage("Error loading posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getAllPosts();
  }, []);

  const toggleLike = async (postId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/likePost?postId=${postId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  likes: data.liked
                    ? [...(p.likes || []), user._id]
                    : (p.likes || []).filter((id) => id !== user._id),
                }
              : p
          )
        );
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error toggling like", err);
    }
  };

  // Add comment
  const addComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text || !user) return;

    try {
      const res = await fetch(`/api/commentPost?postId=${postId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (res.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId
              ? { ...p, comments: [...(p.comments || []), data.comment] }
              : p
          )
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-black-100">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>

      {loading && <p>Loading...</p>}
      {message && <p className="text-red-500">{message}</p>}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="p-4 border rounded bg-blue shadow">
            <p className="font-semibold">
              {post.creator?.username || "Unknown"}
            </p>
            <p>{post.text}</p>
            {post.image && <img src={post.image} className="rounded mt-2" />}

            {/* Like button */}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => toggleLike(post._id)}
                className={`px-3 py-1 rounded ${
                  post.likes?.includes(user?._id || "")
                    ? "bg-red-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {post.likes?.length || 0} ❤️
              </button>
            </div>

            {/* Comment form */}
            <div className="mt-2">
              <form
                onSubmit={(e) => addComment(e, post._id)}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post._id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post._id]: e.target.value,
                    }))
                  }
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Comment
                </button>
              </form>

              {/* Comment heading */}
              {post.comments && post.comments.length > 0 && (
                <p className="mt-2 font-semibold">Comments:</p>
              )}

              {/* Display comments */}
              <div className="mt-1 space-y-1">
                {post.comments?.map((c) => (
                  <div key={c._id}>
                    <span className="font-bold">{c.user.username}</span>:{" "}
                    {c.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
