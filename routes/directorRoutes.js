const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");

router.get("/directorDash", async (req, res) => {

  try {
    let totalRevenue = await Sale.aggregate([
    
     {$group:{_id:null,
         totalquantitysold:{$sum:"$AmountSold"},
         totalsale:{$sum:"$amountPaid"},
         profit
     }}
    ])
    totalRevenue=totalRevenue[0] ?? {totalquantitysold:0,totalsale:0};
    res.render("directorDashboard",{
     totalRevenue
    });
 } catch (error) {
 res.status(400).send("Unable to find item from the db")
 console.error("aggregation error:",error.message)
 }

});

  module.exports = router;