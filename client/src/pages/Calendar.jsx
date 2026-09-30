import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { API_URL } from "../services/api"
function Calendar() {
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])

  const [showForm, setShowForm] = useState(false)

  const [selectedDate, setSelectedDate] = useState("")
  const [studentId, setStudentId] = useState("")
  const [time, setTime] = useState("")
  const [topic, setTopic] = useState("")

  const [error, setError] = useState("")

  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showLessonDetails, setShowLessonDetails] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const handleEventClick = (info) => {
  const lesson = lessons.find(
    (lesson) => lesson._id === info.event.id
  )

  if (!lesson) return

  setSelectedLesson(lesson)
  setShowLessonDetails(true)
}
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  // Get lessons
  useEffect(() => {
    const getLessons = async () => {
      try {
      const response = await fetch(
      `${API_URL}/api/lessons`,
      {
        credentials: "include",
      }
    )

        const data = await response.json()

        if (response.ok) {
          setLessons(data)
        }
      } catch (error) {
        console.error("Failed to get lessons:", error)
      }
    }

    getLessons()
  }, [])

  // Get this teacher's students
  useEffect(() => {
    const getStudents = async () => {
      try {
       const response = await fetch(
          `${API_URL}/api/students`,
          {
            credentials: "include",
          }
        )

        const data = await response.json()

        if (response.ok) {
          setStudents(data)
        }
      } catch (error) {
        console.error("Failed to get students:", error)
      }
    }

    getStudents()
  }, [])

  // When teacher clicks a date
  const handleDateClick = (info) => {
    setEditingLesson(null)
    setSelectedDate(info.dateStr)
    setStudentId("")
    setTime("")
    setTopic("")
    setError("")
    setShowForm(true)
  }

const handleAddLesson = async (e) => {
  e.preventDefault()

  setError("")

  if (!studentId || !time || !topic) {
    setError("Please fill in all fields")
    return
  }

  try {
    const url = editingLesson
  ? `${API_URL}/api/lessons/${editingLesson._id}`
  : `${API_URL}/api/lessons`

    const method = editingLesson
      ? "PUT"
      : "POST"

    const response = await fetch(url, {
      method,

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        studentId,
        date: selectedDate,
        time,
        topic,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(
        data.message ||
        "Failed to save lesson"
      )

      return
    }

    if (editingLesson) {

      // Replace old lesson with updated lesson
      setLessons((previousLessons) =>
        previousLessons.map((lesson) =>
          lesson._id === data._id
            ? data
            : lesson
        )
      )

    } else {

      // Add new lesson
      setLessons((previousLessons) => [
        ...previousLessons,
        data,
      ])
    }

    setShowForm(false)
    setEditingLesson(null)

    setStudentId("")
    setTime("")
    setTopic("")

  } catch (error) {
    console.error(
      "Failed to save lesson:",
      error
    )

    setError(
      "Could not connect to the server"
    )
  }
}

  const handleDeleteLesson = async () => {
  if (!selectedLesson) return

  try {
      const response = await fetch(
      `${API_URL}/api/lessons/${selectedLesson._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error(data.message)
      return
    }

    setLessons((previousLessons) =>
      previousLessons.filter(
        (lesson) =>
          lesson._id !== selectedLesson._id
      )
    )

    setSelectedLesson(null)
    setShowLessonDetails(false)

  } catch (error) {
    console.error(
      "Failed to delete lesson:",
      error
    )
  }
}
const handleStartEdit = () => {
  if (!selectedLesson) return

  setEditingLesson(selectedLesson)

  setSelectedDate(selectedLesson.date)
  setStudentId(selectedLesson.studentId._id)
  setTime(selectedLesson.time)
  setTopic(selectedLesson.topic)

  setShowLessonDetails(false)
  setShowForm(true)
}

  // Convert MongoDB lessons to FullCalendar events
  const calendarEvents = lessons.map((lesson) => ({
    id: lesson._id,

    title: `${lesson.time} - ${
      lesson.studentId?.name || "Student"
    }`,

    date: lesson.date,

    extendedProps: {
      topic: lesson.topic,
      student: lesson.studentId,
    },
  }))

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black dark:text-white">
          Calendar
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Click a date to schedule a lesson.
        </p>
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={calendarEvents}
          height="auto"
        />
      </div>

      {/* Add Lesson Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl p-7">

            <h2 className="text-2xl font-extrabold text-purple-700 dark:text-purple-400">
              {editingLesson
                ? "Edit Lesson"
                : "Add Lesson"}
            </h2>

            <p className="mt-1 text-gray-600 dark:text-gray-300">
              {selectedDate}
            </p>

            <form onSubmit={handleAddLesson}>

              {/* Student */}
              <div className="mt-6">
                <label className="block font-bold text-black dark:text-white mb-2">
                  Student
                </label>

                <select
                  value={studentId}
                  onChange={(e) =>
                    setStudentId(e.target.value)
                  }
                  className="
                    w-full
                    border-2 border-gray-300
                    dark:border-gray-600
                    bg-white dark:bg-gray-700
                    text-black dark:text-white
                    rounded-lg
                    px-4 py-3
                    outline-none
                    focus:border-purple-700
                  "
                >
                  <option value="">
                    Select student
                  </option>

                  {students.map((student) => (
                    <option
                      key={student._id}
                      value={student._id}
                    >
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div className="mt-5">
                <label className="block font-bold text-black dark:text-white mb-2">
                  Time
                </label>

                <input
                  type="time"
                  value={time}
                  onChange={(e) =>
                    setTime(e.target.value)
                  }
                  className="
                    w-full
                    border-2 border-gray-300
                    dark:border-gray-600
                    bg-white dark:bg-gray-700
                    text-black dark:text-white
                    rounded-lg
                    px-4 py-3
                    outline-none
                    focus:border-purple-700
                  "
                />
              </div>

              {/* Topic */}
              <div className="mt-5">
                <label className="block font-bold text-black dark:text-white mb-2">
                  Lesson Topic
                </label>

                <input
                  type="text"
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                  placeholder="Example: English Grammar"
                  className="
                    w-full
                    border-2 border-gray-300
                    dark:border-gray-600
                    bg-white dark:bg-gray-700
                    text-black dark:text-white
                    placeholder:text-gray-400
                    rounded-lg
                    px-4 py-3
                    outline-none
                    focus:border-purple-700
                  "
                />
              </div>

              {/* Error */}
              {error && (
                <p className="mt-4 text-red-600 font-semibold">
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-7">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="
                    flex-1
                    border-2 border-gray-300
                    dark:border-gray-600
                    text-black dark:text-white
                    font-bold
                    py-3
                    rounded-lg
                    hover:bg-gray-100
                    dark:hover:bg-gray-700
                  "
                >
                  onClick={() => {
                  setShowForm(false)
                  setEditingLesson(null)
                }}
                </button>

                <button
                  type="submit"
                  className="
                    flex-1
                    bg-purple-700
                    text-white
                    font-bold
                    py-3
                    rounded-lg
                    hover:bg-purple-800
                    transition
                  "
                >
                  {editingLesson
                ? "Update Lesson"
                : "Save Lesson"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {showLessonDetails && selectedLesson && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl p-7">

      <h2 className="text-2xl font-extrabold text-purple-700 dark:text-purple-400">
        Lesson Details
      </h2>

      <div className="mt-6 space-y-4">

        <div>
          <p className="font-bold text-black dark:text-white">
            Student
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            {selectedLesson.studentId?.name}
          </p>
        </div>

        <div>
          <p className="font-bold text-black dark:text-white">
            Date
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            {selectedLesson.date}
          </p>
        </div>

        <div>
          <p className="font-bold text-black dark:text-white">
            Time
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            {selectedLesson.time}
          </p>
        </div>

        <div>
          <p className="font-bold text-black dark:text-white">
            Topic
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            {selectedLesson.topic}
          </p>
        </div>

      </div>

      <div className="flex gap-3 mt-7">

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="
            flex-1
            border-2
            border-red-500
            text-red-600
            font-bold
            py-3
            rounded-lg
            hover:bg-red-50
            dark:hover:bg-gray-700
          "
        >
          Delete
        </button>

        <button
          onClick={handleStartEdit}
          className="
            flex-1
            bg-purple-700
            text-white
            font-bold
            py-3
            rounded-lg
            hover:bg-purple-800
          "
        >
          Edit Lesson
        </button>

      </div>

      <button
        onClick={() => {
          setShowLessonDetails(false)
          setSelectedLesson(null)
        }}
        className="
          w-full
          mt-3
          text-gray-600
          dark:text-gray-300
          font-semibold
          py-2
        "
      >
        Close
      </button>

    </div>
  </div>
)}

{/* Delete Confirmation Modal */}
{showDeleteConfirm && selectedLesson && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">

    <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-xl p-7">

      <div className="text-center">

        <div className="text-4xl mb-4">
          🗑️
        </div>

        <h2 className="text-2xl font-extrabold text-black dark:text-white">
          Delete Lesson?
        </h2>

        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete the lesson with{" "}
          <span className="font-bold">
            {selectedLesson.studentId?.name}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          This action cannot be undone.
        </p>

      </div>

      <div className="flex gap-3 mt-7">

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(false)}
          className="
            flex-1
            border-2 border-gray-300
            dark:border-gray-600
            text-black dark:text-white
            font-bold
            py-3
            rounded-lg
            hover:bg-gray-100
            dark:hover:bg-gray-700
            transition
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDeleteLesson}
          className="
            flex-1
            bg-red-600
            text-white
            font-bold
            py-3
            rounded-lg
            hover:bg-red-700
            transition
          "
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  )
}

export default Calendar