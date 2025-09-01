// const jwt =require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const asyncHansdler = require('express-async-handler');
// const User = require('../models/userModel.js');


import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

//desc Register new user (Only admin)
//route POST /api/auth/register
//@access Private
export const registerUser = asyncHandler( async (req, res) =>{
    if( !req.body){
        res.status(400);
        throw new Error('body missing');
    }
    const {name, email, password } = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    // check if user exist
    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
        });
    }else{
        res.status(400);
        throw new Error('INVALID User data');

    }

   
});


//desc Authenticate a user
//route POST /api/auth/login
//@access Public
export const loginUser = asyncHandler( async (req, res) =>{
    const {email, password} = req.body;

    //check for user email
    const user = await User.findOne({email});

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accesstoken:generateToken(user.id),
            refreshtoken: generateRefreshToken(user.id),
        });
    }else{
        res.status(400);
        throw new Error('INVALID credential');
    }

    
});


// @desc    Refresh token
//route POST /api/auth/refresh
//@access Public
export const refreshToken = asyncHandler ( async(req, res) => {
   const token = req.headers.authorization.split(' ')[1];
//   const { token } = req.body;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    // Verify user still exists
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    
    const accesstoken = generateToken(decoded.id);
    res.json( {accesstoken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});


// @desc    Logout
//route POST /api/auth/logout
//@access Public
export const logoutUser = (req, res) => {
  res.json({ message: "Logged out successfully" });
};


//desc Get user data
//route GET /api/auth/me
//@access Private
export  const getMe = asyncHandler( async (req, res) =>{
   

    res.status(200).json(req.user);
});





//generate JWT 
const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '1m',
    });
}
//generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
     expiresIn: "7d"
    });
};

