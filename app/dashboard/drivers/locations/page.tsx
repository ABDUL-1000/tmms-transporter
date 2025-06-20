// "use client"

// import { useState } from "react"

// import { Card, CardContent } from "@/components/ui/card"
// import { MapPin } from "lucide-react"
// import { DriverLocation } from "@/lib/types"
// import DriverLocationMap from "../../movement/page"

// export default function DriverLocationsPage() {
//   const [selectedDriver, setSelectedDriver] = useState<DriverLocation | null>(null)

//   const handleDriverSelect = (driver: DriverLocation) => {
//     setSelectedDriver(driver)
//   }

//   return (
//     <div className="flex min-h-screen w-full flex-col">
//       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-lg font-semibold md:text-2xl flex items-center gap-2">
//               <MapPin className="h-6 w-6" />
//               Driver Locations
//             </h1>
//             <p className="text-muted-foreground">Track and monitor driver locations in real-time</p>
//           </div>
//         </div>

//         <Card>
//           <CardContent className="p-6">
//             <DriverLocationMap selectedDriverId={selectedDriver?.driver_id} onDriverSelect={handleDriverSelect} />
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   )
// }
