const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const SignUp = require("../models/SignUp"); // user model

router.get("/directorDash", async (req, res) => {
  try {
    const usersCount = await SignUp.countDocuments(); // FIXED

    const revenueData = await Sale.aggregate([
      {
        $project: {
          amountPaid: 1,
          AmountSold: 1,
          unitprice: 1,
          totalCost: { $multiply: ["$AmountSold", "$unitprice"] },
          profit: { $subtract: ["$amountPaid", { $multiply: ["$AmountSold", "$unitprice"] }] }
        }
      },
      {
        $group: {
          _id: null,
          totalQuantitySold: { $sum: "$AmountSold" },
          totalRevenue: { $sum: "$amountPaid" },
          totalProfit: { $sum: "$profit" }
        }
      }
    ]);

    const data = revenueData[0] ?? { totalQuantitySold: 0, totalRevenue: 0, totalProfit: 0 };

    res.render("directorDashboard", {
      usersCount,
      totalQuantitySold: data.totalQuantitySold,
      totalRevenue: data.totalRevenue,
      totalProfit: data.totalProfit
    });

  } catch (error) {
    console.error("Aggregation error:", error.message);
    res.status(500).send("Error fetching dashboard data");
  }
});

module.exports = router;
