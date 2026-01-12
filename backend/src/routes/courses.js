const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authMiddleware } = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", courseController.getCourses);
router.get("/all", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", courseController.createCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);
router.put("/:id/restore", courseController.restoreCourse);

module.exports = router;
