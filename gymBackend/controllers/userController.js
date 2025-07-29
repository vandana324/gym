
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

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: Gymadmin can only update trainer/member
    if (req.user.role === "gymadmin" && !["trainer", "member"].includes(user.role)) {
      return res.status(403).json({ message: "Gymadmin can only update trainer/member" });
    }

    Object.assign(user, updates); // merge changes
    await user.save();

    res.status(200).json({ message: "User updated", user });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Prevent gymadmin from deleting other gymadmin or superadmin
    if (req.user.role === "gymadmin" && userToDelete.role !== "trainer" && userToDelete.role !== "member") {
      return res.status(403).json({ message: "Gymadmin can only delete trainer or member" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};


// DELETE USER
// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



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
