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
 movement_status: "pending" | "moving" | "delivered" 
  driverId: string | null
  location: Location

   
  quantity: number
  compartment: number
  status: "pending" | "moving" | "delivered" 



  calibrate_one?: number // Add this line
  calibrate_two?: number // Add this line
  calibrate_three?: number // Add this line
}

export interface Driver {
  id: string
 first_name: string;
  last_name: string;
  other_name: string;
  license_number: string;
  license_details: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  country: string;
  password: string;
  password_confirmation: string;
  status: "pending" | "moving" | "delivered"
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
