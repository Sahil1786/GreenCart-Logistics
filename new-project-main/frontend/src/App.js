"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./App.css"
import Dashboard from "./components/Dashboard"
import SimulationPage from "./components/SimulationPage"
import ManagementPage from "./components/ManagementPage"
import LoginForm from "./components/LoginForm"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setIsAuthenticated(false)
    setUser(null)
    setActiveTab("dashboard")
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading GreenCart Logistics...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} apiUrl={API_URL} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🚛</div>
            <h1>GreenCart Logistics</h1>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        <nav className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === "simulation" ? "active" : ""}`}
            onClick={() => setActiveTab("simulation")}
          >
            🛣️ Simulation
          </button>
          <button
            className={`tab-btn ${activeTab === "management" ? "active" : ""}`}
            onClick={() => setActiveTab("management")}
          >
            👥 Management
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === "dashboard" && <Dashboard apiUrl={API_URL} />}
          {activeTab === "simulation" && <SimulationPage apiUrl={API_URL} />}
          {activeTab === "management" && <ManagementPage apiUrl={API_URL} />}
        </div>
      </main>
    </div>
  )
}

export default App
