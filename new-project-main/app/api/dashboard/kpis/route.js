import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Driver from "@/lib/models/Driver"
import Route from "@/lib/models/Route"
import Order from "@/lib/models/Order"
import Simulation from "@/lib/models/Simulation"
import { verifyToken } from "@/lib/auth"

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

    // Get latest simulation results or calculate from current data
    const latestSimulation = await Simulation.findOne().sort({ createdAt: -1 })

    if (latestSimulation) {
      // Return data from latest simulation
      const drivers = await Driver.countDocuments()
      const routes = await Route.countDocuments()
      const orders = await Order.countDocuments()

      return NextResponse.json({
        ...latestSimulation.results,
        active_drivers: drivers,
        active_routes: routes,
        total_orders: orders,
      })
    }

    // Calculate basic KPIs from current data
    const drivers = await Driver.find({})
    const routes = await Route.find({})
    const orders = await Order.find({})

    // Mock calculation for demo purposes
    const totalValue = orders.reduce((sum, order) => sum + order.value_rs, 0)
    const onTimeOrders = Math.floor(orders.length * 0.85) // 85% on-time rate
    const lateOrders = orders.length - onTimeOrders

    const mockKPIs = {
      total_profit: Math.round(totalValue * 0.7), // 70% profit margin
      efficiency_score: 85.0,
      on_time_deliveries: onTimeOrders,
      late_deliveries: lateOrders,
      total_fuel_cost: Math.round(totalValue * 0.15), // 15% fuel cost
      total_orders: orders.length,
      active_drivers: drivers.length,
      active_routes: routes.length,
    }

    return NextResponse.json(mockKPIs)
  } catch (error) {
    console.error("Dashboard KPIs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
