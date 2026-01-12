const createCRUDController = (Model, entityName) => {
  const ActivityLog = require("../models/ActivityLog");

  return {
    // Get all (not deleted)
    getAll: async (req, res, next) => {
      try {
        const items = await Model.find({ isDeleted: false }).sort({
          createdAt: -1,
        });
        res.json({ success: true, data: items });
      } catch (error) {
        next(error);
      }
    },

    // Get all (including deleted)
    getAllIncludingDeleted: async (req, res, next) => {
      try {
        const items = await Model.find().sort({ createdAt: -1 });
        res.json({ success: true, data: items });
      } catch (error) {
        next(error);
      }
    },

    // Get by ID
    getById: async (req, res, next) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) {
          return res
            .status(404)
            .json({ success: false, message: `${entityName} not found` });
        }
        res.json({ success: true, data: item });
      } catch (error) {
        next(error);
      }
    },

    // Create
    create: async (req, res, next) => {
      try {
        const item = await Model.create(req.body);

        // Log activity
        await ActivityLog.create({
          action: "Create",
          entityType: entityName,
          entityId: item._id,
          entityName: item.name || item.fullName || item.courseName || "",
          details: `${entityName} was created`,
          userId: req.user.userId,
        });

        res.status(201).json({ success: true, data: item });
      } catch (error) {
        next(error);
      }
    },

    // Update
    update: async (req, res, next) => {
      try {
        const item = await Model.findByIdAndUpdate(
          req.params.id,
          { ...req.body, updatedAt: new Date() },
          { new: true, runValidators: true }
        );

        if (!item) {
          return res
            .status(404)
            .json({ success: false, message: `${entityName} not found` });
        }

        // Log activity
        await ActivityLog.create({
          action: "Update",
          entityType: entityName,
          entityId: item._id,
          entityName: item.name || item.fullName || item.courseName || "",
          details: `${entityName} was updated`,
          userId: req.user.userId,
        });

        res.json({ success: true, data: item });
      } catch (error) {
        next(error);
      }
    },

    // Soft delete
    delete: async (req, res, next) => {
      try {
        const item = await Model.findByIdAndUpdate(
          req.params.id,
          { isDeleted: true, updatedAt: new Date() },
          { new: true }
        );

        if (!item) {
          return res
            .status(404)
            .json({ success: false, message: `${entityName} not found` });
        }

        // Log activity
        await ActivityLog.create({
          action: "Delete",
          entityType: entityName,
          entityId: item._id,
          entityName: item.name || item.fullName || item.courseName || "",
          details: `${entityName} was deleted`,
          userId: req.user.userId,
        });

        res.json({
          success: true,
          message: `${entityName} deleted successfully`,
        });
      } catch (error) {
        next(error);
      }
    },

    // Restore
    restore: async (req, res, next) => {
      try {
        const item = await Model.findByIdAndUpdate(
          req.params.id,
          { isDeleted: false, updatedAt: new Date() },
          { new: true }
        );

        if (!item) {
          return res
            .status(404)
            .json({ success: false, message: `${entityName} not found` });
        }

        // Log activity
        await ActivityLog.create({
          action: "Restore",
          entityType: entityName,
          entityId: item._id,
          entityName: item.name || item.fullName || item.courseName || "",
          details: `${entityName} was restored`,
          userId: req.user.userId,
        });

        res.json({ success: true, data: item });
      } catch (error) {
        next(error);
      }
    },
  };
};

module.exports = createCRUDController;
