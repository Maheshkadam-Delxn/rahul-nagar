import { NextResponse } from "next/server";
import connectDb from "../../../../../utils/connectDb";
import Notification from "../../../../../utils/models/Updates";

export async function GET() {
    await connectDb();
    try {
        const notifications = await Notification.find();
        return NextResponse.json(notifications, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}