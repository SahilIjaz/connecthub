import { NextResponse } from "next/server";
import { getUserFromToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";

export async function POST(req: Request) {
  await connectDB();
  const user = await getUserFromToken(req);

  console.log("user is : ", user);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text, image } = await req.json();
  if (!text || text.length > 280) {
    return NextResponse.json(
      { error: "Text is required and must be ≤ 280 chars" },
      { status: 400 }
    );
  }

  const newPost = await Post.create({
    text,
    image: image || null,
    creator: user.id,
  });

  return NextResponse.json(newPost, { status: 201 });
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("creator", "username avatar");

  return NextResponse.json(posts);
}
