const Enrollment = require('../models/Enrollment');
const ActivityLog = require('../models/ActivityLog');

// Get all enrollments (not deleted)
exports.getEnrollments = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ isDeleted: false })
            .populate('studentId', 'fullName studentId')
            .populate('courseId', 'courseName courseCode')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: enrollments });
    } catch (error) {
        next(error);
    }
};

// Get all enrollments (including deleted)
exports.getAllEnrollments = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('studentId', 'fullName studentId')
            .populate('courseId', 'courseName courseCode')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: enrollments });
    } catch (error) {
        next(error);
    }
};

// Get enrollment by ID
exports.getEnrollmentById = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
            .populate('studentId', 'fullName studentId')
            .populate('courseId', 'courseName courseCode');
        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }
        res.json({ success: true, data: enrollment });
    } catch (error) {
        next(error);
    }
};

// Create enrollment
exports.createEnrollment = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.create(req.body);

        // Populate for response
        await enrollment.populate('studentId', 'fullName studentId');
        await enrollment.populate('courseId', 'courseName courseCode');

        // Log activity
        await ActivityLog.create({
            action: 'Create',
            entityType: 'Enrollment',
            entityId: enrollment._id,
            details: `Enrollment was created`,
            userId: req.user.userId,
        });

        res.status(201).json({ success: true, data: enrollment });
    } catch (error) {
        next(error);
    }
};

// Update enrollment
exports.updateEnrollment = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        )
            .populate('studentId', 'fullName studentId')
            .populate('courseId', 'courseName courseCode');

        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }

        // Log activity
        await ActivityLog.create({
            action: 'Update',
            entityType: 'Enrollment',
            entityId: enrollment._id,
            details: `Enrollment was updated`,
            userId: req.user.userId,
        });

        res.json({ success: true, data: enrollment });
    } catch (error) {
        next(error);
    }
};

// Soft delete enrollment
exports.deleteEnrollment = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true, updatedAt: new Date() },
            { new: true }
        );

        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }

        // Log activity
        await ActivityLog.create({
            action: 'Delete',
            entityType: 'Enrollment',
            entityId: enrollment._id,
            details: `Enrollment was deleted`,
            userId: req.user.userId,
        });

        res.json({ success: true, message: 'Enrollment deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Restore enrollment
exports.restoreEnrollment = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            { isDeleted: false, updatedAt: new Date() },
            { new: true }
        )
            .populate('studentId', 'fullName studentId')
            .populate('courseId', 'courseName courseCode');

        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }

        // Log activity
        await ActivityLog.create({
            action: 'Restore',
            entityType: 'Enrollment',
            entityId: enrollment._id,
            details: `Enrollment was restored`,
            userId: req.user.userId,
        });

        res.json({ success: true, data: enrollment });
    } catch (error) {
        next(error);
    }
};
