const express = require("express");
const { getActivities } = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", allowRoles("admin", "manager", "member"), getActivities);

module.exports = router;