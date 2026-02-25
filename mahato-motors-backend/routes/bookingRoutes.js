const express = require("express");
const router = express.Router();

const {protect} = require("../Helper/authMiddleware");
const {allowRoles} = require("../Helper/roleMiddleware");

const {
  createBooking,
  getBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/bookingController");

// Customer
router.post("/", protect, allowRoles("customer"), createBooking);

// All roles
router.get("/", protect, getBookings);

// Customer, Employee, Manager cancel booking
router.delete("/:id", protect, allowRoles("customer", "employee", "manager"), cancelBooking);

// Employee / Manager
router.put("/:id/status", protect, allowRoles("employee", "manager"), updateBookingStatus);

// routes
router.put("/status/:id", protect, updateBookingStatus);

module.exports = router;
