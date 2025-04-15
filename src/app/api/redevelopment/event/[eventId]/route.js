import { NextResponse } from "next/server";
// import Event from "../../../../../utils/models/Events.js";
import RedevelopmentEvent from "../../../../../../utils/models/RedevelopmentEvent.js"
// import connectDb from "../../../../../utils/connectDb.js";
import connectDb from "../../../../../../utils/connectDb.js"


export async function GET(req, { params }) {
  try {
    await connectDb();

    const { eventId } = params; // Extract eventId correctly

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const event = await RedevelopmentEvent.findById(eventId);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, event });

  } catch (error) {
    console.error("Error fetching event details:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
