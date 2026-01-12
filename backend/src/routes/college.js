const express = require("express");
const router = express.Router();
const collegeController = require("../controllers/collegeController");
const { authMiddleware } = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", collegeController.getColleges);
router.post("/", collegeController.createCollege);

router.get("/:id", collegeController.getCollegeById);
router.put("/:id", collegeController.updateCollege);
router.delete("/:id", collegeController.deleteCollege);

module.exports = router;
