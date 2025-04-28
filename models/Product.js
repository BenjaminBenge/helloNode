const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  image:{
    type: String,
    trim: true
  },
  productname: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    
  },
  
  producttype: {
    type: String,
  },

  amountinkilos: {
    type: String,
  },
  unitprice:{
   type: Number
  },

  amount:{
    type: Number,
  },

  amountSpent:{
  type: Number,
  },

  branch: {
    type: String,

  },

});


module.exports = mongoose.model("Product", productSchema);
