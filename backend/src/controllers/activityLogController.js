const ActivityLog = require("../models/ActivityLog");

exports.getActivityLogs = async (req, res, next) => {
  try {
    const { entityType, action, startDate, endDate } = req.query;


    const filter = {};
    if (entityType) filter.entityType = entityType;
    if (action) filter.action = action;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(filter)
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .limit(1000); // Limit to prevent overwhelming responses

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};


exports.getActivityLogById = async (req, res, next) => {
  try {
    const log = await ActivityLog.findById(req.params.id).populate(
      "userId",
      "fullName email"
    );

    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "Activity log not found" });
    }

    res.json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};
