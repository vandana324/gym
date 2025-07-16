const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.models.Business || mongoose.model("Business", businessSchema);