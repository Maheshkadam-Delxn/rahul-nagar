import { NextResponse } from "next/server";
import connectDb from "../../../../../utils/connectDb";
import Notification from "../../../../../utils/models/Updates";

export async function POST(req) {
    await connectDb();
    try {
        const body = await req.json();
        console.log(body)
        const notification = new Notification(body);
        await notification.save();
        return NextResponse.json(notification, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}