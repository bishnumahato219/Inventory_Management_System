const Car = require("../models/car.js");
const StockLog = require("../models/stockLog.js");

// Unified Logic
const processStock = async (req, res, direction) => {
  try {
    const { carId, quantity, reason } = req.body;
    const car = await Car.findById(carId);
    
    if (!car) return res.status(404).json({ message: "Asset Not Found" });

    const qty = Number(quantity);
    
    if (direction === "OUT") {
      if (car.stock < qty) return res.status(400).json({ message: "Insufficient Inventory" });
      car.stock -= qty;
    } else {
      car.stock += qty;
    }

    car.status = car.stock > 0 ? "available" : "out_of_stock";
    await car.save();

    // MATCHING THE SCHEMA: Use itemType and itemId
    await StockLog.create({
      itemType: "car", 
      itemId: carId, 
      action: direction,
      quantity: qty,
      reason: reason || "Manual Adjustment",
      performedBy: req.user.id 
    });

    res.json({ success: true, message: `Stock ${direction} Successful` });
  } catch (error) {
    res.status(500).json({ message: "Protocol Error: Transaction Failed", error: error.message });
  }
};

// Explicit exports to ensure the router finds the functions
exports.stockIn = async (req, res) => await processStock(req, res, "IN");
exports.stockOut = async (req, res) => await processStock(req, res, "OUT");

exports.stockHistory = async (req, res) => {
  try {
    const logs = await StockLog.find()
      .populate("performedBy", "name role") //
      .populate("itemId", "modelName")    // FIXED: Must match schema field 'itemId'
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};