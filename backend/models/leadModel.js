import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: {type: String, required: true},
  status: { 
    type: String, 
    enum: ["New", "In Progress", "Closed Won", "Closed Lost"], 
    default: "New" 
  },
  source: String,
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  archived: { type: Boolean, default: false }
}, { timestamps: true });

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
