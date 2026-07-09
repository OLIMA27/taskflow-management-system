const Project = require("../models/Project");
const User = require("../models/User");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");

const createProject = asyncHandler(async (req, res) => {
  const { title, description, deadline, assignedManager } = req.body;

  const manager = await User.findById(assignedManager);

  if (!manager || manager.role !== "manager") {
    res.status(400);
    throw new Error("Invalid manager selected");
  }

  const project = await Project.create({
    title,
    description,
    deadline,
    assignedManager,
    createdBy: req.user._id,
  });

  await Activity.create({
    user: req.user._id,
    action: "PROJECT_CREATED",
    entityType: "project",
    entityId: project._id,
    description: `${req.user.name} created project "${project.title}"`,
  });

  await Notification.create({
    recipient: assignedManager,
    sender: req.user._id,
    title: "New Project Assigned",
    message: `You have been assigned to project "${project.title}"`,
  });

  res.status(201).json(project);
});

const getProjects = asyncHandler(async (req, res) => {
  let projects;

  if (req.user.role === "admin") {
    projects = await Project.find().populate("assignedManager", "name email");
  } else if (req.user.role === "manager") {
    projects = await Project.find({ assignedManager: req.user._id }).populate(
      "assignedManager",
      "name email"
    );
  } else {
    projects = [];
  }

  res.json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "assignedManager",
    "name email"
  );

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (
    req.user.role === "manager" &&
    project.assignedManager._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("You cannot view this project");
  }

  res.json(project);
});

const updateProjectStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = [
    "not-started",
    "started",
    "in-progress",
    "testing",
    "final-review",
    "completed",
    "on-hold",
  ];

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid project status");
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (
    req.user.role === "manager" &&
    project.assignedManager.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("You cannot update this project");
  }

  const oldStatus = project.status;

  project.status = status;
  await project.save();

  await Activity.create({
    user: req.user._id,
    action: "PROJECT_STATUS_UPDATED",
    entityType: "project",
    entityId: project._id,
    description: `${req.user.name} changed project "${project.title}" status from "${oldStatus}" to "${status}"`,
  });

  const updatedProject = await Project.findById(project._id).populate(
    "assignedManager",
    "name email"
  );

  res.json(updatedProject);
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProjectStatus,
};