import { NextResponse } from "next/server";
import Blog from "../../../../../utils/models/Blog.js";
import connectDb from "../../../../../utils/connectDb";

export async function POST(req) {
  try {
    await connectDb();

    const { title, description, image, category, tags, authorName, createdBy } =
      await req.json();

    // Validate required fields
    if (!title || !description || !authorName || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newBlog = new Blog({
      title,
      description,
      image,
      category,
      tags,
      authorName,
      createdBy,
    });

    await newBlog.save();

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error("Error in add-blog API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
