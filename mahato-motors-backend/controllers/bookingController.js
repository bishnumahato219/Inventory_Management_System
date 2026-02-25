const Booking = require("../models/booking.js");
const Car = require("../models/car.js");
const StockLog = require("../models/stockLog.js");

exports.createBooking = async (req, res) => {
  try {
    const { car, advanceAmount } = req.body;
    const selectedCar = await Car.findById(car);
    if (!selectedCar || selectedCar.stock <= 0) {
      return res.status(400).json({ message: "Car not available" });
    }

    const booking = await Booking.create({
      customer: req.user.id, // Field name is 'customer'
      car,
      advanceAmount,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === "customer") {
      // Filtering specifically by 'customer' field
      bookings = await Booking.find({ customer: req.user.id }).populate("car");
    } else {
      bookings = await Booking.find()
        .populate("car")
        .populate("customer", "name phone");
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Added 'approved' to valid statuses
    const validStatuses = ["pending", "approved", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    booking.status = status;
    await booking.save();

    if (status === "delivered") {
      const car = await Car.findById(booking.car);
      car.stock -= 1;
      if (car.stock === 0) car.status = "out_of_stock";
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
    res.json({ message: "Booking updated", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};