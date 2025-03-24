const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true, default: "Announcement" },
  priority: { type: String, required: true, default: "Medium" },
  status: { type: String, required: true, default: "Draft" },
  visibility: { type: String, required: true, default: "All Users" },
  expiresAt: { type: Date },
});

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
