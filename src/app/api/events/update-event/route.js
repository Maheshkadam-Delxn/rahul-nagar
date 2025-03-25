import { NextResponse } from 'next/server';
import Event  from '../../../../../utils/models/Events.js';
import connectDb from "../../../../../utils/connectDb";
import jwt from "jsonwebtoken";



export async function PUT(req) {
  try {
    await connectDb();

    const { eventId, title, description, date, time, location, image, userId, role } = await req.json();

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

 
    // Update event details
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.image = image || event.image;

    await event.save();

    return NextResponse.json({ success: true, event });

  } catch (error) {
    console.error("Error in update-event API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

