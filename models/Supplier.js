const mongoose = require("mongoose");


const supplierSchema = new mongoose.Schema({
supplierName: {
    type: String,
    trim: true,
  },
  supplierLocation: {
    type: String,
    trim: true,
  },
  
  contact: {
    type: Number,
    trim: true,
    required: true,
    unique: true,
  },

  suppliedProduct:{
type: String,
  },

  branch: {
    type: String,
  },
});

// // supplierSchema.plugin(passportLocalMongoose, {
// //   usernameField: "email",
// });
module.exports = mongoose.model("Supplier", supplierSchema);
