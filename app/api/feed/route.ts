import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import User from "@/app/models/user";
import { getUserFromToken } from "@/app/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findById(user.id).populate("interests");
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const posts = await Post.find()
      .populate("creator", "username profilePicture interests")
      .sort({ createdAt: -1 });

    const filtered = posts.filter((p: any) =>
      p.creator.interests.some((i: any) =>
        dbUser.interests.some(
          (ui: any) => ui._id.toString() === i._id.toString()
        )
      )
    );

    return NextResponse.json(filtered);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
