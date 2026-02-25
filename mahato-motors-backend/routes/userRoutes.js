const express = require("express");
const router = express.Router();

const {protect} = require("../Helper/authMiddleware");
const { allowRoles } = require("../Helper/roleMiddleware");

const {
  createManager,
  createEmployee,
  getAllUsers
} = require("../controllers/userController");

// ADMIN → MANAGER
router.post(
  "/create-manager",
  protect,
  allowRoles("admin"),
  createManager
);

// ADMIN + MANAGER → EMPLOYEE
router.post(
  "/create-employee",
  protect,
  allowRoles("admin", "manager"),
  createEmployee
);

//get all users (admin + manager)
router.get(
  "/", 
  protect, 
  allowRoles("admin", "manager"), 
  getAllUsers
);

module.exports = router;