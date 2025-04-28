const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const signUpSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  secondName: {
    type: String,
    trim: true,
  },
  phone: {
    type: Number,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },

  dateOfBirth:{
    type: Date,
  },

  ninNumber:{
    type: String,
  },

  phone:{
    type: Number
  },
 
  maritalStatus:{
    type: String,
  },
  
  role: {
    type: String,
  },

  branch: {
    type: String,
  },
});

signUpSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});
module.exports = mongoose.model("Signup", signUpSchema);
