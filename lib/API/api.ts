import { DriverLocationResponse, SingleDriverLocationResponse } from "../types";
import api from "./axios";


const fetchDrivers = async () => {
  try {
    const { data } = await api.get("/transporters/drivers");
    console.log(data);
  } catch (error) {
    console.error("Error fetching drivers:", error);
  }
};

fetchDrivers();
const fetchTrucks = async () => {
  try {
    const { data } = await api.get("/transporters/trucks");
    console.log(data);
  } catch (error) {
    console.error("Error fetching trucks:", error);
  }
};

fetchTrucks();



interface CreateTruckPayload {
  driver_id?: number
  name: string
  description?: string
  truck_number: string
  quantity: number
  compartment: number
  calibrate_one?: number
  calibrate_two?: number
  calibrate_three?: number
  status?: string
  movement_status?: string
}

export const createTruck = async (truckData: CreateTruckPayload) => {
  try {
    // Validate required fields before sending
    if (!truckData.name || truckData.name.trim() === "") {
      throw new Error("Truck name is required")
    }

    if (!truckData.truck_number || truckData.truck_number.trim() === "") {
      throw new Error("Truck number is required")
    }

    if (!truckData.quantity || truckData.quantity <= 0) {
      throw new Error("Quantity must be greater than 0")
    }

    if (!truckData.compartment || truckData.compartment <= 0) {
      throw new Error("Compartment must be greater than 0")
    }

    const payload = {
      name: truckData.name.trim(),
      truck_number: truckData.truck_number.trim(),
      quantity: truckData.quantity,
      compartment: truckData.compartment,
      description: truckData.description?.trim() || "",
      driver_id: truckData.driver_id || null, // Send null instead of 0 if no driver
      calibrate_one: truckData.calibrate_one || 0,
      calibrate_two: truckData.calibrate_two || 0,
      calibrate_three: truckData.calibrate_three || 0,
      status: truckData.status || "pending",
      movement_status: truckData.movement_status || "pending",
    }

    const { data } = await api.post("/transporters/trucks", payload)
    console.log("Truck created:", data)
    return data
  } catch (error) {
    console.error("Error creating truck:", error)
    throw error
  }
}

export const fetchDriverLocations = async (): Promise<DriverLocationResponse> => {
  try {
    const { data } = await api.get("/transporters/driver-locations")
    console.log("Driver locations:", data)
    return data
  } catch (error) {
    console.error("Error fetching driver locations:", error)
    throw error
  }
}


export const fetchSingleDriverLocation = async (id: number): Promise<SingleDriverLocationResponse> => {
  try {
    const { data } = await api.get(`/transporters/drivers/${id}/locations`)
    console.log("Single driver location:", data)
    return data
  } catch (error) {
    console.error("Error fetching single driver location:", error)
    throw error
  }
}

