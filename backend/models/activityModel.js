import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  entity: String, // Lead, Customer, Task
  entityId: { type: mongoose.Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now }
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
