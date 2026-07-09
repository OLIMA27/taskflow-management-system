const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {
  if (req.user.role === "admin") {
    const managers = await User.countDocuments({ role: "manager" });
    const members = await User.countDocuments({ role: "member" });
    const projects = await Project.countDocuments();
    const tasks = await Task.countDocuments();

    return res.json({ managers, members, projects, tasks });
  }

  if (req.user.role === "manager") {
    const members = await User.countDocuments({
      role: "member",
      createdBy: req.user._id,
    });

    const projects = await Project.countDocuments({
      assignedManager: req.user._id,
    });

    const tasks = await Task.countDocuments({
      assignedBy: req.user._id,
    });

    return res.json({ members, projects, tasks });
  }

  const myTasks = await Task.countDocuments({ assignedTo: req.user._id });
  const completedTasks = await Task.countDocuments({
    assignedTo: req.user._id,
    status: "completed",
  });

  res.json({ myTasks, completedTasks });
});

module.exports = { getDashboard };