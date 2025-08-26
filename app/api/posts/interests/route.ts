import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import User from "@/app/models/user";
import Post from "@/app/models/post";

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Get logged-in user
    const currentUser = await getUserFromToken(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find the logged-in user's interests
    const user = await User.findById(currentUser.id).populate("interests");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const interests = user.interests.map((i: any) => i._id);

    // 3. Find all users with those interests
    const usersWithSameInterests = await User.find({
      interests: { $in: interests },
    }).select("_id");

    const userIds = usersWithSameInterests.map((u: any) => u._id);

    // 4. Find posts by those users
    const posts = await Post.find({ creator: { $in: userIds } })
      .populate("creator", "username profilePicture interests")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (err: any) {
    console.error("Error in GET /api/posts/interests:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
