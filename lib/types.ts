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
location: {
    latitude: number
    longitude: number
  }
  destination: {
    latitude: number
    longitude: number
  }
  route?: {
    originName: string
    destinationName: string
  }
  lastUpdated?: Date

   
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
export interface DriverLocation {

  id: number
  program_id: number | null
  driver_id: number
  longitude: string
  latitude: string
  description: string | null
  status: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  driver: {
    id: number
    user_id: number
    added_by: number
    transporter_id: number
    first_name: string
    last_name: string
    other_name: string
    license_number: string
    license_details: string
    status: string
    movement_status: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    user: {
      id: number
      name: string
      email: string
      email_verified_at: string
      role: string
      role_actor_name: string
      role_actor_id: number
      position: string | null
      bank_name: string | null
      account_number: string | null
      account_name: string | null
      phone_number: string
      address: string
      city: string
      state: string
      country: string
      created_at: string
      updated_at: string
      assigned_by: number | null
      deleted_at: string | null
    }
  }
}

export interface DriverLocationResponse {
  success: boolean
  message: string
  data: DriverLocation[]
  metadata: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    previous_page_url: string | null
    next_page_url: string | null
    pages: Record<string, string>
  }
}

export interface SingleDriverLocationResponse {
  success: boolean
  message: string
  data: DriverLocation
  metadata: null
}
