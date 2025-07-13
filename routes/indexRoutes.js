const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const { pool } = require("../config/database");

// Home page
router.get("/", (req, res) => {
  res.render("index", {
    title: "CRM Portal - Home",
    user: req.user,
  })
})

// Dashboard page (protected)
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    // Query total customers
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM customers WHERE user_id = $1",
      [req.user.id]
    );

    // Query new customers added in the current month
    const newCustomersResult = await pool.query(
      "SELECT COUNT(*) FROM customers WHERE user_id = $1 AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)",
      [req.user.id]
    );

    // Recent 5 customers
    const recentCustomersResult = await pool.query(
      "SELECT name, company, created_at FROM customers WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5",
      [req.user.id]
    );

    res.render("dashboard", {
      title: "Dashboard",
      user: req.user,
      totalCustomers: totalResult.rows[0].count,
      newCustomers: newCustomersResult.rows[0].count,
      recentCustomers: recentCustomersResult.rows
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;

