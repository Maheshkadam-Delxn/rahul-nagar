import { NextResponse } from "next/server";
import RedevelopmentUpdate from "../../../../../../utils/models/RedevelopmentUpdates.js"
import connectDb from "../../../../../../utils/connectDb.js"
export async function PUT(req) {
    await connectDb();
    try {
        const {...updateData } = await req.json();
        const notification = await RedevelopmentUpdate.findByIdAndUpdate(updateData.updateId, updateData, { new: true, runValidators: true });
        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }
        return NextResponse.json(notification, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}