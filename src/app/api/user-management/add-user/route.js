import { NextResponse } from "next/server";
import User from "../../../../../utils/models/User";
import connectDB from "../../../../../utils/connectDb";

export async function POST(request) {
    const { email, password, role, name, status, image, post } = await request.json();

    try {
        await connectDB();
        
        const user = await User.create({ 
            email, 
            password, 
            role, 
            name, 
            status,
            image,
            post
        });
        console.log(role)
        return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ message: "Failed to create user", error: error.message }, { status: 500 });
    }
}


