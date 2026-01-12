const Student = require("../models/Student");
const ActivityLog = require("../models/ActivityLog");

// Helper function to log activities safely
const logActivity = async ({ action, student, userId }) => {
  if (!student || !userId) return;
  await ActivityLog.create({
    action,
    entityType: "Student",
    entityId: student._id,
    entityName: student.fullName,
    details: `Student "${student.fullName}" was ${action.toLowerCase()}`,
    userId,
  });
};

// Get all students (not deleted)
exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ isDeleted: false })
      .populate({
        path: "departmentId",
        populate: { path: "universityId" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

// Get all students (including deleted)
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find()
      .populate({
        path: "departmentId",
        populate: { path: "universityId" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

// Get student by ID
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate({
      path: "departmentId",
      populate: { path: "universityId" },
    });

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// Create student
exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    const populatedStudent = await Student.findById(student._id).populate({
      path: "departmentId",
      populate: { path: "universityId" },
    });

    await logActivity({
      action: "Create",
      student: populatedStudent,
      userId: req.user?.userId,
    });

    res.status(201).json({ success: true, data: populatedStudent });
  } catch (error) {
    next(error);
  }
};

// Update student
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate({
      path: "departmentId",
      populate: { path: "universityId" },
    });

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    await logActivity({ action: "Update", student, userId: req.user?.userId });

    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// Soft delete student
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    );

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    await logActivity({ action: "Delete", student, userId: req.user?.userId });

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Restore student
exports.restoreStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, updatedAt: new Date() },
      { new: true }
    );

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    await logActivity({ action: "Restore", student, userId: req.user?.userId });

    const populatedStudent = await Student.findById(student._id).populate({
      path: "departmentId",
      populate: { path: "universityId" },
    });

    res.json({ success: true, data: populatedStudent });
  } catch (error) {
    next(error);
  }
};

// Get deleted students only (Recycle Bin)
exports.getDeletedStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ isDeleted: true })
      .populate({
        path: "departmentId",
        populate: { path: "universityId" },
      })
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};
