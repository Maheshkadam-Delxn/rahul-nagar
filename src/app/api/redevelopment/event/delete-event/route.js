
import { NextResponse } from "next/server";
import RedevelopmentEvent from "../../../../../../utils/models/RedevelopmentEvent.js"
import connectDb from "../../../../../../utils/connectDb.js"
import jwt from "jsonwebtoken";



export async function DELETE(req) {
  try {
    await connectDb();

    // Extract data from request
    const { eventId, userId } = await req.json();

    // Find the event
    const event = await RedevelopmentEvent.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Extract authorization token from request headers
    const authHeader = req.headers.get("authorization");
    let role = "Association-Member"; // Default role
    let tokenUserId = null;

    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1]; // Extract Bearer token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        role = decoded.role; // Extract role
        tokenUserId = decoded.id; // Extract user ID
      } catch (error) {
        return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
      }
    }

    // **Super-Admin & Admin: Can delete any event**
    if (role === "Super-Admin" || role === "Admin") {
      await RedevelopmentEvent.findByIdAndDelete(eventId);
      return NextResponse.json({ success: true, message: "Event deleted successfully" });
    }

    // **Association-Members: Can delete only their own events**
    if (role === "Association-Member") {
      if (event.createdBy?.toString() === userId) {
        await RedevelopmentEvent.findByIdAndDelete(eventId);
        return NextResponse.json({ success: true, message: "Event deleted successfully" });
      } else {
        return NextResponse.json({ error: "Access Denied: You can only delete your own events" }, { status: 403 });
      }
    }

    return NextResponse.json({ error: "Unauthorized request" }, { status: 403 });

  } catch (error) {
    console.error("Error in delete-event API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

