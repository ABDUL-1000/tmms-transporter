"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { toast } from "sonner"
import api from "@/lib/API/axios"

export default function DriverForm({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    other_name: "",
    license_number: "",
    license_details: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    country: "",
    password: "",
    password_confirmation: "",
  });

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await api.post("/transporters/drivers", formData)
      console.log("Success:", data)
      toast.success("Driver added successfully")
      onSuccess()   // <-- call this after toast
    } catch (error: any) {
      console.error("Error creating driver:", error)
      toast.error("Failed to add driver")
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4 ">
      <div className="grid grid-cols-4 gap-2 overflow-y-scroll">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" value={formData.first_name} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" value={formData.last_name} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="other_name">Other Name</Label>
          <Input id="other_name" value={formData.other_name} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_number">License Number</Label>
          <Input id="license_number" value={formData.license_number} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_details">License Details</Label>
          <Input id="license_details" value={formData.license_details} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input id="phone_number" value={formData.phone_number} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={formData.address} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" value={formData.state} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" value={formData.country} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" value={formData.password} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <Input
            type="password"
            id="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
          />
        </div>
      </div>
 
      <div className="flex justify-end gap-2  pt-1">
        <Button type="submit">Submit</Button>
         <Button type="button" onClick={() => setOpen(true)}>close</Button>
      </div>
    
    </form>
  )
}