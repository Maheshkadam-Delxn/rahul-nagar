import { NextResponse } from "next/server";
import RedevelopmentUpdate from "../../../../../../utils/models/RedevelopmentUpdates.js"
import connectDb from "../../../../../../utils/connectDb.js"
export async function DELETE(req) {
    await connectDb();
    try {
        const body= await req.json();
        const id = body?.updateId
        console.log(id)
        const notification = await RedevelopmentUpdate.findByIdAndDelete(id);
        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Notification deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}