const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("bishnu123", 10);

  const admin = await User.create({
    name: "Bishnu Mahato",
    email: "      ",
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin created:", admin.email);
  process.exit();
}

createAdmin();
