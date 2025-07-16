const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Business = require("../models/business");
const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

// Create user (superadmin can create gymadmin, gymadmin can create trainer/member)
router.post("/", authenticate, requireRole(["superadmin", "gymadmin"]), async (req, res) => {
  try {
    const { name, email, password, role, phone, dob, gender } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let businessId = null;

    // Step 1: If gymadmin, create a new business automatically
    if (role === "gymadmin") {
      const business = await Business.create({
        name: `${name}'s Gym`,
        phone,
        address: "To be updated",
      });
      businessId = business._id;
    }

    // Step 2: If trainer/member, gymadmin must pass their businessId
    if ((role === "trainer" || role === "member") && req.user.role === "gymadmin") {
      businessId = req.user.businessId;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      dob,
      gender,
      businessId,
    });

    // Step 3: Link admin to business
    if (role === "gymadmin") {
      await Business.findByIdAndUpdate(businessId, { admin: user._id });
    }

    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error("❌ Error in /api/users POST:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

module.exports = router;
