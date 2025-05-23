import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import {renameSync, unlinkSync} from "fs";

const createToken = (email, userId) => {
  const token = jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: '1d' // 1 day expiration
  });
  return token;
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).send("Email and Password are required.");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }
    // Create User
    const user = await User.create({ email, password });
    
    // Set Cookie and Respond
    res.cookie("jwt", createToken(email, user.id), {
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    // console.error("Error in signup:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const login = async(req, res) =>{
  try{
    const {email,password} = req.body;
  
  if(!isValidEmail(email)){
    return res.status(400).json({error:"Invalid Email"});
  }
  const user = await User.findOne({email});
  if(!user){
    return res.status(404).json({error:"User not found"});
  }

  const isCorrectPass = await bcrypt.compare(password,user.password);
  if(!isCorrectPass){
    return res.status(401).json({message:"Incorrect Password"});
  }
  res.cookie("jwt", createToken(email, user.id), {
    secure: true,
    sameSite: "None",
  });
  return res.status(200).json({
    message: "Login Successful.",
    user: {
      id: user.id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color:user.color
    },
  });
  }catch(err){
    console.error("Error in login:", err.message);
    res.status(500).json({error: "Internal Server Error"});
  }
}

export const getUserInfo = async (req, res, next) => {
  try{
    const userData = await User.findById(req.userId);
    if(!userData){
      return res.status(404).send("User not found");
    }
  return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color:userData.color
  });
  }catch(err){
    console.error("Error in user-info:", err.message);
    res.status(500).json({error: "Internal Server Error"});
  }
}

export const updateProfile = async (req, res, next) => {
  try{
    const {userId} = req;
    const {firstName, lastName, color} = req.body;
    if(!firstName || !lastName){
      return res.status(400).send("All fields are required.");
    }
    const userData = await User.findByIdAndUpdate(userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true
      },{
        new: true,
        runValidators: true
      }
    );
  return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color:userData.color
  });
  }catch(err){
    console.error("Error in update-profile:", err.message);
    res.status(500).json({error: "Internal Server Error"});
  }
}

export const addProfileImage= async (req, res, next) => {
  try{
    if(!req.file){
      return res.status(400).send("Image is required.");
    };

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(req.userId, {
      image: fileName
    }, {
      new: true,
      runValidators: true
    });

  return res.status(200).json({
      image: updatedUser.image,
  });
  }catch(err){
    console.error("Error in add-profile:", err.message);
    res.status(500).json({error: "Internal Server Error"});
  }
}

export const removeProfileImage= async (req, res, next) => {
  try{
    const {userId} = req;
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).send("User not found.");
    }
    if(user.image){
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();

    return res.status(200).json({ msg: "Image removed successfully." });

  }catch(err){
    console.error("Error in remove-profile:", err.message);
    res.status(500).json({error: "Internal Server Error"});
  }
}

export const Logout= async (req, res, next) => {
  try{
    res.cookie("jwt", "", {
      maxAge: 1,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).send("Profile Logout successfully.");

  }catch(err){
    res.status(500).json({error: "Internal Server Error"});
  }
}