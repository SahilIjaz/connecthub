// // lib/auth.ts
// import jwt from "jsonwebtoken";
// import User from "@/app/models/user"; // make sure you import your User model
// import { connectDB } from "@/app/lib/db"; // your db connection helper

// const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // keep in .env in production!

// // Extract user from token
// export const getUserFromToken = async (token: string) => {
//   try {
//     if (!token) return null;

//     // 1. Verify token
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

//     // 2. Connect DB (important if using Next.js API routes)
//     await connectDB();

//     // 3. Fetch user from DB
//     const user = await User.findById(decoded.id).select("-password"); // don’t return password

//     return user;
//   } catch (err) {
//     console.error("Error in getUserFromToken:", err);
//     return null;
//   }
// };

import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  username: string;
  email?: string;
}

export function getUserFromToken(req: Request) {
  try {
    // Extract cookie header
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/access_token=([^;]+)/);

    if (!match) return null;

    const token = match[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    return decoded; // contains id, username, etc.
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
