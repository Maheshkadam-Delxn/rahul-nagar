import mongoose from 'mongoose';

const AssociateMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active'
  },
  image: {
    type: String,
    default: ''
  },
  post: {
    type: String,
    trim: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

delete mongoose.models.AssociateMember;


export default mongoose.models.AssociateMember || mongoose.model('AssociateMember', AssociateMemberSchema);