require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

const studentRoutes = require("./routes/studentRoutes")
const authRoutes = require("./routes/authRoutes")
const lessonRoutes = require("./routes/lessonRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const settingsRoutes = require("./routes/settingsRoutes")
const cronRoutes = require("./routes/cronRoutes")
const connectDB = require("./config/db")
const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error("Database connection failed:", error)

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    })
  }
})
// Routes
app.use("/api/students", studentRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/lessons", lessonRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/settings", settingsRoutes)

// Cron route
app.use("/api/cron", cronRoutes)

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "EduReminder server is working!",
  })
})



// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})