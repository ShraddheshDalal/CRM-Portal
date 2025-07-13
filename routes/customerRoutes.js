const express = require("express")
const router = express.Router()
const { pool } = require("../config/database")
const { ensureAuthenticated } = require("../middleware/auth")

// All routes in this file are protected
router.use(ensureAuthenticated)

// Get all customers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers WHERE user_id = $1 ORDER BY created_at DESC", [
      req.user.id,
    ])

    res.render("customers", {
      title: "Customers",
      customers: result.rows,
    })
  } catch (err) {
    console.error(err)
    req.flash("error_msg", "Error retrieving customers")
    res.redirect("/dashboard")
  }
})

// Add customer form
router.get("/add", (req, res) => {
  res.render("customer-form", {
    title: "Add Customer",
    customer: null,
    action: "/customers",
  })
})

// Add customer
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body

    await pool.query(
      "INSERT INTO customers (name, email, phone, company, status, notes, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [name, email, phone, company, status, notes, req.user.id],
    )

    req.flash("success_msg", "Customer added successfully")
    res.redirect("/customers")
  } catch (err) {
    console.error(err)
    req.flash("error_msg", "Error adding customer")
    res.redirect("/customers/add")
  }
})

// Edit customer form
router.get("/edit/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ])

    if (result.rows.length === 0) {
      req.flash("error_msg", "Customer not found")
      return res.redirect("/customers")
    }

    res.render("customer-form", {
      title: "Edit Customer",
      customer: result.rows[0],
      action: `/customers/${req.params.id}?_method=PUT`,
    })
  } catch (err) {
    console.error(err)
    req.flash("error_msg", "Error retrieving customer")
    res.redirect("/customers")
  }
})

// Update customer
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body

    await pool.query(
      "UPDATE customers SET name = $1, email = $2, phone = $3, company = $4, status = $5, notes = $6 WHERE id = $7 AND user_id = $8",
      [name, email, phone, company, status, notes, req.params.id, req.user.id],
    )

    req.flash("success_msg", "Customer updated successfully")
    res.redirect("/customers")
  } catch (err) {
    console.error(err)
    req.flash("error_msg", "Error updating customer")
    res.redirect(`/customers/edit/${req.params.id}`)
  }
})

// Delete customer
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM customers WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id])

    req.flash("success_msg", "Customer removed successfully")
    res.redirect("/customers")
  } catch (err) {
    console.error(err)
    req.flash("error_msg", "Error removing customer")
    res.redirect("/customers")
  }
})

module.exports = router

