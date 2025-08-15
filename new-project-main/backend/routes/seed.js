const express = require("express")
const User = require("../models/User")
const Driver = require("../models/Driver")
const Route = require("../models/Route")
const Order = require("../models/Order")
const router = express.Router()

router.post("/", async (req, res) => {
  try {
    // Create admin user
    const existingUser = await User.findOne({ username: "admin" })
    if (!existingUser) {
      await User.create({
        username: "admin",
        password: "admin123",
        role: "admin",
      })
    }

    // Fetch and seed CSV data
    const csvUrls = {
      drivers: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drivers-bTX8hxyb7R1dM37nrMDpRSrjJ9L0Vu.csv",
      routes: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/routes-yaDcY3yrSNWr69CSfUmtpCv6iFAmOe.csv",
      orders: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orders-geFEpYuijmqB37Bth1tGO53UIo337j.csv",
    }

    // Seed drivers
    const driversResponse = await fetch(csvUrls.drivers)
    const driversText = await driversResponse.text()
    const driversLines = driversText.split("\n").slice(1)

    for (const line of driversLines) {
      if (line.trim()) {
        const [name, shift_hours, past_week_hours] = line.split(",")
        const pastWeekArray = past_week_hours.split("|").map((h) => Number.parseInt(h))

        await Driver.findOneAndUpdate(
          { name: name.trim() },
          {
            name: name.trim(),
            shift_hours: Number.parseInt(shift_hours),
            past_week_hours: pastWeekArray,
          },
          { upsert: true },
        )
      }
    }

    // Seed routes
    const routesResponse = await fetch(csvUrls.routes)
    const routesText = await routesResponse.text()
    const routesLines = routesText.split("\n").slice(1)

    for (const line of routesLines) {
      if (line.trim()) {
        const [route_id, distance_km, traffic_level, base_time_min] = line.split(",")

        await Route.findOneAndUpdate(
          { route_id: Number.parseInt(route_id) },
          {
            route_id: Number.parseInt(route_id),
            distance_km: Number.parseFloat(distance_km),
            traffic_level: traffic_level.trim(),
            base_time_min: Number.parseInt(base_time_min),
          },
          { upsert: true },
        )
      }
    }

    // Seed orders
    const ordersResponse = await fetch(csvUrls.orders)
    const ordersText = await ordersResponse.text()
    const ordersLines = ordersText.split("\n").slice(1)

    for (const line of ordersLines) {
      if (line.trim()) {
        const [order_id, value_rs, route_id, delivery_time] = line.split(",")

        await Order.findOneAndUpdate(
          { order_id: order_id.trim() },
          {
            order_id: order_id.trim(),
            value_rs: Number.parseFloat(value_rs),
            route_id: Number.parseInt(route_id),
            delivery_time: delivery_time.trim(),
          },
          { upsert: true },
        )
      }
    }

    res.json({ message: "Database seeded successfully" })
  } catch (error) {
    console.error("Seeding error:", error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
