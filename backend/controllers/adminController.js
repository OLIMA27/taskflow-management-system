const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

const createManager = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });

  if (exists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const manager = await User.create({
    name,
    email,
    password,
    role: "manager",
    createdBy: req.user._id,
  });

  res.status(201).json({
    _id: manager._id,
    name: manager.name,
    email: manager.email,
    role: manager.role,
    createdAt: manager.createdAt,
  });
});

const getManagers = asyncHandler(async (req, res) => {
  const managers = await User.find({
    role: "manager",
  })
    .select("-password")
    .sort({ createdAt: -1 });

  const managersWithCounts = await Promise.all(
    managers.map(async (manager) => {
      const assignedProjects =
        await Project.countDocuments({
          assignedManager: manager._id,
        });

      const teamMembers =
        await User.countDocuments({
          role: "member",
          createdBy: manager._id,
        });

      return {
        _id: manager._id,
        name: manager.name,
        email: manager.email,
        createdAt: manager.createdAt,
        assignedProjects,
        teamMembers,
      };
    })
  );

  res.json(managersWithCounts);
});

const getManagerById = asyncHandler(async (req, res) => {
  const manager = await User.findOne({
    _id: req.params.id,
    role: "manager",
  }).select("-password");

  if (!manager) {
    res.status(404);
    throw new Error("Manager not found");
  }

  res.json(manager);
});

const updateManager = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const manager = await User.findOne({
    _id: req.params.id,
    role: "manager",
  });

  if (!manager) {
    res.status(404);
    throw new Error("Manager not found");
  }

  const emailExists = await User.findOne({
    email,
    _id: {
      $ne: manager._id,
    },
  });

  if (emailExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  manager.name = name || manager.name;
  manager.email = email || manager.email;

  const updatedManager = await manager.save();

  res.json({
    _id: updatedManager._id,
    name: updatedManager.name,
    email: updatedManager.email,
    role: updatedManager.role,
  });
});

const deleteManager = asyncHandler(async (req, res) => {
  const manager = await User.findOne({
    _id: req.params.id,
    role: "manager",
  });

  if (!manager) {
    res.status(404);
    throw new Error("Manager not found");
  }

  const assignedProjects = await Project.countDocuments({
    assignedManager: manager._id,
  });

  if (assignedProjects > 0) {
    res.status(400);
    throw new Error(
      "This manager has assigned projects. Reassign or delete those projects first."
    );
  }

  const managerMembers = await User.countDocuments({
    role: "member",
    createdBy: manager._id,
  });

  if (managerMembers > 0) {
    res.status(400);
    throw new Error(
      "This manager has team members. Delete those members first."
    );
  }

  await manager.deleteOne();

  res.json({
    message: "Manager deleted successfully",
  });
});

const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find()
    .populate("assignedManager", "name email role")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  res.json(projects);
});

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find()
    .populate("project", "title")
    .populate("assignedBy", "name email role")
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 });

  res.json(tasks);
});

const getAllMembers = asyncHandler(async (req, res) => {
  const members = await User.find({
    role: "member",
  })
    .select("-password")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  res.json(members);
});

const updateMember = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const member = await User.findOne({
    _id: req.params.id,
    role: "member",
  });

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Member name is required");
  }

  if (!email || !email.trim()) {
    res.status(400);
    throw new Error("Member email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailExists = await User.findOne({
    email: normalizedEmail,
    _id: {
      $ne: member._id,
    },
  });

  if (emailExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  member.name = name.trim();
  member.email = normalizedEmail;

  const updatedMember = await member.save();

  await updatedMember.populate(
    "createdBy",
    "name email role"
  );

  res.json({
    _id: updatedMember._id,
    name: updatedMember.name,
    email: updatedMember.email,
    role: updatedMember.role,
    createdBy: updatedMember.createdBy,
    createdAt: updatedMember.createdAt,
    updatedAt: updatedMember.updatedAt,
  });
});

const deleteMember = asyncHandler(async (req, res) => {
  const member = await User.findOne({
    _id: req.params.id,
    role: "member",
  });

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  const assignedTasks = await Task.countDocuments({
    assignedTo: member._id,
  });

  if (assignedTasks > 0) {
    res.status(400);
    throw new Error(
      "This member has assigned tasks. Reassign or delete those tasks first."
    );
  }

  await member.deleteOne();

  res.json({
    message: "Member deleted successfully",
  });
});

module.exports = {
  createManager,
  getManagers,
  getManagerById,
  updateManager,
  deleteManager,
  getAllProjects,
  getAllTasks,
  getAllMembers,
  updateMember,
  deleteMember,
};