"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Truck, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default function FleetOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Fleet Status</CardTitle>
          <CardDescription>Overview of your fleet's current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Active Trucks</span>
                </div>
                <span className="font-medium">12/24</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Assigned Trucks</span>
                </div>
                <span className="font-medium">16/24</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Maintenance Required</span>
                </div>
                <span className="font-medium">3/24</span>
              </div>
              <Progress value={12.5} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Idle Trucks</span>
                </div>
                <span className="font-medium">8/24</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Driver Allocation</CardTitle>
          <CardDescription>Current driver assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">On Duty (12)</span>
              </div>
              <span className="text-sm font-medium">67%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-sm">Off Duty (4)</span>
              </div>
              <span className="text-sm font-medium">22%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm">On Leave (2)</span>
              </div>
              <span className="text-sm font-medium">11%</span>
            </div>
            <div className="mt-4 h-[150px] w-full">
              <div className="flex h-full items-end">
                <div className="flex-1 bg-green-500 h-[67%] rounded-t-sm" />
                <div className="flex-1 bg-yellow-500 h-[22%] rounded-t-sm ml-1" />
                <div className="flex-1 bg-red-500 h-[11%] rounded-t-sm ml-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
