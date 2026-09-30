const express = require("express")

const Lesson = require("../models/Lesson")
const Student = require("../models/Student")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()


// =====================================
// GET ALL LESSONS FOR LOGGED-IN TEACHER
// =====================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const lessons = await Lesson.find({
      teacherId: req.teacher._id,
    })
      .populate("studentId", "name phone")
      .sort({
        date: 1,
        time: 1,
      })

    res.json(lessons)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to get lessons",
    })
  }
})


// =====================================
// CREATE LESSON
// =====================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      studentId,
      date,
      time,
      topic,
    } = req.body


    // Check required fields
    if (!studentId || !date || !time || !topic) {
      return res.status(400).json({
        message: "All lesson fields are required",
      })
    }


    // Make sure this student belongs
    // to the logged-in teacher
    const student = await Student.findOne({
      _id: studentId,
      teacherId: req.teacher._id,
    })


    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      })
    }


    // Create lesson
    const lesson = await Lesson.create({
      teacherId: req.teacher._id,
      studentId,
      date,
      time,
      topic,
    })


    // Get lesson again with student information
    const populatedLesson = await Lesson.findById(
      lesson._id
    ).populate("studentId", "name phone")


    res.status(201).json(populatedLesson)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to create lesson",
    })
  }
})


// =====================================
// DELETE LESSON
// =====================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const lesson = await Lesson.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.teacher._id,
    })


    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      })
    }


    res.json({
      message: "Lesson deleted successfully",
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to delete lesson",
    })
  }
})

// =====================================
// UPDATE LESSON
// =====================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      studentId,
      date,
      time,
      topic,
    } = req.body

    if (!studentId || !date || !time || !topic) {
      return res.status(400).json({
        message: "All lesson fields are required",
      })
    }

    // Make sure the selected student
    // belongs to the logged-in teacher
    const student = await Student.findOne({
      _id: studentId,
      teacherId: req.teacher._id,
    })

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      })
    }

    // Find lesson AND make sure it belongs
    // to the logged-in teacher
    const lesson = await Lesson.findOneAndUpdate(
      {
        _id: req.params.id,
        teacherId: req.teacher._id,
      },
      {
        studentId,
        date,
        time,
        topic,
      },
     {
        returnDocument: "after",
        runValidators: true,
     }
    ).populate("studentId", "name phone")

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      })
    }

    res.json(lesson)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to update lesson",
    })
  }
})

module.exports = router