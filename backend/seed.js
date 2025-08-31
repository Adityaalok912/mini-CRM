import dotenv from "dotenv";
import mongoose from "mongoose";
import 'colors';
import connectDB from "./config/db.js";
import User from "./models/userModel.js";
import Lead from "./models/leadModel.js";
import Customer from "./models/customerModel.js";
import Task from "./models/taskModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear old data
    await User.deleteMany();
    await Lead.deleteMany();
    await Customer.deleteMany();
    await Task.deleteMany();

    console.log("🧹 Old data cleared");

    // Create users

    const salt = await bcrypt.genSalt(10);
    const hashedPasswordadmin = await bcrypt.hash("admin123", salt);
    const hashedPasswordagent = await bcrypt.hash("agent123", salt);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPasswordadmin,
      role: "admin"
    });

    const agents = await User.insertMany([
      { name: "Agent One", email: "agent1@example.com", password: hashedPasswordagent, role: "agent" },
      { name: "Agent Two", email: "agent2@example.com", password: hashedPasswordagent, role: "agent" }
    ]);

    console.log("✅ Users created");

    // Create leads
    const leads = [];
    for (let i = 1; i <= 10; i++) {
      leads.push({
        name: `Lead ${i}`,
        email: `lead${i}@example.com`,
        phone: `123456789${i}`,
        status: i % 2 === 0 ? "New" : "In Progress",
        source: "Website",
        assignedAgent: agents[i % 2]._id
      });
    }
    await Lead.insertMany(leads);

    console.log("✅ Leads created");

    // Create customers
    const customers = [];
    for (let i = 1; i <= 5; i++) {
      customers.push({
        name: `Customer ${i}`,
        company: `Company ${i}`,
        email: `customer${i}@example.com`,
        phone: `987654321${i}`,
        owner: agents[i % 2]._id,
        notes: [{ body: "Initial note" }],
        tags: ["VIP", "Onboarding"]
      });
    }
    await Customer.insertMany(customers);

    console.log("✅ Customers created");

    console.log("🎉 Database seeding complete");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
