const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const moment = require("moment");

// Models
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const Signup = require("../models/Signup");

// GET route to render the add sale form
router.get("/addSale/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    const userDoc = await Signup.findById(user._id);
    const userBranch = userDoc?.branch || "Unknown";
    const role = userDoc?.role;
    const firstName = userDoc.firstName;
    const secondName = userDoc.secondName;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

    // Only allow sale from user's own branch unless Manager
    if (role !== "Manager" && product.branch !== userBranch) {
      return res.status(403).send("You are not allowed to sell this product.");
    }

    res.render("addSale", {
      product,
      firstName,
      secondName,
      branch: userBranch,
      role,
      error: null
    });
  } catch (err) {
    console.error("Error in GET /addSale/:id:", err.message);
    res.status(500).send("Error retrieving product");
  }
});

// POST route to create a sale
router.post("/addSale", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    const userDoc = await Signup.findById(user._id);
    const role = userDoc?.role;
    const userBranch = userDoc?.branch;
    const firstName = userDoc?.firstName;
    const secondName = userDoc?.secondName;

    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    // Only allow sale if branch matches, unless Manager
    if (role !== "Manager" && product.branch !== userBranch) {
      return res.status(403).send("You are not allowed to sell this product.");
    }

    // Stock check
    if (product.tonnage < quantity) {
      return res.render("addSale", {
        product,
        firstName,
        secondName,
        branch: userBranch,
        role,
        error: `Only ${product.tonnage} tons in stock. You cannot sell ${quantity} tons.`
      });
    }

    // Create sale
    const sale = new Sale({
      customerName: req.body.customerName,
      quantity,
      price: req.body.price,
      product: product._id,
      seller: `${firstName} ${secondName}`,
      branch: product.branch
    });

    // Update product stock
    product.tonnage -= quantity;

    await sale.save();
    await product.save();

    res.redirect("/seeSales");
  } catch (err) {
    console.error("Error in POST /addSale:", err.message);
    res.status(500).send("Failed to record sale");
  }
});

// GET route to list sales 
router.get("/seeSales", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const user = req.user;
    let sales;

    if (user.role === "Manager") {
      sales = await Sale.find().populate("productname").sort({ _id: -1 });
    } else {
      sales = await Sale.find({ branch: user.branch })
        .populate("productname")
        .sort({ _id: -1 });
    }

    const matuggaSales = sales.filter(s => s.branch === "Matugga");
    const maganjoSales = sales.filter(s => s.branch === "Maganjo");


    res.render("salesTable", {
      sales,
      matuggaSales: matuggaSales,
      maganjoSales: maganjoSales,
      moment,
    });
  } catch (error) {
    console.error("Error in GET /seeSales:", error.message);
    res.status(500).send("Unable to find sales in the database");
  }
});

module.exports = router;
