import { useEffect, useState } from "react"
import { API_URL } from "../services/api"

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getNotifications = async () => {
      try {
      const response = await fetch(
      `${API_URL}/api/notifications`,
      {
        credentials: "include",
      }
    )

        const data = await response.json()

        if (response.ok) {
          setNotifications(data)
        }

      } catch (error) {
        console.error(
          "Failed to get notifications:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    getNotifications()
  }, [])


  const markAsRead = async (id) => {
    try {
          const response = await fetch(
      `${API_URL}/api/notifications/${id}/read`,
      {
        method: "PUT",
        credentials: "include",
      }
    )

      if (!response.ok) return

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      )

    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      )
    }
  }
const deleteNotification = async (id) => {
  try {
    const response = await fetch(
    `${API_URL}/api/notifications/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  )

    if (!response.ok) {
      throw new Error("Failed to delete notification")
    }

    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== id)
    )
  } catch (error) {
    console.error(error)
  }
}
const markAllAsRead = async () => {
  try {
    const response = await fetch(
    `${API_URL}/api/notifications/read-all`,
    {
      method: "PUT",
      credentials: "include",
    }
  )

    if (!response.ok) {
      throw new Error("Failed to mark notifications as read")
    }

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    )
  } catch (error) {
    console.error(error)
  }
}
const deleteAllNotifications = async () => {
  try {
    const response = await fetch(
    `${API_URL}/api/notifications`,
    {
      method: "DELETE",
      credentials: "include",
    }
  )

    if (!response.ok) {
      throw new Error("Failed to delete notifications")
    }

    setNotifications([])
  } catch (error) {
    console.error(error)
  }
}

  return (
    <div>

      <div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-3xl font-bold text-black dark:text-white">
      Notifications
    </h1>

    <p className="text-gray-600 dark:text-gray-300 mt-1">
      Manage your lesson reminders
    </p>

   
  </div>

  {notifications.length > 0 && (
    <div className="flex gap-3">
      <button
        onClick={markAllAsRead}
        className="px-4 py-2 rounded-lg border border-purple-700
                   text-purple-700 font-bold"
      >
        Mark all as read
      </button>

      <button
        onClick={deleteAllNotifications}
        className="px-4 py-2 rounded-lg bg-red-600
                   text-white font-bold"
      >
        Delete all
      </button>
    </div>
  )}
</div>


      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">
          Loading notifications...
        </p>

      ) : notifications.length === 0 ? (

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-10 text-center">

          <div className="text-4xl">
            🔔
          </div>

          <h2 className="mt-4 text-xl font-bold text-black dark:text-white">
            No notifications yet
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Lesson reminders will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {notifications.map((notification) => (

            <div
              key={notification._id}
              className={`
                bg-white
                dark:bg-gray-800
                rounded-xl
                shadow-sm
                p-5
                border-l-4
                ${
                  notification.read
                    ? "border-gray-300"
                    : "border-purple-700"
                }
              `}
            >

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="font-bold text-black dark:text-white">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>
                </div>


               <div className="flex items-center gap-4">
              {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="font-bold text-purple-700 hover:underline"
                  >
                    Mark as read
                  </button>
              )}

                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="font-bold text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  )
}

export default Notifications