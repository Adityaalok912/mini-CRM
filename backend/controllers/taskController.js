import Task from "../models/taskModel.js";
import { logActivity } from "./activityController.js";



// @desc    Get tasks (Admin: all, Agent: own)
//route GET /api/tasks
//@access PRIVATE
export const getTasks = async (req, res) => {
  try {

    // Get pagination parameters with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    const filter = req.user.role === "agent" ? { owner: req.user._id } : {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.related) filter.related = req.query.related;
    if (req.query.due) filter.dueDate = { $lte: new Date(req.query.due) };


    const totalTasks = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("owner", "name email");

    const totalPages = Math.ceil(totalTasks / limit);

   
    res.json({
      tasks,
      totalTasks,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create task
//route POST /api/tasks
//@access PRIVATE
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Task title is a required field.' });
    }

    const task = await Task.create({ ...req.body, owner: req.user._id });

    await logActivity(req.user._id, "created task", "Task", task._id);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
//route PUT /api/tasks/:id
//@access PRIVATE
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await logActivity(req.user._id, "updated task", "Task", updated._id);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
