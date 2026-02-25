const express = require("express");
const router = express.Router();

const {protect} = require("../Helper/authMiddleware");
const {allowRoles} = require("../Helper/roleMiddleware");

const {createPurchase,receivePurchase} = require("../controllers/purchaseController");

router.post("/", protect, allowRoles("manager"), createPurchase);
router.put("/:id/receive", protect, allowRoles("manager"), receivePurchase);

module.exports = router;
