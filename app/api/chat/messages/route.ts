// /app/api/chat/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import Message from "@/app/models/message"; // Your Message model
import { connectDB } from "@/app/lib/db"; // Import your existing DB connection (runs once)

export async function GET(req: NextRequest) {
  connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const receiverId = searchParams.get("receiverId");
    const userId = searchParams.get("userId"); // Current user

    if (!receiverId || !userId) {
      return NextResponse.json(
        { error: "Missing userId or receiverId" },
        { status: 400 }
      );
    }

    // Fetch messages between the current user and receiver
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
