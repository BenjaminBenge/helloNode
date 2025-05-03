const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  buyername: {
    type: String,
    trim: true,
  },
  sex: {
    type: String,
    trim: true,
  },
  NIN: {
    type: String,
  },

  telePhoneNumber: {
    type: String,
  },

  dueDate: {
    type: Date,
  },

  produceBoughtOnCredit: {
    type: Number,
  },
  quantityBought: {
    type: String,
  },
   
  unitCost: {
    type: String,
  },

  amountDue: {
    type: String,
  },

  address: {
    type: String,
  },

  city: {
    type: String,
  },

  salesAgentName: {
    type: String,
  },

  branch: {
    type: String,
  },
});

module.exports = mongoose.model("Credit", creditSchema);
