// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import type { Truck, Driver, Location } from "@/lib/types"
// import api from "@/lib/API/axios"

// interface TruckFormProps {
//   truck?: Truck | null
// }

// export default function TruckForm({ truck }: TruckFormProps) {
//   const [driversList, setDriversList] = useState<Driver[]>([])
//   const [id, setId] = useState(truck?.id || `T-${Math.floor(Math.random() * 900) + 100}`)
//   const [name, setName] = useState(truck?.name || "")
//   const [status, setStatus] = useState(truck?.status || "pending")
//   const [movementStatus, setMovementStatus] = useState(truck?.movement_status || "pending")
//   const [driverId, setDriverId] = useState(truck?.driverId || "")

//   const [quantity, setQuantity] = useState(truck?.quantity || 0)
//   const [compartment, setCompartment] = useState(truck?.compartment || 0)
//   const [calibrateOne, setCalibrateOne] = useState(truck?.calibrate_one || 0)
//   const [calibrateTwo, setCalibrateTwo] = useState(truck?.calibrate_two || 0)
//   const [calibrateThree, setCalibrateThree] = useState(truck?.calibrate_three || 0)

  


//   const handleDriverChange = async (driverId: string) => {
//     setDriverId(driverId)
//     if (driverId === "unassigned") {
//       setName("")
//       return
//     }
//     try {
//       const response = await api.get(`/transporters/drivers/${driverId}`)
//       const driverData = response.data
//       // Use driver's name for the truck name (or modify as needed)
//       setName(`${driverData.first_name} ${driverData.last_name}'s Truck`)
//     } catch (error) {
//       console.error("Failed to fetch driver details", error)
//     }
//   }

//   // Filter out drivers that are already assigned
//   const availableDrivers = driversList.filter(
//     (driver) => driver.id === driverId || !driver.assignedTruckId
//   )

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const payload = {
//       driver_id: driverId === "unassigned" ? null : driverId,
//       name,
//       description: "New Truck added via form",
//       truck_number: id,
//       quantity: Number(quantity),
//       compartment: Number(compartment),
//       calibrate_one: Number(calibrateOne),
//       calibrate_two: Number(calibrateTwo),
//       calibrate_three: Number(calibrateThree),
//       status,
//       movement_status: movementStatus
//     }

//     try {
//       const { data } = await api.post("/transporters/trucks", payload)
//       console.log("Truck created:", data)
//       alert("Truck successfully created")
//     } catch (error) {
//       console.error("Error creating truck:", error)
//       alert("Failed to create truck")
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 pt-4">
//       <div className="grid grid-cols-4 gap-4">
//         <div className="space-y-2">
//           <Label>Truck Number</Label>
//           <Input value={id} onChange={(e) => setId(e.target.value)} required />
//         </div>
//         <div className="space-y-2">
//           <Label>Truck Name</Label>
//           <Input value={name} onChange={(e) => setName(e.target.value)} required />
//         </div>
//         <div className="space-y-2">
//           <Label>Quantity</Label>
//          <Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} required />
//         </div>
//         <div className="space-y-2">
//           <Label>Compartment</Label>
//           <Input type="number" value={compartment} onChange={(e) => setCompartment(parseInt(e.target.value, 10))} required />
//         </div>
//         <div className="space-y-2">
//           <Label>Calibrate One</Label>
//           <Input type="number" value={calibrateOne} onChange={(e) => setCalibrateOne(parseInt(e.target.value, 10))} required />
//         </div>
//         <div className="space-y-2">
//           <Label>Calibrate Two</Label>
//           <Input type="number" value={calibrateTwo} onChange={(e) => setCalibrateTwo(parseInt(e.target.value, 10))} required />
//         </div>
//         <div className="space-y-2">
//           <Label>Calibrate Three</Label>
//           <Input type="number" value={calibrateThree} onChange={(e) => setCalibrateThree(parseInt(e.target.value, 10))} required />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label>Status</Label>
//            <Select value={status} onValueChange={(value) => setStatus(value as "pending" | "moving" | "delivered")}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="moving">Moving</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="maintenance">dilivered</SelectItem>
//             </SelectContent>
//           </Select>
//           <Label>Movement Status</Label>
//          <Select value={status} onValueChange={(value) => setStatus(value as "pending" | "moving" | "delivered")}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select movement status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="moving">Moving</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="maintenance">Maintenance</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
       
//       </div>

//       <div className="flex justify-end gap-2 pt-4">
//         <Button type="submit">{truck ? "Update Truck" : "Add Truck"}</Button>
//       </div>
//     </form>
//   )
// }


"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { toast } from "sonner"
import api from "@/lib/API/axios"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Driver } from "@/lib/types"

export default function DriverForm({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState("pending")
    const [driversList, setDriversList] = useState<Driver[]>([])
  
  const [formData, setFormData] = useState({
   name: "",
   description: "",
      truck_number: '',
      quantity: '',
      compartment: '',
      calibrate_one: '',
      calibrate_two: '',
      calibrate_three: '',
      status: 'pending',
      movement_status: 'pending',
      driver_id: ''
  });

  const fetchDrivers = async () => {
    try {
      const cachedData = localStorage.getItem("drivers");
      if (cachedData) {
        const { data, expiry } = JSON.parse(cachedData)
        if (new Date().getTime() < expiry) {
          setDriversList(data)
          return
        } else {
          localStorage.removeItem("drivers")
        }
      }
      const { data } = await api.get("/transporters/drivers")
      setDriversList(data.data)

      const oneHour = 60 * 60 * 1000
      const now = new Date().getTime()
      localStorage.setItem("drivers", JSON.stringify({ data: data.data, expiry: now + oneHour }))
    } catch (error) {
      console.error("Error fetching drivers:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await api.post("/transporters/trucks", formData)
      console.log("Success:", data)
      toast.success("Driver added successfully")
      onSuccess()   // <-- call this after toast
    } catch (error: any) {
      console.error("Error creating driver:", error)
      toast.error("Failed to add driver")
    }
  }

  
  useEffect(() => {
    fetchDrivers()
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4 ">
      <div className="grid grid-cols-4 gap-2 overflow-y-scroll">
        <div className="space-y-2">
          <Label htmlFor="first_name">Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">descriptio</Label>
          <Input id="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="truck_numbe">truck_number</Label>
          <Input id="truck_number" value={formData.truck_number} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantityr">quantity</Label>
          <Input id="quantity" value={formData.quantity} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compartment">compartment</Label>
          <Input id="compartment" value={formData.compartment} onChange={handleChange} />
        </div>
       
  

        <div className="space-y-2">
          <Label htmlFor="phone_number"> calibrate_one</Label>
          <Input id="calibrate_one" value={formData.calibrate_one} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="calibrate_two">calibrate_two</Label>
          <Input id="calibrate_two" value={formData.calibrate_two} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="calibrate_three">calibrate_three</Label>
          <Input id="calibrate_three" value={formData.calibrate_three} onChange={handleChange} />
        </div>

     <div className="space-y-2 pl-4 flex  items-center">
      <div className="flex flex-col">
           <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as "pending" | "moving" | "delivered")}>
             <SelectTrigger>
               <SelectValue placeholder="Select status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="moving">Moving</SelectItem>
               <SelectItem value="pending">Pending</SelectItem>
               <SelectItem value="maintenance">dilivered</SelectItem>
             </SelectContent>
           </Select>
           </div>
            <div className="flex flex-col ">
           <Label className="text-[0.5rem]">Movement Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as "pending" | "moving" | "delivered")}>
             <SelectTrigger>
               <SelectValue placeholder="Select movement status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="moving">Moving</SelectItem>
               <SelectItem value="pending">Pending</SelectItem>
               <SelectItem value="maintenance">Maintenance</SelectItem>
             </SelectContent>
           </Select>
           </div>
          <div className="space-y-2">
  <Label>Assigned Driver</Label>
  <Select 
    value={formData.driver_id}
    onValueChange={(value) => setFormData((prev) => ({ ...prev, driver_id: value }))}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select driver" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="unassigned">Unassigned</SelectItem>
      {driversList.map((driver) => (
        <SelectItem key={driver.id} value={driver.id}>
          {driver.first_name} {driver.last_name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

        </div>

    

        
      </div>
 
      <div className="flex justify-end gap-2  pt-1">
        <Button type="submit">Submit</Button>
       
      </div>
    
    </form>
  )
}
