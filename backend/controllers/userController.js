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