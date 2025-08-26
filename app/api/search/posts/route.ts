// app/api/search/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import Post from "@/app/models/post";
import { connectDB } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q) {
      return NextResponse.json({ posts: [] });
    }

    const posts = await Post.find({ text: { $regex: q, $options: "i" } })
      .populate("creator", "username")
      .limit(20);

    return NextResponse.json({ posts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
