import { NextResponse } from "next/server";
import connectDb from "../../../../../utils/connectDb";
import Notification from "../../../../../utils/models/Updates";

export async function DELETE(req) {
    await connectDb();
    try {
        const body= await req.json();
        const id = body?.id?._id
        console.log(id)
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Notification deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}