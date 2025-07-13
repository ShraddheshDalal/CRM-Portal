const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "Devs",
  password: process.env.DB_PASSWORD || "Devashish@507",
  port: process.env.DB_PORT || 5432,
})

// Test database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to the database", err.stack)
  } else {
    console.log("Connected to PostgreSQL database")
  }
})

// Initialize database tables
const initDb = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create customers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        company VARCHAR(100),
        status VARCHAR(50),
        notes TEXT,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log("Database tables initialized")
  } catch (err) {
    console.error("Error initializing database tables", err)
  }
}

// Call initDb function
initDb()

module.exports = { pool }

