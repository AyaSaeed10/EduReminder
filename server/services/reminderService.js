const Lesson = require("../models/Lesson")
const Notification = require("../models/Notification")
const sendLessonReminderEmail = require("./emailService")
const Teacher = require("../models/Teacher")

const checkLessonReminders = async () => {
  try {
    // Get today's date according to Israel time
    const israelToday = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jerusalem",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date())

    // Create tomorrow based on the Israeli calendar date
    const [year, month, day] = israelToday.split("-").map(Number)

    const tomorrow = new Date(
      Date.UTC(year, month - 1, day + 1)
    )

    const tomorrowDate = [
      tomorrow.getUTCFullYear(),
      String(tomorrow.getUTCMonth() + 1).padStart(2, "0"),
      String(tomorrow.getUTCDate()).padStart(2, "0"),
    ].join("-")

    console.log(
      "Checking reminders for tomorrow:",
      tomorrowDate
    )

    const lessons = await Lesson.find({
      date: tomorrowDate,
      $or: [
        { reminderSent: false },
        { reminderSent: { $exists: false } },
      ],
    }).populate("studentId", "name phone email")


    console.log(
      "Tomorrow's lessons waiting for reminder:",
      lessons.length
    )

    for (const lesson of lessons) {
      const studentName =
        lesson.studentId?.name || "Student"

      const teacher = await Teacher.findById(
        lesson.teacherId
      ).select("notificationRetentionDays")

      let expiresAt = null

      const retentionDays =
        teacher &&
        teacher.notificationRetentionDays !== undefined
          ? teacher.notificationRetentionDays
          : 30

      if (retentionDays !== null) {
        expiresAt = new Date()

        expiresAt.setDate(
          expiresAt.getDate() + retentionDays
        )
      }

      // Create notification for the teacher
      await Notification.create({
        teacherId: lesson.teacherId,
        lessonId: lesson._id,

        message:
          `Reminder: You have a lesson with ${studentName} ` +
          `tomorrow at ${lesson.time}.`,

        expiresAt,
      })

      // Send email to the student
      if (lesson.studentId?.email) {
        await sendLessonReminderEmail(
          lesson.studentId.email,
          studentName,
          lesson.date,
          lesson.time,
          lesson.topic
        )
      }

      // Prevent duplicate reminders
      lesson.reminderSent = true
      await lesson.save()

      console.log(
        `✅ Reminder created for ${studentName}`
      )
    }
  } catch (error) {
    console.error(
      "Reminder scheduler error:",
      error
    )
  }
}

module.exports = checkLessonReminders