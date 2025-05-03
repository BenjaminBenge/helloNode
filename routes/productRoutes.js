const express = require("express");
const router = express.Router();
const multer = require("multer"); 
const connectEnsureLogin = require("connect-ensure-login");
//import models

const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
// const Sale = require("../models/Sale");




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



//Route to update Product

router.get("/updateProduct/:id", async (req, res) => {
  try {
    const updateProduct = await Product.findOne({ _id: req.params.id });
    res.render("updateProduct", { product: updateProduct });
   
  } catch (error) {
    res.status(400).send("unable to find this item in the database");
  }
});

// router.post("/updateProduct", async (req, res) => {
//   try {
//     await Product.findOneAndUpdate({ _id: req.query.id }, req.body);
//     console.log("Updating product with ID:", req.query.id);
//     console.log("Data received:", req.body);
//     // console.log(updateProduct);
//     // await updateProduct.save();
//     res.redirect("/seeProducts");
//   } catch (error) {
//     res.status(400).send("Unable to update the product");
//   }
// });

router.post("/updateProduct", upload.single("image"), async (req, res) => {
  try {
    const updateData = req.body;

    // Format the date to "May 03 2025"
const formattedDate = new Date(updateProduct.dateOfPurchase).toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

updateProduct.formattedDate = formattedDate;


    // Attach image path if a new file was uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    console.log("Updating product with ID:", req.query.id);
    console.log("Data received:", updateData);

    await Product.findOneAndUpdate({ _id: req.query.id }, updateData);
    res.redirect("/seeProducts");
  } catch (error) {
    console.error(error);
    res.status(400).send("Unable to update the product");
  }
});


router.post(
  "/deleteProduct",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      await Product.deleteOne({ _id: req.body.id });
      res.redirect("back");
    } catch (error) {
      res.status(400).send("unable to delete this item in the database");
    }
  }
);


module.exports = router;
