import { NextResponse } from "next/server";
import User from "../../../../../utils/models/User";
import connectDB from "../../../../../utils/connectDb";

export async function GET() {
    try {
        await connectDB();
        
        const users = await User.find({})
            .select('name email role status lastLogin')
            .sort({ createdAt: -1 });
            
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { message: "Failed to fetch users", error: error.message }, 
            { status: 500 }
        );
    }
} 