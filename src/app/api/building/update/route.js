import { NextResponse } from "next/server";
import Building from "../../../../../utils/models/Building";
import connectDb from "../../../../../utils/connectDb";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Get local date components
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    // Get local time components
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    // Add ordinal suffix to day
    const ordinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    
    return `${day}${ordinalSuffix(day)} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
};

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
    

// Save utcDate to the database

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
                location: event?.location || "",
            })) || [],
            updates: buildingData.updates?.map(update => ({
                role: update.role?.trim() || "admin",
                title: update.title?.trim() || "",
                content: update.content?.trim() || "",
                date: update.date || new Date(),
                formattedDate: formatDate(update.date || new Date()),
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