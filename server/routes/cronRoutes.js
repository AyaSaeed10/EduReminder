const express = require("express")
const router = express.Router()

const checkLessonReminders = require("../services/reminderService")

router.get("/reminders", async (req, res) => {
  try {
    const authHeader = req.headers.authorization

    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    await checkLessonReminders()

    res.status(200).json({
      success: true,
      message: "Reminder check completed",
    })
  } catch (error) {
    console.error("Cron reminder error:", error)

    res.status(500).json({
      success: false,
      message: "Reminder check failed",
    })
  }
})

module.exports = router