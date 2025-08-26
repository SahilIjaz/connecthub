import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    if (!postId)
      return NextResponse.json(
        { error: "No postId provided" },
        { status: 400 }
      );

    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];
    if (!token)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as { id: string };
    const userId = decoded.id;

    const post = await Post.findById(postId);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const alreadyLiked = post.likes.some(
      (id: mongoose.Types.ObjectId | string) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id: mongoose.Types.ObjectId | string) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId as any); // push string ID
    }

    await post.save();
    return NextResponse.json({ liked: !alreadyLiked });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
