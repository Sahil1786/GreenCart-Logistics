import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    console.log("[v0] Attempting to connect to database...")
    await connectDB()
    console.log("[v0] Database connected successfully")

    const { username, password } = await request.json()
    console.log("[v0] Login attempt for username:", username)

    if (!username || !password) {
      console.log("[v0] Missing username or password")
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    console.log("[v0] Searching for user in database...")
    const user = await User.findOne({ username })
    console.log("[v0] User found:", user ? "Yes" : "No")

    if (!user) {
      console.log("[v0] User not found in database")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Verifying password...")
    const isValidPassword = await verifyPassword(password, user.password)
    console.log("[v0] Password valid:", isValidPassword)

    if (!isValidPassword) {
      console.log("[v0] Invalid password")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Generating token...")
    const token = generateToken(user._id, user.username, user.role)

    console.log("[v0] Login successful for user:", username)
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
