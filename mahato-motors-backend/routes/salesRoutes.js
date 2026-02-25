// routes/saleRoutes.js
const express = require("express");
const router = express.Router();
const { createSale, getSales } = require("../controllers/salesController");
const { protect } = require("../Helper/authMiddleware");
const { allowRoles } = require("../Helper/roleMiddleware");

// Employees and Managers can create sales
router.post("/", protect, allowRoles("employee", "manager"), createSale);

// Only Managers and Admins can view the full history
router.get("/history", protect, allowRoles("manager", "admin"), getSales);

module.exports = router;