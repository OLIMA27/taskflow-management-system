const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, project, assignedTo } = req.body;

  const projectData = await Project.findById(project);

  if (!projectData) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (projectData.assignedManager.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("This project is not assigned to you");
  }

  const member = await User.findById(assignedTo);

  if (
    !member ||
    member.role !== "member" ||
    member.createdBy.toString() !== req.user._id.toString()
  ) {
    res.status(400);
    throw new Error("You can assign task only to your own member");
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    project,
    assignedTo,
    assignedBy: req.user._id,
  });

  res.status(201).json(task);
  await Activity.create({
  user: req.user._id,
  action: "TASK_CREATED",
  entityType: "task",
  entityId: task._id,
  description: `${req.user.name} created task "${task.title}"`,
});

await Notification.create({
  recipient: assignedTo,
  sender: req.user._id,
  title: "New Task Assigned",
  message: `You have been assigned a new task: "${task.title}"`,
});
});

const getTasks = asyncHandler(async (req, res) => {
  let tasks;

  if (req.user.role === "admin") {
    tasks = await Task.find()
      .populate("project", "title")
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");
  } else if (req.user.role === "manager") {
    tasks = await Task.find({ assignedBy: req.user._id })
      .populate("project", "title")
      .populate("assignedTo", "name email");
  } else {
    tasks = await Task.find({ assignedTo: req.user._id }).populate(
      "project",
      "title"
    );
  }

  res.json(tasks);
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
const oldStatus = task.status;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (
    req.user.role === "member" &&
    task.assignedTo.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("You cannot update this task");
  }

  if (
    req.user.role === "manager" &&
    task.assignedBy.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("You cannot update this task");
  }

  task.status = status || task.status;
  await task.save();
  await Activity.create({
  user: req.user._id,
  action: "TASK_STATUS_UPDATED",
  entityType: "task",
  entityId: task._id,
  description: `${req.user.name} changed task "${task.title}" status from "${oldStatus}" to "${task.status}"`,
});

  res.json(task);
});

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
};