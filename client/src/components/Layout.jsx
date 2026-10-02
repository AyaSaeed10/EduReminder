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
const [menuOpen, setMenuOpen] = useState(false)
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
    {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      {/* Sidebar */}
     <aside
        className={`
          fixed
          top-0 left-0
          z-50
          h-screen
          w-64
          bg-white dark:bg-gray-800
          shadow-md
          flex flex-col
          overflow-hidden
          transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

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
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

          <NavLink
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
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
            onClick={() => setMenuOpen(false)}
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
            onClick={() => setMenuOpen(false)}
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
            onClick={() => setMenuOpen(false)}
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
            onClick={() => setMenuOpen(false)}
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
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">

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
            px-4 md:px-8
          "
        >

          <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-2xl text-gray-800 dark:text-white"
            aria-label="Open menu"
          >
            ☰
          </button>

          <h2 className="font-bold text-base sm:text-xl text-black dark:text-white">
            Welcome, {teacher?.name || "Teacher"}
          </h2>
        </div>

          {/* Header Right Side */}
          <div className="flex items-center gap-4">

            <ThemeToggle />

            <button className="text-2xl">
              🔔
            </button>

          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default Layout