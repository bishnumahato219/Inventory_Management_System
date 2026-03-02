const express = require("express");
const router = express.Router();

const {protect} = require("../Helper/authMiddleware");
const {allowRoles} = require("../Helper/roleMiddleware");

const {
  createBooking,
  getBookings,
  updateBookingStatus,
  cancelBooking,
  getPendingBookings,
  getInvoice,
  getAnalytics
} = require("../controllers/bookingController");

router.get("/analytics", protect, allowRoles("admin"),getAnalytics);

// Customer
router.post("/", protect, allowRoles("customer"), createBooking);

// All roles
router.get("/", protect, getBookings);

// Get pending bookings 
router.get("/pending", protect, allowRoles("employee", "manager"), getPendingBookings);

// Get Invoice (Delivered Booking Only)
router.get(
  "/:id/invoice",
  protect,
  getInvoice
);

// Customer, Employee, Manager cancel booking
router.delete("/:id", protect, allowRoles("customer", "employee", "manager"), cancelBooking);

// Employee / Manager
router.put("/:id/status", protect, allowRoles("employee", "manager"), updateBookingStatus);



module.exports = router;
