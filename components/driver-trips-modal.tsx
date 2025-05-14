"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTripsByDriverId } from "@/lib/data"
import type { Trip } from "@/lib/types"
import { useEffect, useState } from "react"
import DriverTripsTable from "@/components/driver-trips-table"

interface DriverTripsModalProps {
  driverId: string
  driverName: string
  isOpen: boolean
  onClose: () => void
}

export default function DriverTripsModal({ driverId, driverName, isOpen, onClose }: DriverTripsModalProps) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      // In a real app, this would be an API call
      const driverTrips = getTripsByDriverId(driverId)
      setTrips(driverTrips)
      setLoading(false)
    }
  }, [driverId, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Trip History - {driverName}</DialogTitle>
          <DialogDescription>View all trips assigned to this driver</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2">Loading trips...</span>
          </div>
        ) : (
          <DriverTripsTable trips={trips} />
        )}
      </DialogContent>
    </Dialog>
  )
}
