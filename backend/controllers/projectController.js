


const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");

const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    deadline,
    assignedManager,
  } = req.body;

  const manager = await User.findById(
    assignedManager
  );

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

  const createdProject = await Project.findById(
    project._id
  ).populate("assignedManager", "name email");

  res.status(201).json(createdProject);
});

const getProjects = asyncHandler(async (req, res) => {
  let projects;

  if (req.user.role === "admin") {
    projects = await Project.find()
      .populate("assignedManager", "name email")
      .sort({ createdAt: -1 });
  } else if (req.user.role === "manager") {
    projects = await Project.find({
      assignedManager: req.user._id,
    })
      .populate("assignedManager", "name email")
      .sort({ createdAt: -1 });
  } else {
    projects = [];
  }

  res.json(projects);
});

const getProjectById = asyncHandler(
  async (req, res) => {
    const project = await Project.findById(
      req.params.id
    ).populate("assignedManager", "name email");

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (
      req.user.role === "manager" &&
      project.assignedManager._id.toString() !==
        req.user._id.toString()
    ) {
      res.status(403);
      throw new Error(
        "You cannot view this project"
      );
    }

    res.json(project);
  }
);

const updateProject = asyncHandler(
  async (req, res) => {
    const { title, description, deadline } =
      req.body;

    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    project.title = title || project.title;

    project.description =
      description || project.description;

    project.deadline = deadline || null;

    await project.save();

    await Activity.create({
      user: req.user._id,
      action: "PROJECT_UPDATED",
      entityType: "project",
      entityId: project._id,
      description: `${req.user.name} updated project "${project.title}"`,
    });

    const updatedProject = await Project.findById(
      project._id
    ).populate("assignedManager", "name email");

    res.json(updatedProject);
  }
);

const deleteProject = asyncHandler(
  async (req, res) => {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const projectTasks = await Task.countDocuments({
      project: project._id,
    });

    if (projectTasks > 0) {
      res.status(400);

      throw new Error(
        "This project has tasks. Delete the project tasks first."
      );
    }

    await project.deleteOne();

    res.json({
      message: "Project deleted successfully",
    });
  }
);

const updateProjectStatus = asyncHandler(
  async (req, res) => {
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
      throw new Error(
        "Invalid project status"
      );
    }

    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (
      req.user.role === "manager" &&
      project.assignedManager.toString() !==
        req.user._id.toString()
    ) {
      res.status(403);
      throw new Error(
        "You cannot update this project"
      );
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

    // Notify Admin when project is completed by Manager
    if (
      req.user.role === "manager" &&
      status === "completed" &&
      oldStatus !== "completed"
    ) {
      const admin = await User.findOne({
        role: "admin",
      });

      if (admin) {
        await Notification.create({
          recipient: admin._id,
          sender: req.user._id,
          title: "Project Completed",
          message: `${req.user.name} completed project "${project.title}"`,
        });
      }
    }

    const updatedProject =
      await Project.findById(
        project._id
      ).populate(
        "assignedManager",
        "name email"
      );

    res.json(updatedProject);
  }
);

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectStatus,
};