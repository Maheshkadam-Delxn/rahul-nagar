import { NextResponse } from "next/server";
import Blog from "../../../../../utils/models/Post.js";
import connectDb from "../../../../../utils/connectDb";

export async function GET() {
  try {
    await connectDb();

    const blogs = await Blog.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, blogs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
