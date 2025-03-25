import { NextResponse } from "next/server";
import Building from "../../../../../utils/models/Building";
import connectDb from "../../../../../utils/connectDb";

export async function POST(req) {
    try {
        // Connect to database
        await connectDb();

        // Parse request body
        const body = await req.json();

        // Destructure and validate required fields
        const { 
            name, 
            description, 
            president, 
            secretary, 
            treasurer, 
            image,  // This should be the image URL string from Cloudinary
            events = [],
            updates = [],
            owners = [],
            createdBy 
        } = body;

        console.log("Received image data:", image); // Debug log

        // Comprehensive validation
        const validationErrors = [];

        if (!name || name.trim() === "") {
            validationErrors.push("Building name is required");
        }

        if (!description || description.trim() === "") {
            validationErrors.push("Building description is required");
        }

        if (!president || president.trim() === "") {
            validationErrors.push("President name is required");
        }

        if (!secretary || secretary.trim() === "") {
            validationErrors.push("Secretary name is required");
        }

        if (!treasurer || treasurer.trim() === "") {
            validationErrors.push("Treasurer name is required");
        }

        if (!image || typeof image !== "string") {
            validationErrors.push("Valid image URL is required");
        }

        // Check for validation errors
        if (validationErrors.length > 0) {
            return NextResponse.json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            }, { status: 400 });
        }

        // Sanitize and prepare data
        const buildingData = {
            name: name.trim(),
            description: description.trim(),
            president: president.trim(),
            secretary: secretary.trim(),
            treasurer: treasurer.trim(),
            image: image.trim(), // Ensure the URL is trimmed
            events: events.map(event => ({
                title: event.title?.trim() || "",
                description: event.description?.trim() || "",
                date: event.date || new Date(),
                time: event.time || "",
                location: event.location || ""
            })),
            updates: updates.map(update => ({
                role: update.role?.trim() || "admin",
                title: update.title?.trim() || "",
                content: update.content?.trim() || "",
                date: update.date || new Date(),
                link: update.link || ''
            })),
            owners: owners.map(owner => ({
                name: owner.name?.trim() || "",
                flatNumber: owner.flatNumber?.trim() || "",
                shopNumber: owner.shopNumber?.trim() || '',
                image: owner.image?.trim() || ''
            })),
            createdBy: createdBy || "unknown"
        };

        console.log("Building data to save:", buildingData); // Debug log

        // Create new building document
        const newBuilding = new Building(buildingData);

        // Save building to database
        await newBuilding.save();

        // Return success response
        return NextResponse.json({ 
            success: true, 
            message: "Building added successfully", 
            building: newBuilding 
        }, { status: 201 });

    } catch (error) {
        // Detailed error logging
        console.error("Error adding building:", error);

        // Determine error type and provide appropriate response
        if (error.name === 'ValidationError') {
            return NextResponse.json({ 
                success: false, 
                message: "Validation error",
                errors: Object.values(error.errors).map(err => err.message)
            }, { status: 400 });
        }

        // Generic server error
        return NextResponse.json({ 
            success: false, 
            message: "Internal server error",
            errorDetails: error.message 
        }, { status: 500 });
    }
}