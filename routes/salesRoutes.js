const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const connectEnsureLogin = require("connect-ensure-login");
const Product = require("../models/Product");
//import models

//adding a sale

router.get("/addSale/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  req.session.user = req.user;
  firstName = req.user.firstName
  secondName = req.user.secondName 
  branch = req.user.branch
  if (req.session.user.role === "salesAgent" || req.session.user.role === "Manager") 
    try {
      const product = await Product.findOne({ _id: req.params.id });
      res.render("addSale", { product: product, firstName, secondName, branch});
    } catch (error) {
      res.status(400).send("unable to find this item in the database");
    }
  else {
    res.send("You are not allowed to access this page");
  }
});

// POST route to handle making a sale
router.post("/addSale/:id",
   connectEnsureLogin.ensureLoggedIn(),
   async (req, res) => {   
  if (
      req.session.user.role == "salesAgent" ||
      req.session.user.role == "Manager"
      ) {
  try {

    const{AmountSold}= req.body;
    const product = await Product.findOne({ _id: req.params.id });
    if(!product){
      return res.status(404).send("Produce not found")
    }
     
     if(product.amountinkilos < AmountSold){
      return res
      .status(400)
      .send(
        'Not enough Tonnage in stock, there are ${product.amountinkilos} in stock'
      );
     }

     if(product && product.amountinkilos>0){
      const saleMade = new Sale({
        productName: req.body.product,
        SoldTonnage: req.body.AmountSold,
        unitSellinPrice: req.body.unitCost,
        amountPaid: req.body.amountPaid,
        buyerName: req.body. buyerfirstname,
        sellerName: req.body.soldby,

      })
     
      
     await saleMade.save();

     //Decrease the tonnage of produce in the database by the number of 
     //Kilos sold

     product.amountinkilos -= AmountSold;
     console.log("New tonnage after sale", product.amountinkilos);

     await product.save();

     res.redirect("/seeSales");
    } else {
      return res
      .status(404)
      .json({error: "Produce not found or sold out"});
    }
  } catch(error){
    console.error("Error selling produe:", error.message);
    res.status(500).send("Internal Server Error");
  }

   }else{
    res.send("You are not allowed to access this page");
   }
  }

);

//Get all Sales

router.get("/seeSales",
  connectEnsureLogin.ensureLoggedIn(),
  async (req,res) => {
   
    try {
      let items = await Sale.find()
      .sort({$natural:-1})
      .populate(" product") //populate the "prodname" field with the corresponding Produce document/ all details of produce are extracted
      .populate("soldby")

      const maganjoSales = items.filter(
        (sale) => sale.product ?. branch === "Maganjo"
      );

      console.log("items in sales for maganjo", maganjoSales);
 res.render("seeSales", {
 title: "Sales list",
 sales: items,
});

} catch (err) {
  res.status(400).send("Unable to find items in the database");
  }
  }
  );
    


//route to delete sale
router.post(
  "/deleteSale",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      await Sale.deleteOne({ _id: req.body.id });
      res.redirect("back");
    } catch (error) {
      res.status(400).send("unable to delete this item in the database");
    }
  }
);

//getting data from the db

router.get("/seeSales", async (req, res) => {
  try {
    let ourSales = await Sale.find().sort({ $natural: -1 });
    res.render("salesTable", {
      sales: ourSales,
    });
  } catch (error) {
    res.status(400).send("unable to find items in the database");
  }
});

// router.get("/getProducts", (req, res) => {
//   res.send("This is the List of products");
// });

// router.get("/seeProducts", (req, res) => {
//   res.render("ProductTable");
// });

router.get("/seeSales", (req, res) => {
  res.render("salesTable");
});

//route to update sale
router.get("/updateSale/:id", async (req, res) => {
  try {
    const updateSale = await Sale.findOne({ _id: req.params.id });
    res.render("updatesale", { sale: updateSale });
  } catch (error) {
    res.status(400).send("unable to find this item in the database");
  }
});

router.post("/updateSale", async (req, res) => {
  try {
    await Sale.findOneAndUpdate({ _id: req.query.id }, req.body);
    res.redirect("/seeSales");
  } catch (error) {}
});

//route to delete sale
router.post(
  "/deleteSale",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      await Sale.deleteOne({ _id: req.body.id });
      res.redirect("back");
    } catch (error) {
      res.status(400).send("unable to delete this item in the database");
    }
  }
);

module.exports = router;
