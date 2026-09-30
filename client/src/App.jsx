import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"

import Dashboard from "./pages/Dashboard"
import Calendar from "./pages/Calendar"
import Students from "./pages/Students"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Pages without Sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Pages with Sidebar + Header */}
        <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/calendar"
            element={<Calendar />}
          />

          <Route
            path="/students"
            element={<Students />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App