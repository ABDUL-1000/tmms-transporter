"use client"

import { useEffect, useRef, useState } from "react"
import type { Trip } from "@/lib/types"
import { Loader } from "lucide-react"

interface TripMapProps {
  trip: Trip
}

export default function TripMap({ trip }: TripMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  // In a real implementation, you would use the Mapbox GL JS library
  // This is a simplified version for demonstration purposes
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative h-full w-full bg-gray-100">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading map...</span>
        </div>
      ) : (
        <div ref={mapContainerRef} className="h-full w-full">
          {/* This is a placeholder for the actual Mapbox map */}
          <div className="h-full w-full bg-[#e8ecef] relative">
            {/* Simulate map features */}
            <div className="absolute inset-0">
              {/* Simulate roads */}
              <div className="absolute left-[10%] right-[10%] top-1/2 h-1 bg-gray-300"></div>
              <div className="absolute bottom-[20%] top-[20%] left-1/2 w-1 bg-gray-300"></div>

              {/* Origin marker */}
              <div
                className="absolute flex flex-col items-center"
                style={{
                  left: `${trip.route.origin.longitude}%`,
                  top: `${trip.route.origin.latitude}%`,
                }}
              >
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                <p className="text-xs font-medium mt-1">Origin: {trip.route.originName}</p>
              </div>

              {/* Destination marker */}
              <div
                className="absolute flex flex-col items-center"
                style={{
                  left: `${trip.route.destination.longitude}%`,
                  top: `${trip.route.destination.latitude}%`,
                }}
              >
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                <p className="text-xs font-medium mt-1">Destination: {trip.route.destinationName}</p>
              </div>

              {/* Route line */}
              <svg
                className="absolute left-0 top-0 h-full w-full"
                style={{
                  pointerEvents: "none",
                }}
              >
                <line
                  x1={`${trip.route.origin.longitude}%`}
                  y1={`${trip.route.origin.latitude}%`}
                  x2={`${trip.route.destination.longitude}%`}
                  y2={`${trip.route.destination.latitude}%`}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>

              {/* Add a truck icon if the trip is in progress */}
              {trip.status === "in_progress" && (
                <div
                  className="absolute"
                  style={{
                    left: `${(trip.route.origin.longitude + trip.route.destination.longitude) / 2}%`,
                    top: `${(trip.route.origin.latitude + trip.route.destination.latitude) / 2}%`,
                  }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 rounded-md bg-white p-2 shadow-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Destination</span>
          </div>
          {trip.status === "in_progress" && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">Current Position</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
