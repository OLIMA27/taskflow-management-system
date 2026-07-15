const express = require("express");

const {
  createMember,
  getMyMembers,
  updateMember,
  deleteMember,
  getMyProjects,
} = require("../controllers/managerController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  allowRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.use(allowRoles("manager"));

router
  .route("/members")
  .post(createMember)
  .get(getMyMembers);

router
  .route("/members/:id")
  .put(updateMember)
  .delete(deleteMember);

router.get("/projects", getMyProjects);

module.exports = router;