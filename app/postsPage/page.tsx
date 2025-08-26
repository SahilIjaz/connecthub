"use client";

import { useState } from "react";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, image }),
    });
    setText("");
    setImage("");
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={280}
        placeholder="What's on your mind?"
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL (optional)"
        className="w-full border p-2 my-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Post
      </button>
    </form>
  );
}
