const University = require("../models/University");
const ActivityLog = require("../models/ActivityLog");

// Get all universities (not deleted)
exports.getUniversities = async (req, res, next) => {
  try {
    const universities = await University.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: universities });
  } catch (error) {
    next(error);
  }
};

// Get all universities (including deleted)
exports.getAllUniversities = async (req, res, next) => {
  try {
    const universities = await University.find().sort({ createdAt: -1 });
    res.json({ success: true, data: universities });
  } catch (error) {
    next(error);
  }
};

// Get university by ID
exports.getUniversityById = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res
        .status(404)
        .json({ success: false, message: "University not found" });
    }
    res.json({ success: true, data: university });
  } catch (error) {
    next(error);
  }
};

exports.createUniversity = async (req, res) => {
  try {
    const data = {
      ...req.body,
      establishedYear: req.body.established_year, // map frontend key
    };

    const university = await University.create(data);

    await ActivityLog.create({
      action: "Create",
      entityType: "University",
      entityId: university._id,
      entityName: university.name,
      details: `University "${university.name}" (${university.code}) was created`,
      userId: req.user.userId,
    });

    res.status(201).json({ success: true, data: university });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update university
exports.updateUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!university) {
      return res
        .status(404)
        .json({ success: false, message: "University not found" });
    }

    await ActivityLog.create({
      action: "Update",
      entityType: "University",
      entityId: university._id,
      entityName: university.name,
      details: `University "${university.name}" was updated`,
      userId: req.user.userId,
    });

    res.json({ success: true, data: university });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }
    next(error);
  }
};

// Soft delete university
exports.deleteUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    );

    if (!university) {
      return res
        .status(404)
        .json({ success: false, message: "University not found" });
    }

    await ActivityLog.create({
      action: "Delete",
      entityType: "University",
      entityId: university._id,
      entityName: university.name,
      details: `University "${university.name}" was deleted`,
      userId: req.user.userId,
    });

    res.json({ success: true, message: "University deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Restore university
exports.restoreUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, updatedAt: new Date() },
      { new: true }
    );

    if (!university) {
      return res
        .status(404)
        .json({ success: false, message: "University not found" });
    }

    await ActivityLog.create({
      action: "Restore",
      entityType: "University",
      entityId: university._id,
      entityName: university.name,
      details: `University "${university.name}" was restored`,
      userId: req.user.userId,
    });

    res.json({ success: true, data: university });
  } catch (error) {
    next(error);
  }
};
