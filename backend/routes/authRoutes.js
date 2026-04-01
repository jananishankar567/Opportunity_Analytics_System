const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const auth=require ("../middleware/auth");
// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Validate role
    const validRoles = ["Student", "Sales Head", "Investor", "Project Manager"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // Generate token with role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // res.status(201).json({ 
    //   message: "User registered successfully",
    //   token,
    //   role: user.role 
    // });
    res.status(201).json({ 
  message: "User registered successfully",
  token,
  role: user.role,
  user: {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  }
});
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token with role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ 
      token, 
      role: user.role,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", auth, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName },
      { new: true }
    );

    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const authMiddleware = require("../middleware/authMiddleware"); // ✅ REQUIRED

// const router = express.Router();


// // ================= REGISTER =================
// router.post("/register", async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, role } = req.body;

//     const validRoles = ["Student", "Sales Head", "Investor", "Project Manager"];
//     if (!validRoles.includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "24h" }
//     );

//     res.status(201).json({
//       message: "User registered successfully",
//       token,
//       role: user.role,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });


// // ================= LOGIN =================
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "24h" }
//     );

//     res.json({
//       token,
//       role: user.role,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });


// // ================= GET PROFILE =================
// router.get("/profile", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");

//     res.json(user);
//   } catch (err) {
//     console.error("Get profile error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });


// // ================= UPDATE PROFILE =================
// router.put("/profile", authMiddleware, async (req, res) => {
//   try {
//     const { firstName, lastName } = req.body;

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { firstName, lastName },
//       { new: true }
//     ).select("-password");

//     res.json({
//       message: "Profile updated successfully",
//       user,
//       role: user.role,
//     });
//   } catch (err) {
//     console.error("Update profile error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;