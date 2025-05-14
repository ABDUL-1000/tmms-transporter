"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getTrucks, getDrivers } from "@/lib/data"
import type { Truck, Driver } from "@/lib/types"
import { cn } from "@/lib/utils"
import TruckForm from "@/components/truck-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const trucksData = getTrucks()
    const driversData = getDrivers()
    setTrucks(trucksData)
    setDrivers(driversData)
  }, [])

  const filteredTrucks = trucks.filter((truck) => {
    const matchesSearch =
      truck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter ? truck.status === statusFilter : true
    return matchesSearch && matchesStatus
  })

  const handleAddTruck = (newTruck: Truck) => {
    setTrucks([...trucks, newTruck])
    setIsFormOpen(false)
  }

  const handleUpdateTruck = (updatedTruck: Truck) => {
    setTrucks(trucks.map((truck) => (truck.id === updatedTruck.id ? updatedTruck : truck)))
    setEditingTruck(null)
    setIsFormOpen(false)
  }

  const handleDeleteTruck = (truckId: string) => {
    setTrucks(trucks.filter((truck) => truck.id !== truckId))
  }

  const getDriverName = (driverId: string | null) => {
    if (!driverId) return "Unassigned"
    const driver = drivers.find((d) => d.id === driverId)
    return driver ? driver.name : "Unknown Driver"
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "moving":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      case "idle":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Trucks</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTruck(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Truck
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingTruck ? "Edit Truck" : "Add New Truck"}</DialogTitle>
                <DialogDescription>
                  {editingTruck ? "Update the truck details below." : "Enter the details for the new truck."}
                </DialogDescription>
              </DialogHeader>
              <TruckForm
                truck={editingTruck}
                drivers={drivers}
                onSubmit={editingTruck ? handleUpdateTruck : handleAddTruck}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search trucks..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("moving")}>Moving</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("idle")}>Idle</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("maintenance")}>Maintenance</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Tabs
            defaultValue="grid"
            className="w-full md:w-auto"
            onValueChange={(value) => setViewType(value as "grid" | "list")}
          >
            <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewType === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTrucks.map((truck) => (
              <Card key={truck.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{truck.name}</CardTitle>
                    <Badge variant="outline" className={cn(getStatusBadgeClass(truck.status))}>
                      {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>ID: {truck.id}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Driver:</span>
                      <span className="text-sm">{getDriverName(truck.driverId)}</span>
                    </div>
                    {truck.route && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">From:</span>
                          <span className="text-sm">{truck.route.originName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">To:</span>
                          <span className="text-sm">{truck.route.destinationName}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingTruck(truck)
                      setIsFormOpen(true)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteTruck(truck.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/40 p-4 font-medium">
              <div className="col-span-3">Truck</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Driver</div>
              <div className="col-span-2">Route</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {filteredTrucks.map((truck) => (
              <div key={truck.id} className="grid grid-cols-12 items-center border-b p-4">
                <div className="col-span-3">
                  <div className="font-medium">{truck.name}</div>
                  <div className="text-sm text-muted-foreground">ID: {truck.id}</div>
                </div>
                <div className="col-span-2">
                  <Badge variant="outline" className={cn(getStatusBadgeClass(truck.status))}>
                    {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
                  </Badge>
                </div>
                <div className="col-span-3">{getDriverName(truck.driverId)}</div>
                <div className="col-span-2">
                  {truck.route ? (
                    <div className="text-sm">
                      {truck.route.originName} → {truck.route.destinationName}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No active route</div>
                  )}
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingTruck(truck)
                      setIsFormOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteTruck(truck.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
