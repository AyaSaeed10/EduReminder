import { useEffect, useState } from "react"
import { API_URL } from "../services/api"
function Settings() {
  const [retentionDays, setRetentionDays] =
    useState("30")

  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
            const response = await fetch(
        `${API_URL}/api/settings`,
        {
            credentials: "include",
        }
        )

        if (!response.ok) {
          throw new Error("Failed to load settings")
        }

        const data = await response.json()

        setRetentionDays(
          data.notificationRetentionDays === null
            ? "never"
            : String(data.notificationRetentionDays)
        )
      } catch (error) {
        console.error(error)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    try {
      setMessage("")

      const value =
        retentionDays === "never"
          ? null
          : Number(retentionDays)

     const response = await fetch(
        `${API_URL}/api/settings`,
        {
            method: "PUT",

            headers: {
            "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
            notificationRetentionDays: value,
            }),
        }
        )

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      setMessage("Settings saved successfully")
    } catch (error) {
      console.error(error)
      setMessage("Failed to save settings")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Settings
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-8">
         Manage your EduReminder preferences
      </p>

        <div className="
        bg-white dark:bg-slate-800
        border border-gray-200 dark:border-slate-700
        rounded-xl p-6 shadow
        ">   
     <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        Notification History
     </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-5">
        Choose how long notifications should remain before they are
        automatically deleted.
        </p>

        <label className="block font-bold mb-2 text-gray-900 dark:text-white">
          Automatically delete notifications
        </label>

        <select
        value={retentionDays}
        onChange={(e) => setRetentionDays(e.target.value)}
        className="
            w-full max-w-md
            border border-gray-300 dark:border-slate-600
            rounded-lg px-3 py-2
            bg-white dark:bg-slate-700
            text-gray-900 dark:text-white
        "
        >
        <option value="never">Never</option>
        <option value="7">After 7 days</option>
        <option value="30">After 30 days</option>
        <option value="90">After 90 days</option>
        </select>

        <div className="mt-5">
          <button
            onClick={handleSave}
            className="bg-purple-700 text-white font-bold
                       px-5 py-2 rounded-lg hover:bg-purple-800"
          >
            Save Settings
          </button>
        </div>

        {message && (
          <p className="mt-4 font-semibold text-gray-900 dark:text-white">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default Settings