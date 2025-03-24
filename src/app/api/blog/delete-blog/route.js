import { NextResponse } from "next/server";
import Blog from "../../../../../utils/models/Post.js";
import connectDb from "../../../../../utils/connectDb";

export async function DELETE(req) {
  try {
    await connectDb();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
