import { NextResponse } from "next/server";
import Building from "../../../../../utils/models/Building";
import connectDb from "../../../../../utils/connectDb";

export async function PUT(req) {
    try {
        // Connect to database
        await connectDb();

        // Parse request body
        const body = await req.json();
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
            validationErrors.push("Valid image URL is required");
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

        // Sanitize and prepare data
        const sanitizedData = {
            name: buildingData.name.trim(),
            description: buildingData.description.trim(),
            president: buildingData.president.trim(),
            secretary: buildingData.secretary.trim(),
            treasurer: buildingData.treasurer.trim(),
            image: buildingData.image.trim(),
            events: buildingData.events?.map(event => ({
                title: event.title?.trim() || "",
                description: event.description?.trim() || "",
                date: event.date || new Date(),
                time: event.time || "",
                location: event.location || "",
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
        };

        // Find and update the building
        const updatedBuilding = await Building.findByIdAndUpdate(
            buildingId,
            sanitizedData,
            { 
                new: true, 
                runValidators: true 
            }
        );

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