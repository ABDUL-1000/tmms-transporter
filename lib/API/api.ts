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




const createTruck = async () => {
  try {
    const payload = {
      driver_id: 0,
      name: "",
      description: "",
      truck_number: "",
      quantity: 0,
      compartment: 0,
      calibrate_one: 0,
      calibrate_two: 0,
      calibrate_three: 0,
      status: "pending",
      movement_status: "pending",
    };

    const { data } = await api.post("/transporters/trucks", payload);
    console.log("Truck created:", data);
  } catch (error) {
    console.error("Error creating truck:", error);
  }
};

createTruck();
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

export const fetchSingleDriverLocation = async (locationId: number): Promise<SingleDriverLocationResponse> => {
  try {
    const { data } = await api.get(`/transporters/driver-locations/${locationId}`)
    console.log("Single driver location:", data)
    return data
  } catch (error) {
    console.error("Error fetching single driver location:", error)
    throw error
  }
}
