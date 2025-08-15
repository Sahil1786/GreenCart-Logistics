import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Driver from "@/lib/models/Driver"
import Route from "@/lib/models/Route"
import Order from "@/lib/models/Order"
import User from "@/lib/models/User"
import { hashPassword } from "@/lib/auth"
import { seedDatabase } from "@/scripts/seed-database"

export async function POST(request) {
  try {
    await connectDB()

    // Create admin user
    const existingAdmin = await User.findOne({ username: "admin" })
    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin123")
      await User.create({
        username: "admin",
        password: hashedPassword,
        role: "admin",
      })
      console.log("Admin user created")
    }

    // Fetch CSV data
    const csvData = await seedDatabase()

    // Clear existing data
    await Driver.deleteMany({})
    await Route.deleteMany({})
    await Order.deleteMany({})

    // Seed drivers
    if (csvData.drivers.length > 0) {
      const driversToInsert = csvData.drivers.map((driver) => ({
        name: driver.name,
        shift_hours: Number.parseInt(driver.shift_hours) || 8,
        past_week_hours: driver.past_week_hours || "8|8|8|8|8|8|8",
        current_fatigue: false,
      }))
      await Driver.insertMany(driversToInsert)
      console.log(`Inserted ${driversToInsert.length} drivers`)
    }

    // Seed routes
    if (csvData.routes.length > 0) {
      const routesToInsert = csvData.routes.map((route) => ({
        route_id: Number.parseInt(route.route_id) || Math.floor(Math.random() * 1000),
        distance_km: Number.parseInt(route.distance_km) || 10,
        traffic_level: route.traffic_level || "Medium",
        base_time_min: Number.parseInt(route.base_time_min) || 30,
      }))
      await Route.insertMany(routesToInsert)
      console.log(`Inserted ${routesToInsert.length} routes`)
    }

    // Seed orders
    if (csvData.orders.length > 0) {
      const ordersToInsert = csvData.orders.map((order) => ({
        order_id: order.order_id || `ORD${Math.floor(Math.random() * 10000)}`,
        value_rs: Number.parseInt(order.value_rs) || 500,
        route_id: Number.parseInt(order.route_id) || 1,
        delivery_time: order.delivery_time || "12:00",
        status: "pending",
      }))
      await Order.insertMany(ordersToInsert)
      console.log(`Inserted ${ordersToInsert.length} orders`)
    }

    // Add some mock data if CSV data is empty
    if (csvData.drivers.length === 0) {
      await Driver.insertMany([
        { name: "Rajesh Kumar", shift_hours: 8, past_week_hours: "8|7|9|8|6|8|7", current_fatigue: false },
        { name: "Priya Sharma", shift_hours: 6, past_week_hours: "6|6|8|7|5|6|6", current_fatigue: false },
        { name: "Amit Singh", shift_hours: 10, past_week_hours: "10|9|11|8|9|10|8", current_fatigue: true },
      ])
    }

    if (csvData.routes.length === 0) {
      await Route.insertMany([
        { route_id: 101, distance_km: 15, traffic_level: "Medium", base_time_min: 45 },
        { route_id: 102, distance_km: 22, traffic_level: "High", base_time_min: 88 },
        { route_id: 103, distance_km: 8, traffic_level: "Low", base_time_min: 25 },
      ])
    }

    if (csvData.orders.length === 0) {
      await Order.insertMany([
        { order_id: "ORD001", value_rs: 1250, route_id: 101, delivery_time: "14:30", status: "pending" },
        { order_id: "ORD002", value_rs: 850, route_id: 102, delivery_time: "16:45", status: "pending" },
        { order_id: "ORD003", value_rs: 2100, route_id: 103, delivery_time: "11:15", status: "pending" },
      ])
    }

    const counts = {
      drivers: await Driver.countDocuments(),
      routes: await Route.countDocuments(),
      orders: await Order.countDocuments(),
      users: await User.countDocuments(),
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      counts,
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json(
      {
        error: error.message || "Seeding failed",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
