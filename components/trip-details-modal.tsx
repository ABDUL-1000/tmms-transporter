"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Package, User, Truck, FileText, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Trip, Customer, Goods, Driver, Truck as TruckType } from "@/lib/types"
import { getCustomerById, getGoodsById, getDriverById, getTruckById } from "@/lib/data"
import { format } from "date-fns"
import TripMap from "@/components/trip-map"

interface TripDetailsModalProps {
  trip: Trip
  isOpen: boolean
  onClose: () => void
}

export default function TripDetailsModal({ trip, isOpen, onClose }: TripDetailsModalProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [goods, setGoods] = useState<Goods | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [truck, setTruck] = useState<TruckType | null>(null)

  useEffect(() => {
    if (trip) {
      const customerData = getCustomerById(trip.customerId)
      const goodsData = getGoodsById(trip.goodsId)
      const driverData = getDriverById(trip.driverId)
      const truckData = getTruckById(trip.truckId)

      setCustomer(customerData || null)
      setGoods(goodsData || null)
      setDriver(driverData || null)
      setTruck(truckData || null)
    }
  }, [trip])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return format(new Date(dateString), "h:mm a")
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Trip Details - {trip.id}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={cn(getStatusBadgeClass(trip.status))}>
                {formatStatus(trip.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(trip.startTime)} at {formatTime(trip.startTime)}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="details">Trip Details</TabsTrigger>
            <TabsTrigger value="customer">Customer Info</TabsTrigger>
            <TabsTrigger value="goods">Goods Info</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-4">
            <div className="h-[400px] w-full rounded-md overflow-hidden">
              <TripMap trip={trip} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Origin</p>
                  <p className="text-sm text-muted-foreground">{trip.route.originName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium">Destination</p>
                  <p className="text-sm text-muted-foreground">{trip.route.destinationName}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Start Date:</span>
                      <span className="text-sm">{formatDate(trip.startTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Start Time:</span>
                      <span className="text-sm">{formatTime(trip.startTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">End Date:</span>
                      <span className="text-sm">{formatDate(trip.endTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">End Time:</span>
                      <span className="text-sm">{formatTime(trip.endTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant="outline" className={cn(getStatusBadgeClass(trip.status))}>
                        {formatStatus(trip.status)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Transport Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Distance:</span>
                      <span className="text-sm">{trip.distance} miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Driver:</span>
                      <span className="text-sm">{driver?.name || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Truck:</span>
                      <span className="text-sm">{truck?.name || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Origin:</span>
                      <span className="text-sm">{trip.route.originName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Destination:</span>
                      <span className="text-sm">{trip.route.destinationName}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {trip.customerNotes && (
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Customer Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{trip.customerNotes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="customer" className="mt-4">
            {customer ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {customer.name}
                  </CardTitle>
                  <CardDescription>Customer ID: {customer.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Email:</span> {customer.email}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Phone:</span> {customer.phone}
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Address</h4>
                      <p className="text-sm">{customer.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center p-4">Customer information not available</div>
            )}
          </TabsContent>

          <TabsContent value="goods" className="mt-4">
            {goods ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    {goods.name}
                  </CardTitle>
                  <CardDescription>Goods ID: {goods.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Type</h4>
                        <p className="text-sm">{goods.type}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Weight</h4>
                        <p className="text-sm">{goods.weight} kg</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Quantity</h4>
                        <p className="text-sm">{goods.quantity} units</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Description</h4>
                      <p className="text-sm">{goods.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center p-4">Goods information not available</div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
