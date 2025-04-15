import { NextResponse } from "next/server";
import RedevelopmentUpdate from "../../../../../../utils/models/RedevelopmentUpdates.js"
import connectDb from "../../../../../../utils/connectDb.js"

export async function POST(req) {
    await connectDb();
    try {
        // Parse the request body
        const body = await req.json();
        console.log("Received update data:", body);
        
        // Extract user data
        const { userData, ...updateData } = body;
        console.log(updateData)
        // Prepare the data for saving
        const redevelopmentUpdateData = {
            ...updateData,
            // Make sure createdBy is explicitly included
            createdBy: {
                userId: userData?.userId || 'unknown',
                userName: userData?.userName || 'Unknown User',
                userRole: userData?.userRole || 'user'
            },
            createdAt: new Date()
        };

        console.log("Saving notification with data:", redevelopmentUpdateData);
        
        // Create and save the new notification
        const redevelopUpdate = new RedevelopmentUpdate(redevelopmentUpdateData);
        const savedUpdates = await redevelopUpdate.save();
        
        console.log("Saved notification:", savedUpdates);
        
        return NextResponse.json(savedUpdates, { status: 201 });
    } catch (error) {
        console.error('Error creating notification:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
