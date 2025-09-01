import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {type: String},
  description:{type: String},
  dueDate: {type: Date,  required: true },
  status: { type: String, enum: ["Open", "In Progress", "Done"], default: "Open" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  relatedTo: { type: String, enum: ["Lead", "Customer"], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;
