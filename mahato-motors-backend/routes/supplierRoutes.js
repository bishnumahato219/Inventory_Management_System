const express = require("express");
const router = express.Router();

const {protect} = require("../Helper/authMiddleware");
const {allowRoles} = require("../Helper/roleMiddleware");

const {
  addSupplier,
  getSuppliers
} = require("../controllers/supplierController");

router.post("/", protect, allowRoles("manager"), addSupplier);
router.get("/", protect, allowRoles("manager"), getSuppliers);

module.exports = router;
