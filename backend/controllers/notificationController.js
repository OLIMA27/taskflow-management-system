const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user._id,
  })
    .populate("sender", "name email role")
    .sort({ createdAt: -1 });

  res.json(notifications);
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You cannot update this notification");
  }

  notification.isRead = true;
  await notification.save();

  res.json(notification);
});

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
};