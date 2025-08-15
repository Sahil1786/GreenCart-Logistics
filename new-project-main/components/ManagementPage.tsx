"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Route, Package, Plus, Edit, Trash2 } from "lucide-react"

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState("drivers")

  // Mock data - in real app, this would come from API
  const mockDrivers = [
    { id: 1, name: "Rajesh Kumar", shift_hours: 8, past_week_hours: [8, 7, 9, 8, 6, 8, 7], status: "active" },
    { id: 2, name: "Priya Sharma", shift_hours: 6, past_week_hours: [6, 6, 8, 7, 5, 6, 6], status: "active" },
    { id: 3, name: "Amit Singh", shift_hours: 10, past_week_hours: [10, 9, 11, 8, 9, 10, 8], status: "fatigued" },
  ]

  const mockRoutes = [
    { id: 1, route_id: 101, distance_km: 15, traffic_level: "Medium", base_time_min: 45 },
    { id: 2, route_id: 102, distance_km: 22, traffic_level: "High", base_time_min: 88 },
    { id: 3, route_id: 103, distance_km: 8, traffic_level: "Low", base_time_min: 25 },
  ]

  const mockOrders = [
    { id: 1, order_id: "ORD001", value_rs: 1250, route_id: 101, delivery_time: "14:30", status: "delivered" },
    { id: 2, order_id: "ORD002", value_rs: 850, route_id: 102, delivery_time: "16:45", status: "pending" },
    { id: 3, order_id: "ORD003", value_rs: 2100, route_id: 103, delivery_time: "11:15", status: "delivered" },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Drivers
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            Routes
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Driver Management</CardTitle>
                  <CardDescription>Manage your delivery drivers and their schedules</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Driver
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{driver.name}</h3>
                        <p className="text-sm text-muted-foreground">Current shift: {driver.shift_hours} hours</p>
                        <p className="text-xs text-muted-foreground">
                          Week avg: {(driver.past_week_hours.reduce((a, b) => a + b, 0) / 7).toFixed(1)} hours/day
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={driver.status === "active" ? "default" : "destructive"}>{driver.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Route Management</CardTitle>
                  <CardDescription>Configure delivery routes and traffic conditions</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Route
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRoutes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Route className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Route #{route.route_id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {route.distance_km} km • {route.base_time_min} min base time
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          route.traffic_level === "Low"
                            ? "default"
                            : route.traffic_level === "Medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {route.traffic_level} Traffic
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>Track and manage delivery orders</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{order.order_id}</h3>
                        <p className="text-sm text-muted-foreground">
                          ₹{order.value_rs} • Route #{order.route_id} • {order.delivery_time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
