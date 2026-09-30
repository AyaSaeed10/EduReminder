const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middleware/authMiddleware")
const Teacher = require("../models/Teacher")

const router = express.Router()
router.get("/test", (req, res) => {
  res.json({
    message: "Auth routes are working",
  })
})

// ===============================
// REGISTER
// ===============================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({
      email: email.toLowerCase(),
    })

    if (existingTeacher) {
      return res.status(400).json({
        message: "Teacher with this email already exists",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save teacher
    const teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      message: "Teacher registered successfully",

      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Registration failed",
    })
  }
})


// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      })
    }

    // Find teacher
    const teacher = await Teacher.findOne({
      email: email.toLowerCase(),
    })

    if (!teacher) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    // Compare password with hashed password
    const passwordCorrect = await bcrypt.compare(
      password,
      teacher.password
    )

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    // Create JWT
    const token = jwt.sign(
      {
        teacherId: teacher._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    )

    // Store JWT inside HTTP-only cookie
const isProduction = process.env.NODE_ENV === "production"

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      message: "Login successful",

      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Login failed",
    })
  }
})

// ===============================
// CURRENT LOGGED-IN TEACHER
// ===============================

router.get("/me", authMiddleware, async (req, res) => {
  res.json({
    teacher: {
      id: req.teacher._id,
      name: req.teacher.name,
      email: req.teacher.email,
    },
  })
})


// ===============================
// LOGOUT
// ===============================

router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production"

  res.clearCookie("authToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  })

  res.json({
    message: "Logged out successfully",
  })
})
module.exports = router