const mongoose = require('mongoose'); // 👈✅ required at top!

const checkinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkinTime: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // 👈 adds createdAt and updatedAt automatically

module.exports = mongoose.models.Checkin || mongoose.model('Checkin', checkinSchema); // 👈 prevents OverwriteModelError
