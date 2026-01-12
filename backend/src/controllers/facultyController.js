const Faculty = require('../models/Faculty');
const ActivityLog = require('../models/ActivityLog');

// Get all faculty (not deleted)
exports.getFaculty = async (req, res, next) => {
    try {
        const faculty = await Faculty.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.json({ success: true, data: faculty });
    } catch (error) {
        next(error);
    }
};

// Get all faculty (including deleted)
exports.getAllFaculty = async (req, res, next) => {
    try {
        const faculty = await Faculty.find().sort({ createdAt: -1 });
        res.json({ success: true, data: faculty });
    } catch (error) {
        next(error);
    }
};

// Get faculty by ID
exports.getFacultyById = async (req, res, next) => {
    try {
        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) {
            return res.status(404).json({ success: false, message: 'Faculty not found' });
        }
        res.json({ success: true, data: faculty });
    } catch (error) {
        next(error);
    }
};

// Create faculty
exports.createFaculty = async (req, res, next) => {
    try {
        const faculty = await Faculty.create(req.body);

        // Log activity
        await ActivityLog.create({
            action: 'Create',
            entityType: 'Faculty',
            entityId: faculty._id,
            entityName: faculty.fullName,
            details: `Faculty "${faculty.fullName}" (${faculty.employeeId}) was added`,
            userId: req.user.userId,
        });

        res.status(201).json({ success: true, data: faculty });
    } catch (error) {
        next(error);
    }
};

// Update faculty
exports.updateFaculty = async (req, res, next) => {
    try {
        const faculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!faculty) {
            return res.status(404).json({ success: false, message: 'Faculty not found' });
        }

        // Log activity
        await ActivityLog.create({
            action: 'Update',
            entityType: 'Faculty',
            entityId: faculty._id,
            entityName: faculty.fullName,
            details: `Faculty "${faculty.fullName}" was updated`,
            userId: req.user.userId,
        });

        res.json({ success: true, data: faculty });
    } catch (error) {
        next(error);
    }
};

// Soft delete faculty
exports.deleteFaculty = async (req, res, next) => {
    try {
        const faculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true, updatedAt: new Date() },
            { new: true }
        );

        if (!faculty) {
            return res.status(404).json({ success: false, message: 'Faculty not found' });
        }

        // Log activity
        await ActivityLog.create({
            action: 'Delete',
            entityType: 'Faculty',
            entityId: faculty._id,
            entityName: faculty.fullName,
            details: `Faculty "${faculty.fullName}" was deleted`,
            userId: req.user.userId,
        });

        res.json({ success: true, message: 'Faculty deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Restore faculty
exports.restoreFaculty = async (req, res, next) => {
    try {
        const faculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            { isDeleted: false, updatedAt: new Date() },
            { new: true }
        );

        if (!faculty) {
            return res.status(404).json({ success: false, message: 'Faculty not found' });
        }

        // Log activity
        await ActivityLog.create({
            action: 'Restore',
            entityType: 'Faculty',
            entityId: faculty._id,
            entityName: faculty.fullName,
            details: `Faculty "${faculty.fullName}" was restored`,
            userId: req.user.userId,
        });

        res.json({ success: true, data: faculty });
    } catch (error) {
        next(error);
    }
};
