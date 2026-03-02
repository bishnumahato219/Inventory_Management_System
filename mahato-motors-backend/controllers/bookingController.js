const Booking = require("../models/booking.js");
const Car = require("../models/car.js");
const StockLog = require("../models/stockLog.js");

/* =========================================
   CREATE BOOKING
========================================= */
exports.createBooking = async (req, res) => {
  try {
    const { car, advanceAmount } = req.body;

    const selectedCar = await Car.findById(car);

    if (!selectedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (selectedCar.stock <= 0) {
      return res.status(400).json({ message: "Car not available" });
    }

    const booking = await Booking.create({
      customer: req.user.id,
      car,
      advanceAmount,
      status: "pending",
    });

    res.status(201).json(booking);

  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};


/* =========================================
   CANCEL BOOKING
========================================= */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "delivered") {
      return res.status(400).json({ message: "Delivered booking cannot be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });

  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};


/* =========================================
   GET BOOKINGS
========================================= */
exports.getBookings = async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "customer") {
      bookings = await Booking.find({ customer: req.user.id })
        .populate("car")
        .populate("customer", "name phone");
    } else {
      bookings = await Booking.find()
        .populate("car")
        .populate("customer", "name phone");
    }

    res.json(bookings);

  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({ error: error.message });
  }
};


/* =========================================
   UPDATE BOOKING STATUS
========================================= */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Prevent duplicate delivery
    if (booking.status === "delivered") {
      return res.status(400).json({ message: "Booking already delivered" });
    }

    booking.status = status;

    /* ===== IF DELIVERED → GENERATE INVOICE + REDUCE STOCK ===== */
    if (status === "delivered") {

      booking.invoiceNumber = `INV-${Date.now()}`;
      booking.deliveryDate = new Date();

      const car = await Car.findById(booking.car);

      if (!car) {
        return res.status(400).json({ message: "Associated car not found" });
      }

      if (car.stock <= 0) {
        return res.status(400).json({ message: "Car already out of stock" });
      }

      car.stock -= 1;

      if (car.stock === 0) {
        car.status = "out_of_stock";
      }

      await car.save();

      await StockLog.create({
        itemType: "car",
        itemId: car._id,
        action: "OUT",
        quantity: 1,
        reason: "Car delivered to customer",
        performedBy: req.user.id,
      });
    }

    await booking.save();

    res.json({
      message: "Booking updated successfully",
      booking,
    });

  } catch (error) {
    console.error("Update Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};

//pending booking
exports.getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "pending" })
      .populate("car")
      .populate("customer")
      .select("-__v");

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get invoice
exports.getInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car")
      .populate("customer");

    if (!booking || booking.status !== "delivered") {
      return res.status(404).json({ message: "Invoice not available" });
    }

    // Customer can only see their own invoice
    if (
      req.user.role === "customer" &&
      booking.customer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================
   GET DASHBOARD ANALYTICS (Revenue & Sales)
========================================= */
exports.getAnalytics = async (req, res) => {
  try {
    // 1. Basic Stats (Revenue & Units)
    const summary = await Booking.aggregate([
      { $match: { status: "delivered" } },
      { $lookup: { from: "cars", localField: "car", foreignField: "_id", as: "carDetails" } },
      { $unwind: "$carDetails" },
      { $group: { _id: null, revenue: { $sum: "$carDetails.onRoadPrice" }, sold: { $sum: 1 } } }
    ]);

    // 2. Bar Chart Data: Revenue by Model Name
    const revenueByModel = await Booking.aggregate([
      { $match: { status: "delivered" } },
      { $lookup: { from: "cars", localField: "car", foreignField: "_id", as: "carDetails" } },
      { $unwind: "$carDetails" },
      { $group: { _id: "$carDetails.modelName", revenue: { $sum: "$carDetails.onRoadPrice" } } },
      { $project: { name: "$_id", value: "$revenue", _id: 0 } }
    ]);

    // 3. Pie Chart Data: Sales by Fuel Type
    const salesByFuel = await Booking.aggregate([
      { $match: { status: "delivered" } },
      { $lookup: { from: "cars", localField: "car", foreignField: "_id", as: "carDetails" } },
      { $unwind: "$carDetails" },
      { $group: { _id: "$carDetails.fuelType", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    res.json({
      revenue: summary[0]?.revenue || 0,
      soldCount: summary[0]?.sold || 0,
      activeModels: await Car.countDocuments({ stock: { $gt: 0 } }),
      revenueByModel,
      salesByFuel
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};