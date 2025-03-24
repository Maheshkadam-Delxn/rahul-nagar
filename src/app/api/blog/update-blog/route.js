import { NextResponse } from "next/server";
import Blog from "../../../../../utils/models/Post.js";
import connectDb from "../../../../../utils/connectDb";

export async function PUT(req) {
  try {
    await connectDb();

    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog: updatedBlog }, { status: 200 });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
