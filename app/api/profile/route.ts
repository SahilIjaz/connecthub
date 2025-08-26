// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user";
// a helper to decode JWT from cookies
import { getUserFromToken } from "@/app/lib/auth";
export async function PATCH(req: Request) {
  try {
    await connectDB();

    const userId = await getUserFromToken(req); // extract from cookie/session
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, interests } = body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { username: name }),
        ...(bio && { bio }),
        ...(interests && { interests }), // should be array of interest IDs
      },
      { new: true }
    ).populate("interests", "name"); // so we get proper names back

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
