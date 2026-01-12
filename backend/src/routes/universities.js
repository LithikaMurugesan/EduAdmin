const express = require("express");
const router = express.Router();
const universityController = require("../controllers/universityController");
const { authMiddleware } = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", universityController.getUniversities);
router.get("/all", universityController.getAllUniversities);
router.get("/:id", universityController.getUniversityById);
router.post("/", universityController.createUniversity);
router.put("/:id", universityController.updateUniversity);
router.delete("/:id", universityController.deleteUniversity);
router.put("/:id/restore", universityController.restoreUniversity);

module.exports = router;
