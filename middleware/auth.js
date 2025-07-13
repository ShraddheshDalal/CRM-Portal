// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash("error_msg", "Please log in to view this resource")
  res.redirect("/auth/login")
}

// Middleware to redirect if already logged in
const forwardAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect("/dashboard")
}

module.exports = {
  ensureAuthenticated,
  forwardAuthenticated,
}

