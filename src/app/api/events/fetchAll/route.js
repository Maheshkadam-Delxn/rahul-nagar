import { NextResponse } from 'next/server';
import Event  from '../../../../../utils/models/Events.js';
import connectDb from "../../../../../utils/connectDb";
export async function GET() {
  try {
    await connectDb();

    // Fetch all events, sorted by latest created
    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, events });

  } catch (error) {
    console.error("Error in fetch-all-events API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
