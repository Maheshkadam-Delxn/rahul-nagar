import { NextResponse } from "next/server";
import RedevelopmentEvent from "../../../../../../utils/models/RedevelopmentEvent.js"
import connectDb from "../../../../../../utils/connectDb.js"
import jwt from "jsonwebtoken";

export async function DELETE(req) {
  try {
    await connectDb();
    
    // Extract data from request
    const { eventId } = await req.json();
    
    // Find the event
    const event = await RedevelopmentEvent.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    
    // Extract authorization token from request headers
    const authHeader = req.headers.get("authorization");
    let role = "Association-Member"; // Default role
    
    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1]; // Extract Bearer token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        role = decoded.role; // Extract role
      } catch (error) {
        return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
      }
    }
    
    // Check if user has permission to delete events
    if (["Super-Admin", "Admin", "Association-Member"].includes(role)) {
      await RedevelopmentEvent.findByIdAndDelete(eventId);
      return NextResponse.json({ success: true, message: "Event deleted successfully" });
    }
    
    return NextResponse.json({ error: "Unauthorized request" }, { status: 403 });
    
  } catch (error) {
    console.error("Error in delete-event API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}