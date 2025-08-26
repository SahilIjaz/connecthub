"use client";

import { useEffect, useState } from "react";

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/posts?page=1&limit=10")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className="p-4 border-b">
          <div className="flex items-center gap-2">
            <img src={post.creator.avatar} className="w-8 h-8 rounded-full" />
            <span className="font-bold">{post.creator.username}</span>
          </div>
          <p className="my-2">{post.text}</p>
          {post.image && <img src={post.image} className="rounded" />}
        </div>
      ))}
    </div>
  );
}
