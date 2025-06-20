"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MapPin, Truck, Users, Calendar, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Drivers Locations",
      path: "/dashboard/movement",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      name: "Trucks",
      path: "/dashboard/trucks",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      name: "Drivers",
      path: "/dashboard/drivers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Schedule",
      path: "/schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-background transition-transform duration-200 ease-in-out border-r",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Truck className="h-6 w-6" />
            <span>TransportHub</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="space-y-1 px-2">
            {routes.map((route) => (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === route.path ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {route.icon}
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
