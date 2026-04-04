const mongoose = require("mongoose");
const Booking = require("../models/booking.js");
const Sale = require("../models/sale.js");
const Car = require("../models/car.js");
require("dotenv").config();

async function createSales() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    // Find all delivered bookings that don't have a sale yet
    const deliveredBookings = await Booking.find({ status: "delivered" })
      .populate("customer")
      .populate("car");

    console.log(`Found ${deliveredBookings.length} delivered bookings`);

    for (const booking of deliveredBookings) {
      // Check if sale already exists
      const existingSale = await Sale.findOne({ booking: booking._id });
      if (existingSale) {
        console.log(`✅ Sale already exists for booking ${booking._id}`);
        continue;
      }

      // Create sale record
      const sale = await Sale.create({
        booking: booking._id,
        customer: booking.customer._id,
        car: booking.car._id,
        salePrice: booking.car.onRoadPrice,
        paymentMode: "Direct Transfer",
        invoiceNumber: `INV-${Date.now()}`,
        saleDate: new Date(),
      });

      console.log(`✅ Sale created: ${sale.invoiceNumber}`);
    }

    console.log("✅ Sales seed completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createSales();
