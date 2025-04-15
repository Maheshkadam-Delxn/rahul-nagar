import { NextResponse } from "next/server";
import RedevelopmentEvent from "../../../../../../utils/models/RedevelopmentEvent.js"
import connectDb from "../../../../../../utils/connectDb.js"


export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")) : null;

    let query = RedevelopmentEvent.find().sort({ createdAt: -1 });
    
    if (limit) {
      query = query.limit(limit);
    }

    const events = await query.exec();

    return NextResponse.json({ success: true, events });

  } catch (error) {
    console.error("Error in fetch-all-events API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
