const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Activity = require("../models/Activity");
const asyncHandler = require("../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {
  // =========================
  // ADMIN DASHBOARD
  // =========================
  if (req.user.role === "admin") {
    const managers = await User.countDocuments({
      role: "manager",
    });

    const members = await User.countDocuments({
      role: "member",
    });

    const projects = await Project.countDocuments();

    const tasks = await Task.countDocuments();

    const projectStatus = {
      notStarted: await Project.countDocuments({
        status: "not-started",
      }),

      started: await Project.countDocuments({
        status: "started",
      }),

      inProgress: await Project.countDocuments({
        status: "in-progress",
      }),

      testing: await Project.countDocuments({
        status: "testing",
      }),

      finalReview: await Project.countDocuments({
        status: "final-review",
      }),

      completed: await Project.countDocuments({
        status: "completed",
      }),

      onHold: await Project.countDocuments({
        status: "on-hold",
      }),
    };

    const taskStatus = {
      todo: await Task.countDocuments({
        status: "todo",
      }),

      inProgress: await Task.countDocuments({
        status: "in-progress",
      }),

      review: await Task.countDocuments({
        status: "review",
      }),

      completed: await Task.countDocuments({
        status: "completed",
      }),
    };

    const overdueTasks = await Task.countDocuments({
      dueDate: {
        $lt: new Date(),
      },
      status: {
        $ne: "completed",
      },
    });

    const recentProjects = await Project.find()
      .populate("assignedManager", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivities = await Activity.find()
      .populate("user", "name role")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      managers,
      members,
      projects,
      tasks,
      overdueTasks,
      projectStatus,
      taskStatus,
      recentProjects,
      recentActivities,
    });
  }

  // =========================
  // MANAGER DASHBOARD
  // =========================
  if (req.user.role === "manager") {
    const managerId = req.user._id;

    const members = await User.countDocuments({
      role: "member",
      createdBy: managerId,
    });

    const projects = await Project.countDocuments({
      assignedManager: managerId,
    });

    const tasks = await Task.countDocuments({
      assignedBy: managerId,
    });

    const taskStatus = {
      todo: await Task.countDocuments({
        assignedBy: managerId,
        status: "todo",
      }),

      inProgress: await Task.countDocuments({
        assignedBy: managerId,
        status: "in-progress",
      }),

      review: await Task.countDocuments({
        assignedBy: managerId,
        status: "review",
      }),

      completed: await Task.countDocuments({
        assignedBy: managerId,
        status: "completed",
      }),
    };

    return res.json({
      members,
      projects,
      tasks,
      taskStatus,
    });
  }

   // =========================
  // MEMBER DASHBOARD
  // =========================

  const memberId = req.user._id;

  const myTasks = await Task.countDocuments({
    assignedTo: memberId,
  });

  const todoTasks = await Task.countDocuments({
    assignedTo: memberId,
    status: "todo",
  });

  const inProgressTasks = await Task.countDocuments({
    assignedTo: memberId,
    status: "in-progress",
  });

  const reviewTasks = await Task.countDocuments({
    assignedTo: memberId,
    status: "review",
  });

  const completedTasks = await Task.countDocuments({
    assignedTo: memberId,
    status: "completed",
  });

  return res.json({
    myTasks,
    todoTasks,
    inProgressTasks,
    reviewTasks,
    completedTasks,

    taskStatus: {
      todo: todoTasks,
      inProgress: inProgressTasks,
      review: reviewTasks,
      completed: completedTasks,
    },
  });
});

module.exports = {
  getDashboard,
};