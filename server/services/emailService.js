const nodemailer = require("nodemailer")
console.log("EMAIL_USER loaded:", !!process.env.EMAIL_USER)
console.log(
  "EMAIL_APP_PASSWORD loaded:",
  !!process.env.EMAIL_APP_PASSWORD
)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

const sendLessonReminderEmail = async (
  studentEmail,
  studentName,
  lessonDate,
  lessonTime,
  lessonTopic
) => {
  const mailOptions = {
    from: `"EduReminder" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: "EduReminder - Lesson Reminder",

    text: `
Hi ${studentName},

This is a reminder that you have a lesson tomorrow.

Date: ${lessonDate}
Time: ${lessonTime}
Topic: ${lessonTopic}

See you soon!

EduReminder
    `,
  }

  const info = await transporter.sendMail(mailOptions)

  console.log(
    `📧 Email reminder sent to ${studentEmail}`
  )

  return info
}

module.exports = sendLessonReminderEmail