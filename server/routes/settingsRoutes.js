const express = require("express")
const Teacher = require("../models/Teacher")
const authMiddleware =
  require("../middleware/authMiddleware")

const router = express.Router()


// GET teacher settings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findById(
      req.teacher._id
    ).select("notificationRetentionDays")

    res.json({
      notificationRetentionDays:
        teacher.notificationRetentionDays ?? 30,
    })
  } catch (error) {
    console.error("Get settings error:", error)

    res.status(500).json({
      message: "Server error",
    })
  }
})


// UPDATE teacher settings
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { notificationRetentionDays } = req.body

    const allowedValues = [7, 30, 90, null]

    if (!allowedValues.includes(notificationRetentionDays)) {
      return res.status(400).json({
        message: "Invalid retention period",
      })
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.teacher._id,
      {
        notificationRetentionDays,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("notificationRetentionDays")

    res.json({
      notificationRetentionDays:
        teacher.notificationRetentionDays,
    })
  } catch (error) {
    console.error("Update settings error:", error)

    res.status(500).json({
      message: "Server error",
    })
  }
})

module.exports = router