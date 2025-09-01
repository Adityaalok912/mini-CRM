import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

//desc Get all user data (only admin)
//route GET /api/user/alluser
//@access Private
export  const getall = asyncHandler( async (req, res) =>{
    
    if (req.user.role !== "admin") {
    res.status(403); // Forbidden
    throw new Error('Access denied. Admin role required.');
  }
    try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
   
});


// @desc    Get all users
// @route   GET /api/user/alluser
// @access  Private (Admin only via authorize)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// @desc    Get single user by ID
// @route   GET /api/user/:id
// @access  Private (Admin only via authorize)
export const getUserById = asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

// @desc    Update user
// @route   PUT /api/user/:id
// @access  Private (Admin only via authorize)
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, password } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

// @desc    Delete user
// @route   DELETE /api/user/:id
// @access  Private (Admin only via authorize)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ message: "User removed", id: user._id });
});
