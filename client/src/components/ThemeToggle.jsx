import { useTheme } from "../context/ThemeContext"

function ThemeToggle() {

  const { darkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="
        px-4 py-2
        rounded-lg
        bg-purple-100
        dark:bg-gray-700
        text-purple-700
        dark:text-white
        font-bold
        hover:bg-purple-200
        dark:hover:bg-gray-600
        transition
      "
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  )
}

export default ThemeToggle