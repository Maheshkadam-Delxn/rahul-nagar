import { NextResponse } from "next/server";
import connectDb from "../../../../../utils/connectDb";
import Updates from "../../../../../utils/models/Updates";

export async function GET() {
    await connectDb();
    try {
        // Get all updates, sort by most recent first
        const updates = await Updates.find({}).sort({ createdAt: -1 });
        
        // You can also log a sample update to check the structure
        if (updates.length > 0) {
            console.log("Sample update structure:", updates[0]);
        }
        
        return NextResponse.json(updates);
    } catch (error) {
        console.error('Error fetching updates:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}