"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { SingleDriverLocationResponse } from "@/lib/types";
import { fetchSingleDriverLocation } from "@/lib/API/api";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

const SingleDriverLocationPage = ({ params }: { params: { id: string } }) => {
  const [location, setLocation] = useState<SingleDriverLocationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([9.05785, 7.49508]);
  const [zoom, setZoom] = useState(6);

  const router = useRouter();
  const locationId = parseInt(params.id);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await fetchSingleDriverLocation(locationId);
        setLocation(data);
        console.log(data);
        
        // Only set map center if coordinates are valid numbers
        if (data.data.latitude && data.data.longitude && 
            data.data.latitude !== "string" && data.data.longitude !== "string") {
          setMapCenter([
            parseFloat(data.data.latitude),
            parseFloat(data.data.longitude)
          ]);
          setZoom(12); // Zoom in closer for single location
        }
      } catch (err) {
        console.error("Failed to fetch driver location", err);
        setError("Failed to load driver location");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [locationId]);

  if (typeof window === "undefined") {
    return <Loader />;
  }

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!location) return <p className="text-gray-600">Location not found.</p>;

  const hasValidCoordinates = location.data.latitude && location.data.longitude && 
                            location.data.latitude !== "string" && 
                            location.data.longitude !== "string";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Driver Location Details</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section - Only show if coordinates are valid */}
        {hasValidCoordinates && (
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
              <Marker 
                position={mapCenter}
              >
                <Popup>
                  <div className="p-2">
                    <p><strong>Driver:</strong> {location.data.driver.first_name} {location.data.driver.last_name}</p>
                    <p><strong>Phone:</strong> {location.data.driver.user.phone_number}</p>
                    <p><strong>Location:</strong> {parseFloat(location.data.latitude).toFixed(4)}, {parseFloat(location.data.longitude).toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Driver Details */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Driver Information</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-800"><strong>Name:</strong> {location.data.driver.first_name} {location.data.driver.other_name} {location.data.driver.last_name}</p>
              <p className="text-gray-800"><strong>License Number:</strong> {location.data.driver.license_number}</p>
              <p className="text-gray-800"><strong>Status:</strong> {location.data.driver.status}</p>
              <p className="text-gray-800"><strong>Phone:</strong> {location.data.driver.user.phone_number}</p>
              <p className="text-gray-800"><strong>Email:</strong> {location.data.driver.user.email}</p>
              <p className="text-gray-800"><strong>Address:</strong> {location.data.driver.user.address}, {location.data.driver.user.city}, {location.data.driver.user.state}, {location.data.driver.user.country}</p>
              
              {hasValidCoordinates ? (
                <p className="text-gray-800">
                  <strong>Location:</strong> {parseFloat(location.data.latitude).toFixed(4)}, {parseFloat(location.data.longitude).toFixed(4)}
                </p>
              ) : (
                <p className="text-yellow-600">No valid coordinates available</p>
              )}
              
              <p className="text-gray-800"><strong>Last Updated:</strong> {new Date(location.data.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleDriverLocationPage;