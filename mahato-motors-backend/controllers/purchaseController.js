const Purchase = require("../models/purchase");
const Car = require("../models/car");
const StockLog = require("../models/stockLog");

// =============================
// CREATE PURCHASE ORDER
// =============================
exports.createPurchase = async (req, res) => {
  try {
    const { supplier, car, quantity } = req.body;

    const purchase = await Purchase.create({
      supplier,
      car,
      quantity,
      status: "pending"
    });

    res.status(201).json(purchase);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL PURCHASES
exports.getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "name")
      .populate("car", "modelName variant")
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =============================
// RECEIVE GOODS (STOCK IN)
// =============================
exports.receivePurchase = async (req, res) => {
  try {
    const { invoiceNumber } = req.body;

    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    if (purchase.status === "received") {
      return res.status(400).json({ message: "Already received" });
    }

    const car = await Car.findById(purchase.car);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Update stock
    car.stock += purchase.quantity;

    if (car.stock > 0) {
      car.status = "available";
    }

    await car.save();

    // Update purchase
    purchase.status = "received";
    purchase.invoiceNumber = invoiceNumber;
    purchase.receivedDate = new Date();

    await purchase.save();

    // Create stock log
    await StockLog.create({
      itemType: "car",
      itemId: car._id,
      action: "IN",
      quantity: purchase.quantity,
      reason: "Purchase received",
      performedBy: req.user._id
    });

    res.json({
      message: "Purchase received & stock updated",
      purchase
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};