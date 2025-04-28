const express = require("express");
const router = express.Router();

router.get("/managerDash", (req, res) => {
    res.render("ManagerDashboard");
  });

  module.exports = router;