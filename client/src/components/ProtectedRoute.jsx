import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { API_URL } from "../services/api"
function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            credentials: "include",
          }
        )

        if (response.ok) {
          setAuthenticated(true)
        } else {
          setAuthenticated(false)
        }

      } catch (error) {
        console.error(error)
        setAuthenticated(false)
      }
    }

    checkAuthentication()
  }, [])


  // Still checking cookie
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#F7F3EB] dark:bg-gray-900 flex items-center justify-center">
        <p className="font-bold text-purple-700 dark:text-purple-400">
          Loading...
        </p>
      </div>
    )
  }


  // Not logged in
  if (!authenticated) {
    return <Navigate to="/" replace />
  }


  // Logged in
  return children
}

export default ProtectedRoute