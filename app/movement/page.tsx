"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TransportMap from "@/components/transport-map"
import TruckList from "@/components/truck-list"
import { getTrucks } from "@/lib/data"
import type { Truck } from "@/lib/types"

export default function MovementPage() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [filter, setFilter] = useState<"all" | "moving" | "pending" | "assigned">("all")

  useEffect(() => {
    // In a real app, this would fetch from an API
    const data = getTrucks()
    setTrucks(data)
  }, [])

  const filteredTrucks = trucks.filter((truck) => {
    if (filter === "all") return true
    if (filter === "moving") return truck.status === "moving"
    if (filter === "pending") return truck.status === "pending"
    if (filter === "assigned") return truck.driverId !== null
    return true
  })

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Fleet Movement</CardTitle>
              <CardDescription>Real-time location of your trucks</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as any)}>
                <div className="px-4 pt-2">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="moving">Moving</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="assigned">Assigned</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="all" className="mt-0">
                  <div className="h-[600px] w-full">
                    <TransportMap trucks={filteredTrucks} />
                  </div>
                </TabsContent>
                <TabsContent value="moving" className="mt-0">
                  <div className="h-[600px] w-full">
                    <TransportMap trucks={filteredTrucks} />
                  </div>
                </TabsContent>
                <TabsContent value="pending" className="mt-0">
                  <div className="h-[600px] w-full">
                    <TransportMap trucks={filteredTrucks} />
                  </div>
                </TabsContent>
                <TabsContent value="assigned" className="mt-0">
                  <div className="h-[600px] w-full">
                    <TransportMap trucks={filteredTrucks} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Truck Details</CardTitle>
              <CardDescription>
                {filteredTrucks.length} trucks {filter !== "all" ? `(${filter})` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TruckList trucks={filteredTrucks} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
