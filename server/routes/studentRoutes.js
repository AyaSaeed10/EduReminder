const express = require("express")
const Student = require("../models/Student")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()


// =====================================
// GET logged-in teacher's students
// =====================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const students = await Student.find({
      teacherId: req.teacher._id,
    }).sort({
      createdAt: -1,
    })

    res.json(students)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to get students",
    })
  }
})


// =====================================
// ADD student
// =====================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, phone, email } = req.body

    if (!name || !phone || !email) {
    return res.status(400).json({
      message: "Name, phone and email are required",
    })
  }

    const student = await Student.create({
    teacherId: req.teacher._id,
    name,
    phone,
    email,
  })

    res.status(201).json(student)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to create student",
    })
  }
})
// =====================================
// UPDATE student
// =====================================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, phone, email } = req.body

    if (!name || !phone || !email) {
      return res.status(400).json({
        message: "Name, phone and email are required",
      })
    }

    const student = await Student.findOneAndUpdate(
      {
        _id: req.params.id,
        teacherId: req.teacher._id,
      },
      {
        name,
        phone,
        email,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    )

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      })
    }

    res.json(student)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to update student",
    })
  }
})

// =====================================
// DELETE student
// =====================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,

      // Security:
      // teacher can only delete their own student
      teacherId: req.teacher._id,
    })

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      })
    }

    res.json({
      message: "Student deleted successfully",
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to delete student",
    })
  }
})


module.exports = router