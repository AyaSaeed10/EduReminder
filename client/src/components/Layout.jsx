import { Outlet, NavLink, useNavigate } from "react-router-dom"
import ThemeToggle from "./ThemeToggle"
import { useEffect, useState } from "react"
import { API_URL } from "../services/api"
function Layout() {
    const navigate = useNavigate()

const handleLogout = async () => {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    })

    navigate("/")
  } catch (error) {
    console.error("Logout failed:", error)
  }
}
const [teacher, setTeacher] = useState(null)

useEffect(() => {
  const getTeacher = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      })

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setTeacher(data.teacher)
    } catch (error) {
      console.error("Failed to get teacher:", error)
    }
  }

  getTeacher()
}, [])
  return (
    <div className="min-h-screen flex bg-[#F7F3EB] dark:bg-gray-900">

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">

        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-extrabold text-purple-700 dark:text-purple-400">
            EduReminder
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Teacher Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-700"
              }`
            }
          >
            Calendar
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-700"
              }`
            }
          >
            Students
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-700"
              }`
            }
          >
            Notifications
          </NavLink>
           <NavLink
            to="/settings"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-700"
              }`
            }
          >
            Settings
          </NavLink>

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
            onClick={handleLogout}
            className="w-full py-3 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg"
            >
            Logout
        </button>
        </div>

      </aside>

      {/* Right Side */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header
          className="
            h-20
            bg-white
            dark:bg-gray-800
            shadow-sm
            flex
            items-center
            justify-between
            px-8
          "
        >

          <h2 className="font-bold text-xl text-black dark:text-white">
            Welcome, {teacher?.name || "Teacher"}
          </h2>

          {/* Header Right Side */}
          <div className="flex items-center gap-4">

            <ThemeToggle />

            <button className="text-2xl">
              🔔
            </button>

          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default Layout