"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, MoreVertical, History, MessageSquare } from "lucide-react"
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
import DriverForm from "@/components/driver-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DriverTripsModal from "@/components/driver-trips-modal"

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isTripsModalOpen, setIsTripsModalOpen] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const driversData = getDrivers()
    const trucksData = getTrucks()
    setDrivers(driversData)
    setTrucks(trucksData)
  }, [])

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter ? driver.status === statusFilter : true
    return matchesSearch && matchesStatus
  })

  const handleAddDriver = (newDriver: Driver) => {
    setDrivers([...drivers, newDriver])
    setIsFormOpen(false)
  }

  const handleUpdateDriver = (updatedDriver: Driver) => {
    setDrivers(drivers.map((driver) => (driver.id === updatedDriver.id ? updatedDriver : driver)))
    setEditingDriver(null)
    setIsFormOpen(false)
  }

  const handleDeleteDriver = (driverId: string) => {
    setDrivers(drivers.filter((driver) => driver.id !== driverId))
  }

  const handleViewTrips = (driver: Driver) => {
    setSelectedDriver(driver)
    setIsTripsModalOpen(true)
  }

  const getTruckName = (truckId: string | null) => {
    if (!truckId) return "Unassigned"
    const truck = trucks.find((t) => t.id === truckId)
    return truck ? truck.name : "Unknown Truck"
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "on_duty":
        return "bg-green-100 text-green-800"
      case "off_duty":
        return "bg-yellow-100 text-yellow-800"
      case "on_leave":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Drivers</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingDriver(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingDriver ? "Edit Driver" : "Add New Driver"}</DialogTitle>
                <DialogDescription>
                  {editingDriver ? "Update the driver details below." : "Enter the details for the new driver."}
                </DialogDescription>
              </DialogHeader>
              <DriverForm
                driver={editingDriver}
                trucks={trucks}
                onSubmit={editingDriver ? handleUpdateDriver : handleAddDriver}
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
                placeholder="Search drivers..."
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
                <DropdownMenuItem onClick={() => setStatusFilter("on_duty")}>On Duty</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("off_duty")}>Off Duty</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("on_leave")}>On Leave</DropdownMenuItem>
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
            {filteredDrivers.map((driver) => (
              <Card key={driver.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{driver.name}</CardTitle>
                    <Badge variant="outline" className={cn(getStatusBadgeClass(driver.status))}>
                      {formatStatus(driver.status)}
                    </Badge>
                  </div>
                  <CardDescription>ID: {driver.id}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Assigned Truck:</span>
                      <span className="text-sm">{getTruckName(driver.assignedTruckId)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end p-4 pt-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingDriver(driver)
                          setIsFormOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewTrips(driver)}>
                        <History className="mr-2 h-4 w-4" />
                        View Trips
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/40 p-4 font-medium">
              <div className="col-span-4">Driver</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3">Assigned Truck</div>
              <div className="col-span-2 flex justify-end"></div>
            </div>
            {filteredDrivers.map((driver) => (
              <div key={driver.id} className="grid grid-cols-12 items-center border-b p-4">
                <div className="col-span-4">
                  <div className="font-medium">{driver.name}</div>
                  <div className="text-sm text-muted-foreground">ID: {driver.id}</div>
                </div>
                <div className="col-span-3">
                  <Badge variant="outline" className={cn(getStatusBadgeClass(driver.status))}>
                    {formatStatus(driver.status)}
                  </Badge>
                </div>
                <div className="col-span-3">{getTruckName(driver.assignedTruckId)}</div>
                <div className="col-span-2 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingDriver(driver)
                          setIsFormOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewTrips(driver)}>
                        <History className="mr-2 h-4 w-4" />
                        View Trips
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedDriver && (
        <DriverTripsModal
          driverId={selectedDriver.id}
          driverName={selectedDriver.name}
          isOpen={isTripsModalOpen}
          onClose={() => setIsTripsModalOpen(false)}
        />
      )}
    </div>
  )
}
