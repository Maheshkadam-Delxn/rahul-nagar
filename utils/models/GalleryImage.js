import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'events', 'facilities', 'celebrations', 'meetings'],
    default: 'general'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

delete mongoose.models.GalleryImage
// Check if model already exists to prevent overwrite error during hot reloading
const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', galleryImageSchema);

export default GalleryImage;