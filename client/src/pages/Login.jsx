import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ThemeToggle from "../components/ThemeToggle"
import { API_URL } from "../services/api"
function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    setError("")

    if (!email || !password) {
      setError("Please enter your email and password")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
      `${API_URL}/api/auth/login`,
      {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          // Important for our JWT cookie
          credentials: "include",

          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Login failed")
        return
      }

      // Login successful
      navigate("/dashboard")

    } catch (error) {
      console.error("Login error:", error)
      setError("Could not connect to the server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F7F3EB] dark:bg-gray-900 flex items-center justify-center transition-colors">

      {/* Dark / Light Mode */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-2xl shadow-md transition-colors">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-purple-700 dark:text-purple-400">
          EduReminder
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mt-2 font-medium">
          Teacher Login
        </p>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="mt-8">
            <label className="block text-black dark:text-white font-bold mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@email.com"
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
                focus:ring-2
                focus:ring-purple-200
                dark:focus:ring-purple-800
                transition
              "
            />
          </div>

          {/* Password */}
          <div className="mt-5">
            <label className="block text-black dark:text-white font-bold mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
                focus:ring-2
                focus:ring-purple-200
                dark:focus:ring-purple-800
                transition
              "
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-red-600 font-semibold">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              mt-7
              bg-purple-700
              text-white
              font-bold
              py-3
              rounded-lg
              hover:bg-purple-800
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 dark:text-gray-300 mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-700 dark:text-purple-400 font-bold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login