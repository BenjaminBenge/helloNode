const express = require("express");
const router = express.Router();

const CreditCustomer = require("../models/Credit");

router.get("/addCreditCustomer", (req, res) => {
    res.render("creditCustomer");
  });


//sending data to the DB

router.post("/addCreditCustomer",  async (req, res) => {
  try {
    const creditCustomer = new CreditCustomer(req.body);
    console.log( creditCustomer);
    await  creditCustomer.save();

    res.redirect("/addCreditCustomer");
  } catch (error) {
    res.status(400).render("creditCustomer");
    console.log(error);
  }
});

//getting Data from the DB



router.get("/seeCredit", async (req, res) => {
  try {
    let ourCredit = await CreditCustomer.find().sort({ $natural: -1 });
    res.render("creditTable", {
      credits: ourCredit,
    });
  } catch (error) {
    res.status(400).send("unable to find this customer in the database");
  }
});



  module.exports = router;