import Customer from "../models/customerModel.js";
import { logActivity } from "./activityController.js";


// const checkCustomerAccess = (customer, req) => {
//     if (req.user.role !== "admin" && customer.owner.toString() !== req.user._id.toString()) {
//         return false;
//     }
//     return true;
// };


// @desc    Get all customers
//route GET /api/customers
//access Private
export const getCustomers = async (req, res) => {
  try {
     
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    
    const filter = req.user.role === "agent" ? { owner: req.user._id } : {};
    filter.archived = false;
    
    const totalCustomers = await Customer.countDocuments(filter);

    //pagination
    const customers = await Customer.find(filter)
      .skip(skip)
      .limit(limit)
       .populate("owner", "name email");

    // total pages
    const totalPages = Math.ceil(totalCustomers / limit);

    //response with total page number and curr page no.
    res.json({
      customers,
      totalCustomers,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("owner", "name email");

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete customer by ID
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Optional: Only owner or admin can delete
    if (req.user.role === "agent" && customer.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this customer" });
    }

    // await customer.deleteOne();
    customer.archived = true;
    await customer.save();

    await logActivity(req.user._id, "deleted(soft) customer", "Customer", customer._id);

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Create customer
//route POST /api/customers
//access Private
export const createCustomer = async (req, res) => {
  try {
   
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Please provide name, email, and phone number.' });
    }

    const customer = await Customer.create({ ...req.body, owner: req.user._id });

    await logActivity(req.user._id, "created customer", "customer", customer._id);

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update customer
//route PUT /api/customers/:id
//access Private
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    if (req.user.role !== "admin" && customer.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await logActivity(req.user._id, "updated customer", "customer", customer._id);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add note to customer
//route POST /api/customers/:id/notes
//access Private
export const addNote = async (req, res) => {
  try {
    if (!req.body.body || req.body.body.trim() === '') {
        return res.status(400).json({ message: 'Note body cannot be empty.' });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    if (req.user.role !== "admin" && customer.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    customer.notes.push({ body: req.body.body });
    await customer.save();

    await logActivity(req.user._id, "adde note to customer", "customer", customer._id);

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc   Get total customers count
// @route  GET /api/customers/count
// @access Private
export const getCustomersCount = async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== "admin") {
      query.owner = req.user._id; // adjust field name if schema uses "createdBy"
    }

    const count = await Customer.countDocuments(query);

    res.json({ totalCustomers: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};