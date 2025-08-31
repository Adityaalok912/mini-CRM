import Activity from "../models/activityModel.js";

// @desc    Get latest 10 activities
//route GET /api/activity
//@access PRIVATE
export const getActivity = async (req, res) => {
 try {
    // role-based filter
    const filter = req.user.role === "agent" ? { user: req.user._id } : {};

    const activities = await Activity.find(filter)
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("user", "name email");
    
    res.json(activities);
  }  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Utility function to log an activity
export const logActivity = async (userId, action, entity, entityId) => {
  try {
    await Activity.create({ user: userId, action, entity, entityId });
  } catch (error) {
    console.error("Activity logging failed:", error.message);
  }
};
