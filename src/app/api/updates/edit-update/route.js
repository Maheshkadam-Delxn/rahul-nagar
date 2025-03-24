import { NextResponse } from "next/server";
import connectDb from "../../../../../utils/connectDb";
import Notification from "../../../../../utils/models/Updates";
export async function PUT(req) {
    await connectDb();
    try {
        const { id, ...updateData } = await req.json();
        const notification = await Notification.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }
        return NextResponse.json(notification, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}