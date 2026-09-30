const Lesson = require("../models/Lesson")
const Notification = require("../models/Notification")
const sendLessonReminderEmail =require("./emailService")
const Teacher = require("../models/Teacher")
const checkLessonReminders = async () => {
  try {
    const now = new Date()

    console.log(
      "Checking reminders:",
      now.toLocaleString()
    )

   const lessons = await Lesson.find({
  $or: [
    { reminderSent: false },
    { reminderSent: { $exists: false } },
  ],
}).populate("studentId", "name phone email")
    console.log(
  "Lessons waiting for reminder:",
  lessons.length
)
    for (const lesson of lessons) {

      const lessonDateTime = new Date(
  `${lesson.date}T${lesson.time}:00`
)

const differenceMs =
  lessonDateTime.getTime() - now.getTime()

const differenceHours =
  differenceMs / (60 * 60 * 1000)

console.log(
  `Lesson: ${lesson.date} ${lesson.time} | Hours away:`,
  differenceHours
)

if (
  differenceHours > 23 &&
  differenceHours <= 24
) {
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

 await Notification.create({
  teacherId: lesson.teacherId,
  lessonId: lesson._id,

  message:
    `Reminder: You have a lesson with ${studentName} ` +
    `tomorrow at ${lesson.time}.`,

  expiresAt,
})

  if (lesson.studentId?.email) {
  await sendLessonReminderEmail(
    lesson.studentId.email,
    studentName,
    lesson.date,
    lesson.time,
    lesson.topic
  )
}
  lesson.reminderSent = true

  await lesson.save()

  console.log(
    `✅ Reminder created for ${studentName}`
  )
}
    }

  } catch (error) {
    console.error(
      "Reminder scheduler error:",
      error
    )
  }
}

module.exports = checkLessonReminders