const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  buyername: {
    type: String,
    trim: true,
  },
  productname:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
 
  amountToBuy:{
    type: String,
  },
  
  unitprice:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  totalPaid:{
    type: Number
  },

 
  branch:{
    type: String
  },

  soldby:{
    type: String
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
    ref: "SignUp"

  },
});


module.exports = mongoose.model("Sale", productSchema);
