import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import { getUserFromToken } from "@/app/lib/auth";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const post = await Post.findById(params.id).populate(
    "creator",
    "username avatar"
  );

  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const user = await getUserFromToken(req);

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await Post.findById(params.id);
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  if (post.creator.toString() !== user.id.toString()) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await post.deleteOne();
  return NextResponse.json({ message: "Post deleted successfully" });
}
