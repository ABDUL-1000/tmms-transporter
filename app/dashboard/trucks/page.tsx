"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, History, MessageSquare, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Truck, Driver } from "@/lib/types";
import { cn } from "@/lib/utils";
import TruckForm from "@/components/truck-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import api from "@/lib/API/axios";
import Loader from "@/components/Loader";

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

    const fetchTrucks = async () => {
    try {
      const res = await api.get("/transporters/trucks");
      if (res.data.success) {
        setTrucks(res.data.data);
      }
      if (loading) {
        <Loader />;
      }
    } catch (err) {
      console.error("Failed to fetch drivers", err);
    } finally {
       setLoading(false),
       setTimeout(() => setLoading(false), 500);
    }
    
  };

  // Load drivers from local or your existing source
  useEffect(() => {
    fetchTrucks();
    // You can optionally fetch trucks similarly here if needed
  }, []);

  const handleDeleteTruck = (truckId: string) => {
    setTrucks(trucks.filter((truck) => truck.id !== truckId));
  };

  // const getDriverName = (driverId: string | null) => {
  //   if (!driverId) return "Unassigned"
  //   const driver = drivers.find((d) => d.id === driverId)
  //   return driver ? driver.name : "Unknown Driver"
  // }
 const formatStatus = (status: string) =>
    status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "moving":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      case "idle":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {loading ? (
        <Loader />
      ) : (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Trucks</h1>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingTruck(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Trucks
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingTruck ? "Edit Driver" : "Add New Driver"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTruck
                      ? "Update the driver details below."
                      : "Enter the details for the new driver."}
                  </DialogDescription>
                </DialogHeader>
                <TruckForm
                  onSuccess={() => {
                    fetchTrucks(); // refresh table data without reload
                    setIsFormOpen(false); // close the form dialog
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search drivers..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                    pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("moving")}>
                    moving
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("delivered")}
                  >
                    delivered
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Tabs
              defaultValue="grid"
              className="w-full md:w-auto"
              onValueChange={(value) => setViewType(value as "grid" | "list")}
            >
              <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewType === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trucks.map((truck) => (
                <Card key={truck.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                       {truck.name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(getStatusBadgeClass(truck.status))}
                      >
                        {formatStatus(truck.status)}
                      </Badge>
                    </div>
                    <CardDescription>ID: {truck.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {/* <p>Phone: {driver.data.phone_number}</p>
                  <p>Email: {driver.data.email}</p> */}
                    <p>License: {}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/40 p-4 font-medium">
                <div className="col-span-4">Driver</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">Moving status</div>
               
                <div className="col-span-2 flex justify-end">Action</div>
              </div>
              {trucks.map((truck) => (
                <div
                  key={truck.id}
                  className="grid grid-cols-12 items-center border-b p-4"
                >
                  <div className="col-span-4">
                    <div className="font-medium">
                    {truck.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {truck.id}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <Badge
                      variant="outline"
                      className={cn(getStatusBadgeClass(truck.status))}
                    >
                      {formatStatus(truck.status)}
                    </Badge>
                  </div>
                  <div className="col-span-3">
                    {" "}
                    <Badge
                      variant="outline"
                      className={cn(getStatusBadgeClass(truck.status))}
                    >
                      {formatStatus(truck.status)}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                         
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                         
                        >
                          <History className="mr-2 h-4 w-4" />
                          View Driver
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
