const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const { authMiddleware } = require("../middleware/auth");
router.use(authMiddleware);

router.get("/", facultyController.getFaculty);
router.get("/all", facultyController.getAllFaculty);
router.get("/:id", facultyController.getFacultyById);
router.post("/", facultyController.createFaculty);
router.put("/:id", facultyController.updateFaculty);
router.delete("/:id", facultyController.deleteFaculty);
router.put("/:id/restore", facultyController.restoreFaculty);

module.exports = router;
