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
            image,  // Building image URL
            presidentImage, // President image URL
            secretaryImage, // Secretary image URL
            treasurerImage, // Treasurer image URL
            events = [],
            updates = [],
            owners = [],
            documents = [],
            createdBy 
        } = body;

        console.log("Received building data:", { 
            name, 
            presidentImage,
            secretaryImage,
            treasurerImage
        }); // Debug log

        // Comprehensive validation
        const validationErrors = [];

        if (!name || typeof name !== 'string') {
            validationErrors.push('Building name is required and must be a string');
        }

        if (!image || typeof image !== 'string') {
            validationErrors.push('Building image URL is required');
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
            description: description?.trim() || "",
            president: president?.trim() || "",
            secretary: secretary?.trim() || "",
            treasurer: treasurer?.trim() || "",
            image: image.trim(),
            presidentImage: presidentImage?.trim() || "",
            secretaryImage: secretaryImage?.trim() || "",
            treasurerImage: treasurerImage?.trim() || "",
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
            documents: documents.map(doc => ({
                title: doc.title?.trim() || "",
                description: doc.description?.trim() || "",
                fileUrl: doc.fileUrl?.trim() || "",
                fileType: doc.fileType?.trim() || "",
                uploadedBy: doc.uploadedBy?.trim() || "unknown"
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