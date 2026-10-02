import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../services/api"

function Dashboard() {
  const navigate = useNavigate()

  const [students, setStudents] = useState([])
  const [lessons, setLessons] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [studentsResponse, lessonsResponse, notificationsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/students`, {
              credentials: "include",
            }),

            fetch(`${API_URL}/api/lessons`, {
              credentials: "include",
            }),

            fetch(`${API_URL}/api/notifications`, {
              credentials: "include",
            }),
          ])

        const studentsData = await studentsResponse.json()
        const lessonsData = await lessonsResponse.json()
        const notificationsData = await notificationsResponse.json()

        setStudents(studentsData)
        setLessons(lessonsData)
        setNotifications(notificationsData)
      } catch (error) {
        console.error("Failed to load dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  // YYYY-MM-DD using the browser's local date
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  const todayString = `${year}-${month}-${day}`

  const todayLessons = lessons
    .filter((lesson) => lesson.date === todayString)
    .sort((a, b) => a.time.localeCompare(b.time))

  const upcomingLessons = lessons
    .filter((lesson) => {
      const lessonDateTime = new Date(
        `${lesson.date}T${lesson.time}:00`
      )

      return lessonDateTime > new Date()
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`)
      const dateB = new Date(`${b.date}T${b.time}:00`)

      return dateA - dateB
    })

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  )

  const recentNotifications = notifications.slice(0, 3)

  if (loading) {
    return (
      <p className="text-gray-600 dark:text-gray-300">
        Loading dashboard...
      </p>
    )
  }

  return (
    <div className="w-full min-w-0">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here's what's happening with your lessons.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
        <StatCard
          icon="👥"
          title="Students"
          value={students.length}
        />

        <StatCard
          icon="📅"
          title="Today's Lessons"
          value={todayLessons.length}
        />

        <StatCard
          icon="⏰"
          title="Upcoming Lessons"
          value={upcomingLessons.length}
        />

        <StatCard
          icon="🔔"
          title="Unread Notifications"
          value={unreadNotifications.length}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">

        <button
          onClick={() => navigate("/students")}
          className="
            w-full sm:w-auto
            bg-purple-700 hover:bg-purple-800
            text-white font-bold
            px-5 py-3 rounded-lg transition
          "
        >
          + Add Student
        </button>

        <button
          onClick={() => navigate("/calendar")}
          className="
            w-full sm:w-auto
            border-2 border-purple-700
            text-purple-700 dark:text-purple-400
            dark:border-purple-400
            font-bold px-5 py-3 rounded-lg
            hover:bg-purple-50 dark:hover:bg-gray-800
            transition
          "
        >
          + Schedule Lesson
        </button>

      </div>

      {/* Lessons */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        {/* Today's Lessons */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 min-w-0">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-5">

            <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white">
              Today's Lessons
            </h2>

            <button
              onClick={() => navigate("/calendar")}
              className="text-purple-700 dark:text-purple-400 font-bold text-left sm:text-right"
            >
              View Calendar →
            </button>

          </div>

          {todayLessons.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              📅 No lessons scheduled for today.
            </p>
          ) : (
            <div className="space-y-3">
              {todayLessons.map((lesson) => (
                <LessonRow
                  key={lesson._id}
                  lesson={lesson}
                  showDate={false}
                />
              ))}
            </div>
          )}

        </section>

        {/* Upcoming Lessons */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 min-w-0">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-5">

            <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white">
              Upcoming Lessons
            </h2>

            <button
              onClick={() => navigate("/calendar")}
              className="text-purple-700 dark:text-purple-400 font-bold text-left sm:text-right"
            >
              View All →
            </button>

          </div>

          {upcomingLessons.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No upcoming lessons.
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingLessons.slice(0, 3).map((lesson) => (
                <LessonRow
                  key={lesson._id}
                  lesson={lesson}
                  showDate={true}
                />
              ))}
            </div>
          )}

        </section>

      </div>

      {/* Recent Notifications */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 mt-6 min-w-0">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-5">

          <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white">
            Recent Notifications
          </h2>

          <button
            onClick={() => navigate("/notifications")}
            className="text-purple-700 dark:text-purple-400 font-bold text-left sm:text-right"
          >
            View All →
          </button>

        </div>

        {recentNotifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            🔔 No notifications yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div
                key={notification._id}
                className="
                  border border-gray-200 dark:border-gray-700
                  rounded-xl p-4
                  break-words
                "
              >
                <p className="font-semibold text-black dark:text-white break-words">
                  {notification.message}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

      </section>

    </div>
  )
}

function StatCard({ icon, title, value }) {
  return (
    <div
      className="
        bg-white dark:bg-gray-800
        rounded-2xl shadow-md
        p-4 sm:p-6
        border border-gray-100 dark:border-gray-700
        min-w-0
      "
    >
      <div className="flex items-center justify-between gap-4">

        <div className="min-w-0">
          <p className="text-gray-500 dark:text-gray-400 font-semibold">
            {title}
          </p>

          <p className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white mt-2">
            {value}
          </p>
        </div>

        <span className="text-3xl shrink-0">
          {icon}
        </span>

      </div>
    </div>
  )
}

function LessonRow({ lesson, showDate }) {
  return (
    <div
      className="
        border border-gray-200 dark:border-gray-700
        rounded-xl p-4
        flex flex-col sm:flex-row
        sm:justify-between sm:items-center
        gap-2
        min-w-0
      "
    >

      <div className="min-w-0">
        <p className="font-bold text-black dark:text-white break-words">
          {lesson.studentId?.name || "Student"}
        </p>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 break-words">
          {lesson.topic}
        </p>
      </div>

      <div className="text-left sm:text-right shrink-0">

        {showDate && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {lesson.date}
          </p>
        )}

        <p className="font-bold text-purple-700 dark:text-purple-400">
          {lesson.time}
        </p>

      </div>

    </div>
  )
}

export default Dashboard