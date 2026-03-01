const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "bishnumahato@gmail.com" });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("bishnu123", 10);

  const admin = await User.create({
    name: "Bishnu Mahato",
    email: "bishnumahato@gmail.com",
    password: hashedPassword,
    phone: 9113484126,
    role: "admin"
  });

  console.log("Admin created:", admin.email);
  process.exit();
}

createAdmin();