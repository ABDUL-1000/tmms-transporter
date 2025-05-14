import type { Truck } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TruckListProps {
  trucks: Truck[]
}

export default function TruckList({ trucks }: TruckListProps) {
  return (
    <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
      {trucks.length === 0 ? (
        <p className="text-center text-muted-foreground">No trucks match the current filter</p>
      ) : (
        trucks.map((truck) => (
          <div key={truck.id} className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{truck.name}</div>
              <Badge
                variant="outline"
                className={cn(
                  truck.status === "moving"
                    ? "bg-green-100 text-green-800"
                    : truck.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : truck.status === "maintenance"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800",
                )}
              >
                {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {truck.driverId ? <p>Driver ID: {truck.driverId}</p> : <p>No driver assigned</p>}
              {truck.route && (
                <>
                  <p className="mt-1">From: {truck.route.originName}</p>
                  <p>To: {truck.route.destinationName}</p>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
