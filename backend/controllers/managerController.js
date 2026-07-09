// controllers/managerController.js

const User = require("../models/User");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const createMember = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const memberExists = await User.findOne({ email });

  if (memberExists) {
    res.status(400);
    throw new Error("Member already exists with this email");
  }

  const member = await User.create({
    name,
    email,
    password,
    role: "member",
    createdBy: req.user._id,
  });

  res.status(201).json({
    _id: member._id,
    name: member.name,
    email: member.email,
    role: member.role,
    createdBy: member.createdBy,
  });
});

const getMyMembers = asyncHandler(async (req, res) => {
  const members = await User.find({
    role: "member",
    createdBy: req.user._id,
  }).select("-password");

  res.status(200).json(members);
});

const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    assignedManager: req.user._id,
  }).populate("assignedManager", "name email role");

  res.status(200).json(projects);
});

module.exports = {
  createMember,
  getMyMembers,
  getMyProjects,
};