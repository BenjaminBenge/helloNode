const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");

//import models
const Supplier = require("../models/Supplier");

//add Supplier Routes

router.get("/addSupplier", (req, res) => {
  res.render("addSupplier");
});

//adding Product to DB
router.post("/addSupplier", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    console.log("Updating supplier with ID:", req.query.id);
    console.log("Data received:", req.body);
    await supplier.save();

    res.redirect("/addSupplier");
  } catch (error) {
    res.status(400).render("addSupplier");
    console.log(error);
  }
});


//getting Data from the DB

router.get("/seeSupplier", async (req, res) => {
  try {
    let ourSupplier = await Supplier.find().sort({$natural:-1});
    res.render("supplierTable", {
      suppliers: ourSupplier,
    });
  } catch (error) {
    res.status(400).send("unable to find items in the database");
  }
});

//update a supplier

router.get("/updateSupplier/:id", async (req, res) => {
  try {
    const updatesupplier = await Supplier.findOne({ _id: req.params.id });
    res.render("updateSupplier", { supplier: updatesupplier });
    console.log(updatesupplier)
  } catch (error) {
    res.status(400).send("unable to find this supplier in the database");
  }
});

// router.post("/updateSupplier", async (req, res) => {
//   try {
//     await Sale.findOneAndUpdate({ _id: req.query.id }, req.body);
//     console.log("Updating supplier with ID:", req.query.id);
//     console.log("Data received:", req.body);
//     res.redirect("/seeSupplier");
//   } catch (error) {
//     console.error(error);
//     res.status(400).send("Unable to update the product");
//   }
// });

router.post("/updateSupplier", async (req, res) => {
    try {
      await Supplier.findOneAndUpdate({ _id: req.query.id }, req.body);
      console.log("Updating supplier with ID:", req.query.id);
      console.log("Data received:", req.body);
      res.redirect("/seeSupplier");
    } catch (error) {
      console.error("Update failed:", error);
      res.status(400).send("Unable to update the product");
    }
  });

  //Route to delete a supplier

  router.post(
    "/deleteSupplier",
    connectEnsureLogin.ensureLoggedIn(),
    async (req, res) => {
      try {
        await Supplier.deleteOne({ _id: req.body.id });
        res.redirect("back");
      } catch (error) {
        res.status(400).send("unable to delete this item in the database");
      }
    }
  );
  
module.exports = router;