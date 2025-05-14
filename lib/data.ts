import type { Truck, Driver, Trip, Customer, Goods } from "./types"

export function getTrucks(): Truck[] {
  return [
    {
      id: "T-101",
      name: "Truck 101",
      status: "moving",
      driverId: "D-001",
      location: { latitude: 30, longitude: 30 },
      route: {
        origin: { latitude: 20, longitude: 10 },
        destination: { latitude: 80, longitude: 90 },
        originName: "Warehouse A",
        destinationName: "Distribution Center",
      },
    },
    {
      id: "T-102",
      name: "Truck 102",
      status: "maintenance",
      driverId: null,
      location: { latitude: 50, longitude: 50 },
    },
    {
      id: "T-103",
      name: "Truck 103",
      status: "moving",
      driverId: "D-002",
      location: { latitude: 70, longitude: 30 },
      route: {
        origin: { latitude: 50, longitude: 50 },
        destination: { latitude: 80, longitude: 10 },
        originName: "City Hub",
        destinationName: "Retail Center",
      },
    },
    {
      id: "T-104",
      name: "Truck 104",
      status: "idle",
      driverId: null,
      location: { latitude: 20, longitude: 80 },
    },
    {
      id: "T-105",
      name: "Truck 105",
      status: "pending",
      driverId: "D-003",
      location: { latitude: 40, longitude: 70 },
      route: {
        origin: { latitude: 40, longitude: 70 },
        destination: { latitude: 10, longitude: 20 },
        originName: "Distribution Center",
        destinationName: "Warehouse B",
      },
    },
    {
      id: "T-106",
      name: "Truck 106",
      status: "moving",
      driverId: "D-004",
      location: { latitude: 60, longitude: 40 },
      route: {
        origin: { latitude: 80, longitude: 80 },
        destination: { latitude: 20, longitude: 20 },
        originName: "Retail Center",
        destinationName: "Warehouse A",
      },
    },
    {
      id: "T-107",
      name: "Truck 107",
      status: "idle",
      driverId: null,
      location: { latitude: 30, longitude: 60 },
    },
    {
      id: "T-108",
      name: "Truck 108",
      status: "moving",
      driverId: "D-005",
      location: { latitude: 25, longitude: 45 },
      route: {
        origin: { latitude: 10, longitude: 20 },
        destination: { latitude: 90, longitude: 90 },
        originName: "Warehouse B",
        destinationName: "Distribution Center",
      },
    },
  ]
}

export function getDrivers(): Driver[] {
  return [
    {
      id: "D-001",
      name: "John Doe",
      status: "on_duty",
      assignedTruckId: "T-101",
    },
    {
      id: "D-002",
      name: "Jane Smith",
      status: "on_duty",
      assignedTruckId: "T-103",
    },
    {
      id: "D-003",
      name: "Mike Johnson",
      status: "on_duty",
      assignedTruckId: "T-105",
    },
    {
      id: "D-004",
      name: "Sarah Williams",
      status: "on_duty",
      assignedTruckId: "T-106",
    },
    {
      id: "D-005",
      name: "Robert Brown",
      status: "on_duty",
      assignedTruckId: "T-108",
    },
    {
      id: "D-006",
      name: "Emily Davis",
      status: "off_duty",
      assignedTruckId: null,
    },
    {
      id: "D-007",
      name: "David Miller",
      status: "off_duty",
      assignedTruckId: null,
    },
    {
      id: "D-008",
      name: "Lisa Wilson",
      status: "on_leave",
      assignedTruckId: null,
    },
  ]
}

export function getCustomers(): Customer[] {
  return [
    {
      id: "C-001",
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "555-123-4567",
      address: "123 Main St, Business District",
    },
    {
      id: "C-002",
      name: "Global Retail Inc.",
      email: "orders@globalretail.com",
      phone: "555-987-6543",
      address: "456 Commerce Ave, Shopping Center",
    },
    {
      id: "C-003",
      name: "Tech Innovations Ltd",
      email: "shipping@techinnovations.com",
      phone: "555-456-7890",
      address: "789 Technology Pkwy, Tech Park",
    },
    {
      id: "C-004",
      name: "Fresh Foods Market",
      email: "logistics@freshfoods.com",
      phone: "555-789-0123",
      address: "321 Produce Lane, Market District",
    },
  ]
}

export function getGoods(): Goods[] {
  return [
    {
      id: "G-001",
      name: "Electronics Shipment",
      type: "Electronics",
      weight: 2500,
      quantity: 150,
      description: "Assorted consumer electronics including smartphones, tablets, and accessories",
    },
    {
      id: "G-002",
      name: "Furniture Delivery",
      type: "Furniture",
      weight: 8000,
      quantity: 45,
      description: "Office furniture including desks, chairs, and filing cabinets",
    },
    {
      id: "G-003",
      name: "Grocery Supplies",
      type: "Food",
      weight: 5000,
      quantity: 300,
      description: "Fresh produce, dairy products, and packaged goods",
    },
    {
      id: "G-004",
      name: "Construction Materials",
      type: "Building Materials",
      weight: 12000,
      quantity: 80,
      description: "Lumber, drywall, and other construction supplies",
    },
    {
      id: "G-005",
      name: "Clothing Shipment",
      type: "Apparel",
      weight: 1800,
      quantity: 500,
      description: "Seasonal clothing items for retail distribution",
    },
  ]
}

export function getTrips(): Trip[] {
  return [
    {
      id: "TR-001",
      driverId: "D-001",
      truckId: "T-101",
      customerId: "C-001",
      goodsId: "G-001",
      startTime: "2023-05-10T08:00:00Z",
      endTime: "2023-05-10T14:30:00Z",
      status: "completed",
      route: {
        origin: { latitude: 20, longitude: 10 },
        destination: { latitude: 80, longitude: 90 },
        originName: "Warehouse A",
        destinationName: "Acme Corporation HQ",
      },
      customerNotes: "Please deliver to loading dock B. Call upon arrival.",
      distance: 120,
    },
    {
      id: "TR-002",
      driverId: "D-001",
      truckId: "T-101",
      customerId: "C-002",
      goodsId: "G-005",
      startTime: "2023-05-12T09:15:00Z",
      endTime: "2023-05-12T16:45:00Z",
      status: "completed",
      route: {
        origin: { latitude: 25, longitude: 15 },
        destination: { latitude: 70, longitude: 80 },
        originName: "Distribution Center",
        destinationName: "Global Retail Store #42",
      },
      customerNotes: "Fragile items, handle with care. Delivery window: 2-5 PM.",
      distance: 95,
    },
    {
      id: "TR-003",
      driverId: "D-001",
      truckId: "T-101",
      customerId: "C-003",
      goodsId: "G-001",
      startTime: "2023-05-15T07:30:00Z",
      endTime: null,
      status: "in_progress",
      route: {
        origin: { latitude: 30, longitude: 20 },
        destination: { latitude: 60, longitude: 70 },
        originName: "Warehouse B",
        destinationName: "Tech Innovations Campus",
      },
      customerNotes: "Security clearance required at gate. Contact security office upon arrival.",
      distance: 85,
    },
    {
      id: "TR-004",
      driverId: "D-002",
      truckId: "T-103",
      customerId: "C-004",
      goodsId: "G-003",
      startTime: "2023-05-11T06:00:00Z",
      endTime: "2023-05-11T10:30:00Z",
      status: "completed",
      route: {
        origin: { latitude: 40, longitude: 30 },
        destination: { latitude: 50, longitude: 60 },
        originName: "Distribution Center",
        destinationName: "Fresh Foods Market #12",
      },
      customerNotes: "Refrigerated items. Maintain temperature at 38°F. Early morning delivery preferred.",
      distance: 45,
    },
    {
      id: "TR-005",
      driverId: "D-002",
      truckId: "T-103",
      customerId: "C-001",
      goodsId: "G-002",
      startTime: "2023-05-14T10:00:00Z",
      endTime: "2023-05-14T18:15:00Z",
      status: "completed",
      route: {
        origin: { latitude: 35, longitude: 25 },
        destination: { latitude: 75, longitude: 85 },
        originName: "Furniture Warehouse",
        destinationName: "Acme Corporation Office Park",
      },
      customerNotes: "Assembly service requested. Schedule 3 hours for setup after delivery.",
      distance: 110,
    },
    {
      id: "TR-006",
      driverId: "D-003",
      truckId: "T-105",
      customerId: "C-002",
      goodsId: "G-004",
      startTime: "2023-05-16T08:30:00Z",
      endTime: null,
      status: "in_progress",
      route: {
        origin: { latitude: 45, longitude: 35 },
        destination: { latitude: 65, longitude: 75 },
        originName: "Building Supply Center",
        destinationName: "Global Retail Construction Site",
      },
      customerNotes: "Heavy machinery needed for unloading. Site foreman will direct placement.",
      distance: 70,
    },
    {
      id: "TR-007",
      driverId: "D-001",
      truckId: "T-101",
      customerId: "C-003",
      goodsId: "G-001",
      startTime: "2023-05-18T09:00:00Z",
      endTime: null,
      status: "scheduled",
      route: {
        origin: { latitude: 30, longitude: 20 },
        destination: { latitude: 60, longitude: 70 },
        originName: "Electronics Depot",
        destinationName: "Tech Innovations R&D Center",
      },
      customerNotes: "High-value items. Signature required from authorized personnel only.",
      distance: 85,
    },
  ]
}

export function getTripsByDriverId(driverId: string): Trip[] {
  const allTrips = getTrips()
  return allTrips.filter((trip) => trip.driverId === driverId)
}

export function getCustomerById(customerId: string): Customer | undefined {
  const customers = getCustomers()
  return customers.find((customer) => customer.id === customerId)
}

export function getGoodsById(goodsId: string): Goods | undefined {
  const goods = getGoods()
  return goods.find((item) => item.id === goodsId)
}

export function getTruckById(truckId: string): Truck | undefined {
  const trucks = getTrucks()
  return trucks.find((truck) => truck.id === truckId)
}

export function getDriverById(driverId: string): Driver | undefined {
  const drivers = getDrivers()
  return drivers.find((driver) => driver.id === driverId)
}
