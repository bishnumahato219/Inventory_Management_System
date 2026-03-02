const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { protect } = require("../Helper/authMiddleware");
const { allowRoles } = require("../Helper/roleMiddleware");

// This matches the frontend call: API.get("/dashboard/stats")
router.get(
  "/stats", 
  protect, 
  allowRoles("admin", "manager"), 
  getDashboardStats
);

module.exports = router;