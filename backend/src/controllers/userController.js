const User = require("../models/User");

// Get all users (for admin management)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 });

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Update user role (superadmin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!["admin", "superadmin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be admin or superadmin",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateUser = async (req, res, next) => {
  try {
    const { password, role, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
