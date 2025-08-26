"use client";

import { useEffect, useState } from "react";
console.log("tpo get all posts by interests");
export default function InterestFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/feed", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setPosts(data);
        } else {
          setMessage(data.error || "Failed to fetch posts");
        }
      } catch (err) {
        setMessage("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Posts from people with your interests ✨
      </h2>

      {loading && <p className="text-gray-600">Loading...</p>}
      {message && <p className="text-red-500">{message}</p>}

      {posts.length === 0 && !loading && (
        <p className="text-gray-500">No posts found yet.</p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={post.creator.profilePicture || "/default-avatar.png"}
                alt={post.creator.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{post.creator.username}</p>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-800">{post.text}</p>
            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="mt-2 rounded-lg max-h-60 object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
