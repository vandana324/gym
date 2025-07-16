const User = require('../models/user');

// Get all users (for superadmin/admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('businessId', 'name');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users by business ID
exports.getUsersByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const users = await User.find({ businessId }).populate('businessId', 'name');

    res.json(users);
  } catch (error) {
    console.error('Get users by business error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.registerOrUpdateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      gender,
      dob,
      phone,
      businessId
    } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.role = role || user.role;
      user.gender = gender || user.gender;
      user.dob = dob || user.dob;
      user.phone = phone || user.phone;
      user.businessId = businessId || user.businessId;
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        password, // make sure this is hashed before saving
        role,
        gender,
        dob,
        phone,
        businessId
      });
      await user.save();
    }

    res.status(200).json({ message: "User registered/updated", role: user.role });
  } catch (error) {
    console.error("User Register Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("businessId", "businessName");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.getUsersByBusiness = async (req, res) => {
  const { businessId } = req.params;
  try {
    const users = await User.find({ businessId });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching business users" });
  }
};
