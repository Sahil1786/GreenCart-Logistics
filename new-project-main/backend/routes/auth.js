const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const router = express.Router()

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" })
    }

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Server error during login" })
  }
})

module.exports = router
