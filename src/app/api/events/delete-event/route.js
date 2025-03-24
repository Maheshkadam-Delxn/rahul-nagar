import { NextResponse } from 'next/server';
import Event  from '../../../../../utils/models/Events.js';
import connectDb from "../../../../../utils/connectDb";
import jwt from "jsonwebtoken";


export async function DELETE(req) {
  try {
    await connectDb();

    const { eventId, userId } = await req.json();

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Extract token from request headers (if present)
    const token = req.headers.get("authorization")?.split(" ")[1];

    let role = "sub"; // Default role is 'sub' (since subs don't have tokens)
    let tokenUserId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        role = decoded.role; // Extract role from token
        tokenUserId = decoded.id; // Extract userId from token
      } catch (error) {
        return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
      }
    }

    // **Super Admin: Can delete any event (Token Required)**
    if (role === "super") {
      // Allow deletion
      await Event.findByIdAndDelete(eventId);
      return NextResponse.json({ success: true, message: "Event deleted successfully" });
    }

    // **Sub Admin: Can only delete their own events (No Token Needed)**
    if (role === "sub" && event.createdBy.toString() === userId) {
      await Event.findByIdAndDelete(eventId);
      return NextResponse.json({ success: true, message: "Event deleted successfully" });
    }

    return NextResponse.json({ error: "Access Denied" }, { status: 403 });

  } catch (error) {
    console.error("Error in delete-event API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

