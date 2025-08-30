import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: {type: String},
  email: { type: String, required: true },
  phone: {type: String, required: true},
  notes: [{ body: String, createdAt: { type: Date, default: Date.now } }],
  tags: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deals: [String]
}, { timestamps: true });

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
