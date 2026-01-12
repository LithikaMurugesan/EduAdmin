// const User = require('../models/User');
// const RefreshToken = require('../models/RefreshToken');
// const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenManager');

// // Signup
// exports.signup = async (req, res, next) => {
//     try {
//         const { email, password, fullName } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email already registered',
//             });
//         }

//         // Create user
//         const user = await User.create({
//             email,
//             password,
//             fullName,
//             role: 'superadmin', // First user is superadmin, or set based on logic
//         });

//         // Generate tokens
//         const accessToken = generateAccessToken({
//             userId: user._id,
//             email: user.email,
//             role: user.role,
//         });

//         const refreshToken = generateRefreshToken({
//             userId: user._id,
//         });

//         // Save refresh token to database
//         const expiresAt = new Date();
//         expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

//         await RefreshToken.create({
//             userId: user._id,
//             token: refreshToken,
//             expiresAt,
//         });

//         // Set refresh token in HTTP-only cookie
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//         });

//         res.status(201).json({
//             success: true,
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 fullName: user.fullName,
//                 role: user.role,
//             },
//             accessToken,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Login
// exports.login = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         // Find user
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid credentials',
//             });
//         }

//         // Check password
//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid credentials',
//             });
//         }

//         // Generate tokens
//         const accessToken = generateAccessToken({
//             userId: user._id,
//             email: user.email,
//             role: user.role,
//         });

//         const refreshToken = generateRefreshToken({
//             userId: user._id,
//         });

//         // Save refresh token to database
//         const expiresAt = new Date();
//         expiresAt.setDate(expiresAt.getDate() + 7);

//         await RefreshToken.create({
//             userId: user._id,
//             token: refreshToken,
//             expiresAt,
//         });

//         // Set refresh token in HTTP-only cookie
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//         });

//         res.json({
//             success: true,
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 fullName: user.fullName,
//                 role: user.role,
//             },
//             accessToken,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Refresh token
// exports.refresh = async (req, res, next) => {
//     try {
//         const { refreshToken } = req.cookies;

//         if (!refreshToken) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'No refresh token provided',
//             });
//         }

//         // Verify refresh token
//         const decoded = verifyRefreshToken(refreshToken);

//         // Check if token exists in database
//         const tokenDoc = await RefreshToken.findOne({
//             token: refreshToken,
//             userId: decoded.userId,
//         });

//         if (!tokenDoc) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid refresh token',
//             });
//         }

//         // Get user
//         const user = await User.findById(decoded.userId);
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User not found',
//             });
//         }

//         // Generate new access token
//         const accessToken = generateAccessToken({
//             userId: user._id,
//             email: user.email,
//             role: user.role,
//         });

//         res.json({
//             success: true,
//             accessToken,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Logout
// exports.logout = async (req, res, next) => {
//     try {
//         const { refreshToken } = req.cookies;

//         if (refreshToken) {
//             // Delete refresh token from database
//             await RefreshToken.deleteOne({ token: refreshToken });
//         }

//         // Clear cookie
//         res.clearCookie('refreshToken');

//         res.json({
//             success: true,
//             message: 'Logged out successfully',
//         });
//     } catch (error) {
//         next(error);
//     }
// };

const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokenManager");

/* =======================
   Signup
======================= */
exports.signup = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      email,
      password,
      fullName,
      role: "superadmin",
    });

    // ✅ ADD THIS LINE
    await RefreshToken.deleteMany({ userId: user._id });

    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ userId: user._id });

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* =======================
   Login
======================= */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ ADD THIS LINE
    await RefreshToken.deleteMany({ userId: user._id });

    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ userId: user._id });

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* =======================
   Refresh
// ======================= */
// exports.refresh = async (req, res, next) => {
//     try {
//         const { refreshToken } = req.cookies;
//         if (!refreshToken) {
//             return res.status(401).json({ message: 'No refresh token' });
//         }

//         const decoded = verifyRefreshToken(refreshToken);

//         const tokenDoc = await RefreshToken.findOne({
//             token: refreshToken,
//             userId: decoded.userId,
//         });

//         if (!tokenDoc) {
//             return res.status(401).json({ message: 'Invalid refresh token' });
//         }

//         const user = await User.findById(decoded.userId);
//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }

//         const accessToken = generateAccessToken({
//             userId: user._id,
//             email: user.email,
//             role: user.role,
//         });

//         res.json({ success: true, accessToken });
//     } catch (err) {
//         next(err);
//     }
// };
exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Refresh token expired or invalid" });
    }

    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId,
    });

    if (!tokenDoc) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({ success: true, accessToken });
  } catch (err) {
    next(err); // ✅ THIS IS THE KEY FIX
  }
};

/* =======================
   Logout
======================= */
// exports.logout = async (req, res, next) => {
//     try {
//         const { refreshToken } = req.cookies;

//         if (refreshToken) {
//             await RefreshToken.deleteOne({ token: refreshToken });
//         }

//         res.clearCookie('refreshToken', {
//             httpOnly: true,
//             sameSite: 'lax',
//             secure: false,
//         });

//         res.json({ success: true });
//     } catch (err) {
//         next(err);
//     }
// };
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
