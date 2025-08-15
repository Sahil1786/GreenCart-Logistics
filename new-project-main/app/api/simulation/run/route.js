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

    const { available_drivers, start_time, max_hours_per_driver } = await request.json()

    // Validate inputs
    if (!available_drivers || !start_time || !max_hours_per_driver) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    if (available_drivers <= 0) {
      return NextResponse.json({ error: "Driver count must be positive" }, { status: 400 })
    }

    if (max_hours_per_driver <= 0 || max_hours_per_driver > 24) {
      return NextResponse.json({ error: "Max hours per driver must be between 1 and 24" }, { status: 400 })
    }

    // Fetch data from database
    const drivers = await Driver.find({}).limit(available_drivers)
    const routes = await Route.find({})
    const orders = await Order.find({})

    if (drivers.length < available_drivers) {
      return NextResponse.json(
        { error: `Only ${drivers.length} drivers available, requested ${available_drivers}` },
        { status: 400 },
      )
    }

    // Run simulation
    const engine = new SimulationEngine(drivers, routes, orders)
    const result = engine.runSimulation({
      drivers_count: available_drivers,
      start_time,
      max_hours_per_day: max_hours_per_driver,
    })

    // Add additional fields expected by frontend
    const enhancedResults = {
      ...result.kpis,
      total_penalties: result.kpis.late_penalties,
      total_bonuses: result.kpis.high_value_bonuses,
      orders_processed: result.kpis.total_deliveries,
    }

    // Save simulation results
    const simulation = new Simulation({
      inputs: {
        drivers_count: available_drivers,
        start_time,
        max_hours_per_day: max_hours_per_driver,
      },
      results: enhancedResults,
    })
    await simulation.save()

    return NextResponse.json({
      success: true,
      simulation_id: simulation._id,
      inputs: { available_drivers, start_time, max_hours_per_driver },
      results: enhancedResults,
    })
  } catch (error) {
    console.error("Simulation error:", error)
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        message: error.message || "Simulation failed. Please try again.",
      },
      { status: 500 },
    )
  }
}
