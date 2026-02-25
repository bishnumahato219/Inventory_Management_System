const Car = require("../models/car.js");
const StockLog = require("../models/stockLog.js");

// STOCK IN
exports.stockIn = async (req, res) => {
  try {
    const { carId, quantity, reason } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    car.stock += quantity;
    car.status = "available";
    await car.save();

    await StockLog.create({
      itemType: "car",
      itemId: carId,
      action: "IN",
      quantity,
      reason,
      performedBy: req.user.id
    });

    res.json({ message: "Stock added successfully", car });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// STOCK OUT
exports.stockOut = async (req, res) => {
  try {
    const { carId, quantity, reason } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (car.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    car.stock -= quantity;
    if (car.stock === 0) {
      car.status = "out_of_stock";
    }
    await car.save();

    await StockLog.create({
      itemType: "car",
      itemId: carId,
      action: "OUT",
      quantity,
      reason,
      performedBy: req.user.id
    });

    res.json({ message: "Stock reduced successfully", car });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// STOCK HISTORY
exports.stockHistory = async (req, res) => {
  try {
    const logs = await StockLog.find()
      .populate("performedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
