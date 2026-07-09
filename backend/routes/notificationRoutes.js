const express = require("express");
const {
  getMyNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/:id/read", markNotificationAsRead);

module.exports = router;