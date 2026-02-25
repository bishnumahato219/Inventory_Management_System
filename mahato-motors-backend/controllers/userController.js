const User = require("../models/user.js");
const bcrypt = require("bcryptjs");

/**
 * ADMIN → CREATE MANAGER
 */
exports.createManager = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const manager = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "manager" // 🔒 fixed role
    });

    res.status(201).json({
      message: "Manager created successfully",
      user: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ADMIN / MANAGER → CREATE EMPLOYEE
 */
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "employee" // 🔒 fixed role
    });

    res.status(201).json({
      message: "Employee created successfully",
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/**
 * GET ALL USERS (For Dashboard)
 */
exports.getAllUsers = async (req, res) => {
  try {
    // We find all users but EXCLUDE the password for security
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};