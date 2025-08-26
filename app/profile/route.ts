// /app/api/profile/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as { id: string };

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: body },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
