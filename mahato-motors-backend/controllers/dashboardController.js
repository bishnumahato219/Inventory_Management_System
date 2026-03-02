const Booking = require("../models/booking");
const Car = require("../models/car");

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Calculate Revenue & Sales
    const salesSummary = await Booking.aggregate([
      { $match: { status: "delivered" } },
      {
        $lookup: {
          from: "cars", // CHECK: Must match your actual MongoDB collection name
          localField: "car",
          foreignField: "_id",
          as: "carData"
        }
      },
      { $unwind: "$carData" },
      { $group: { _id: null, total: { $sum: "$carData.onRoadPrice" }, count: { $sum: 1 } } }
    ]);

    // 2. Sales by Model (Fixes the blank Bar Chart)
    const modelDistribution = await Booking.aggregate([
      { $match: { status: "delivered" } },
      {
        $lookup: {
          from: "cars", // Ensure this is lowercase
          localField: "car",
          foreignField: "_id",
          as: "carDetails"
        }
      },
      { $unwind: "$carDetails" },
      { 
        $group: { 
          _id: "$carDetails.modelName", 
          salesCount: { $sum: 1 } 
        } 
      },
      { 
        $project: { 
          model: "$_id", 
          sales: "$salesCount", 
          _id: 0 
        } 
      }
    ]);

    // 3. Revenue Trends (Monthly Performance)
    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: { $dateToString: { format: "%b %Y", date: "$updatedAt" } },
          amount: { $sum: 1 } 
        }
      },
      { $project: { month: "$_id", amount: 1, _id: 0 } },
      { $sort: { month: 1 } }
    ]);

    // 4. Inventory & Recent Items
    const totalCars = await Car.countDocuments();
    const lowStock = await Car.find({ stock: { $lt: 5 } });
    const recentCars = await Car.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalRevenue: salesSummary[0]?.total || 0,
      totalSales: salesSummary[0]?.count || 0,
      totalCars,
      recentCars,
      lowStock,
      monthlyRevenue: monthlyRevenue.length > 0 ? monthlyRevenue : [{ month: "No Data", amount: 0 }],
      modelDistribution: modelDistribution.length > 0 ? modelDistribution : [{ model: "No Sales", sales: 0 }] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};