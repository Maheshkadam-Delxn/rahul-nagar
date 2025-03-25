import { NextResponse } from "next/server";
import User from "../../../../../../utils/models/User";
import connectDB from "../../../../../../utils/connectDb";

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        
        await connectDB();
        
        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json({ 
            message: "User deleted successfully",
            userId: id
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ 
            message: "Failed to delete user", 
            error: error.message 
        }, { status: 500 });
    }
} 