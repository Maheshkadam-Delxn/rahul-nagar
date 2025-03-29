import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User collection
    required: true,
  },
}, { timestamps: true });
delete mongoose.models.Event
const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

export default Event;
