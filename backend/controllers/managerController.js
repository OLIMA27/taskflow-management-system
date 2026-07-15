const User = require("../models/User");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const createMember = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    designation,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !designation
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const memberExists = await User.findOne({
    email,
  });

  if (memberExists) {
    res.status(400);
    throw new Error(
      "Member already exists with this email"
    );
  }

  const memberCount = await User.countDocuments({
    role: "member",
    createdBy: req.user._id,
  });

  const member = await User.create({
    name,
    email,
    password,
    designation,
    memberNumber: memberCount + 1,
    role: "member",
    createdBy: req.user._id,
  });

  res.status(201).json({
    _id: member._id,
    name: member.name,
    email: member.email,
    designation: member.designation,
    memberNumber: member.memberNumber,
    role: member.role,
  });
});

const getMyMembers = asyncHandler(async (req, res) => {
  const members = await User.find({
    role: "member",
    createdBy: req.user._id,
  })
    .select("-password")
    .sort({ memberNumber: 1 });

  res.status(200).json(members);
});

const updateMember = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    designation,
  } = req.body;

  const member = await User.findOne({
    _id: req.params.id,
    role: "member",
    createdBy: req.user._id,
  });

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  const emailExists = await User.findOne({
    email,
    _id: {
      $ne: member._id,
    },
  });

  if (emailExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  member.name = name || member.name;
  member.email = email || member.email;
  member.designation =
    designation || member.designation;

  const updatedMember = await member.save();

  res.json({
    _id: updatedMember._id,
    name: updatedMember.name,
    email: updatedMember.email,
    designation: updatedMember.designation,
    memberNumber: updatedMember.memberNumber,
    role: updatedMember.role,
  });
});

const deleteMember = asyncHandler(async (req, res) => {
  const member = await User.findOne({
    _id: req.params.id,
    role: "member",
    createdBy: req.user._id,
  });

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  await member.deleteOne();

  res.json({
    message: "Member deleted successfully",
  });
});

const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    assignedManager: req.user._id,
  }).populate(
    "assignedManager",
    "name email role"
  );

  res.status(200).json(projects);
});

module.exports = {
  createMember,
  getMyMembers,
  updateMember,
  deleteMember,
  getMyProjects,
};