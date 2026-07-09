const express = require("express");
const {
  createMember,
  getMyMembers,
  getMyProjects,
} = require("../controllers/managerController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.use(allowRoles("manager"));

router.post("/members", createMember);
router.get("/members", getMyMembers);
router.get("/projects", getMyProjects);

module.exports = router;