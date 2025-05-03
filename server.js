//1)Dependencies

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUnitialised: false,
});

require("dotenv").config();

//import user's model
const Signup = require("./models/SignUp");
 
//2)instantiations

const app = express();
const PORT = 3001;

//import routes
const creditCustomerRoutes = require("./routes/creditCustomerRoutes");
const productRoutes = require("./routes/productRoutes");
const salesRoutes = require("./routes/salesRoutes");
const authRoutes = require("./routes/authRoutes");
const managerRoutes = require("./routes/managerRoutes")
const directorRoutes = require("./routes/directorRoutes")
const salesAgentRoutes = require("./routes/salesAgentRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const { console } = require("inspector");


//3)configurations

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection open");
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

app.set("view engine", "pug"); //specify the engine name
app.set("views", path.join(__dirname, "views")); //specify the views directory

//4)middleware

//specifies folder for static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/public/img/uploads", express.static(__dirname + "/public/img/uploads"));
app.use(express.urlencoded({ extended: true })); //helps to parse data from forms
// express session configs
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

// // passport configs
passport.use(Signup.createStrategy());
passport.serializeUser(Signup.serializeUser());
passport.deserializeUser(Signup.deserializeUser());

//5) Routes
//using imported routes
app.use("/", productRoutes);
app.use("/", salesRoutes);
app.use("/", authRoutes);
app.use("/", managerRoutes);
app.use("/", directorRoutes);
app.use("/", salesAgentRoutes);
app.use("/", creditCustomerRoutes);
app.use("/", supplierRoutes);




// 6) Bootstrapping server

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
