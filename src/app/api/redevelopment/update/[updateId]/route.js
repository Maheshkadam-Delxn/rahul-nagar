import { NextResponse } from "next/server";
import RedevelopmentUpdate from "../../../../../../utils/models/RedevelopmentUpdates.js"
import connectDb from "../../../../../../utils/connectDb.js"

export async function GET(req, { params }) {
    try {
        await connectDb();
        
        const { updateId } = params; // ✅ Extract update ID from URL

        if (!updateId) {
            return NextResponse.json({ error: "Update ID is required" }, { status: 400 });
        }

        // Fetch update by ID
        const update = await RedevelopmentUpdate.findById(updateId);

        if (!update) {
            return NextResponse.json({ error: "Update not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, update });

    } catch (error) {
        console.error("Error fetching update details:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}