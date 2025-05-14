import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, MapPin, Users, AlertTriangle } from "lucide-react"

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "location",
      message: "Truck T-103 arrived at destination",
      time: "10 minutes ago",
      icon: <MapPin className="h-4 w-4" />,
      color: "bg-green-500",
    },
    {
      id: 2,
      type: "assignment",
      message: "Driver John D. assigned to Truck T-105",
      time: "25 minutes ago",
      icon: <Users className="h-4 w-4" />,
      color: "bg-blue-500",
    },
    {
      id: 3,
      type: "departure",
      message: "Truck T-108 departed from warehouse",
      time: "1 hour ago",
      icon: <Truck className="h-4 w-4" />,
      color: "bg-purple-500",
    },
    {
      id: 4,
      type: "alert",
      message: "Truck T-102 reported maintenance issue",
      time: "2 hours ago",
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "bg-yellow-500",
    },
    {
      id: 5,
      type: "location",
      message: "Truck T-110 reached checkpoint",
      time: "3 hours ago",
      icon: <MapPin className="h-4 w-4" />,
      color: "bg-green-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your fleet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div className="flex items-start" key={activity.id}>
              <div className={`${activity.color} mr-4 rounded-full p-2 text-white`}>{activity.icon}</div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.message}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
