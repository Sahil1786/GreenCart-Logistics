// GreenCart Logistics Business Rules Implementation
export class SimulationEngine {
  constructor(drivers, routes, orders) {
    this.drivers = drivers
    this.routes = routes
    this.orders = orders
  }

  // Main simulation function
  runSimulation(inputs) {
    const { drivers_count, start_time, max_hours_per_day } = inputs

    // Validate inputs
    if (drivers_count <= 0 || drivers_count > this.drivers.length) {
      throw new Error("Invalid driver count")
    }

    if (max_hours_per_day <= 0 || max_hours_per_day > 24) {
      throw new Error("Invalid max hours per day")
    }

    // Select available drivers
    const availableDrivers = this.drivers.slice(0, drivers_count)

    // Reallocate orders to drivers
    const allocatedOrders = this.allocateOrders(availableDrivers, start_time, max_hours_per_day)

    // Calculate KPIs
    const results = this.calculateKPIs(allocatedOrders)

    return {
      allocated_orders: allocatedOrders,
      kpis: results,
    }
  }

  allocateOrders(drivers, startTime, maxHours) {
    const allocatedOrders = []
    const driverWorkHours = drivers.map(() => 0)

    for (const order of this.orders) {
      // Find route for this order
      const route = this.routes.find((r) => r.route_id === order.route_id)
      if (!route) continue

      // Find available driver
      const driverIndex = this.findAvailableDriver(driverWorkHours, route, maxHours)
      if (driverIndex === -1) continue

      // Calculate delivery time based on driver fatigue
      const driver = drivers[driverIndex]
      const deliveryTime = this.calculateDeliveryTime(driver, route, startTime)

      // Update driver work hours
      driverWorkHours[driverIndex] += route.base_time_min / 60

      allocatedOrders.push({
        ...order,
        assigned_driver: driver._id,
        calculated_delivery_time: deliveryTime,
        route_info: route,
      })
    }

    return allocatedOrders
  }

  findAvailableDriver(workHours, route, maxHours) {
    const routeHours = route.base_time_min / 60

    for (let i = 0; i < workHours.length; i++) {
      if (workHours[i] + routeHours <= maxHours) {
        return i
      }
    }
    return -1
  }

  calculateDeliveryTime(driver, route, startTime) {
    let baseTime = route.base_time_min

    // Driver Fatigue Rule: If driver worked >8 hours, 30% speed decrease
    const pastWeekHours = driver.past_week_hours.split("|").map(Number)
    const avgDailyHours = pastWeekHours.reduce((a, b) => a + b, 0) / 7

    if (avgDailyHours > 8) {
      baseTime *= 1.3 // 30% increase in delivery time
    }

    return Math.round(baseTime)
  }

  calculateKPIs(allocatedOrders) {
    let totalProfit = 0
    let onTimeDeliveries = 0
    let lateDeliveries = 0
    let totalFuelCost = 0
    let highValueBonuses = 0
    let latePenalties = 0

    for (const order of allocatedOrders) {
      const route = order.route_info
      let orderProfit = order.value_rs

      // Calculate fuel cost
      let fuelCost = route.distance_km * 5 // Base ₹5/km
      if (route.traffic_level === "High") {
        fuelCost += route.distance_km * 2 // +₹2/km for high traffic
      }
      totalFuelCost += fuelCost

      // Check if delivery is late
      const isLate = order.calculated_delivery_time > route.base_time_min + 10

      if (isLate) {
        // Late Delivery Penalty: ₹50
        orderProfit -= 50
        latePenalties += 50
        lateDeliveries++
      } else {
        onTimeDeliveries++

        // High-Value Bonus: 10% for orders >₹1000 delivered on time
        if (order.value_rs > 1000) {
          const bonus = order.value_rs * 0.1
          orderProfit += bonus
          highValueBonuses += bonus
        }
      }

      // Subtract fuel cost from profit
      orderProfit -= fuelCost
      totalProfit += orderProfit
    }

    // Calculate efficiency score
    const totalDeliveries = onTimeDeliveries + lateDeliveries
    const efficiencyScore = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0

    return {
      total_profit: Math.round(totalProfit),
      efficiency_score: Math.round(efficiencyScore * 100) / 100,
      on_time_deliveries: onTimeDeliveries,
      late_deliveries: lateDeliveries,
      total_fuel_cost: Math.round(totalFuelCost),
      high_value_bonuses: Math.round(highValueBonuses),
      late_penalties: latePenalties,
      total_deliveries: totalDeliveries,
    }
  }
}
