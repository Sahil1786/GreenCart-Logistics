import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Driver from "@/lib/models/Driver"
import Route from "@/lib/models/Route"
import Order from "@/lib/models/Order"
import Simulation from "@/lib/models/Simulation"
import { SimulationEngine } from "@/lib/simulation-engine"
import { verifyToken } from "@/lib/auth"

export async function POST(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await connectDB()

    const { drivers_count, start_time, max_hours_per_day } = await request.json()

    // Validate inputs
    if (!drivers_count || !start_time || !max_hours_per_day) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    if (drivers_count <= 0) {
      return NextResponse.json({ error: "Driver count must be positive" }, { status: 400 })
    }

    if (max_hours_per_day <= 0 || max_hours_per_day > 24) {
      return NextResponse.json({ error: "Max hours per day must be between 1 and 24" }, { status: 400 })
    }

    // Fetch data from database
    const drivers = await Driver.find({}).limit(drivers_count)
    const routes = await Route.find({})
    const orders = await Order.find({})

    if (drivers.length < drivers_count) {
      return NextResponse.json(
        { error: `Only ${drivers.length} drivers available, requested ${drivers_count}` },
        { status: 400 },
      )
    }

    // Run simulation
    const engine = new SimulationEngine(drivers, routes, orders)
    const result = engine.runSimulation({
      drivers_count,
      start_time,
      max_hours_per_day,
    })

    // Save simulation results
    const simulation = new Simulation({
      inputs: { drivers_count, start_time, max_hours_per_day },
      results: result.kpis,
    })
    await simulation.save()

    return NextResponse.json({
      success: true,
      simulation_id: simulation._id,
      inputs: { drivers_count, start_time, max_hours_per_day },
      results: result.kpis,
    })
  } catch (error) {
    console.error("Simulation error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await connectDB()

    // Get simulation history
    const simulations = await Simulation.find({}).sort({ createdAt: -1 }).limit(10)

    return NextResponse.json({
      success: true,
      simulations,
    })
  } catch (error) {
    console.error("Get simulations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
