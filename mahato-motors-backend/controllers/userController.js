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

// CUSTOMER REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "customer" // default role
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE USER (Admin / Manager)
 */
exports.deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;

    const userToDelete = await User.findById(userIdToDelete);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting Admin
    if (userToDelete.role === "admin") {
      return res.status(403).json({ message: "Admin cannot be deleted." });
    }

    // Prevent self deletion
    if (req.user.id === userIdToDelete) {
      return res.status(403).json({ message: "You cannot delete yourself." });
    }

    // Manager can only delete employees
    if (req.user.role === "manager" && userToDelete.role !== "employee") {
      return res.status(403).json({ message: "Managers can only delete employees." });
    }

    await User.findByIdAndDelete(userIdToDelete);

    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};