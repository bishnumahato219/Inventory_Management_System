const express = require("express");
const router = express.Router();
const { protect } = require("../Helper/authMiddleware");
const { allowRoles } = require("../Helper/roleMiddleware");
const { stockIn, stockOut, stockHistory } = require("../controllers/stockController");

router.post("/in", protect, allowRoles("admin", "manager", "employee"), stockIn);
router.post("/out", protect, allowRoles("admin", "manager", "employee"), stockOut);
router.get("/history", protect, allowRoles("admin", "manager", "employee"), stockHistory);

module.exports = router;