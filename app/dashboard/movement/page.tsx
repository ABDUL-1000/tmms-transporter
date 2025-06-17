"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { DriverLocation } from "@/lib/types"
import { fetchDriverLocations } from "@/lib/API/api"

const MAPBOX_TOKEN = "pk.eyJ1Ijoic29mdG1hZ2ljIiwiYSI6ImNrMGJraGRnbjB2YXUzbnE4bm9ibTFzYm4ifQ.RZfNvqLNr4UbHmcpbzbd_Q"

interface DriverLocationMapProps {
  selectedDriverId?: number
  onDriverSelect?: (driver: DriverLocation) => void
}

export default function DriverLocationMap({ selectedDriverId, onDriverSelect }: DriverLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [driverLocations, setDriverLocations] = useState<DriverLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDriver, setSelectedDriver] = useState<DriverLocation | null>(null)

  // Initialize map
  useEffect(() => {
    if (map.current) return // Initialize map only once

    mapboxgl.accessToken = MAPBOX_TOKEN

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [7.4448896, 9.0636288], // Default to Nigeria coordinates
        zoom: 6,
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Fetch driver locations
  const loadDriverLocations = async () => {
    try {
      setLoading(true)
      const response = await fetchDriverLocations()
      if (response.success) {
        setDriverLocations(response.data)
        addMarkersToMap(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch driver locations:", error)
    } finally {
      setLoading(false)
    }
  }

  // Add markers to map
  const addMarkersToMap = (locations: DriverLocation[]) => {
    if (!map.current) return

    // Clear existing markers
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker")
    existingMarkers.forEach((marker) => marker.remove())

    locations.forEach((location) => {
      const lng = Number.parseFloat(location.longitude)
      const lat = Number.parseFloat(location.latitude)

      // Skip invalid coordinates
      if (isNaN(lng) || isNaN(lat)) return

      // Create custom marker element
      const markerElement = document.createElement("div")
      markerElement.className = "driver-marker"
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: ${getStatusColor(location.driver.movement_status)};
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `

      // Add icon
      const icon = document.createElement("div")
      icon.innerHTML = "🚛"
      icon.style.fontSize = "12px"
      markerElement.appendChild(icon)

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold">${location.driver.first_name} ${location.driver.last_name}</h3>
          <p class="text-sm text-gray-600">License: ${location.driver.license_number}</p>
          <p class="text-sm text-gray-600">Status: ${location.driver.movement_status}</p>
          <p class="text-sm text-gray-600">Phone: ${location.driver.user.phone_number}</p>
        </div>
      `)

      // Create marker
      const marker = new mapboxgl.Marker(markerElement).setLngLat([lng, lat]).setPopup(popup).addTo(map.current!)

      // Add click event
      markerElement.addEventListener("click", () => {
        setSelectedDriver(location)
        onDriverSelect?.(location)
      })
    })

    // Fit map to show all markers
    if (locations.length > 0) {
      const validLocations = locations.filter(
        (loc) => !isNaN(Number.parseFloat(loc.longitude)) && !isNaN(Number.parseFloat(loc.latitude)),
      )

      if (validLocations.length > 0) {
        const bounds = new mapboxgl.LngLatBounds()
        validLocations.forEach((location) => {
          bounds.extend([Number.parseFloat(location.longitude), Number.parseFloat(location.latitude)])
        })
        map.current?.fitBounds(bounds, { padding: 50 })
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "moving":
        return "#22c55e" // green
      case "pending":
        return "#eab308" // yellow
      case "delivered":
        return "#ef4444" // red
      default:
        return "#6b7280" // gray
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "moving":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) =>
    status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  useEffect(() => {
    loadDriverLocations()
  }, [])

  // Focus on selected driver
  useEffect(() => {
    if (selectedDriverId && map.current) {
      const driver = driverLocations.find((d) => d.driver_id === selectedDriverId)
      if (driver) {
        const lng = Number.parseFloat(driver.longitude)
        const lat = Number.parseFloat(driver.latitude)
        if (!isNaN(lng) && !isNaN(lat)) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 12,
            duration: 2000,
          })
          setSelectedDriver(driver)
        }
      }
    }
  }, [selectedDriverId, driverLocations])

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[600px]">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10">
          <Button onClick={loadDriverLocations} disabled={loading} size="sm" variant="secondary">
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
        <div ref={mapContainer} className="w-full h-full rounded-lg" />
      </div>

      {/* Driver Info Panel */}
      <div className="w-full lg:w-80 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Driver Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Total Drivers: {driverLocations.length}</div>
          </CardContent>
        </Card>

        {selectedDriver && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDriver.driver.first_name} {selectedDriver.driver.last_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="outline" className={cn(getStatusBadgeClass(selectedDriver.driver.movement_status))}>
                  {formatStatus(selectedDriver.driver.movement_status)}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License:</span>
                  <span>{selectedDriver.driver.license_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{selectedDriver.driver.user.phone_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="truncate">{selectedDriver.driver.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>
                    {selectedDriver.driver.user.city}, {selectedDriver.driver.user.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coordinates:</span>
                  <span className="text-xs">
                    {Number.parseFloat(selectedDriver.latitude).toFixed(4)},{" "}
                    {Number.parseFloat(selectedDriver.longitude).toFixed(4)}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => {
                  if (map.current) {
                    map.current.flyTo({
                      center: [Number.parseFloat(selectedDriver.longitude), Number.parseFloat(selectedDriver.latitude)],
                      zoom: 15,
                      duration: 2000,
                    })
                  }
                }}
                className="w-full"
                size="sm"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Center on Map
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Driver List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Drivers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-60 overflow-y-auto">
            {driverLocations.map((location) => (
              <div
                key={location.id}
                className={cn(
                  "p-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedDriver?.id === location.id && "bg-muted border-primary",
                )}
                onClick={() => {
                  setSelectedDriver(location)
                  onDriverSelect?.(location)
                  if (map.current) {
                    const lng = Number.parseFloat(location.longitude)
                    const lat = Number.parseFloat(location.latitude)
                    if (!isNaN(lng) && !isNaN(lat)) {
                      map.current.flyTo({
                        center: [lng, lat],
                        zoom: 12,
                        duration: 2000,
                      })
                    }
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">
                    {location.driver.first_name} {location.driver.last_name}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(getStatusBadgeClass(location.driver.movement_status), "text-xs")}
                  >
                    {formatStatus(location.driver.movement_status)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {location.driver.user.city}, {location.driver.user.state}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
