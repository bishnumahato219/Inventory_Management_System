const express = require("express");
const router = express.Router();

const { protect } = require("../Helper/authMiddleware");
const { allowRoles } = require("../Helper/roleMiddleware");

// Controller se functions import karein
const { 
  dashboardSummary, 
  monthlySalesReport, 
  bestSellingCars 
} = require("../controllers/reportController"); // Check karein filename 'reportController' hai ya 'report'

// Admin endpoints
router.get("/admin", protect, allowRoles("admin"), dashboardSummary);

// Manager endpoints
router.get("/dashboard", protect, allowRoles("manager"), dashboardSummary);
router.get("/monthly-sales", protect, allowRoles("manager"), monthlySalesReport);
router.get("/best-selling", protect, allowRoles("manager"), bestSellingCars);

module.exports = router;