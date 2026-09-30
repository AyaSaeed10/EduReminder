const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  
  {
    timestamps: true,
  }
)

const Lesson = mongoose.model("Lesson", lessonSchema)

module.exports = Lesson