import { NextResponse } from "next/server";
import Blog from "../../../../../utils/models/Post.js";
import connectDb from "../../../../../utils/connectDb";

export async function POST(req) {
  try {
    await connectDb();

    let body;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
      if (body.tags) body.tags = JSON.parse(body.tags); // Convert string to array
    }

    const { title, description, image, category, tags, authorName, createdBy } = body;

    console.log(title, description, image, category, tags, authorName, createdBy);


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
