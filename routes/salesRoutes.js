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

    console.log("📝 Incoming sale request body:", req.body); // <--- Log form data
    console.log("🟡 req.body:", req.body);


    const userDoc = await Signup.findById(user._id);
    const role = userDoc?.role;
    const userBranch = userDoc?.branch;
    const firstName = userDoc?.firstName;
    const secondName = userDoc?.secondName;

    const { productId, amountToBuy, unitCost, totalPaid } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      console.log("❌ Product not found for ID:", productId);
      return res.status(404).send("Product not found");
    }

    // Only allow sale if branch matches, unless Manager
    if (role !== "Manager" && product.branch !== userBranch) {
      return res.status(403).send("You are not allowed to sell this product.");
    }

    // Stock check
    if (product.tonnage < amountToBuy) {
      return res.render("addSale", {
        product,
        firstName,
        secondName,
        branch: userBranch,
        role,
        error: `Only ${product.tonnage} tons in stock. You cannot sell ${amountToBuy} tons.`
      });
    }

    // Create the sale document
    const sale = new Sale({
      buyername: req.body.buyername,
      productname: product._id,
      amountToBuy: amountToBuy,
      unitprice: unitCost,
      totalPaid: totalPaid,
      amountPaid: totalPaid,
      AmountSold: amountToBuy,
      soldby: `${firstName} ${secondName}`,
      branch: product.branch
    });

    await sale.save();
    console.log("✅ Sale saved:", sale); // <--- Log after saving

    // Update product stock
    product.tonnage -= amountToBuy;

    if (product.tonnage <= 500) {
      console.log(`⚠️ ALERT: Product "${product.productname}" stock is low: ${product.tonnage} tons`);
      product.lowStockAlert = true;
    }

    await product.save();

    res.redirect("/seeSales");
  } catch (err) {
    console.error("❌ Error in POST /addSale:", err.message);
    res.status(500).send("Failed to record sale");
  }
});

// GET route to list sales // GET route to list sales 

router.get("/seeSales", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const user = req.user;
    let sales;

    if (user.role === "Manager") {
      sales = await Sale.find().populate("productname").sort({ natural: -1 });
    } else {
      sales = await Sale.find({ branch: user.branch }).populate("productname").sort({ natural: -1 });
    }

    console.log(" Sales with populated productname:");
    sales.forEach((s, i) => {
      console.log(`#${i + 1} Product:`, s.productname?.productname || "❌ NULL", " | Sale ID:", s._id);
    });

   
    

    const matuggaSales = sales.filter(s => s.branch === "Matugga");
    const maganjoSales = sales.filter(s => s.branch === "Maganjo");

    res.render("salesTable", {
      sales,
      matuggaSales,
      maganjoSales,
      moment,
    });

    console.log(" Maganjo sales:", maganjoSales.map(s => ({
      productId: s.productname?._id,
      productname: s.productname?.productname
    })));

  } catch (error) {
    console.error(" Error in GET /seeSales:", error.message);
    res.status(500).send("Unable to find sales in the database");
  }
});

// GET route to render the update sale form
router.get("/updateSale/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    const userDoc = await Signup.findById(user._id);
    if (userDoc.role !== "Manager") {
      return res.status(403).send("Only managers can update sales.");
    }

    const sale = await Sale.findById(req.params.id).populate("productname");
    if (!sale) return res.status(404).send("Sale not found");

    res.render("updateSale", {
      sale,
      product: sale.productname,
      branch: sale.branch,
      moment
    });
  } catch (err) {
    console.error(" Error in GET /editSale/:id:", err.message);
    res.status(500).send("Error retrieving sale for editing");
  }
});

// POST route to update a sale
router.post("/updateSale/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    const userDoc = await Signup.findById(user._id);
    if (userDoc.role !== "Manager") {
      return res.status(403).send("Only managers can update sales.");
    }

    const { buyername, amountToBuy, unitprice, totalPaid } = req.body;
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).send("Sale not found");

    // Revert previous stock deduction
    const product = await Product.findById(sale.productname);
    if (!product) return res.status(404).send("Associated product not found");
    product.tonnage += sale.amountToBuy;

    // Check new stock sufficiency
    if (product.tonnage < amountToBuy) {
      return res.send(`Not enough stock to update sale. Only ${product.tonnage} kg available.`);
    }

    // Update sale fields
    sale.buyername = buyername;
    sale.amountToBuy = amountToBuy;
    sale.unitprice = unitprice;
    sale.totalPaid = totalPaid;
    sale.amountPaid = totalPaid;
    sale.AmountSold = amountToBuy;

    // Deduct new stock
    product.tonnage -= amountToBuy;
    product.lowStockAlert = product.tonnage <= 500;

    await sale.save();
    await product.save();

    res.redirect("/seeSales");
  } catch (err) {
    console.error(" Error in POST /updateSale/:id:", err.message);
    res.status(500).send("Failed to update sale");
  }
});

// POST route to delete a sale
router.post("/deleteSale/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  console.log("Deleting sale with ID:", req.params.id);
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    const userDoc = await Signup.findById(user._id);
    if (userDoc.role !== "Manager") {
      return res.status(403).send("Only managers can delete sales.");
    }

    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).send("Sale not found");

    const product = await Product.findById(sale.productname);
    if (product) {
      product.tonnage += sale.amountToBuy;
      product.lowStockAlert = product.tonnage <= 500;
      await product.save();
    }

    await sale.deleteOne();
    res.redirect("/seeSales");
  } catch (err) {
    console.error(" Error deleting sale:", err.message);
    res.status(500).send("Failed to delete sale");
  }
});

 

module.exports = router;
