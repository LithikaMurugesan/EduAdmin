const Department = require("../models/Department");
const ActivityLog = require("../models/ActivityLog");
const College = require("../models/College");

exports.getDepartments = async (req, res, next) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.universityId) {
      filter.universityId = req.query.universityId;
    }

    if (req.query.collegeId) {
      filter.collegeId = req.query.collegeId;
    }

    const departments = await Department.find(filter)
      .populate("universityId", "name")
      .populate("collegeId", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
};

// Get all departments (including deleted)
exports.getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }
    res.json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

exports.createDepartment = async (req, res, next) => {
  try {
    const { universityId, collegeId } = req.body;

    const college = await College.findOne({
      _id: collegeId,
      universityId,
      isDeleted: false,
    });

    if (!college) {
      return res.status(400).json({
        success: false,
        message: "College does not belong to selected university",
      });
    }

    const department = await Department.create(req.body);

    await ActivityLog.create({
      action: "Create",
      entityType: "Department",
      entityId: department._id,
      entityName: department.name,
      details: `Department "${department.name}" was created`,
      userId: req.user.userId,
    });

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const { universityId, collegeId } = req.body;

    if (universityId && collegeId) {
      const college = await College.findOne({
        _id: collegeId,
        universityId,
        isDeleted: false,
      });

      if (!college) {
        return res.status(400).json({
          success: false,
          message: "College does not belong to selected university",
        });
      }
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    await ActivityLog.create({
      action: "Update",
      entityType: "Department",
      entityId: department._id,
      entityName: department.name,
      details: `Department "${department.name}" was updated`,
      userId: req.user.userId,
    });

    res.json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

// Soft delete department
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    );

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    // Log activity
    await ActivityLog.create({
      action: "Delete",
      entityType: "Department",
      entityId: department._id,
      entityName: department.name,
      details: `Department "${department.name}" was deleted`,
      userId: req.user.userId,
    });

    res.json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Restore department
exports.restoreDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, updatedAt: new Date() },
      { new: true }
    );

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    // Log activity
    await ActivityLog.create({
      action: "Restore",
      entityType: "Department",
      entityId: department._id,
      entityName: department.name,
      details: `Department "${department.name}" was restored`,
      userId: req.user.userId,
    });

    res.json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};
