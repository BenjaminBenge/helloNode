const express = require("express");
const router = express.Router();
const multer = require("multer"); 
//import models

const Product = require("../models/Product");




//adding images using multer  

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
  cb(null, "public/img/uploads");
  },
  filename: (req, file, cb) => {
  cb(null, file.originalname);
  },
  });
  var upload = multer({ storage: storage });

  router.get("/addProduct", (req, res) => {
    res.render("addProduct");
  });

//sending Data to the DB
router.post("/addProduct", upload.single("image"), async (req, res) => {
  try {
    const product = new Product(req.body);
    product.image = req.file.path;
    console.log(product);
    await product.save();

    res.redirect("/addProduct");
  } catch (error) {
    res.status(400).render("addProduct");
    console.log(error);
  }
});


//getting from DB to list

router.get("/seeProducts", async (req, res) => {
  try {
    let ourProducts = await Product.find().sort({$natural:-1});
    res.render("productTable", {
      products: ourProducts,
    });
  } catch (error) {
    res.status(400).send("unable to find items in the database");
  }
});

router.get("/seeProducts", (req, res) => {
  res.render("ProductTable");
});

module.exports = router;
