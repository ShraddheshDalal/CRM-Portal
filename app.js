const express = require("express")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const methodOverride = require("method-override")
const { pool } = require("./config/database")

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// Set up view engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Middleware
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))

// Session configuration
app.use(
  session({
    secret: "crm-portal-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, // 1 hour
  }),
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())
require("./config/passport")(passport)

// Flash messages
app.use(flash())

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  res.locals.user = req.user || null
  next()
})

// Routes
app.use("/", require("./routes/indexRoutes"))
app.use("/auth", require("./routes/authRoutes"))
app.use("/customers", require("./routes/customerRoutes"))

// Error handling
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" })
})


app.locals.timeAgo = function (date) {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };
  

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app

