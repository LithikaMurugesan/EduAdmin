const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, requireSuperadmin } = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", userController.getUsers);

router.get("/:id", userController.getUserById);

router.put("/:id/role", requireSuperadmin, userController.updateUserRole);

router.put("/:id", userController.updateUser);

module.exports = router;
