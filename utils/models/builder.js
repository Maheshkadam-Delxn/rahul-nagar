import mongoose from 'mongoose';

const builderSchema = new mongoose.Schema({
  developer: {
    type: String,
    required: true,
    trim: true
  },
  video: {
    url: {
      type: String,
      required: true,
      trim: true
    }
  },
  additionalDocuments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    }
  }],
  offer: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    percentage: {
      type: Number,
      min: 0,
      max: 500,
      default: 100
    }
  },
  createdBy: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});
delete mongoose.models.Builder
export default mongoose.models.Builder || mongoose.model('Builder', builderSchema);