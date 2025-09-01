import Lead from "../models/leadModel.js";
import User from "../models/userModel.js";
import Customer from "../models/customerModel.js";
import { logActivity } from "./activityController.js";

// @desc    Get all leads (Admin: all, Agent: own)
//route GET /api/leads
//@access PRIVATE
export const getLeads = async (req, res) => {
  try {
    // Get pagination parameters with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter =
      req.user.role === "agent" ? { assignedAgent: req.user._id } : {};
    if (req.query.status) filter.status = req.query.status;
     if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" }; // case-insensitive search
    }
    filter.archived = false;

    const totalLeads = await Lead.countDocuments(filter); // Find the leads with skip and limit for pagination

    const leads = await Lead.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("assignedAgent", "name email"); // Calculate total pages

    const totalPages = Math.ceil(totalLeads / limit); // Send the paginated response with metadata

    res.json({
      leads,
      totalLeads,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lead by ID
// @route   GET /api/leads/:id
// @access  PRIVATE
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "assignedAgent",
      "name email"
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // If agent, restrict access to their own leads only
    if (
      req.user.role === "agent" &&
      lead.assignedAgent?._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this lead" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create lead
//route POST /api/leads
//@access PRIVATE
export const createLead = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400);
      throw new Error("body missing");
    }
    const { name, email, phone, source } = req.body;

    if (!name || !email || !phone) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    //create lead
    const lead = await Lead.create({
      name,
      email,
      phone,
      source,
      assignedAgent: req.user._id,
    });

    await logActivity(req.user._id, "created lead", "Lead", lead._id);

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead
//route PATCH /api/leads/:id
//@access Private
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (
      req.user.role !== "admin" &&
      lead.assignedAgent.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    
    if (req.body.agentEmail) {
      const agent = await User.findOne({ email: req.body.agentEmail });
      if (!agent) {
        return res.status(400).json({ message: "Agent with this email not found" });
      }
      req.body.assignedAgent = agent._id;
      delete req.body.agentEmail; // clean up
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("assignedAgent", "name email");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Soft delete (archive)
//route DELETE /api/leads/:id
//@access PRIVATE
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (
      req.user.role !== "admin" &&
      lead.assignedAgent.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    lead.archived = true;
    await lead.save();

    await logActivity(req.user._id, "deleted(soft) lead", "Lead", lead._id);

    res.json(lead._id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Convert lead to customer
//route POST /api/leads/:id/convert
//@access Private
export const convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (
      req.user.role !== "admin" &&
      lead.assignedAgent.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const customer = await Customer.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      owner: lead.assignedAgent,
    });

    // Update lead status to Closed Won
    lead.status = "Closed Won";
    await lead.save();

    await logActivity(
      req.user._id,
      "convert lead to customer",
      "Lead",
      lead._id
    );

    // After successful customer creation, remove the lead
    // await Lead.findByIdAndDelete(req.params.id);
    // await session.commitTransaction();

    res.json({ message: "Lead converted", customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Get leads created per day (last 14 days)
// @route   GET /api/leads/stats
// @access  Private
export const getLeadsStats = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 13); // include today = 14 days

    // Base match
    const matchStage = { createdAt: { $gte: startDate } };

    //admin ses all , agent only theirs
    if (req.user.role !== "admin") {
      matchStage.assignedAgent = req.user._id; // adjust field name if it's `createdBy`
    }

    // MongoDB aggregation
    const stats = await Lead.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Normalize data for chart (fill missing days with 0)
    const result = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const found = stats.find(
        (s) =>
          s._id.year === d.getFullYear() &&
          s._id.month === d.getMonth() + 1 &&
          s._id.day === d.getDate()
      );

      result.push({
        date: d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
        leads: found ? found.count : 0,
      });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// @desc   Get leads count by status
// @route  GET /api/leads/status-count
// @access Private
export const getLeadsStatusCount = async (req, res) => {
  try {
    let matchStage = {};

    if (req.user.role !== "admin") {
      matchStage.assignedAgent = req.user._id; 
    }

    const counts = await Lead.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert array to object: { "New": 5, "In Progress": 2, ... }
    const result = {};
    counts.forEach((c) => {
      result[c._id] = c.count;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};