const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/deleted", studentController.getDeletedStudents);
router.patch("/:id/restore", studentController.restoreStudent);
router.get("/:id", studentController.getStudentById);
router.get("/", studentController.getStudents);
router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
