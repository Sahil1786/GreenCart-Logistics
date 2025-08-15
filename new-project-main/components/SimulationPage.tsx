"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, TrendingUp, Clock, DollarSign } from "lucide-react"

interface SimulationParams {
  available_drivers: number
  start_time: string
  max_hours_per_driver: number
}

interface SimulationResults {
  total_profit: number
  efficiency_score: number
  on_time_deliveries: number
  late_deliveries: number
  total_fuel_cost: number
  total_penalties: number
  total_bonuses: number
  orders_processed: number
}

export default function SimulationPage() {
  const [params, setParams] = useState<SimulationParams>({
    available_drivers: 8,
    start_time: "09:00",
    max_hours_per_driver: 8,
  })

  const [results, setResults] = useState<SimulationResults | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: keyof SimulationParams, value: string | number) => {
    setParams((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const runSimulation = async () => {
    setIsRunning(true)
    setError("")

    try {
      const response = await fetch("/api/simulation/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data.results)
      } else {
        setError(data.message || "Simulation failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsRunning(false)
    }
  }

  const resetSimulation = () => {
    setResults(null)
    setError("")
    setParams({
      available_drivers: 8,
      start_time: "09:00",
      max_hours_per_driver: 8,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>Configure your delivery simulation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drivers">Available Drivers</Label>
              <Input
                id="drivers"
                type="number"
                min="1"
                max="20"
                value={params.available_drivers}
                onChange={(e) => handleInputChange("available_drivers", Number.parseInt(e.target.value) || 1)}
              />
              <p className="text-xs text-muted-foreground">Number of drivers available for delivery</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-time">Route Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={params.start_time}
                onChange={(e) => handleInputChange("start_time", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">When drivers begin their routes</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-hours">Max Hours per Driver</Label>
              <Input
                id="max-hours"
                type="number"
                min="4"
                max="12"
                value={params.max_hours_per_driver}
                onChange={(e) => handleInputChange("max_hours_per_driver", Number.parseInt(e.target.value) || 8)}
              />
              <p className="text-xs text-muted-foreground">Maximum working hours per driver per day</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={runSimulation} disabled={isRunning} className="flex-1">
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetSimulation}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Rules</CardTitle>
            <CardDescription>GreenCart Logistics operational rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">
                1
              </Badge>
              <div className="text-sm">
                <strong>Late Delivery Penalty:</strong> ₹50 penalty if delivery exceeds base time + 10 minutes
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">
                2
              </Badge>
              <div className="text-sm">
                <strong>Driver Fatigue:</strong> 30% speed decrease next day if driver works &gt;8 hours
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">
                3
              </Badge>
              <div className="text-sm">
                <strong>High-Value Bonus:</strong> 10% bonus for orders &gt;₹1000 delivered on time
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">
                4
              </Badge>
              <div className="text-sm">
                <strong>Fuel Cost:</strong> ₹5/km base + ₹2/km surcharge for high traffic routes
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">
                5
              </Badge>
              <div className="text-sm">
                <strong>Efficiency Score:</strong> (On-time deliveries ÷ Total deliveries) × 100
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {results && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{results.total_profit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">After penalties and bonuses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{results.efficiency_score.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Delivery success rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Deliveries</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{results.on_time_deliveries}</div>
              <p className="text-xs text-muted-foreground">Out of {results.orders_processed} orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Deliveries</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{results.late_deliveries}</div>
              <p className="text-xs text-muted-foreground">₹{results.total_penalties} in penalties</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Financial Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gross Revenue:</span>
                  <span className="font-medium">
                    ₹
                    {(
                      results.total_profit +
                      results.total_penalties +
                      results.total_fuel_cost -
                      results.total_bonuses
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Bonuses Applied:</span>
                  <span className="font-medium">+₹{results.total_bonuses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Penalties Applied:</span>
                  <span className="font-medium">-₹{results.total_penalties.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span>Fuel Costs:</span>
                  <span className="font-medium">-₹{results.total_fuel_cost.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Net Profit:</span>
                  <span className="text-green-600">₹{results.total_profit.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Simulation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Orders Processed:</span>
                  <Badge variant="secondary">{results.orders_processed}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Success Rate:</span>
                  <Badge
                    className={
                      results.efficiency_score >= 80 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {results.efficiency_score.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Profit per Order:</span>
                  <Badge variant="outline">₹{(results.total_profit / results.orders_processed).toFixed(0)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
