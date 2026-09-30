const jwt = require("jsonwebtoken")
const Teacher = require("../models/Teacher")

const authMiddleware = async (req, res, next) => {
  try {
    // Get JWT from the cookie
    const token = req.cookies.authToken

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      })
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Find the teacher
    const teacher = await Teacher.findById(
      decoded.teacherId
    ).select("-password")

    if (!teacher) {
      return res.status(401).json({
        message: "Teacher not found",
      })
    }

    // Attach teacher to the request
    req.teacher = teacher

    next()

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication",
    })
  }
}

module.exports = authMiddleware