import mongoose from "mongoose";

const UpdateSchema = new mongoose.Schema({
    role: { 
        type: String, 
        required: [true, 'Update role is required'],
        trim: true
    },
    title: { 
        type: String, 
        required: [true, 'Update title is required'],
        trim: true
    },
    content: { 
        type: String, 
        trim: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    link: { 
        type: String, 
        default: '' 
    }
});

const OwnerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Owner name is required'],
        trim: true
    },
    flatNumber: { 
        type: String, 
        required: [true, 'Flat number is required'],
        trim: true
    },
    shopNumber: { 
        type: String, 
        default: '' 
    },
    image: { 
        type: String, 
        default: '' 
    }
});

const EventSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Event title is required'],
        trim: true
    },
    description: { 
      type: String, 
      trim: true,
      default: "" // Ensuring it always has a default value
  },
    // Optional fields to match frontend structure
    date: { 
        type: Date 
    },
    time: { 
        type: String 
    },
    location: { 
        type: String 
    }
});

const BuildingSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Building name is required'],
        trim: true
    },
    president: { 
        type: String, 
        required: [true, 'President name is required'],
        trim: true
    },
    secretary: { 
        type: String, 
        required: [true, 'Secretary name is required'],
        trim: true
    },
    treasurer: { 
        type: String, 
        required: [true, 'Treasurer name is required'],
        trim: true
    },
    image:{
      type:String,
      required: [true, 'Image is required'],
      trim:true
    },
    description: { 
        type: String, 
        required: [true, 'Building description is required'],
        trim: true
    },
   
    events: [EventSchema],
    updates: [UpdateSchema],
    owners: [OwnerSchema],
    createdBy: { 
        type: String, 
        default: 'unknown' 
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual to get total number of owners
BuildingSchema.virtual('totalOwners').get(function() {
    return this.owners.length;
});

// Virtual to get recent updates
BuildingSchema.virtual('recentUpdates').get(function() {
    return this.updates
        .sort((a, b) => b.date - a.date)
        .slice(0, 3);
});

// Ensure model is deleted before redefining (fix for hot-reloading environments)
delete mongoose.models.Building;

const Building = mongoose.model("Building", BuildingSchema);

export default Building;
