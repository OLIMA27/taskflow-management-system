const Activity = require("../models/Activity");
const Task = require("../models/Task");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const getActivities = asyncHandler(async (req, res) => {
  let filter = {};

  // Admin can view all activities
  if (req.user.role === "admin") {
    filter = {};
  }

  // Manager can view own projects and tasks activities
  if (req.user.role === "manager") {
    const managerTasks = await Task.find({
      assignedBy: req.user._id,
    }).select("_id");

    const managerProjects = await Project.find({
      assignedManager: req.user._id,
    }).select("_id");

    const taskIds = managerTasks.map(
      (task) => task._id
    );

    const projectIds = managerProjects.map(
      (project) => project._id
    );

    filter = {
      $or: [
        {
          user: req.user._id,
        },
        {
          entityType: "task",
          entityId: {
            $in: taskIds,
          },
        },
        {
          entityType: "project",
          entityId: {
            $in: projectIds,
          },
        },
      ],
    };
  }

  // Member can view only assigned task activities
  if (req.user.role === "member") {
    const memberTasks = await Task.find({
      assignedTo: req.user._id,
    }).select("_id");

    const taskIds = memberTasks.map(
      (task) => task._id
    );

    filter = {
      entityType: "task",
      entityId: {
        $in: taskIds,
      },
    };
  }

  const activities = await Activity.find(filter)
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.json(activities);
});

module.exports = {
  getActivities,
};