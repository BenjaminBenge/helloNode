const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  buyername: {
    type: String,
    trim: true
  },
  productname: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  amountToBuy: {
    type: Number
  },
  unitprice: {
    type: Number
  },
  totalPaid: {
    type: Number
  },
  amountPaid: {
    type: Number
  },
  AmountSold: {
    type: Number
  },
  branch: {
    type: String
  },
  soldby: {
    type: String
  }
}, {
  timestamps: true // ✅ Enables createdAt and updatedAt fields
});

module.exports = mongoose.model("Sale", saleSchema);
