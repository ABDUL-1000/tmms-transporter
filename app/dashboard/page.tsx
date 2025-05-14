import { Truck, Users, TruckIcon, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StatsCard from "@/components/stats-card"
import RecentActivity from "@/components/recent-activity"
import FleetOverview from "@/components/fleet-overview"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Trucks"
            value="24"
            description="+2 from last month"
            icon={<Truck className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Total Drivers"
            value="18"
            description="+3 from last month"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Moving Trucks"
            value="12"
            description="50% of fleet active"
            icon={<TruckIcon className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Assigned Trucks"
            value="16"
            description="67% of fleet assigned"
            icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Fleet Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <FleetOverview />
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <RecentActivity />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
