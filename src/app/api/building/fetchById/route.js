import { NextResponse } from "next/server";
import Building from "../../../../../utils/models/Building";
import connectDb from "../../../../../utils/connectDb";

export async function GET(req) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  console.log(id)

  if (!id) {
    return NextResponse.json({ message: "Building ID is required" }, { status: 400 });
  }

  try {
    const building = await Building.findById(id);
    if (!building) {
      return NextResponse.json({ message: "Building not found" }, { status: 404 });
    }

    return NextResponse.json(building, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching building", error }, { status: 500 });
  }
}
