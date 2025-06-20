"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Loader from "@/components/Loader"
import { fetchDriverLocations } from "@/lib/API/api"
import "leaflet/dist/leaflet.css"

// Dynamically import the map component to prevent SSR
const MapComponent = dynamic(() => Promise.resolve(AllTrucksMapContent), {
  ssr: false,
  loading: () => <Loader />,
})

interface DriverLocation {
  id: number // This is the location ID
  latitude: string
  longitude: string
  driver: {
    id: number // This is the driver ID - we'll use this for navigation
    first_name: string
    last_name: string
    other_name: string
    user: {
      phone_number: string
    }
  }
}

function AllTrucksMapContent() {
  const [driverLocations, setDriverLocations] = useState<DriverLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([9.05785, 7.49508])
  const [zoom, setZoom] = useState(6)
  const [mapComponents, setMapComponents] = useState<any>(null)
  const [L, setL] = useState<any>(null)

  const router = useRouter()

  // Dynamically import Leaflet and react-leaflet
  useEffect(() => {
    const loadMapComponents = async () => {
      try {
        const [leaflet, reactLeaflet] = await Promise.all([import("leaflet"), import("react-leaflet")])

        // Fix for default marker icons
        delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
        leaflet.default.Icon.Default.mergeOptions({
          iconUrl: "/285659_marker_map_icon.png",
        })

        setL(leaflet.default)
        setMapComponents(reactLeaflet)
      } catch (error) {
        console.error("Failed to load map components:", error)
        setError("Failed to load map components")
      }
    }

    loadMapComponents()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetchDriverLocations()
      if (response.success) {
        const validLocations = response.data.filter(
          (location: any) =>
            location.latitude &&
            location.longitude &&
            location.latitude !== "string" &&
            location.longitude !== "string",
        )

        setDriverLocations(validLocations)

        if (validLocations.length > 0 && L) {
          const bounds = L.latLngBounds(
            validLocations.map((location: any) => [
              Number.parseFloat(location.latitude),
              Number.parseFloat(location.longitude),
            ]),
          )
          const center = bounds.getCenter()
          setMapCenter([center.lat, center.lng])
          setZoom(8)
        }
      }
    } catch (err) {
      console.error("Failed to fetch driver locations", err)
      setError("Failed to load driver locations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (L && mapComponents) {
      fetchLocations()
    }
  }, [L, mapComponents])

  // Use driver ID for navigation (matches your API endpoint)
  const handleDriverClick = (driverId: number) => {
    router.push(`/dashboard/movement/${driverId}`)
  }

  if (!L || !mapComponents || loading) return <Loader />
  if (error) return <p className="text-red-500">{error}</p>
  if (driverLocations.length === 0) return <p className="text-gray-600">No driver locations available.</p>

  const { MapContainer, TileLayer, Marker, Popup } = mapComponents

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px]">
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {driverLocations.map((location) => (
              <Marker
                key={location.id}
                position={[Number.parseFloat(location.latitude), Number.parseFloat(location.longitude)]}
                eventHandlers={{
                  // Use driver ID for navigation
                  click: () => handleDriverClick(location.driver.id),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <p>
                      <strong>Driver:</strong> {location.driver.first_name} {location.driver.last_name}
                    </p>
                    <p>
                      <strong>Phone:</strong> {location.driver.user.phone_number}
                    </p>
                    <p>
                      <strong>Location:</strong> {Number.parseFloat(location.latitude).toFixed(4)},{" "}
                      {Number.parseFloat(location.longitude).toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Drivers List</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {driverLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                // Use driver ID for navigation
                onClick={() => handleDriverClick(location.driver.id)}
              >
                <p className="text-gray-800">
                  <strong>Driver:</strong> {location.driver.first_name} {location.driver.other_name}{" "}
                  {location.driver.last_name}
                </p>
                <p className="text-gray-800">
                  <strong>Phone:</strong> {location.driver.user.phone_number}
                </p>
                <p className="text-gray-800">
                  <strong>Location:</strong> {Number.parseFloat(location.latitude).toFixed(4)},{" "}
                  {Number.parseFloat(location.longitude).toFixed(4)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AllTrucksMapPage() {
  return <MapComponent />
}
