const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  gender: { type: String },
  dob: { type: Date },
  role: {
    type: String,
    enum: ["superadmin", "gymadmin", "trainer", "member"],
    default: "member",
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: function () {
      return this.role !== "superadmin";
    },
  },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
