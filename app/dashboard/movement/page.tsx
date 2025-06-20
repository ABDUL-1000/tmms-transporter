"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { fetchDriverLocations } from "@/lib/API/api";


// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  // iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/285659_marker_map_icon.png",
  shadowUrl: "/285659_marker_map_icon.png",
});

interface DriverLocation {
  id: number;
  latitude: string;
  longitude: string;
  driver: {
    id: number;
    first_name: string;
    last_name: string;
    other_name: string;
    user: {
      phone_number: string;
    };
  };
}

const AllTrucksMapPage = () => {
  const [driverLocations, setDriverLocations] = useState<DriverLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([9.05785, 7.49508]);
  const [zoom, setZoom] = useState(6);

  const router = useRouter();

  const fetchLocations = async () => {
    try {
      const response = await fetchDriverLocations();
      if (response.success) {
        // Filter out locations with invalid coordinates
        const validLocations = response.data.filter(
          (location: any) => 
            location.latitude && 
            location.longitude && 
            location.latitude !== "string" && 
            location.longitude !== "string"
        );
        
        setDriverLocations(validLocations);

        if (validLocations.length > 0) {
          const bounds = L.latLngBounds(
            validLocations.map(location => [
              parseFloat(location.latitude), 
              parseFloat(location.longitude)
            ])
          );
          const center = bounds.getCenter();
          setMapCenter([center.lat, center.lng]); // Fixed here
          setZoom(8);
        }
      }
    } catch (err) {
      console.error("Failed to fetch driver locations", err);
      setError("Failed to load driver locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDriverClick = (driverId: number) => {
    router.push(`/dashboard/movement/${driverId}`);
  };

  if (typeof window === "undefined") {
    return <Loader />;
  }

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (driverLocations.length === 0) return <p className="text-gray-600">No driver locations available.</p>;

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
                position={[
                  parseFloat(location.latitude), 
                  parseFloat(location.longitude)
                ]}
                eventHandlers={{
                  click: () => handleDriverClick(location.driver.id),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <p><strong>Driver:</strong> {location.driver.first_name} {location.driver.last_name}</p>
                    <p><strong>Phone:</strong> {location.driver.user.phone_number}</p>
                    <p><strong>Location:</strong> {parseFloat(location.latitude).toFixed(4)}, {parseFloat(location.longitude).toFixed(4)}</p>
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
                onClick={() => handleDriverClick(location.driver.id)}
              >
                <p className="text-gray-800"><strong>Driver:</strong> {location.driver.first_name} {location.driver.other_name} {location.driver.last_name}</p>
                <p className="text-gray-800"><strong>Phone:</strong> {location.driver.user.phone_number}</p>
                <p className="text-gray-800"><strong>Location:</strong> {parseFloat(location.latitude).toFixed(4)}, {parseFloat(location.longitude).toFixed(4)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTrucksMapPage;