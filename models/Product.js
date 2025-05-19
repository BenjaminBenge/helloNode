const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image: {
    type: String,
    trim: true
  },
  productname: {
    type: String,
    trim: true
  },
  supplier: {
    type: String  // want this to be a foreign key
  },
  typeOfProduct: {
    type: String
  },
  dateOfPurchase: {
    type: Date
  },
  tonnage: {
    type: Number
  },
  C: {
    type: Number,
    required: true,
    default: 0
  },
  unitprice: {
    type: Number
  },
  amountSpent: {
    type: Number
  },
  branch: {
    type: String
  }
}, {
  timestamps: true //  adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model("Product", productSchema);
