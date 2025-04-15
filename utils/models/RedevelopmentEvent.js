const mongoose = require('mongoose');

const RedevelopmentEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String },
  document: { type: String }, // Add this field
  createdBy: { type: String, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
delete mongoose.models.RedevelopmentEvent
const Event = mongoose.models.RedevelopmentEvent || mongoose.model("RedevelopmentEvent", RedevelopmentEventSchema);

export default Event;
