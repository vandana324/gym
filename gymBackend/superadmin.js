require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // adjust path if needed

async function createSuperadmin() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is missing");
    return;
  }

  await mongoose.connect(mongoUri);

  const hashedPassword = await bcrypt.hash("superadmin123", 10);

  const user = new User({
    name: "Ritesh Kumar",
    email: "superadmin@gymcrm.com",
    password: hashedPassword,
    role: "superadmin",
    gender: "male",
    dob: new Date("1990-01-01"),
    phone: "+919999999999"
  });

  await user.save();
  console.log("✅ Superadmin created successfully");
  mongoose.disconnect();
}

createSuperadmin();
