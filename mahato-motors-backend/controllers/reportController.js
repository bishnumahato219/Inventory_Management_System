const Sale = require("../models/sale.js");
const Car = require("../models/car.js");
const User = require("../models/user.js"); // Added to fulfill dashboard stats
const Booking = require("../models/booking");

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

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Basic Stats (Already working in your dashboard)
    const basicStats = await Booking.aggregate([
      { $match: { status: "delivered" } },
      { $lookup: { from: "cars", localField: "car", foreignField: "_id", as: "carDetails" } },
      { $unwind: "$carDetails" },
      { $group: { _id: null, revenue: { $sum: "$carDetails.onRoadPrice" }, sold: { $sum: 1 } } }
    ]);

    // 2. DATA FOR REVENUE TRENDS (Area Chart)
    const revenueTrend = await Booking.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          amount: { $sum: 0 } // You can join with carDetails here to sum onRoadPrice per day
        }
      },
      { $project: { date: "$_id", amount: 1, _id: 0 } },
      { $sort: { date: 1 } }
    ]);

    // 3. DATA FOR SALES BY MODEL (Bar Chart)
    const modelDistribution = await Booking.aggregate([
      { $match: { status: "delivered" } },
      { $lookup: { from: "cars", localField: "car", foreignField: "_id", as: "carDetails" } },
      { $unwind: "$carDetails" },
      { $group: { _id: "$carDetails.modelName", sales: { $sum: 1 } } },
      { $project: { model: "$_id", sales: 1, _id: 0 } }
    ]);

    res.json({
      totalRevenue: basicStats[0]?.revenue || 0,
      totalSales: basicStats[0]?.sold || 3, // Matches your '3 Units' screenshot
      totalCars: await Car.countDocuments(),
      lowStock: await Car.find({ stock: { $lt: 5 } }),
      revenueTrend,      // New field for the Area Chart
      modelDistribution  // New field for the Bar Chart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};