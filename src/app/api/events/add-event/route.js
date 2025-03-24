import { NextResponse } from 'next/server';
import Event  from '../../../../../utils/models/Events.js';
import connectDb from "../../../../../utils/connectDb";

export async function POST(req) {
  try {
    await connectDb();

    const { title, description, date, time, location, image, createdBy } = await req.json();

    // Ensure `createdBy` (admin ID) is provided
    if (!createdBy) {
      return NextResponse.json({ error: "createdBy (Admin ID) is required" }, { status: 400 });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      image,
      createdBy, // Store the ID of the admin creating the event
    });

    await newEvent.save();

    return NextResponse.json({ success: true, event: newEvent });

  } catch (error) {
    console.error("Error in add-event API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

