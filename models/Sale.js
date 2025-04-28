const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    buyerfirstname: {
    type: String,
    trim: true,
  },
  buyerlastname: {
    type: String,
    trim: true,
    
  },
  product:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  soldby:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Signup"
  },

  
  unitCost: {
    type: Number,
    trim: true,    
  },
  
  AmountSold: {
    type: Number,
    trim: true,    
  },
  amountPaid:{
    type: Number,
    trim: true,
  },
  branch: {
     type: mongoose.Schema.Types.ObjectId,
    ref: "Product"

  },
});


module.exports = mongoose.model("Sale", productSchema);
