const express = require("express")
const router = express.Router()
const passport = require("passport")
const bcrypt = require("bcryptjs")
const { pool } = require("../config/database")
const { forwardAuthenticated } = require("../middleware/auth")

// Login page
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login", { title: "Login" })
})

// Signup page
router.get("/signup", forwardAuthenticated, (req, res) => {
  res.render("signup", { title: "Sign Up" })
})

// Login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next)
})

// Signup handle
router.post("/signup", async (req, res, next) => {
  const { name, email, password, password2 } = req.body
  const errors = []

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" })
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" })
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" })
  }

  if (errors.length > 0) {
    res.render("signup", {
      title: "Sign Up",
      errors,
      name,
      email,
    })
  } else {
    try {
      // Check if email exists
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])

      if (result.rows.length > 0) {
        errors.push({ msg: "Email is already registered" })
        res.render("signup", {
          title: "Sign Up",
          errors,
          name,
          email,
        })
      } else {
        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Insert new user
        const newUser = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [
          name,
          email,
          hashedPassword,
        ])

        req.flash("success_msg", "You are now registered and can log in")
        res.redirect("/auth/login")
      }
    } catch (err) {
      console.error(err)
      res.status(500).send("Server error")
    }
  }
})

// Logout handle
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    req.flash("success_msg", "You are logged out")
    res.redirect("/auth/login")
  })
})

module.exports = router

