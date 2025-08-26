// // pages/api/search/users.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import { connectDB } from "@/app/lib/db";
// import User from "@/app/models/user"; // your User model

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { q } = req.query;
//   if (!q || typeof q !== "string")
//     return res.status(400).json({ error: "Query missing" });

//   try {
//     await connectDB();
//     const users = await User.find({
//       username: { $regex: q, $options: "i" },
//     }).limit(20);
//     res.status(200).json({ users });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/user"; // your Mongoose model
import { connectDB } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  try {
    const users = await User.find({
      username: { $regex: q, $options: "i" },
    }).limit(20);

    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
