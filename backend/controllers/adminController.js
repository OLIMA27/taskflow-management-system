const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

const createManager = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });

  if (exists) {
    res.status(400);
    throw new Error("Manager already exists");
  }

  const manager = await User.create({
    name,
    email,
    password,
    role: "manager",
    createdBy: req.user._id,
  });

  res.status(201).json(manager);
});

const getManagers = asyncHandler(async (req, res) => {
  const managers = await User.find({ role: "manager" }).select("-password");
  res.json(managers);
});

const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find()
    .populate("assignedManager", "name email role")
    .populate("createdBy", "name email role");

  res.json(projects);
});

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find()
    .populate("project", "title")
    .populate("assignedBy", "name email role")
    .populate("assignedTo", "name email role");

  res.json(tasks);
});

module.exports = {
  createManager,
  getManagers,
  getAllProjects,
  getAllTasks,
};