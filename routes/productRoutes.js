const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const connectEnsureLogin = require("connect-ensure-login");
const moment = require("moment");

// Models
const Product = require("../models/Product");
const Signup = require("../models/Signup");

// — Multer setup — store uploads in public/img/uploads, save filename only
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "public", "img", "uploads")),
  filename: (req, file, cb) =>
    cb(null, file.originalname)
});
const upload = multer({ storage });

// GET /addProduct → render form with branch
router.get(
  "/addProduct",
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => {
    const branch = req.session.user.branch || "";
    res.render("addProduct", { branch });
  }
);

// POST /addProduct → create new product
router.post(
  "/addProduct",
  connectEnsureLogin.ensureLoggedIn(),
  upload.single("image"),
  async (req, res) => {
    try {
      const userBranch = req.session.user.branch;
      const product = new Product({
        ...req.body,
        branch: userBranch,
        image: req.file.filename // ✅ Image filename stored
      });
      await product.save();
      res.redirect("/addProduct");
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).render("addProduct", {
        branch: req.session.user.branch,
        error: "Failed to add product"
      });
    }
  }
);

// GET /seeProducts → managers see all, agents see only their branch
router.get(
  "/seeProducts",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    console.log("🔥 ENTERED GET /seeProducts");
    try {
      const { role, branch } = req.session.user;
      console.log("User role & branch:", role, branch);

      const query = role === "Manager" ? {} : { branch };
      let products = await Product.find(query).sort({ natural: -1 });

      // ✅ Strip image to basename for correct rendering path
      products = products.map(p => {
        return {
          ...p.toObject(),
          image: path.basename(p.image) // /img/uploads/<filename>
        };
      });

      console.log(
        "After strip, first image values:",
        products.slice(0, 5).map(p => p.image)
      );

      res.render("productTable", {
        products,
        moment,
        branch,
        role
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(400).send("Unable to find items in the database");
    }
  }
);

// GET /updateProduct/:id → render update form
router.get(
  "/updateProduct/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send("Product not found");
      res.render("updateProduct", {
        product,
        branch: req.session.user.branch
      });
    } catch (error) {
      console.error("Error loading product:", error);
      res.status(400).send("Unable to find this item in the database");
    }
  }
);

// POST /updateProduct → save edits, keep branch unchanged, update image if new
router.post(
  "/updateProduct",
  connectEnsureLogin.ensureLoggedIn(),
  upload.single("image"),
  async (req, res) => {
    try {
      const updateData = { ...req.body, branch: req.session.user.branch };
      if (req.file) updateData.image = req.file.filename; // ✅ Replace image if new
      await Product.findByIdAndUpdate(req.query.id, updateData);
      res.redirect("/seeProducts");
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).send("Unable to update the product");
    }
  }
);

// POST /deleteProduct → delete by id
router.post(
  "/deleteProduct",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      await Product.deleteOne({ _id: req.body.id });
      res.redirect("back");
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(400).send("Unable to delete this item in the database");
    }
  }
);

module.exports = router;
