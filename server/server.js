require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const studentRoutes = require("./routes/studentRoutes")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/authRoutes")
const lessonRoutes = require("./routes/lessonRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const checkLessonReminders = require("./services/reminderService")
const settingsRoutes = require("./routes/settingsRoutes")

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
// Routes
app.use("/api/students", studentRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/lessons", lessonRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/settings", settingsRoutes)
// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "EduReminder server is working!",
  })
})

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully")

    // Check once when server starts
    checkLessonReminders()

    // Then check every minute
    setInterval(
      checkLessonReminders,
      60 * 1000
    )
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})