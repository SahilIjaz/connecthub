// /app/api/friendsSuggestions/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Get token from cookies
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

    // Get logged-in user
    const loggedInUser = await User.findById(decoded.id).populate("interests");
    if (!loggedInUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Find users with at least one matching interest (excluding self)
    const suggestedUsers = await User.find({
      _id: { $ne: loggedInUser._id },
      interests: { $in: loggedInUser.interests.map((i: any) => i._id) },
    }).select("username interests");

    return NextResponse.json({ users: suggestedUsers });
  } catch (err: any) {
    console.error("Error fetching friends suggestions:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
