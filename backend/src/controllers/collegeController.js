const College = require("../models/College");
const ActivityLog = require("../models/ActivityLog");

exports.getColleges = async (req, res, next) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.universityId) {
      filter.universityId = req.query.universityId;
    }

    const colleges = await College.find(filter)
      .populate("universityId", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: colleges });
  } catch (error) {
    next(error);
  }
};

exports.getCollegeById = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id).populate(
      "universityId",
      "name"
    );

    if (!college || college.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

exports.createCollege = async (req, res, next) => {
  try {
    const college = await College.create(req.body);

    await ActivityLog.create({
      action: "Create",
      entityType: "College",
      entityId: college._id,
      entityName: college.name,
      details: `College "${college.name}" created`,
      userId: req.user.userId,
    });

    res.status(201).json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

exports.updateCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    await ActivityLog.create({
      action: "Update",
      entityType: "College",
      entityId: college._id,
      entityName: college.name,
      details: `College "${college.name}" updated`,
      userId: req.user.userId,
    });

    res.json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

exports.deleteCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    await ActivityLog.create({
      action: "Delete",
      entityType: "College",
      entityId: college._id,
      entityName: college.name,
      details: `College "${college.name}" deleted`,
      userId: req.user.userId,
    });

    res.json({ success: true, message: "College deleted" });
  } catch (error) {
    next(error);
  }
};
