const express = require("express");

const {
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
} = require("../controllers/adminController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  allowRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.use(allowRoles("admin"));

router
  .route("/managers")
  .post(createManager)
  .get(getManagers);

router
  .route("/managers/:id")
  .get(getManagerById)
  .put(updateManager)
  .delete(deleteManager);

router.get("/members", getAllMembers);

router
  .route("/members/:id")
  .put(updateMember)
  .delete(deleteMember);

router.get("/projects", getAllProjects);

router.get("/tasks", getAllTasks);

module.exports = router;