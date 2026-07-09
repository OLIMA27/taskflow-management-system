const express = require("express");
const {
  createTask,
  getTasks,
  updateTaskStatus,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", allowRoles("manager"), createTask);
router.get("/", allowRoles("admin", "manager", "member"), getTasks);
router.patch("/:id/status", allowRoles("manager", "member"), updateTaskStatus);

module.exports = router;