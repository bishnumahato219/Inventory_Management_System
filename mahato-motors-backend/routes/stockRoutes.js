const express = require("express");
const router = express.Router();

const {protect} = require("../Helper/authMiddleware");
const {allowRoles} = require("../Helper/roleMiddleware");

const {stockIn,stockOut,stockHistory} = require("../controllers/stockController");

// Manager / Employee
router.post("/in", protect, allowRoles("manager", "employee"), stockIn);
router.post("/out", protect, allowRoles("manager", "employee"), stockOut);

// Manager only
router.get("/history", protect, allowRoles("manager"), stockHistory);

module.exports = router;
