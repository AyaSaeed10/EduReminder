const express = require("express")
const Notification = require("../models/Notification")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()


// =====================================
// GET TEACHER NOTIFICATIONS
// =====================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      teacherId: req.teacher._id,
    })
      .populate({
        path: "lessonId",
        populate: {
          path: "studentId",
          select: "name phone",
        },
      })
      .sort({
        createdAt: -1,
      })

    res.json(notifications)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to get notifications",
    })
  }
})

// Mark all notifications as read
router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        teacherId: req.teacher._id,
        read: false,
      },
      {
        $set: { read: true },
      }
    )

    res.json({
      message: "All notifications marked as read",
    })
  } catch (error) {
    console.error("Mark all as read error:", error)

    res.status(500).json({
      message: "Server error",
    })
  }
})
// =====================================
// MARK NOTIFICATION AS READ
// =====================================

router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          teacherId: req.teacher._id,
        },
        {
          read: true,
        },
        {
           returnDocument: "after",
        }
      )

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      })
    }

    res.json(notification)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to update notification",
    })
  }
})
// DELETE one notification
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.teacher._id,
    })

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      })
    }

    res.json({
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("Delete notification error:", error)

    res.status(500).json({
      message: "Server error",
    })
  }
})
// DELETE all notifications for logged-in teacher
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await Notification.deleteMany({
      teacherId: req.teacher._id,
    })

    res.json({
      message: "All notifications deleted successfully",
    })
  } catch (error) {
    console.error("Delete all notifications error:", error)

    res.status(500).json({
      message: "Server error",
    })
  }
})

module.exports = router