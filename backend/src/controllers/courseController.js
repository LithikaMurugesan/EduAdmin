const Course = require("../models/Course");
const ActivityLog = require("../models/ActivityLog");

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);

    await ActivityLog.create({
      action: "Create",
      entityType: "Course",
      entityId: course._id,
      entityName: course.courseName,
      details: `Course "${course.courseName}" (${course.courseCode}) was created`,
      userId: req.user.userId,
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    await ActivityLog.create({
      action: "Update",
      entityType: "Course",
      entityId: course._id,
      entityName: course.courseName,
      details: `Course "${course.courseName}" was updated`,
      userId: req.user.userId,
    });

    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    await ActivityLog.create({
      action: "Delete",
      entityType: "Course",
      entityId: course._id,
      entityName: course.courseName,
      details: `Course "${course.courseName}" was deleted`,
      userId: req.user.userId,
    });

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Restore course
exports.restoreCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, updatedAt: new Date() },
      { new: true }
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Log activity
    await ActivityLog.create({
      action: "Restore",
      entityType: "Course",
      entityId: course._id,
      entityName: course.courseName,
      details: `Course "${course.courseName}" was restored`,
      userId: req.user.userId,
    });

    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};
