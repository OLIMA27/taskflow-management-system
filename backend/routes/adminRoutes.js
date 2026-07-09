const express = require("express");
const {
  createManager,
  getManagers,
  getAllProjects,
  getAllTasks,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.use(allowRoles("admin"));

router.post("/managers", createManager);
router.get("/managers", getManagers);
router.get("/projects", getAllProjects);
router.get("/tasks", getAllTasks);

module.exports = router;