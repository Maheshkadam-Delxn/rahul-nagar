import { NextResponse } from "next/server";
import User from "../../../../../../utils/models/User";
import connectDB from "../../../../../../utils/connectDb";
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
    try {
        // Access the ID after destructuring params
        const { id } = await params;
        
        // Parse the request body
        const { name, email, role, status, image, post, password } = await request.json();
        console.log("Role = ",role)
        
        await connectDB();
        
        // Prepare update data
        const updateData = { name, email, role, status, image, post };
        
        // If password is provided, hash it and add to update data
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            updateData.password = hashedPassword;
        }
        
        // Find the user by ID and update
        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json({ 
            message: "User updated successfully", 
            user 
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ 
            message: "Failed to update user", 
            error: error.message 
        }, { status: 500 });
    }
} 