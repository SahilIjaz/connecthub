import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();
console.log("Login attempt:", email, password);
// return
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }
console.log('user is: ',user)
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

  const token = jwt.sign(
  {
    id: user._id.toString(),  // 👈 fix here
    username: user.username,
  } as jwt.JwtPayload,         // 👈 helps TypeScript
  process.env.JWT_SECRET || "default_secret",
  { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
);
console.log('tokeb is : ',token)
    const res = NextResponse.json({ message: "Login successful", user });
    res.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
