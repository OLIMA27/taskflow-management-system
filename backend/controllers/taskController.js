const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");

/*
Project status rules:

No tasks                 -> not-started
All tasks todo           -> not-started
Any task in-progress     -> in-progress
Any task review          -> final-review
All tasks completed      -> completed
Mixed todo/completed     -> started
*/

const updateProjectStatusFromTasks = async (
  projectId
) => {
  if (!projectId) {
    return;
  }

  const project = await Project.findById(
    projectId
  );

  if (!project) {
    return;
  }

  const tasks = await Task.find({
    project: projectId,
  }).select("status");

  let newProjectStatus = "not-started";

  if (tasks.length === 0) {
    newProjectStatus = "not-started";
  } else {
    const allTodo = tasks.every(
      (task) => task.status === "todo"
    );

    const allCompleted = tasks.every(
      (task) => task.status === "completed"
    );

    const hasInProgress = tasks.some(
      (task) => task.status === "in-progress"
    );

    const hasReview = tasks.some(
      (task) => task.status === "review"
    );

    if (allCompleted) {
      newProjectStatus = "completed";
    } else if (hasInProgress) {
      newProjectStatus = "in-progress";
    } else if (hasReview) {
      newProjectStatus = "final-review";
    } else if (allTodo) {
      newProjectStatus = "not-started";
    } else {
      newProjectStatus = "started";
    }
  }

  project.status = newProjectStatus;

  await project.save();
};

const createTask = asyncHandler(
  async (req, res) => {
    const {
      title,
      description,
      priority,
      dueDate,
      project,
      assignedTo,
    } = req.body;

    if (
      !title ||
      !description ||
      !project ||
      !assignedTo
    ) {
      res.status(400);
      throw new Error(
        "All required fields are needed"
      );
    }

    const projectData =
      await Project.findById(project);

    if (!projectData) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (
      projectData.assignedManager.toString() !==
      req.user._id.toString()
    ) {
      res.status(403);
      throw new Error(
        "This project is not assigned to you"
      );
    }

    const member = await User.findOne({
      _id: assignedTo,
      role: "member",
      createdBy: req.user._id,
    });

    if (!member) {
      res.status(400);
      throw new Error(
        "You can assign task only to your own member"
      );
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

    /*
    New task status is todo, so this recalculates
    the project status.
    */
    await updateProjectStatusFromTasks(project);

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

    const populatedTask = await Task.findById(
      task._id
    )
      .populate("project", "title status")
      .populate(
        "assignedTo",
        "name email designation memberNumber"
      )
      .populate(
        "assignedBy",
        "name email"
      );

    res.status(201).json(populatedTask);
  }
);

const getTasks = asyncHandler(
  async (req, res) => {
    let filter = {};

    if (req.user.role === "manager") {
      filter = {
        assignedBy: req.user._id,
      };
    }

    if (req.user.role === "member") {
      filter = {
        assignedTo: req.user._id,
      };
    }

    const tasks = await Task.find(filter)
      .populate("project", "title status")
      .populate(
        "assignedTo",
        "name email designation memberNumber"
      )
      .populate(
        "assignedBy",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.json(tasks);
  }
);

const updateTask = asyncHandler(
  async (req, res) => {
    const {
      title,
      description,
      priority,
      dueDate,
      project,
      assignedTo,
      status,
    } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      assignedBy: req.user._id,
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    /*
    Save the previous project because the manager
    may move the task to another project.
    */
    const oldProjectId =
      task.project.toString();

    if (project) {
      const projectData =
        await Project.findOne({
          _id: project,
          assignedManager: req.user._id,
        });

      if (!projectData) {
        res.status(400);
        throw new Error("Invalid project");
      }
    }

    if (assignedTo) {
      const member = await User.findOne({
        _id: assignedTo,
        role: "member",
        createdBy: req.user._id,
      });

      if (!member) {
        res.status(400);
        throw new Error("Invalid member");
      }
    }

    task.title = title || task.title;

    task.description =
      description || task.description;

    task.priority =
      priority || task.priority;

    task.dueDate =
      dueDate || task.dueDate;

    task.project =
      project || task.project;

    task.assignedTo =
      assignedTo || task.assignedTo;

    task.status =
      status || task.status;

    await task.save();

    const newProjectId =
      task.project.toString();

    /*
    Update the current project's status.
    */
    await updateProjectStatusFromTasks(
      newProjectId
    );

    /*
    When the task was moved to another project,
    update the previous project too.
    */
    if (oldProjectId !== newProjectId) {
      await updateProjectStatusFromTasks(
        oldProjectId
      );
    }

    const updatedTask = await Task.findById(
      task._id
    )
      .populate("project", "title status")
      .populate(
        "assignedTo",
        "name email designation memberNumber"
      )
      .populate(
        "assignedBy",
        "name email"
      );

    res.json(updatedTask);
  }
);

const deleteTask = asyncHandler(
  async (req, res) => {
    const task = await Task.findOne({
      _id: req.params.id,
      assignedBy: req.user._id,
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const projectId =
      task.project.toString();

    await task.deleteOne();

    /*
    Recalculate the project status after removing
    the task.
    */
    await updateProjectStatusFromTasks(
      projectId
    );

    res.json({
      message: "Task deleted successfully",
    });
  }
);

// const updateTaskStatus = asyncHandler(
//   async (req, res) => {
//     const { status } = req.body;

//     const allowedStatuses = [
//       "todo",
//       "in-progress",
//       "review",
//       "completed",
//     ];

//     if (!allowedStatuses.includes(status)) {
//       res.status(400);
//       throw new Error("Invalid task status");
//     }

//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       res.status(404);
//       throw new Error("Task not found");
//     }

//     if (
//       req.user.role === "member" &&
//       task.assignedTo.toString() !==
//         req.user._id.toString()
//     ) {
//       res.status(403);
//       throw new Error(
//         "You cannot update this task"
//       );
//     }

//     if (
//       req.user.role === "manager" &&
//       task.assignedBy.toString() !==
//         req.user._id.toString()
//     ) {
//       res.status(403);
//       throw new Error(
//         "You cannot update this task"
//       );
//     }

//     const oldStatus = task.status;

//     task.status = status;

//     await task.save();

//     /*
//       Get all tasks belonging to this project.
//     */
//     const projectTasks = await Task.find({
//       project: task.project,
//     }).select("status");

//     let newProjectStatus = "not-started";

//     if (projectTasks.length > 0) {
//       const allTodo = projectTasks.every(
//         (item) => item.status === "todo"
//       );

//       const allCompleted = projectTasks.every(
//         (item) => item.status === "completed"
//       );

//       const hasInProgress = projectTasks.some(
//         (item) =>
//           item.status === "in-progress"
//       );

//       const hasReview = projectTasks.some(
//         (item) => item.status === "review"
//       );

//       if (allCompleted) {
//         newProjectStatus = "completed";
//       } else if (hasInProgress) {
//         newProjectStatus = "in-progress";
//       } else if (hasReview) {
//         newProjectStatus = "final-review";
//       } else if (allTodo) {
//         newProjectStatus = "not-started";
//       } else {
//         newProjectStatus = "started";
//       }
//     }

//     const updatedProject =
//       await Project.findByIdAndUpdate(
//         task.project,
//         {
//           status: newProjectStatus,
//         },
//         {
//           new: true,
//           runValidators: true,
//         }
//       );

//     console.log(
//       "TASK STATUS:",
//       status
//     );

//     console.log(
//       "PROJECT ID:",
//       task.project.toString()
//     );

//     console.log(
//       "NEW PROJECT STATUS:",
//       updatedProject?.status
//     );

//     await Activity.create({
//       user: req.user._id,
//       action: "TASK_STATUS_UPDATED",
//       entityType: "task",
//       entityId: task._id,
//       description: `${req.user.name} changed task "${task.title}" status from "${oldStatus}" to "${status}"`,
//     });

//     if (
//       status === "completed" &&
//       oldStatus !== "completed"
//     ) {
//       const admin = await User.findOne({
//         role: "admin",
//       });

//       if (admin) {
//         await Notification.create({
//           recipient: admin._id,
//           sender: req.user._id,
//           title: "Task Completed",
//           message: `${req.user.name} completed task "${task.title}"`,
//         });
//       }
//     }

//     const updatedTask = await Task.findById(
//       task._id
//     )
//       .populate(
//         "project",
//         "title status"
//       )
//       .populate(
//         "assignedTo",
//         "name email designation memberNumber"
//       )
//       .populate(
//         "assignedBy",
//         "name email"
//       );

//     res.json(updatedTask);
//   }
// );

const updateTaskStatus = asyncHandler(
  async (req, res) => {
    const { status } = req.body;

    const allowedStatuses = [
      "todo",
      "in-progress",
      "review",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error("Invalid task status");
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (
      req.user.role === "member" &&
      task.assignedTo.toString() !==
        req.user._id.toString()
    ) {
      res.status(403);
      throw new Error(
        "You cannot update this task"
      );
    }

    if (
      req.user.role === "manager" &&
      task.assignedBy.toString() !==
        req.user._id.toString()
    ) {
      res.status(403);
      throw new Error(
        "You cannot update this task"
      );
    }

    const oldStatus = task.status;

    task.status = status;

    await task.save();

    const projectTasks = await Task.find({
      project: task.project,
    });

    let projectStatus = "not-started";

    const allCompleted = projectTasks.every(
      (item) => item.status === "completed"
    );

    const allTodo = projectTasks.every(
      (item) => item.status === "todo"
    );

    const hasInProgress = projectTasks.some(
      (item) => item.status === "in-progress"
    );

    const hasReview = projectTasks.some(
      (item) => item.status === "review"
    );

    if (allCompleted) {
      projectStatus = "completed";
    } else if (hasInProgress) {
      projectStatus = "in-progress";
    } else if (hasReview) {
      projectStatus = "final-review";
    } else if (allTodo) {
      projectStatus = "not-started";
    } else {
      projectStatus = "started";
    }

    await Project.findByIdAndUpdate(
      task.project,
      {
        $set: {
          status: projectStatus,
        },
      },
      {
        new: true,
      }
    );

    await Activity.create({
      user: req.user._id,
      action: "TASK_STATUS_UPDATED",
      entityType: "task",
      entityId: task._id,
      description: `${req.user.name} changed task "${task.title}" status from "${oldStatus}" to "${status}"`,
    });

    if (
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
          title: "Task Completed",
          message: `${req.user.name} completed task "${task.title}"`,
        });
      }
    }

    const updatedTask = await Task.findById(
      task._id
    )
      .populate("project", "title status")
      .populate(
        "assignedTo",
        "name email designation memberNumber"
      )
      .populate(
        "assignedBy",
        "name email"
      );

    res.json(updatedTask);
  }
);

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
};