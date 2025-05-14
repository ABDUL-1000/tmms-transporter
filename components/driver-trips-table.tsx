"use client"

import { useState } from "react"
import { MoreVertical, MapPin, Info, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Trip } from "@/lib/types"
import { format } from "date-fns"
import TripDetailsModal from "@/components/trip-details-modal"

interface DriverTripsTableProps {
  trips: Trip[]
}

export default function DriverTripsTable({ trips }: DriverTripsTableProps) {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

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

  const handleViewDetails = (trip: Trip) => {
    setSelectedTrip(trip)
    setIsDetailsModalOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="grid grid-cols-12 border-b bg-muted/40 p-4 font-medium">
          <div className="col-span-1">ID</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Route</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Distance</div>
          <div className="col-span-2">Truck</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {trips.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No trips found for this driver</div>
        ) : (
          trips.map((trip) => (
            <div key={trip.id} className="grid grid-cols-12 items-center border-b p-4">
              <div className="col-span-1 font-medium">{trip.id}</div>
              <div className="col-span-2">
                <div>{formatDate(trip.startTime)}</div>
                <div className="text-xs text-muted-foreground">{formatTime(trip.startTime)}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm">{trip.route.originName}</div>
                <div className="text-xs text-muted-foreground">to {trip.route.destinationName}</div>
              </div>
              <div className="col-span-2">
                <Badge variant="outline" className={cn(getStatusBadgeClass(trip.status))}>
                  {formatStatus(trip.status)}
                </Badge>
              </div>
              <div className="col-span-2">{trip.distance} miles</div>
              <div className="col-span-2">{trip.truckId}</div>
              <div className="col-span-1 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(trip)}>
                      <MapPin className="mr-2 h-4 w-4" />
                      View on Map
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewDetails(trip)}>
                      <Info className="mr-2 h-4 w-4" />
                      Trip Details
                    </DropdownMenuItem>
                    {trip.status === "scheduled" && (
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Reschedule
                      </DropdownMenuItem>
                    )}
                    {trip.status === "in_progress" && (
                      <DropdownMenuItem>
                        <Clock className="mr-2 h-4 w-4" />
                        Update Status
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTrip && (
        <TripDetailsModal
          trip={selectedTrip}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </>
  )
}
