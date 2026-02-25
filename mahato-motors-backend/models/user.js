const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: Number,
      required: true,
      length: 10
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["customer", "employee", "manager","admin"],
      default: "customer"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
