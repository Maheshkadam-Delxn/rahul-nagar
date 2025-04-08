import mongoose from 'mongoose';

const UpdatesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String
    },
    alt: {
      type: String
    }
  }],
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
    },
    userRole: {
      type: String
    }
  },
  publishedAt: {
    type: Date
  }
});

const Updates = mongoose.models.Updates || mongoose.model('Updates', UpdatesSchema);

export default Updates;