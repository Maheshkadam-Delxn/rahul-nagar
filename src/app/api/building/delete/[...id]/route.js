import { NextResponse } from "next/server";
import Building from "../../../../../../utils/models/Building";
import connectDb from "../../../../../../utils/connectDb";

// DELETE /api/building/delete-building/:id
export async function DELETE(req, { params }) {
  try {
    await connectDb();
    
    const { id } = params;

    // Check if the building exists
    const building = await Building.findById(id);
    if (!building) {
      return NextResponse.json({ success: false, message: "Building not found" }, { status: 404 });
    }

    // Delete the building
    await Building.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Building deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting building:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
