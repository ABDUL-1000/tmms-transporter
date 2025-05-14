"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Truck, Driver, Location } from "@/lib/types"

interface TruckFormProps {
  truck: Truck | null
  drivers: Driver[]
  onSubmit: (truck: Truck) => void
}

export default function TruckForm({ truck, drivers, onSubmit }: TruckFormProps) {
  const [id, setId] = useState(truck?.id || `T-${Math.floor(Math.random() * 900) + 100}`)
  const [name, setName] = useState(truck?.name || "")
  const [status, setStatus] = useState(truck?.status || "idle")
  const [driverId, setDriverId] = useState(truck?.driverId || "")

  // Default location if none provided
  const defaultLocation: Location = { latitude: 50, longitude: 50 }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedTruck: Truck = {
      id,
      name,
      status: status as "idle" | "moving" | "pending" | "maintenance",
      driverId: driverId || null,
      location: truck?.location || defaultLocation,
      route: truck?.route || undefined,
    }

    onSubmit(updatedTruck)
  }

  // Filter out drivers that are already assigned to other trucks
  const availableDrivers = drivers.filter((driver) => driver.id === driverId || !driver.assignedTruckId)

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id">Truck ID</Label>
          <Input id="id" value={id} onChange={(e) => setId(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Truck Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="moving">Moving</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="driver">Assigned Driver</Label>
          <Select value={driverId} onValueChange={setDriverId}>
            <SelectTrigger id="driver">
              <SelectValue placeholder="Select driver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {availableDrivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">{truck ? "Update Truck" : "Add Truck"}</Button>
      </div>
    </form>
  )
}
