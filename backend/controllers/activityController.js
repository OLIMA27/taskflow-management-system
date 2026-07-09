const Activity = require("../models/Activity");
const asyncHandler = require("../utils/asyncHandler");

const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.json(activities);
});

module.exports = {
  getActivities,
};