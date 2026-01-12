const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const { authMiddleware } = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", enrollmentController.getEnrollments);
router.get("/all", enrollmentController.getAllEnrollments);
router.get("/:id", enrollmentController.getEnrollmentById);
router.post("/", enrollmentController.createEnrollment);
router.put("/:id", enrollmentController.updateEnrollment);
router.delete("/:id", enrollmentController.deleteEnrollment);
router.put("/:id/restore", enrollmentController.restoreEnrollment);

module.exports = router;
