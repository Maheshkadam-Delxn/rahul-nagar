import mongoose from 'mongoose';

const RedevelopmentUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  image: {
    type: String // URL for the image
  },
  document: {
    type: String // URL for the document
  },
  createdBy: {
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userRole: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Cleanup existing model if needed
delete mongoose.models.RedevelopmentUpdate;

const Updates = mongoose.models.RedevelopmentUpdate || 
                mongoose.model('RedevelopmentUpdate', RedevelopmentUpdateSchema);

export default Updates;