"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Truck, Driver } from "@/lib/types"

interface DriverFormProps {
  driver: Driver | null
  trucks: Truck[]
  onSubmit: (driver: Driver) => void
}

export default function DriverForm({ driver, trucks, onSubmit }: DriverFormProps) {
  const [id, setId] = useState(driver?.id || `D-${Math.floor(Math.random() * 900) + 100}`)
  const [name, setName] = useState(driver?.name || "")
  const [status, setStatus] = useState(driver?.status || "off_duty")
  const [assignedTruckId, setAssignedTruckId] = useState(driver?.assignedTruckId || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedDriver: Driver = {
      id,
      name,
      status: status as "on_duty" | "off_duty" | "on_leave",
      assignedTruckId: assignedTruckId || null,
    }

    onSubmit(updatedDriver)
  }

  // Filter out trucks that are already assigned to other drivers
  const availableTrucks = trucks.filter((truck) => truck.id === assignedTruckId || !truck.driverId)

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id">Driver ID</Label>
          <Input id="id" value={id} onChange={(e) => setId(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Driver Name</Label>
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
              <SelectItem value="on_duty">On Duty</SelectItem>
              <SelectItem value="off_duty">Off Duty</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="truck">Assigned Truck</Label>
          <Select value={assignedTruckId} onValueChange={setAssignedTruckId}>
            <SelectTrigger id="truck">
              <SelectValue placeholder="Select truck" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {availableTrucks.map((truck) => (
                <SelectItem key={truck.id} value={truck.id}>
                  {truck.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">{driver ? "Update Driver" : "Add Driver"}</Button>
      </div>
    </form>
  )
}
