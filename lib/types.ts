export interface Location {
  latitude: number
  longitude: number
}

export interface Route {
  origin: Location
  destination: Location
  originName: string
  destinationName: string
}

export interface Truck {
  id: string
  name: string
  status: "idle" | "moving" | "pending" | "maintenance"
  driverId: string | null
  location: Location
  route?: Route
}

export interface Driver {
  id: string
  name: string
  status: "on_duty" | "off_duty" | "on_leave"
  assignedTruckId: string | null
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

export interface Goods {
  id: string
  name: string
  type: string
  weight: number
  quantity: number
  description: string
}

export interface Trip {
  id: string
  driverId: string
  truckId: string
  customerId: string
  goodsId: string
  startTime: string
  endTime: string | null
  status: "completed" | "in_progress" | "scheduled" | "cancelled"
  route: Route
  customerNotes?: string
  distance: number
}
