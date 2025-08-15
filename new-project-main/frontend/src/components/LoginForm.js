"use client"

import { useState } from "react"

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      // Create fake token and user data
      const fakeToken = "fake-jwt-token-" + Date.now()
      const fakeUserData = {
        id: 1,
        username: username || "admin",
        role: "admin",
      }

      onLogin(fakeToken, fakeUserData)
      setIsLoading(false)
    }, 500) // Small delay to simulate API call
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <div className="logo-icon">🚛</div>
            <h1>GreenCart Logistics</h1>
          </div>
          <p>Delivery Simulation & KPI Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter any username"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter any password"
              className="form-input"
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-info">
          <p>🔓 Demo Mode: Enter any credentials to access the dashboard</p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
