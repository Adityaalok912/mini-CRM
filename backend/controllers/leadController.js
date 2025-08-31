import Lead from "../models/leadModel.js";
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

    const filter = req.user.role === "agent" ? { assignedAgent: req.user._id } : {};
    if (req.query.status) filter.status = req.query.status;


    const totalLeads = await Lead.countDocuments(filter);

    // Find the leads with skip and limit for pagination
    const leads = await Lead.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("assignedAgent", "name email");

    // Calculate total pages
    const totalPages = Math.ceil(totalLeads / limit);

    // Send the paginated response with metadata
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

// @desc    Create lead
//route POST /api/leads
//@access PRIVATE
export const createLead = async (req, res) => {
  try {
     if( !req.body){
        res.status(400);
        throw new Error('body missing');
    }
    const {name, email, phone,source} = req.body

    if(!name || !email || !phone){
        res.status(400)
        throw new Error('Please add all fields')
    }

    //create lead
    const lead = await Lead.create({ 
        name,
        email,
        phone,
        source,
        assignedAgent: req.user._id 
    });

    await logActivity(req.user._id, "created lead", "Lead", lead._id);


    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead
//route PUT /api/leads/:id
//@access Private
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (req.user.role !== "admin" && lead.assignedAgent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await logActivity(req.user._id, "updated lead", "Lead", lead._id);

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

    if (req.user.role !== "admin" && lead.assignedAgent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    lead.archived = true;
    await lead.save();

    await logActivity(req.user._id, "deleted(soft) lead", "Lead", lead._id);

    res.json({ message: "Lead archived" });
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


    if (req.user.role !== "admin" && lead.assignedAgent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }


    const customer = await Customer.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      owner: lead.assignedAgent
    });

    await logActivity(req.user._id, "convert lead to customer", "Lead", lead._id);

    // After successful customer creation, remove the lead
    // await Lead.findByIdAndDelete(req.params.id);
    // await session.commitTransaction();

    res.json({ message: "Lead converted", customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
