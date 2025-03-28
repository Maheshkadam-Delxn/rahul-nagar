import { NextResponse } from "next/server";
import connectDb from "../../../../../utils/connectDb";
import Updates from "../../../../../utils/models/Updates";


export async function GET(req) {
    await connectDb();
    try {
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")) : null;

        let query = Updates.find({}).sort({ createdAt: -1 });

        if (limit) {
            query = query.limit(limit);
        }

        const updates = await query.exec();

        console.log(`Fetched ${updates.length} updates`);
        if (updates.length > 0) {
            console.log("Sample update structure:", updates[0]);
        }

        return NextResponse.json(updates);
    } catch (error) {
        console.error("Error fetching updates:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
