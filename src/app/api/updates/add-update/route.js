import { NextResponse } from "next/server";
import connectDb from "../../../../../utils/connectDb";
import Updates from "../../../../../utils/models/Updates";

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
        const notificationData = {
            ...updateData,
            // Make sure createdBy is explicitly included
            createdBy: {
                userId: userData?.userId || 'unknown',
                userName: userData?.userName || 'Unknown User',
                userRole: userData?.userRole || 'user'
            },
            createdAt: new Date()
        };

        console.log("Saving notification with data:", notificationData);
        
        // Create and save the new notification
        const notification = new Updates(notificationData);
        const savedNotification = await notification.save();
        
        console.log("Saved notification:", savedNotification);
        
        return NextResponse.json(savedNotification, { status: 201 });
    } catch (error) {
        console.error('Error creating notification:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
