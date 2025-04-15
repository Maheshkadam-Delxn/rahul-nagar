import mongoose from 'mongoose';

const AdvertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true, // Required for deletion on Cloudinary
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save hook to update `updatedAt` field when document is updated
AdvertisementSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Add pre-findOneAndUpdate hook to ensure `updatedAt` is updated when using updateOne or findOneAndUpdate
AdvertisementSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Add pre-update hook for the case of direct updates (like `update` and `updateOne`)
AdvertisementSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Advertisement = mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);

export default Advertisement;
