import { useEffect, useState } from "react"
import { API_URL } from "../services/api"
function Students() {

  // Temporary students - later these will come from MongoDB
  const [students, setStudents] = useState([])

  // Controls the Add Student form
  const [showForm, setShowForm] = useState(false)

  // Form data
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [editingStudent, setEditingStudent] = useState(null)
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

      setStudents(data)

    } catch (error) {

      console.error("Failed to get students:", error)

    }

  }

  getStudents()

}, [])


const handleSaveStudent = async (e) => {
  e.preventDefault()

  if (!name.trim() || !phone.trim() || !email.trim()) {
    return
  }

  try {
    const isEditing = editingStudent !== null

    const url = isEditing
  ? `${API_URL}/api/students/${editingStudent._id}`
  : `${API_URL}/api/students`

    const method = isEditing ? "PUT" : "POST"

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        phone,
        email,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(data.message)
      return
    }

    if (isEditing) {
      setStudents((previousStudents) =>
        previousStudents.map((student) =>
          student._id === data._id ? data : student
        )
      )
    } else {
      setStudents((previousStudents) => [
        data,
        ...previousStudents,
      ])
    }

    setName("")
    setPhone("")
    setEmail("")
    setEditingStudent(null)
    setShowForm(false)
  } catch (error) {
    console.error("Failed to save student:", error)
  }
}
const handleEditStudent = (student) => {
  setEditingStudent(student)

  setName(student.name)
  setPhone(student.phone)
  setEmail(student.email || "")

  setShowForm(true)
}
const handleDeleteStudent = async (id) => {
  try {
    const response = await fetch(
    `${API_URL}/api/students/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  )

    if (!response.ok) {
      const data = await response.json()
      console.error(data.message)
      return
    }

    setStudents((previousStudents) =>
      previousStudents.filter(
        (student) => student._id !== id
      )
    )
  } catch (error) {
    console.error("Failed to delete student:", error)
  }
}
  return (
    <div>

      {/* Page Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white">
            Students
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Add and manage your students.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true)
            setEditingStudent(null)
            setName("")
            setPhone("")
            setEmail("")
          }}
          className="
            bg-purple-700
            hover:bg-purple-800
            text-white
            font-bold
            px-5 py-3
            rounded-lg
            transition
          "
        >
          + Add Student
        </button>

      </div>


      {/* Add Student Form */}
      {showForm && (

        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">

          <h2 className="text-xl font-bold text-black dark:text-white">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h2>

          <form
          onSubmit={handleSaveStudent}
          className="mt-5"
        >

            {/* Student Name */}
            <div>
              <label className="block text-black dark:text-white font-bold mb-2">
                Student Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student name"
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
                  dark:focus:border-purple-400
                "
              />
            </div>


            {/* Phone */}
            <div className="mt-5">

              <label className="block text-black dark:text-white font-bold mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+972..."
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
                  dark:focus:border-purple-400
                "
              />

            </div>
         <div className="mt-5">
        <label className="block text-black dark:text-white font-bold mb-2">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student@example.com"
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
            dark:focus:border-purple-400
          "
          required
        />
      </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() => {
                  setEditingStudent(null)
                  setName("")
                  setPhone("")
                  setEmail("")
                  setShowForm(true)
                }}
                className="
                  px-5 py-2
                  rounded-lg
                  border border-gray-300
                  text-gray-700
                  dark:text-gray-200
                  dark:border-gray-600
                  font-bold
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  px-5 py-2
                  rounded-lg
                  bg-purple-700
                  hover:bg-purple-800
                  text-white
                  font-bold
                  transition
                "
              >
                {editingStudent ? "Save Changes" : "Save Student"}
              </button>

            </div>

          </form>

        </div>

      )}


{/* Students List */}
<div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">

  {/* List Header */}
  <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white">
      Student List
    </h2>
  </div>

  {students.length === 0 ? (
    <div className="p-10 text-center">
      <p className="text-gray-500 dark:text-gray-400">
        No students added yet.
      </p>
    </div>
  ) : (
    <>
      {/* Mobile View */}
      <div className="md:hidden p-4 space-y-4">
        {students.map((student) => (
          <div
            key={student._id}
            className="
              border border-gray-200 dark:border-gray-700
              rounded-xl p-4
            "
          >
            {/* Name */}
            <h3 className="text-lg font-bold text-black dark:text-white">
              {student.name}
            </h3>

            {/* Phone */}
            <div className="mt-4">
              <p className="text-xs font-bold uppercase text-gray-400">
                Phone Number
              </p>

              <p className="mt-1 text-gray-700 dark:text-gray-300">
                {student.phone}
              </p>
            </div>

            {/* Email */}
            <div className="mt-3 min-w-0">
              <p className="text-xs font-bold uppercase text-gray-400">
                Email
              </p>

              <p className="mt-1 text-gray-700 dark:text-gray-300 break-all">
                {student.email}
              </p>
            </div>

            {/* Actions */}
            <div className="
              flex items-center justify-end
              gap-5 mt-5 pt-4
              border-t border-gray-200 dark:border-gray-700
            ">
              <button
                onClick={() => handleEditStudent(student)}
                className="text-purple-700 dark:text-purple-400 font-bold"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteStudent(student._id)}
                className="text-red-600 dark:text-red-400 font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-purple-50 dark:bg-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-black dark:text-white">
                Name
              </th>

              <th className="text-left px-6 py-4 text-black dark:text-white">
                Phone Number
              </th>

              <th className="text-left px-6 py-4 text-black dark:text-white">
                Email
              </th>

              <th className="text-right px-6 py-4 text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-6 py-4 text-black dark:text-white">
                  {student.name}
                </td>

                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {student.phone}
                </td>

                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {student.email}
                </td>

                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleEditStudent(student)}
                    className="text-purple-700 dark:text-purple-400 font-bold mr-4"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteStudent(student._id)}
                    className="text-red-600 dark:text-red-400 font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}

</div>

    </div>
  )
}

export default Students