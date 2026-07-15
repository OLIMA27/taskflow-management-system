const express = require("express");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/taskController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  allowRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(allowRoles("manager"), createTask)
  .get(
    allowRoles("admin", "manager", "member"),
    getTasks
  );

router
  .route("/:id")
  .put(allowRoles("manager"), updateTask)
  .delete(allowRoles("manager"), deleteTask);

router.patch(
  "/:id/status",
  allowRoles("manager", "member"),
  updateTaskStatus
);

module.exports = router;