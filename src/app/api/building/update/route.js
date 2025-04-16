import { NextResponse } from "next/server";
import Building from "../../../../../utils/models/Building";
import connectDb from "../../../../../utils/connectDb";

export async function PUT(req) {
    try {
        // Connect to database
        await connectDb();

        // Parse request body
        const body = await req.json();
        console.log(body)
        const { buildingId, ...buildingData } = body;

        // Validate building ID
        if (!buildingId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Building ID is required for update",
                },
                { status: 400 }
            );
        }

        // Comprehensive validation
        const validationErrors = [];

        if (!buildingData.name || buildingData.name.trim() === "") {
            validationErrors.push("Building name is required");
        }

        if (!buildingData.president || buildingData.president.trim() === "") {
            validationErrors.push("President name is required");
        }

        if (!buildingData.secretary || buildingData.secretary.trim() === "") {
            validationErrors.push("Secretary name is required");
        }

        if (!buildingData.treasurer || buildingData.treasurer.trim() === "") {
            validationErrors.push("Treasurer name is required");
        }

        if (!buildingData.image || typeof buildingData.image !== "string") {
            validationErrors.push("Valid building image URL is required");
        }

        // Check for validation errors
        if (validationErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors,
                },
                { status: 400 }
            );
        }
    

// Save utcDate to the database

        // Sanitize and prepare data
        const sanitizedData = {
            name: buildingData.name.trim(),
            description: buildingData.description?.trim() || "",
            president: buildingData.president.trim(),
            secretary: buildingData.secretary.trim(),
            treasurer: buildingData.treasurer.trim(),
            image: buildingData.image.trim(),
            presidentImage: buildingData.presidentImage?.trim() || "",
            secretaryImage: buildingData.secretaryImage?.trim() || "",
            treasurerImage: buildingData.treasurerImage?.trim() || "",
            events: buildingData.events?.map(event => ({
                title: event?.title?.trim() || "",
                description: event?.description?.trim() || "",
                date: event?.date ? new Date(event?.date).toISOString() : new Date().toISOString(), // Convert to UTC ISO string
                time: event?.time || "",
                location: event?.location || "",
                documentUrl: event?.documentUrl || "",  // Added document fields for events
                documentId: event?.documentId || "",    // Added document fields for events
                documentName: event?.documentName || "" // Added document fields for events
            })) || [],
            updates: buildingData.updates?.map(update => ({
                role: update.role?.trim() || "admin",
                title: update.title?.trim() || "",
                content: update.content?.trim() || "",
                date: update.date || new Date(),
                link: update.link || "",
            })) || [],
            owners: buildingData.owners?.map(owner => ({
                name: owner.name?.trim() || "",
                flatNumber: owner.flatNumber?.trim() || "",
                shopNumber: owner.shopNumber?.trim() || "",
                image: owner.image?.trim() || "",
            })) || [],
            documents: buildingData.documents?.map(doc => ({
                title: doc.title?.trim() || "",
                description: doc.description?.trim() || "",
                fileUrl: doc.fileUrl?.trim() || "",
                fileType: doc.fileType?.trim() || "",
                uploadedBy: doc.uploadedBy?.trim() || "unknown"
            })) || []
        };

        // Find and update the building
        const updatedBuilding = await Building.findByIdAndUpdate(
            buildingId,
            sanitizedData,
            { 
                new: true,  // Return the updated document
                runValidators: true  // Run schema validators on update
            }
        ).lean(); // Use lean() for better performance

        if (!updatedBuilding) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Building not found",
                },
                { status: 404 }
            );
        }

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: "Building updated successfully",
                building: updatedBuilding,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating building:", error);

        // Handle validation errors from mongoose
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message,
            }));

            return NextResponse.json(
                {
                    success: false,
                    message: "Validation error",
                    errors,
                },
                { status: 400 }
            );
        }

        // Handle cast errors (invalid ID format)
        if (error.name === "CastError") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid building ID format",
                },
                { status: 400 }
            );
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Building with this name already exists",
                },
                { status: 409 }
            );
        }

        // Generic server error response
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// Added new API endpoint for direct document uploads to buildings
export async function POST(req) {
    try {
        // Connect to database
        await connectDb();

        // Parse request body
        const body = await req.json();
        const { buildingId, eventId, document } = body;

        // Validate building ID
        if (!buildingId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Building ID is required",
                },
                { status: 400 }
            );
        }

        // Validate document data
        if (!document || !document.title || !document.fileUrl) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Document title and fileUrl are required",
                },
                { status: 400 }
            );
        }

        // Find the building
        const building = await Building.findById(buildingId);

        if (!building) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Building not found",
                },
                { status: 404 }
            );
        }

        // If eventId is provided, update the specific event
        if (eventId) {
            const eventIndex = building.events.findIndex(
                event => event._id.toString() === eventId
            );

            if (eventIndex === -1) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Event not found in this building",
                    },
                    { status: 404 }
                );
            }

            // Update the document details for the specific event
            building.events[eventIndex].documentUrl = document.fileUrl;
            building.events[eventIndex].documentId = document.documentId || "";
            building.events[eventIndex].documentName = document.title;

            await building.save();

            return NextResponse.json(
                {
                    success: true,
                    message: "Document uploaded to event successfully",
                    event: building.events[eventIndex],
                },
                { status: 200 }
            );
        } else {
            // If no eventId, add document to building's document collection
            const newDocument = {
                title: document.title,
                description: document.description || "",
                fileUrl: document.fileUrl,
                fileType: document.fileType || "application/pdf",
                uploadedBy: document.uploadedBy || "unknown",
                uploadedOn: new Date()
            };

            building.documents.push(newDocument);
            await building.save();

            return NextResponse.json(
                {
                    success: true,
                    message: "Document uploaded to building successfully",
                    document: newDocument,
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error uploading document:", error);

        // Handle validation errors from mongoose
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message,
            }));

            return NextResponse.json(
                {
                    success: false,
                    message: "Validation error",
                    errors,
                },
                { status: 400 }
            );
        }

        // Handle cast errors (invalid ID format)
        if (error.name === "CastError") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid ID format",
                },
                { status: 400 }
            );
        }

        // Generic server error response
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
                error: error.message,
            },
            { status: 500 }
        );
    }
}