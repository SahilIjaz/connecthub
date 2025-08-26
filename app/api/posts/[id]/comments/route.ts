import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import { getUserFromToken } from "@/app/lib/auth";

import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Post from "@/models/Post";
// import getUserFromToken from "@/lib/getUserFromToken";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const { id } = params;
  const body = await req.json();
  const { text } = body;

  const user = await getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!text)
    return NextResponse.json(
      { error: "Comment text required" },
      { status: 400 }
    );

  const post = await Post.findById(id);
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  // Add comment
  post.comments = post.comments || [];
  post.comments.push({ user: user.id, text, createdAt: new Date() });
  await post.save();

  return NextResponse.json(
    {
      message: "Comment added",
      comment: post.comments[post.comments.length - 1],
    },
    { status: 201 }
  );
}

// Get all comments with username:

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const { id } = params;

  const post = await Post.findById(id).populate("comments.user", "username");
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post.comments, { status: 200 });
}
