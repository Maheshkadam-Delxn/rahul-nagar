import { NextResponse } from "next/server";
import Event from "../../../../../utils/models/Events.js";
import connectDb from "../../../../../utils/connectDb";

export async function POST(req) {
  try {
    await connectDb();

    // ✅ Handle FormData instead of JSON
    const { title, description, date, time, location, image, createdBy } = await req.json();

    if (!createdBy) {
      return NextResponse.json({ error: "createdBy (Admin ID) is required" }, { status: 400 });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      image, // If handling file uploads, store file path instead
      createdBy,
    });

    await newEvent.save();

    return NextResponse.json({ success: true, event: newEvent });

  } catch (error) {
    console.error("Error in add-event API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
