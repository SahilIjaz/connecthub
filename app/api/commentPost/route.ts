// // import type { NextApiRequest, NextApiResponse } from "next";

// // import { connectDB } from "@/app/lib/db"; // your MongoDB connection
// // import Post from "@/app/models/post";
// // import { getUserFromToken } from "@/app/lib/auth"; // or your auth logic

// // export default async function handler(
// //   req: NextApiRequest,
// //   res: NextApiResponse
// // ) {
// //   if (req.method !== "POST")
// //     return res.status(405).json({ error: "Method not allowed" });

// //   await connectDB();

// //   const session = await getUserFromToken({ req });
// //   if (!session) return res.status(401).json({ error: "Not authenticated" });

// //   const userId = session.user.id;
// //   const { text } = req.body;

// //   try {
// //     const post = await Post.findById(req.query.postId);
// //     if (!post) return res.status(404).json({ error: "Post not found" });

// //     const comment = { user: userId, text };
// //     post.comments.push(comment);
// //     await post.save();

// //     // populate user for front-end
// //     const populatedComment = await Post.populate(comment, {
// //       path: "user",
// //       select: "username",
// //     });

// //     res.status(200).json({ comment: populatedComment });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // }

// import type { NextApiRequest, NextApiResponse } from "next";
// import { connectDB } from "@/app/lib/db";
// import Post from "@/app/models/post";
// import { getUserFromToken } from "@/app/lib/auth";

// interface CommentResponse {
//   _id: string;
//   text: string;
//   user: {
//     _id: string;
//     username: string;
//   };
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST")
//     return res.status(405).json({ error: "Method not allowed" });

//   await connectDB();

//   // Get user from token
//   const decoded = getUserFromToken(req as any); // cast because your function expects Request
//   if (!decoded) return res.status(401).json({ error: "Not authenticated" });

//   const userId = decoded.id;
//   const username = decoded.username;
//   const { text } = req.body;

//   if (!text || text.trim() === "")
//     return res.status(400).json({ error: "Comment text is required" });

//   try {
//     const post = await Post.findById(req.query.postId);
//     if (!post) return res.status(404).json({ error: "Post not found" });

//     // Create comment
//     const comment = {
//       user: userId,
//       text,
//     };
//     post.comments.push(comment);
//     await post.save();

//     // Return the comment with user info directly
//     const responseComment: CommentResponse = {
//       _id: post.comments[post.comments.length - 1]._id.toString(),
//       text,
//       user: {
//         _id: userId,
//         username,
//       },
//     };

//     res.status(200).json({ comment: responseComment });
//   } catch (err) {
//     console.error("Error adding comment:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import jwt from "jsonwebtoken";

interface CommentResponse {
  _id: string;
  text: string;
  user: {
    _id: string;
    username: string;
  };
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    if (!postId)
      return NextResponse.json(
        { error: "No postId provided" },
        { status: 400 }
      );

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
    ) as {
      id: string;
      username: string;
    };
    const userId = decoded.id;
    const username = decoded.username;

    const { text } = await req.json();
    if (!text || text.trim() === "")
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      );

    const post = await Post.findById(postId);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // Add comment
    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    const responseComment: CommentResponse = {
      _id: post.comments[post.comments.length - 1]._id.toString(),
      text,
      user: { _id: userId, username },
    };

    return NextResponse.json({ comment: responseComment });
  } catch (err: any) {
    console.error("Error adding comment:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
