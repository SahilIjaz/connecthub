import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import { getUserFromToken } from "@/app/lib/auth"; // your auth helper

import { NextRequest, NextResponse } from "next/server";
// your auth helper

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const { id } = params;
  const user = await getUserFromToken(req); // get current user
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const likedIndex = post.likes.indexOf(user.id);
  let liked = false;

  if (likedIndex === -1) {
    post.likes.push(user.id); // like
    liked = true;
  } else {
    post.likes.splice(likedIndex, 1); // unlike
  }

  await post.save();
  return NextResponse.json(
    { likes: post.likes.length, liked },
    { status: 200 }
  );
}
