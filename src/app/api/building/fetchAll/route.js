import { NextResponse } from "next/server";
import connectDb from "../../../../../utils/connectDb";
import Building from "../../../../../utils/models/Building";

// Fetch all buildings
export async function GET() {
    try {
        await connectDb();
        const buildings = await Building.find({});
        return NextResponse.json(buildings, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching buildings", error }, { status: 500 });
    }
}
