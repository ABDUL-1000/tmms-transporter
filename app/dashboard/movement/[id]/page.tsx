"use client"

import { use, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Loader from "@/components/Loader"
import type { SingleDriverLocationResponse } from "@/lib/types"
import { fetchSingleDriverLocation } from "@/lib/API/api"
import "leaflet/dist/leaflet.css"

// Dynamically import the map component to prevent SSR
const SingleDriverMapComponent = dynamic(() => Promise.resolve(SingleDriverMapContent), {
  ssr: false,
  loading: () => <Loader />,
})

interface SingleDriverMapContentProps {
  params: Promise<{ id: string }>
}

function SingleDriverMapContent({ params }: SingleDriverMapContentProps) {
  const { id } = use(params)

  const [location, setLocation] = useState<SingleDriverLocationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([9.05785, 7.49508])
  const [zoom, setZoom] = useState(6)
  const [mapComponents, setMapComponents] = useState<any>(null)
  const [L, setL] = useState<any>(null)

  // This is the driver ID from the URL
  const driverId = Number.parseInt(id)

  // Dynamically import Leaflet and react-leaflet
  useEffect(() => {
    const loadMapComponents = async () => {
      try {
        const [leaflet, reactLeaflet] = await Promise.all([import("leaflet"), import("react-leaflet")])

        // Fix for default marker icons
        delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
        leaflet.default.Icon.Default.mergeOptions({
          iconRetinaUrl: "/images/marker-icon-2x.png",
          iconUrl: "/images/marker-icon.png",
          shadowUrl: "/images/marker-shadow.png",
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

  useEffect(() => {
    if (!L || !mapComponents) return

    const fetchLocation = async () => {
      try {
        // Using driver ID with your correct API endpoint
        const data = await fetchSingleDriverLocation(driverId)
        setLocation(data)
        console.log("API Response:", data) // Debug log

        if (
          data?.data?.latitude &&
          data?.data?.longitude &&
          data.data.latitude !== "string" &&
          data.data.longitude !== "string"
        ) {
          setMapCenter([Number.parseFloat(data.data.latitude), Number.parseFloat(data.data.longitude)])
          setZoom(12)
        }
      } catch (err) {
        console.error("Failed to fetch driver location", err)
        setError("Failed to load driver location")
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [driverId, L, mapComponents])

  if (!L || !mapComponents || loading) return <Loader />
  if (error) return <p className="text-red-500">{error}</p>
  if (!location || !location.data) return <p className="text-gray-600">Location not found.</p>

  // Safe access to nested properties
  const locationData = location.data
  const driver = locationData.driver
  const user = driver?.user

  const hasValidCoordinates =
    locationData.latitude &&
    locationData.longitude &&
    locationData.latitude !== "string" &&
    locationData.longitude !== "string"

  const { MapContainer, TileLayer, Marker, Popup } = mapComponents

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Driver Location Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {hasValidCoordinates ? (
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
              <Marker position={mapCenter}>
                <Popup>
                  <div className="p-2">
                    <p>
                      <strong>Driver:</strong> {driver?.first_name || "N/A"} {driver?.last_name || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {user?.phone_number || "N/A"}
                    </p>
                    <p>
                      <strong>Location:</strong> {Number.parseFloat(locationData.latitude).toFixed(4)},{" "}
                      {Number.parseFloat(locationData.longitude).toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="lg:col-span-2 h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-600">No valid coordinates available for this driver</p>
          </div>
        )}

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Driver Information</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {/* Safe access with fallbacks */}
              <p className="text-gray-800">
                <strong>Name:</strong> {driver?.first_name || "N/A"} {driver?.other_name || ""}{" "}
                {driver?.last_name || "N/A"}
              </p>

              <p className="text-gray-800">
                <strong>License Number:</strong> {driver?.license_number || "N/A"}
              </p>

              <p className="text-gray-800">
                <strong>Status:</strong> {driver?.status || "N/A"}
              </p>

              <p className="text-gray-800">
                <strong>Phone:</strong> {user?.phone_number || "N/A"}
              </p>

              <p className="text-gray-800">
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>

              <p className="text-gray-800">
                <strong>Address:</strong> {user?.address || "N/A"}, {user?.city || "N/A"}, {user?.state || "N/A"},{" "}
                {user?.country || "N/A"}
              </p>

              {hasValidCoordinates ? (
                <p className="text-gray-800">
                  <strong>Location:</strong> {Number.parseFloat(locationData.latitude).toFixed(4)},{" "}
                  {Number.parseFloat(locationData.longitude).toFixed(4)}
                </p>
              ) : (
                <p className="text-yellow-600">No valid coordinates available</p>
              )}

              <p className="text-gray-800">
                <strong>Last Updated:</strong>{" "}
                {locationData.updated_at ? new Date(locationData.updated_at).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function SingleDriverLocationPage({ params }: PageProps) {
  return <SingleDriverMapComponent params={params} />
}
