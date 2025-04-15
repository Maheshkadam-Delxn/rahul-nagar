
import { NextResponse } from "next/server";
import RedevelopmentEvent from "../../../../../../utils/models/RedevelopmentEvent.js"
import connectDb from "../../../../../../utils/connectDb.js"
import jwt from "jsonwebtoken";



export async function PUT(req) {
  try {
    await connectDb();

    const { eventId, title, description, date, time, location, image, userId, role,document } = await req.json();

    // Find the event by ID
    const event = await RedevelopmentEvent.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

 
    // Update event details
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.image = image;
    event.document = document
    console.log(event.image)
    await event.save();

    return NextResponse.json({ success: true, event });

  } catch (error) {
    console.error("Error in update-event API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

