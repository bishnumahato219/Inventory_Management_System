const Sale = require("../models/sale.js");
const Car = require("../models/car.js");
const User = require("../models/user.js"); // Added to fulfill dashboard stats

// DASHBOARD SUMMARY
exports.dashboardSummary = async (req, res) => {
  try {
    const totalSales = await Sale.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();

    const revenueResult = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$salePrice" }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Fetching low stock - matched to your frontend error "low stock"
    const lowStockCars = await Car.find({ stock: { $lte: 2 } })
      .select("modelName variant stock");

    // Monthly data for the Chart
    const monthlyRevenue = await Sale.aggregate([
      {
        $group: {
          _id: { $month: "$saleDate" },
          revenue: { $sum: "$salePrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      success: true,
      totalSales,
      totalRevenue,
      totalUsers,
      totalCars,
      lowStock: lowStockCars, // Renamed from lowStockCars to lowStock
      revenue: monthlyRevenue // Providing the array the chart needs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// MONTHLY SALES REPORT
exports.monthlySalesReport = async (req, res) => {
  try {
    const report = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$saleDate" },
            month: { $month: "$saleDate" }
          },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$salePrice" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// BEST SELLING CARS
exports.bestSellingCars = async (req, res) => {
  try {
    const report = await Sale.aggregate([
      { $group: { _id: "$car", soldCount: { $sum: 1 } } },
      { $sort: { soldCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "cars", // Join with Car collection to get names
          localField: "_id",
          foreignField: "_id",
          as: "carDetails"
        }
      },
      { $unwind: "$carDetails" }
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};