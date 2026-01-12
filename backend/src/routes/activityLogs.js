const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', activityLogController.getActivityLogs);
router.get('/:id', activityLogController.getActivityLogById);

module.exports = router;
