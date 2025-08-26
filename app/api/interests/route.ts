import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Interest from "@/app/models/interest";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Interest name is required" },
        { status: 400 }
      );
    }

    // Create interest
    const newInterest = await Interest.create({ name });

    return NextResponse.json(
      { success: true, data: newInterest },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Interest from "@/models/Interest";

// Get all interests
export async function GET() {
  try {
    await connectDB();
    const interests = await Interest.find({});
    return NextResponse.json({ success: true, data: interests });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
