"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const mockDrivers = [
  { id: 1, name: "John Doe", shiftHours: 8, pastWeekHours: [8, 7, 8, 6, 8, 7, 0] },
  { id: 2, name: "Jane Smith", shiftHours: 6, pastWeekHours: [6, 8, 7, 8, 6, 8, 0] },
  { id: 3, name: "Mike Johnson", shiftHours: 9, pastWeekHours: [9, 8, 9, 7, 9, 8, 0] },
]

const mockRoutes = [
  { id: 1, distance: 15, trafficLevel: "Low", baseTime: 45 },
  { id: 2, distance: 22, trafficLevel: "High", baseTime: 88 },
  { id: 3, distance: 8, trafficLevel: "Medium", baseTime: 25 },
]

const mockOrders = [
  { id: 1, value: 850, routeId: 1, deliveryTime: "45:30" },
  { id: 2, value: 1200, routeId: 2, deliveryTime: "95:15" },
  { id: 3, value: 650, routeId: 3, deliveryTime: "28:45" },
]

export default function GreenCartApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationInputs, setSimulationInputs] = useState({
    drivers: 3,
    startTime: "09:00",
    maxHours: 8,
  })

  const [drivers, setDrivers] = useState(mockDrivers)
  const [routes, setRoutes] = useState(mockRoutes)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [showAddRoute, setShowAddRoute] = useState(false)
  const [newDriver, setNewDriver] = useState({ name: "", shiftHours: 8 })
  const [newRoute, setNewRoute] = useState({ distance: 0, trafficLevel: "Low", baseTime: 0 })

  // Simple login - any credentials work
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password) {
      setIsLoggedIn(true)
    }
  }

  // Calculate KPIs
  const calculateKPIs = () => {
    let totalProfit = 0
    let onTimeDeliveries = 0
    let totalFuelCost = 0

    mockOrders.forEach((order) => {
      const route = mockRoutes.find((r) => r.id === order.routeId)
      if (!route) return

      const [deliveryMin, deliverySec] = order.deliveryTime.split(":").map(Number)
      const actualDeliveryTime = deliveryMin + deliverySec / 60
      const expectedTime = route.baseTime

      // Calculate fuel cost
      let fuelCost = route.distance * 5 // Base ₹5/km
      if (route.trafficLevel === "High") {
        fuelCost += route.distance * 2 // +₹2/km for high traffic
      }
      totalFuelCost += fuelCost

      // Calculate profit
      let orderProfit = order.value - fuelCost

      // Late delivery penalty
      if (actualDeliveryTime > expectedTime + 10) {
        orderProfit -= 50 // ₹50 penalty
      } else {
        onTimeDeliveries++
        // High-value bonus
        if (order.value > 1000) {
          orderProfit += order.value * 0.1 // 10% bonus
        }
      }

      totalProfit += orderProfit
    })

    const efficiencyScore = (onTimeDeliveries / mockOrders.length) * 100

    return {
      totalProfit: Math.round(totalProfit),
      efficiencyScore: Math.round(efficiencyScore),
      onTimeDeliveries,
      totalDeliveries: mockOrders.length,
      totalFuelCost: Math.round(totalFuelCost),
    }
  }

  const runSimulation = async () => {
    setIsSimulating(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Calculate new KPIs based on simulation inputs
    const driverCount = simulationInputs.drivers
    const maxHours = simulationInputs.maxHours

    // Simulate different scenarios based on inputs
    let totalProfit = 0
    let onTimeDeliveries = 0
    let totalFuelCost = 0

    // Apply driver fatigue if max hours > 8
    const fatigueMultiplier = maxHours > 8 ? 0.7 : 1.0 // 30% speed decrease

    mockOrders.forEach((order) => {
      const route = mockRoutes.find((r) => r.id === order.routeId)
      if (!route) return

      // Adjust delivery time based on driver count and fatigue
      const baseTime = route.baseTime / fatigueMultiplier
      const adjustedTime = baseTime * (3 / driverCount) // More drivers = faster delivery

      const [deliveryMin] = order.deliveryTime.split(":").map(Number)
      const simulatedDeliveryTime = Math.max(adjustedTime, deliveryMin * 0.8)

      // Calculate fuel cost
      let fuelCost = route.distance * 5
      if (route.trafficLevel === "High") {
        fuelCost += route.distance * 2
      }
      totalFuelCost += fuelCost

      // Calculate profit
      let orderProfit = order.value - fuelCost

      // Late delivery penalty
      if (simulatedDeliveryTime > route.baseTime + 10) {
        orderProfit -= 50
      } else {
        onTimeDeliveries++
        if (order.value > 1000) {
          orderProfit += order.value * 0.1
        }
      }

      totalProfit += orderProfit
    })

    const efficiencyScore = (onTimeDeliveries / mockOrders.length) * 100

    setSimulationResults({
      totalProfit: Math.round(totalProfit),
      efficiencyScore: Math.round(efficiencyScore),
      onTimeDeliveries,
      totalDeliveries: mockOrders.length,
      totalFuelCost: Math.round(totalFuelCost),
      driverCount,
      maxHours,
    })

    setIsSimulating(false)
  }

  const addDriver = () => {
    if (newDriver.name) {
      const driver = {
        id: drivers.length + 1,
        name: newDriver.name,
        shiftHours: newDriver.shiftHours,
        pastWeekHours: [8, 7, 8, 6, 8, 7, 0], // Default week
      }
      setDrivers([...drivers, driver])
      setNewDriver({ name: "", shiftHours: 8 })
      setShowAddDriver(false)
    }
  }

  const removeDriver = (id: number) => {
    setDrivers(drivers.filter((d) => d.id !== id))
  }

  const addRoute = () => {
    if (newRoute.distance > 0 && newRoute.baseTime > 0) {
      const route = {
        id: routes.length + 1,
        distance: newRoute.distance,
        trafficLevel: newRoute.trafficLevel,
        baseTime: newRoute.baseTime,
      }
      setRoutes([...routes, route])
      setNewRoute({ distance: 0, trafficLevel: "Low", baseTime: 0 })
      setShowAddRoute(false)
    }
  }

  const removeRoute = (id: number) => {
    setRoutes(routes.filter((r) => r.id !== id))
  }

  const kpis = calculateKPIs()

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20"></div>
        <div className="relative z-10 w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                GreenCart Logistics
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Delivery Simulation & KPI Dashboard
              </CardDescription>
              <div className="text-sm text-gray-500 mt-2">Eco-friendly delivery operations management</div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-green-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-green-500 transition-colors"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold text-lg transition-all duration-200 transform hover:scale-105"
                >
                  Sign In to Dashboard
                </Button>
              </form>
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 text-center">
                  <span className="font-semibold">Demo Access:</span> Enter any username and password to explore the
                  system
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">GreenCart Logistics</h1>
            <Button onClick={() => setIsLoggedIn(false)} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹{kpis.totalProfit}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{kpis.efficiencyScore}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">On-time Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {kpis.onTimeDeliveries}/{kpis.totalDeliveries}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Fuel Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">₹{kpis.totalFuelCost}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => {
                    const route = mockRoutes.find((r) => r.id === order.routeId)
                    const [min, sec] = order.deliveryTime.split(":").map(Number)
                    const actualTime = min + sec / 60
                    const isLate = actualTime > (route?.baseTime || 0) + 10

                    return (
                      <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">Order #{order.id}</span>
                          <span className="ml-2 text-gray-600">₹{order.value}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{order.deliveryTime}</span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              isLate ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {isLate ? "Late" : "On Time"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Run Simulation</CardTitle>
                <CardDescription>Simulate delivery operations with different parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Available Drivers</label>
                    <Input
                      type="number"
                      value={simulationInputs.drivers}
                      onChange={(e) =>
                        setSimulationInputs({ ...simulationInputs, drivers: Number.parseInt(e.target.value) })
                      }
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <Input
                      type="time"
                      value={simulationInputs.startTime}
                      onChange={(e) => setSimulationInputs({ ...simulationInputs, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Hours/Day</label>
                    <Input
                      type="number"
                      value={simulationInputs.maxHours}
                      onChange={(e) =>
                        setSimulationInputs({ ...simulationInputs, maxHours: Number.parseInt(e.target.value) })
                      }
                      min="4"
                      max="12"
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={runSimulation} disabled={isSimulating}>
                  {isSimulating ? "Running Simulation..." : "Run Simulation"}
                </Button>

                {simulationResults && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-3">Simulation Results</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">₹{simulationResults.totalProfit}</div>
                        <div className="text-sm text-gray-600">Total Profit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{simulationResults.efficiencyScore}%</div>
                        <div className="text-sm text-gray-600">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {simulationResults.onTimeDeliveries}/{simulationResults.totalDeliveries}
                        </div>
                        <div className="text-sm text-gray-600">On-time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">₹{simulationResults.totalFuelCost}</div>
                        <div className="text-sm text-gray-600">Fuel Cost</div>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-3">
                      Simulation with {simulationResults.driverCount} drivers working max {simulationResults.maxHours}{" "}
                      hours/day
                    </p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">
                    Simulation will calculate new KPIs based on your inputs using company rules: Late delivery penalty
                    (₹50), Driver fatigue (30% speed decrease), High-value bonus (10%), and dynamic fuel costs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Driver Management</CardTitle>
                  <CardDescription>Manage your delivery drivers and their schedules</CardDescription>
                </div>
                <Button onClick={() => setShowAddDriver(true)} className="bg-green-600 hover:bg-green-700">
                  Add Driver
                </Button>
              </CardHeader>
              <CardContent>
                {showAddDriver && (
                  <div className="mb-6 p-4 border rounded-lg bg-green-50">
                    <h3 className="font-medium mb-3">Add New Driver</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Driver Name</label>
                        <Input
                          value={newDriver.name}
                          onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                          placeholder="Enter driver name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Shift Hours</label>
                        <Input
                          type="number"
                          value={newDriver.shiftHours}
                          onChange={(e) => setNewDriver({ ...newDriver, shiftHours: Number.parseInt(e.target.value) })}
                          min="4"
                          max="12"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button onClick={addDriver} size="sm">
                        Add Driver
                      </Button>
                      <Button onClick={() => setShowAddDriver(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {drivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{driver.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{driver.name}</h3>
                          <p className="text-sm text-gray-600">Current shift: {driver.shiftHours} hours</p>
                          <p className="text-sm text-gray-500">
                            Total weekly: {driver.pastWeekHours.reduce((a, b) => a + b, 0)} hours
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium mb-2">Weekly Schedule</p>
                          <div className="flex space-x-1">
                            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                              <div key={i} className="text-center">
                                <div className="text-xs text-gray-500 mb-1">{day}</div>
                                <div
                                  className={`w-8 h-8 rounded text-xs flex items-center justify-center font-medium ${
                                    driver.pastWeekHours[i] > 8
                                      ? "bg-red-100 text-red-800"
                                      : driver.pastWeekHours[i] > 0
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {driver.pastWeekHours[i]}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => removeDriver(driver.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Route Management</CardTitle>
                  <CardDescription>Manage delivery routes and traffic conditions</CardDescription>
                </div>
                <Button onClick={() => setShowAddRoute(true)} className="bg-blue-600 hover:bg-blue-700">
                  Add Route
                </Button>
              </CardHeader>
              <CardContent>
                {showAddRoute && (
                  <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-medium mb-3">Add New Route</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Distance (km)</label>
                        <Input
                          type="number"
                          value={newRoute.distance}
                          onChange={(e) => setNewRoute({ ...newRoute, distance: Number.parseInt(e.target.value) })}
                          placeholder="Enter distance"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Traffic Level</label>
                        <select
                          className="w-full h-10 px-3 border border-gray-300 rounded-md"
                          value={newRoute.trafficLevel}
                          onChange={(e) => setNewRoute({ ...newRoute, trafficLevel: e.target.value })}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Base Time (min)</label>
                        <Input
                          type="number"
                          value={newRoute.baseTime}
                          onChange={(e) => setNewRoute({ ...newRoute, baseTime: Number.parseInt(e.target.value) })}
                          placeholder="Enter base time"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button onClick={addRoute} size="sm">
                        Add Route
                      </Button>
                      <Button onClick={() => setShowAddRoute(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold">#{route.id}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">Route #{route.id}</h3>
                          <p className="text-sm text-gray-600">
                            {route.distance} km • {route.baseTime} min base time
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                route.trafficLevel === "High"
                                  ? "bg-red-100 text-red-800"
                                  : route.trafficLevel === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {route.trafficLevel} Traffic
                            </span>
                            <span className="text-xs text-gray-500">
                              Fuel: ₹{route.distance * 5 + (route.trafficLevel === "High" ? route.distance * 2 : 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Estimated Cost</div>
                          <div className="font-semibold">
                            ₹{route.distance * 5 + (route.trafficLevel === "High" ? route.distance * 2 : 0)}
                          </div>
                        </div>
                        <Button
                          onClick={() => removeRoute(route.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
