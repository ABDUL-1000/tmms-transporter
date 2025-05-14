"use client"

import { useEffect, useRef, useState } from "react"
import type { Truck as TruckType } from "@/lib/types"
import { Loader } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransportMapProps {
  trucks: TruckType[]
}

export default function TransportMap({ trucks }: TransportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(null)

  // This is a placeholder for the actual map implementation
  // In a real app, you would use a library like Mapbox, Google Maps, or Leaflet
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // In a real implementation, you would initialize the map here
  // and add markers for each truck

  return (
    <div className="relative h-full w-full bg-gray-100">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading map...</span>
        </div>
      ) : (
        <>
          <div ref={mapRef} className="h-full w-full">
            {/* This is a placeholder for the actual map */}
            <div className="h-full w-full bg-[#e8ecef] relative">
              {/* Simulate map features */}
              <div className="absolute inset-0">
                {/* Simulate roads */}
                <div className="absolute left-[10%] right-[10%] top-1/2 h-1 bg-gray-300"></div>
                <div className="absolute bottom-[20%] top-[20%] left-1/2 w-1 bg-gray-300"></div>

                {/* Place truck markers */}
                {trucks.map((truck) => (
                  <div
                    key={truck.id}
                    className={cn(
                      "absolute cursor-pointer transition-all duration-300",
                      selectedTruck?.id === truck.id ? "z-10 scale-125" : "z-0",
                    )}
                    style={{
                      left: `${truck.location.longitude}%`,
                      top: `${truck.location.latitude}%`,
                    }}
                    onClick={() => setSelectedTruck(truck)}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        truck.status === "moving"
                          ? "bg-green-500"
                          : truck.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-blue-500",
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M10 17h4V5H2v12h3" />
                        <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
                        <path d="M14 17h1" />
                        <circle cx="7.5" cy="17.5" r="2.5" />
                        <circle cx="17.5" cy="17.5" r="2.5" />
                      </svg>
                    </div>

                    {/* Draw route line if truck is moving */}
                    {truck.status === "moving" && truck.route && (
                      <svg
                        className="absolute left-0 top-0 h-full w-full"
                        style={{
                          width: "100vw",
                          height: "100vh",
                          pointerEvents: "none",
                          position: "fixed",
                          top: 0,
                          left: 0,
                          zIndex: -1,
                        }}
                      >
                        <line
                          x1={`${truck.route.origin.longitude}%`}
                          y1={`${truck.route.origin.latitude}%`}
                          x2={`${truck.location.longitude}%`}
                          y2={`${truck.location.latitude}%`}
                          stroke="#4CAF50"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                        <line
                          x1={`${truck.location.longitude}%`}
                          y1={`${truck.location.latitude}%`}
                          x2={`${truck.route.destination.longitude}%`}
                          y2={`${truck.route.destination.latitude}%`}
                          stroke="#2196F3"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      </svg>
                    )}

                    {/* Truck info tooltip */}
                    {selectedTruck?.id === truck.id && (
                      <div className="absolute left-1/2 top-full mt-2 w-48 -translate-x-1/2 rounded-md bg-white p-2 shadow-lg">
                        <p className="font-medium">{truck.name}</p>
                        <p className="text-xs text-muted-foreground">Status: {truck.status}</p>
                        {truck.driverId && <p className="text-xs text-muted-foreground">Driver ID: {truck.driverId}</p>}
                        {truck.route && (
                          <>
                            <p className="text-xs text-muted-foreground">From: {truck.route.originName}</p>
                            <p className="text-xs text-muted-foreground">To: {truck.route.destinationName}</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add city/location markers */}
                <div className="absolute left-[10%] top-[20%] flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                  <p className="text-xs font-medium">Warehouse A</p>
                </div>
                <div className="absolute left-[90%] top-[20%] flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                  <p className="text-xs font-medium">Distribution Center</p>
                </div>
                <div className="absolute left-[10%] top-[80%] flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                  <p className="text-xs font-medium">Warehouse B</p>
                </div>
                <div className="absolute left-[90%] top-[80%] flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                  <p className="text-xs font-medium">Retail Center</p>
                </div>
                <div className="absolute left-[50%] top-[50%] flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                  <p className="text-xs font-medium">City Hub</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 rounded-md bg-white p-2 shadow-md">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Moving</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Assigned</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
