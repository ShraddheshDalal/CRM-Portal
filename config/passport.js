const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const { pool } = require("./database")

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        // Find user by email
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
        const user = result.rows[0]

        if (!user) {
          return done(null, false, { message: "Email is not registered" })
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err

          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: "Password incorrect" })
          }
        })
      } catch (err) {
        console.error(err)
        return done(err)
      }
    }),
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])
      done(null, result.rows[0])
    } catch (err) {
      done(err, null)
    }
  })
}

