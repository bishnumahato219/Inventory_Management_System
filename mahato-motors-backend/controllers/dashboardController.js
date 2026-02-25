const Car = require("../models/car");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const outOfStock = await Car.countDocuments({ stock: { $lte: 0 } });
    
    // Total Inventory Value calculation
    const inventoryValue = await Car.aggregate([
      { 
        $group: { 
          _id: null, 
          total: { $sum: { $multiply: ["$exShowroomPrice", "$stock"] } } 
        } 
      }
    ]);

    const recentCars = await Car.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalCars,
      outOfStock,
      totalValue: inventoryValue[0]?.total || 0,
      recentCars
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};